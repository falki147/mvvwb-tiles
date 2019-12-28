(function (document, Image) {
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

    function isHidden(element) {
        return window.getComputedStyle(element).display === "none";
    }

    document.addEventListener("DOMContentLoaded", function () {
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
    });
})(document, Image);
