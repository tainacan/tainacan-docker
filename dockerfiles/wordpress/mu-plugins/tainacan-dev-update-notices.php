git remote<?php
/**
 * Plugin Name: Tainacan Dev - Update Notices Off
 * Description: Silences core, plugin and theme update checks so the local development environment never shows "Please update now" nags. Dev-only; never shipped with the plugin.
 * Version: 1.0.1
 * Author: Tainacan dev environment
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/*
 * Short-circuit the site transients the update notices read.
 *
 * Returning a non-false value from a `pre_site_transient_*` filter stops
 * WordPress from running the update HTTP check and from caching a real result.
 * The returned object mirrors the shape core expects for each transient, so
 * `get_core_updates()`, `get_plugin_updates()` and `get_theme_updates()` come
 * back empty without PHP warnings, and `update_nag()` plus the admin update
 * bubbles render nothing.
 *
 * Core auto-updates and file modifications are already disabled by `make setup`
 * (AUTOMATIC_UPDATER_DISABLED, WP_AUTO_UPDATE_CORE, DISALLOW_FILE_EDIT); this
 * only removes the remaining "an update is available" notifications.
 */
add_filter(
	'pre_site_transient_update_core',
	static function () {
		return (object) array(
			'updates'         => array(),
			'translations'    => array(),
			'last_checked'    => time(),
			'version_checked' => get_bloginfo( 'version' ),
		);
	}
);

$tainacan_dev_empty_update_transient = static function () {
	return (object) array(
		'last_checked' => time(),
		'checked'      => array(),
		'response'     => array(),
		'no_update'    => array(),
		'translations' => array(),
	);
};

add_filter( 'pre_site_transient_update_plugins', $tainacan_dev_empty_update_transient );
add_filter( 'pre_site_transient_update_themes', $tainacan_dev_empty_update_transient );
