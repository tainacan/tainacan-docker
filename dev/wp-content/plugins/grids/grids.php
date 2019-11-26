<?php if ( ! defined( 'ABSPATH' ) ) die( 'Forbidden' );

/**
 * Plugin Name: Grids
 * Description: Layout builder for WordPress.
 * Version: 1.2.15
 * Plugin URI: https://justevolve.it/grids/
 * Author: Evolve
 * Author URI: https://justevolve.it/
 * License: GPL2
 * Text Domain: grids
 * Domain Path: /languages/
 *
 * Grids is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * any later version.
 *
 * Grids is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * @package   Grids
 * @author 	  Evolve <info@justevolve.it>
 * @copyright Copyright (c) 2019
 * @license   http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 */

/**
 * Setup the plugin
 *
 * @since 1.0.0
 */
function grids_setup() {
	if ( ! function_exists( 'register_block_type' ) ) {
		/* Bail if Gutenberg is not installed, or we're running a WordPress version prior to 5.0. */
		return;
	}

	/* Main plugin constant. */
	define( 'GRIDS', true );

	/* Plugin version. */
	define( 'GRIDS_VERSION', '1.2.15' );

	/* Main plugin folder constant. */
	define( 'GRIDS_FOLDER', trailingslashit( dirname( __FILE__ ) ) );

	/* Main plugin URI constant. */
	define( 'GRIDS_URI', trailingslashit( plugin_dir_url( __FILE__ ) ) );

	/* Plugin folder for language files. */
	define( 'GRIDS_LANGUAGES_FOLDER', dirname( plugin_basename( __FILE__ ) ) . '/languages/' );

	/* Class autoloader. */
	require GRIDS_FOLDER . 'vendor/autoload.php';

	/* Fire up the plugin. */
	Grids\Core::instance();
}

add_action( 'plugins_loaded', 'grids_setup', 100 );
