<?php
/**
 * Defines customizer options
 *
 * @package Customizer Library Demo
 */

function panoramic_customizer_library_options() {
	// Theme defaults
	$primary_color = '#006489';
	$secondary_color = '#3F84A4';
	$footer_color = '#EAF1F7';
    
    $body_font_color = '#58585A';
    $heading_font_color = '#006489';

	// Stores all the controls that will be added
	$options = array();

	// Stores all the sections to be added
	$sections = array();
	
	// Stores all the panels to be added
	$panels = array();

	// Adds the sections to the $options array
	$options['sections'] = $sections;
	
	// Site Identity
	$section = 'title_tagline';
	
	$sections[] = array(
		'id' => $section,
		'title' => __( 'Site Identity', 'panoramic' ),
		'priority' => '25'
	);
	
	if ( ! function_exists( 'has_custom_logo' ) ) {	
		$options['panoramic-logo'] = array(
			'id' => 'panoramic-logo',
			'label'   => __( 'Logo', 'panoramic' ),
			'section' => $section,
			'type'    => 'image'
		);	
	}
	
    // Layout Settings
    $section = 'panoramic-layout';

    $sections[] = array(
        'id' => $section,
        'title' => __( 'Layout', 'panoramic' ),
        'priority' => '30'
    );
    
        
    // Header Settings
    $section = 'panoramic-header';
    
    $sections[] = array(
    	'id' => $section,
    	'title' => __( 'Header', 'panoramic' ),
    	'priority' => '35'
    );
    $choices = array(
    	'panoramic-header-layout-standard' => 'Left aligned',
    	'panoramic-header-layout-centered' => 'Centered'
    );
    $options['panoramic-header-layout'] = array(
    	'id' => 'panoramic-header-layout',
    	'label'   => __( 'Layout', 'panoramic' ),
    	'section' => $section,
    	'type'    => 'select',
    	'choices' => $choices,
    	'default' => 'panoramic-header-layout-standard'
    );
        
    $options['panoramic-show-header-top-bar'] = array(
    	'id' => 'panoramic-show-header-top-bar',
    	'label'   => __( 'Show Top Bar', 'panoramic' ),
    	'section' => $section,
    	'type'    => 'checkbox',
    	'default' => 1
    );
    $options['panoramic-header-info-text'] = array(
    	'id' => 'panoramic-header-info-text',
    	'label'   => __( 'Info Text', 'panoramic' ),
    	'section' => $section,
    	'type'    => 'text',
    	'default' => __( '<strong><em>CALL US:</em></strong> 555-PANORAMIC', 'panoramic'),
    	'sanitize_callback' => 'wp_kses_post'
    );
    $options['panoramic-header-shop-links'] = array(
    	'id' => 'panoramic-header-shop-links',
    	'label'   => __( 'Shop Links', 'panoramic' ),
    	'section' => $section,
    	'type'    => 'checkbox',
    	'default' => 1,
		'description' => __( 'Display the My Account and Checkout links when WooCommerce is active.', 'panoramic' )
    );
    $options['panoramic-header-search'] = array(
    	'id' => 'panoramic-header-search',
    	'label'   => __( 'Show Search', 'panoramic' ),
    	'section' => $section,
    	'type'    => 'checkbox',
    	'default' => 1
    );

    
    // Social Settings
    $section = 'panoramic-social';
    
    $sections[] = array(
    	'id' => $section,
    	'title' => __( 'Social Media Links', 'panoramic' ),
    	'priority' => '35'
    );
    
    $options['panoramic-social-email'] = array(
    	'id' => 'panoramic-social-email',
    	'label'   => __( 'Email Address', 'panoramic' ),
    	'section' => $section,
    	'type'    => 'text'
    );
    $options['panoramic-social-skype'] = array(
    	'id' => 'panoramic-social-skype',
    	'label'   => __( 'Skype Name', 'panoramic' ),
    	'section' => $section,
    	'type'    => 'text'
    );
    
    $options['panoramic-social-tumblr'] = array(
    	'id' => 'panoramic-social-tumblr',
    	'label'   => __( 'Tumblr', 'panoramic' ),
    	'section' => $section,
    	'type'    => 'text'
    );
    $options['panoramic-social-flickr'] = array(
    	'id' => 'panoramic-social-flickr',
    	'label'   => __( 'Flickr', 'panoramic' ),
    	'section' => $section,
    	'type'    => 'text'
    );
    
    
    // Search Settings
    $section = 'panoramic-search';
    
    $sections[] = array(
    	'id' => $section,
    	'title' => __( 'Search', 'panoramic' ),
    	'priority' => '35'
    );
    
    $options['panoramic-search-placeholder-text'] = array(
    	'id' => 'panoramic-search-placeholder-text',
    	'label'   => __( 'Default Search Input Text', 'panoramic' ),
    	'section' => $section,
    	'type'    => 'text',
    	'default' => __( 'Search...', 'panoramic' )
    );    

    $options['panoramic-website-text-no-search-results-heading'] = array(
    	'id' => 'panoramic-website-text-no-search-results-heading',
    	'label'   => __( 'No Search Results Heading', 'panoramic' ),
    	'section' => $section,
    	'type'    => 'text',
    	'default' => __( 'Nothing Found!', 'panoramic')
    );
    $options['panoramic-website-text-no-search-results-text'] = array(
    	'id' => 'panoramic-website-text-no-search-results-text',
    	'label'   => __( 'No Search Results Message', 'panoramic' ),
    	'section' => $section,
    	'type'    => 'textarea',
    	'default' => __( 'Sorry, but nothing matched your search terms. Please try again with some different keywords.', 'panoramic')
    );
    
    
    // Mobile Menu Settings
    $section = 'panoramic-mobile-menu';
    
    $sections[] = array(
    	'id' => $section,
    	'title' => __( 'Mobile Menu', 'panoramic' ),
    	'priority' => '35'
    );
    
    
    // Slider Settings
    $section = 'panoramic-slider';

    $sections[] = array(
        'id' => $section,
        'title' => __( 'Slider', 'panoramic' ),
        'priority' => '35'
    );
    
    $choices = array(
        'panoramic-slider-default' => 'Default Slider',
        'panoramic-slider-plugin' => 'Slider Plugin',
        'panoramic-no-slider' => 'None'
    );
    $options['panoramic-slider-type'] = array(
        'id' => 'panoramic-slider-type',
        'label'   => __( 'Choose a Slider', 'panoramic' ),
        'section' => $section,
        'type'    => 'select',
        'choices' => $choices,
        'default' => 'panoramic-no-slider'
    );
	
    $options['panoramic-default-slider-info'] = array(
    	'id' => 'panoramic-default-slider-info',
    	'label'   => '',
    	'section' => $section,
    	'type'    => 'info',
    	'description' => __( '<a href="https://www.outtheboxthemes.com/documentation/panoramic/homepage-slider/default-slider/" rel="nofollow" target="_blank">Read a guide on how to set up the Default Slider</a>', 'panoramic' ),
    );

    $options['panoramic-slider-plugin-info'] = array(
    	'id' => 'panoramic-slider-plugin-info',
    	'label'   => '',
    	'section' => $section,
    	'type'    => 'info',
    	'description' => __( '<a href="https://www.outtheboxthemes.com/documentation/panoramic/homepage-slider/slider-plugin/" rel="nofollow" target="_blank">Read a guide on using a slider plugin</a>', 'panoramic' ),
    );
    
	$options['panoramic-slider-categories'] = array(
		'id' => 'panoramic-slider-categories',
		'label'   => __( 'Select Categories', 'panoramic' ),
		'section' => $section,
		'type'    => 'dropdown-categories',
		'description' => __( 'Select the categories of the posts you want to display in the slider. The featured image will be the slide image and the post content will display over it. Hold down the Ctrl (windows) / Command (Mac) button to select multiple categories.', 'panoramic' )
	);
	
    $options['panoramic-slider-has-min-width'] = array(
    	'id' => 'panoramic-slider-has-min-width',
    	'label'   => __( 'Slider image has a minimum width', 'panoramic' ),
    	'section' => $section,
    	'type'    => 'checkbox',
    	'default' => 1,
    );
    
    $options['panoramic-slider-min-width'] = array(
    	'id' => 'panoramic-slider-min-width',
    	'label'   => __( 'Minimum Width', 'panoramic' ),
    	'section' => $section,
    	'type'    => 'pixels',
    	'default' => 600
    );
	
    $options['panoramic-slider-transition-speed'] = array(
    	'id' => 'panoramic-slider-transition-speed',
    	'label'   => __( 'Slide Transition Speed', 'panoramic' ),
    	'section' => $section,
    	'type'    => 'text',
    	'default' => 450,
    	'description' => __( 'The speed it takes to transition between slides in milliseconds. 1000 milliseconds equals 1 second.', 'panoramic' )
    );
    
    $options['panoramic-slider-plugin-shortcode'] = array(
    	'id' => 'panoramic-slider-plugin-shortcode',
    	'label'   => __( 'Slider Shortcode', 'panoramic' ),
    	'section' => $section,
    	'type'    => 'text',
    	'description' => __( 'Enter the shortcode given by the slider plugin you\'re using.', 'panoramic' )
    );

    
	// Header Image
	$section = 'header_image';
	
	$sections[] = array(
		'id' => $section,
		'title' => __( 'Header Image', 'panoramic' ),
		'priority' => '35'
	);
	
    $options['panoramic-slider-enabled-warning'] = array(
    	'id' => 'panoramic-slider-enabled-warning',
    	'label'   => __( 'Please note: The header image will not display on your site as the slider is currently enabled. To make the header image visible you will first need to disable the slider.', 'panoramic' ),
    	'section' => $section,
    	'type'    => 'warning',
    	'priority' => 0
    );

    $options['panoramic-header-image-text'] = array(
		'id' => 'panoramic-header-image-text',
        'label'   => __( 'Text', 'panoramic' ),
        'section' => $section,
        'type'    => 'textarea',
    	'description' => esc_html( __( 'Use <h2></h2> tags around heading text and <p></p> tags around body text.', 'panoramic' ) )
    );
	
    
	// WooCommerce
	if ( panoramic_is_woocommerce_activated() ) {
    
	    $panel = 'woocommerce';
	    
	    $panels[] = array(
	    	'id' => $panel,
	    	'title' => __( 'WooCommerce', 'panoramic' ),
	    	'priority' => '30'
	    );    
	
	    	// Product Catalog
		    $section = 'woocommerce_product_catalog';
		    
		    $sections[] = array(
		    	'id' => $section,
		    	'title' => __( 'Product Catalog', 'panoramic' ),
		    	'priority' => '10',
		    	'panel' => $panel
		    );
		    
		    $options['panoramic-layout-woocommerce-shop-full-width'] = array(
		    	'id' => 'panoramic-layout-woocommerce-shop-full-width',
		    	'label'   => __( 'Full width', 'panoramic' ),
		    	'section' => $section,
		    	'type'    => 'checkbox',
		    	'priority' => '0',
		    	'default' => 0
		    );
		    
		    $options['panoramic-woocommerce-products-per-page'] = array(
		    	'id' => 'panoramic-woocommerce-products-per-page',
		    	'label'   => __( 'Products per page', 'panoramic' ),
		    	'section' => $section,
		    	'type'    => 'text',
		    	'default' => get_option('posts_per_page'),
		    	'description' => __( 'How many products should be shown per page?', 'panoramic' )
		    );
	
	    	// Product
		    $section = 'woocommerce-product';
		    
		    $sections[] = array(
		    	'id' => $section,
		    	'title' => __( 'Product', 'panoramic' ),
		    	'priority' => '10',
		    	'panel' => $panel
		    );
		    
		    $options['panoramic-layout-woocommerce-product-full-width'] = array(
		    	'id' => 'panoramic-layout-woocommerce-product-full-width',
		    	'label'   => __( 'Full width', 'panoramic' ),
		    	'section' => $section,
		    	'type'    => 'checkbox',
		    	'default' => get_theme_mod( 'panoramic-layout-woocommerce-shop-full-width', 0 )
		    );
		    
		    $options['panoramic-woocommerce-product-image-zoom'] = array(
		    	'id' => 'panoramic-woocommerce-product-image-zoom',
		    	'label'   => __( 'Enable zoom on product image', 'panoramic' ),
		    	'section' => $section,
		    	'type'    => 'checkbox',
		    	'default' => 1,
		    );
	        
	    	// Product category / tag page
		    $section = 'woocommerce-category-tag-page';
		    
		    $sections[] = array(
		    	'id' => $section,
		    	'title' => __( 'Product Category and Tag Page', 'panoramic' ),
		    	'priority' => '10',
		    	'panel' => $panel
		    );
	    
		    $options['panoramic-layout-woocommerce-category-tag-page-full-width'] = array(
		    	'id' => 'panoramic-layout-woocommerce-category-tag-page-full-width',
		    	'label'   => __( 'Full width', 'panoramic' ),
		    	'section' => $section,
		    	'type'    => 'checkbox',
		    	'priority' => '0',
		    	'default' => get_theme_mod( 'panoramic-layout-woocommerce-shop-full-width', 0 )
		   );

	}
    
	// Colors
    $section = 'colors';
    $font_choices = customizer_library_get_font_choices();
    
    $sections[] = array(
    	'id' => $section,
    	'title' => __( 'Colors', 'panoramic' ),
    	'priority' => '25'
    );    

	$options['panoramic-primary-color'] = array(
		'id' => 'panoramic-primary-color',
		'label'   => __( 'Primary Color', 'panoramic' ),
		'section' => $section,
		'type'    => 'color',
		'default' => $primary_color
	);
	$options['panoramic-secondary-color'] = array(
		'id' => 'panoramic-secondary-color',
		'label'   => __( 'Secondary Color', 'panoramic' ),
		'section' => $section,
		'type'    => 'color',
		'default' => $secondary_color
	);
    
    $options['panoramic-footer-color'] = array(
    	'id' => 'panoramic-footer-color',
    	'label'   => __( 'Footer Color', 'panoramic' ),
    	'section' => $section,
    	'type'    => 'color',
    	'default' => $footer_color
    );
    
    
    // Font Settings
	$section = 'panoramic-fonts';
    $font_choices = customizer_library_get_font_choices();
    
    $sections[] = array(
    	'id' => $section,
    	'title' => __( 'Fonts', 'panoramic' ),
    	'priority' => '25'
    );
    
    $options['panoramic-site-title-font'] = array(
    	'id' => 'panoramic-site-title-font',
    	'label'   => __( 'Site Title Font', 'panoramic' ),
    	'section' => $section,
    	'type'    => 'select',
    	'choices' => $font_choices,
    	'default' => 'Kaushan Script'
    );
    
    $options['panoramic-heading-font'] = array(
    	'id' => 'panoramic-heading-font',
    	'label'   => __( 'Heading Font', 'panoramic' ),
    	'section' => $section,
    	'type'    => 'select',
    	'choices' => $font_choices,
    	'default' => 'Raleway'
    );
    $options['panoramic-heading-font-color'] = array(
    	'id' => 'panoramic-heading-font-color',
    	'label'   => __( 'Heading Font Color', 'panoramic' ),
    	'section' => $section,
    	'type'    => 'color',
    	'default' => $heading_font_color
    );
    
    $options['panoramic-body-font'] = array(
    	'id' => 'panoramic-body-font',
    	'label'   => __( 'Body Font', 'panoramic' ),
    	'section' => $section,
    	'type'    => 'select',
    	'choices' => $font_choices,
    	'default' => 'Lato'
    );
    $options['panoramic-body-font-color'] = array(
    	'id' => 'panoramic-body-font-color',
    	'label'   => __( 'Body Font Color', 'panoramic' ),
    	'section' => $section,
    	'type'    => 'color',
    	'default' => $body_font_color
    );
    
    
    // Blog Settings
    $section = 'panoramic-blog';

    $sections[] = array(
        'id' => $section,
        'title' => __( 'Blog', 'panoramic' ),
        'priority' => '50'
    );
    
	$options['panoramic-blog-featured-image-size'] = array(
		'id' => 'panoramic-blog-featured-image-size',
		'label'   => __( 'Featured Image Size', 'panoramic' ),
		'section' => $section,
		'type'    => 'dropdown-image-size',
		'default' => 'large'
    );	

    $choices = array(
		'panoramic-blog-archive-layout-full' => 'Full post',
		'panoramic-blog-archive-layout-excerpt' => 'Excerpt'
    );
    $options['panoramic-blog-archive-layout'] = array(
        'id' => 'panoramic-blog-archive-layout',
        'label'   => __( 'Text length', 'panoramic' ),
        'section' => $section,
        'type'    => 'select',
        'choices' => $choices,
        'default' => 'panoramic-blog-archive-layout-full'
    );
    
    $options['panoramic-blog-excerpt-length'] = array(
    	'id' => 'panoramic-blog-excerpt-length',
    	'label'   => __( 'Excerpt Length', 'panoramic' ),
    	'section' => $section,
    	'type'    => 'text',
    	'default' => 55
    );
    
    $options['panoramic-blog-read-more-text'] = array(
    	'id' => 'panoramic-blog-read-more-text',
    	'label'   => __( 'Read More Text', 'panoramic' ),
    	'section' => $section,
    	'type'    => 'text',
    	'default' => 'Read More'
    );
    
	if ( class_exists( 'RPW_Extended' ) ) {
		// Recent Posts Widget Extended
	    $section = 'panoramic-recent-posts-widget-extended';
	    
	    $sections[] = array(
	    	'id' => $section,
	    	'title' => __( 'Recent Posts Widget Extended', 'panoramic' ),
	    	'priority' => '50'
	    );
	    
	    $choices = array(
	    	'rpwe-horizontal' => 'Horizontal',
	    	'rpwe-vertical' => 'Vertical'
	    );
	    $options['panoramic-rpwe-site-content-layout'] = array(
	    	'id' => 'panoramic-rpwe-site-content-layout',
	    	'label'   => __( 'Site Content Layout', 'panoramic' ),
	    	'section' => $section,
	    	'type'    => 'select',
	    	'choices' => $choices,
	    	'default' => 'rpwe-horizontal'
	    );
	}    
    
    // Website Text Settings
    $section = 'panoramic-website-text';

    $sections[] = array(
        'id' => $section,
        'title' => __( 'Website Text', 'panoramic' ),
        'priority' => '50'
    );
    $options['panoramic-website-text-404-page-heading'] = array(
    	'id' => 'panoramic-website-text-404-page-heading',
    	'label'   => __( '404 Page Heading', 'panoramic' ),
    	'section' => $section,
    	'type'    => 'text',
    	'default' => __( '404!', 'panoramic')
    );
    $options['panoramic-website-text-404-page-text'] = array(
    	'id' => 'panoramic-website-text-404-page-text',
    	'label'   => __( '404 Page Message', 'panoramic' ),
    	'section' => $section,
    	'type'    => 'textarea',
    	'default' => __( 'The page you were looking for cannot be found!', 'panoramic')
    );

        
	// Adds the sections to the $options array
	$options['sections'] = $sections;

	$customizer_library = Customizer_Library::Instance();
	$customizer_library->add_options( $options );

	// To delete custom mods use: customizer_library_remove_theme_mods();

}
add_action( 'init', 'panoramic_customizer_library_options' );
