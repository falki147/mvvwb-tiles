<?php
/**
 * Defines RegisterHelper class
 */

namespace MVVWB\Tiles;

/**
 * Holds the information of an tile
 */
class Tile {
    /** @var int x-position */
    public $x;

    /** @var int y-position */
    public $y;

    /** @var int width */
    public $width;

    /** @var int height */
    public $height;

    /**
     * @var int id of the post. If the id is 0, no post is assigned to the tile. If it is less than
     * 0, it represents the most recent posts. This means that an id of -1 is the last post and an
     * id of -2 the post before.
     */
    public $postID;

    /** @var string title of the tile */
    public $title;

    /** @var string url of the tile if the tile type is 'url' */
    public $url;

    /** @var string name of the icon */
    public $icon;

    /**
     * @var string type of the tile. It can be either 'post' or 'url'.
     */
    public $type;

    /**
     * Initializes all the values
     *
     * @param int $x x-position
     * @param int $y y-position
     * @param int $width width
     * @param int $height height
     * @param int $postID post id
     * @param string $title title
     * @param string $url url
     * @param string $icon icon
     * @param string $type type
     */
    public function __construct(
        $x = 0, $y = 0, $width = 0, $height = 0, $postID = 0,
        $title = '', $url = '', $icon = '', $type = ''
    ) {
        $this->x = $x;
        $this->y = $y;
        $this->width = $width;
        $this->height = $height;
        $this->postID = $postID;
        $this->title = $title;
        $this->url = $url;
        $this->icon = $icon;
        $this->type = $type;
    }
}
