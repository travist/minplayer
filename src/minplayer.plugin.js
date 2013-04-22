/** The minplayer namespace. */
minplayer = minplayer || {};

/** Static array to keep track of all plugins. */
minplayer.plugins = minplayer.plugins || {};

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
 * @param {object} queue The event queue to pass events around.
 */
minplayer.plugin = function(name, context, options, queue) {

  // Make sure we have some options.
  this.options = options || {};

  /** The name of this plugin. */
  this.name = name;

  /** The ready flag. */
  this.pluginReady = false;

  /** The event queue. */
  this.queue = queue || {};

  /** Keep track of already triggered events. */
  this.triggered = {};

  /** Create a queue lock. */
  this.lock = false;

  /** The universally unique ID for this plugin. */
  this.uuid = 0;

  // Only call the constructor if we have a context.
  if (context) {

    /** Keep track of the context. */
    this.context = jQuery(context);

    // Initialize the default options.
    var defaults = {};

    // Get the default options.
    this.defaultOptions(defaults);

    /** The options for this plugin. */
    for (var param in defaults) {
      if (!this.options.hasOwnProperty(param)) {
        this.options[param] = defaults[param];
      }
    }

    // Initialize this plugin.
    this.initialize();
  }
};

/**
 * Initialize function for the plugin.
 */
minplayer.plugin.prototype.initialize = function() {

  // Construct this plugin.
  this.construct();
};

/**
 * Get the default options for this plugin.
 *
 * @param {object} options The default options for this plugin.
 */
minplayer.plugin.prototype.defaultOptions = function(options) {
};

/**
 * The constructor which is called once the context is set.
 * Any class deriving from the plugin class should place all context
 * dependant functionality within this function instead of the standard
 * constructor function since it is called on object derivation as well
 * as object creation.
 */
minplayer.plugin.prototype.construct = function() {

  /** Say that we are active. */
  this.active = true;

  // Adds this as a plugin.
  this.addPlugin();
};

/**
 * Destructor.
 */
minplayer.plugin.prototype.destroy = function() {

  // Unbind all events.
  this.active = false;
  this.unbind();
};

/**
 * Creates a new plugin within this context.
 *
 * @param {string} name The name of the plugin you wish to create.
 * @param {object} base The base object for this plugin.
 * @param {object} context The context which you would like to create.
 * @return {object} The new plugin object.
 */
minplayer.plugin.prototype.create = function(name, base, context) {
  var plugin = null;

  // Make sure we have a base object.
  base = base || 'minplayer';
  if (!window[base][name]) {
    base = 'minplayer';
  }

  // Make sure there is a context.
  context = context || this.display;

  // See if this plugin exists within this object.
  if (window[base][name]) {

    // Set the plugin.
    plugin = window[base][name];

    // See if a template version of the plugin exists.
    if (plugin[this.options.template]) {

      plugin = plugin[this.options.template];
    }

    // Make sure the plugin is a function.
    if (typeof plugin !== 'function') {
      plugin = window['minplayer'][name];
    }

    // Make sure it is a function.
    if (typeof plugin === 'function') {
      return new plugin(context, this.options);
    }
  }

  return null;
};

/**
 * Plugins should call this method when they are ready.
 */
minplayer.plugin.prototype.ready = function() {

  // Keep this plugin from triggering multiple ready events.
  if (!this.pluginReady) {

    // Set the ready flag.
    this.pluginReady = true;

    // Now trigger that I am ready.
    this.trigger('ready');

    // Check the queue.
    this.checkQueue();
  }
};

/**
 * Returns if this component is valid.
 *
 * @return {boolean} TRUE if the plugin display is valid.
 */
minplayer.plugin.prototype.isValid = function() {
  return !!this.options.id && this.active;
};

/**
 * Allows a plugin to do something when it is added to another plugin.
 *
 * @param {object} plugin The plugin that this plugin was added to.
 */
minplayer.plugin.prototype.onAdded = function(plugin) {
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
    if (!minplayer.plugins[this.options.id]) {

      // Initialize the plugins.
      minplayer.plugins[this.options.id] = {};
    }

    if (!minplayer.plugins[this.options.id][name]) {

      // Add the plugins array.
      minplayer.plugins[this.options.id][name] = [];
    }

    // Add this plugin.
    var instance = minplayer.plugins[this.options.id][name].push(plugin);

    // Set the uuid.
    this.uuid = this.options.id + '__' + name + '__' + instance;

    // Now check the queue for this plugin.
    this.checkQueue(plugin);

    // Now let the plugin do something with this plugin.
    plugin.onAdded(this);
  }
};

/** Create timers for the polling. */
minplayer.timers = {};

/**
 * Create a polling timer.
 *
 * @param {string} name The name of the timer.
 * @param {function} callback The function to call when you poll.
 * @param {integer} interval The interval you would like to poll.
 * @return {string} The setTimeout ID.
 */
