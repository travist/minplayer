/** The minplayer namespace. */
var minplayer = minplayer || {};

/**
 * @constructor
 * @class A class to easily handle images.
 * @param {object} context The jQuery context.
 * @param {object} options This components options.
 */
minplayer.image = function(context, options) {

  // Determine if the image is loaded.
  this.loaded = false;

  // The image loader.
  this.loader = null;

  // The ratio of the image.
  this.ratio = 0;

  // The image element.
  this.image = null;

  // Derive from display
  minplayer.display.call(this, context, options);
};

/** Derive from minplayer.display. */
minplayer.image.prototype = new minplayer.display();

/** Reset the constructor. */
minplayer.image.prototype.constructor = minplayer.image;

/**
 * @see minplayer.plugin.construct
 */
minplayer.image.prototype.construct = function() {

  // Set the name of this plugin.
  this.options.name = 'image';

  // Say we need to resize.
  this.allowResize = true;

  // Call the media display constructor.
  minplayer.display.prototype.construct.call(this);

  // Set the container to not show any overflow...
  this.display.css('overflow', 'hidden');

  // Create the image loader.
  var _this = this;
  this.loader = new Image();
  this.loader.onload = function() {
    _this.loaded = true;
    _this.ratio = (_this.loader.width / _this.loader.height);
    _this.resize();
    _this.trigger('loaded');
  };
};

/**
 * Loads an image.
 *
 * @param {string} src The source of the image to load.
 */
minplayer.image.prototype.load = function(src) {

  // First clear the previous image.
  this.clear(function() {

    // Create the new image, and append to the display.
    this.image = jQuery(document.createElement('img')).attr({src: ''}).hide();
    this.display.append(this.image);
    this.loader.src = src;
  });
};

/**
 * Clears an image.
 *
 * @param {function} callback Called when the image is done clearing.
 */
minplayer.image.prototype.clear = function(callback) {
  this.loaded = false;
  if (this.image) {
    var _this = this;
    this.image.fadeOut(function() {
      _this.image.attr('src', '');
      _this.loader.src = '';
      $(this).remove();
      callback.call(_this);
    });
  }
  else {
    callback.call(this);
  }
};

/**
 * Resize the image provided a width and height or nothing.
 *
 * @param {integer} width (optional) The width of the container.
 * @param {integer} height (optional) The height of the container.
 */
minplayer.image.prototype.resize = function(width, height) {
  width = width || this.display.width();
  height = height || this.display.height();
  if (width && height && this.loaded) {

    // Get the scaled rectangle.
    var rect = this.getScaledRect(this.ratio, {
      width: width,
      height: height
    });

    // Now set this image to the new size.
    if (this.image) {
      this.image.attr('src', this.loader.src).css({
        marginLeft: rect.x,
        marginTop: rect.y,
        width: rect.width,
        height: rect.height
      });
    }

    // Show the container.
    this.image.fadeIn();
  }
};

/**
 * @see minplayer.display#onResize
 */
minplayer.image.prototype.onResize = function() {

  // Resize the image to fit.
  this.resize();
};
