<?php
/*
Plugin Name: Custom Components Type
Plugin URI: https://tainacan.org/new
Description: ""
Author: ""
Version: 0.1
Text Domain: custom-components-type
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-3.0.html
*/

add_action("tainacan-register-filter-type", "register_filter_type");
function register_filter_type($helper) {
	require_once( plugin_dir_path(__FILE__) . 'filter_type/filter-type.php' );

	$handle = 'custom-filter-type';
	$class_name = 'Custom_Filter_Type';
	$filter_script_url = plugin_dir_url(__FILE__) . 'filter_type/filter-type.js';

	$helper->register_filter_type($handle, $class_name, $filter_script_url);
}


add_action("tainacan-register-metadata-type", "register_metadata_type");
function register_metadata_type($helper) {
	require_once( plugin_dir_path(__FILE__) . 'metadata_type/metadata-type.php' );

	$handle = 'custom-metadata-type';
	$class_name = 'Custom_Metadata_Type';
	$metadata_script_url = plugin_dir_url(__FILE__) . 'metadata_type/metadata-type.js';

	$helper->register_metadata_type($handle, $class_name, $metadata_script_url);
}


add_action("tainacan-register-vuejs-component", "register_vuejs_component");
function register_vuejs_component($helper) {
	$handle1 = 'custom-filter-type-form';
	$component_script_url1 = plugin_dir_url(__FILE__) . 'filter_type/filter-type-form.js';

	$helper->register_vuejs_component($handle1, $component_script_url1);

	$handle2 = 'custom-metadata-type-form';
	$component_script_url2 = plugin_dir_url(__FILE__) . 'metadata_type/metadata-type-form.js';

	$helper->register_vuejs_component($handle2, $component_script_url2);
}
?>
