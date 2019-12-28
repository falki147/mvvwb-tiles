<?php
/**
 * Entry point for registering post types, metaboxes, etc.
 */
/**
 * Plugin Name: MVVWB-Tiles
 * Description: Plugin, which allows the user to display posts and links in a grid.
 * Version: 1.0.0
 * Author: Florian Preinfalk
 * Author URI: http://www.preinfalk.co.at
 */

/** Bootstrap everything */
include 'start.php';

MVVWB\Tiles\RegisterHelper::register();
