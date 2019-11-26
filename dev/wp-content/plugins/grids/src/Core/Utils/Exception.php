<?php

namespace Grids\Core\Utils;

/* Check that we're running this file from the plugin. */
if ( ! defined( 'GRIDS' ) ) die( 'Forbidden' );

/**
 * Grids exception class.
 *
 * @since 1.0.0
 */
class Exception extends \Exception {

	/**
	 * Class constructor.
	 *
	 * @since 1.0.0
	 * @param string $message The exception message.
	 * @param integer $code The exception code.
	 * @param \Exception $previous The previous exception object.
	 */
	public function __construct( $message, $code = 0, \Exception $previous = null ) {
		parent::__construct( $message, $code, $previous );
	}

	/**
	 * Convert the exception object to string.
	 *
	 * @since 1.0.0
	 * @return string
	 */
	public function __toString() {
		return __CLASS__ . " [{$this->code}]: {$this->message}\n";
	}

}
