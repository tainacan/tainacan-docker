<?php
/**
 * Customize for textarea, extend the WP customizer
 *
 * @package 	Customizer_Library
 * @author		Devin Price, The Theme Foundry
 */

if ( ! class_exists( 'WP_Customize_Control' ) ) {
	return NULL;
}

class Customizer_Library_Dropdown_Categories extends WP_Customize_Control {

	public $type = 'dropdown-categories';
	
	public $name;
	
	public function render_content() {
		$dropdown = wp_dropdown_categories(
			array(
				'name'             => $this->name,
				'echo'             => 0,
				'hide_empty'       => false,
				'show_option_none' => false,
				'hide_if_empty'    => false,
			)
		);
	
		$dropdown = str_replace('<select', '<select multiple="multiple" style="height:95px;" ' . $this->get_link(), $dropdown );
	
		printf(
			'<label class="customize-control-select"><span class="customize-control-title">%s</span> %s</label>',
			$this->label,
			$dropdown
		);
	
		if ( isset( $this->description ) ) {
			echo '<span class="description customize-control-description">' . $this->description . '</span>';
		}
		
	}

}