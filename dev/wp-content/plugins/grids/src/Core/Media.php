<?php

namespace Grids\Core;

/* Check that we're running this file from the plugin. */
if ( ! defined( 'GRIDS' ) ) die( 'Forbidden' );

/**
 * Grids Media class.
 *
 * @since 1.0.0
 */
class Media {

	/**
	 * Filter global namespace.
	 *
	 * @var string
	 */
	private static $_namespace = 'grids';

	/**
	 * Get the URL of a Media Library item by its ID.
	 *
	 * @since 1.0.0
	 * @param integer $id The ID of the Media Library item.
	 * @param string $image_size The image size.
	 * @return mixed
	 */
	public static function get_image_by_id( $id, $image_size = 'full' ) {
		if ( ! $id ) {
			return false;
		}

		$src = wp_get_attachment_image_src( $id, $image_size );

		if ( ! empty( $src[ 0 ] ) ) {
			return $src[ 0 ];
		}

		return false;
	}

	/**
	 * Get the URL of a Media Library item by its ID.
	 *
	 * @since 1.0.0
	 */
	public static function fetch_image_by_id() {
		$id = isset( $_GET[ 'id' ] ) ? sanitize_text_field( $_GET[ 'id' ] ) : false;
		$image_size = isset( $_GET[ 'image_size' ] ) ? sanitize_text_field( $_GET[ 'image_size' ] ) : 'full';

		die( self::get_image_by_id( $id, $image_size ) );
	}

}
