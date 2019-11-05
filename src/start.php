<?php

if (!defined('MVVWB_TILES_BASE'))
    define('MVVWB_TILES_BASE', plugin_dir_url(__FILE__));

if (!defined('MVVWB_TILES_VERSION'))
    define('MVVWB_TILES_VERSION', '1.0.0');

if (!defined('MVVWB_TILES_VIEWS'))
    define('MVVWB_TILES_VIEWS', implode(DIRECTORY_SEPARATOR, [ __DIR__, 'MVVWB', 'Tiles', 'Views', '' ]));

if (!defined('MVVWB_TILES_ADMIN_VIEWS'))
    define('MVVWB_TILES_ADMIN_VIEWS', implode(DIRECTORY_SEPARATOR, [ __DIR__, 'MVVWB', 'Tiles', 'Views', 'Admin', '' ]));

if (!defined('MVVWB_TILES_TRANLATIONS')) {
    $currentDir = str_replace('\\', '/', __DIR__);
    $wpDir = str_replace('\\', '/', WP_PLUGIN_DIR);
    
    define('MVVWB_TILES_TRANLATIONS', str_replace($wpDir, '', $currentDir));
}

if (!defined('MVVWB_TILES_AUTOLOAD')) {
    spl_autoload_register(function ($class) {
        if (strncmp('MVVWB', $class, 5) !== 0)
            return false;

        // Replace the namespace prefix with the base directory, replace namespace
        // separators with directory separators in the relative class name, append
        // with .php
        $file = __DIR__ . DIRECTORY_SEPARATOR . str_replace('\\', DIRECTORY_SEPARATOR, $class) . '.php';

        // if the file exists, require it
        if (file_exists($file)) {
            require_once $file;
            return true;
        }

        return false;
    });

    define('MVVWB_TILES_AUTOLOAD', '1');
}
