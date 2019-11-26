<?php

namespace Grids\Core\Blocks;

use Grids\Core\Block as Block;
use Grids\Core\Utils\Filter as Filter;
use Grids\Core\Utils\CSS as CSS;

/* Check that we're running this file from the plugin. */
if ( ! defined( 'GRIDS' ) ) die( 'Forbidden' );

/**
 * Area block class.
 *
 * @since 1.0.0
 */
class Area extends Block {

	/**
	 * Class constructor.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		$params = array(
			'render_callback' => array( $this, 'render' )
		);

		$params = parent::__construct( 'area', $params );

		register_block_type( 'grids/area', $params );
	}

	/**
	 * Render the section markup on frontend.
	 *
	 * @since 1.0.0
	 * @param array $attributes The section attributes.
	 * @param string $content The section content.
	 * @return string
	 */
	public function render( $attributes, $content ) {
		$blockId = $attributes[ 'blockId' ];

		$class = Filter::apply( 'area_class', array() );
		$class[] = 'grids-a-' . $blockId;

		if ( isset( $attributes[ 'className' ] ) ) {
			$class[] = $attributes[ 'className' ];
		}

		return sprintf(
			'<div class="%s">%s</div>',
			esc_attr( implode( ' ', $class ) ),
			$content
		);
	}

	/**
	 * Render the area style.
	 *
	 * @since 1.0.0
	 * @param array $attributes The area attributes.
	 * @param integer $post_id The current post ID.
	 * @return string
	 */
	public static function style( $attributes, $post_id ) {
		$selector = '.grids-a-' . $attributes[ 'blockId' ];
		$vertical_alignment = 'flex-start';
		$z_index = 0;
		$breakpoints_config = \Grids\Core::instance()->get_config( 'breakpoints' );

		$gutter_x           = get_post_meta( $post_id, '_grids_gutter_x', true );
		$gutter_x           = json_decode( $gutter_x, true );

		$gutter = array(
			'horizontal' => $gutter_x,
			'vertical' => array(),
		);

		if ( isset( $attributes[ 'vertical_alignment' ] ) ) {
			if ( $attributes[ 'vertical_alignment' ] == 'center' ) {
				$vertical_alignment = 'center';
			}
			else if ( $attributes[ 'vertical_alignment' ] == 'bottom' ) {
				$vertical_alignment = 'flex-end';
			}
		}

		$style = '';
		$style .= sprintf( '%s {', esc_attr( $selector ) );
			$style .= sprintf( '-ms-grid-column:%d;', absint( $attributes[ 'column' ][ 'start' ] ) );
			$style .= sprintf( 'grid-column-start:%d;', absint( $attributes[ 'column' ][ 'start' ] ) );
			$style .= sprintf( 'grid-column-end:%d;', absint( $attributes[ 'column' ][ 'end' ] + 1 ) );

			$style .= sprintf( '-ms-grid-row:%d;', absint( $attributes[ 'row' ][ 'start' ] ) );
			$style .= sprintf( 'grid-row-start:%d;', absint( $attributes[ 'row' ][ 'start' ] ) );
			$style .= sprintf( 'grid-row-end:%d;', absint( $attributes[ 'row' ][ 'end' ] + 1 ) );

			$style .= sprintf( 'align-self:%s;', $vertical_alignment );
			$style .= sprintf( 'justify-content:%s;', $vertical_alignment );
		$style .= '}';

		if ( $breakpoints_config ) {
			foreach ( $breakpoints_config as $breakpoint => $data ) {
				$query = CSS::media_query_selector( $breakpoint );

				if ( ! empty( $query ) ) {
					$display = CSS::display_rules( $breakpoint, $attributes, array(
						'display' => 'flex'
					) );

					$margin  = CSS::spacing_rules( 'margin', $breakpoint, $attributes );
					$padding = CSS::spacing_rules( 'padding', $breakpoint, $attributes, 'data' );
					$background = CSS::background_rules( $breakpoint, $attributes );

					/* Horizontal gutter adjustment. */
					$gutter_value = isset( $gutter[ 'horizontal' ][ $breakpoint ] ) && ! empty( $gutter[ 'horizontal' ][ $breakpoint ] ) ? $gutter[ 'horizontal' ][ $breakpoint ] / 2 : '0';
					$gutter_unit = isset( $gutter[ 'horizontal' ][ $breakpoint . '_unit' ] ) ? $gutter[ 'horizontal' ][ $breakpoint . '_unit' ] : 'px';

					if ( ! empty( $display ) ) {
						$style .= $query . '{';
							$style .= sprintf( '%s {', esc_attr( $selector ) );
								$style .= $display;
							$style .= '}';
						$style .= '}';
					}

					if ( ! empty( $margin ) || ! empty( $background ) || ! empty( $padding ) || $gutter_value != '' ) {
						$style .= $query . '{';
							$style .= sprintf( '%s {', esc_attr( $selector ) );
								$style .= $margin;

								if ( $margin ) {
									$margin_left = CSS::get_spacing( 'margin', 'left', $attributes, $breakpoint );
									$margin_right = CSS::get_spacing( 'margin', 'right', $attributes, $breakpoint );

									$style .= 'max-width:calc( 100% - ' . $margin_left . ' - ' . $margin_right . ' );';
								}

								if ( ! empty( $padding ) ) {
									$padding_css = '';

									$dirs = array( 'top', 'right', 'bottom', 'left' );

									if ( $gutter_value != '' ) {
										foreach ( $dirs as $dir ) {
											if ( $dir == 'left' || $dir == 'right' ) {
												if ( isset( $padding[ 'padding-' . $dir ] ) ) {
													$padding[ 'padding-' . $dir ] = sprintf( 'calc(%s + %s)',
														$gutter_value . $gutter_unit,
														$padding[ 'padding-' . $dir ]
													);
												}
												else {
													$padding[ 'padding-' . $dir ] = $gutter_value . $gutter_unit;
												}
											}
										}
									}

									foreach ( $padding as $p => $value ) {
										$padding_css .= $p . ': ' . $value . ' !important;';
									}

									$style .= $padding_css;
								}
								elseif ( $gutter_value != '' ) {
									$padding_css = sprintf( 'padding-left: %s !important;padding-right: %s !important;',
										$gutter_value . $gutter_unit,
										$gutter_value . $gutter_unit
									);

									$style .= $padding_css;
								}

								$style .= $background;
							$style .= '}';
						$style .= '}';
					}
				}
			}
		}

		return $style;
	}

}
