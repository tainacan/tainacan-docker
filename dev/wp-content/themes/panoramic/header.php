<?php
/**
 * The header for our theme.
 *
 * Displays all of the <head> section and everything up till <div id="content">
 *
 * @package panoramic
 */
//global $woocommerce;
?><!DOCTYPE html><!-- Panoramic -->
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="profile" href="http://gmpg.org/xfn/11">
<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">

<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>

<?php wp_body_open(); ?>

<header id="masthead" class="site-header <?php echo ( get_theme_mod( 'panoramic-header-layout', 'panoramic-header-layout-standard' ) == 'panoramic-header-layout-centered' ) ? sanitize_html_class( 'panoramic-header-layout-centered' ) : sanitize_html_class( 'panoramic-header-layout-standard' ); ?>" role="banner">

    <?php
    if ( get_theme_mod( 'panoramic-header-layout', 'panoramic-header-layout-standard' ) == 'panoramic-header-layout-centered' ) :
		get_template_part( 'library/template-parts/header', 'centered' );
    else :
		get_template_part( 'library/template-parts/header', 'standard' );
	endif;
	?>
    
</header><!-- #masthead -->

<script>
    var panoramicSliderTransitionSpeed = parseInt(<?php echo intval( get_theme_mod( 'panoramic-slider-transition-speed', 450 ) ); ?>);
</script>

<?php
if ( is_front_page() && get_theme_mod( 'panoramic-slider-type', 'panoramic-no-slider' ) != 'panoramic-no-slider' ) :
	get_template_part( 'library/template-parts/slider' );
elseif ( is_front_page() && get_header_image() ) :
	get_template_part( 'library/template-parts/header-image' );
endif;

$page_template = basename( get_page_template() );
$no_sidebar = false;

if ( ( $page_template == 'template-left-sidebar.php' && !is_active_sidebar( 'sidebar-1' ) ) ) {
	$no_sidebar = true;
}
?>

<div id="content" class="site-content site-container <?php echo esc_attr( ( $no_sidebar ) ? 'no-sidebar' : '' ); ?>">
