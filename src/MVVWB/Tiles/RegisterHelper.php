<?php
/**
 * Defines RegisterHelper class
 */

namespace MVVWB\Tiles;

/**
 * Provides functionality for registering post types, scripts, etc.
 *
 * This class is not intended to be intantiated
 */
class RegisterHelper {
    /**
     * Register hooks for initializing plugin
     */
    public static function register() {
        add_action('widgets_init', function () { self::widgetsInit(); });
        add_action('add_meta_boxes', function () { self::addMetaBoxes(); });
        add_action('save_post', function ($postID) { self::saveMetaBoxes($postID); });
        add_action('plugins_loaded', function () { self::setup(); });
        add_action('wp_enqueue_scripts', function () { self::registerScripts(); });
        add_action('admin_enqueue_scripts', function () { self::registerAdminScripts(); });
    }

    /**
     * Setup translations, scripts and post type
     */
    private static function setup() {
        load_plugin_textdomain('mvvwb-tiles', false, MVVWB_TILES_TRANSLATIONS);

        wp_localize_script('mvvwb-tiles-admin', 'mvvwbTilesI18n', [
            'delete' => __('Delete', 'mvvwb-tiles'),
            'add'    => __('Add', 'mvvwb-tiles'),
            'type'   => __('Type', 'mvvwb-tiles'),
            'x'      => __('X', 'mvvwb-tiles'),
            'y'      => __('Y', 'mvvwb-tiles'),
            'width'  => __('Width', 'mvvwb-tiles'),
            'height' => __('Height', 'mvvwb-tiles'),
            'title'  => __('Title', 'mvvwb-tiles'),
            'post'   => __('Post ID', 'mvvwb-tiles'),
            'url'    => __('URL', 'mvvwb-tiles'),
            'icon'   => __('Icon', 'mvvwb-tiles')
        ]);

        register_post_type('tiles', [
            'labels' => [
                'name'      => __('Tiles', 'mvvwb-tiles'),
                'add_new'   => __('Add Tiles', 'mvvwb-tiles'),
                'edit_item' => __('Edit Tiles', 'mvvwb-tiles')
            ],
            'public'            => false,
            'show_ui'           => true,
            'capability_type'   => 'post',
            'map_meta_cap'      => true,
            'hierarchical'      => false,
            'rewrite'           => false,
            'query_var'         => false,
            'show_in_nav_menus' => false,
            'delete_with_user'  => false,
            'supports'          => [ 'title' ],
            'show_in_rest'      => false,
            'menu_icon'         => 'dashicons-layout'
        ]);
    }

    /**
     * Register general styles and scripts
     */
    private static function registerScripts() {
        wp_register_style('mvvwb-tiles', MVVWB_TILES_BASE . 'style.css', [], MVVWB_TILES_VERSION);
        wp_register_script('mvvwb-tiles', MVVWB_TILES_BASE . 'index.js', [], MVVWB_TILES_VERSION);
    }

    /**
     * Register admin styles and scripts
     */
    private static function registerAdminScripts() {
        wp_register_style(
            'mvvwb-tiles-admin',
            MVVWB_TILES_BASE . 'admin.css', [],
            MVVWB_TILES_VERSION
        );
        
        wp_register_script(
            'mvvwb-tiles-admin',
            MVVWB_TILES_BASE . 'admin.js', [],
            MVVWB_TILES_VERSION
        );
    }

    /**
     * Register widgets
     */
    private static function widgetsInit() {
        register_widget(new TilesWidget);
    }

    /**
     * Add metaboxes
     */
    private static function addMetaBoxes() {
        TilesMetabox::addMetabox();
    }

    /**
     * Save metaboxes
     *
     * This function will also be called even when the metabox itself isn't active. The data is
     * taken from the $_POST variable.
     *
     * @param int $postID id of the post which was edited
     */
    private static function saveMetaBoxes($postID) {
        TilesMetabox::saveMetabox($postID, $_POST);
    }
}
