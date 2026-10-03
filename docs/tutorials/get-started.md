# Get started

This tutorial takes you from a fresh clone to a running Tainacan site with a live
PHP edit. Follow it in order; every step works on a machine that has only Docker
Desktop and `make`.

**Time:** about 10 to 15 minutes, mostly downloading dependencies.

## Before you begin

Install Docker Desktop and make sure it is running:

```sh
docker info --format '{{.ServerVersion}}'
```

You also need `git` and `make`.

## 1. Clone with the submodules

```sh
git clone --recurse-submodules <this-repo> tainacan-docker
cd tainacan-docker
```

If you already cloned without submodules, run `make submodules`.

## 2. Create your environment file

```sh
make env
```

This copies `.env.example` to `.env`. The defaults work as-is.

## 3. Run setup

```sh
make setup
```

This builds the plugin assets, starts the containers, installs WordPress,
activates the Tainacan plugin, sets pretty permalinks, and applies the hardening
constants. The first run compiles front-end dependencies, so it is the slow one.

When it finishes, confirm WordPress answers:

```sh
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:8080
```

## 4. Sign in

Open <http://localhost:8080/wp-admin> and sign in with the credentials from
`.env`. The defaults are user `tainacan` and password `tainacan`.

## 5. Make a live PHP edit

Open `tainacan/src/tainacan.php` and find the plugin header. Change the
`Description` line, save, and reload the admin. The Plugins screen shows the new
description immediately: there is no build step for PHP.

Undo your edit when you are satisfied.

## 6. Rebuild an asset

Assets do need a build. In a second terminal:

```sh
make watch
```

Edit any `.scss` file under `tainacan/src/` and save. The watcher reports a change
and recompiles within a couple of seconds.

Stop the watcher with `Ctrl+C` when you are done.

## 7. Stop the stack

```sh
make down
```

Your data survives. To remove it as well, use `make reset`, which deletes the
database and WordPress volumes.

## Where to go next

- Task walkthroughs: [Develop with live reload](../how-to/develop-with-live-reload.md)
- Exact commands: [Make targets](../reference/make-targets.md)
- Why the stack looks like this: [Architecture](../explanation/architecture.md)
