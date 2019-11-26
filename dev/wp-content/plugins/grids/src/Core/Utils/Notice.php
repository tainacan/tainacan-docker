<?php

namespace Grids\Core\Utils;

/* Check that we're running this file from the plugin. */
if ( ! defined( 'GRIDS' ) ) die( 'Forbidden' );

/**
 * Grids admin notice class.
 *
 * @since 1.0.0
 */
class Notice {

	/**
	 * Notice global identifier.
	 *
	 * @var string
	 */
	private static $_identifier = 'grids';

	/**
	 * The notice key.
	 *
	 * @var string
	 */
	private $_key = '';

	/**
	 * The notice template.
	 *
	 * @var string
	 */
	private $_template = '';

	/**
	 * The notice type.
	 *
	 * @var string
	 */
	private $_type = 'success';

	/**
	 * The notice dismissible status.
	 *
	 * @var boolean
	 */
	private $_dismissible = true;

	/**
	 * Class constructor.
	 *
	 * @since 1.0.0
	 * @param string $key The notice key.
	 * @param string $template The notice template.
	 */
	public function __construct( $key, $template, $type = 'success', $dismissible = true ) {
		$this->_key         = $key;
		$this->_template    = $template;
		$this->_type        = $type;
		$this->_dismissible = $dismissible;

		/* Register admin script. */
		add_action( 'admin_enqueue_scripts', array( $this, 'register_script' ), 10 );

		/* Render the notice. */
		add_action( 'admin_notices', array( $this, 'render' ) );

		if ( $this->_dismissible ) {
			/* If the notice is dismissable, register an AJAX action to get rid of it. */
			add_action( 'wp_ajax_' . $this->get_dismiss_key(), array( $this, 'dismiss' ) );
		}

		/* Enqueue admin assets. */
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue' ), 20 );
	}

	/**
	 * Register admin script.
	 *
	 * @since 1.0.0
	 */
	public function register_script() {
		Asset::register_script(
			'notices',
			'assets/js/notices.js',
			array(
				'jquery'
			)
		);
	}

	/**
	 * Enqueue admin assets.
	 *
	 * @since 1.0.0
	 */
	public function enqueue() {
		Asset::enqueue_script( 'notices' );
	}

	/**
	 * Return the key for the notice.
	 *
	 * @since 1.0.0
	 * @return string
	 */
	private function get_key() {
		return self::$_identifier . '_' . $this->_key;
	}

	/**
	 * Return the dismiss key for the notice.
	 *
	 * @since 1.0.0
	 * @return string
	 */
	private function get_dismiss_key() {
		return $this->get_key() . '_dismiss';
	}

	/**
	 * Return the dismissed key for the notice.
	 *
	 * @since 1.0.0
	 * @return string
	 */
	private function get_dismissed_key() {
		return $this->get_key() . '_dismissed';
	}

	/**
	 * Check if the notice has already been dismissed.
	 *
	 * @since 1.0.0
	 * @return boolean
	 */
	private function is_dismissed() {
		return get_option( $this->get_dismissed_key() ) == '1';
	}

	/**
	 * Render the notice.
	 *
	 * @since 1.0.0
	 */
	public function render() {
		if ( $this->_dismissible && $this->is_dismissed() ) {
			return;
		}

		$class = array(
			'notice',
			'notice-' . $this->_type,
			self::$_identifier . '-notice',
			self::$_identifier . '-' . $this->_key,
		);

		if ( $this->_dismissible ) {
			$class[] = 'is-dismissible';
		}

		$nonce = wp_create_nonce( self::$_identifier . '_dismiss_notice' );

		?>
		<div class="<?php echo esc_attr( implode( ' ', $class ) ); ?>" data-key="<?php echo esc_attr( $this->_key ); ?>" data-nonce="<?php echo esc_attr( $nonce ); ?>">
			<p><?php echo wp_kses_post( $this->_template ); ?></p>
		</div>
		<?php
	}

	/**
	 * Dismiss a notice.
	 *
	 * @since 1.0.0
	 */
	public function dismiss() {
		if ( ! isset( $_POST[ 'nonce' ] ) ) {
			die();
		}

		if ( ! wp_verify_nonce( $_POST[ 'nonce' ], self::$_identifier . '_dismiss_notice' ) ) {
			die();
		}

		update_option( $this->get_dismissed_key(), '1' );

		die();
	}
}
