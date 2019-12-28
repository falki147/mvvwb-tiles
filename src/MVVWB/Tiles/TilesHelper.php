<?php
/**
 * Defines TilesHelper class
 */

namespace MVVWB\Tiles;

/**
 * Helps with loading and saving the tiles data
 *
 * This class is not intended to be intantiated
 */
class TilesHelper {
    /**
     * Retrieves the tiles data from a post object
     *
     * @param \WP_Post $post the post where to get the data from
     * @return Tile[] the tiles
     */
    public static function getTilesData($post) {
        return json_decode(get_post_meta($post->ID, 'mvvwb_tiles', true));
    }

    /**
     * Sets the tiles data of the given post
     *
     * @param \WP_Post $post the post where the data should be set
     * @param Tile[] $data the tiles data
     */
    public static function setTilesData($post, $data) {
        usort($data, function ($a, $b) {
            if ($a->y != $b->y)
                return $a->y - $b->y;

            return $a->x - $b->x;
        });

        update_post_meta($post->ID, 'mvvwb_tiles', json_encode($data));
    }

    /**
     * Calculates the bounds of the tiles
     *
     * @param Tile[] $data the tiles data
     * @return int[] an integer array containing x, y, width and height values
     */
    public static function getDimensions($data) {
        if (!$data)
            return [ 0, 0, 0, 0 ];

        $x1 = PHP_INT_MAX;
        $y1 = PHP_INT_MAX;
        $x2 = PHP_INT_MIN;
        $y2 = PHP_INT_MIN;

        foreach ($data as $tile) {
            $x1 = min($x1, $tile->x);
            $y1 = min($y1, $tile->y);
            $x2 = max($x2, $tile->x + $tile->width);
            $y2 = max($y2, $tile->y + $tile->height);
        }

        return [ $x1, $y1, $x2 - $x1, $y2 - $y1 ];
    }
}
