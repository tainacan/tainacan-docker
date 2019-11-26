<?php

namespace Grids;

if ( ! defined( 'GRIDS' ) ) die( 'Forbidden' );

use Grids\Core\Utils\Filter as Filter;

/**
 * Prevents the background color on some elements to stop working.
 *
 * @since 1.0.0
 * @param array $class An array of CSS classes.
 * @return array
 */
function grids_twentynineteen_section_class( $class ) {
	$class[] = 'wp-block-grids-section';

	return $class;
}

Filter::add( 'section_class', 'Grids\grids_twentynineteen_section_class' );
