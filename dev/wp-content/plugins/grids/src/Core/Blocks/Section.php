<?php

namespace Grids\Core\Blocks;

use Grids\Core\Block as Block;
use Grids\Core\Utils\Filter as Filter;
use Grids\Core\Utils\CSS as CSS;

/* Check that we're running this file from the plugin. */
if ( ! defined( 'GRIDS' ) ) die( 'Forbidden' );

/**
 * Section block class.
 *
 * @since 1.0.0
 */
class Section extends Block {

	/**
	 * Class constructor.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		$params = array(
			'render_callback' => array( $this, 'render' )
		);

		$params = parent::__construct( 'section', $params );

		register_block_type( 'grids/section', $params );
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
		$class = Filter::apply( 'section_class', array() );
		$class[] = 'grids-s-' . $attributes[ 'blockId' ];

		if ( isset( $attributes[ 'className' ] ) ) {
			$class[] = $attributes[ 'className' ];
		}

		$is_single_row = $attributes[ 'rows' ] === 1 || is_array( $attributes[ 'rows' ] ) && count( $attributes[ 'rows' ] ) === 1;

		if ( $is_single_row && ( ! isset( $attributes[ 'stretch' ] ) || $attributes[ 'stretch' ] === true ) ) {
			$class[] = 'grids-is-stretch';
		}

		if ( ! $is_single_row ) {
			$class[] = 'grids-is-advanced';
		}

		if ( isset( $attributes[ 'align' ] ) ) {
			$class[] = 'align' . $attributes[ 'align' ];
		}

		$attrs = '';

		if ( isset( $attributes[ 'anchorID' ] ) && ! empty( $attributes[ 'anchorID' ] ) ) {
			$attrs .= ' id="' . esc_attr( $attributes[ 'anchorID' ] ) . '"';
		}

		return sprintf(
			'<div %s class="%s"><div class="grids-s-w_i">%s</div></div>',
			$attrs,
			esc_attr( implode( ' ', $class ) ),
			$content
		);
	}

	/**
	 * Render the section style.
	 *
	 * @since 1.0.0
	 * @param array $attributes The section attributes.
	 * @param integer $post_id The current post ID.
	 * @return string
	 */
	public static function style( $attributes, $post_id ) {
		$selector           = '.grids-s-' . $attributes[ 'blockId' ];
		$breakpoints_config = \Grids\Core::instance()->get_config( 'breakpoints' );
		$gutter_x           = get_post_meta( $post_id, '_grids_gutter_x', true );
		$gutter_x           = json_decode( $gutter_x, true );

		$gutter = array(
			'horizontal' => $gutter_x,
			'vertical' => array(),
		);

		$style = '';
		$style .= sprintf( '%s .grids-s-w_i {', esc_attr( $selector ) );

			if ( is_numeric( $attributes[ 'columns' ] ) ) {
				$style .= sprintf( '-ms-grid-columns: repeat( %1$d, 1fr );', absint( $attributes[ 'columns' ] ) );
				$style .= sprintf( 'grid-template-columns: repeat( %1$d, 1fr );', absint( $attributes[ 'columns' ] ) );
			}
			else {
				$style .= sprintf( '-ms-grid-columns: %s;', implode( ' ', $attributes[ 'columns' ] ) );
				$style .= sprintf( 'grid-template-columns: %s;', implode( ' ', $attributes[ 'columns' ] ) );
			}

			if ( is_numeric( $attributes[ 'rows' ] ) ) {
				$style .= sprintf( '-ms-grid-rows: repeat( %1$d, auto );', absint( $attributes[ 'rows' ] ) );
				$style .= sprintf( 'grid-template-rows: repeat( %1$d, auto );', absint( $attributes[ 'rows' ] ) );
			}
			else {
				$style .= sprintf( '-ms-grid-rows: %s;', implode( ' ', $attributes[ 'rows' ] ) );
				$style .= sprintf( 'grid-template-rows: %s;', implode( ' ', $attributes[ 'rows' ] ) );
			}
		$style .= '}';

		if ( $breakpoints_config ) {
			foreach ( $breakpoints_config as $breakpoint => $data ) {
				$query = CSS::media_query_selector( $breakpoint );

				if ( ! empty( $query ) ) {
					$display = CSS::display_rules( $breakpoint, $attributes, array(
						'display' => 'flex'
					) );

					$margin     = CSS::spacing_rules( 'margin', $breakpoint, $attributes, 'data' );
					$padding    = CSS::spacing_rules( 'padding', $breakpoint, $attributes );
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

					if ( ! empty( $margin ) || $gutter_value != '' || ! empty( $padding ) || isset( $attributes[ 'height_' . $breakpoint ] ) ) {
						$style .= $query . '{';
							$style .= sprintf( '%s .grids-s-w_i {', esc_attr( $selector ) );
								if ( isset( $attributes[ 'height_' . $breakpoint ] ) && ! empty( $attributes[ 'height_' . $breakpoint ] ) ) {
									$height_value = isset( $attributes[ 'height_' . $breakpoint ] ) ? $attributes[ 'height_' . $breakpoint ] : 'auto';
									$height_unit = isset( $attributes[ 'height_' . $breakpoint . '_unit' ] ) ? $attributes[ 'height_' . $breakpoint . '_unit' ] : 'px';
									$height_fix = isset( $attributes[ 'height_' . $breakpoint . '_fix' ] ) ? $attributes[ 'height_' . $breakpoint . '_fix' ] : false;

									if ( ! $height_fix ) {
										$style .= sprintf( 'min-height: %s%s;', $height_value, $height_unit );
									}
									else {
										$style .= sprintf( 'height: %s%s;', $height_value, $height_unit );
									}
								}

								$margin_correction = false;

								if ( current_theme_supports( 'align-wide' ) ) {
									if ( ! isset( $attributes[ 'align' ] ) || $attributes[ 'align' ] !== 'full' ) {
										$margin_correction = true;
									}
								}
								else {
									$margin_correction = true;
								}

								if ( $margin_correction ) {
									if ( ! empty( $margin ) ) {
										$margin_css = '';

										foreach ( $margin as $m => $value ) {
											if ( ( $m === 'margin-left' || $m === 'margin-right' ) && $gutter_value != '' ) {
												$value = sprintf( 'calc(-%s + %s)',
													$gutter_value . $gutter_unit,
													$value
												);
											}

											$margin_css .= $m . ': ' . $value . ' !important;';
										}

										$style .= $margin_css;
									}
									elseif ( $gutter_value != '' ) {
										$margin_css = sprintf( 'margin-left: -%s !important;margin-right: -%s !important;',
											$gutter_value . $gutter_unit,
											$gutter_value . $gutter_unit
										);

										$style .= $margin_css;
									}
								}

								$margin_left = CSS::get_spacing( 'margin', 'left', $attributes, $breakpoint );
								$margin_right = CSS::get_spacing( 'margin', 'right', $attributes, $breakpoint );

								if ( current_theme_supports( 'align-wide' ) ) {
									if ( ! isset( $attributes[ 'align' ] ) || $attributes[ 'align' ] !== 'full' ) {
										$style .= sprintf( 'min-width:calc(100%% + %s - %s - %s);',
											( $gutter_value * 2 . $gutter_unit ),
											$margin_left,
											$margin_right
										);
									}
									else if ( isset( $attributes[ 'align' ] ) && $attributes[ 'align' ] === 'full' ) {
										$style .= sprintf( 'min-width:calc(100%% - %s - %s);',
											$margin_left,
											$margin_right
										);
									}
								}
								else {
									$style .= sprintf( 'min-width:calc(100%% - %s - %s);',
										$margin_left,
										$margin_right
									);
								}

								$style .= $padding;
							$style .= '}';
						$style .= '}';
					}

					if ( ! empty( $background ) ) {
						$style .= $query . '{';
							$style .= sprintf( '%s .grids-s-w_i:before {', esc_attr( $selector ) );
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
