<?php
/**
 * Template Name: Gutenberg
 * Template Post Type: Post, Page
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
    
	<?php get_template_part( 'library/template-parts/page-title' ); ?>
    
    <?php while ( have_posts() ) : the_post(); ?>

        <?php get_template_part( 'library/template-parts/content', 'page' ); ?>

        <?php
        // If comments are open or we have at least one comment, load up the comment template
        if ( comments_open() || get_comments_number() ) :
            comments_template();
        endif; ?>

    <?php endwhile; // end of the loop. ?>
	
	<?php //get_template_part( 'library/template-parts/content-wrapper', 'close' ); ?>

<?php get_footer(); ?>