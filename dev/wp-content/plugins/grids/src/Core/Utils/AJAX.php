<?php

namespace Grids\Core\Utils;

/* Check that we're running this file from the plugin. */
if ( ! defined( 'GRIDS' ) ) die( 'Forbidden' );

/**
 * Grids AJAX class.
 *
 * @since 1.0.0
 */
class AJAX {

	/**
	 * Filter global namespace.
	 *
	 * @var string
	 */
	private static $_namespace = 'grids';

	/**
	 * Register an AJAX endpoint.
	 *
	 * @since 1.0.0
	 * @return string
	 */
	public static function register( $name, $callback, $priority = 10, $arguments = 1, $public = false ) {
		$name = self::$_namespace . '_' . $name;

		add_action( 'wp_ajax_' . $name, $callback, $priority, $arguments );

		if ( $public ) {
			add_action( 'wp_ajax_nopriv_' . $name, $callback, $priority, $arguments );
		}
	}

}
