<?php

class BenchmarkTainacan {

	private $last_id = ['wp_posts'=>4];
	
	private $collections_ids = [];
	private $SQL_collection = "";

	private $SQL_metadatas_ids = [];
	private $SQL_metadatas = "";

	private $SQL_items_ids = [];
	private $SQL_items = "";

	private $SQL_filters_ids = [];
	private $SQL_filters = "";

	function create_base_test($db_mane, $amount_collections, $amount_metadatas, $amount_items, $amount_filters) {

		if($amount_filters > $amount_metadatas)
			return;

		$this->SQL_collection = $this->create_sql_to_collections($amount_collections);
		$this->SQL_metadatas = $this->create_sql_to_metadatas($amount_metadatas);
		$this->SQL_items = $this->create_sql_to_items($amount_items);
		$this->SQL_filters = $this->create_sql_to_filters($amount_filters, $amount_metadatas);

		echo "DROP DATABASE IF EXISTS $db_mane; \n";
		echo "CREATE DATABASE $db_mane; \n";
		echo "USE $db_mane; \n";

		echo "source empty_tainacan_base._sql \n";
		echo $this->SQL_collection . "\n";
		echo $this->SQL_metadatas . "\n";
		echo $this->SQL_items . "\n";
		echo $this->SQL_filters . "\n";
	}

	private function create_values_insert_wp_posts($id, $user_id, $post_content, $post_title, $post_name, $guid,$post_type) {
		return "\n($id, $user_id, '2019-05-03 20:55:57', '2019-05-03 20:55:57', '$post_content', '$post_title','','publish','closed','closed','','$post_name','','','2019-05-03 20:56:15','2019-05-03 20:56:15','',0,'$guid',0,'$post_type','',0)";
	}

	private function create_sql_to_collections($amount_collections) {
		$sql_insert_wp_posts=[];
		$sql_insert_meta_collection = "";
		for ($c = 1; $c <= $amount_collections; $c++) {

			$id = ++$this->last_id['wp_posts'];
			$this->collections_ids[] = $id;

			//$sql_insert_wp_posts[] = "\n ($id, 1, '2019-05-03 20:55:57', '2019-05-03 20:55:57','','Colllection-$c','','publish','closed','closed','','colllection-$c','','','2019-05-03 20:56:15','2019-05-03 20:56:15','',0,'http://localhost/?post_type=tainacan-collection&#038;p=5',0,'tainacan-collection','',0)";
			$sql_insert_wp_posts[] = $this->create_values_insert_wp_posts($id, 1, "", "Colllection-$c", "colllection-$c", "http://localhost/?post_type=tainacan-collection&#038;p=$id", 'tainacan-collection');

			$sql_insert_meta_collection .= 
			"\n INSERT INTO wp_postmeta (post_id, meta_key, meta_value) VALUES 
				($id, 'default_orderby','name'),
				($id, 'default_order','ASC'),
				($id, 'default_displayed_metadata','a:0:{}'),
				($id, 'default_view_mode','table'),
				($id, 'enabled_view_modes','a:0:{}'),
				($id, 'metadata_order',''),
				($id, 'filters_order',''),
				($id, 'enable_cover_page','no'),
				($id, 'cover_page_id',''),
				($id, 'header_image_id',''),
				($id, 'allow_comments', 'open');";
		}
		
		$sql_insert_collection_values = implode(',', $sql_insert_wp_posts);
		$sql_insert_wp_posts = "INSERT INTO wp_posts (
			ID, post_author, post_date, post_date_gmt, post_content, post_title, post_excerpt, post_status, comment_status, ping_status, post_password, post_name,
			to_ping, pinged, post_modified, post_modified_gmt, post_content_filtered, post_parent, guid, menu_order, post_type, post_mime_type, comment_count) 
			VALUES $sql_insert_collection_values;";
		
