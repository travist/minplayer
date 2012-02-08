/** The minplayer namespace. */
var minplayer = minplayer || {};

// Define the busy object.
minplayer.playLoader = minplayer.playLoader || {};

// constructor.
minplayer.playLoader["default"] = function(context, options) {

  // Derive from busy.base
  minplayer.playLoader.base.call(this, context, options);
};

// Define the prototype for all controllers.
minplayer.playLoader["default"].prototype = new minplayer.playLoader.base();
minplayer.playLoader["default"].prototype.constructor = minplayer.playLoader["default"];

// Return the elements
minplayer.playLoader["default"].prototype.getElements = function() {
  var elements = minplayer.playLoader.base.prototype.getElements.call(this);
  return jQuery.extend(elements, {
    busy:jQuery(".media-player-loader", this.display),
    bigPlay:jQuery(".media-player-big-play", this.display),
    preview:jQuery(".media-player-preview", this.display)
  });
};

// Add this to the minplayer.plugins array.
minplayer.plugins = minplayer.plugins || [];
minplayer.plugins.push({
  id:"play_loader_default",
  object:minplayer.playLoader["default"],
  element:".media-player-play-loader"
});
