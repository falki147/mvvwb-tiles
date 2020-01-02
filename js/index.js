(function (document, Image) {
    /**
     * Execute callback when image was loaded
     * @param src image source
     * @param cb callback
     */
    function loaded(src, cb) {
        var image = new Image();
        image.src = src;

        if (image.loaded)
            cb();
        else
            image.addEventListener("load", function () {
                cb();
            });
    }

    /**
     * Execute callback when all the tiles have loaded
     * @param parent container element of the tiles
     * @param cb callback
     */
    function tilesLoaded(parent, cb) {
        var tiles = parent.getElementsByClassName("tile");
        var imageSources = [];

        for (var i = 0; i < tiles.length; ++i) {
            var match = tiles[i].style.backgroundImage.match(/^url\(\"(.*)\"\)$/);

            if (match && imageSources.indexOf(match[1]) < 0)
                imageSources.push(match[1]);
        }

        var counter = imageSources.length;

        for (var i = 0; i < imageSources.length; ++i)
            loaded(imageSources[i], function () {
                if (--counter === 0)
                    cb();
            });
    }

    /**
     * Check if element is hidden
     * @param element
     * @return true, if it is
     */
    function isHidden(element) {
        return window.getComputedStyle(element).display === "none";
    }

    /**
     * Set loaded class on container element, when all images of the tiles were loaded
     */
    function checkTiles() {
        var tiles = document.getElementsByClassName("tiles");

        for (var i = 0; i < tiles.length; ++i) {
            if (isHidden(tiles[i])) {
                // Set loaded when tiles are hidden, so if a resize happens it's always displayed
                tiles[i].classList.add("loaded");
            }
            else {
                tilesLoaded(tiles[i], (function (tiles) {
                    tiles.classList.add("loaded");
                }).bind(this, tiles[i]));
            }
        }
    }

    // Bind event
    document.addEventListener("DOMContentLoaded", checkTiles);
})(document, Image);
