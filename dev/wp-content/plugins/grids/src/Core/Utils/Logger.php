<?php

namespace Grids\Core\Utils;

/* Check that we're running this file from the plugin. */
if ( ! defined( 'GRIDS' ) ) die( 'Forbidden' );

/**
 * Grids logger class.
 *
 * @since 1.0.0
 */
class Logger {

	/**
	 * Logger global identifier.
	 *
	 * @var string
	 */
	private static $_identifier = 'Grids';

	/**
	 * Add a message to the system log.
	 *
	 * @since 1.0.0
	 * @param string $message The log message.
	 */
	public static function log( $message ) {
		error_log( '[' . self::$_identifier . ']: ' . $message );
	}

	/**
	 * Print a message to video.
	 *
	 * @since 1.0.0
	 * @param string $message The log message.
	 */
	public static function print( $message ) {
		echo esc_html( $message );
	}

	/**
	 * Print and format a message to video.
	 *
	 * @since 1.0.0
	 * @param string $message The log message.
	 */
	public static function print_r( $message ) {
		echo '<pre>' . print_r( $message, true ) . '</pre>';
	}

}
