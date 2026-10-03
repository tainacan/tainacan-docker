gi# Tainacan local development stack.
#
# Every workflow lives here. There are no shell scripts at all; everything is a
# Make target.
#
# `make up` starts three containers: db, wordpress (php-fpm) and nginx. The
# `builder` service is profile-gated and only runs for assets and tests.

SHELL := /bin/bash

COMPOSE         ?= docker compose
COMPOSE_ELASTIC := -f docker-compose.yml -f docker-compose.elastic.yml

# Load .env so the Makefile and the recipes see the same values as Compose.
-include .env
export

WP_SITE_URL       ?= http://localhost:8080
WP_TITLE          ?= Tainacan Dev
WP_ADMIN_USER     ?= tainacan
WP_ADMIN_PASSWORD ?= tainacan
WP_ADMIN_EMAIL    ?= tainacan@local.test
DB_NAME           ?= tainacan
DB_USER           ?= tainacan
DB_PASSWORD       ?= tainacan
DB_ROOT_PASSWORD  ?= tainacan

# WP-CLI runs inside the already-running wordpress container as www-data, so
# anything it writes (wp-config.php) stays owned by the web user.
WP    := $(COMPOSE) exec -T -u 33 wordpress wp
WATCH := $(COMPOSE) --profile watch

.DEFAULT_GOAL := help

.PHONY: help env submodules config ps up up-elastic down reset restart logs \
        shell db-shell wp assets assets-prod watch setup harden test guard \
        docs-serve docs-build

help: ## Show this help
	@grep -hE '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-14s\033[0m %s\n", $$1, $$2}'

env: ## Create .env from .env.example when missing
	@test -f .env || (cp .env.example .env && echo "Created .env from .env.example")

submodules: ## Initialise and update the tainacan submodule
	git submodule update --init --recursive

config: env ## Generate the plugin build-config.cfg (gitignored upstream)
	@printf 'wp_base_dir=/var/www/html\nwp_url=%s\nwp_plugin_dir=/tmp/tainacan-dist\n' "$(WP_SITE_URL)" > tainacan/build-config.cfg

ps: ## Show container status
	$(COMPOSE) ps

up: env ## Start the database, WordPress and nginx
	$(COMPOSE) up -d db wordpress nginx

up-elastic: env ## Start database, WordPress, nginx and Elasticsearch
	@echo "Elasticsearch needs vm.max_map_count >= 262144 on the Docker host."
	@echo "On Linux: sudo sysctl -w vm.max_map_count=262144"
	$(COMPOSE) $(COMPOSE_ELASTIC) up -d db wordpress nginx elasticsearch

down: ## Stop all containers for this project
	$(COMPOSE) down --remove-orphans

reset: ## Stop containers and delete the database and WordPress volumes
	$(COMPOSE) down -v --remove-orphans

restart: ## Restart the WordPress and nginx containers
	$(COMPOSE) restart wordpress nginx

logs: ## Follow the WordPress and nginx logs
	$(COMPOSE) logs -f wordpress nginx

shell: ## Open a shell in the WordPress container
	$(COMPOSE) exec wordpress bash

db-shell: ## Open a MariaDB shell on the application database
	$(COMPOSE) exec db mariadb -u"$(DB_USER)" -p"$(DB_PASSWORD)" "$(DB_NAME)"

wp: ## Run a wp-cli command, e.g. make wp ARGS="plugin list"
	$(WP) $(ARGS)

assets: config ## Compile plugin assets once (development)
	@$(WATCH) build builder
	@$(WATCH) run --rm --no-deps builder ./build.sh

assets-prod: config ## Compile plugin assets once (production)
	@$(WATCH) build builder
	@$(WATCH) run --rm --no-deps builder ./build.sh --prod

watch: config ## Rebuild plugin assets when sources change (polling, macOS-safe)
	$(WATCH) up builder

setup: env config assets up ## First run: build assets, start the stack, install WordPress
	@echo ">> Waiting for WordPress to be ready..."
	@until $(WP) core version >/dev/null 2>&1; do sleep 2; done
	@if $(WP) core is-installed >/dev/null 2>&1; then \
		echo ">> WordPress already installed"; \
	else \
		echo ">> Installing WordPress"; \
		$(WP) core install \
			--url="$(WP_SITE_URL)" \
			--title="$(WP_TITLE)" \
			--admin_user="$(WP_ADMIN_USER)" \
			--admin_password="$(WP_ADMIN_PASSWORD)" \
			--admin_email="$(WP_ADMIN_EMAIL)" \
			--skip-check; \
	fi
	@$(WP) config set WP_HOME "$(WP_SITE_URL)"
	@$(WP) config set WP_SITEURL "$(WP_SITE_URL)"
	@$(WP) plugin activate tainacan || true
	@$(WP) rewrite structure '/%postname%/'
	@$(WP) rewrite flush
	@$(WP) config set AUTOMATIC_UPDATER_DISABLED true --raw
	@$(WP) config set WP_AUTO_UPDATE_CORE false --raw
	@$(WP) config set DISALLOW_FILE_EDIT true --raw

harden: env ## Also block every plugin/theme install from inside WordPress
	$(WP) config set DISALLOW_FILE_MODS true --raw

test: config assets up ## Run the plugin PHPUnit suite in the builder image
	@test -f tainacan/tests/bootstrap-config.php || cp tainacan/tests/bootstrap-config-sample.php tainacan/tests/bootstrap-config.php
	$(WATCH) run --rm --no-deps \
		-e WP_TESTS_DIR=/tmp/wp-tests/wordpress-tests-lib \
		builder sh -lc './tests/bin/install-wp-tests.sh tainacan_test root "$(DB_ROOT_PASSWORD)" /tmp/wp-tests db:3306 latest && src/vendor/bin/phpunit'

guard: ## Fail when WordPress core files appear inside the Tainacan checkout
	@status=0; \
	for artifact in wp-admin wp-includes wp-content wp-config.php wp-settings.php wp-login.php wp-cron.php xmlrpc.php uploads debug.log .htaccess index.php; do \
		if [ -e "tainacan/$$artifact" ] && ! git -C tainacan ls-files --error-unmatch "$$artifact" >/dev/null 2>&1; then \
			echo "GUARD: unexpected WordPress artifact: tainacan/$$artifact"; \
			status=1; \
		fi; \
	done; \
	if [ $$status -ne 0 ]; then \
		echo "GUARD FAILED: WordPress files must never land in the Tainacan repository."; \
		exit 1; \
	fi; \
	echo "GUARD OK: no WordPress core artifacts found."

docs-serve: ## Serve the documentation site at http://localhost:8000
	docker run --rm -it -p 8000:8000 -v "$(CURDIR):/docs" squidfunk/mkdocs-material:9 serve --dev-addr=0.0.0.0:8000

docs-build: ## Validate the documentation build (strict, output is not kept)
	@docker run --rm -v "$(CURDIR):/docs" squidfunk/mkdocs-material:9 build --strict --site-dir /tmp/mkdocs-site
	@echo "Docs build OK. Use 'make docs-serve' to preview."
