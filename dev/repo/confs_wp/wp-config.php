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

/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
//define('DB_NAME', 'tainacan');
define('DB_NAME', env('WORDPRESS_DB', 'tainacan'));

/** MySQL database username */
//define('DB_USER', 'tainacan');
define('DB_USER', env('WORDPRESS_DB_USER', 'tainacan'));

/** MySQL database password */
//define('DB_PASSWORD', 'tainacan');
define('DB_PASSWORD', env('WORDPRESS_DB_PASSWORD', 'tainacan'));

/** MySQL hostname */
//define('DB_HOST', 'db:3306');
define('DB_HOST',  env('WORDPRESS_DB_HOST', 'db:3306'));

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8mb4');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         ':7A*+H&pGGl_G.TySYEcOyGqml:_J_YLD}GLDb;/ek.= =}Z&kW[N^RWp&(t4%)c');
define('SECURE_AUTH_KEY',  'X:vRs,8mAeng_{DyL*`blv!q:<QU:~*Bi`Gu20nS9gc=WQlaZ_o;{R9,_l(<zf9A');
define('LOGGED_IN_KEY',    't@AnpI%h`^[E5nnOND+~r+$-ju_H;7l^4v4>s+z^F,kObo<!n:3XMs=51L~x-i7J');
define('NONCE_KEY',        '<b:3B#_Tzggc&W0i)wp%M~vEn1^+rTf|TJ8TV:Kd8J#zqLWId,)[Q8W/D.pxYm&k');
define('AUTH_SALT',        'P$j]XaycRrnS4Ib|96r&qa!4MW<D_[Dw|j6[7K<):R. UOhYgvroSejWPA1K+6<g');
define('SECURE_AUTH_SALT', '2#E{pB%ttYatfWhuuyx`bIyTq45(zh1/T8EDRS@Q[Udj;T?XXa#%5ugx,Sm;pvwD');
define('LOGGED_IN_SALT',   'tfBIWSN:0#]@E#/@Z?;&s8t?[eg#yD1n**]JG$$l%o(SmM!,X~O#s|jpl}[|eB<m');
define('NONCE_SALT',       '&dlwSQM}oPn&KRFg;l8K$wlU[p#<p#MwaUR2?#t_yyz{(Y#]/c1@Q1SUA~j5AEJD');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
