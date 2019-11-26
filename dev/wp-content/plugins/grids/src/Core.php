<?php

namespace Grids;

use Grids\Core\Utils\Filter as Filter;
use Grids\Core\Utils\Logger as Logger;
use Grids\Core\Utils\Asset as Asset;
use Grids\Core\Utils\AJAX as AJAX;
use Grids\Core\Utils\Notice as Notice;
use Grids\Core\Media as Media;
use Grids\Core\Blocks\Section as Section;
use Grids\Core\Blocks\Area as Area;

/* Check that we're running this file from the plugin. */
if ( ! defined( 'GRIDS' ) ) die( 'Forbidden' );

/**
 * Grids core class.
 *
 * @since 1.0.0
 */
class Core {

	/**
	 * The class instance.
	 *
	 * @static
	 * @var Grids\Core
	 */
	private static $_instance = null;

	/**
	 * Global configuration.
	 *
	 * @var array
	 */
	private $_config = array();

	/**
	 * Current unique frontend ID index.
	 *
	 * @var integer
	 */
	public static $current_uid_index = 0;

	/**
	 * Unique frontend IDs.
	 *
	 * @var array
	 */
	public static $uids = array();

	/**
	 * Return the instance of the class.
	 *
	 * @static
	 * @since 1.0.0
	 * @return Grids\Core
	 */
	public static function instance()
	{
		if ( self::$_instance === null ) {
			self::$_instance = new self();
		}

		return self::$_instance;
	}

	/**
	 * Class constructor.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		/* Load configuration. */
		$this->load_config();

		/* Register custom plugin meta data. */
		add_action( 'init', array( $this, 'register_meta' ) );

		/* Admin body class. */
		add_filter( 'admin_body_class', array( $this, 'admin_body_class' ) );

		/* Declare the "Grids" category for blocks. */
		// add_filter( 'block_categories', array( $this, 'declare_blocks_category' ), 10, 2 );

		/* Declare blocks. */
		if ( is_admin() ) {
			add_action( 'enqueue_block_editor_assets', array( $this, 'declare_blocks' ) );
		}
		else {
			$this->declare_blocks();

			/* Frontend styles. */
			add_action( 'wp_head', array( $this, 'styles' ), 100 );

			/* Filter the posts content. */
			add_action( 'the_content', array( $this, 'the_content' ) );
		}

		/* Declare plugins. */
		$this->declare_plugins();

		/* AJAX endpoints. */
		if ( is_admin() ) {
			$this->ajax_endpoints();
		}

		/* Notices. */
		$suggestion_notice = new Notice( 'feature_suggestion', sprintf(
			__( 'If you think you have a great idea that could <strong>make Grids even better</strong>, don\'t hesitate to tell us and we\'ll include it as a plugin update! <a href="%s" _target="blank">%s</a>', 'grids' ),
			esc_attr( 'https://docs.google.com/forms/d/e/1FAIpQLSfy5NAt3UmnygAJMaFcFB1bC0G4eOj9vRuDpTTS-ci5Mx8yWA/viewform' ),
			esc_html__( 'Suggest a feature!', 'grids' )
		) );

