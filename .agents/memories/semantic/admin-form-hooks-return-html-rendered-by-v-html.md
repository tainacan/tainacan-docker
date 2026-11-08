---
type: semantic
tags: [admin, hooks, vue, extensions, admin-hooks, v-html]
created: 2026-11-08
updated: 2026-11-08
source: investigation
confidence: high
status: active
related: []
---

# Admin form hooks run at registration, must return a string, and are rendered with `v-html`

`tainacan_register_admin_hook( $context, $callback, $position = 'end-left', $conditional = null )`
is a thin wrapper over `\Tainacan\Admin_Hooks::register()`. Three facts about
that path shape every extension that adds a panel to an admin form:

1. **Registration time is `admin_init`.** `Admin_Hooks::init()` hooks
   `admin_init` and fires the action `tainacan-register-admin-hooks` there.
   That is the only intended place to call `tainacan_register_admin_hook()`.
   Calling it earlier (plugin load, `init`) depends on plugin load order for the
   function to exist and runs the callback on every request, including REST,
   cron and WP-CLI.
2. **The callback is executed immediately and its return value is what is
   stored.** `register()` validates `$context` against
   `['collection','metadatum','item','taxonomy','term','filter','role','metadataSection']`
   (filter `tainacan-admin-hooks-contexts`, case-sensitive) and `$position`
   against `['begin-left','begin-right','end-left','end-right']`
   (filter `tainacan-admin-hooks-positions`), returns `false` on a miss, then
   calls `call_user_func($callback)` and keeps the result only if
   `is_string($result)`. Anything the callback *prints* goes straight to the
   response (headers already sent, broken REST/AJAX output) and the hook is
   discarded. Capture output with `ob_start()` and return the string.
3. **The HTML is injected client-side with `v-html`.** The registered hooks are
   handed to the admin app as `tainacan_plugin.form_hooks`; the `formHooks`
   mixin joins them per position and the forms render them inside
   `<form class="form-hook-region" v-html="...">`. `v-html` sets `innerHTML`,
   so a `<script>` element in the returned HTML is never executed, with no
   console error. Behaviour belongs in a script enqueued on
   `admin_enqueue_scripts`; the mixin dispatches the DOM event
   `tainacan-<entityName>-hook-reload` on `document` on every Vue update of the
   form, which is the signal to (re)bind to the injected markup.

**Evidence:**
`tainacan/src/views/admin/classes/hooks/admin-hooks-functions.php:8-11` (wrapper);
`tainacan/src/views/admin/classes/hooks/class-tainacan-admin-hooks.php:12-18`
(`admin_init` -> `tainacan-register-admin-hooks`), `:20-26` (contexts and
positions), `:39-60` (`register()`: `call_user_func` at :48, `is_string` gate at
:50);
`tainacan/src/views/class-tainacan-pages.php:389` (`$settings['form_hooks']`);
`tainacan/src/views/admin/js/mixins.js:64-106` (`formHooks` mixin; event name
at :99, dispatch in `updated()` at :103-105);
`tainacan/src/views/admin/components/edition/item-edition-form.vue:649-653`
(`class="form-hook-region" v-html="getBeginLeftForm"`; the same pattern repeats
at :201, :513, :703). Checked on `upstream/develop` (plugin header 1.4.1).
**Verify by:** `grep -n "call_user_func\|is_string\|admin_init" tainacan/src/views/admin/classes/hooks/class-tainacan-admin-hooks.php && grep -rn "form-hook-region" tainacan/src/views/admin/components/edition/*.vue | grep -c v-html`.
