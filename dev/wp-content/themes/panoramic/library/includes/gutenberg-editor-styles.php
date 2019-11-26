<?php

$fonts = array();

// Heading Font
$heading_font_type = get_theme_mod( 'panoramic-heading-font-type', customizer_library_get_default( 'panoramic-heading-font-type') );
    
if ( $heading_font_type == 'theme-font' ) {
	$font = 'panoramic-heading-font';
	    
	$fontmod = get_theme_mod( $font, customizer_library_get_default( $font ) );
	$fontstack = customizer_library_get_font_stack( $fontmod );
	    
} else {
	$fontstack = get_theme_mod( 'panoramic-heading-custom-font', customizer_library_get_default( 'panoramic-heading-custom-font') );
}

$fonts = $font;

if ( $fontmod != customizer_library_get_default( $font ) || $heading_font_type == 'custom-font' ) {
    
    Customizer_Library_Styles()->add( array(
    	'selectors' => array(
    		'.editor-post-title__block .editor-post-title__input,
			.edit-post-visual-editor .editor-block-list__block h1.mce-content-body'
    	),
    	'declarations' => array(
    		'font-family' => $fontstack
    	)
    ) );

}


/**
 * Enqueue Google Fonts for the Gutenberg editor
 */
$fonts = array(
	get_theme_mod( 'panoramic-body-font', customizer_library_get_default( 'panoramic-body-font' ) ),
	get_theme_mod( 'panoramic-heading-font', customizer_library_get_default( 'panoramic-heading-font' ) )
);

$font_uri = customizer_library_get_google_font_uri( $fonts );

wp_enqueue_style( 'panoramic_gutenberg_editor_fonts', $font_uri, array(), null, 'screen' );


if ( ! function_exists( 'panoramic_gutenberg_editor_styles' ) ) :
/**
 * Generates the style tag and CSS needed for the theme options.
 *
 * By using the "Customizer_Library_Styles" filter, different components can print CSS in the header.
 * It is organized this way to ensure there is only one "style" tag.
 *
 * @since  1.0.0.
 *
 * @return void
 */
function panoramic_gutenberg_editor_styles() {

	// Echo the rules
	$css = Customizer_Library_Styles()->build();

	if ( ! empty( $css ) ) {
		echo "\n<!-- Begin Gutenberg Editor Custom CSS -->\n<style type=\"text/css\" id=\"out-the-box-gutenberg-editor-custom-css\">\n";
		echo $css;
		echo "\n</style>\n<!-- End Custom CSS -->\n";
	}
}
endif;

add_action( 'admin_head', 'panoramic_gutenberg_editor_styles', 11 );    
?>
