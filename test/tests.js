// Test <img> tag
// Test empty src img tag
// Test background image
// Test multiple background
// Test inline image (data)
// Test background image with linear gradient or other invalid
// Test extra items (array)
// Test extra items (string)
// Test dupes make sure not loaded twice

//Test when image is loaded the callback has the source

// <img id="found" src="" />
// <img id="not-found" src="http://example.com/404" />
// <img id="empty" />

// <div id="image-background" class="image-background"></div>
// <div id="multiple-background" class="multiple-background"></div>
// <div id="inline-background" class="inline-background"></div>
// <div id="gradient-background" class="gradient-background"></div>

(function($) {

    var imgUrl = "http://placehold.it/100x100",
        imgSecondUrl = "http://placehold.it/200x200",
        imgNotFoundUrl = "http://example.com/404";

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


    module('Ballbacks and selector context', contextSetup);
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


}(jQuery));