
<div class="featured-image-container loading">
	<?php
	$thumbnail_id 	 = get_post_thumbnail_id($post->ID);
	$thumbnail_image = wp_get_attachment_image_src( $thumbnail_id, get_theme_mod( 'panoramic-blog-featured-image-size', customizer_library_get_default( 'panoramic-blog-featured-image-size' ) ) );
	?>
	
	<img src="<?php echo $thumbnail_image[0]; ?>" width="<?php echo $thumbnail_image[1]; ?>" height="<?php echo $thumbnail_image[2]; ?>" class="featured-image hideUntilLoaded" alt="<?php echo esc_attr( $post->post_title ); ?>" />
</div>
