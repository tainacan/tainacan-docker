<?php

namespace Grids\Core\Utils;

use Grids\Core\Utils\Exception as Exception;

/* Check that we're running this file from the plugin. */
if ( ! defined( 'GRIDS' ) ) die( 'Forbidden' );

/**
 * Grids filter class.
 *
 * @since 1.0.0
 */
class Filter {

	/**
	 * Filter global namespace.
	 *
	 * @var string
	 */
	private static $_namespace = 'grids';

	/**
	 * Wrap a call to the 'apply_filters' function prepending the global namespace of the plugin.
	 *
	 * @since 1.0.0
	 * @return mixed
	 */
	public static function apply() {
		if ( func_num_args() < 2 ) {
			throw new Exception( 'Not enough arguments passed.' );
		}

		$args = func_get_args();
		$args[ 0 ] = self::$_namespace . '/' . $args[ 0 ];

		return call_user_func_array( 'apply_filters', $args );
	}

	/**
	 * Wrap a call to the 'add_filter' function prepending the global namespace of the plugin.
	 *
	 * @since 1.0.0
	 */
	public static function add() {
		$num_args = func_num_args();

		if ( $num_args < 2 || $num_args > 4 ) {
			throw new Exception( 'Wrong number of arguments passed.' );
		}

		$args = func_get_args();
		$args[ 0 ] = self::$_namespace . '/' . $args[ 0 ];

		call_user_func_array( 'add_filter', $args );
	}

	/**
	 * Wrap a call to the 'remove_filter' function prepending the global namespace of the plugin.
	 *
	 * @since 1.0.0
	 */
	public static function remove() {
		$num_args = func_num_args();

		if ( $num_args < 2 || $num_args > 3 ) {
			throw new Exception( 'Wrong number of arguments passed.' );
		}

		$args = func_get_args();
		$args[ 0 ] = self::$_namespace . '/' . $args[ 0 ];

		call_user_func_array( 'remove_filter', $args );
	}

}