minplayer.plugin.prototype.poll = function(name, callback, interval) {
  if (minplayer.timers.hasOwnProperty(name)) {
    clearTimeout(minplayer.timers[name]);
  }
  minplayer.timers[name] = setTimeout((function(context) {
    return function callLater() {
      if (callback.call(context)) {
        minplayer.timers[name] = setTimeout(callLater, interval);
      }
    };
  })(this), interval);
  return minplayer.timers[name];
};

/**
 * Gets a plugin by name and calls callback when it is ready.
 *
 * @param {string} plugin The plugin of the plugin.
 * @param {function} callback Called when the plugin is ready.
 * @return {object} The plugin if no callback is provided.
 */
minplayer.plugin.prototype.get = function(plugin, callback) {

  // If they pass just a callback, then return all plugins when ready.
  if (typeof plugin === 'function') {
    callback = plugin;
    plugin = null;
  }

  // Return the minplayer.get equivalent.
  return minplayer.get.call(this, this.options.id, plugin, callback);
};

/**
 * Check the queue and execute it.
 *
 * @param {object} plugin The plugin object to check the queue against.
 */
minplayer.plugin.prototype.checkQueue = function(plugin) {

  // Initialize our variables.
  var q = null, i = 0, check = false;

  // Normalize the plugin variable.
  plugin = plugin || this;

  // Set the lock.
  minplayer.lock = true;

  // Iterate through all the queues.
  var length = minplayer.queue.length;
  for (i = 0; i < length; i++) {
    if (minplayer.queue.hasOwnProperty(i)) {

      // Get the queue.
      q = minplayer.queue[i];

      // Now check to see if this queue is about us.
      check = !q.id && !q.plugin;
      check |= (q.plugin === plugin.name);
      check &= (!q.id || (q.id === this.options.id));

      // If the check passes, and hasn't already been added...
      if (check && !q.addedto.hasOwnProperty(plugin.options.id)) {
        q.addedto[plugin.options.id] = true;
        check = minplayer.bind.call(
          q.context,
          q.event,
          this.options.id,
          plugin.name,
          q.callback,
          true
        );
      }
    }
  }

  // Release the lock.
  minplayer.lock = false;
};

/**
 * All minplayer event types.
 */
minplayer.eventTypes = {};

/**
 * Determine if an event is of a certain type.
 *
 * @param {string} name The full name of the event.
 * @param {string} type The type of the event.
 * @return {boolean} If this named event is of type.
 */
minplayer.plugin.prototype.isEvent = function(name, type) {
  // Static cache for performance.
  var cacheName = name + '__' + type;
  if (typeof minplayer.eventTypes[cacheName] !== 'undefined') {
    return minplayer.eventTypes[cacheName];
  }
  else {
    var regex = new RegExp('^(.*\:)?' + type + '$', 'gi');
    minplayer.eventTypes[cacheName] = (name.match(type) !== null);
    return minplayer.eventTypes[cacheName];
  }
};

/**
 * Trigger a media event.
 *
 * @param {string} type The event type.
 * @param {object} data The event data object.
 * @param {boolean} noqueue If this trigger should not be queued.
 * @return {object} The plugin object.
 */
minplayer.plugin.prototype.trigger = function(type, data, noqueue) {

  // Don't trigger if this plugin is inactive.
  if (!this.active) {
    return this;
  }

  // Only queue if they wish it to be so...
  if (!noqueue) {

    // Add this to our triggered array.
    this.triggered[type] = data;
  }

  // Iterate through the queue.
  var i = 0, queue = {}, queuetype = null;

  // Iterate through all the queue items.
  for (var name in this.queue) {

    // See if this is an event we care about.
    if (this.isEvent(name, type)) {

      // Set the queuetype.
      queuetype = this.queue[name];

      // Iterate through all the callbacks in this queue.
      for (i in queuetype) {

        // Check to make sure the queue index exists.
        if (queuetype.hasOwnProperty(i)) {

          // Setup the event object, and call the callback.
          queue = queuetype[i];
          queue.callback({target: this, data: queue.data}, data);
        }
      }
    }
  }

  // Return the plugin object.
  return this;
};

/**
 * Unbind then Bind
 *
 * @param {string} type The event type.
 * @param {object} data The data to bind with the event.
 * @param {function} fn The callback function.
 * @return {object} The plugin object.
 */
minplayer.plugin.prototype.ubind = function(type, data, fn) {
  this.unbind(type);
  return this.bind(type, data, fn);
};

/**
 * Bind to a media event.
 *
 * @param {string} type The event type.
 * @param {object} data The data to bind with the event.
 * @param {function} fn The callback function.
 * @return {object} The plugin object.
 **/
