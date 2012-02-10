/** The minplayer namespace. */
var minplayer = minplayer || {};

// Define the controllers object.
minplayer.controllers = minplayer.controllers || {};

/**
 * Constructor for the minplayer.controller
 */
minplayer.controllers["default"] = function( context, options ) {

  // Derive from base controller
  minplayer.controllers.base.call(this, context, options);
};

/** Derive from controllers.base. */
minplayer.controllers["default"].prototype = new minplayer.controllers.base();
minplayer.controllers["default"].prototype.constructor = minplayer.controllers["default"];

// Return the elements
minplayer.controllers["default"].prototype.getElements = function() {
  var elements = minplayer.controllers.base.prototype.getElements.call(this);
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

// Add this to the minplayer.plugins array.
minplayer.plugins = minplayer.plugins || [];
minplayer.plugins.push({
  object:minplayer.controllers["default"],
  element:".media-player-controls"
});
