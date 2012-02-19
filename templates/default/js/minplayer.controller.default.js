/** The minplayer namespace. */
var minplayer = minplayer || {};

// Define the controller object.
minplayer.controller = minplayer.controller || {};

/**
 * Constructor for the minplayer.controller
 */
minplayer.controller["default"] = function(context, options) {

  // Derive from base controller
  minplayer.controller.base.call(this, context, options);
};

/** Derive from controller.base. */
minplayer.controller["default"].prototype = new minplayer.controller.base();
minplayer.controller["default"].prototype.constructor = minplayer.controller["default"];

/**
 * Return the display for this plugin.
 */
minplayer.controller["default"].prototype.getDisplay = function(context) {
  return jQuery('.media-player-controls', context);
}

// Return the elements
minplayer.controller["default"].prototype.getElements = function() {
  var elements = minplayer.controller.base.prototype.getElements.call(this);
  var timer = jQuery(".media-player-timer", this.display);
  return jQuery.extend(elements, {
    play: jQuery(".media-player-play", this.display),
    pause: jQuery(".media-player-pause", this.display),
    fullscreen: jQuery(".media-player-fullscreen", this.display),
    seek: jQuery(".media-player-seek", this.display),
    progress: jQuery(".media-player-progress", this.display),
    volume: jQuery(".media-player-volume-slider", this.display),
    timer:timer,
    duration:timer
  });
};