minplayer.plugin.prototype.bind = function(type, data, fn) {

  // Only bind if active.
  if (!this.active) {
    return this;
  }

  // Allow the data to be the callback.
  if (typeof data === 'function') {
    fn = data;
    data = null;
  }

  // You must bind to a specific event and have a callback.
  if (!type || !fn) {
    return;
  }

  // Initialize the queue for this type.
  this.queue[type] = this.queue[type] || [];

  // Now add this event to the queue.
  this.queue[type].push({
    callback: fn,
    data: data
  });

  // Now see if this event has already been triggered.
  for (var name in this.triggered) {
    if (this.triggered.hasOwnProperty(name)) {
      if (this.isEvent(type, name)) {
        fn({target: this, data: data}, this.triggered[name]);
      }
    }
  }

  // Return the plugin.
  return this;
};

/**
 * Unbind a media event.
 *
 * @param {string} type The event type.
 * @return {object} The plugin object.
 **/
minplayer.plugin.prototype.unbind = function(type) {

  // If this is locked then try again after 10ms.
  if (this.lock) {
    setTimeout((function(plugin) {
      return function() {
        plugin.unbind(type);
      };
    })(this), 10);
  }

  // Set the lock.
  this.lock = true;

  if (!type) {
    this.queue = {};
  }
  else if (this.queue.hasOwnProperty(type) && (this.queue[type].length > 0)) {
    this.queue[type].length = 0;
  }

  // Reset the lock.
  this.lock = false;

  // Return the plugin.
  return this;
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
      callback: callback,
      addedto: {}
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
 * @param {boolean} fromCheck If this is from a checkqueue.
 * @return {boolean} If the bind was successful.
 * @this The object in context who called this method.
 */
minplayer.bind = function(event, id, plugin, callback, fromCheck) {

  // If no callback exists, then just return false.
  if (!callback) {
    return false;
  }

  // Get the plugins.
  var plugins = minplayer.plugins;

  // Determine the selected plugins.
  var selected = [];

  // Create a quick add.
  var addSelected = function(id, plugin) {
    if (plugins.hasOwnProperty(id) && plugins[id].hasOwnProperty(plugin)) {
      var i = plugins[id][plugin].length;
      while (i--) {
        selected.push(plugins[id][plugin][i]);
      }
    }
  };

  // If they provide id && plugin
  if (id && plugin) {
    addSelected(id, plugin);
  }

  // If they provide no id but a plugin.
  else if (!id && plugin) {
    for (var id in plugins) {
      addSelected(id, plugin);
    }
  }

  // If they provide an id but no plugin.
  else if (id && !plugin && plugins[id]) {
    for (var plugin in plugins[id]) {
      addSelected(id, plugin);
    }
  }

  // If they provide niether an id or a plugin.
  else if (!id && !plugin) {
    for (var id in plugins) {
      for (var plugin in plugins[id]) {
        addSelected(id, plugin);
      }
    }
  }

  // Iterate through the selected plugins and bind.
  var i = selected.length;
  while (i--) {
    selected[i].bind(event, (function(context) {
      return function(event) {
        callback.call(context, event.target);
      };
    })(this));
  }

  // Add it to the queue for post bindings...
  if (!fromCheck) {
    minplayer.addQueue(this, event, id, plugin, callback);
  }

  // Return that this wasn't handled.
  return (selected.length > 0);
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
 *          var plugins = minplayer.get();
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

  // Get the parameter types.
  var idType = typeof id;
  var pluginType = typeof plugin;
  var callbackType = typeof callback;

  // Normalize the arguments for a better interface.
  if (idType === 'function') {
    callback = id;
    plugin = id = null;
  }
  else if (pluginType === 'function') {
    callback = plugin;
    plugin = id;
    id = null;
  }
  else if ((pluginType === 'undefined') && (callbackType === 'undefined')) {
    plugin = id;
    callback = id = null;
  }

  // Make sure the callback is a callback.
  callback = (typeof callback === 'function') ? callback : null;

  // If a callback was provided, then just go ahead and bind.
  if (callback) {
    minplayer.bind.call(this, 'ready', id, plugin, callback);
    return;
  }

  // Get the plugins.
  var plugins = minplayer.plugins;

  // 0x000
  if (!id && !plugin && !callback) {
    return plugins;
  }
  // 0x100
  else if (id && !plugin && !callback) {
    return plugins[id];
  }
  // 0x110
  else if (id && plugin && !callback) {
    return plugins[id][plugin];
  }
  // 0x010
  else if (!id && plugin && !callback) {
    var plugin_types = [];
    for (var id in plugins) {
      if (plugins.hasOwnProperty(id) && plugins[id].hasOwnProperty(plugin)) {
        var i = plugins[id][plugin].length;
        while (i--) {
          plugin_types.push(plugins[id][plugin][i]);
        }
      }
    }
    return plugin_types;
  }
};
