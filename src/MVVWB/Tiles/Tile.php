<?php

namespace MVVWB\Tiles;

class Tile {
    public $x;
    
    public $y;
    
    public $width;
    
    public $height;
    
    public $postID;
    
    public $title;
    
    public $url;
    
    public $icon;

    public $type;

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
