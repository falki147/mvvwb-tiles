<?php
/**
 * Initializes base constants and sets up autoloading
 */

if (!defined('MVVWB_TILES_BASE')) {
    /** Base path of the plugin */
    define('MVVWB_TILES_BASE', plugin_dir_url(__FILE__));
}

if (!defined('MVVWB_TILES_VERSION')) {
    /** Version of this plugin */
    define('MVVWB_TILES_VERSION', '{{version}}');
}

if (!defined('MVVWB_TILES_VIEWS')) {
    /** Absolute path to the views */
    define('MVVWB_TILES_VIEWS', implode(DIRECTORY_SEPARATOR, [ __DIR__, 'MVVWB', 'Tiles', 'Views', '' ]));
}

if (!defined('MVVWB_TILES_ADMIN_VIEWS')) {
    /** Absolute path to the admin views */
    define('MVVWB_TILES_ADMIN_VIEWS', implode(DIRECTORY_SEPARATOR, [ __DIR__, 'MVVWB', 'Tiles', 'Views', 'Admin', '' ]));
}

if (!defined('MVVWB_TILES_TRANSLATIONS')) {
    /** Path to the translations. It can be directly passed to load_plugin_textdomain. */
    $currentDir = str_replace('\\', '/', __DIR__);
    $wpDir = str_replace('\\', '/', WP_PLUGIN_DIR);

    define('MVVWB_TILES_TRANSLATIONS', str_replace($wpDir, '', $currentDir));
}

if (!defined('MVVWB_TILES_AUTOLOAD')) {
    spl_autoload_register(function ($class) {
        // Only load classes from the "MVVWB" namespace
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

    /**
     * Helper constant to determine if the autloading was set up or not
     * @internal
     */
    define('MVVWB_TILES_AUTOLOAD', '1');
}