		/* Compatibility fixes with other themes and plugins. */
		add_action( 'after_setup_theme', array( $this, 'compatibility' ) );
	}

	/**
	 * Admin body class.
	 *
	 * @since 1.0.0
	 * @param string $body_class The admin body class.
	 * @return string
	 */
	public function admin_body_class( $body_class ) {
		global $post;

		if ( $post && ! empty( $post->ID ) ) {
			if ( get_post_meta( $post->ID, '_grids_wide_width', true ) == '1' ) {
				$body_class .= ' grids-block-editor-wide';
			}
		}

		return $body_class;
	}

	/**
	 * Compatibility fixes with other themes and plugins.
	 *
	 * @since 1.0.0
	 */
	public function compatibility() {
		if ( function_exists( 'twentynineteen_setup' ) ) {
			require_once GRIDS_FOLDER . 'compat/twentynineteen.php';
		}
	}

	/**
	 * Filter the generated content.
	 *
	 * @since 1.0.0
	 * @param string $content The post content.
	 * @return string
	 */
	public function the_content( $content ) {
		/* Remove empty paragraphs on frontend. */
		$content = str_replace( '<p></p>', '', $content );

		return $content;
	}

	/**
	 * Register plugin meta data.
	 *
	 * @since 1.0.0
	 */
	public function register_meta() {
		/* Horizontal gutter. */
		register_meta( 'post', '_grids_gutter_x', array(
			'type'          => 'string',
			'single'        => true,
			'show_in_rest'  => true,
			'auth_callback' => '__return_true'
		) );

		/* Wide width. */
		register_meta( 'post', '_grids_wide_width', array(
			'type'          => 'boolean',
			'single'        => true,
			'show_in_rest'  => true,
			'auth_callback' => '__return_true'
		) );
	}

	/**
	 * Print the frontend styles.
	 *
	 * @since 1.0.0
	 */
	public function styles() {
		if ( ! is_main_query() ) {
			return;
		}

		global $wp_query;

		/* Hook to generate styles for a custom query. */
		$styles_query = Filter::apply( 'styles_query', $wp_query );

		if ( $styles_query->have_posts() ) {
			$index = 0;
			while ( $styles_query->have_posts() ) {
				$index++;
				$styles_query->the_post();
				$style = $this->compute_styles();

				if ( $style ) {
					$style = implode( '', $style );

					echo '<style id="grids-frontend-inline-css-' . esc_attr( $index ) . '">';
						echo $style;
					echo '</style>';
				}
			}
		}
	}

	/**
	 * Compute the frontend styles.
	 *
	 * @since 1.0.0
	 * @param array $blocks The blocks array.
	 * @return array
	 */
	public function compute_styles( $blocks = null ) {
		$post_id = get_the_ID();

		if ( $blocks == null ) {
			$post    = get_post( $post_id );
			$blocks  = parse_blocks( $post->post_content );
		}

		$style = array();

		foreach ( $blocks as $i => $block ) {
			if ( isset( $block[ 'attrs' ][ 'ref' ] ) ) {
				/* This is a reusable block, so let's fetch its blocks. */
				$ref_block = get_post( $block[ 'attrs' ][ 'ref' ] );
				$ref_blocks = parse_blocks( $ref_block->post_content );
			}
			else {
				$ref_blocks = array( $block );
			}

			foreach ( $ref_blocks as $block ) {
				switch ( $block[ 'blockName' ] ) {
					case 'grids/section':
						$style[] = Section::style( $block[ 'attrs' ], $post_id );
						break;
					case 'grids/area':
						$style[] = Area::style( $block[ 'attrs' ], $post_id );
						break;
				}

				if ( isset( $block[ 'innerBlocks' ] ) && ! empty( $block[ 'innerBlocks' ] ) ) {
					$style = array_merge( $style, $this->compute_styles( $block[ 'innerBlocks' ] ) );
				}
			}
		}

		return $style;
	}

	/**
	 * Load configuration.
	 *
	 * @since 1.0.0
	 */
	private function load_config() {
		$config = include GRIDS_FOLDER . 'config.php';
		$this->_config = Filter::apply( 'config', $config );
	}

	/**
	 * Get a configuration key.
	 *
	 * @since 1.0.0
	 * @param string $key The configuration key.
	 * @return mixed
	 */
	public function get_config( $key ) {
		if ( isset( $this->_config[ $key ] ) ) {
			return $this->_config[ $key ];
		}

		return null;
	}

	/**
	 * AJAX endpoints.
	 *
	 * @since 1.0.0
	 */
	public function ajax_endpoints() {
		/* Get an image URL from its Media Library ID. */
		AJAX::register( 'get_image_url_by_id', 'Grids\Core\Media::fetch_image_by_id' );
	}

	/**
	 * Get a list of available blocks.
	 *
	 * @since 1.0.0
	 * @return array
	 */
	private function get_blocks_list() {
		return Filter::apply( 'blocks_list', array(
			'Grids\Core\Blocks\Section',
			'Grids\Core\Blocks\Area',
		) );
	}

	/**
	 * Declare the "Grids" category for blocks.
	 *
	 * @since 1.0.0
	 * @return array
	 */
	public function declare_blocks_category( $categories, $post ) {
		return array_merge(
			$categories,
			array(
				array(
					'slug' => 'grids',
					'title' => 'Grids',
				),
			)
		);
	}

	/**
	 * Include blocks declaration.
	 *
	 * @since 1.0.0
	 */
	public function declare_blocks() {
		/* Enqueue admin assets. */
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_scripts' ), 20 );

		foreach( $this->get_blocks_list() as $block ) {
			( new $block() );
		}
	}

	/**
	 * Declare editor plugins.
	 *
	 * @since 1.0.0
	 */
	public function declare_plugins() {
		/* Enqueue frontend assets. */
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_frontend_style' ) );
	}

	/**
	 * Enqueue admin assets.
	 *
	 * @since 1.0.0
	 */
	public function enqueue_admin_scripts() {
		Asset::register_script(
			'main',
			'assets/js/grids.js',
			array(
				'jquery',
				'wp-element',
				'wp-edit-post',
				'wp-plugins',
				'wp-components',
				'wp-editor',
				'wp-block-editor',
				'jquery-ui-selectable',
				'jquery-ui-sortable',
				'jquery-ui-draggable',
				'jquery-ui-resizable',
			),
			null,
			'grids'
		);

		Asset::register_style(
			'main',
			'assets/css/grids.css'
		);

		Asset::localize_script( 'main', 'grids', $this->_config );
		Asset::enqueue_script( 'main' );

		Asset::enqueue_style( 'main' );
	}

	/**
	 * Enqueue frontend assets.
	 *
	 * @since 1.0.0
	 */
	public function enqueue_frontend_style() {
		Asset::register_style(
			'frontend',
			'assets/css/frontend.css'
		);

		Asset::enqueue_style( 'frontend' );
	}
}
