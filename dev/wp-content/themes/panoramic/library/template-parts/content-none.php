<?php
/**
 * The template part for displaying a message that posts cannot be found.
 *
 * @package panoramic
 */
?>

<section class="no-results not-found">
	<header class="page-header">
		<h1 class="page-title centered top-padded"><?php echo wp_kses_post( pll__( get_theme_mod( 'panoramic-website-text-no-search-results-heading', __( 'Nothing Found!', 'panoramic' ) ) ) ); ?></h1>
	</header><!-- .page-header -->

	<div class="page-content">
		<?php if ( is_home() && current_user_can( 'publish_posts' ) ) : ?>

			<p>
				<?php printf( __( 'Ready to publish your first post? <a href="%1$s">Get started here</a>.', 'panoramic' ), esc_url( admin_url( 'post-new.php' ) ) ); ?>
			</p>
		
		<?php elseif ( is_search() ) : ?>
        
            <p class="centered">
            	<?php echo wp_kses_post( pll__( get_theme_mod( 'panoramic-website-text-no-search-results-text', __( 'Sorry, but nothing matched your search terms. Please try again with some different keywords.', 'panoramic' ) ) ) ); ?>
            </p>
            
			<p class="centered">
				<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="button"><?php _e( 'Back to Homepage', 'panoramic' ); ?></a>
			</p>
		
		<?php else : ?>

			<p class="centered">
				<?php echo wp_kses_post( get_theme_mod( 'panoramic-website-text-no-search-results-text', __( 'Sorry, but nothing matched your search terms. Please try again with some different keywords.', 'panoramic' ) ) ); ?>
			</p>
			
			<p class="centered">
				<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="button"><?php _e( 'Back to Homepage', 'panoramic' ); ?></a>
			</p>

		<?php endif; ?>
        
	</div><!-- .page-content -->
    <div class="clearboth"></div>
    
</section><!-- .no-results -->
