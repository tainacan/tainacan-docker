<?php
if ( get_theme_mod( 'panoramic-slider-type', 'panoramic-no-slider' ) == 'panoramic-slider-plugin' ) :
?>
	<div class="panoramic-slider-container">
		<?php
		if ( get_theme_mod( 'panoramic-slider-plugin-shortcode', '' ) != '' ) {
			echo do_shortcode( sanitize_text_field( get_theme_mod( 'panoramic-slider-plugin-shortcode' ) ) );
		}
		?>
	</div>
<?php
else :
    
    $slider_categories = '';

    if ( get_theme_mod( 'panoramic-slider-categories', '' ) != '' ) {
        $slider_categories = get_theme_mod( 'panoramic-slider-categories', '' );
        
		$slider_query = new WP_Query( 'cat=' . implode(',', $slider_categories) . '&posts_per_page=-1&orderby=date&order=DESC&id=slider' );
	        
		if ( $slider_query->have_posts() ) :
?>
			<div class="panoramic-slider-container default loading">
				<div class="prev top-padded">
					<i class="otb-fa otb-fa-angle-left"></i>
				</div>
				<div class="next top-padded">
					<i class="otb-fa otb-fa-angle-right"></i>
				</div>
			
				<ul class="slider">
			                    
					<?php
					while ( $slider_query->have_posts() ) : $slider_query->the_post();
					?>
			                    
					<li class="slide">
						<?php
						if ( has_post_thumbnail() ) :
							the_post_thumbnail( 'full', array( 'class' => '' ) );
						endif;
						?>
						
			            <?php 
			            $content = trim( get_the_content() );
			            
			            if ( !empty( $content ) ) {
			            ?>
						<div class="overlay top-padded">
							<div class="opacity">
								<?php echo $content; ?>
							</div>
						</div>
						<?php 
						}
						?>
					</li>
			                    
					<?php
					endwhile;
					?>
			                    
				</ul>
				
				<div class="pagination"></div>
				
			</div>
	
<?php
		else :
?>
			<div class="slider-placeholder"></div>
<?php
		endif;
		wp_reset_query();
	}
    
endif;
?>