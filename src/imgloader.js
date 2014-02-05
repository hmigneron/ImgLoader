//requires jQuery
(function(window, $) {
    'use strict';

    //Quick polyfill for Object.keys in IE < 9
    if (!Object.keys) {
        Object.keys = function (obj) {
            var keys = [],
                k;
            for (k in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, k)) {
                    keys.push(k);
                }
            }
            return keys;
        };
    }

    if(!window.ImgLoader) {
        window.ImgLoader = {};
    }

    //Options
    var settings = ImgLoader.settings = {

        //Decides if <img> tags are loaded automatically
        loadImgTags : true,
        
        //Decides if elements that have background images are loaded automatically
        loadBackgroundImages : true,

        //Array of images that need to be loaded
        loadItems : null,

        //Selector or DOM element that decides the context in which the images are loaded
        //Ignored if loadImgTags and loadBackgroundImages are both set to false
        loadContext : null,

        //Callback for when an image is loaded (whether it fails or succeeds)
        itemCompletedCallback : null,

        //Callback for when all the items have been loaded.
        itemsCompletedCallback : null,
    };


    ImgLoader.loadImages = function(options) {
        $.extend(settings, options);

        var itemsLoadedCount = 0,
            allItemsCount,
            singleItemCallback,
            allItemsCallback;


        var imagesToLoad = Object.keys(this.getImages());
         
        allItemsCount = imagesToLoad.length;

        singleItemCallback = settings.itemCompletedCallback || $.noop;
        allItemsCallback = settings.itemsCompletedCallback || $.noop;

        //Nothing to load -- bail
        if(allItemsCount === 0) {
            allItemsCallback();
            return;
        }

        for(var i=0; i<allItemsCount; i++) {

            //Create the image object in memory to make sure the event hasn't already happened.
            $("<img/>")
                .on("load.imgLoader error.imgLoader", function(event) {
                    itemsLoadedCount++;

                    singleItemCallback(itemsLoadedCount / allItemsCount, event.target.src, event.type === 'load');

                    if(itemsLoadedCount === allItemsCount) {
                        allItemsCallback();
                    }
                })
                .attr("src", imagesToLoad[i]);
        }
    };

    ImgLoader.getImages = function() {

        //Use as a hash to make sure an image with the same URL is not added twice
        var images = {};

        //Load <img> tags from the page
        if(settings.loadImgTags) {
            $('img[src!=""]', settings.loadContext).each(function() {
                images[$(this).attr('src')] = '';
            });
        }

        //Load background images from css when there are some
        if(settings.loadBackgroundImages) {

            //Regex pattern to match url('...')
            var matchUrl = /url\(\s*(['"]?)(.*?)\1\s*\)/g;

			$('*', settings.loadContext).each(function() {
                var elmBg = $(this).css('background-image'),
                    match,
                    bgUrl;

                if(elmBg === '' || elmBg === 'none') {
                    return;
                }

                //Needs to run in a loop for multiple backgrounds
                while (match = matchUrl.exec(elmBg)) {

                    //The first capturing group is only used for the \1 backreference (for the matching quotes)
                    //Discard the first group and only care about the second
                    bgUrl = match[2];

                    //Ignore inline data images
                    if(bgUrl.slice(0,5) !== 'data:') {
                        images[bgUrl] = '';
                    }
                }
			});
		}

		//Load extra items passed by the user. 
		if(settings.loadItems) {

			var extraItems = settings.loadItems;

            //Should be an array but accept a single string too
			if (typeof extraItems == 'string' || extraItems instanceof String) {
				extraItems = [ extraItems ];
			}

			if (extraItems instanceof Array) {
				for(var i=0; i<extraItems.length; i++) {
					images[extraItems[i]] = '';
				}
			}
		}

		return images;
	};

})(window, jQuery, undefined);