<style type="text/css">

<?php
if ( $panoramic_slider_has_min_width ) {
?>

/* Minimum slider width */
.panoramic-slider-container.default .slider .slide img {
	min-width: <?php echo $panoramic_slider_min_width; ?>px;
}
	
<?php
}
?>

/* Mobile Menu and other mobile stylings */
<?php
echo '@media only screen and (max-width: ' .$mobile_menu_breakpoint. 'px) {';
?>

	.main-navigation.translucent {
		position: relative;
	}
	
	.main-navigation.translucent {
		background-color: #006489 !important;
	}

	#main-menu.panoramic-mobile-menu-standard-color-scheme {
		background-color: #006489;
	}	
	
	.slider-placeholder {
		display: none;
	}
	
	.header-image .overlay,
	.panoramic-slider-container.default .slider .slide .overlay {
		top: 25%;
    }
	
	.panoramic-slider-container.default .prev.top-padded,
	.panoramic-slider-container.default .next.top-padded{
		margin-top: -26px;
	}
	.header-image .overlay.top-padded,
	.panoramic-slider-container.default .slider .slide .overlay.top-padded {
		padding-top: 0;
	}

	/* Menu toggle button */
    .header-menu-button {
	    display: block;
	    padding: 16px 18px;
	    color: #FFF;
	    text-transform: uppercase;
    	text-align: center;
	    cursor: pointer;
	}
	.header-menu-button .otb-fa.otb-fa-bars {
    	font-size: 28px;
		color: #FFFFFF;
	}
	
	/* Menu close button */
    .main-menu-close {
        display: block;
    	background-color: rgba(0, 0, 0, 0.2);
    	border-radius: 100%;
        position: absolute;
        top: 15px;
        left: 15px;
        font-size: 26px;
        color: #FFFFFF;
        text-align: center;
        padding: 0 6px 0 10px;
        height: 36px;
    	width: 36px;
        line-height: 33px;
        cursor: pointer;
    	
	    -webkit-transition: all 0.2s ease 0s;
	     -moz-transition: all 0.2s ease 0s;
	      -ms-transition: all 0.2s ease 0s;
	       -o-transition: all 0.2s ease 0s;
	          transition: all 0.2s ease 0s;

    }
    .main-menu-close:hover .otb-fa {
    	font-weight: 700 !important;
	}
	.main-menu-close .otb-fa-angle-left {
        position: relative;
        left: -4px;
    }
	
    .main-navigation ul {
        display: block;
    }

    .main-navigation #main-menu {
        color: #FFFFFF;
        box-shadow: 1px 0 1px rgba(255, 255, 255, 0.04) inset;
        position: fixed;
        top: 0;
        right: -280px;
        width: 280px;
        max-width: 100%;
        -ms-box-sizing: border-box;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        padding: 70px 0 30px 0;
        z-index: 100000;
        height: 100%;
        overflow: auto;
        -webkit-transition: right 0.4s ease 0s;
        -moz-transition: right 0.4s ease 0s;
        -ms-transition: right 0.4s ease 0s;
        -o-transition: right 0.4s ease 0s;
        transition: right 0.4s ease 0s;
    }
    #main-menu .menu {
    	border-top-width: 1px;
    	border-top-style: solid;
	}
    #main-menu.panoramic-mobile-menu-standard-color-scheme .menu {
    	border-top-color: #FFFFFF;
	}
	.main-navigation li {
        display: block;
        float: none;
        position: relative;
    }
    .main-navigation li a {
    	white-space: normal !important;
    	border-bottom-width: 1px;
    	border-bottom-style: solid;
		box-shadow: none;
		display: block;
		color: #FFFFFF;
        float: none;
        padding: 10px 22px;
        font-size: 14px;
        text-align: left;
  	}
    #main-menu.panoramic-mobile-menu-standard-color-scheme li a {
    	border-bottom-color: #FFFFFF;
	}
    #main-menu.panoramic-mobile-menu-standard-color-scheme li a:hover {
    	background-color: rgba(0, 0, 0, 0.2); 
  	}
    .main-navigation ul ul a {
    	text-transform: none;
  	}
    .main-navigation ul ul li:last-child a,
    .main-navigation ul ul li a {
        padding: 6px 30px;
        width: auto;
    }
    .main-navigation ul ul ul li a {
        padding: 6px 39px !important;
    }
    .main-navigation ul ul ul ul li a {
        padding: 6px 47px !important;
    }
    .main-navigation ul ul ul ul ul li a {
        padding: 6px 55px !important;
    }

    .main-navigation ul ul {
        position: relative !important;
    	box-shadow: none;
        top: 0 !important;
        left: 0 !important;
        float: none !important;
    	background-color: transparent;
        padding: 0;
        margin: 0;
        display: none;
    	border-top: none;
    }
	.main-navigation ul ul ul {
		left: 0 !important;
	}
	.menu-dropdown-btn {
    	display: block;
    }
    .open-page-item > ul.children,
    .open-page-item > ul.sub-menu {
    	display: block !important;
    }
    .open-page-item .otb-fa-angle-down {
		color: #FFFFFF;
    	font-weight: 700 !important;
    }
    
    /* 1st level selected item */
    #main-menu.panoramic-mobile-menu-standard-color-scheme a:hover,
	#main-menu.panoramic-mobile-menu-standard-color-scheme li.current-menu-item > a,
	#main-menu.panoramic-mobile-menu-standard-color-scheme li.current_page_item > a,
	#main-menu.panoramic-mobile-menu-standard-color-scheme li.current-menu-parent > a,
	#main-menu.panoramic-mobile-menu-standard-color-scheme li.current_page_parent > a,
	#main-menu.panoramic-mobile-menu-standard-color-scheme li.current-menu-ancestor > a,
	#main-menu.panoramic-mobile-menu-standard-color-scheme li.current_page_ancestor > a {
		background-color: rgba(0, 0, 0, 0.2) !important;
	}

	/* 2nd level selected item */
	#main-menu.panoramic-mobile-menu-standard-color-scheme ul ul li.current-menu-item > a,
	#main-menu.panoramic-mobile-menu-standard-color-scheme ul ul li.current_page_item > a,
	#main-menu.panoramic-mobile-menu-standard-color-scheme ul ul li.current-menu-parent > a,
	#main-menu.panoramic-mobile-menu-standard-color-scheme ul ul li.current_page_parent > a,
	#main-menu.panoramic-mobile-menu-standard-color-scheme ul ul li.current-menu-ancestor > a,
	#main-menu.panoramic-mobile-menu-standard-color-scheme ul ul li.current_page_ancestor > a {
		background-color: rgba(0, 0, 0, 0.2);
	}
	
	/* 3rd level selected item */
	#main-menu.panoramic-mobile-menu-standard-color-scheme ul ul ul li.current-menu-item > a,
	#main-menu.panoramic-mobile-menu-standard-color-scheme ul ul ul li.current_page_item > a,
	#main-menu.panoramic-mobile-menu-standard-color-scheme ul ul ul li.current-menu-parent > a,
	#main-menu.panoramic-mobile-menu-standard-color-scheme ul ul ul li.current_page_parent > a,
	#main-menu.panoramic-mobile-menu-standard-color-scheme ul ul ul li.current-menu-ancestor > a,
	#main-menu.panoramic-mobile-menu-standard-color-scheme ul ul ul li.current_page_ancestor > a {
		background-color: rgba(0, 0, 0, 0.2);
	}

}

</style>
