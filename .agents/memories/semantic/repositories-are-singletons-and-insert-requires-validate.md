---
type: semantic
tags: [repositories, entities, validation, persistence, hooks, extensions]
created: 2026-11-08
updated: 2026-11-08
source: investigation
confidence: high
status: active
related: [semantic/tainacan-insert-also-fires-for-log-entities]
---

# Repositories are private-constructor singletons and `insert()` throws unless the entity was validated

Two invariants of the persistence layer that extensions hit first:

1. **No `new Repository`.** Repositories use the `Singleton_Instance` trait: the
   constructor is `private` and calls `init()`, so the only entry point is
   `\Tainacan\Repositories\<Name>::get_instance()`. `new \Tainacan\Repositories\Items()`
   is a fatal "Call to private ... __construct()".
2. **`validate()` before `insert()`/`update()`.** `Repository::insert()` throws
   `\Exception('Entities must be validated before you can save them')` when the
   entity's status is in `['publish', 'future', 'private', 'pending']` (list
   filterable through `tainacan-status-require-validation`) and
   `$obj->get_validated()` is false. Drafts (`draft`, `auto-draft`) can be
   saved without validation. `Item_Metadata::insert()` is stricter and requires
   validation regardless of status.

Around the write, `insert()` fires `tainacan-pre-insert` and
`tainacan-pre-insert-<post_type>` with the entity, then `tainacan-insert`
(`$obj, $diffs, $is_update`) and `tainacan-insert-<post_type>`, and finally
**returns a new entity instance** built from the saved `WP_Post`; keep that
return value rather than the object you passed in. Callbacks on those actions
receive an `Entity` as the first argument (and sometimes a `Log`, see the
related memory), so a scalar type hint on that parameter throws a `TypeError`
inside the save.

**Evidence:** `tainacan/src/classes/traits/class-tainacan-singleton-instance.php:12-29`
(trait: `get_instance()` :16-21, `private function __construct()` :23-28);
`tainacan/src/classes/repositories/class-tainacan-repository.php:161-166`
(`insert()` signature at :161, status list :164, `throw` at :166), `:173-176`
(`tainacan-pre-insert*`), `:238-241` (`tainacan-insert*`), `:244`
(`return new $this->entities_type( $obj->WP_Post )`);
`tainacan/src/classes/repositories/class-tainacan-item-metadata.php:30-34`
(unconditional validation check). Checked on `upstream/develop` (plugin header 1.4.1).
**Verify by:** `grep -n "must be validated\|tainacan-status-require-validation\|return new \$this->entities_type" tainacan/src/classes/repositories/class-tainacan-repository.php tainacan/src/classes/repositories/class-tainacan-item-metadata.php`.
