<?php if ( ! defined( 'GRIDS' ) ) die( 'Forbidden' );

$sizes = array();
global $_wp_additional_image_sizes;

$sizes = array(
	'full' => array(
		'width'  => true,
		'height' => true,
		'crop'   => false,
		'label' => __( 'Full size', 'grids' )
	),
	'large' => array(
		'width'  => intval( get_option( 'large_size_w' ) ),
		'height' => intval( get_option( 'large_size_h' ) ),
		'crop'   => false,
		'label' => __( 'Large', 'grids' )
	),
	'medium' => array(
		'width'  => intval( get_option( 'medium_size_w' ) ),
		'height' => intval( get_option( 'medium_size_h' ) ),
		'crop'   => false,
		'label' => __( 'Medium', 'grids' )
	),
	'thumbnail' => array(
		'width'  => intval( get_option( 'thumbnail_size_w' ) ),
		'height' => intval( get_option( 'thumbnail_size_h' ) ),
		'crop'   => (bool) get_option( 'thumbnail_crop' ),
		'label' => __( 'Thumbnail', 'grids' )
	),
);

if ( $_wp_additional_image_sizes ) {
	foreach ( $_wp_additional_image_sizes as $handle => $size ) {
		$sizes[ $handle ] = $size;
		$sizes[ $handle ][ 'label' ] = $handle;
	}
}

$breakpoints = array(
	'desktop' => array(
		'label' => __( 'Desktop', 'grids' ),
		'min' => '',
		'max' => '',
		'media' => ''
	),
	'tablet' => array(
		'label' => __( 'Tablet', 'grids' ),
		'min' => '',
		'max' => '1024',
		'media' => ''
	),
	'mobile' => array(
		'label' => __( 'Mobile', 'grids' ),
		'min' => '',
		'max' => '768',
		'media' => ''
	)
);

