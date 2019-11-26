    
    <div class="site-top-bar border-bottom">
        
        <div class="site-container">
            
            <?php
            if ( wp_kses_post( get_theme_mod( 'panoramic-header-info-text', '<strong><em>CALL US:</em></strong> 555-PANORAMIC' ) ) != "" ) {
            ?>
            <div class="site-top-bar-left">
				<div class="info-text"><?php echo wp_kses_post( pll__( get_theme_mod( 'panoramic-header-info-text', __( '<strong><em>CALL US:</em></strong> 555-PANORAMIC', 'panoramic' ) ) ) ) ?></div>
            </div>
            <?php 
            }
            ?>
            
            <div class="site-top-bar-right">
                
                <?php
				if ( panoramic_is_woocommerce_activated() && get_theme_mod( 'panoramic-header-shop-links', true ) ) {
					get_template_part( 'library/template-parts/shop-links' );
                } else {
                	get_template_part( 'library/template-parts/social-links' );
                }
                ?>
                
            </div>
            <div class="clearboth"></div>
            
        </div>
    </div>
