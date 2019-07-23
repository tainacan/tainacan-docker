<?php
//exit("1");
class BenchmarkTainacan {
    public function time_request($URL) {
        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_RETURNTRANSFER => 1,
            CURLOPT_URL => $URL
        ]);
        //TIME START
        $start = microtime(true);
        $resp = curl_exec($curl);
        $time = microtime(true) - $start;
        //TIME END
        curl_close($curl);
        return $time;
    }
}

if (isset($argc) && $argc == 2 ) {
    $URL = $argv[1];
    if ( is_string($URL) ) {
        $t = new BenchmarkTainacan();
        exit( "" . $t->time_request($URL) );
    }
} else {
    echo "argc and argv wrong\n";
}
exit("-1");

//SEARCH 801:
//http://localhost/wp-json/tainacan/v2/collection/5/items?perpage=12&paged=1&order=DESC&orderby=date&admin_view_mode=table&fetch_only=thumbnail&fetch_only_meta=6&search=801

//$URL = "http://localhost/wp-json/tainacan/v2/collection/5/items?perpage=12&paged=1&order=DESC&orderby=date&admin_view_mode=table&fetch_only_meta=6%2C7%2C8%2C9%2C10%2C11%2C12%2C13%2C14%2C15%2C16%2C17%2C18%2C19%2C20&fetch_only=thumbnail";
//$URL = "http://localhost/wp-json/tainacan/v2/collection/5/items?perpage=12&paged=1&order=DESC&orderby=date&admin_view_mode=table&fetch_only=thumbnail&fetch_only_meta=6%2C7%2C8%2C9%2C10%2C11%2C12%2C13%2C14%2C15%2C16%2C17%2C18%2C19%2C20&metaquery[0][key]=9&metaquery[0][value]=valor-1";
//$t = new BenchmarkTainacan();
//echo $t->time_request($URL);


?>
