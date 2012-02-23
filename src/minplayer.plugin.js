/** The minplayer namespace. */
minplayer = minplayer || {};

/** Static array to keep track of plugin instances. */
minplayer.instances = minplayer.instances || {};

/** Static array to keep track of queues. */
minplayer.queue = minplayer.queue || [];

/** Mutex lock to keep multiple triggers from occuring. */
minplayer.lock = false;

/**
 * @constructor
 * @class The base class for all plugins.
 *
 * @param {string} name The name of this plugin.
 * @param {object} context The jQuery context.
 * @param {object} options This components options.
 */
minplayer.plugin = function(name, context, options) {

  /** The name of this plugin. */
  this.name = name;

  /** The ready flag. */
  this.pluginReady = false;

  /** The options for this plugin. */
  this.options = options;

  // Only call the constructor if we have a context.
  if (context) {

    // Construct this plugin.
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
 * Loads all of the available plugins.
 */
minplayer.plugin.prototype.loadPlugins = function() {

  // Get all the plugins to load.
  var instance = '';

  // Iterate through all the plugins.
  for (var name in this.options.plugins) {

    // Only load if it does not already exist.
    if (!minplayer.instances[this.options.id][name]) {

      // Get the instance name from the setting.
      instance = this.options.plugins[name];

      // If this object exists.
      if (minplayer[name][instance]) {

        // Declare a new object.
        new minplayer[name][instance](this.display, this.options);
      }
    }
  }
};

/**
 * Plugins should call this method when they are ready.
 */
minplayer.plugin.prototype.ready = function() {

  // Keep this plugin from triggering multiple ready events.
  if (!this.pluginReady) {

    // Set the ready flag.
    this.pluginReady = true;

    // Check the queue.
    this.checkQueue();

    // Now trigger that I am ready.
    this.trigger('pluginReady');
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

    // If the plugins for this instance do not exist.
    if (!minplayer.instances[this.options.id]) {

      // Initialize the instances.
      minplayer.instances[this.options.id] = {};
    }

    // Add this plugin.
    minplayer.instances[this.options.id][name] = plugin;
  }
};

/**
 * Gets a plugin by name and calls callback when it is ready.
 *
 * @param {string} plugin The plugin of the plugin.
 * @param {function} callback Called when the plugin is ready.
 * @return {object} The plugin if no callback is provided.
 */
minplayer.plugin.prototype.get = function(plugin, callback) {

  // Allow this to be called on itself with a single callback.
  if (typeof plugin === 'function') {
    this.get(this.name, plugin);
    return;
  }

  // Return the minplayer.get equivalent.
  return minplayer.get.call(this, this.options.id, plugin, callback);
};

/**
 * Check the queue and execute it.
 */
minplayer.plugin.prototype.checkQueue = function() {

  // Initialize our variables.
  var q = null, i = 0, check = false, newqueue = [];

  // Set the lock.
  minplayer.lock = true;

  // Iterate through all the queues.
  var length = minplayer.queue.length;
  for (i = 0; i < length; i++) {

    // Get the queue.
    q = minplayer.queue[i];

    // Now check to see if this queue is about us.
    check = !q.id && !q.plugin;
    check |= (q.plugin == this.name) && (!q.id || (q.id == this.options.id));

    // If the check passes...
    if (check) {
      check = minplayer.bind.call(
        q.context,
        q.event,
        this.options.id,
        this.name,
        q.callback
      );
    }

    // Add the queue back if it doesn't check out.
    if (!check) {

      // Add this back to the queue.
      newqueue.push(q);
    }
  }

  // Set the old queue to the new queue.
  minplayer.queue = newqueue;

  // Release the lock.
  minplayer.lock = false;
};

/**
 * Adds an item to the queue.
 *
 * @param {object} context The context which this is called within.
 * @param {string} event The event to trigger on.
 * @param {string} id The player ID.
 * @param {string} plugin The name of the plugin.
 * @param {function} callback Called when the event occurs.
 */
minplayer.addQueue = function(context, event, id, plugin, callback) {

  // See if it is locked...
  if (!minplayer.lock) {
    minplayer.queue.push({
      context: context,
      id: id,
      event: event,
      plugin: plugin,
      callback: callback
    });
  }
  else {

    // If so, then try again after 10 milliseconds.
    setTimeout(function() {
      minplayer.addQueue(context, id, event, plugin, callback);
    }, 10);
  }
};

/**
 * Binds an event to a plugin instance, and if it doesn't exist, then caches
 * it for a later time.
 *
 * @param {string} event The event to trigger on.
 * @param {string} id The player ID.
 * @param {string} plugin The name of the plugin.
 * @param {function} callback Called when the event occurs.
 * @return {boolean} If the bind was successful.
 * @this The object in context who called this method.
 */
minplayer.bind = function(event, id, plugin, callback) {

  // If no callback exists, then just return false.
  if (!callback) {
    return false;
  }

  // Get the instances.
  var inst = minplayer.instances;

  // See if this plugin exists.
  if (inst[id][plugin]) {

    // If so, then bind the event to this plugin.
    inst[id][plugin].bind(event, {context: this}, function(event, data) {
      callback.call(event.data.context, data.plugin);
    });
    return true;
  }

  // If not, then add it to the queue to bind later.
  minplayer.addQueue(this, event, id, plugin, callback);

  // Return that this wasn't handled.
  return false;
};

/**
 * The main API for minPlayer.
 *
 * Provided that this function takes three parameters, there are 8 different
 * ways to use this api.
 *
 *   id (0x100) - You want a specific player.
 *   plugin (0x010) - You want a specific plugin.
 *   callback (0x001) - You only want it when it is ready.
 *
 *   000 - You want all plugins from all players, ready or not.
 *
 *          var instances = minplayer.get();
 *
 *   001 - You want all plugins from all players, but only when ready.
 *
 *          minplayer.get(function(plugin) {
 *            // Code goes here.
 *          });
 *
 *   010 - You want a specific plugin from all players, ready or not...
 *
 *          var medias = minplayer.get(null, 'media');
 *
 *   011 - You want a specific plugin from all players, but only when ready.
 *
 *          minplayer.get('player', function(player) {
 *            // Code goes here.
 *          });
 *
 *   100 - You want all plugins from a specific player, ready or not.
 *
 *          var plugins = minplayer.get('player_id');
 *
 *   101 - You want all plugins from a specific player, but only when ready.
 *
 *          minplayer.get('player_id', null, function(plugin) {
 *            // Code goes here.
 *          });
 *
 *   110 - You want a specific plugin from a specific player, ready or not.
 *
 *          var plugin = minplayer.get('player_id', 'media');
 *
 *   111 - You want a specific plugin from a specific player, only when ready.
 *
 *          minplayer.get('player_id', 'media', function(media) {
 *            // Code goes here.
 *          });
 *
 * @this The context in which this function was called.
 * @param {string} id The ID of the widget to get the plugins from.
 * @param {string} plugin The name of the plugin.
 * @param {function} callback Called when the plugin is ready.
 * @return {object} The plugin object if it is immediately available.
 */
minplayer.get = function(id, plugin, callback) {

  // Normalize the arguments for a better interface.
  if (typeof id === 'function') {
    callback = id;
    plugin = id = null;
  }

  if (typeof plugin === 'function') {
    callback = plugin;
    plugin = id;
    id = null;
  }

  // Make sure the callback is a callback.
  callback = (typeof callback === 'function') ? callback : null;

  // Get the instances.
  var inst = minplayer.instances;

  // 0x000
  if (!id && !plugin && !callback) {
    return inst;
  }
  // 0x100
  else if (id && !plugin && !callback) {
    return inst[id];
  }
  // 0x110
  else if (id && plugin && !callback) {
    return inst[id][plugin];
  }
  // 0x111
  else if (id && plugin && callback) {
    minplayer.bind.call(this, 'pluginReady', id, plugin, callback);
  }
  // 0x011
  else if (!id && plugin && callback) {
    for (var id in inst) {
      minplayer.bind.call(this, 'pluginReady', id, plugin, callback);
    }
  }
  // 0x101
  else if (id && !plugin && callback) {
    for (var plugin in inst[id]) {
      minplayer.bind.call(this, 'pluginReady', id, plugin, callback);
    }
  }
  // 0x010
  else if (!id && plugin && !callback) {
    var plugins = {};
    for (var id in inst) {
      if (inst.hasOwnProperty(id) && inst[id].hasOwnProperty(plugin)) {
        plugins[id] = inst[id][plugin];
      }
    }
    return plugins;
  }
  // 0x001
  else {
    for (var id in inst) {
      for (var plugin in inst[id]) {
        minplayer.bind.call(this, 'pluginReady', id, plugin, callback);
      }
    }
  }
};
