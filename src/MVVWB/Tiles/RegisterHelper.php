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
     * Initilize post type and load styles/scripts
     */
    private static function init() {
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

        wp_register_script(
            'mvvwb-tiles-admin-js',
            MVVWB_TILES_BASE . 'admin.js',
            []
        );

        wp_enqueue_style('mvvwb-tiles-css', MVVWB_TILES_BASE . 'style.css');

        wp_enqueue_script('mvvwb-tiles-index', MVVWB_TILES_BASE . 'index.js');
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
     * Load admin scripts, styles and localized text entries
     */
    private static function adminAddScripts() {
        wp_enqueue_script('mvvwb-tiles-admin-js');
        wp_enqueue_style('mvvwb-tiles-admin-css', MVVWB_TILES_BASE . 'admin.css', false, '1.0.0');

        wp_localize_script('mvvwb-tiles-admin-js', 'mvvwbTilesI18n', [
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

    /**
     * Register hooks for initializing theme
     */
    public static function register() {
        load_plugin_textdomain('mvvwb-tiles', false, MVVWB_TILES_TRANLATIONS);

        add_action('init', function () { self::init(); });
        add_action('widgets_init', function () { self::widgetsInit(); });
        add_action('add_meta_boxes', function () { self::addMetaBoxes(); });
        add_action('admin_enqueue_scripts', function () { self::adminAddScripts(); });
        add_action('save_post', function ($postID) { self::saveMetaBoxes($postID); });
    }
}
