<?php
/**
 * Defines TilesWidget class
 */

namespace MVVWB\Tiles;

/**
 * Tiles widget which displays the tiles
 */
class TilesWidget extends \WP_Widget {
    /**
     * Name of the tiles input field
     * @internal
     */
    const TILES_NAME = 'selectedTiles';

    /**
     * Name of the tablet tiles input field
     * @internal
     */
    const TILESTABLET_NAME = 'selectedTilesTablet';

    /**
     * Name of the mobile tiles input field
     * @internal
     */
    const TILESMOBILE_NAME = 'selectedTilesMobile';

    /**
     * Construct the widget with default values
     */
    function __construct() {
        parent::__construct(
            'tiles-widget', __('Tiles', 'mvvwb-tiles')
        );
    }

    /**
     * Render the widget
     *
     * The HTML code is written to the output buffer.
     *
     * @param string[] $args display arguments
     * @param string[] $instance settings for the particular instance
     */
    public function widget($args, $instance) {
        if (!$instance[self::TILES_NAME])
            return;

        // Load style/scripts
        wp_enqueue_style('mvvwb-tiles');
        wp_enqueue_script('mvvwb-tiles');

        $tiles = get_post((int) $instance[self::TILES_NAME]);

        $tilesTablet = $instance[self::TILESTABLET_NAME] ?
            get_post((int) $instance[self::TILESTABLET_NAME]) : null;

        $tilesMobile = $instance[self::TILESMOBILE_NAME] ?
            get_post((int) $instance[self::TILESMOBILE_NAME]) : null;

        echo $args['before_widget'];

        if ($tiles) {
            $classes = [ 'tiles-desktop' ];

            if (!$tilesTablet)
                $classes[] = 'tiles-tablet';

            if (!$tilesTablet && !$tilesMobile)
                $classes[] = 'tiles-mobile';

            $this->drawTiles(TilesHelper::getTilesData($tiles), $classes);
        }

        if ($tilesTablet) {
            $classes = [ 'tiles-tablet' ];

            if (!$tilesMobile)
                $classes[] = 'tiles-mobile';

            $this->drawTiles(TilesHelper::getTilesData($tilesTablet), $classes);
        }

        if ($tilesMobile)
            $this->drawTiles(TilesHelper::getTilesData($tilesMobile), [ 'tiles-mobile' ]);

        echo $args['after_widget'];
    }

    /**
     * Render the admin form for selecting the tiles.
     *
     * The HTML code is written to the output buffer.
     *
     * @param string[] $instance settings for the particular instance
     */
    public function form($instance) {
        $posts = get_posts([ 'post_type' => 'tiles' ]);
        $selected = isset($instance[self::TILES_NAME]) ? $instance[self::TILES_NAME] : '';

        $selectedTablet = isset($instance[self::TILESTABLET_NAME]) ?
            $instance[self::TILESTABLET_NAME] : '';

        $selectedMobile = isset($instance[self::TILESMOBILE_NAME]) ?
            $instance[self::TILESMOBILE_NAME] : '';

        $this->drawSelect(__('Desktop Tiles', 'mvvwb-tiles') . ':', self::TILES_NAME, $posts, $selected);
        $this->drawSelect(__('Tablet Tiles', 'mvvwb-tiles') . ':', self::TILESTABLET_NAME, $posts, $selectedTablet);
        $this->drawSelect(__('Mobile Tiles', 'mvvwb-tiles') . ':', self::TILESMOBILE_NAME, $posts, $selectedMobile);
    }

    /**
     * Store the new instance data
     *
     * @param string[] $newInstance the new instance data
     * @param string[] $oldInstance the old instance data
     */
    public function update($newInstance, $oldInstance) {
        return [
            self::TILES_NAME => $newInstance[self::TILES_NAME],
            self::TILESTABLET_NAME => $newInstance[self::TILESTABLET_NAME],
            self::TILESMOBILE_NAME => $newInstance[self::TILESMOBILE_NAME]
        ];
    }

    /**
     * Render the tiles selection box
     *
     * The HTML code is written to the output buffer.
     *
     * @param string $title the title of the selection box
     * @param string $name the name of the selection box
     * @param \WP_Post $posts the available tiles objects
     * @param string $selected the currently selected tiles instance
     */
    private function drawSelect($title, $name, $posts, $selected) {
        echo '<p>';
        echo '<label for="', $this->get_field_id($name), '">', $title, '</label>';
        echo '<select class="widefat" id="', $this->get_field_id($name), '" name="', $this->get_field_name($name), '">';
        echo '<option value=""';

        if ($selected === '')
            echo ' selected';

        echo '>', esc_html__('None', 'mvvwb-tiles'), '</option>';

        foreach ($posts as $post) {
            echo '<option value="', $post->ID, '"';

            if ($post->ID == $selected)
                echo ' selected';

            echo '>', $post->post_title, '</option>';
        }

        echo '</select>';
        echo '</p>';
    }

    /**
     * Renders the tiles data
     *
     * The HTML code is written to the output buffer.
     *
     * @param Tile[] $tilesData the data of the tiles instance
     * @param string $classes the CSS classes which are appended to the container element
     */
    private function drawTiles($tilesData, $classes) {
        list($x, $y, $width, $height) = TilesHelper::getDimensions($tilesData);

        $tilesClass = $classes ? ' ' . implode(' ', $classes) : '';
        $tilesStyle = 'padding-top:' . ($height / $width * 100) . '%';

        $tiles = [];

        foreach ($tilesData as $tile) {
            $tileLeft = ($tile->x - $x) / $width * 100 . '%';
            $tileTop = ($tile->y - $y) / $height * 100 . '%';
            $tileWidth = $tile->width / $width * 100 . '%';
            $tileHeight = $tile->height / $height * 100 . '%';
            $title = $tile->title;

            $style = "left:$tileLeft;top:$tileTop;width:$tileWidth;height:$tileHeight;";

            $image = null;
            $url = null;
            $tileClass = '';

            if ($tile->type === 'post' && $tile->postid !== 0) {
                $post = null;

                if ($tile->postid < 0) {
                    $post = wp_get_recent_posts(
                        [ 'numberposts' => 1, 'offset' => -1 - $tile->postid ], OBJECT
                    );

                    if ($post === false)
                        $post = null;
                    else
                        $post = $post[0];
                }
                else
                    $post = get_post((int) $tile->postid);

                if ($post !== null) {
                    $image = wp_get_attachment_image_src(get_post_thumbnail_id($post), 'large')[0];
                    $url = get_permalink($post);

                    if (!$title)
                        $title = $post->post_title;
                }
            }
            elseif ($tile->type === 'url') {
                $url = $tile->url;
                $tileClass = $tile->icon;
            }

            if ($image !== null)
                $style .= 'background-image:url(' . \esc_url($image) . ');';

            $tiles[] = [
                'class' => $tileClass ? ' ' . $tileClass : '',
                'style' => $style,
                'url' => $url,
                'title' => $title ? ' title="' . esc_attr($title) .
                    '" aria-label="' . esc_attr($title) . '"' : ''
            ];
        }

        include MVVWB_TILES_VIEWS . 'TilesWidgetView.php';
    }
}
