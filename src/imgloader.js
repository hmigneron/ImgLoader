//requires jQuery
(function(window, $) {

	if(!window.ImgLoader) {
		window.ImgLoader = {};
	}

	var settings = ImgLoader.settings = {
		loadImgTags : true,
		loadBackgroundImages : false,

		loadContext : null,

		loadItems : null,

		itemLoaded : null,
		itemError : null,
		itemsCompleted : null,
	};

	ImgLoader.loadImages = function(options) {
		var itemsLoadedCount = 0,
			itemsCount = 0;

		$.extend(settings, options);

		var onImageLoad = function() {
			itemsLoadedCount++;
			if(settings.itemLoaded !== null && typeof settings.itemLoaded === 'function') {
				settings.itemLoaded(itemsLoadedCount / itemsCount);
			}

			if(itemsLoadedCount === itemsCount) {
				if(settings.itemsCompleted !== null && typeof settings.itemsCompleted === 'function') {
					settings.itemsCompleted();
				}
			}
		}

		var onImageError = function() {
			itemsLoadedCount++;
			if(settings.itemError !== null && typeof settings.itemError === 'function') {
				settings.itemError(itemsLoadedCount / itemsCount);
			}

			if(itemsLoadedCount === itemsCount) {
				if(settings.itemsCompleted !== null && typeof settings.itemsCompleted === 'function') {
					settings.itemsCompleted();
				}
			}
		};

		var toLoad = this.getImages();

		itemsCount = toLoad.length;

		for(var i=0; i<itemsCount; i++) {
			$("<img/>")
				.load(onImageLoad)
				.error(onImageError)
				.attr("src", toLoad[i]);
		}
	};

	ImgLoader.getImages = function() {
		var images = [];

		//Load <img> tags from the page
		if(settings.loadImgTags) {
			$('img[src]', settings.loadContext).each(function() {
				images.push($(this).attr('src'));
			});
		}

		//Load background images when there are some
		//TODO: Multiple backgrounds
		if(settings.loadBackgroundImages) {
			$('*', settings.loadContext).each(function() {
				var elmBg = $(this).css('background-image'),
					bgUrl;
				if(elmBg !== '' && elmBg !== 'none') {
					bgUrl = elmBg.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
					images.push(bgUrl);
				}	
			});
		}

		//Load extra items passed by the user. Should be an array but accept a single string too
		if(settings.loadItems) {
			var extraItems = settings.loadItems;
			if (typeof extraItems == 'string' || extraItems instanceof String) {
				extraItems = [ extraItems ];
			}
			if (extraItems instanceof Array) {
				for(var i=0; i<extraItems.length; i++) {
					images.push(extraItems[i]);
				}
			}
		}

		return images;
	};

})(window, jQuery, undefined);