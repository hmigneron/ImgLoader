(function($) {

    var imgUrl = "http://placehold.it/100x100",
        imgSecondUrl = "http://placehold.it/200x200";

    var contextSetup = {

        setup : function() {
            
            $('#qunit-fixture').empty();

            $('<div />').attr('id', 'first-container').appendTo('#qunit-fixture');
            $('<div />').attr('id', 'second-container').appendTo('#qunit-fixture');

            $('<img />').attr('src', imgUrl).appendTo('#first-container');
            $('<img />').attr('src', imgSecondUrl).appendTo('#second-container');
        },
        
        teardown : function() {
            $('#qunit-fixture').empty();
        }
    };


    module('Callbacks and selector context', contextSetup);
    asyncTest("Items Completed callback called", function() {
        expect(1);

        ImgLoader.loadImages({
            itemsCompletedCallback : function() {
                ok(true, "itemsCompletedCallback called");
                start();
            }
        });
    });

    asyncTest("All Images loaded with no specified context", function() {
        
        //2 images
        expect(2);

        ImgLoader.loadImages(
        {
            itemCompletedCallback : function(percentage, imgLoadedUrl, imageLoaded) {
                ok(true, "itemCompletedCallback function called");
            },
            itemsCompletedCallback : function() {
                start();

            }
        });
    });

    asyncTest("Only images inside context loaded with selector", function() {
        
        expect(3);

        ImgLoader.loadImages(
        {
            loadContext : '#first-container',
            itemCompletedCallback : function(percentage, imgLoadedUrl, imageLoaded) {
                ok(true, "itemCompletedCallback function called");
                equal(imgUrl, imgLoadedUrl, "Right image loaded");
                notEqual(imgSecondUrl, imgLoadedUrl, "Wribg image not loaded");
            },
            itemsCompletedCallback : function() {
                start();
            }
        });
    });

    asyncTest("Only images inside context loaded with DOM element", function() {
        expect(3);

        context = $('#first-container').get();

        ImgLoader.loadImages(
        {
            loadContext : context,
            itemCompletedCallback : function(percentage, imgLoadedUrl, imageLoaded) {
                ok(true, "itemCompletedCallback function called");
                equal(imgUrl, imgLoadedUrl, "Right image loaded");
                notEqual(imgSecondUrl, imgLoadedUrl, "Wribg image not loaded");
            },
            itemsCompletedCallback : function() {
                start();
            }
        });
    });



    var completeSetup = {

        setup : function() {

        },

        teardown : function() {
            
        }
    };

    module('Image and background loading', completeSetup);
    asyncTest("Found items load without error", function() {

        expect(1);

        ImgLoader.loadImages({
            loadImgTags : true,
            loadContext : '.found',
            itemCompletedCallback : function(percentage, src, loaded) {
                ok(loaded, "Image loaded properly");
            },
            itemsCompletedCallback : function() {
                start();
            }
        });
    });

    asyncTest("Unfound items load with error", function() {

        expect(1);

        ImgLoader.loadImages({
            loadImgTags : true,
            loadContext : '.not-found',
            itemCompletedCallback : function(percentage, src, loaded) {
                ok(!loaded, "Image not found and triggered error");
            },
            itemsCompletedCallback : function() {
                start();
            }
        });
    });

    asyncTest("Empty images do not trigger events", function() {

        expect(1);

        ImgLoader.loadImages({
            loadImgTags : true,
            loadContext : '.empty',
            itemCompletedCallback : function(percentage, src, loaded) {
                ok(false, "Event should not be triggered");
            },
            itemsCompletedCallback : function() {
                ok(true, "Completed event triggered");
                start();
            }
        });
    });

    asyncTest("CSS Background image is loaded", function() {

        expect(1);

        ImgLoader.loadImages({
            loadBackgroundImages : true,
            loadContext : '.image-background',
            itemCompletedCallback : function(percentage, src, loaded) {
                ok(true, "Background image loaded");
            },
            itemsCompletedCallback : function() {
                start();
            }
        });
    });

    asyncTest("Multiple CSS Background images are loaded", function() {

        expect(2);

        ImgLoader.loadImages({
            loadBackgroundImages : true,
            loadContext : '.multiple-background',
            itemCompletedCallback : function(percentage, src, loaded) {
                ok(true, "Background image loaded");
            },
            itemsCompletedCallback : function() {
                start();
            }
        });
    });

    asyncTest("Inline CSS Background images are not loaded", function() {

        expect(1);

        ImgLoader.loadImages({
            loadBackgroundImages : true,
            loadContext : '.inline-background',
            itemCompletedCallback : function(percentage, src, loaded) {
                ok(false, "Event should not be triggered");
            },
            itemsCompletedCallback : function() {
                ok(true, "Completed event triggered");
                start();
            }
        });
    });

    asyncTest("Gradient CSS Background images are not loaded", function() {

        expect(1);

        ImgLoader.loadImages({
            loadBackgroundImages : true,
            loadContext : '.gradient-background',
            itemCompletedCallback : function(percentage, src, loaded) {
                ok(false, "Event should not be triggered");
            },
            itemsCompletedCallback : function() {
                ok(true, "Completed event triggered");
                start();
            }
        });
    });

    asyncTest("Duplicate images are only loaded once", function() {
        expect(2);

        ImgLoader.loadImages({
            loadBackgroundImages : true,
            loadContext : '.dupes',
            itemCompletedCallback : function(percentage, src, loaded) {
                ok(true, "Item loaded event should be triggered once");
            },
            itemsCompletedCallback : function() {
                ok(true, "Completed event triggered");
                start();
            }
        });
    });

}(jQuery));