		return $sql_insert_wp_posts . "\n" . $sql_insert_meta_collection;
	}

	private function create_sql_to_metadatas($amount_metadatas) {
		$sql_insert_wp_posts=[];
		$sql_insert_meta_collection = "";
		foreach ($this->collections_ids as $collection_id) {
			for ($m = 0; $m < $amount_metadatas; $m++) {
				$id = ++$this->last_id['wp_posts'];
				$this->SQL_metadatas_ids[] = $id;
				$sql_insert_wp_posts[] = $this->create_values_insert_wp_posts($id, 1, "metadata-$m", "Metadata-$m", "metadata-$m", "http://localhost/tainacan-metadatum/description-$m/", 'tainacan-metadatum');

				$sql_insert_meta_collection .= 
				"\n INSERT INTO wp_postmeta (post_id, meta_key, meta_value) VALUES 
					($id,'metadata_type','Tainacan\\\\Metadata_Types\\\\Text'),
					($id,'required','no'),
					($id,'collection_key','no'),
					($id,'multiple','no'),
					($id,'cardinality',1),
					($id,'mask',''),
					($id,'default_value',''),
					($id,'metadata_type_options',''),
					($id,'collection_id',$collection_id),
					($id,'accept_suggestion',''),
					($id,'exposer_mapping','a:0:{}'),
					($id,'display','yes'),
					($id,'semantic_uri','');";
			}
		}

		$sql_insert_collection_values = implode(',', $sql_insert_wp_posts);
		$sql_insert_wp_posts = "INSERT INTO wp_posts (
			ID, post_author, post_date, post_date_gmt, post_content, post_title, post_excerpt, post_status, comment_status, ping_status, post_password, post_name,
			to_ping, pinged, post_modified, post_modified_gmt, post_content_filtered, post_parent, guid, menu_order, post_type, post_mime_type, comment_count) 
			VALUES $sql_insert_collection_values;";
		
		return $sql_insert_wp_posts . "\n" . $sql_insert_meta_collection;
	}

	private function create_sql_to_items($amount_items) {
		$sql_insert_meta_item = [];
		foreach ($this->collections_ids as $collection_id) {
			for ($i = 0; $i < $amount_items; $i++) {
				$id = ++$this->last_id['wp_posts'];
				$this->SQL_items_ids[] = $id;
				$tnc_col_item = "tnc_col_$collection_id" . "_item";
				$sql_insert_wp_posts[] = $this->create_values_insert_wp_posts($id, 1, "item-$i", "Item-title-$i", "$id-$i", "http://localhost/?post_type=$tnc_col_item&#038;p=$id", $tnc_col_item);
			
				$sql_insert_meta_item[] = "\n ($id, 'collection_id', $collection_id)";
				foreach($this->SQL_metadatas_ids as $metadata_id) {
					$value = $id % 3 == 0 ? 'valor-1' : ($id % 3 == 1 ? 'valor-2' : "id:$id");
					$sql_insert_meta_item[] = "\n ($id, $metadata_id, '$value')";
				}
			}
		}

		$sql_insert_collection_values = implode(',', $sql_insert_wp_posts);
		$sql_insert_wp_posts = "INSERT INTO wp_posts (
			ID, post_author, post_date, post_date_gmt, post_content, post_title, post_excerpt, post_status, comment_status, ping_status, post_password, post_name,
			to_ping, pinged, post_modified, post_modified_gmt, post_content_filtered, post_parent, guid, menu_order, post_type, post_mime_type, comment_count) 
			VALUES $sql_insert_collection_values;";

		$sql_insert_meta_item = "INSERT INTO wp_postmeta (post_id, meta_key, meta_value) VALUES " . implode(',', $sql_insert_meta_item) . ";";

		return $sql_insert_wp_posts . "\n" . $sql_insert_meta_item;
	}

	private function create_sql_to_filters($amount_filters, $amount_metadatas) {
		$pos = 0;
		$sql_insert_wp_posts = [];
		$sql_insert_meta_filters = "";
		foreach ($this->collections_ids as $collection_id) {
			$offset = $pos * $amount_metadatas;
			$pos++;
			for ($f = 0; $f < $amount_filters; $f++) {
				$id = ++$this->last_id['wp_posts'];
				$this->SQL_filters_ids[] = $id;
				$sql_insert_wp_posts[] = $this->create_values_insert_wp_posts($id, 1, '', "Filter-$f", "filter-$f", "http://localhost/?post_type=tainacan-filter&#038;p=$id", 'tainacan-filter');
	
				$sql_insert_meta_filters .= 
				"\n INSERT INTO wp_postmeta (post_id, meta_key, meta_value) VALUES 
					($id, 'filter_type_options',''),
					($id, 'filter_type','Tainacan\\\\Filter_Types\\\\Selectbox'),
					($id, 'collection_id', $collection_id),
					($id, 'metadatum'," . $this->SQL_metadatas_ids[ $offset + $f ] . "),
					($id, 'max_options',4);";
			}
		}

		$sql_insert_collection_values = implode(',', $sql_insert_wp_posts);
		$sql_insert_wp_posts = "INSERT INTO wp_posts (
			ID, post_author, post_date, post_date_gmt, post_content, post_title, post_excerpt, post_status, comment_status, ping_status, post_password, post_name,
			to_ping, pinged, post_modified, post_modified_gmt, post_content_filtered, post_parent, guid, menu_order, post_type, post_mime_type, comment_count) 
			VALUES $sql_insert_collection_values;";

		return $sql_insert_wp_posts . "\n" . $sql_insert_meta_filters;
	}

}

if (isset($argc) && $argc == 6 ) {
	$db_mane 						= $argv[1];
	$amount_collections = $argv[2];
	$amount_metadatas 	= $argv[3];
	$amount_items 			= $argv[4];
	$amount_filters 		= $argv[5];

	if (
		 is_string($db_mane) &&
		is_numeric($amount_items) &&
		is_numeric($amount_metadatas) &&
		is_numeric($amount_collections) &&
		is_numeric($amount_filters)
	) {
		$t = new BenchmarkTainacan();
		echo $t->create_base_test($db_mane, $amount_collections, $amount_metadatas, $amount_items, $amount_filters);
	}
} else {
	echo "argc and argv wrong\n";
}
?>
