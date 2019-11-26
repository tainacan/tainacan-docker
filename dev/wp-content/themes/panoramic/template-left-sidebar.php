<?php
/**
 * Template Name: Left Sidebar
 *
 */
get_header(); ?>
    
    <?php //get_template_part( 'library/template-parts/content-wrapper', 'open' ); ?>
    
    <?php if ( ! is_front_page() ) : ?>
    
        <?php if ( function_exists( 'bcn_display' ) ) : ?>
        <div class="breadcrumbs">
            <?php bcn_display(); ?>
        </div>
        <?php endif; ?>
        
    <?php endif; ?>

    <?php get_sidebar(); ?>
    
	<div id="primary" class="content-area <?php echo esc_attr( get_theme_mod( 'panoramic-rpwe-site-content-layout', customizer_library_get_default( 'panoramic-rpwe-site-content-layout' ) ) ); ?> <?php echo esc_attr( !is_active_sidebar( 'sidebar-1' ) ? 'full-width' : '' ); ?>">
		<main id="main" class="site-main" role="main">
            
            <?php get_template_part( 'library/template-parts/page-title' ); ?>

			<?php while ( have_posts() ) : the_post(); ?>

				<?php get_template_part( 'library/template-parts/content', 'page' ); ?>

				<?php
					// If comments are open or we have at least one comment, load up the comment template
					if ( comments_open() ) :
						comments_template();
					endif;
				?>

			<?php endwhile; // end of the loop. ?>

		</main><!-- #main -->
	</div><!-- #primary -->
	
	<?php //get_template_part( 'library/template-parts/content', 'close' ); ?>

<?php get_footer(); ?>
