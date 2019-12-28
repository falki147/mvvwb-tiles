<?php
/**
 * File which is used to render the tiles metabox HTML
 *
 * Following variables are passed to it:
 * - self::TILES_DATA_NAME: Contains the name which should be used for the HTML input element
 * - self::defaultIcons: Contains an array of the default icons
 */

namespace MVVWB\Tiles\Views\Admin;

?><div class="mvvwb-tiles">
    <input class="data" type="hidden" name="<?=self::TILES_DATA_NAME?>" value="<?=esc_attr(json_encode($data))?>">
    <input class="data-icons" type="hidden" value="<?=esc_attr(json_encode(self::defaultIcons))?>">
</div>
