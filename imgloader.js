//requires jQuery
(function(window, $) {

	if(!window.ImgLoader) {
		window.ImgLoader = {};
	}

	//TODO : Add options to search only a part of the DOM, 
	//		 Add option to load images from css (and from pseudo states)
	//		 Add option to load other images too (that could be loaded rfom js later on for example)
	var settings = ImgLoader.settings = {
		itemLoaded : null,
		itemError : null,
		itemsCompleted : null
	};

	ImgLoader.configure = function(options) {
		$.extend(settings, options);
		return this;
	};

	ImgLoader.loadImages = function() {

		var itemsLoadedCount = 0,
		itemsCount = 0;

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

		var toLoad = [];

		$('img[src]').each(function() {
			toLoad.push($(this).attr('src'));
		});

		itemsCount = toLoad.length;

		for(var i=0; i<itemsCount; i++) {
			$("<img/>")
			.load(onImageLoad)
			.error(onImageError)
			.attr("src", toLoad[i]);
		}
	};

})(window, jQuery, undefined);