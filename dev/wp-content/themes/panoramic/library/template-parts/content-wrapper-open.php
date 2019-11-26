<?php
$page_template = basename( get_page_template() );
$no_sidebar = false;

if ( ( $page_template == 'template-left-sidebar.php' && !is_active_sidebar( 'sidebar-1' ) ) ) {
	$no_sidebar = true;
}
?>

<div id="content" class="site-content site-container <?php echo esc_attr( ( $no_sidebar ) ? 'no-sidebar' : '' ); ?>">