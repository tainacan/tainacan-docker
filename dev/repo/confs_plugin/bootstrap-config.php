<?php 

function env($name, $default) {
    $result = isset($_ENV[$name]) ? $_ENV[$name] : $default;

    if (strtolower(trim($result)) == 'true') {
        $result = true;
    } else if (strtolower(trim($result)) == 'false') {
        $result = false;
    }

    return $result;
}

return [
    'tests_dir' => env('WORDPRESS_PATH_TEST', '/tainacan_test') . '/wodpress-tests-lib',
    //'tests_dir' => '/tainacan_test/wordpress-tests-lib',

];


 ?>
