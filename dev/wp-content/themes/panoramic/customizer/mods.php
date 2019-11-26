<?php
/**
 * Functions used to implement options
 *
 * @package Customizer Library Demo
 */

/**
 * Enqueue Google Fonts Example
 */
function panoramic_customizer_theme_fonts() {

	// Font options
	$fonts = array(
		get_theme_mod( 'panoramic-site-title-font', customizer_library_get_default( 'panoramic-site-title-font' ) ),
		get_theme_mod( 'panoramic-heading-font', customizer_library_get_default( 'panoramic-heading-font' ) ),
		get_theme_mod( 'panoramic-body-font', customizer_library_get_default( 'panoramic-body-font' ) )
	);

	$font_uri = customizer_library_get_google_font_uri( $fonts );

	// Load Google Fonts
	wp_enqueue_style( 'panoramic_customizer_theme_fonts', $font_uri, array(), null, 'screen' );

}
add_action( 'wp_enqueue_scripts', 'panoramic_customizer_theme_fonts' );