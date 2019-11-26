<?php
/**
 * Implements styles set in the theme customizer
 *
 * @package Customizer Library Demo
 */

if ( ! function_exists( 'panoramic_customizer_library_build_styles' ) && class_exists( 'Customizer_Library_Styles' ) ) :
/**
 * Process user options to generate CSS needed to implement the choices.
 *
 * @since  1.0.0.
 *
 * @return void
 */
function panoramic_customizer_library_build_styles() {
	
	//if ( wp_is_mobile() ) {
	//	$mobile_menu_breakpoint = 10000000;
	//} else {
		$mobile_menu_breakpoint = 960;
	//}

    // Primary Color
    $color = 'panoramic-primary-color';
    $colormod = get_theme_mod( $color, customizer_library_get_default( $color ) );

    if ( $colormod !== customizer_library_get_default( $color ) ) {

        $sancolor = esc_html( $colormod );
        $sancolor_rgb = customizer_library_hex_to_rgb( $sancolor );

        Customizer_Library_Styles()->add( array(
            'selectors' => array(
                'a,
				.header-image .overlay .opacity h2,
				.panoramic-slider-container.default .slider .slide .overlay .opacity h2,
				.search-btn,
				.site-title a,
				.widget-area .widget a,
                .rpwe-title a,
                .rpwe-block .rpwe-comment,
				.search-button .otb-fa-search,
				.info-text em,
				.woocommerce .woocommerce-breadcrumb a,
				.woocommerce-page .woocommerce-breadcrumb a,
				.woocommerce div.product .woocommerce-tabs ul.tabs li a:hover,
				.woocommerce div.product .woocommerce-tabs ul.tabs li.active a,
				.color-text'
            ),
            'declarations' => array(
                'color' => $sancolor
            )
        ) );
        
		Customizer_Library_Styles()->add( array(
			'selectors' => array(
				'div.wpforms-container form.wpforms-form input[type="text"]:focus,
				div.wpforms-container form.wpforms-form input[type="email"]:focus,
				div.wpforms-container form.wpforms-form input[type="tel"]:focus,
				div.wpforms-container form.wpforms-form input[type="url"]:focus,
				div.wpforms-container form.wpforms-form input[type="password"]:focus,
				div.wpforms-container form.wpforms-form input[type="search"]:focus,
				div.wpforms-container form.wpforms-form select:focus,
				div.wpforms-container form.wpforms-form textarea:focus,
				input[type="text"]:focus,
				input[type="email"]:focus,
				input[type="tel"]:focus,
				input[type="url"]:focus,
				input[type="password"]:focus,
				input[type="search"]:focus,
				select:focus,
				textarea:focus'
			),
			'declarations' => array(
				'border-color' => $sancolor
			)
		) );
        
        Customizer_Library_Styles()->add( array(
        	'selectors' => array(
				'.main-navigation,
				.main-navigation ul ul,
				#comments .form-submit #submit,
				.search-block .search-submit,
				.no-results-btn,
				button,
        		a.button,
				input[type="button"],
				input[type="reset"],
				input[type="submit"],
				.woocommerce ul.products li.product a.add_to_cart_button,
				.woocommerce-page ul.products li.product a.add_to_cart_button,
				.woocommerce ul.products li.product a.button.product_type_simple,
				.woocommerce-page ul.products li.product a.button.product_type_simple,
        		.woocommerce button.button,
				.woocommerce button.button.alt,
				.woocommerce a.button.alt,
				.woocommerce-page button.button.alt,
				.woocommerce input.button.alt,
				.woocommerce-page #content input.button.alt,
				.woocommerce .cart-collaterals .shipping_calculator .button,
				.woocommerce-page .cart-collaterals .shipping_calculator .button,
				.woocommerce a.button,
				.woocommerce-page a.button,
				.woocommerce input.button,
				.woocommerce-page #content input.button,
				.woocommerce-page input.button,
				.woocommerce #review_form #respond .form-submit input,
				.woocommerce-page #review_form #respond .form-submit input,
				.woocommerce #respond input#submit.alt.disabled,
				.woocommerce #respond input#submit.alt.disabled:hover,
				.woocommerce #respond input#submit.alt:disabled,
				.woocommerce #respond input#submit.alt:disabled:hover,
				.woocommerce #respond input#submit.alt:disabled[disabled],
				.woocommerce #respond input#submit.alt:disabled[disabled]:hover,
        		
				.woocommerce button.button:disabled,
				.woocommerce button.button:disabled[disabled],
				.woocommerce button.button:disabled:hover,
				.woocommerce button.button:disabled[disabled]:hover,
				.woocommerce button.button.alt:disabled,
				.woocommerce button.button.alt:disabled[disabled],
				.woocommerce button.button.alt:disabled,
				.woocommerce button.button.alt:disabled:hover,
				.woocommerce button.button.alt:disabled[disabled],
				.woocommerce button.button.alt:disabled[disabled]:hover,
				.woocommerce button.button,
				.woocommerce button.button.alt,
				.woocommerce button.button.alt.disabled,
				.woocommerce button.button.alt.disabled:hover,
				.woocommerce a.button.alt,
				.woocommerce-page button.button.alt,
				.woocommerce input.button.alt,

        		.widget_search .search-submit,
				.widget_product_search .search-submit,
				.wpcf7-submit,
        		div.wpforms-container form.wpforms-form input[type=submit],
				div.wpforms-container form.wpforms-form button[type=submit],
				div.wpforms-container form.wpforms-form .wpforms-page-button,
				.site-footer-bottom-bar,
        		.testimonials .sow-slider-base .sow-slide-nav'
			),
        	'declarations' => array(
        		'background-color' => $sancolor
        	)
		) );
        
        Customizer_Library_Styles()->add( array(
        	'selectors' => array(
        		'.main-navigation.translucent,
        		#main-menu.panoramic-mobile-menu-standard-color-scheme'
        	),
        	'declarations' => array(
        		'background-color' => $sancolor . ' !important'
        	),
        	'media' => '(max-width: ' .$mobile_menu_breakpoint. 'px)'
        ) );
        
        Customizer_Library_Styles()->add( array(
        	'selectors' => array(
				'.main-navigation.translucent'
        	),
        	'declarations' => array(
        		'background-color' => 'rgba(' .$sancolor_rgb['r']. ',' .$sancolor_rgb['g']. ',' .$sancolor_rgb['b']. ', 0.7)'
			)
		) );
        
        Customizer_Library_Styles()->add( array(
			'selectors' => array(
				'.header-cart-checkout.cart-has-items .otb-fa-shopping-cart'
        	),
        	'declarations' => array(
        		'background-color' => $sancolor . ' !important'
			)
        ) );
        
        Customizer_Library_Styles()->add( array(
        	'selectors' => array(
        		'.woocommerce .woocommerce-info,
        		.woocommerce .woocommerce-message'
        	),
        	'declarations' => array(
        		'border-top-color' => $sancolor
        	)
        ) );
        
		Customizer_Library_Styles()->add( array(
        	'selectors' => array(
				'::-moz-selection'
			),
			'declarations' => array(
				'background-color' => $sancolor
			)
		) );

		Customizer_Library_Styles()->add( array(
        	'selectors' => array(
				'::selection'
			),
			'declarations' => array(
				'background-color' => $sancolor
			)
		) );

    }

    // Secondary Color
    $color = 'panoramic-secondary-color';
    $colormod = get_theme_mod( $color, customizer_library_get_default( $color ) );

    if ( $colormod !== customizer_library_get_default( $color ) ) {

    	$sancolor = esc_html( $colormod );

        Customizer_Library_Styles()->add( array(
            'selectors' => array(
                'a:hover,
				.widget-area .widget a:hover,
                .rpwe-title a:hover,
                .rpwe-block .rpwe-comment:hover,
				.search-btn:hover,
				.search-button .otb-fa-search:hover,
				.site-header .site-top-bar-left a:hover,
				.site-header .site-top-bar-right a:hover,
				.site-header .site-header-right a:hover,
				.woocommerce .woocommerce-breadcrumb a:hover,
				.woocommerce-page .woocommerce-breadcrumb a:hover,
				.woocommerce #content div.product .woocommerce-tabs ul.tabs li.active,
				.woocommerce div.product .woocommerce-tabs ul.tabs li.active,
				.woocommerce-page #content div.product .woocommerce-tabs ul.tabs li.active,
				.woocommerce-page div.product .woocommerce-tabs ul.tabs li.active'
            ),
            'declarations' => array(
                'color' => $sancolor
            )
        ) );
        
        Customizer_Library_Styles()->add( array(
        	'selectors' => array(
        		'.main-navigation button:hover,
				#comments .form-submit #submit:hover,
				.search-block .search-submit:hover,
				.no-results-btn:hover,
				button:hover,
        		a.button:hover,
				input[type="button"]:hover,
				input[type="reset"]:hover,
				input[type="submit"]:hover,
				.site-header .site-top-bar-right a:hover .header-cart-checkout .otb-fa,
				.site-header .site-header-right a:hover .header-cart-checkout .otb-fa,
				.woocommerce input.button.alt:hover,
				.woocommerce-page #content input.button.alt:hover,
				.woocommerce .cart-collaterals .shipping_calculator .button,
				.woocommerce-page .cart-collaterals .shipping_calculator .button,
				.woocommerce a.button:hover,
				.woocommerce-page a.button:hover,
				.woocommerce input.button:hover,
				.woocommerce-page #content input.button:hover,
				.woocommerce-page input.button:hover,
				.woocommerce ul.products li.product a.add_to_cart_button:hover,
				.woocommerce-page ul.products li.product a.add_to_cart_button:hover,
				.woocommerce ul.products li.product a.button.product_type_simple:hover,
				.woocommerce-page ul.products li.product a.button.product_type_simple:hover,
        		.woocommerce button.button:hover,
				.woocommerce button.button.alt:hover,
				.woocommerce a.button.alt:hover,
				.woocommerce-page button.button.alt:hover,
				.woocommerce #review_form #respond .form-submit input:hover,
				.woocommerce-page #review_form #respond .form-submit input:hover,
        		.widget_search .search-submit:hover,
				.widget_product_search .search-submit:hover,
				.wpcf7-submit:hover,
        		div.wpforms-container form.wpforms-form input[type=submit]:hover,
				div.wpforms-container form.wpforms-form button[type=submit]:hover,
				div.wpforms-container form.wpforms-form .wpforms-page-button:hover,
        		.testimonials .sow-slider-base .sow-slide-nav:hover'
        	),
        	'declarations' => array(
        		'background-color' => $sancolor
        	)
		) );
        
    }
    
    
    // Footer Color
    $color = 'panoramic-footer-color';
    $colormod = get_theme_mod( $color, customizer_library_get_default( $color ) );
    
    if ( $colormod !== customizer_library_get_default( $color ) ) {
    
    	$sancolor = esc_html( $colormod );
    
    	Customizer_Library_Styles()->add( array(
    		'selectors' => array(
    			'.site-footer'
    		),
    		'declarations' => array(
    			'background-color' => $sancolor
    		)
    	) );
    
    }
    

    // Site Title Font
    $font = 'panoramic-site-title-font';
    $fontmod = get_theme_mod( $font, customizer_library_get_default( $font ) );
    $fontstack = customizer_library_get_font_stack( $fontmod );
    
    if ( $fontmod != customizer_library_get_default( $font ) ) {
    
    	Customizer_Library_Styles()->add( array(
    		'selectors' => array(
    			'.site-header .branding .title'
    		),
    		'declarations' => array(
    			'font-family' => $fontstack
    		)
    	) );
    
    }
    
    
    // Heading Font
    $font = 'panoramic-heading-font';
    $fontmod = get_theme_mod( $font, customizer_library_get_default( $font ) );
    $fontstack = customizer_library_get_font_stack( $fontmod );
    
    if ( $fontmod != customizer_library_get_default( $font ) ) {
    
    	Customizer_Library_Styles()->add( array(
    		'selectors' => array(
    			'h1, h2, h3, h4, h5, h6,
				h1 a, h2 a, h3 a, h4 a, h5 a, h6 a,
				.site-footer-widgets ul li h2.widgettitle,
				.header-image .overlay .opacity h2,
				.panoramic-slider-container.default .slider .slide .overlay .opacity h2,
				.woocommerce a.button,
				.woocommerce-page a.button,
				.woocommerce a.button.alt,
				.woocommerce table.cart th,
				.woocommerce-page #content table.cart th,
				.woocommerce-page table.cart th,
				.woocommerce input.button.alt,
				.woocommerce-page #content input.button.alt,
				.woocommerce table.cart input,
				.woocommerce-page #content table.cart input,
				.woocommerce-page table.cart input,
				.woocommerce #respond input#submit,
				.woocommerce a.button,
				.woocommerce button.button,
				.woocommerce input.button,
				button,
    			a.button,
    			div.wpforms-container form.wpforms-form input[type=submit],
				div.wpforms-container form.wpforms-form button[type=submit],
				div.wpforms-container form.wpforms-form .wpforms-page-button,
    			input[type="button"],
				input[type="reset"],
				input[type="submit"]'
    		),
    		'declarations' => array(
    			'font-family' => $fontstack
    		)
    	) );
    
    }

    // Heading Font Color
    $fontcolor = 'panoramic-heading-font-color';
    $fontcolormod = get_theme_mod( $fontcolor, customizer_library_get_default( $fontcolor ) );
    
    if ( $fontcolormod !== customizer_library_get_default( $fontcolor ) ) {
    
    	$sanfontcolor = esc_html( $fontcolormod );
    
    	Customizer_Library_Styles()->add( array(
    		'selectors' => array(
    			'h1, h2, h3, h4, h5, h6,
				h1 a, h2 a, h3 a, h4 a, h5 a, h6 a,
				.site-footer-widgets ul li h2.widgettitle'
    		),
    		'declarations' => array(
    			'color' => $sanfontcolor
    		)
    	) );
    	 
    }
    

    // Body Font
    $font = 'panoramic-body-font';
    $fontmod = get_theme_mod( $font, customizer_library_get_default( $font ) );
    $fontstack = customizer_library_get_font_stack( $fontmod );

    if ( $fontmod != customizer_library_get_default( $font ) ) {

        Customizer_Library_Styles()->add( array(
            'selectors' => array(
	            'body,
				.site-header .site-top-bar-left a,
				.site-header .site-top-bar-right a,
				.site-header .site-header-right a,
				.breadcrumbs,
	            div.wpforms-container form.wpforms-form .wpforms-field-label,
				div.wpforms-container form.wpforms-form input[type="text"],
				div.wpforms-container form.wpforms-form input[type="email"],
				div.wpforms-container form.wpforms-form input[type="tel"],
				div.wpforms-container form.wpforms-form input[type="url"],
				div.wpforms-container form.wpforms-form input[type="password"],
				div.wpforms-container form.wpforms-form input[type="search"],
				div.wpforms-container form.wpforms-form select,
				div.wpforms-container form.wpforms-form textarea,
				input[type="text"],
				input[type="email"],
				input[type="tel"],
				input[type="url"],
				input[type="password"],
				input[type="search"],
				select,
				textarea,
				.site-footer-widgets .widget a,
				.header-image .overlay .opacity p,
				.panoramic-slider-container.default .slider .slide .overlay .opacity p'
			),
            'declarations' => array(
                'font-family' => $fontstack
            )
        ) );

    }
    
    // Body Font Color
    $fontcolor = 'panoramic-body-font-color';
    $fontcolormod = get_theme_mod( $fontcolor, customizer_library_get_default( $fontcolor ) );
    
    if ( $fontcolormod !== customizer_library_get_default( $fontcolor ) ) {

        $sanfontcolor = esc_html( $fontcolormod );
        $sanfontcolor_rgb = customizer_library_hex_to_rgb( $sanfontcolor );

        Customizer_Library_Styles()->add( array(
            'selectors' => array(
                'body,
				.site-header .site-top-bar-left a,
				.site-header .site-top-bar-right a,
				.site-header .site-header-right a,
				.breadcrumbs,
				input[type="text"],
				input[type="email"],
				input[type="tel"],
				input[type="url"],
				input[type="password"],
				input[type="search"],
                select,
				textarea,
				.search-block .search-field,
				.select2-drop,
				.select2-container .select2-choice,
				.select2-results .select2-highlighted,
				.woocommerce .woocommerce-breadcrumb,
				.woocommerce-page .woocommerce-breadcrumb,
				.header-image .overlay .opacity p,
				.panoramic-slider-container.default .slider .slide .overlay .opacity p,
				.woocommerce .woocommerce-ordering select,
				.woocommerce-page .woocommerce-ordering select,
				.woocommerce #content .quantity input.qty,
				.woocommerce .quantity input.qty,
				.woocommerce-page #content .quantity input.qty,
				.woocommerce-page .quantity input.qty,
                .woocommerce ul.products li.product .price,
				.woocommerce #content ul.products li.product span.price,
				.woocommerce-page #content ul.products li.product span.price,
				.woocommerce #content div.product p.price,
				.woocommerce-page #content div.product p.price,
				.woocommerce-page div.product p.price,
				.woocommerce #content div.product span.price,
				.woocommerce div.product span.price,
				.woocommerce-page #content div.product span.price,
				.woocommerce-page div.product span.price,
				.woocommerce div.product .woocommerce-tabs ul.tabs li a,
                .woocommerce #reviews #comments ol.commentlist li .meta,
				#add_payment_method #payment div.payment_box,
				.woocommerce-checkout #payment div.payment_box,
                .rpwe-block .rpwe-time,
				.widget-area .widget h2,
                .testimonials .sow-slider-base ul.sow-slider-images .sow-slider-image-wrapper p'
            ),
            'declarations' => array(
                'color' => $sanfontcolor
            )
        ) );

        Customizer_Library_Styles()->add( array(
        	'selectors' => array(
        		'.select2-default'
        	),
        	'declarations' => array(
        		'color' => 'rgba(' .$sanfontcolor_rgb['r']. ',' .$sanfontcolor_rgb['g']. ',' .$sanfontcolor_rgb['b']. ', 0.7) !important'
        	)
        ) );
         
        Customizer_Library_Styles()->add( array(
        	'selectors' => array(
        		'::-webkit-input-placeholder'
        	),
        	'declarations' => array(
        		'color' => 'rgba(' .$sanfontcolor_rgb['r']. ',' .$sanfontcolor_rgb['g']. ',' .$sanfontcolor_rgb['b']. ', 0.7)'
        	)
        ) );
        Customizer_Library_Styles()->add( array(
        	'selectors' => array(
        		':-moz-placeholder'
        	),
        	'declarations' => array(
        		'color' => 'rgba(' .$sanfontcolor_rgb['r']. ',' .$sanfontcolor_rgb['g']. ',' .$sanfontcolor_rgb['b']. ', 0.7)'
        	)
        ) );
        Customizer_Library_Styles()->add( array(
        	'selectors' => array(
        		'::-moz-placeholder'
        	),
        	'declarations' => array(
        		'color' => 'rgba(' .$sanfontcolor_rgb['r']. ',' .$sanfontcolor_rgb['g']. ',' .$sanfontcolor_rgb['b']. ', 0.7)'
        	)
        ) );
        Customizer_Library_Styles()->add( array(
        	'selectors' => array(
        		':-ms-input-placeholder'
        	),
        	'declarations' => array(
        		'color' => 'rgba(' .$sanfontcolor_rgb['r']. ',' .$sanfontcolor_rgb['g']. ',' .$sanfontcolor_rgb['b']. ', 0.7)'
        	)
        ) );
        
        Customizer_Library_Styles()->add( array(
        	'selectors' => array(
        		'.header-cart-checkout .otb-fa'
        	),
        	'declarations' => array(
        		'background-color' => $sanfontcolor
        	)
        ) );
        
    }

}
endif;

add_action( 'customizer_library_styles', 'panoramic_customizer_library_build_styles' );

if ( ! function_exists( 'panoramic_customizer_library_styles' ) ) :
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
function panoramic_customizer_library_styles() {

	do_action( 'customizer_library_styles' );

	// Echo the rules
	$css = Customizer_Library_Styles()->build();

	if ( ! empty( $css ) ) {
		echo "\n<!-- Begin Custom CSS -->\n<style type=\"text/css\" id=\"out-the-box-custom-css\">\n";
		echo $css;
		echo "\n</style>\n<!-- End Custom CSS -->\n";
	}
}
endif;

add_action( 'wp_head', 'panoramic_customizer_library_styles', 11 );