<?php

namespace Grids\Core\Utils;

use Grids\Core\Utils\Exception as Exception;

/* Check that we're running this file from the plugin. */
if ( ! defined( 'GRIDS' ) ) die( 'Forbidden' );

/**
 * Grids asset class.
 *
 * @since 1.0.0
 */
class Asset {

	/**
	 * Asset global identifier.
	 *
	 * @var string
	 */
	private static $_identifier = 'grids';

	/**
	 * Resolve the name of the asset.
	 *
	 * @since 1.0.0
	 * @param string $name The name of the asset.
	 * @return string
	 */
	public static function get_name( $name ) {
		return self::$_identifier . '-' . $name;
	}

	/**
	 * Get the path of an asset file.
	 *
	 * @since 1.0.0
	 * @param string $url URL of the asset file, relative to the plugin base URL.
	 * @param string $name Name of the asset file.
	 * @return string
	 */
	public static function get_path( $url, $name ) {
		$file_path = GRIDS_FOLDER . $url;

		if ( ! file_exists( $file_path ) ) {
			throw new Exception( "$name asset: file not found." );
		}

		return $file_path;
	}

	/**
	 * Get the version of an asset file.
	 *
	 * @since 1.0.0
	 * @param string $file_path Asset file path.
	 * @param string $version Version of the asset file.
	 * @return string
	 */
	public static function get_version( $file_path, $version = null ) {
		if ( ! $version ) {
			$version = SCRIPT_DEBUG ? filemtime( $file_path ) : GRIDS_VERSION;
		}

		return $version;
	}

	/**
	 * Get the URL of an asset file.
	 *
	 * @since 1.0.0
	 * @param string $file_path Asset file path.
	 * @return string
	 */
	public static function get_url( $file_path ) {
		$ext = pathinfo( $file_path, PATHINFO_EXTENSION );
		$file_path = str_replace( GRIDS_FOLDER, '', $file_path );
		$file_path = rtrim( $file_path, $ext );
		$file_path .= $ext;

		return $file_path;
	}

	/**
	 * Wrap a call to the 'wp_register_script' function prepending the global namespace of the plugin.
	 *
	 * @since 1.0.0
	 * @param string $name Name of the script.
	 * @param string $url URL of the script, relative to the plugin base URL.
	 * @param array $deps Array of script dependencies.
	 * @param string $version Script version.
	 * @param string $textdomain The script text domain.
	 * @return mixed
	 */
	public static function register_script( $name, $url, $deps = array(), $version = null, $textdomain = null ) {
		$file_path = self::get_path( $url, $name );
		$version   = self::get_version( $file_path, $version );
		$url       = self::get_url( $file_path );
		$name      = self::get_name( $name );

		wp_register_script(
			$name,
			GRIDS_URI . $url,
			$deps,
			$version
		);

		if ( $textdomain && function_exists( 'wp_set_script_translations' ) ) {
			wp_set_script_translations( $name, $textdomain );
		}
	}

	/**
	 * Wrap a call to the 'wp_register_style' function prepending the global namespace of the plugin.
	 *
	 * @since 1.0.0
	 * @param string $name Name of the stylesheet.
	 * @param string $url URL of the stylesheet, relative to the plugin base URL.
	 * @param array $deps Array of stylesheet dependencies.
	 * @param string $version Stylesheet version.
	 * @return mixed
	 */
	public static function register_style( $name, $url, $deps = array(), $version = null ) {
		$file_path = self::get_path( $url, $name );
		$version   = self::get_version( $file_path, $version );
		$url       = self::get_url( $file_path );

		wp_register_style(
			self::get_name( $name ),
			GRIDS_URI . $url,
			$deps,
			$version
		);
	}

	/**
	 * Wrap a call to the 'wp_enqueue_script' function prepending the global namespace of the plugin.
	 *
	 * @since 1.0.0
	 * @param string $name Name of the script.
	 */
	public static function enqueue_script( $name ) {
		wp_enqueue_script( self::get_name( $name ) );
	}

	/**
	 * Wrap a call to the 'wp_enqueue_style' function prepending the global namespace of the plugin.
	 *
	 * @since 1.0.0
	 * @param string $name Name of the stylesheet.
	 */
	public static function enqueue_style( $name ) {
		wp_enqueue_style( self::get_name( $name ) );
	}

	/**
	 * Wrap a call to the 'wp_localize_script' function prepending the global namespace of the plugin.
	 *
	 * @since 1.0.0
	 * @param string $name Name of the script.
	 * @param string $object_name Name of the root object.
	 * @param array $data Data array.
	 */
	public static function localize_script( $name, $object_name, $data ) {
		wp_localize_script( self::get_name( $name ), $object_name, $data );
	}

	/**
	 * Wrap a call to the 'wp_add_inline_style' function prepending the global namespace of the plugin.
	 *
	 * @since 1.0.0
	 * @param string $name Name of the stylesheet.
	 * @param string $style The stylesheet contents.
	 */
	public static function add_inline_style( $name, $style ) {
		wp_add_inline_style( self::get_name( $name ), $style );
	}

}
