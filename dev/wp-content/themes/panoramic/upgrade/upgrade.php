<?php
/**
 * Functions for users wanting to upgrade to premium
 *
 * @package Panoramic
 */

/**
 * Display the upgrade to Premium page & load styles.
 */
function panoramic_premium_admin_menu() {
    global $panoramic_upgrade_page;
    $panoramic_upgrade_page = add_theme_page(
    	__( 'Panoramic Premium', 'panoramic' ),
    	'<span class="premium-link">'. __( 'Panoramic Premium', 'panoramic' ) .'</span>',
    	'edit_theme_options',
    	'premium_upgrade',
    	'panoramic_render_upgrade_page'
	);
}
add_action( 'admin_menu', 'panoramic_premium_admin_menu' );

/**
 * Enqueue admin stylesheet only on upgrade page.
 */
function panoramic_load_upgrade_page_scripts( $hook ) {
    global $panoramic_upgrade_page;
    if ( $hook != $panoramic_upgrade_page ) {
		return;
    }
    
    wp_enqueue_style( 'panoramic-upgrade-body-font-default', '//fonts.googleapis.com/css?family=Lato:400,400italic', array(), PANORAMIC_THEME_VERSION );
    wp_enqueue_style( 'panoramic-upgrade-heading-font-default', '//fonts.googleapis.com/css?family=Montserrat:500,700', array(), PANORAMIC_THEME_VERSION );
    wp_enqueue_style( 'panoramic-upgrade', get_template_directory_uri() .'/upgrade/library/css/upgrade.css', array(), PANORAMIC_THEME_VERSION );
    wp_enqueue_style( 'panoramic-font-awesome', get_template_directory_uri().'/library/fonts/font-awesome/css/font-awesome.css', array(), '4.7.0' );
    wp_enqueue_script( 'panoramic-caroufredsel-js', get_template_directory_uri() .'/library/js/jquery.carouFredSel-6.2.1-packed.js', array( 'jquery' ), PANORAMIC_THEME_VERSION, true );
    wp_enqueue_script( 'panoramic-upgrade-custom-js', get_template_directory_uri() .'/upgrade/library/js/upgrade.js', array( 'jquery' ), PANORAMIC_THEME_VERSION, true );
}
add_action( 'admin_enqueue_scripts', 'panoramic_load_upgrade_page_scripts' );

/**
 * Render the premium upgrade/order page
 */
function panoramic_render_upgrade_page() {

	if ( isset( $_GET['action'] ) ) {
		$action = $_GET['action'];
	} else {
		$action = 'view-page';
	}

	switch ( $action ) {
		case 'view-page':
			get_template_part( 'upgrade/library/template-parts/content', 'upgrade' );
			break;
	}
}
