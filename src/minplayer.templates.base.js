/** The minplayer namespace. */
var minplayer = minplayer || {};

/** All of the template implementations */
minplayer.templates = minplayer.templates || {};

/**
 * @constructor
 * @extends minplayer.display
 * @class The base template class which all templates should derive.
 *
 * @param {object} context The jQuery context.
 * @param {object} options This components options.
 */
minplayer.templates.base = function(context, options) {

  // Derive from display
  minplayer.display.call(this, 'template', context, options);
};

/** Derive from minplayer.display. */
minplayer.templates.base.prototype = new minplayer.display();

/** Reset the constructor. */
minplayer.templates.base.prototype.constructor = minplayer.templates.base;

/**
 * @see minplayer.plugin#construct
 */
minplayer.templates.base.prototype.construct = function() {

  // Call the minplayer display constructor.
  minplayer.display.prototype.construct.call(this);

  // We are now ready.
  this.ready();
};

/**
 * @see minplayer.display#getElements
 * @return {object} The display elemnents for this component.
 */
minplayer.templates.base.prototype.getElements = function() {
  var elements = minplayer.display.prototype.getElements.call(this);
  return jQuery.extend(elements, {
    player: null,
    display: null,
    media: null
  });
};

/**
 * Called when the media player goes into full screen mode.
 *
 * @param {boolean} full TRUE - The player is in fullscreen, FALSE otherwise.
 */
minplayer.templates.base.prototype.onFullScreen = function(full) {
};
