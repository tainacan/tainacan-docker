<?php

namespace Grids\Core\Utils;

/* Check that we're running this file from the plugin. */
if ( ! defined( 'GRIDS' ) ) die( 'Forbidden' );

/**
 * Grids CSS class.
 *
 * @since 1.0.0
 */
class CSS {

	/**
	 * Get the combined spacing value and unit.
	 *
	 * @since 1.2.6
	 * @param string $property The CSS spacing property.
	 * @param string $dir The property direction.
	 * @param array $attributes The block attributes.
	 * @param string $breakpoint The breakpoint key.
	 * @return string
	 */
	public static function get_spacing( $property, $dir, $attributes, $breakpoint ) {
		$value = isset( $attributes[ $property . '_' . $breakpoint . '_' . $dir ] ) && ! empty( $attributes[ $property . '_' . $breakpoint . '_' . $dir ] ) ? $attributes[ $property . '_' . $breakpoint . '_' . $dir ] : '0';
		$unit = isset( $attributes[ $property . '_' . $breakpoint . '_' . $dir . '_unit' ] ) && ! empty( $attributes[ $property . '_' . $breakpoint . '_' . $dir . '_unit' ] ) ? $attributes[ $property . '_' . $breakpoint . '_' . $dir . '_unit' ] : 'px';

		return $value . $unit;
	}

	/**
	 * Return display rules, depending on a given breakpoint.
	 *
	 * @since 1.0.0
	 * @param string $breakpoint The breakpoint key.
	 * @param array $attributes The block attributes.
	 * @param array $defaults The CSS defaults.
	 * @return string
	 */
	public static function display_rules( $breakpoint, $attributes, $defaults ) {
		$display = '';

		if ( isset( $attributes[ $breakpoint . '_display' ] ) ) {
			$display .= 'display:none !important;';
		}
		elseif ( isset( $defaults[ 'display' ] ) ) {
			$display .= 'display:' . $defaults[ 'display' ] . ' !important;';
		}

		if ( isset( $attributes[ $breakpoint . '_zIndex' ] ) ) {
			$display .= 'z-index:' . intval( $attributes[ $breakpoint . '_zIndex' ] ) . ';';
		}

		return $display;
	}

	/**
	 * Return spacing rules for margins or paddings, depending on a given breakpoint.
	 *
	 * @since 1.0.0
	 * @param string $type Either "margin" or "padding".
	 * @param string $breakpoint The breakpoint key.
	 * @param array $attributes The block attributes.
	 * @param string $output The output format.
	 * @return string
	 */
	public static function spacing_rules( $type, $breakpoint, $attributes, $output = 'css' ) {
		$spacing = '';

		if ( $output === 'data' ) {
			$spacing = array();
		}

		$dirs = array( 'top', 'right', 'bottom', 'left' );

		foreach ( $dirs as $dir ) {
			$key = $type . '_' . $breakpoint . '_' . $dir;
			$key_unit = $type . '_' . $breakpoint . '_' . $dir . '_unit';

			if ( isset( $attributes[ $key ] ) ) {
				$value = $attributes[ $key ];
				$unit = isset( $attributes[ $key_unit ] ) ? $attributes[ $key_unit ] : 'px';
				$new_value = $value . $unit;

				if ( $output === 'css' ) {
					$spacing .= sprintf( '%s-%s: %s !important;',
						$type,
						$dir,
						$new_value
					);
				}
				else {
					$spacing[ $type . '-' . $dir ] = $new_value;
				}
			}
		}

		return $spacing;
	}

	/**
	 * Return a Media Query selector based on a given breakpoint key.
	 *
	 * @since 1.0.0
	 * @param string $breakpoint The breakpoint key.
	 * @return string
	 */
	public static function media_query_selector( $breakpoint ) {
		$breakpoints_config = \Grids\Core::instance()->get_config( 'breakpoints' );
		$media = '';

		if ( isset( $breakpoints_config[ $breakpoint ] ) ) {
			if ( isset( $breakpoints_config[ $breakpoint ][ 'media' ] ) && ! empty( $breakpoints_config[ $breakpoint ][ 'media' ] ) ) {
				$media = $breakpoints_config[ $breakpoint ][ 'media' ];
			}
			else {
				$min = isset( $breakpoints_config[ $breakpoint ][ 'min' ] ) ? $breakpoints_config[ $breakpoint ][ 'min' ] : '';
				$max = isset( $breakpoints_config[ $breakpoint ][ 'max' ] ) ? $breakpoints_config[ $breakpoint ][ 'max' ] : '';

				$media = '@media screen';

				if ( ! empty( $min ) || ! empty( $max ) ) {
					if ( ! empty( $min ) ) {
						$media .= ' and ( min-width:' . $min . 'px )';
					}
					if ( ! empty( $max ) ) {
						$media .= ' and ( max-width:' . $max . 'px )';
					}
				}
			}
		}

		return $media;
	}

	/**
	 * Return the style to display a background for given breakpoint key.
	 *
	 * @since 1.0.0
	 * @param string $breakpoint The breakpoint key.
	 * @param array $attributes The attributes array.
	 * @return string
	 */
	public static function background_rules( $breakpoint, $attributes ) {
		$background = '';

		if ( isset( $attributes[ 'align' ] ) && $attributes[ 'align' ] === 'wide' && isset( $attributes[ 'background_' . $breakpoint . '_stretch' ] ) && $attributes[ 'background_' . $breakpoint . '_stretch' ] ) {
			$background .= sprintf( 'margin-left:%1$s;margin-right:%1$s;',
				'calc( 50% - 50vw )'
			);
		}

		if ( isset( $attributes[ 'background_' . $breakpoint . '_color' ] ) ) {
			$background .= 'background-color:' . $attributes[ 'background_' . $breakpoint . '_color' ] . ' !important;';
		}

		if ( isset( $attributes[ 'background_' . $breakpoint . '_image' ] ) ) {
			$image_id = $attributes[ 'background_' . $breakpoint . '_image' ];
			$image_size = isset( $attributes[ 'background_' . $breakpoint . '_image_size' ] ) ? $attributes[ 'background_' . $breakpoint . '_image_size' ] : 'full';

			$background .= 'background-image: url(' . \Grids\Core\Media::get_image_by_id( $image_id, $image_size ) . ') !important;';

			if ( isset( $attributes[ 'background_' . $breakpoint . '_repeat' ] ) ) {
				$background .= 'background-repeat:' . $attributes[ 'background_' . $breakpoint . '_repeat' ] . ' !important;';
			}
			if ( isset( $attributes[ 'background_' . $breakpoint . '_position_x' ] ) ) {
				$background .= 'background-position-x:' . ( $attributes[ 'background_' . $breakpoint . '_position_x' ] * 100 ) . '% !important;';
			}
			if ( isset( $attributes[ 'background_' . $breakpoint . '_position_y' ] ) ) {
				$background .= 'background-position-y:' . ( $attributes[ 'background_' . $breakpoint . '_position_y' ] * 100 ) . '% !important;';
			}
			if ( isset( $attributes[ 'background_' . $breakpoint . '_size' ] ) ) {
				$background .= 'background-size:' . $attributes[ 'background_' . $breakpoint . '_size' ] . ' !important;';
			}
			if ( isset( $attributes[ 'background_' . $breakpoint . '_attachment' ] ) ) {
				$background .= 'background-attachment:' . $attributes[ 'background_' . $breakpoint . '_attachment' ] . ' !important;';
			}
		}

		return $background;
	}

}
