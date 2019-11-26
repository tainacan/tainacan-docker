<ul class="social-links">
<?php
if( get_theme_mod( 'panoramic-social-email', '' ) != '' ) :
    echo '<li><a href="' . esc_url( 'mailto:' . antispambot( get_theme_mod( 'panoramic-social-email' ), 1 ) ) . '" title="' . esc_attr( __( 'Send us an email', 'panoramic' ) ) . '" class="social-email"><i class="otb-fa otb-fa-envelope-o"></i></a></li>';
endif;

if( get_theme_mod( 'panoramic-social-skype', '' ) != '' ) :
    echo '<li><a href="skype:' . esc_html( get_theme_mod( 'panoramic-social-skype' ) ) . '?userinfo" title="' . esc_attr( __( 'Contact us on Skype', 'panoramic' ) ) . '" class="social-skype"><i class="otb-fa otb-fa-skype"></i></a></li>';
endif;

if( get_theme_mod( 'panoramic-social-tumblr', '' ) != '' ) :
    echo '<li><a href="' . esc_url( get_theme_mod( 'panoramic-social-tumblr' ) ) . '" target="_blank" title="' . esc_attr( __( 'Find us on Tumblr', 'panoramic' ) ) . '" class="social-tumblr"><i class="otb-fa otb-fa-tumblr"></i></a></li>';
endif;

if( get_theme_mod( 'panoramic-social-flickr', '' ) != '' ) :
    echo '<li><a href="' . esc_url( get_theme_mod( 'panoramic-social-flickr' ) ) . '" target="_blank" title="' . esc_attr( __( 'Find us on Flickr', 'panoramic' ) ) . '" class="social-flickr"><i class="otb-fa otb-fa-flickr"></i></a></li>';
endif;

if( get_theme_mod( 'panoramic-header-search', true ) ) :
	echo '<li><i class="otb-fa otb-fa-search search-btn"></i></li>';
endif;
?>
</ul>