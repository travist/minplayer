/** The minplayer namespace. */
var minplayer = minplayer || {};

// Private function to check a single element's play type.
function checkPlayType(elem, playType) {
  if ((typeof elem.canPlayType) === 'function') {
    if (typeof playType === 'object') {
      var i = playType.length;
      var mimetype = '';
      while (i--) {
        mimetype = checkPlayType(elem, playType[i]);
        if (!!mimetype) {
          break;
        }
      }
      return mimetype;
    }
    else {
      var canPlay = elem.canPlayType(playType);
      if (('no' !== canPlay) && ('' !== canPlay)) {
        return playType;
      }
    }
  }
  return '';
}

/**
 * @constructor
 * @class This class is used to define the types of media that can be played
 * within the browser.
 * <p>
 * <strong>Usage:</strong>
 * <pre><code>
 *   var playTypes = new minplayer.compatibility();
 *
 *   if (playTypes.videoOGG) {
 *     console.log("This browser can play OGG video");
 *   }
 *
 *   if (playTypes.videoH264) {
 *     console.log("This browser can play H264 video");
 *   }
 *
 *   if (playTypes.videoWEBM) {
 *     console.log("This browser can play WebM video");
 *   }
 *
 *   if (playTypes.audioOGG) {
 *     console.log("This browser can play OGG audio");
 *   }
 *
 *   if (playTypes.audioMP3) {
 *     console.log("This browser can play MP3 audio");
 *   }
 *
 *   if (playTypes.audioMP4) {
 *     console.log("This browser can play MP4 audio");
 *   }
 * </code></pre>
 */
minplayer.compatibility = function() {
  var elem = null;

  // Create a video element.
  elem = document.createElement('video');

  /** Can play OGG video */
  this.videoOGG = checkPlayType(elem, 'video/ogg');

  /** Can play H264 video */
  this.videoH264 = checkPlayType(elem, [
    'video/mp4',
    'video/h264'
  ]);

  /** Can play WEBM video */
  this.videoWEBM = checkPlayType(elem, [
    'video/x-webm',
    'video/webm',
    'application/octet-stream'
  ]);

  // Create an audio element.
  elem = document.createElement('audio');

  /** Can play audio OGG */
  this.audioOGG = checkPlayType(elem, 'audio/ogg');

  /** Can play audio MP3 */
  this.audioMP3 = checkPlayType(elem, 'audio/mpeg');

  /** Can play audio MP4 */
  this.audioMP4 = checkPlayType(elem, 'audio/mp4');
};

if (!minplayer.playTypes) {

  /** The compatible playtypes for this browser. */
  minplayer.playTypes = new minplayer.compatibility();
}
/** The minplayer namespace. */
var minplayer = minplayer || {};

/**
 * @constructor
 * @class This class keeps track of asynchronous get requests for certain
 * variables within the player.
 */
minplayer.async = function() {

  /** The final value of this asynchronous variable. */
  this.value = null;

  /** The queue of callbacks to call when this value is determined. */
  this.queue = [];
};

/**
 * Retrieve the value of this variable.
 *
 * @param {function} callback The function to call when the value is determined.
 * @param {function} pollValue The poll function to try and get the value every
 * 1 second if the value is not set.
 */
minplayer.async.prototype.get = function(callback, pollValue) {

  // If the value is set, then immediately call the callback, otherwise, just
  // add it to the queue when the variable is set.
  if (this.value !== null) {
    callback(this.value);
  }
  else {

    // Add this callback to the queue.
    this.queue.push(callback);
  }
};

/**
 * Sets the value of an asynchronous value.
 *
 * @param {void} val The value to set.
 */
minplayer.async.prototype.set = function(val) {

  // Set the value.
  this.value = val;

  // Get the callback queue length.
  var i = this.queue.length;

  // Iterate through all the callbacks and call them.
  if (i) {
    while (i--) {
      this.queue[i](val);
    }

    // Reset the queue.
    this.queue = [];
  }
};
/** The minplayer namespace. */
var minplayer = minplayer || {};

/**
 * @constructor
 * @class This is a class used to keep track of flag states
 * which is used to control the busy cursor, big play button, among other
 * items in which multiple components can have an interest in hiding or
 * showing a single element on the screen.
 *
 * <p>
 * <strong>Usage:</strong>
 * <pre><code>
 *   // Declare a flags variable.
 *   var flags = new minplayer.flags();
 *
 *   // Set the flag based on two components interested in the flag.
 *   flags.setFlag("component1", true);
 *   flags.setFlag("component2", true);
 *
 *   // Print out the value of the flags. ( Prints 3 )
 *   console.log(flags.flags);
 *
 *   // Now unset a single components flag.
 *   flags.setFlag("component1", false);
 *
 *   // Print out the value of the flags.
 *   console.log(flags.flags);
 *
 *   // Unset the other components flag.
 *   flags.setFlag("component2", false);
 *
 *   // Print out the value of the flags.
 *   console.log(flags.flags);
 * </code></pre>
 * </p>
 */
minplayer.flags = function() {

  /** The flag. */
  this.flag = 0;

  /** Id map to reference id with the flag index. */
  this.ids = {};

  /** The number of flags. */
  this.numFlags = 0;
};

/**
 * Sets a flag based on boolean logic operators.
 *
 * @param {string} id The id of the controller interested in this flag.
 * @param {boolean} value The value of this flag ( true or false ).
 */
minplayer.flags.prototype.setFlag = function(id, value) {

  // Define this id if it isn't present.
  if (!this.ids.hasOwnProperty(id)) {
    this.ids[id] = this.numFlags;
    this.numFlags++;
  }

  // Use binary operations to keep track of the flag state
  if (value) {
    this.flag |= (1 << this.ids[id]);
  }
  else {
    this.flag &= ~(1 << this.ids[id]);
  }
};
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
 */
