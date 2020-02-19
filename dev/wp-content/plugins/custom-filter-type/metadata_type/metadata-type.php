<?php

/**
 * Class TainacanMetadataType
 */
class Custom_Metadata_Type extends \Tainacan\Metadata_Types\Metadata_Type {

	function __construct() {
		parent::__construct();
		$this->set_name( __('Custom Metadata Type', 'tainacan') );
		$this->set_primitive_type(['float']);
		$this->set_component('tainacan-metadata-type-custom');
		$this->set_form_component('tainacan-metadata-form-type-custom');
		$this->set_description( __('A numeric value, integer or float', 'tainacan') );
		$this->set_preview_template('<div>EXEMPLO</div>');
	}

	/**
     * @inheritdoc
     */
    public function get_form_labels(){
        return [
            'step' => [
                'title' => __( 'Step', 'tainacan' ),
                'description' => __( 'The amount to be increased or decreased when clicking on filter control buttons.', 'tainacan' ),
            ]
        ];
    }

	/**
     * @param $itemMetadata \Tainacan\Entities\Item_Metadata_Entity The instace of the entity itemMetadata
     * @return string
     */

    public function render( $itemMetadata ){
        return '<tainacan-metadata-type-custom 
                                   metadatum_id ="'.$itemMetadata->get_metadatum()->get_id().'" 
                                   item_id="'.$itemMetadata->get_item()->get_id().'"    
                                   value=\''.json_encode( $itemMetadata->get_value() ).'\'  
                                   name="'.$itemMetadata->get_metadatum()->get_name().'"></tainacan-metadata-type-custom>';
    }

}
