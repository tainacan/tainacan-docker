<?php

class BenchmarkTainacan {

	protected $tainacan_entity_factory;
	protected $tainacan_metadatum_factory;
	protected $tainacan_item_metadata_factory;
	protected $user_id;

	private $amount_collections = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024];
	private $amount_metadatas = [15, 30, 60, 120, 240, 480, 960, 1920, 3840, 7680];
	private $amount_items = [1000, 2000, 4000, 8000, 16000, 32000, 64000, 128000, 256000, 512000, 1024000];
	private $default_amount_metadata = 15;

	function __construct() {
		$this->tainacan_entity_factory = new Factories\Entity_Factory();
		$this->tainacan_metadatum_factory  = new Factories\Metadatum_Factory();
		$this->tainacan_item_metadata_factory = new Factories\Item_Metadata_Factory();

		$new_admin_user = $this->factory()->user->create(array( 'role' => 'administrator' ));
		wp_set_current_user($new_admin_user);
		$this->user_id = $new_admin_user;
	}

	//Quantidade de metadados do dubin core = 15

	//1-testar variando a quantidade de items com 15 metadatas
	public function create_base_varying_amount_items($default_amount_metadata) {
		$name_of_bases = [];
		foreach ($amount_items as $amount_item) {
			$name_of_bases[] = "bdb-$amount_item-items-$default_amount_metadata-metadata-1-collection";
		}
		
	}

	public function test_varying_amount_items($default_amount_items) {

	}
	//2-testar variando a quantidade de metadados com X items
	//3-testar variando a quantidade de coleções para X items com Y metadados
}

?>