minplayer.plugin = function(name, context, options) {

  /** The name of this plugin. */
  this.name = name;

  /** The ready flag. */
  this.pluginReady = false;

  /** The options for this plugin. */
  this.options = options;

  /** The event queue. */
  this.queue = {};

  /** Keep track of already triggered events. */
  this.triggered = {};

  /** Create a queue lock. */
  this.lock = false;

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
 * Destructor.
 */
minplayer.plugin.prototype.destroy = function() {

  // Unbind all events.
  this.unbind();
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
    if (!minplayer.plugins[this.options.id][name]) {

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

    // Now trigger that I am ready.
    this.trigger('ready');

    // Check the queue.
    this.checkQueue();
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
    if (!minplayer.plugins[this.options.id]) {

      // Initialize the plugins.
      minplayer.plugins[this.options.id] = {};
    }

    // Add this plugin.
    minplayer.plugins[this.options.id][name] = plugin;
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
 * Trigger a media event.
 *
 * @param {string} type The event type.
 * @param {object} data The event data object.
 * @return {object} The plugin object.
 */
minplayer.plugin.prototype.trigger = function(type, data) {
  data = data || {};
  data.plugin = this;

  // Add this to our triggered array.
  this.triggered[type] = data;

  // Check to make sure the queue for this type exists.
  if (this.queue[type]) {

    var i = 0, queue = {};

    // Iterate through all the callbacks in this queue.
    for (i in this.queue[type]) {

      // Setup the event object, and call the callback.
      queue = this.queue[type][i];
      queue.callback({target: this, data: queue.data}, data);
    }
  }

  // Return the plugin object.
  return this;
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

  // Unbind any existing equivalent events.
  this.unbind(type, fn);

  // Now add this event to the queue.
  this.queue[type].push({
    callback: fn,
    data: data
  });

  // Now see if this event has already been triggered.
  if (this.triggered[type]) {

    // Go ahead and trigger the event.
    fn({target: this, data: data}, this.triggered[type]);
  }

  // Return the plugin.
  return this;
};

/**
 * Unbind a media event.
 *
 * @param {string} type The event type.
 * @param {function} fn The callback function.
 * @return {object} The plugin object.
 **/
minplayer.plugin.prototype.unbind = function(type, fn) {

  // If this is locked then try again after 10ms.
  if (this.lock) {
    var _this = this;
    setTimeout(function() {
      _this.unbind(type, fn);
    }, 10);
  }

  // Set the lock.
  this.lock = true;

  if (!type) {
    this.queue = {};
  }
  else if (!fn) {
    this.queue[type] = [];
  }
  else {
    // Iterate through all the callbacks and search for equal callbacks.
    var i = 0, queue = {};
    for (i in this.queue[type]) {
      if (this.queue[type][i].callback === fn) {
        queue = this.queue[type].splice(1, 1);
        delete queue;
      }
    }
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

  // Get the plugins.
  var inst = minplayer.plugins;

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
  // 0x111
  else if (id && plugin && callback) {
    minplayer.bind.call(this, 'ready', id, plugin, callback);
  }
  // 0x011
  else if (!id && plugin && callback) {
    for (var id in plugins) {
      minplayer.bind.call(this, 'ready', id, plugin, callback);
    }
  }
  // 0x101
  else if (id && !plugin && callback) {
    for (var plugin in plugins[id]) {
      minplayer.bind.call(this, 'ready', id, plugin, callback);
    }
  }
  // 0x010
  else if (!id && plugin && !callback) {
    var plugin_types = {};
    for (var id in plugins) {
      if (plugins.hasOwnProperty(id) && plugins[id].hasOwnProperty(plugin)) {
        plugin_types[id] = plugins[id][plugin];
      }
    }
    return plugin_types;
  }
  // 0x001
  else {
    for (var id in plugins) {
      for (var plugin in plugins[id]) {
        minplayer.bind.call(this, 'ready', id, plugin, callback);
      }
    }
  }
};
/** The minplayer namespace. */
minplayer = minplayer || {};

/**
 * @constructor
 * @extends minplayer.plugin
 * @class Base class used to provide the display and options for any component
 * deriving from this class.  Components who derive are expected to provide
 * the elements that they define by implementing the getElements method.
 *
 * @param {string} name The name of this plugin.
 * @param {object} context The jQuery context this component resides.
 * @param {object} options The options for this component.
 */
minplayer.display = function(name, context, options) {

  // See if we allow resize on this display.
  this.allowResize = false;

  if (context) {

    // Set the display.
    this.display = this.getDisplay(context, options);
  }

  // Derive from plugin
  minplayer.plugin.call(this, name, context, options);
};

/** Derive from minplayer.plugin. */
minplayer.display.prototype = new minplayer.plugin();

/** Reset the constructor. */
minplayer.display.prototype.constructor = minplayer.display;

/**
 * Returns the display for this component.
 *
 * @param {object} context The original context.
 * @param {object} options The options for this component.
 * @return {object} The jQuery context for this display.
 */
minplayer.display.prototype.getDisplay = function(context, options) {
  return jQuery(context);
};

/**
 * @see minplayer.plugin.construct
 */
minplayer.display.prototype.construct = function() {

  // Call the plugin constructor.
  minplayer.plugin.prototype.construct.call(this);

  // Extend all display elements.
  this.options.elements = this.options.elements || {};
  jQuery.extend(this.options.elements, this.getElements());
  this.elements = this.options.elements;

  // Only do this if they allow resize for this display.
  if (this.allowResize) {

    // Set the resize timeout and this pointer.
    var resizeTimeout = 0;
    var _this = this;

    // Add a handler to trigger a resize event.
    jQuery(window).resize(function() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function() {
        _this.onResize();
      }, 200);
    });
  }
};

/**
 * Called when the window resizes.
 */
minplayer.display.prototype.onResize = function() {
};

/**
 * Returns a scaled rectangle provided a ratio and the container rect.
 *
 * @param {number} ratio The width/height ratio of what is being scaled.
 * @param {object} rect The bounding rectangle for scaling.
 * @return {object} The Rectangle object of the scaled rectangle.
 */
minplayer.display.prototype.getScaledRect = function(ratio, rect) {
  var scaledRect = {};
  scaledRect.x = rect.x ? rect.x : 0;
  scaledRect.y = rect.y ? rect.y : 0;
  scaledRect.width = rect.width ? rect.width : 0;
  scaledRect.height = rect.height ? rect.height : 0;
  if (ratio) {
    if ((rect.width / rect.height) > ratio) {
      scaledRect.height = rect.height;
      scaledRect.width = Math.floor(rect.height * ratio);
    }
    else {
      scaledRect.height = Math.floor(rect.width / ratio);
      scaledRect.width = rect.width;
    }
    scaledRect.x = Math.floor((rect.width - scaledRect.width) / 2);
    scaledRect.y = Math.floor((rect.height - scaledRect.height) / 2);
  }
  return scaledRect;
};

/**
 * Returns all the jQuery elements that this component uses.
 *
 * @return {object} An object which defines all the jQuery elements that
 * this component uses.
 */
minplayer.display.prototype.getElements = function() {
  return {};
};

/**
 * Returns if this component is valid and exists within the DOM.
 *
 * @return {boolean} TRUE if the plugin display is valid.
 */
minplayer.display.prototype.isValid = function() {
  return (this.display.length > 0);
};
// Add a way to instanciate using jQuery prototype.
if (!jQuery.fn.minplayer) {

  /**
   * @constructor
   *
   * Define a jQuery minplayer prototype.
   *
   * @param {object} options The options for this jQuery prototype.
   * @return {Array} jQuery object.
   */
  jQuery.fn.minplayer = function(options) {
    return jQuery(this).each(function() {
      options = options || {};
      options.id = options.id || $(this).attr('id') || Math.random();
      if (!minplayer.plugins[options.id]) {
        var template = options.template || 'default';
        if (minplayer[template]) {
          new minplayer[template](jQuery(this), options);
        }
        else {
          new minplayer(jQuery(this), options);
        }
      }
    });
  };
}

/**
 * @constructor
 * @extends minplayer.display
 * @class The core media player class which governs the media player
 * functionality.
 *
 * <p><strong>Usage:</strong>
 * <pre><code>
 *
 *   // Create a media player.
 *   var player = jQuery("#player").minplayer({
 *
 *   });
 *
 * </code></pre>
 * </p>
 *
 * @param {object} context The jQuery context.
 * @param {object} options This components options.
 */
minplayer = jQuery.extend(function(context, options) {

  // Make sure we provide default options...
  options = jQuery.extend({
    id: 'player',
    swfplayer: '',
    wmode: 'transparent',
    preload: true,
    autoplay: false,
    loop: false,
    width: '100%',
    height: '350px',
    debug: false,
    volume: 80,
    files: [],
    file: '',
    preview: '',
    attributes: {}
  }, options);

  // Setup the plugins.
  options.plugins = jQuery.extend({
    controller: 'default',
    playLoader: 'default'
  }, options.plugins);

  // Derive from display
  minplayer.display.call(this, 'player', context, options);
}, minplayer);

/** Derive from minplayer.display. */
minplayer.prototype = new minplayer.display();

/** Reset the constructor. */
minplayer.prototype.constructor = minplayer;

/**
 * Define a way to debug.
 */
minplayer.console = console || {log: function(data) {}};

/**
 * @see minplayer.plugin.construct
 */
minplayer.prototype.construct = function() {

  // Call the minplayer display constructor.
  minplayer.display.prototype.construct.call(this);

  // Load the plugins.
  this.loadPlugins();

  /** Variable to store the current media player. */
  this.currentPlayer = 'html5';

  // Add key events to the window.
  this.addKeyEvents();

  // Now load these files.
  this.load(this.getFiles());

  // Add the player events.
  this.addEvents();

  // The player is ready.
  this.ready();
};

/**
 * We need to bind to events we are interested in.
 */
minplayer.prototype.addEvents = function() {
  var _this = this;
  minplayer.get.call(this, this.options.id, null, function(plugin) {

    // Bind to the error event.
    plugin.bind('error', function(event, data) {

      // If an error occurs within the html5 media player, then try
      // to fall back to the flash player.
      if (_this.currentPlayer == 'html5') {
        _this.options.file.player = 'minplayer';
        _this.loadPlayer();
      }
      else {
        _this.error(data);
      }
    });

    // Bind to the fullscreen event.
    plugin.bind('fullscreen', function(event, data) {
      _this.resize();
    });
  });
};

/**
 * Sets an error on the player.
 *
 * @param {string} error The error to display on the player.
 */
minplayer.prototype.error = function(error) {
  error = error || '';
  if (this.elements.error) {

    // Set the error text.
    this.elements.error.text(error);
    if (error) {
      this.elements.error.show();
    }
    else {
      this.elements.error.hide();
    }
  }
};

/**
 * Adds key events to the player.
 */
minplayer.prototype.addKeyEvents = function() {

  // Bind to key events...
  jQuery(document).bind('keydown', {obj: this}, function(e) {
    switch (e.keyCode) {
      case 113: // ESC
      case 27:  // Q
        e.data.obj.display.removeClass('fullscreen');
        break;
    }
  });
};

/**
 * Returns all the media files available for this player.
 *
 * @return {array} All the media files for this player.
 */
minplayer.prototype.getFiles = function() {
  var files = [];
  var mediaSrc = null;

  // Get the files involved...
  if (this.elements.media) {
    mediaSrc = this.elements.media.attr('src');
    if (mediaSrc) {
      files.push({'path': mediaSrc});
    }
    jQuery('source', this.elements.media).each(function() {
      files.push({
        'path': jQuery(this).attr('src'),
        'mimetype': jQuery(this).attr('type'),
        'codecs': jQuery(this).attr('codecs')
      });
    });
  }

  return files;
};

/**
 * Returns the full media player object.
 * @param {array} files An array of files to chose from.
 * @return {object} The best media file to play in the current browser.
 */
minplayer.prototype.getMediaFile = function(files) {

  // If there are no files then return null.
  if (!files) {
    return null;
  }

  // If the file is a single string, then return the file object.
  if (typeof files === 'string') {
    return new minplayer.file({'path': files});
  }

  // If the file is already a file object then just return.
  if (files.path) {
    return new minplayer.file(files);
  }

  // Add the files and get the best player to play.
  var i = files.length, bestPriority = 0, mFile = null, file = null;
  while (i--) {
    file = files[i];

    // Get the minplayer file object.
    if (typeof file === 'string') {
      file = new minplayer.file({'path': file});
    }
    else {
      file = new minplayer.file(file);
    }

    // Determine the best file for this browser.
    if (file.priority > bestPriority) {
      mFile = file;
    }
  }

  // Return the best minplayer file.
  return mFile;
};

/**
 * Loads a media player based on the current file.
 */
minplayer.prototype.loadPlayer = function() {

  // Do nothing if there isn't a file.
  if (!this.options.file) {
    this.error('No media found.');
    return;
  }

  if (!this.options.file.player) {
    this.error('Cannot play media: ' + this.options.file.mimetype);
    return;
  }

  // Reset the error.
  this.error();

  // Only destroy if the current player is different than the new player.
  var player = this.options.file.player.toString();

  // If there isn't media or if the players are different.
  if (!this.media || (player !== this.currentPlayer)) {

    // Set the current media player.
    this.currentPlayer = player;

    // Do nothing if we don't have a display.
    if (!this.elements.display) {
      this.error('No media display found.');
      return;
    }

    // Store the queue.
    var queue = this.media ? this.media.queue : {};

    // Destroy the current media.
    if (this.media) {
      this.media.destroy();
    }

    // Get the class name and create the new player.
    pClass = minplayer.players[this.options.file.player];

    // Create the new media player.
    this.media = new pClass(this.elements.display, this.options);

    // Restore the queue.
    this.media.queue = queue;

    // Now get the media when it is ready.
    this.get('media', function(media) {

      // Load the media.
      media.load();
    });
  }
  // If the media object already exists...
  else if (this.media) {

    // Now load the different media file.
    this.media.load(this.options.file);
  }
};

/**
 * Load a set of files or a single file for the media player.
 *
 * @param {array} files An array of files to chose from to load.
 */
minplayer.prototype.load = function(files) {

  // Set the id and class.
  var id = '', pClass = '';

  // If no file was provided, then get it.
  this.options.files = files || this.options.files;
  this.options.file = this.getMediaFile(this.options.files);

  // Now load the player.
  this.loadPlayer();
};

/**
 * Called when the player is resized.
 */
minplayer.prototype.resize = function() {

  // Call onRezie for each plugin.
  this.get(function(plugin) {
    plugin.onResize();
  });
};
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
  this.img = null;

  // Derive from display
  minplayer.display.call(this, 'image', context, options);
};

/** Derive from minplayer.display. */
minplayer.image.prototype = new minplayer.display();

/** Reset the constructor. */
minplayer.image.prototype.constructor = minplayer.image;

/**
 * @see minplayer.plugin.construct
 */
minplayer.image.prototype.construct = function() {

  // Say we need to resize.
  this.allowResize = true;

  // Call the media display constructor.
  minplayer.display.prototype.construct.call(this);

  // Set the container to not show any overflow...
  this.display.css('overflow', 'hidden');

  // Create the image loader.
  var _this = this;

  /** The loader for the image. */
  this.loader = new Image();

  /** Register for when the image is loaded within the loader. */
  this.loader.onload = function() {
    _this.loaded = true;
    _this.ratio = (_this.loader.width / _this.loader.height);
    _this.resize();
    _this.trigger('loaded');
  };

  // We are now ready.
  this.ready();
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
    this.img = jQuery(document.createElement('img')).attr({src: ''}).hide();
    this.display.append(this.img);
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
  if (this.img) {
    var _this = this;
    this.img.fadeOut(function() {
      _this.img.attr('src', '');
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
    if (this.img) {
      this.img.attr('src', this.loader.src).css({
        marginLeft: rect.x,
        marginTop: rect.y,
        width: rect.width,
        height: rect.height
      });
    }

    // Show the container.
    this.img.fadeIn();
  }
};

/**
 * @see minplayer.display#onResize
 */
minplayer.image.prototype.onResize = function() {

  // Resize the image to fit.
  this.resize();
};
/** The minplayer namespace. */
var minplayer = minplayer || {};

/**
 * @constructor
 * @class A wrapper class used to provide all the data necessary to control an
 * individual file within this media player.
 *
 * @param {object} file A media file object with minimal required information.
 */
minplayer.file = function(file) {
  this.duration = file.duration || 0;
  this.bytesTotal = file.bytesTotal || 0;
  this.quality = file.quality || 0;
  this.stream = file.stream || '';
  this.path = file.path || '';
  this.codecs = file.codecs || '';

  // These should be provided, but just in case...
  this.extension = file.extension || this.getFileExtension();
  this.mimetype = file.mimetype || file.filemime || this.getMimeType();
  this.type = file.type || this.getType();

  // Fail safe to try and guess the mimetype and media type.
  if (!this.type) {
    this.mimetype = this.getMimeType();
    this.type = this.getType();
  }

  // Get the player.
  this.player = file.player || this.getBestPlayer();
  this.priority = file.priority || this.getPriority();
  this.id = file.id || this.getId();
};

/**
 * Returns the best player for the job.
 *
 * @return {string} The best player to play the media file.
 */
minplayer.file.prototype.getBestPlayer = function() {
  var bestplayer = null, bestpriority = 0, _this = this;
  jQuery.each(minplayer.players, function(name, player) {
    var priority = player.getPriority();
    if (player.canPlay(_this) && (priority > bestpriority)) {
      bestplayer = name;
      bestpriority = priority;
    }
  });
  return bestplayer;
};

/**
 * The priority of this file is determined by the priority of the best
 * player multiplied by the priority of the mimetype.
 *
 * @return {integer} The priority of the media file.
 */
minplayer.file.prototype.getPriority = function() {
  var priority = 1;
  if (this.player) {
    priority = minplayer.players[this.player].getPriority();
  }
  switch (this.mimetype) {
    case 'video/x-webm':
    case 'video/webm':
    case 'application/octet-stream':
      return priority * 10;
    case 'video/mp4':
    case 'audio/mp4':
    case 'audio/mpeg':
      return priority * 9;
    case 'video/ogg':
    case 'audio/ogg':
    case 'video/quicktime':
      return priority * 8;
    default:
      return priority * 5;
  }
};

/**
 * Returns the file extension of the file path.
 *
 * @return {string} The file extension.
 */
minplayer.file.prototype.getFileExtension = function() {
  return this.path.substring(this.path.lastIndexOf('.') + 1).toLowerCase();
};

/**
 * Returns the proper mimetype based off of the extension.
 *
 * @return {string} The mimetype of the file based off of extension.
 */
minplayer.file.prototype.getMimeType = function() {
  switch (this.extension) {
    case 'mp4': case 'm4v': case 'flv': case 'f4v':
      return 'video/mp4';
    case'webm':
      return 'video/webm';
    case 'ogg': case 'ogv':
      return 'video/ogg';
    case '3g2':
      return 'video/3gpp2';
    case '3gpp':
    case '3gp':
      return 'video/3gpp';
    case 'mov':
      return 'video/quicktime';
    case'swf':
      return 'application/x-shockwave-flash';
    case 'oga':
      return 'audio/ogg';
    case 'mp3':
      return 'audio/mpeg';
    case 'm4a': case 'f4a':
      return 'audio/mp4';
    case 'aac':
      return 'audio/aac';
    case 'wav':
      return 'audio/vnd.wave';
    case 'wma':
      return 'audio/x-ms-wma';
    default:
      return 'unknown';
  }
};

/**
 * The type of media this is: video or audio.
 *
 * @return {string} "video" or "audio" based on what the type of media this
 * is.
 */
minplayer.file.prototype.getType = function() {
  switch (this.mimetype) {
    case 'video/mp4':
    case 'video/webm':
    case 'application/octet-stream':
    case 'video/x-webm':
    case 'video/ogg':
    case 'video/3gpp2':
    case 'video/3gpp':
    case 'video/quicktime':
      return 'video';
    case 'audio/mp3':
    case 'audio/mp4':
    case 'audio/ogg':
    case 'audio/mpeg':
      return 'audio';
    default:
      return '';
  }
};

/**
 * Returns the ID for this media file.
 *
 * @return {string} The id for this media file which is provided by the player.
 */
minplayer.file.prototype.getId = function() {
  var player = minplayer.players[this.player];
  return (player && player.getMediaId) ? player.getMediaId(this) : '';
};
/** The minplayer namespace. */
var minplayer = minplayer || {};

/** Define the playLoader object. */
minplayer.playLoader = minplayer.playLoader || {};

/**
 * @constructor
 * @extends minplayer.display
 * @class The play loader base class, which is used to control the busy
 * cursor, big play button, and the opaque background which shows when the
 * player is paused.
 *
 * @param {object} context The jQuery context.
 * @param {object} options This components options.
 */
minplayer.playLoader.base = function(context, options) {

  // Define the flags that control the busy cursor.
  this.busy = new minplayer.flags();

  // Define the flags that control the big play button.
  this.bigPlay = new minplayer.flags();

  /** The preview image. */
  this.preview = null;

  // Derive from display
  minplayer.display.call(this, 'playLoader', context, options);
};

/** Derive from minplayer.display. */
minplayer.playLoader.base.prototype = new minplayer.display();

/** Reset the constructor. */
minplayer.playLoader.base.prototype.constructor = minplayer.playLoader.base;

/**
 * The constructor.
 */
minplayer.playLoader.base.prototype.construct = function() {

  // Call the media display constructor.
  minplayer.display.prototype.construct.call(this);

  // Get the media plugin.
  this.get('media', function(media) {

    // Only bind if this player does not have its own play loader.
    if (!media.hasPlayLoader()) {

      // Load the preview image.
      this.loadPreview();

      // Trigger a play event when someone clicks on the controller.
      if (this.elements.bigPlay) {
        this.elements.bigPlay.unbind().bind('click', function(event) {
          event.preventDefault();
          jQuery(this).hide();
          media.play();
        });
      }

      // Bind to the player events to control the play loader.
      media.unbind('loadstart').bind('loadstart', {obj: this}, function(event) {
        event.data.obj.busy.setFlag('media', true);
        event.data.obj.bigPlay.setFlag('media', true);
        if (event.data.obj.preview) {
          event.data.obj.elements.preview.show();
        }
        event.data.obj.checkVisibility();
      });
      media.bind('waiting', {obj: this}, function(event) {
        event.data.obj.busy.setFlag('media', true);
        event.data.obj.checkVisibility();
      });
      media.bind('loadeddata', {obj: this}, function(event) {
        event.data.obj.busy.setFlag('media', false);
        event.data.obj.checkVisibility();
      });
      media.bind('playing', {obj: this}, function(event) {
        event.data.obj.busy.setFlag('media', false);
        event.data.obj.bigPlay.setFlag('media', false);
        if (event.data.obj.preview) {
          event.data.obj.elements.preview.hide();
        }
        event.data.obj.checkVisibility();
      });
      media.bind('pause', {obj: this}, function(event) {
        event.data.obj.bigPlay.setFlag('media', true);
        event.data.obj.checkVisibility();
      });
    }
    else {

      // Hide the busy cursor.
      if (this.elements.busy) {
        this.elements.busy.unbind().hide();
      }

      // Hide the big play button.
      if (this.elements.bigPlay) {
        this.elements.bigPlay.unbind().hide();
      }

      // Hide the display.
      this.display.unbind().hide();
    }
  });

  // We are now ready.
  this.ready();
};

/**
 * Loads the preview image.
 */
minplayer.playLoader.base.prototype.loadPreview = function() {

  // If the preview element exists.
  if (this.elements.preview) {

    // Get the poster image.
    if (!this.options.preview) {
      this.options.preview = this.elements.media.attr('poster');
    }

    // Reset the media's poster image.
    this.elements.media.attr('poster', '');

    // If there is a preview to show...
    if (this.options.preview) {

      // Say that this has a preview.
      this.elements.preview.addClass('has-preview').show();

      // Create a new preview image.
      this.preview = new minplayer.image(this.elements.preview, this.options);

      // Create the image.
      this.preview.load(this.options.preview);
    }
    else {

      // Hide the preview.
      this.elements.preview.hide();
    }
  }
};

/**
 * Hide or show certain elements based on the state of the busy and big play
 * button.
 */
minplayer.playLoader.base.prototype.checkVisibility = function() {

  // Hide or show the busy cursor based on the flags.
  if (this.busy.flag) {
    this.elements.busy.show();
  }
  else {
    this.elements.busy.hide();
  }

  // Hide or show the big play button based on the flags.
  if (this.bigPlay.flag) {
    this.elements.bigPlay.show();
  }
  else {
    this.elements.bigPlay.hide();
  }

  // Show the control either flag is set.
  if (this.bigPlay.flag || this.busy.flag) {
    this.display.show();
  }

  // Hide the whole control if both flags are 0.
  if (!this.bigPlay.flag && !this.busy.flag) {
    this.display.hide();
  }
};
/** The minplayer namespace. */
var minplayer = minplayer || {};

/** All the media player implementations */
minplayer.players = minplayer.players || {};

/**
 * @constructor
 * @extends minplayer.display
 * @class The base media player class where all media players derive from.
 *
 * @param {object} context The jQuery context.
 * @param {object} options This components options.
 */
minplayer.players.base = function(context, options) {

  // Derive from display
  minplayer.display.call(this, 'media', context, options);
};

/** Derive from minplayer.display. */
minplayer.players.base.prototype = new minplayer.display();

/** Reset the constructor. */
minplayer.players.base.prototype.constructor = minplayer.players.base;

/**
 * Get the priority of this media player.
 *
 * @return {number} The priority of this media player.
 */
minplayer.players.base.getPriority = function() {
  return 0;
};

/**
 * Returns the ID for the media being played.
 *
 * @param {object} file A {@link minplayer.file} object.
 * @return {string} The ID for the provided media.
 */
minplayer.players.base.getMediaId = function(file) {
  return '';
};

/**
 * Determine if we can play the media file.
 *
 * @param {object} file A {@link minplayer.file} object.
 * @return {boolean} If this player can play this media type.
 */
minplayer.players.base.canPlay = function(file) {
  return false;
};

/**
 * @see minplayer.plugin.construct
 * @this minplayer.players.base
 */
minplayer.players.base.prototype.construct = function() {

  // Call the media display constructor.
  minplayer.display.prototype.construct.call(this);

  // Reset the variables to initial state.
  this.reset();

  /** The currently loaded media file. */
  this.mediaFile = this.options.file;

  // Get the player display object.
  if (!this.playerFound()) {

    // Remove the media element if found
    if (this.elements.media) {
      this.elements.media.remove();
    }

    // Create a new media player element.
    this.display.html(this.create());
  }

  // Get the player object...
  this.player = this.getPlayer();

  // Set the focus of the element based on if they click in or outside of it.
  var _this = this;
  jQuery(document).bind('click', function(e) {
    if (jQuery(e.target).closest('#' + _this.options.id).length == 0) {
      _this.hasFocus = false;
    }
    else {
      _this.hasFocus = true;
    }
  });

  // Bind to key events...
  jQuery(document).bind('keydown', {obj: this}, function(e) {
    if (e.data.obj.hasFocus) {
      e.preventDefault();
      switch (e.keyCode) {
        case 32:  // SPACE
        case 179: // GOOGLE play/pause button.
          if (e.data.obj.playing) {
            e.data.obj.pause();
          }
          else {
            e.data.obj.play();
          }
          break;
        case 38:  // UP
          e.data.obj.setVolumeRelative(0.1);
          break;
        case 40:  // DOWN
          e.data.obj.setVolumeRelative(-0.1);
          break;
        case 37:  // LEFT
        case 227: // GOOGLE TV REW
          e.data.obj.seekRelative(-0.05);
          break;
        case 39:  // RIGHT
        case 228: // GOOGLE TV FW
          e.data.obj.seekRelative(0.05);
          break;
      }
    }
  });
};

/**
 * @see minplayer.plugin.destroy.
 */
minplayer.players.base.prototype.destroy = function() {
  minplayer.plugin.prototype.destroy.call(this);

  // Reset the player.
  this.reset();
};

/**
 * Resets all variables.
 */
minplayer.players.base.prototype.reset = function() {

  // Reset the ready flag.
  this.playerReady = false;

  // The duration of the player.
  this.duration = new minplayer.async();

  // The current play time of the player.
  this.currentTime = new minplayer.async();

  // The amount of bytes loaded in the player.
  this.bytesLoaded = new minplayer.async();

  // The total amount of bytes for the media.
  this.bytesTotal = new minplayer.async();

  // The bytes that the download started with.
  this.bytesStart = new minplayer.async();

  // The current volume of the player.
  this.volume = new minplayer.async();

  // Reset focus.
  this.hasFocus = false;

  // We are not playing.
  this.playing = false;

  // We are not loading.
  this.loading = false;

  // If the player exists, then unbind all events.
  if (this.player) {
    jQuery(this.player).unbind();
  }
};

/**
 * Create a polling timer.
 * @param {function} callback The function to call when you poll.
 */
minplayer.players.base.prototype.poll = function(callback) {
  var _this = this;
  setTimeout(function later() {
    if (callback.call(_this)) {
      setTimeout(later, 1000);
    }
  }, 1000);
};

/**
 * Called when the player is ready to recieve events and commands.
 */
minplayer.players.base.prototype.onReady = function() {
  // Store the this pointer.
  var _this = this;

  // Set the ready flag.
  this.playerReady = true;

  // Set the volume to the default.
  this.setVolume(this.options.volume / 100);

  // Setup the progress interval.
  this.loading = true;

  // Create a poll to get the progress.
  this.poll(function() {

    // Only do this if the play interval is set.
    if (_this.loading) {

      // Get the bytes loaded asynchronously.
      _this.getBytesLoaded(function(bytesLoaded) {

        // Get the bytes total asynchronously.
        _this.getBytesTotal(function(bytesTotal) {

          // Trigger an event about the progress.
          if (bytesLoaded || bytesTotal) {

            // Get the bytes start, but don't require it.
            var bytesStart = 0;
            _this.getBytesStart(function(val) {
              bytesStart = val;
            });

            // Trigger a progress event.
            _this.trigger('progress', {
              loaded: bytesLoaded,
              total: bytesTotal,
              start: bytesStart
            });

            // Say we are not longer loading if they are equal.
            if (bytesLoaded >= bytesTotal) {
              _this.loading = false;
            }
          }
        });
      });
    }

    return _this.loading;
  });

  // We are now ready.
  this.ready();

  // Trigger that the load has started.
  this.trigger('loadstart');
};

/**
 * Should be called when the media is playing.
 */
minplayer.players.base.prototype.onPlaying = function() {
  // Store the this pointer.
  var _this = this;

  // Trigger an event that we are playing.
  this.trigger('playing');

  // Say that this player has focus.
  this.hasFocus = true;

  // Set the playInterval to true.
  this.playing = true;

  // Create a poll to get the timeupate.
  this.poll(function() {

    // Only do this if the play interval is set.
    if (_this.playing) {

      // Get the current time asyncrhonously.
      _this.getCurrentTime(function(currentTime) {

        // Get the duration asynchronously.
        _this.getDuration(function(duration) {

          // Convert these to floats.
          currentTime = parseFloat(currentTime);
          duration = parseFloat(duration);

          // Trigger an event about the progress.
          if (currentTime || duration) {

            // Trigger an update event.
            _this.trigger('timeupdate', {
              currentTime: currentTime,
              duration: duration
            });
          }
        });
      });
    }

    return _this.playing;
  });
};

/**
 * Should be called when the media is paused.
 */
minplayer.players.base.prototype.onPaused = function() {

  // Trigger an event that we are paused.
  this.trigger('pause');

  // Remove focus.
  this.hasFocus = false;

  // Say we are not playing.
  this.playing = false;
};

/**
 * Should be called when the media is complete.
 */
minplayer.players.base.prototype.onComplete = function() {
  // Stop the intervals.
  this.playing = false;
  this.loading = false;
  this.hasFocus = false;
  this.trigger('ended');
};

/**
 * Should be called when the media is done loading.
 */
minplayer.players.base.prototype.onLoaded = function() {
  this.trigger('loadeddata');
};

/**
 * Should be called when the player is waiting.
 */
minplayer.players.base.prototype.onWaiting = function() {
  this.trigger('waiting');
};

/**
 * Called when an error occurs.
 *
 * @param {string} errorCode The error that was triggered.
 */
minplayer.players.base.prototype.onError = function(errorCode) {
  this.hasFocus = false;
  this.trigger('error', errorCode);
};

/**
 * @see minplayer.players.base#isReady
 * @return {boolean} Checks to see if the Flash is ready.
 */
minplayer.players.base.prototype.isReady = function() {

  // Return that the player is set and the ready flag is good.
  return (this.player && this.playerReady);
};

/**
 * Determines if the player should show the playloader.
 *
 * @return {bool} If this player implements its own playLoader.
 */
minplayer.players.base.prototype.hasPlayLoader = function() {
  return false;
};

/**
 * Returns if the media player is already within the DOM.
 *
 * @return {boolean} TRUE - if the player is in the DOM, FALSE otherwise.
 */
minplayer.players.base.prototype.playerFound = function() {
  return false;
};

/**
 * Creates the media player and inserts it in the DOM.
 *
 * @return {object} The media player entity.
 */
minplayer.players.base.prototype.create = function() {
  this.reset();
  return null;
};

/**
 * Returns the media player object.
 *
 * @return {object} The media player object.
 */
minplayer.players.base.prototype.getPlayer = function() {
  return this.player;
};

/**
 * Loads a new media player.
 *
 * @param {object} file A {@link minplayer.file} object.
 */
minplayer.players.base.prototype.load = function(file) {

  // Store the media file for future lookup.
  if (file) {
    this.reset();
    this.mediaFile = file;
  }
};

/**
 * Play the loaded media file.
 */
minplayer.players.base.prototype.play = function() {
};

/**
 * Pause the loaded media file.
 */
minplayer.players.base.prototype.pause = function() {
};

/**
 * Stop the loaded media file.
 */
minplayer.players.base.prototype.stop = function() {
  this.playing = false;
  this.loading = false;
  this.hasFocus = false;
};

/**
 * Seeks to relative position.
 *
 * @param {number} pos Relative position.  -1 to 1 (percent), > 1 (seconds).
 */
minplayer.players.base.prototype.seekRelative = function(pos) {

  // Get the current time asyncrhonously.
  var _this = this;
  this.getCurrentTime(function(currentTime) {

    // Get the duration asynchronously.
    _this.getDuration(function(duration) {

      // Only do this if we have a duration.
      if (duration) {

        // Get the position.
        var seekPos = 0;
        if ((pos > -1) && (pos < 1)) {
          seekPos = (currentTime / duration) + parseFloat(pos);
        }
        else {
          seekPos = (currentTime + parseFloat(pos)) / duration;
        }

        // Set the seek value.
        _this.seek(seekPos);
      }
    });
  });
};

/**
 * Seek the loaded media.
 *
 * @param {number} pos The position to seek the minplayer. 0 to 1.
 */
minplayer.players.base.prototype.seek = function(pos) {
};

/**
 * Set the volume of the loaded minplayer.
 *
 * @param {number} vol -1 to 1 - The relative amount to increase or decrease.
 */
minplayer.players.base.prototype.setVolumeRelative = function(vol) {

  // Get the volume
  var _this = this;
  this.getVolume(function(newVol) {
    newVol += parseFloat(vol);
    newVol = (newVol < 0) ? 0 : newVol;
    newVol = (newVol > 1) ? 1 : newVol;
    _this.setVolume(newVol);
  });
};

/**
 * Set the volume of the loaded minplayer.
 *
 * @param {number} vol The volume to set the media. 0 to 1.
 */
minplayer.players.base.prototype.setVolume = function(vol) {
  this.trigger('volumeupdate', vol);
};

/**
 * Get the volume from the loaded media.
 *
 * @param {function} callback Called when the volume is determined.
 * @return {number} The volume of the media; 0 to 1.
 */
minplayer.players.base.prototype.getVolume = function(callback) {
  return this.volume.get(callback);
};

/**
 * Get the current time for the media being played.
 *
 * @param {function} callback Called when the time is determined.
 * @return {number} The volume of the media; 0 to 1.
 */
minplayer.players.base.prototype.getCurrentTime = function(callback) {
  return this.currentTime.get(callback);
};

/**
 * Return the duration of the loaded media.
 *
 * @param {function} callback Called when the duration is determined.
 * @return {number} The duration of the loaded media.
 */
minplayer.players.base.prototype.getDuration = function(callback) {
  return this.duration.get(callback);
};

/**
 * Return the start bytes for the loaded media.
 *
 * @param {function} callback Called when the start bytes is determined.
 * @return {int} The bytes that were started.
 */
minplayer.players.base.prototype.getBytesStart = function(callback) {
  return this.bytesStart.get(callback);
};

/**
 * Return the bytes of media loaded.
 *
 * @param {function} callback Called when the bytes loaded is determined.
 * @return {int} The amount of bytes loaded.
 */
minplayer.players.base.prototype.getBytesLoaded = function(callback) {
  return this.bytesLoaded.get(callback);
};

/**
 * Return the total amount of bytes.
 *
 * @param {function} callback Called when the bytes total is determined.
 * @return {int} The total amount of bytes for this media.
 */
minplayer.players.base.prototype.getBytesTotal = function(callback) {
  return this.bytesTotal.get(callback);
};
/** The minplayer namespace. */
var minplayer = minplayer || {};

/** All the media player implementations */
minplayer.players = minplayer.players || {};

/**
 * @constructor
 * @extends minplayer.display
 * @class The HTML5 media player implementation.
 *
 * @param {object} context The jQuery context.
 * @param {object} options This components options.
 */
minplayer.players.html5 = function(context, options) {

  // Derive players base.
  minplayer.players.base.call(this, context, options);
};

/** Derive from minplayer.players.base. */
minplayer.players.html5.prototype = new minplayer.players.base();

/** Reset the constructor. */
minplayer.players.html5.prototype.constructor = minplayer.players.html5;

/**
 * @see minplayer.players.base#getPriority
 * @return {number} The priority of this media player.
 */
minplayer.players.html5.getPriority = function() {
  return 10;
};

/**
 * @see minplayer.players.base#canPlay
 * @return {boolean} If this player can play this media type.
 */
minplayer.players.html5.canPlay = function(file) {
  switch (file.mimetype) {
    case 'video/ogg':
      return !!minplayer.playTypes.videoOGG;
    case 'video/mp4':
      return !!minplayer.playTypes.videoH264;
    case 'video/x-webm':
    case 'video/webm':
    case 'application/octet-stream':
      return !!minplayer.playTypes.videoWEBM;
    case 'audio/ogg':
      return !!minplayer.playTypes.audioOGG;
    case 'audio/mpeg':
      return !!minplayer.playTypes.audioMP3;
    case 'audio/mp4':
      return !!minplayer.playTypes.audioMP4;
    default:
      return false;
  }
};

/**
 * @see minplayer.plugin.construct
 */
minplayer.players.html5.prototype.construct = function() {

  // Call base constructor.
  minplayer.players.base.prototype.construct.call(this);

  // Store the this pointer...
  var _this = this;

  // For the HTML5 player, we will just pass events along...
  if (this.player) {

    this.player.addEventListener('abort', function() {
      _this.trigger('abort');
    }, false);
    this.player.addEventListener('loadstart', function() {
      _this.onReady();
    }, false);
    this.player.addEventListener('loadeddata', function() {
      _this.onLoaded();
    }, false);
    this.player.addEventListener('loadedmetadata', function() {
      _this.onLoaded();
    }, false);
    this.player.addEventListener('canplaythrough', function() {
      _this.onLoaded();
    }, false);
    this.player.addEventListener('ended', function() {
      _this.onComplete();
    }, false);
    this.player.addEventListener('pause', function() {
      _this.onPaused();
    }, false);
    this.player.addEventListener('play', function() {
      _this.onPlaying();
    }, false);
    this.player.addEventListener('playing', function() {
      _this.onPlaying();
    }, false);
    this.player.addEventListener('error', function() {
      _this.trigger('error', 'An error occured - ' + this.error.code);
    }, false);
    this.player.addEventListener('waiting', function() {
      _this.onWaiting();
    }, false);
    this.player.addEventListener('durationchange', function() {
      _this.duration.set(this.duration);
      _this.trigger('durationchange', {duration: this.duration});
    }, false);
    this.player.addEventListener('progress', function(event) {
      _this.bytesTotal.set(event.total);
      _this.bytesLoaded.set(event.loaded);
    }, false);
  }
};

/**
 * @see minplayer.players.base#playerFound
 * @return {boolean} TRUE - if the player is in the DOM, FALSE otherwise.
 */
minplayer.players.html5.prototype.playerFound = function() {
  return (this.display.find(this.mediaFile.type).length > 0);
};

/**
 * @see minplayer.players.base#create
 * @return {object} The media player entity.
 */
minplayer.players.html5.prototype.create = function() {
  minplayer.players.base.prototype.create.call(this);
  var element = jQuery(document.createElement(this.mediaFile.type))
  .attr(this.options.attributes)
  .append(
    jQuery(document.createElement('source')).attr({
      'src': this.mediaFile.path
    })
  );

  // Fix the fluid width and height.
  element.eq(0)[0].setAttribute('width', '100%');
  element.eq(0)[0].setAttribute('height', '100%');
  return element;
};

/**
 * @see minplayer.players.base#getPlayer
 * @return {object} The media player object.
 */
minplayer.players.html5.prototype.getPlayer = function() {
  return this.options.elements.media.eq(0)[0];
};

/**
 * @see minplayer.players.base#load
 */
minplayer.players.html5.prototype.load = function(file) {

  if (file && this.isReady()) {

    // Get the current source.
    var src = this.options.elements.media.attr('src');

    // If the source is different.
    if (src != file.path) {

      // Change the source...
      var code = '<source src="' + file.path + '" ';
      code += 'type="' + file.mimetype + '"';
      code += file.codecs ? ' codecs="' + file.path + '">' : '>';
      this.options.elements.media.attr('src', '').empty().html(code);
    }
  }

  // Always call the base first on load...
  minplayer.players.base.prototype.load.call(this, file);
};

/**
 * @see minplayer.players.base#play
 */
minplayer.players.html5.prototype.play = function() {
  minplayer.players.base.prototype.play.call(this);
  if (this.isReady()) {
    this.player.play();
  }
};

/**
 * @see minplayer.players.base#pause
 */
minplayer.players.html5.prototype.pause = function() {
  minplayer.players.base.prototype.pause.call(this);
  if (this.isReady()) {
    this.player.pause();
  }
};

/**
 * @see minplayer.players.base#stop
 */
minplayer.players.html5.prototype.stop = function() {
  minplayer.players.base.prototype.stop.call(this);
  if (this.isReady()) {
    this.player.pause();
    this.player.src = '';
  }
};

/**
 * @see minplayer.players.base#seek
 */
minplayer.players.html5.prototype.seek = function(pos) {
  minplayer.players.base.prototype.seek.call(this, pos);
  if (this.isReady()) {
    this.player.currentTime = pos;
  }
};

/**
 * @see minplayer.players.base#setVolume
 */
minplayer.players.html5.prototype.setVolume = function(vol) {
  minplayer.players.base.prototype.setVolume.call(this, vol);
  if (this.isReady()) {
    this.player.volume = vol;
  }
};

/**
 * @see minplayer.players.base#getVolume
 */
minplayer.players.html5.prototype.getVolume = function(callback) {
  if (this.isReady()) {
    callback(this.player.volume);
  }
};

/**
 * @see minplayer.players.base#getDuration
 */
minplayer.players.html5.prototype.getDuration = function(callback) {
  if (this.isReady()) {
    callback(this.player.duration);
  }
};

/**
 * @see minplayer.players.base#getCurrentTime
 */
minplayer.players.html5.prototype.getCurrentTime = function(callback) {
  if (this.isReady()) {
    callback(this.player.currentTime);
  }
};

/**
 * @see minplayer.players.base#getBytesLoaded
 */
minplayer.players.html5.prototype.getBytesLoaded = function(callback) {
  if (this.isReady()) {
    var loaded = 0;

    // Check several different possibilities.
    if (this.bytesLoaded.value) {
      loaded = this.bytesLoaded.value;
    }
    else if (this.player.buffered &&
        this.player.buffered.length > 0 &&
        this.player.buffered.end &&
        this.player.duration) {
      loaded = this.player.buffered.end(0);
    }
    else if (this.player.bytesTotal != undefined &&
             this.player.bytesTotal > 0 &&
             this.player.bufferedBytes != undefined) {
      loaded = this.player.bufferedBytes;
    }

    // Return the loaded amount.
    callback(loaded);
  }
};

/**
 * @see minplayer.players.base#getBytesTotal
 */
minplayer.players.html5.prototype.getBytesTotal = function(callback) {
  if (this.isReady()) {

    var total = 0;

    // Check several different possibilities.
    if (this.bytesTotal.value) {
      total = this.bytesTotal.value;
    }
    else if (this.player.buffered &&
        this.player.buffered.length > 0 &&
        this.player.buffered.end &&
        this.player.duration) {
      total = this.player.duration;
    }
    else if (this.player.bytesTotal != undefined &&
             this.player.bytesTotal > 0 &&
             this.player.bufferedBytes != undefined) {
      total = this.player.bytesTotal;
    }

    // Return the loaded amount.
    callback(total);
  }
};
/** The minplayer namespace. */
var minplayer = minplayer || {};

/** All the media player implementations */
minplayer.players = minplayer.players || {};

/**
 * @constructor
 * @extends minplayer.display
 * @class The Flash media player class to control the flash fallback.
 *
 * @param {object} context The jQuery context.
 * @param {object} options This components options.
 */
minplayer.players.flash = function(context, options) {

  // Derive from players base.
  minplayer.players.base.call(this, context, options);
};

/** Derive from minplayer.players.base. */
minplayer.players.flash.prototype = new minplayer.players.base();

/** Reset the constructor. */
minplayer.players.flash.prototype.constructor = minplayer.players.flash;

/**
 * @see minplayer.players.base#getPriority
 * @return {number} The priority of this media player.
 */
minplayer.players.flash.getPriority = function() {
  return 0;
};

/**
 * @see minplayer.players.base#canPlay
 * @return {boolean} If this player can play this media type.
 */
minplayer.players.flash.canPlay = function(file) {
  return false;
};

/**
 * API to return the Flash player code provided params.
 *
 * @param {object} params The params used to populate the Flash code.
 * @return {object} A Flash DOM element.
 */
minplayer.players.flash.getFlash = function(params) {
  // Get the protocol.
  var protocol = window.location.protocol;
  if (protocol.charAt(protocol.length - 1) == ':') {
    protocol = protocol.substring(0, protocol.length - 1);
  }

  // Convert the flashvars object to a string...
  var flashVars = jQuery.param(params.flashvars);

  // Set the codebase.
  var codebase = protocol + '://fpdownload.macromedia.com';
  codebase += '/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0';

  // Get the HTML flash object string.
  var flash = '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" ';
  flash += 'codebase="' + codebase + '" ';
  flash += 'playerType="flash" ';
  flash += 'width="' + params.width + '" ';
  flash += 'height="' + params.height + '" ';
  flash += 'id="' + params.id + '" ';
  flash += 'name="' + params.id + '"> ';
  flash += '<param name="allowScriptAccess" value="always"></param>';
  flash += '<param name="allowfullscreen" value="true" />';
  flash += '<param name="movie" value="' + params.swf + '"></param>';
  flash += '<param name="wmode" value="' + params.wmode + '"></param>';
  flash += '<param name="quality" value="high"></param>';
  flash += '<param name="FlashVars" value="' + flashVars + '"></param>';
  flash += '<embed src="' + params.swf + '" ';
  flash += 'quality="high" ';
  flash += 'width="' + params.width + '" height="' + params.height + '" ';
  flash += 'id="' + params.id + '" name="' + params.id + '" ';
  flash += 'swLiveConnect="true" allowScriptAccess="always" ';
  flash += 'wmode="' + params.wmode + '"';
  flash += 'allowfullscreen="true" type="application/x-shockwave-flash" ';
  flash += 'FlashVars="' + flashVars + '" ';
  flash += 'pluginspage="' + protocol;
  flash += '://www.macromedia.com/go/getflashplayer" />';
  flash += '</object>';
  return flash;
};

/**
 * @see minplayer.players.base#playerFound
 * @return {boolean} TRUE - if the player is in the DOM, FALSE otherwise.
 */
minplayer.players.flash.prototype.playerFound = function() {
  return (this.display.find('object[playerType="flash"]').length > 0);
};

/**
 * @see minplayer.players.base#getPlayer
 * @return {object} The media player object.
 */
minplayer.players.flash.prototype.getPlayer = function() {
  // IE needs the object, everyone else just needs embed.
  var object = jQuery.browser.msie ? 'object' : 'embed';
  return jQuery(object, this.display).eq(0)[0];
};
/** The minplayer namespace. */
var minplayer = minplayer || {};

/** All the media player implementations */
minplayer.players = minplayer.players || {};

/**
 * @constructor
 * @extends minplayer.display
 * @class The Flash media player class to control the flash fallback.
 *
 * @param {object} context The jQuery context.
 * @param {object} options This components options.
 */
minplayer.players.minplayer = function(context, options) {

  // Derive from players flash.
  minplayer.players.flash.call(this, context, options);
};

/** Derive from minplayer.players.flash. */
minplayer.players.minplayer.prototype = new minplayer.players.flash();

/** Reset the constructor. */
minplayer.players.minplayer.prototype.constructor = minplayer.players.minplayer;

/**
 * Called when the Flash player is ready.
 *
 * @param {string} id The media player ID.
 */
window.onFlashPlayerReady = function(id) {
  var media = minplayer.get(id, 'media');
  if (media) {
    media.onReady();
  }
};

/**
 * Called when the Flash player updates.
 *
 * @param {string} id The media player ID.
 * @param {string} eventType The event type that was triggered.
 */
window.onFlashPlayerUpdate = function(id, eventType) {
  var media = minplayer.get(id, 'media');
  if (media) {
    media.onMediaUpdate(eventType);
  }
};

/**
 * Used to debug from the Flash player to the browser console.
 *
 * @param {string} debug The debug string.
 */
window.onFlashPlayerDebug = function(debug) {
  minplayer.console.log(debug);
};

/**
 * @see minplayer.players.base#getPriority
 * @return {number} The priority of this media player.
 */
minplayer.players.minplayer.getPriority = function() {
  return 1;
};

/**
 * @see minplayer.players.base#canPlay
 * @return {boolean} If this player can play this media type.
 */
minplayer.players.minplayer.canPlay = function(file) {
  switch (file.mimetype) {
    case 'video/mp4':
    case 'video/x-webm':
    case 'video/webm':
    case 'application/octet-stream':
    case 'video/quicktime':
    case 'video/3gpp2':
    case 'video/3gpp':
    case 'application/x-shockwave-flash':
    case 'audio/mpeg':
    case 'audio/mp4':
    case 'audio/aac':
    case 'audio/vnd.wave':
    case 'audio/x-ms-wma':
      return true;

    default:
      return false;
  }
};

/**
 * @see minplayer.players.base#create
 * @return {object} The media player entity.
 */
minplayer.players.minplayer.prototype.create = function() {
  minplayer.players.flash.prototype.create.call(this);

  // The flash variables for this flash player.
  var flashVars = {
    'id': this.options.id,
    'debug': this.options.debug,
    'config': 'nocontrols',
    'file': this.mediaFile.path,
    'autostart': this.options.autoplay
  };

  // Return a flash media player object.
  return minplayer.players.flash.getFlash({
    swf: this.options.swfplayer,
    id: this.options.id + '_player',
    width: this.options.width,
    height: '100%',
    flashvars: flashVars,
    wmode: this.options.wmode
  });
};

/**
 * Called when the Flash player has an update.
 *
 * @param {string} eventType The event that was triggered in the player.
 */
minplayer.players.minplayer.prototype.onMediaUpdate = function(eventType) {
  switch (eventType) {
    case 'mediaMeta':
      this.onLoaded();
      break;
    case 'mediaPlaying':
      this.onPlaying();
      break;
    case 'mediaPaused':
      this.onPaused();
      break;
    case 'mediaComplete':
      this.onComplete();
      break;
  }
};

/**
 * @see minplayer.players.base#load
 */
minplayer.players.minplayer.prototype.load = function(file) {
  minplayer.players.flash.prototype.load.call(this, file);
  if (file && this.isReady()) {
    this.player.loadMedia(file.path, file.stream);
  }
};

/**
 * @see minplayer.players.base#play
 */
minplayer.players.minplayer.prototype.play = function() {
  minplayer.players.flash.prototype.play.call(this);
  if (this.isReady()) {
    this.player.playMedia();
  }
};

/**
 * @see minplayer.players.base#pause
 */
minplayer.players.minplayer.prototype.pause = function() {
  minplayer.players.flash.prototype.pause.call(this);
  if (this.isReady()) {
    this.player.pauseMedia();
  }
};

/**
 * @see minplayer.players.base#stop
 */
minplayer.players.minplayer.prototype.stop = function() {
  minplayer.players.flash.prototype.stop.call(this);
  if (this.isReady()) {
    this.player.stopMedia();
  }
};

/**
 * @see minplayer.players.base#seek
 */
minplayer.players.minplayer.prototype.seek = function(pos) {
  minplayer.players.flash.prototype.seek.call(this, pos);
  if (this.isReady()) {
    this.player.seekMedia(pos);
  }
};

/**
 * @see minplayer.players.base#setVolume
 */
minplayer.players.minplayer.prototype.setVolume = function(vol) {
  minplayer.players.flash.prototype.setVolume.call(this, vol);
  if (this.isReady()) {
    this.player.setVolume(vol);
  }
};

/**
 * @see minplayer.players.base#getVolume
 */
minplayer.players.minplayer.prototype.getVolume = function(callback) {
  if (this.isReady()) {
    callback(this.player.getVolume());
  }
};

/**
 * @see minplayer.players.flash#getDuration
 */
minplayer.players.minplayer.prototype.getDuration = function(callback) {
  if (this.isReady()) {

    // Check to see if it is immediately available.
    var duration = this.player.getDuration();
    if (duration) {
      callback(duration);
    }
    else {

      // If not, then check every half second...
      var _this = this;
      setTimeout(function check() {
        duration = _this.player.getDuration();
        if (duration) {
          callback(duration);
        }
        else {
          setTimeout(check, 500);
        }
      }, 500);
    }
  }
};

/**
 * @see minplayer.players.base#getCurrentTime
 */
minplayer.players.minplayer.prototype.getCurrentTime = function(callback) {
  if (this.isReady()) {
    callback(this.player.getCurrentTime());
  }
};

/**
 * @see minplayer.players.base#getBytesLoaded
 */
minplayer.players.minplayer.prototype.getBytesLoaded = function(callback) {
  if (this.isReady()) {
    callback(this.player.getMediaBytesLoaded());
  }
};

/**
 * @see minplayer.players.base#getBytesTotal.
 */
minplayer.players.minplayer.prototype.getBytesTotal = function(callback) {
  if (this.isReady()) {
    callback(this.player.getMediaBytesTotal());
  }
};
/** The minplayer namespace. */
var minplayer = minplayer || {};

/** All the media player implementations */
minplayer.players = minplayer.players || {};

/**
 * @constructor
 * @extends minplayer.players.base
 * @class The YouTube media player.
 *
 * @param {object} context The jQuery context.
 * @param {object} options This components options.
 */
minplayer.players.youtube = function(context, options) {

  /** The quality of the YouTube stream. */
  this.quality = 'default';

  // Derive from players base.
  minplayer.players.base.call(this, context, options);
};

/** Derive from minplayer.players.base. */
minplayer.players.youtube.prototype = new minplayer.players.base();

/** Reset the constructor. */
minplayer.players.youtube.prototype.constructor = minplayer.players.youtube;

/**
 * @see minplayer.players.base#getPriority
 * @return {number} The priority of this media player.
 */
minplayer.players.youtube.getPriority = function() {
  return 10;
};

/**
 * @see minplayer.players.base#canPlay
 * @return {boolean} If this player can play this media type.
 */
minplayer.players.youtube.canPlay = function(file) {

  // Check for the mimetype for youtube.
  if (file.mimetype === 'video/youtube') {
    return true;
  }

  // If the path is a YouTube path, then return true.
  return (file.path.search(/^http(s)?\:\/\/(www\.)?youtube\.com/i) === 0);
};

/**
 * Return the ID for a provided media file.
 *
 * @param {object} file A {@link minplayer.file} object.
 * @return {string} The ID for the provided media.
 */
minplayer.players.youtube.getMediaId = function(file) {
  var regex = /^http[s]?\:\/\/(www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9]+)/i;
  if (file.path.search(regex) === 0) {
    return file.path.replace(regex, '$2');
  }
  else {
    return file.path;
  }
};

/**
 * Register this youtube player so that multiple players can be present
 * on the same page without event collision.
 */
minplayer.players.youtube.prototype.register = function() {

  /**
   * Register the standard youtube api ready callback.
   */
  window.onYouTubePlayerAPIReady = function() {

    // Iterate over each media player.
    jQuery.each(minplayer.get(null, 'player'), function(id, player) {

      // Make sure this is the youtube player.
      if (player.currentPlayer == 'youtube') {

        // Create a new youtube player object for this instance only.
        var playerId = id + '-player';

        // Set this players media.
        player.media.player = new YT.Player(playerId, {
          events: {
            'onReady': function(event) {
              player.media.onReady(event);
            },
            'onStateChange': function(event) {
              player.media.onPlayerStateChange(event);
            },
            'onPlaybackQualityChange': function(newQuality) {
              player.media.onQualityChange(newQuality);
            },
            'onError': function(errorCode) {
              player.media.onError(errorCode);
            }
          }
        });
      }
    });
  }
};

/**
 * Translates the player state for the YouTube API player.
 *
 * @param {number} playerState The YouTube player state.
 */
minplayer.players.youtube.prototype.setPlayerState = function(playerState) {
  switch (playerState) {
    case YT.PlayerState.CUED:
      break;
    case YT.PlayerState.BUFFERING:
      this.onWaiting();
      break;
    case YT.PlayerState.PAUSED:
      this.onPaused();
      break;
    case YT.PlayerState.PLAYING:
      this.onPlaying();
      break;
    case YT.PlayerState.ENDED:
      this.onComplete();
      break;
    default:
      break;
  }
};

/**
 * Called when an error occurs.
 *
 * @param {string} event The onReady event that was triggered.
 */
minplayer.players.youtube.prototype.onReady = function(event) {
  minplayer.players.base.prototype.onReady.call(this);
  this.onLoaded();
};

/**
 * Checks to see if this player can be found.
 * @return {bool} TRUE - Player is found, FALSE - otherwise.
 */
minplayer.players.youtube.prototype.playerFound = function() {
  var iframe = this.display.find('iframe#' + this.options.id + '-player');
  return (iframe.length > 0);
};

/**
 * Called when the player state changes.
 *
 * @param {object} event A JavaScript Event.
 */
minplayer.players.youtube.prototype.onPlayerStateChange = function(event) {
  this.setPlayerState(event.data);
};

/**
 * Called when the player quality changes.
 *
 * @param {string} newQuality The new quality for the change.
 */
minplayer.players.youtube.prototype.onQualityChange = function(newQuality) {
  this.quality = newQuality;
};

/**
 * Determines if the player should show the playloader.
 *
 * @return {bool} If this player implements its own playLoader.
 */
minplayer.players.youtube.prototype.hasPlayLoader = function() {
  return true;
};

/**
 * @see minplayer.players.base#create
 * @return {object} The media player entity.
 */
minplayer.players.youtube.prototype.create = function() {
  minplayer.players.base.prototype.create.call(this);

  // Insert the YouTube iframe API player.
  var tag = document.createElement('script');
  tag.src = 'http://www.youtube.com/player_api?enablejsapi=1';
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  // Now register this player.
  this.register();

  // Create the iframe for this player.
  var iframe = document.createElement('iframe');
  iframe.setAttribute('id', this.options.id + '-player');
  iframe.setAttribute('type', 'text/html');
  iframe.setAttribute('width', '100%');
  iframe.setAttribute('height', '100%');
  iframe.setAttribute('frameborder', '0');

  // Get the source.
  var src = 'http://www.youtube.com/embed/';
  src += this.mediaFile.id + '?';

  // Determine the origin of this script.
  var origin = location.protocol;
  origin += '//' + location.hostname;
  origin += (location.port && ':' + location.port);

  // Add the parameters to the src.
  src += jQuery.param({
    'wmode': 'opaque',
    'controls': 0,
    'enablejsapi': 1,
    'origin': origin,
    'autoplay': this.options.autoplay,
    'loop': this.options.loop
  });

  // Set the source of the iframe.
  iframe.setAttribute('src', src);

  // Return the player.
  return iframe;
};

/**
 * @see minplayer.players.base#load
 */
minplayer.players.youtube.prototype.load = function(file) {
  minplayer.players.base.prototype.load.call(this, file);
  if (file && this.isReady()) {
    this.player.loadVideoById(file.id, 0, this.quality);
  }
};

/**
 * @see minplayer.players.base#play
 */
minplayer.players.youtube.prototype.play = function() {
  minplayer.players.base.prototype.play.call(this);
  if (this.isReady()) {
    this.player.playVideo();
  }
};

/**
 * @see minplayer.players.base#pause
 */
minplayer.players.youtube.prototype.pause = function() {
  minplayer.players.base.prototype.pause.call(this);
  if (this.isReady()) {
    this.player.pauseVideo();
  }
};

/**
 * @see minplayer.players.base#stop
 */
minplayer.players.youtube.prototype.stop = function() {
  minplayer.players.base.prototype.stop.call(this);
  if (this.isReady()) {
    this.player.stopVideo();
  }
};

/**
 * @see minplayer.players.base#seek
 */
minplayer.players.youtube.prototype.seek = function(pos) {
  minplayer.players.base.prototype.seek.call(this, pos);
  if (this.isReady()) {
    this.player.seekTo(pos, true);
  }
};

/**
 * @see minplayer.players.base#setVolume
 */
minplayer.players.youtube.prototype.setVolume = function(vol) {
  minplayer.players.base.prototype.setVolume.call(this, vol);
  if (this.isReady()) {
    this.player.setVolume(vol * 100);
  }
};

/**
 * @see minplayer.players.base#getVolume
 */
minplayer.players.youtube.prototype.getVolume = function(callback) {
  if (this.isReady()) {
    callback(this.player.getVolume());
  }
};

/**
 * @see minplayer.players.base#getDuration.
 */
minplayer.players.youtube.prototype.getDuration = function(callback) {
  if (this.isReady()) {
    callback(this.player.getDuration());
  }
};

/**
 * @see minplayer.players.base#getCurrentTime
 */
minplayer.players.youtube.prototype.getCurrentTime = function(callback) {
  if (this.isReady()) {
    callback(this.player.getCurrentTime());
  }
};

/**
 * @see minplayer.players.base#getBytesStart.
 */
minplayer.players.youtube.prototype.getBytesStart = function(callback) {
  if (this.isReady()) {
    callback(this.player.getVideoStartBytes());
  }
};

/**
 * @see minplayer.players.base#getBytesLoaded.
 */
minplayer.players.youtube.prototype.getBytesLoaded = function(callback) {
  if (this.isReady()) {
    callback(this.player.getVideoBytesLoaded());
  }
};

/**
 * @see minplayer.players.base#getBytesTotal.
 */
minplayer.players.youtube.prototype.getBytesTotal = function(callback) {
  if (this.isReady()) {
    callback(this.player.getVideoBytesTotal());
  }
};
/** The minplayer namespace. */
var minplayer = minplayer || {};

/** All the media player implementations */
minplayer.players = minplayer.players || {};

/**
 * @constructor
 * @extends minplayer.players.base
 * @class The vimeo media player.
 *
 * @param {object} context The jQuery context.
 * @param {object} options This components options.
 */
minplayer.players.vimeo = function(context, options) {

  // Derive from players base.
  minplayer.players.base.call(this, context, options);
};

/** Derive from minplayer.players.base. */
minplayer.players.vimeo.prototype = new minplayer.players.base();

/** Reset the constructor. */
minplayer.players.vimeo.prototype.constructor = minplayer.players.vimeo;

/**
 * @see minplayer.players.base#getPriority
 * @return {number} The priority of this media player.
 */
minplayer.players.vimeo.getPriority = function() {
  return 10;
};

/**
 * @see minplayer.players.base#canPlay
 * @return {boolean} If this player can play this media type.
 */
minplayer.players.vimeo.canPlay = function(file) {

  // Check for the mimetype for vimeo.
  if (file.mimetype === 'video/vimeo') {
    return true;
  }

  // If the path is a vimeo path, then return true.
  return (file.path.search(/^http(s)?\:\/\/(www\.)?vimeo\.com/i) === 0);
};

/**
 * Return the ID for a provided media file.
 *
 * @param {object} file A {@link minplayer.file} object.
 * @return {string} The ID for the provided media.
 */
minplayer.players.vimeo.getMediaId = function(file) {
  var regex = /^http[s]?\:\/\/(www\.)?vimeo\.com\/(\?v\=)?([0-9]+)/i;
  if (file.path.search(regex) === 0) {
    return file.path.replace(regex, '$3');
  }
  else {
    return file.path;
  }
};

/**
 * @see minplayer.players.base#reset
 */
minplayer.players.vimeo.prototype.reset = function() {

  // Reset the flash variables..
  minplayer.players.base.prototype.reset.call(this);
};

/**
 * @see minplayer.players.base#create
 * @return {object} The media player entity.
 */
minplayer.players.vimeo.prototype.create = function() {
  minplayer.players.base.prototype.create.call(this);

  // Insert the Vimeo Froogaloop player.
  var tag = document.createElement('script');
  tag.src = 'http://a.vimeocdn.com/js/froogaloop2.min.js';
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  // Create the iframe for this player.
  var iframe = document.createElement('iframe');
  iframe.setAttribute('id', this.options.id + '-player');
  iframe.setAttribute('type', 'text/html');
  iframe.setAttribute('width', '100%');
  iframe.setAttribute('height', '100%');
  iframe.setAttribute('frameborder', '0');

  // Get the source.
  var src = 'http://player.vimeo.com/video/';
  src += this.mediaFile.id + '?';

  // Add the parameters to the src.
  src += jQuery.param({
    'wmode': 'opaque',
    'api': 1,
    'player_id': this.options.id + '-player',
    'title': 0,
    'byline': 0,
    'portrait': 0,
    'autoplay': this.options.autoplay,
    'loop': this.options.loop
  });

  // Set the source of the iframe.
  iframe.setAttribute('src', src);

  // Now register this player when the froogaloop code is loaded.
  var _this = this;
  setTimeout(function check() {
    if (window.Froogaloop) {
      _this.player = window.Froogaloop(iframe);
      _this.player.addEvent('ready', function() {
        _this.onReady();
      });
    }
    else {
      setTimeout(check, 200);
    }
  }, 200);

  // Trigger that the load has started.
  this.trigger('loadstart');

  // Return the player.
  return iframe;
};

/**
 * @see minplayer.players.base#onReady
 */
minplayer.players.vimeo.prototype.onReady = function(player_id) {
  // Store the this pointer within this context.
  var _this = this;

  // Add the other listeners.
  this.player.addEvent('loadProgress', function(progress) {

    // Set the duration, bytesLoaded, and bytesTotal.
    _this.duration.set(parseFloat(progress.duration));
    _this.bytesLoaded.set(progress.bytesLoaded);
    _this.bytesTotal.set(progress.bytesTotal);
  });

  this.player.addEvent('playProgress', function(progress) {

    // Set the duration and current time.
    _this.duration.set(parseFloat(progress.duration));
    _this.currentTime.set(parseFloat(progress.seconds));
  });

  this.player.addEvent('play', function() {
    _this.onPlaying();
  });

  this.player.addEvent('pause', function() {
    _this.onPaused();
  });

  this.player.addEvent('finish', function() {
    _this.onComplete();
  });

  minplayer.players.base.prototype.onReady.call(this);
  this.onLoaded();
};

/**
 * Checks to see if this player can be found.
 * @return {bool} TRUE - Player is found, FALSE - otherwise.
 */
minplayer.players.vimeo.prototype.playerFound = function() {
  var iframe = this.display.find('iframe#' + this.options.id + '-player');
  return (iframe.length > 0);
};

/**
 * @see minplayer.players.base#play
 */
minplayer.players.vimeo.prototype.play = function() {
  minplayer.players.base.prototype.play.call(this);
  if (this.isReady()) {
    this.player.api('play');
  }
};

/**
 * @see minplayer.players.base#pause
 */
minplayer.players.vimeo.prototype.pause = function() {
  minplayer.players.base.prototype.pause.call(this);
  if (this.isReady()) {
    this.player.api('pause');
  }
};

/**
 * @see minplayer.players.base#stop
 */
minplayer.players.vimeo.prototype.stop = function() {
  minplayer.players.base.prototype.stop.call(this);
  if (this.isReady()) {
    this.player.api('unload');
  }
};

/**
 * @see minplayer.players.base#seek
 */
minplayer.players.vimeo.prototype.seek = function(pos) {
  minplayer.players.base.prototype.seek.call(this, pos);
  if (this.isReady()) {
    this.player.api('seekTo', pos);
  }
};

/**
 * @see minplayer.players.base#setVolume
 */
minplayer.players.vimeo.prototype.setVolume = function(vol) {
  minplayer.players.base.prototype.setVolume.call(this, vol);
  if (this.isReady()) {
    this.volume.set(vol);
    this.player.api('setVolume', vol);
  }
};

/**
 * @see minplayer.players.base#getVolume
 */
minplayer.players.vimeo.prototype.getVolume = function(callback) {
  var _this = this;
  this.player.api('getVolume', function(vol) {
    callback(vol);
  });
};

/**
 * @see minplayer.players.base#getDuration.
 */
minplayer.players.vimeo.prototype.getDuration = function(callback) {
  if (this.isReady()) {
    if (this.duration.value) {
      callback(this.duration.value);
    }
    else {
      this.player.api('getDuration', function(duration) {
        callback(duration);
      });
    }
  }
};
/** The minplayer namespace. */
var minplayer = minplayer || {};

/** Define the controller object. */
minplayer.controller = minplayer.controller || {};

/**
 * @constructor
 * @extends minplayer.display
 * @class This is the base minplayer controller.  Other controllers can derive
 * from the base and either build on top of it or simply define the elements
 * that this base controller uses.
 *
 * @param {object} context The jQuery context.
 * @param {object} options This components options.
 */
minplayer.controller.base = function(context, options) {

  // Derive from display
  minplayer.display.call(this, 'controller', context, options);
};

// Define the prototype for all controllers.
var controllersBase = minplayer.controller.base;

/** Derive from minplayer.display. */
minplayer.controller.base.prototype = new minplayer.display();

/** Reset the constructor. */
minplayer.controller.base.prototype.constructor = minplayer.controller.base;

/**
 * A static function that will format a time value into a string time format.
 *
 * @param {integer} time An integer value of time.
 * @return {string} A string representation of the time.
 */
minplayer.formatTime = function(time) {
  time = time || 0;
  var seconds = 0, minutes = 0, hour = 0, timeString = '';

  hour = Math.floor(time / 3600);
  time -= (hour * 3600);
  minutes = Math.floor(time / 60);
  time -= (minutes * 60);
  seconds = Math.floor(time % 60);

  if (hour) {
    timeString += String(hour);
    timeString += ':';
  }

  timeString += (minutes >= 10) ? String(minutes) : ('0' + String(minutes));
  timeString += ':';
  timeString += (seconds >= 10) ? String(seconds) : ('0' + String(seconds));
  return {time: timeString, units: ''};
};

/**
 * @see minplayer.display#getElements
 * @return {object} The elements defined by this display.
 */
minplayer.controller.base.prototype.getElements = function() {
  var elements = minplayer.display.prototype.getElements.call(this);
  return jQuery.extend(elements, {
    play: null,
    pause: null,
    fullscreen: null,
    seek: null,
    progress: null,
    volume: null,
    timer: null
  });
};

/**
 * @see minplayer.plugin#construct
 */
minplayer.controller.base.prototype.construct = function() {

  // Call the minplayer plugin constructor.
  minplayer.display.prototype.construct.call(this);

  // If they have a fullscreen button.
  if (this.elements.fullscreen) {

    // Bind to the click event.
    this.elements.fullscreen.bind('click', {obj: this}, function(event) {
      var isFull = event.data.obj.elements.player.hasClass('fullscreen');
      if (isFull) {
        event.data.obj.elements.player.removeClass('fullscreen');
      }
      else {
        event.data.obj.elements.player.addClass('fullscreen');
      }
      event.data.obj.trigger('fullscreen', !isFull);
    }).css({'pointer' : 'hand'});
  }

  // Keep track of if we are dragging...
  this.dragging = false;

  // If they have a seek bar.
  if (this.elements.seek) {

    // Create the seek bar slider control.
    this.seekBar = this.elements.seek.slider({
      range: 'min'
    });
  }

  // If they have a volume bar.
  if (this.elements.volume) {

    // Create the volume bar slider control.
    this.volumeBar = this.elements.volume.slider({
      range: 'min',
      orientation: 'vertical'
    });
  }

  // Get the media plugin.
  this.get('media', function(media) {

    var _this = this;

    // If they have a pause button
    if (this.elements.pause) {

      // Bind to the click on this button.
      this.elements.pause.unbind().bind('click', {obj: this}, function(event) {
        event.preventDefault();
        event.data.obj.playPause(false, media);
      });

      // Bind to the pause event of the media.
      media.bind('pause', {obj: this}, function(event) {
        event.data.obj.setPlayPause(true);
      });
    }

    // If they have a play button
    if (this.elements.play) {

      // Bind to the click on this button.
      this.elements.play.unbind().bind('click', {obj: this}, function(event) {
        event.preventDefault();
        event.data.obj.playPause(true, media);
      });

      // Bind to the play event of the media.
      media.bind('playing', {obj: this}, function(event) {
        event.data.obj.setPlayPause(false);
      });
    }

    // If they have a duration, then trigger on duration change.
    if (this.elements.duration) {

      // Bind to the duration change event.
      media.bind('durationchange', {obj: this}, function(event, data) {
        event.data.obj.setTimeString('duration', data.duration);
      });

      // Set the timestring to the duration.
      media.getDuration(function(duration) {
        _this.setTimeString('duration', duration);
      });
    }

    // If they have a progress element.
    if (this.elements.progress) {

      // Bind to the progress event.
      media.bind('progress', {obj: this}, function(event, data) {
        var percent = data.total ? (data.loaded / data.total) * 100 : 0;
        event.data.obj.elements.progress.width(percent + '%');
      });
    }

    // If they have a seek bar or timer, bind to the timeupdate.
    if (this.seekBar || this.elements.timer) {

      // Bind to the time update event.
      media.bind('timeupdate', {obj: this}, function(event, data) {
        if (!event.data.obj.dragging) {
          var value = 0;
          if (data.duration) {
            value = (data.currentTime / data.duration) * 100;
          }

          // Update the seek bar if it exists.
          if (event.data.obj.seekBar) {
            event.data.obj.seekBar.slider('option', 'value', value);
          }

          event.data.obj.setTimeString('timer', data.currentTime);
        }
      });
    }

    // If they have a seekBar element.
    if (this.seekBar) {

      // Register the events for the control bar to control the media.
      this.seekBar.slider({
        start: function(event, ui) {
          _this.dragging = true;
        },
        stop: function(event, ui) {
          _this.dragging = false;
          media.getDuration(function(duration) {
            media.seek((ui.value / 100) * duration);
          });
        },
        slide: function(event, ui) {
          media.getDuration(function(duration) {
            var time = (ui.value / 100) * duration;
            if (!_this.dragging) {
              media.seek(time);
            }
            _this.setTimeString('timer', time);
          });
        }
      });
    }

    // Setup the volume bar.
    if (this.volumeBar) {

      // Create the slider.
      this.volumeBar.slider({
        slide: function(event, ui) {
          media.setVolume(ui.value / 100);
        }
      });

      media.bind('volumeupdate', {obj: this}, function(event, vol) {
        event.data.obj.volumeBar.slider('option', 'value', (vol * 100));
      });

      // Set the volume to match that of the player.
      media.getVolume(function(vol) {
        _this.volumeBar.slider('option', 'value', (vol * 100));
      });
    }
  });

  // We are now ready.
  this.ready();
};

/**
 * Sets the play and pause state of the control bar.
 *
 * @param {boolean} state TRUE - Show Play, FALSE - Show Pause.
 */
minplayer.controller.base.prototype.setPlayPause = function(state) {
  var css = '';
  if (this.elements.play) {
    css = state ? 'inherit' : 'none';
    this.elements.play.css('display', css);
  }
  if (this.elements.pause) {
    css = state ? 'none' : 'inherit';
    this.elements.pause.css('display', css);
  }
};

/**
 * Plays or pauses the media.
 *
 * @param {bool} state true => play, false => pause.
 * @param {object} media The media player object.
 */
minplayer.controller.base.prototype.playPause = function(state, media) {
  var type = state ? 'play' : 'pause';
  this.display.trigger(type);
  this.setPlayPause(!state);
  if (media) {
    media[type]();
  }
};

/**
 * Sets the time string on the control bar.
 *
 * @param {string} element The name of the element to set.
 * @param {number} time The total time amount to set.
 */
minplayer.controller.base.prototype.setTimeString = function(element, time) {
  if (this.elements[element]) {
    this.elements[element].text(minplayer.formatTime(time).time);
  }
};
