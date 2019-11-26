<?php
/**
 * Customize for Customizer help, extend the WP customizer
 *
 * @package 	Customizer_Library
 * @author		Devin Price, The Theme Foundry
 */

if ( ! class_exists( 'WP_Customize_Control' ) ) {
	return NULL;
}

class Customizer_Library_Dropdown_Image_Sizes extends WP_Customize_Control {

	public $default;

	public function render_content() {
		global $_wp_additional_image_sizes;

		$full_set = false;

		$option_open  = '<option value="%s" %s>';
		$option_close = '</option>';
		
		$dropdown = '<select data-customize-setting-link="' .$this->id. '">';

 		foreach ( get_intermediate_image_sizes() as $_size ) {
 			//$dropdown .= '<option value="' . $_size . '" ' . selected( $_size, $this->default, false ) . '>';

 			if ( in_array( $_size, array('thumbnail', 'medium', 'medium_large', 'large') ) ) {
 				$dropdown .= sprintf( $option_open, $_size, selected( $_size, $this->default, false ) );
 				$dropdown .= ucwords( str_replace( array('_', '-'), ' ', $_size ) ) . ' (' . get_option( "{$_size}_size_w" ) . ' x ' . get_option( "{$_size}_size_h" ) . ')';
 				$dropdown .= $option_close;
 			} else if ( isset( $_wp_additional_image_sizes[ $_size ] ) ) {
 				if ( !$full_set ) {
					$dropdown .= '<option value="full" ' . selected( 'full', $this->default, false ) . '>' . __( 'Full', 'panoramic' ) . '</option>';
					$full_set = true;
 				}

 				$dropdown .= sprintf( $option_open, $_size, selected( $_size, $this->default, false ) );
 				$dropdown .=  ucwords( str_replace( array('_', '-'), ' ', $_size ) ) . ' (' . $_wp_additional_image_sizes[ $_size ]['width'] . ' x ' . $_wp_additional_image_sizes[ $_size ]['height'] . ')';
 				$dropdown .= $option_close;
 			}

 			//$dropdown .= '</option>';
 		}

		$dropdown .= '</select>';

		printf( '<label class="customize-control-select"><span class="customize-control-title">%s</span> %s</label>', $this->label, $dropdown );

		if ( isset( $this->description ) ) {
			echo '<span class="description customize-control-description">' . $this->description . '</span>';
		}

	}

}