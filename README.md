#ImgLoader.js

A simple way to pre-load images and get progress notification.

ImgLoader can load images from <img> tags, from CSS properties (through background-image) or simply images sent as parameters.

It can be used on its own when or along with a progress bar like [NProgress](https://github.com/rstacruz/nprogress) using the different callbacks to update the progress bar.

###Installation

ImgLoader needs jQuery >= 1.7 to operate. Add a reference to imgloader.min.js to your project.

###Usage

Call the loadImages function to start loading images

```javascript
ImgLoader.loadImages()
```

By default, ImgLoader will load all <img> tags as well as all images coming from the ```background-image``` CSS property (the shortform using simply ```background``` is fine too).

###Options (Advanced usage)

| Name         | Type           | Default      | Description   |
| :------------|:---------------|:-------------|:--------------|
| loadImgTags  | boolean        | true         | Decides if <img> tags are loaded automatically |
| loadBackgroundImages | boolean | true        | Decides if images from CSS (background images) are loaded automatically |
| loadItems    | String or Array | null        | One or many URL of images that aren't on the page but that need to be loaded |
| loadContext  | String or DOM Element | null  | Selector or DOM element that decides the context in which the images are loaded. Ignored if loadImgTags and loadBackgroundImages are both set to false |
| itemCompletedCallback | function | null      | Called when one image has finished loaded (or has errored). Called with 3 parameters : the % of images that have been loaded, the URL of the loaded image and a flag inticating wheter the image has loaded successfully or failed. |
| itemsCompletedCallback | function | null     | Called when all the images have been loaded |

####Examples

**Using the callbacks : **

There are 2 callback functions that can be used to follow the progress of the images being loaded : 

```itemCompletedCallback``` is called whenever an image is done loading (whether it succeeded or failed).

```itemsCompletedCallback``` is called once all the images have been loaded.

```javascript
var options = {
    itemCompletedCallback : function(percentage, url, success) {
        if(success) {
            console.log('the following image loaded successfully : ' + url);
        }
        else {
            console.log('the following image failed to load : ' + url);
        }

        //percentage is between 0 and 1
        console.log(percentage * 100 + '% of the images have been loaded');
    },

    itemsCompletedCallback : function() {
        console.log('All images have loaded');
    }
};

ImgLoader.loadImages(options);
```

**Selecting only the images contained within a specified element.**

The ```loadContext``` can be either 
- A selector like ```'#my-container'``` or ```'.my-class'```
- A DOM Element :```document.getElementById('my-container')```

```javascript
var options = {
    //Only the images inside the <div id="my-container"> element will be loaded
    loadContext : '#my-container',
};

ImgLoader.loadImages(options);
```

**Loading only specified images (and not the ones from the DOM)**

The ```loadItems``` can be either a ```string``` : 'http://example.com/image1.png' or an array of strings.

```javascript
var options = {
    
    loadImgTags : false,
    loadBackgroundImages : false,

    loadItems : [ 'http://example.com/image1.png', 'http://example.com/image2.png', 'http://example.com/image3.png']
};

ImgLoader.loadImages(options);
```