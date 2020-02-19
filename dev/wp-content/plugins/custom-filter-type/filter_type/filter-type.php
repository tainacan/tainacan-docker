<?php

/**
 * Class TainacanFilterType
 */
class Custom_Filter_Type extends \Tainacan\Filter_Types\Filter_Type {

	function __construct() {
		$this->set_name( __('Custom Filter Type', 'tainacan') );
		$this->set_supported_types(['float']);
		$this->set_component('tainacan-filter-type-custom');
		$this->set_form_component('tainacan-filter-form-type-custom');
		$this->set_script('ttt');
		$this->set_use_max_options(false);
		$this->set_preview_template('<div>EXEMPLO</div>');
	}

	/**
	 * @param $filter
	 * @return string
	 * @internal param $metadatum
	 */
	public function render( $filter ){
		return '';
	}


	/**
	 * @param \Tainacan\Entities\Filter $filter
	 * @return array|bool true if is validate or array if has error
	 */
	public function validate_options(\Tainacan\Entities\Filter $filter) {
		if ( !in_array($filter->get_status(), apply_filters('tainacan-status-require-validation', ['publish','future','private'])) )
			return true;

		return true;
	}
}
