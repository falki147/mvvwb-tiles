<?php

namespace MVVWB\Tiles;

class TilesMetabox {
    const TILES_DATA_NAME = 'mvvwb-tiles-data';

    const defaultIcons = [
        "facebook" => "Facebook",
        "youtube" => "YouTube",
        "twitter" => "Twitter",
        "instagram" => "Instagram"
    ];

    public static function addMetabox() {
        add_meta_box(
            'tiles-box',
            __('Tiles', 'mvvwb-tiles'),
            function ($post) {
                $data = TilesHelper::getTilesData($post);
                
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
                    ];;

                include MVVWB_TILES_ADMIN_VIEWS . 'TilesMetaboxView.php';
            },
            [ 'tiles' ], 'normal'
        );
    }

    public static function saveMetabox($postID, $values) {
        if (isset($values[self::TILES_DATA_NAME]))
            TilesHelper::setTilesData(get_post($postID), json_decode(wp_unslash($values[self::TILES_DATA_NAME]), true));
    }
}
