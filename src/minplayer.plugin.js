/** The minplayer namespace. */
minplayer = minplayer || {};

/**
 * @constructor
 * @class The base class for all plugins.
 *
 * @param {string} name The name of this plugin.
 * @param {object} context The jQuery context.
 * @param {object} options This components options.
 */
minplayer.plugin = function(name, context, options) {

  // The name of this plugin.
  this.name = name;

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

  // Adds this as a plugin.
  this.addPlugin();
};

/**
 * Destructor.
 */
minplayer.plugin.prototype.destroy = function() {
  var plugin = this.getPlugin();
  plugin = null;
};

/**
 * Loads all of the available plugins.
 */
minplayer.plugin.prototype.loadPlugins = function() {
  var plugin = null;
  var pluginInfo = {};
  var pluginContext = null;

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
 * Plugins should call this method when they are ready.
 */
minplayer.plugin.prototype.ready = function() {

  // Set the loading flag.
  this.setLoading(false);

  // Check to see if all loading flags are 0.
  if (!this.loading()) {

    // Iterate through all plugins.
    this.eachPlugin(function(name, plugin) {

      // Initialize this plugin.
      plugin.initialize();
    });
  }
};

/**
 * Initializes the plugin.
 */
minplayer.plugin.prototype.initialize = function() {
};

/**
 * Iterate over each plugin.
 *
 * @param {function} callback Called for each plugin in this player.
 */
minplayer.plugin.prototype.eachPlugin = function(callback) {
  var plugins = this.getPlugins();
  for (var name in plugins) {
    if (plugins.hasOwnProperty(name)) {
      callback.call(this, name, plugins[name]);
    }
  }
};

/**
 * Adds a new plugin to this player.
 *
 * @param {string} name The name of this plugin.
 * @param {object} plugin A new plugin object, derived from media.plugin.
 */
minplayer.plugin.prototype.addPlugin = function(name, plugin) {
  name = name || this.name;
  plugin = plugin || this;

  // Make sure the plugin is valid.
  if (plugin.isValid()) {

    // Set the plugin as loading.
    plugin.setLoading(true);

    // Add the plugin to the plugins array.
    this.getPlugins()[name] = plugin;
  }
};

/**
 * Gets a plugin by name.
 *
 * @param {string} name The name of the plugin.
 * @return {object} The plugin for the provided name.
 */
minplayer.plugin.prototype.getPlugin = function(name) {
  name = name || this.name;
  var plugins = this.getPlugins();
  if (plugins[name]) {
    return plugins[name];
  }
  return null;
};

/** Static array to keep track of plugin instances. */
minplayer.plugin.instances = {};

/** Static variable to keep track of loading states for each widget. */
minplayer.plugin.loading = {};

/**
 * Sets the loading flag.
 *
 * @param {boolean} state If this plugin is loading or not.
 */
minplayer.plugin.prototype.setLoading = function(state) {
  if (!minplayer.plugin.loading[this.options.id]) {
    minplayer.plugin.loading[this.options.id] = new minplayer.flags();
  }

  // Set this loading flag.
  minplayer.plugin.loading[this.options.id].setFlag(this.name, state);
};

/**
 * Determine if this widget is still loading.
 *
 * @return {number} 0 => Widget is done loading, >0 => Widget is still loading.
 */
minplayer.plugin.prototype.loading = function() {
  return minplayer.plugin.loading[this.options.id].flag;
};

/**
 * Returns the plugins for this ID.
 *
 * @return {array} An array of plugins.
 */
minplayer.plugin.prototype.getPlugins = function() {

  // If the plugins for this instance do not exist.
  if (!minplayer.plugin.instances[this.options.id]) {

    // Initialize the instances.
    minplayer.plugin.instances[this.options.id] = {};

    // Now load all plugins.
    this.loadPlugins();
  }

  // Return the plugins for this instance.
  return minplayer.plugin.instances[this.options.id];
};
