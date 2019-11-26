<?php
if( get_theme_mod( 'panoramic-show-header-top-bar', true ) ) :
	get_template_part( 'library/template-parts/top-bar' );
endif;

$logo = '';

if ( function_exists( 'has_custom_logo' ) ) {
	if ( has_custom_logo() ) {
		$logo = get_custom_logo();
	}
} else if ( get_theme_mod( 'panoramic-logo', '' ) != '' ) {
	$logo = "<a href=\"". esc_url( home_url( '/' ) ) ."\" title=\"". esc_attr( get_bloginfo( 'name', 'display' ) ) ."\" class=\"custom-logo-link\"><img src=\"". esc_url( get_theme_mod( 'panoramic-logo', '' ) ) ."\" alt=\"". esc_attr( get_bloginfo( 'name' ) ) ."\" class=\"custom-logo\" /></a>";
}
?>

<div class="site-container">
    
    <div class="branding">
        <?php
        if( $logo ) :
			echo $logo;
        else :
        ?>
            <a href="<?php echo esc_url( home_url( '/' ) ); ?>" title="<?php echo esc_attr( get_bloginfo( 'name', 'display' ) ); ?>" class="title"><?php bloginfo( 'name' ); ?></a>
            <div class="description"><?php bloginfo( 'description' ); ?></div>
        <?php
        endif;
        ?>
    </div>
    
	<?php if( get_theme_mod( 'panoramic-header-search', true ) ) : ?>
	<div class="search-block">
		<?php get_search_form(); ?>
	</div>
	<?php endif; ?>
    
</div>

<?php 
$is_translucent = true;

if ( !is_front_page() ) {
	$is_translucent = false;
} else if ( is_front_page() && get_theme_mod( 'panoramic-slider-type', 'panoramic-no-slider' ) == 'panoramic-no-slider' && !get_header_image() ) {
	$is_translucent = false;
} else if ( is_front_page() && get_theme_mod( 'panoramic-slider-type', 'panoramic-no-slider' ) == 'panoramic-slider-plugin' && get_theme_mod( 'panoramic-slider-plugin-shortcode', '' ) == '' ) {
	$is_translucent = false;
}
?>

<nav id="site-navigation" class="main-navigation border-bottom <?php echo ( $is_translucent ) ? sanitize_html_class( 'translucent' ) : sanitize_html_class( '' ); ?>" role="navigation">
	<span class="header-menu-button"><i class="otb-fa otb-fa-bars"></i></span>
	<div id="main-menu" class="main-menu-container panoramic-mobile-menu-standard-color-scheme">
		<div class="main-menu-close"><i class="otb-fa otb-fa-angle-right"></i><i class="otb-fa otb-fa-angle-left"></i></div>
		<?php wp_nav_menu( array( 'theme_location' => 'primary', 'container_class' => 'main-navigation-inner' ) ); ?>
	</div>
</nav><!-- #site-navigation -->
