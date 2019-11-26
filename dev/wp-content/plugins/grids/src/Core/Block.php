<?php

namespace Grids\Core;

use Grids\Core\Utils\Exception as Exception;
use Grids\Core\Utils\Asset as Asset;

/* Check that we're running this file from the plugin. */
if ( ! defined( 'GRIDS' ) ) die( 'Forbidden' );

/**
 * Grids block class.
 *
 * @since 1.0.0
 */
abstract class Block {

	/**
	 * Class constructor.
	 *
	 * @since 1.0.0
	 * @param string $type The name of the block.
	 * @param array $params Block configuration parameters.
	 */
	public function __construct( $type, $params ) {
		if ( empty( $type ) ) {
			throw new Exception( 'Empty block name.' );
		}

		$editor_script = null;
		$editor_style = null;

		if ( isset( $params[ 'editor_script' ] ) ) {
			if ( ! isset( $params[ 'editor_script' ][ 'src' ] ) || empty( $params[ 'editor_script' ][ 'src' ] ) ) {
				throw new Exception( "$type block: editor script source not present." );
			}

			$editor_script = $type . '-editor-script';
		}

		if ( isset( $params[ 'editor_style' ] ) ) {
			if ( ! isset( $params[ 'editor_style' ][ 'src' ] ) || empty( $params[ 'editor_style' ][ 'src' ] ) ) {
				throw new Exception( "$type block: editor style source not present." );
			}

			$editor_style = $type . '-editor-style';
		}

		if ( null !== $editor_script ) {
			Asset::register_script(
				$editor_script,
				$params[ 'editor_script' ][ 'src' ],
				array(
					'jquery',
					Asset::get_name( 'components' ),
					'wp-blocks',
					'wp-element',
					'wp-components',
					'wp-editor'
				)
			);

			$params[ 'editor_script' ] = Asset::get_name( $editor_script );
		}

		if ( null !== $editor_style ) {
			Asset::register_style(
				$editor_style,
				$params[ 'editor_style' ][ 'src' ]
			);

			$params[ 'editor_style' ] = Asset::get_name( $editor_style );
		}

		return $params;
	}

}
