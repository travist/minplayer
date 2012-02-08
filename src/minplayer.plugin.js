/** The minplayer namespace. */
minplayer = minplayer || {};

/** Store all plugins. */
minplayer.plugin_registry = {};

/**
 * @constructor
 * @class The base class for all plugins.
 *
 * @param {object} context The jQuery context.
 * @param {object} options This components options.
 */
minplayer.plugin = function(context, options) {

  // The media player.
  this.player = null;

  // Only call the constructor if we have a context.
  if (context) {
    this.construct();
  }
};

/**
 * The constructor which is called once the context is set.
 * Any class deriving from the plugin class should place all context
 * dependant functionality within this function instead of the standard
 * constructor function since it is called on object derivation as well
 * as object creation.
 */
minplayer.plugin.prototype.construct = function() {
  // Add this plugin to the plugin registry.
  if (!minplayer.plugin_registry[this.options.id]) {
    minplayer.plugin_registry[this.options.id] = [];
  }
  minplayer.plugin_registry[this.options.id].push(this);
};

/**
 * Sets the current media player.
 *
 * @param {object} player The current media player.
 */
minplayer.plugin.prototype.setPlayer = function(player) {
  this.player = player;
};
