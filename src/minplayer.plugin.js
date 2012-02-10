/** The minplayer namespace. */
minplayer = minplayer || {};

/**
 * @constructor
 * @class The base class for all plugins.
 *
 * @param {object} context The jQuery context.
 * @param {object} options This components options.
 */
minplayer.plugin = function(context, options) {

  // Only call the constructor if we have a context.
  if (context) {
    this.construct();
  }
};

/** Static array to keep track of plugin instances. */
minplayer.plugin.instances = {};

/**
 * The constructor which is called once the context is set.
 * Any class deriving from the plugin class should place all context
 * dependant functionality within this function instead of the standard
 * constructor function since it is called on object derivation as well
 * as object creation.
 */
minplayer.plugin.prototype.construct = function() {

  // If this is a player, then it needs a new plugin
  if (this.options.name == 'player') {
    this.loadPlugins();
    this.options.name = 'player';
  }

  // Add this plugin.
  this.addPlugin(this.options.name, this);
};

/**
 * Destructor.
 */
minplayer.plugin.prototype.destroy = function() {
  // Remove the pointer to the plugins array so it will be garbage collected.
  if (minplayer.plugin.instances[this.options.id][this.options.name]) {
    minplayer.plugin.instances[this.options.id][this.options.name] = null;
  }
};

/**
 * Adds a new plugin to this player.
 *
 * @param {string} name The name of this plugin.
 * @param {object} plugin A new plugin object, derived from media.plugin.
 */
minplayer.plugin.prototype.addPlugin = function(name, plugin) {

  // Only continue if the plugin exists.
  if (plugin.isValid()) {

    // Add this to the plugins.
    minplayer.plugin.instances[this.options.id][name] = plugin;
  }
};

/**
 * Gets a plugin by name.
 *
 * @param {string} name The name of the plugin.
 * @return {object} The plugin for the provided name.
 */
minplayer.plugin.prototype.getPlugin = function(name) {
  if (minplayer.plugin.instances[this.options.id][name]) {
    return minplayer.plugin.instances[this.options.id][name];
  }
  return null;
};

/**
 * Loads all of the available plugins.
 */
minplayer.plugin.prototype.loadPlugins = function() {
  var plugin = null;
  var pluginInfo = {};
  var pluginContext = null;

  // Initialize this plugins array.
  minplayer.plugin.instances[this.options.id] = {};

  // Iterate through all the plugins.
  var i = minplayer.plugins.length;
  while (i--) {

    // Get the plugin information.
    pluginInfo = minplayer.plugins[i];
    if (pluginInfo.element) {
      pluginContext = jQuery(pluginInfo.element, this.display);
    }
    else {
      pluginContext = this.display;
    }

    // Create the new plugin.
    plugin = new pluginInfo.object(pluginContext, this.options);
  }
};

/**
 * Iterate over each plugin.
 *
 * @param {function} callback Called for each plugin in this player.
 */
minplayer.plugin.prototype.eachPlugin = function(callback) {
  for (var name in minplayer.plugin.instances[this.options.id]) {
    if (minplayer.plugin.instances[this.options.id].hasOwnProperty(name)) {
      callback.call(this, minplayer.plugin.instances[this.options.id][name]);
    }
  }
};

/**
 * Initializes the plugin.
 */
minplayer.plugin.prototype.initialize = function() {
};