$strings = array(
	'plugin' => array(
		'name' => 'Grids'
	),
	'layouts' => array(
		'full' => __( 'Full', 'grids' ),
		'50'   => __( '50%', 'grids' ),
		'33'   => __( '33%', 'grids' ),
		'25'   => __( '25%', 'grids' )
	),
	'area' => array(
		'title'                     => __( 'Area', 'grids' ),
		'description'               => __( 'A container for content blocks.', 'grids' ),
		'vertical_alignment'        => __( 'Vertical alignment', 'grids' ),
		'vertical_alignment_top'    => _x( 'Top', 'vertical alignment', 'grids' ),
		'vertical_alignment_center' => _x( 'Center', 'vertical alignment', 'grids' ),
		'vertical_alignment_bottom' => _x( 'Bottom', 'vertical alignment', 'grids' ),
	),
	'section' => array(
		'title'       => __( 'Section', 'grids' ),
		'description' => __( 'A grid layout container.', 'grids' ),
		'layout'      => __( 'Section layout', 'grids' ),
		'edit'        => __( 'Edit section', 'grids' ),
		'placeholder' => array(
			'grid_designer'         => __( 'Grid designer', 'grids' ),
			'select_layout'         => __( 'Select a layout', 'grids' ),
			'select_layout_help'    => __( 'Select a layout preset or design your own grid.', 'grids' ),
			'grid_designer_help'    => __( 'Drag around the grid to create content areas and drag them in the sidebar to determine their order in the page markup.', 'grids' ),
			'remove_area'           => __( 'Remove Area', 'grids' ),
			'insert_in_page'        => __( 'Insert in page', 'grids' ),
			'confirm_layout_change' => __( 'Ok', 'grids' ),
		)
	),
	'components' => array(
		'media_switch' => array(
			'device' => __( 'Device', 'grids' )
		),
		'background' => array(
			'title'                      => __( 'Background', 'grids' ),
			'color'                      => __( 'Background color', 'grids' ),
			'image'                      => __( 'Background image', 'grids' ),
			'media_library'              => __( 'Media Library', 'grids' ),
			'remove_image'               => __( 'Remove image', 'grids' ),
			'image_size'                 => __( 'Image size', 'grids' ),
			'repeat'                     => _x( 'Repeat', 'background repeat', 'grids' ),
			'no_repeat'                  => __( 'No repeat', 'grids' ),
			'repeat_both'                => _x( 'Repeat', 'background repeat on both axis', 'grids' ),
			'repeat_x'                   => __( 'Repeat horizontally', 'grids' ),
			'repeat_y'                   => __( 'Repeat vertically', 'grids' ),
			'position'                   => __( 'Position', 'grids' ),
			'position_top_left'          => __( 'Top left', 'grids' ),
			'position_top_center'        => __( 'Top center', 'grids' ),
			'position_top_right'         => __( 'Top right', 'grids' ),
			'position_center_left'       => __( 'Center left', 'grids' ),
			'position_center_center'     => __( 'Center center', 'grids' ),
			'position_center_right'      => __( 'Center right', 'grids' ),
			'position_bottom_left'       => __( 'Bottom left', 'grids' ),
			'position_bottom_center'     => __( 'Bottom center', 'grids' ),
			'position_bottom_right'      => __( 'Bottom right', 'grids' ),
			'select_focal_point'         => __( 'Select focal point', 'grids' ),
			'focal_point'                => __( 'Focal point', 'grids' ),
			'back_to_simple_positioning' => __( 'Back to simple positioning', 'grids' ),
			'size'                       => __( 'Size', 'grids' ),
			'size_cover'                 => __( 'Cover', 'grids' ),
			'size_contain'               => __( 'Contain', 'grids' ),
			'size_auto'                  => __( 'Auto', 'grids' ),
			'attachment'                 => __( 'Attachment', 'grids' ),
			'attachment_scroll'          => __( 'Scroll', 'grids' ),
			'attachment_fixed'           => __( 'Fixed', 'grids' ),
			'stretch'					 => _x( 'Extend to viewport sides', 'background stretch', 'grids' ),
		),
		'size' => array(
			'value'       => __( 'Value', 'grids' ),
			'unit'        => __( 'Unit', 'grids' ),
			'select_unit' => __( 'Select the unit', 'grids' )
		),
		'spacing' => array(
			'gutter_x'       => __( 'Horizontal gutter', 'grids' ),
			'height'         => __( 'Height', 'grids' ),
			'height_fix'     => _x( 'Lock', 'fix height', 'grids' ),
			'height_help'    => __( 'This setting defines the minimum height of the Section, unless the value is locked: in that case, the height will equal exactly the value you input here.', 'grids' ),
			'dimensions'     => __( 'Dimensions', 'grids' ),
			'advanced'       => _x( 'Advanced', 'advanced spacing toggle', 'grids' ),
			'margin'         => __( 'Margin', 'grids' ),
			'margin_top'     => _x( 'Top', 'margin', 'grids' ),
			'margin_right'   => _x( 'Right', 'margin', 'grids' ),
			'margin_bottom'  => _x( 'Bottom', 'margin', 'grids' ),
			'margin_left'    => _x( 'Left', 'margin', 'grids' ),
			'padding'        => __( 'Padding', 'grids' ),
			'padding_top'    => _x( 'Top', 'padding', 'grids' ),
			'padding_right'  => _x( 'Right', 'padding', 'grids' ),
			'padding_bottom' => _x( 'Bottom', 'padding', 'grids' ),
			'padding_left'   => _x( 'Left', 'padding', 'grids' ),
		),
		'structure' => array(
			'title'          => __( 'Structure', 'grids' ),
			'change_layout'  => __( 'Change layout', 'grids' ),
			'settings'       => __( 'Settings', 'grids' ),
			'equal_heights'  => __( 'Make areas equally tall', 'grids' ),
			'select_area'    => __( 'Select current Area', 'grids' ),
			'select_section' => __( 'Select current Section', 'grids' ),
		),
		'display' => array(
			'title'   => __( 'Display', 'grids' ),
			'zIndex'  => __( 'Stack order (z-index)', 'grids' ),
			'display' => __( 'Show', 'grids' )
		)
	),
	'options' => array(
		'wide_width' => __( 'Extend the editor width', 'grids' ),
		'wide_width_help' => __( 'This option will only work if the current theme isn\'t changing the editor width.', 'grids' )
	)
);

return array(
	'breakpoints' => $breakpoints,
	'image_sizes' => $sizes,
	'strings'     => $strings
);
