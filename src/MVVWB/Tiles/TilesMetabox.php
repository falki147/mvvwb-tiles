<?php
/**
 * Defines TilesMetabox class
 */

namespace MVVWB\Tiles;

/**
 * Handles the metabox functionality for the tiles data
 *
 * It creates the HTML for the metabox and handles the storing of the data with the help of the
 * TilesHelper.
 *
 * This class is not intended to be intantiated
 */
class TilesMetabox {
    /**
     * Name of the data HTML input field
     * @internal
     */
    const TILES_DATA_NAME = 'mvvwb-tiles-data';

    /**
     * Default icons
     * @internal
     */
    const defaultIcons = [
        "facebook" => "Facebook",
        "youtube" => "YouTube",
        "twitter" => "Twitter",
        "instagram" => "Instagram"
    ];

    /**
     * Adds the metabox to wordpress
     */
    public static function addMetabox() {
        add_meta_box(
            'tiles-box',
            __('Tiles', 'mvvwb-tiles'),
            function ($post) {
                $data = TilesHelper::getTilesData($post);

                // Set default values if no data has been assigned yet
                if ($data === null)
                    $data = [
                        new Tile(0, 0, 3, 2),
                        new Tile(3, 0, 1, 1),
                        new Tile(4, 0, 2, 2),
                        new Tile(3, 1, 1, 1),
                        new Tile(0, 2, 1, 1),
                        new Tile(1, 2, 1, 1),
                        new Tile(2, 2, 2, 1),
                        new Tile(4, 2, 2, 1)
                    ];

                include MVVWB_TILES_ADMIN_VIEWS . 'TilesMetaboxView.php';
            },
            [ 'tiles' ], 'normal'
        );
    }

    /**
     * Saves the data to the post if the field was set
     *
     * @param int $postID id of the post
     * @param mixed[] $values values which were sent with the request e.g. $_POST
     */
    public static function saveMetabox($postID, $values) {
        if (isset($values[self::TILES_DATA_NAME]))
            TilesHelper::setTilesData(get_post($postID), json_decode(wp_unslash($values[self::TILES_DATA_NAME]), true));
    }
}
