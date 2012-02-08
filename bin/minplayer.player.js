/** The minplayer namespace. */
var minplayer = minplayer || {};

// Private function to check a single element's play type.
function checkPlayType(elem, playType) {
  if ((typeof elem.canPlayType) === 'function') {
    var canPlay = elem.canPlayType(playType);
    return ('no' !== canPlay) && ('' !== canPlay);
  }
  else {
    return false;
  }
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
  this.videoH264 = checkPlayType(elem, 'video/mp4');

  /** Can play WEBM video */
  this.videoWEBM = checkPlayType(elem, 'video/x-webm');

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
};

/**
 * Sets the current media player.
 *
 * @param {object} player The current media player.
 */
minplayer.plugin.prototype.setPlayer = function(player) {
  this.player = player;
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
 * @param {object} context The jQuery context this component resides.
 * @param {object} options The options for this component.
 */
minplayer.display = function(context, options) {

  if (context) {

    // Set the display and options.
    this.display = jQuery(context);
    this.options = options;

    // Extend all display elements.
    this.options.elements = this.options.elements || {};
    jQuery.extend(this.options.elements, this.getElements());
    this.elements = this.options.elements;
  }

  // Derive from plugin
  minplayer.plugin.call(this, context, options);
};

/** Derive from minplayer.plugin. */
minplayer.display.prototype = new minplayer.plugin();

/** Reset the constructor. */
minplayer.display.prototype.constructor = minplayer.display;

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
/** The minplayer namespace. */
var minplayer = minplayer || {};

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
      if (!minplayer.player[jQuery(this).selector]) {
        new minplayer.player(jQuery(this), options);
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
minplayer.player = function(context, options) {

  // Make sure we provide default options...
  options = jQuery.extend({
    id: 'player',
    controller: 'default',
    template: 'default',
    volume: 80,
    swfplayer: '',
    wmode: 'transparent',
    attributes: {},
    settings: {},
    file: null
  }, options);

  // Store this player instance.
  minplayer.player[options.id] = this;

  // Derive from display
  minplayer.display.call(this, context, options);
};

/** Derive from minplayer.display. */
minplayer.player.prototype = new minplayer.display();

/** Reset the constructor. */
minplayer.player.prototype.constructor = minplayer.player;

/**
 * @see minplayer.plugin.construct
 */
minplayer.player.prototype.construct = function() {

  // Call the minplayer display constructor.
  minplayer.display.prototype.construct.call(this);

  /** The current player. */
  this.media = null;

  /** All of the plugin objects. */
  this.allPlugins = {};

  /** Variable to store the current media player. */
  this.currentPlayer = 'html5';

  // Add key events to the window.
  this.addKeyEvents();

  // Load all the plugins.
  this.loadPlugins();

  // Now load these files.
  this.load(this.getFiles());
};

/**
 * Adds key events to the player.
 */
minplayer.player.prototype.addKeyEvents = function() {

  // Bind keyup to the current window.
  jQuery(window).bind('keyup', {obj: this}, function(event) {
    // Escape out of fullscreen if they press ESC or Q.
    var isFull = event.data.obj.display.hasClass('fullscreen');
    if (isFull && (event.keyCode === 113 || event.keyCode === 27)) {
      event.data.obj.display.removeClass('fullscreen');
    }
  });
};

/**
 * Loads all of the available plugins.
 */
minplayer.player.prototype.loadPlugins = function() {
  var plugin = null;
  var pluginInfo = {};
  var pluginContext = null;
  var i = minplayer.plugins.length;
  while (i--) {
    pluginInfo = minplayer.plugins[i];
    if (pluginInfo.element) {
      pluginContext = jQuery(pluginInfo.element, this.display);
    }
    else {
      pluginContext = this.display;
    }
    plugin = new pluginInfo.object(pluginContext, this.options);
    this.addPlugin(pluginInfo.id, plugin);
  }
};

/**
 * Returns all the media files available for this player.
 *
 * @return {array} All the media files for this player.
 */
minplayer.player.prototype.getFiles = function() {
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
minplayer.player.prototype.getMediaFile = function(files) {

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
 * Load a set of files or a single file for the media player.
 *
 * @param {array} files An array of files to chose from to load.
 */
minplayer.player.prototype.load = function(files) {

  // Set the id and class.
  var id = '', pClass = '';

  // If no file was provided, then get it.
  files = files || this.options.file;
  this.options.file = this.getMediaFile(files);

  // Do nothing if there isn't a file.
  if (!this.options.file) {
    return;
  }

  // Only destroy if the current player is different than the new player.
  var player = this.options.file.player.toString();

  // If there isn't media or if the players are different.
  if (!this.media || (player !== this.currentPlayer)) {

    // Set the current media player.
    this.currentPlayer = player;

    // The display for this media player.
    var display = this.elements.display;

    // Do nothing if we don't have a display.
    if (!display) {
      return;
    }

    // Get the class name and create the new player.
    var _this = this;
    pClass = minplayer.players[this.options.file.player];
    this.media = new pClass(display, this.options, function(player) {

      // Iterate through all plugins and add the player to them.
      for (id in _this.allPlugins) {
        if (_this.allPlugins.hasOwnProperty(id)) {
          _this.allPlugins[id].setPlayer(player);
        }
      }

      // Now load this media.
      player.load();
    });
  }

  // If the media object already exists...
  else if (this.media) {

    // Now load the different media file.
    this.media.load(this.options.file);
  }
};

/**
 * Add a new plugin to the media player.
 *
 * @param {string} id The plugin ID.
 * @param {object} plugin A new plugin object, derived from media.plugin.
 */
minplayer.player.prototype.addPlugin = function(id, plugin) {

  // Only continue if the plugin exists.
  if (plugin.isValid()) {

    // Add to plugins.
    this.allPlugins[id] = plugin;
  }
};

/**
 * Returns a plugin provided a plugin ID.
 *
 * @param {string} id The plugin ID to retrieve.
 * @return {object} The plugin matching the provided ID.
 */
minplayer.player.prototype.getPlugin = function(id) {
  return this.allPlugins[id];
};

/**
 * Play the currently loaded media file.  Use load first to load a
 * media file into the media player.
 */
minplayer.player.prototype.play = function() {
  if (this.media) {
    this.media.play();
  }
};

/**
 * Pause the media.
 */
minplayer.player.prototype.pause = function() {
  if (this.media) {
    this.media.pause();
  }
};

/**
 * Stop the media.
 */
minplayer.player.prototype.stop = function() {
  if (this.media) {
    this.media.stop();
  }
};

/**
 * Seek the media to the provided position.
 *
 * @param {number} pos The position to seek.  0 to 1.
 */
minplayer.player.prototype.seek = function(pos) {
  if (this.media) {
    this.media.seek(pos);
  }
};

/**
 * Set the volume of the media being played.
 *
 * @param {number} vol The volume to set.  0 to 1.
 */
minplayer.player.prototype.setVolume = function(vol) {
  if (this.media) {
    this.media.setVolume(vol);
  }
};

/**
 * Get the current volume setting.
 *
 * @param {function} callback The callback that is called when the volume
 * is known.
 * @return {number} The current volume level. 0 to 1.
 */
minplayer.player.prototype.getVolume = function(callback) {
  return this.media ? this.media.getVolume(callback) : 0;
};

/**
 * Get the current media duration.
 *
 * @param {function} callback The callback that is called when the duration
 * is known.
 * @return {number} The current media duration.
 */
minplayer.player.prototype.getDuration = function(callback) {
  return this.media ? this.media.getDuration(callback) : 0;
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
  this.mimetype = file.mimetype || this.getMimeType();
  this.type = file.type || this.getType();
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
      return 'video/x-webm';
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
    case 'video/x-webm':
    case 'video/ogg':
    case 'video/3gpp2':
    case 'video/3gpp':
    case 'video/quicktime':
      return 'video';
    case 'audio/mp3':
    case 'audio/mp4':
    case 'audio/ogg':
      return 'audio';
    default:
      return 'unknown';
  }
};

/**
 * Returns the ID for this media file.
 *
 * @return {string} The id for this media file which is provided by the player.
 */
minplayer.file.prototype.getId = function() {
  var player = minplayer.players[this.player];
  return player.getMediaId ? player.getMediaId(this) : '';
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

  // Derive from display
  minplayer.display.call(this, context, options);
};

/** Derive from minplayer.display. */
minplayer.playLoader.base.prototype = new minplayer.display();

/** Reset the constructor. */
minplayer.playLoader.base.prototype.constructor = minplayer.playLoader.base;

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

/**
 * @see minplayer.plugin#setPlayer
 */
minplayer.playLoader.base.prototype.setPlayer = function(player) {
  minplayer.display.prototype.setPlayer.call(this, player);

  // Only bind if this player does not have its own play loader.
  if (!player.hasPlayLoader()) {

    // Trigger a play event when someone clicks on the controller.
    if (this.elements.bigPlay) {
      this.elements.bigPlay.unbind();
      this.elements.bigPlay.bind('click', {player: player}, function(event) {
        event.preventDefault();
        jQuery(this).hide();
        event.data.player.play();
      });
    }

    // Bind to the player events to control the play loader.
    player.bind('loadstart', {obj: this}, function(event) {
      event.data.obj.busy.setFlag('media', true);
      event.data.obj.bigPlay.setFlag('media', true);
      event.data.obj.checkVisibility();
    });
    player.bind('waiting', {obj: this}, function(event) {
      event.data.obj.busy.setFlag('media', true);
      event.data.obj.checkVisibility();
    });
    player.bind('loadeddata', {obj: this}, function(event) {
      event.data.obj.busy.setFlag('media', false);
      event.data.obj.checkVisibility();
    });
    player.bind('playing', {obj: this}, function(event) {
      event.data.obj.busy.setFlag('media', false);
      event.data.obj.bigPlay.setFlag('media', false);
      event.data.obj.checkVisibility();
    });
    player.bind('pause', {obj: this}, function(event) {
      event.data.obj.bigPlay.setFlag('media', true);
      event.data.obj.checkVisibility();
    });
  }
  else {

    // Hide the busy cursor.
    if (this.elements.busy) {
      this.elements.busy.hide();
    }

    // Hide the big play button.
    if (this.elements.bigPlay) {
      this.elements.bigPlay.unbind();
      this.elements.bigPlay.hide();
    }

    // Hide the display.
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
 * @param {function} ready The callback function when the player is ready.
 */
minplayer.players.base = function(context, options, ready) {

  /** The ready pointer to be called when the player is ready. */
  this.readyCallback = ready;

  // Reset the variables to initial state.
  this.reset();

  // Derive from display
  minplayer.display.call(this, context, options);
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

  /** The currently loaded media file. */
  this.mediaFile = this.options.file;

  // Get the player display object.
  if (!this.playerFound()) {

    // Cleanup some events and code.
    this.display.unbind();

    // Remove the media element if found
    if (this.elements.media) {
      this.elements.media.remove();
    }

    // Create a new media player element.
    this.display.html(this.create());
  }

  // Get the player object...
  this.player = this.getPlayer();

  // Reset the player params.
  this.reset();
};

/**
 * Clears all the intervals.
 */
minplayer.players.base.prototype.clearIntervals = function() {
  // Stop the intervals.
  if (this.playInterval) {
    clearInterval(this.playInterval);
  }

  if (this.progressInterval) {
    clearInterval(this.progressInterval);
  }
};

/**
 * Resets all variables.
 */
minplayer.players.base.prototype.reset = function() {

  // Reset the ready flag.
  this.ready = false;

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

  // Stop the intervals.
  this.clearIntervals();

  // Set the intervals to zero.
  this.playInterval = 0;
  this.progressInterval = 0;
};

/**
 * Called when the player is ready to recieve events and commands.
 */
minplayer.players.base.prototype.onReady = function() {
  // Store the this pointer.
  var _this = this;

  // Set the ready flag.
  this.ready = true;

  // Set the volume to the default.
  this.setVolume(this.options.volume / 100);

  // Create a progress interval to keep track of the bytes loaded.
  this.progressInterval = setInterval(function() {

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
        }
      });

    });
  }, 1000);

  // Call the callback to let this person know we are ready.
  if (this.readyCallback) {
    this.readyCallback(this);
  }

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

  // Create a progress interval to keep track of the bytes loaded.
  this.playInterval = setInterval(function() {

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
  }, 1000);
};

/**
 * Should be called when the media is paused.
 */
minplayer.players.base.prototype.onPaused = function() {

  // Trigger an event that we are paused.
  this.trigger('pause');

  // Stop the play interval.
  clearInterval(this.playInterval);
};

/**
 * Should be called when the media is complete.
 */
minplayer.players.base.prototype.onComplete = function() {
  // Stop the intervals.
  this.clearIntervals();
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
 * @see minplayer.players.base#isReady
 * @return {boolean} Checks to see if the Flash is ready.
 */
minplayer.players.base.prototype.isReady = function() {

  // Return that the player is set and the ready flag is good.
  return (this.player && this.ready);
};

/**
 * Trigger a media event.
 *
 * @param {string} type The event type.
 * @param {object} data The event data object.
 * @return {object} The jQuery prototype.
 */
minplayer.players.base.prototype.trigger = function(type, data) {
  return this.display.trigger(type, data);
};

/**
 * Bind to a media event.
 *
 * @param {string} types The event type.
 * @param {object} data The data to bind with the event.
 * @param {function} fn The callback function.
 * @return {object} The jQuery prototype.
 **/
minplayer.players.base.prototype.bind = function(types, data, fn) {

  // We will always unbind first for media events.
  return this.display.unbind(types, fn).bind(types, data, fn);
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
  // Stop the intervals.
  this.clearIntervals();
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
 * @param {function} ready Called when the player is ready.
 */
minplayer.players.html5 = function(context, options, ready) {

  // Derive players base.
  minplayer.players.base.call(this, context, options, ready);
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
      return minplayer.playTypes.videoOGG;
    case 'video/mp4':
      return minplayer.playTypes.videoH264;
    case 'video/x-webm':
      return minplayer.playTypes.videoWEBM;
    case 'audio/ogg':
      return minplayer.playTypes.audioOGG;
    case 'audio/mpeg':
      return minplayer.playTypes.audioMP3;
    case 'audio/mp4':
      return minplayer.playTypes.audioMP4;
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
      _this.trigger('error');
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
    if (this.autoBuffer()) {
      this.player.autobuffer = true;
    } else {
      this.player.autobuffer = false;
      this.player.preload = 'none';
    }
  }
};

/**
 * Determine if this player is able to autobuffer.
 * @return {boolean} TRUE - the player is able to autobuffer.
 */
minplayer.players.html5.prototype.autoBuffer = function() {
  var preload = this.player.preload !== 'none';
  if (typeof this.player.hasAttribute === 'function') {
    return this.player.hasAttribute('preload') && preload;
  }
  else {
    return false;
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
  var element = document.createElement(this.mediaFile.type), attribute = '';
  for (attribute in this.options.attributes) {
    if (this.options.attributes.hasOwnProperty(attribute)) {
      element.setAttribute(attribute, this.options.attributes[attribute]);
    }
  }
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
    var src = this.options.elements.player.attr('src');

    // If the source is different.
    if (src != file.path) {

      // Change the source...
      var code = '<source src="' + file.path + '" ';
      code += 'type="' + file.mimetype + '"';
      code += file.codecs ? ' codecs="' + file.path + '">' : '>';
      this.options.elements.player.attr('src', '').empty().html(code);
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
 * @param {function} ready Called when the player is ready.
 */
minplayer.players.flash = function(context, options, ready) {

  // Derive from players base.
  minplayer.players.base.call(this, context, options, ready);
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
  var element = null;
  var embed = null;
  var paramKey = '';
  var flashParams = {};
  var param = null;

  if (protocol.charAt(protocol.length - 1) === ':') {
    protocol = protocol.substring(0, protocol.length - 1);
  }

  // Create an object element.
  element = document.createElement('object');
  element.setAttribute('width', params.width);
  element.setAttribute('height', params.height);
  element.setAttribute('id', params.id);
  element.setAttribute('name', params.id);
  element.setAttribute('playerType', params.playerType);

  // Setup a params array to make the param additions eaiser.
  flashParams = {
    'allowScriptAccess': 'always',
    'allowfullscreen': 'true',
    'movie': params.swf,
    'wmode': params.wmode,
    'quality': 'high',
    'FlashVars': jQuery.param(params.flashvars)
  };

  // Add the parameters.
  for (paramKey in flashParams) {
    if (flashParams.hasOwnProperty(paramKey)) {
      param = document.createElement('param');
      param.setAttribute('name', paramKey);
      param.setAttribute('value', flashParams[paramKey]);
      element.appendChild(param);
    }
  }

  // Add the embed element.
  embed = document.createElement('embed');
  for (paramKey in flashParams) {
    if (flashParams.hasOwnProperty(paramKey)) {
      if (paramKey === 'movie') {
        embed.setAttribute('src', flashParams[paramKey]);
      }
      else {
        embed.setAttribute(paramKey, flashParams[paramKey]);
      }
    }
  }

  embed.setAttribute('width', params.width);
  embed.setAttribute('height', params.height);
  embed.setAttribute('id', params.id);
  embed.setAttribute('name', params.id);
  embed.setAttribute('swLiveConnect', 'true');
  embed.setAttribute('type', 'application/x-shockwave-flash');
  element.appendChild(embed);
  return element;
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
 * @param {function} ready Called when the player is ready.
 */
minplayer.players.minplayer = function(context, options, ready) {

  // Derive from players flash.
  minplayer.players.flash.call(this, context, options, ready);
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
  if (minplayer.player[id]) {
    minplayer.player[id].media.onReady();
  }
};

/**
 * Called when the Flash player updates.
 *
 * @param {string} id The media player ID.
 * @param {string} eventType The event type that was triggered.
 */
window.onFlashPlayerUpdate = function(id, eventType) {
  if (minplayer.player[id]) {
    minplayer.player[id].media.onMediaUpdate(eventType);
  }
};

var debugConsole = console || {log: function(data) {}};

/**
 * Used to debug from the Flash player to the browser console.
 *
 * @param {string} debug The debug string.
 */
window.onFlashPlayerDebug = function(debug) {
  debugConsole.log(debug);
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
    'debug': this.options.settings.debug,
    'config': 'nocontrols',
    'file': this.mediaFile.path,
    'autostart': this.options.settings.autoplay
  };

  // Return a flash media player object.
  return minplayer.players.flash.getFlash({
    swf: this.options.swfplayer,
    id: this.options.id + '_player',
    playerType: 'flash',
    width: this.options.settings.width,
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
    callback(this.player.getDuration());
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
 * @param {function} ready Called when the player is ready.
 */
minplayer.players.youtube = function(context, options, ready) {

  /** The quality of the YouTube stream. */
  this.quality = 'default';

  // Derive from players base.
  minplayer.players.base.call(this, context, options, ready);
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

    // Iterate through all of the player instances.
    for (var id in minplayer.player) {

      // Get the instance and check to see if it is a youtube player.
      var instance = minplayer.player[id];
      if (instance.currentPlayer == 'youtube') {

        // Create a new youtube player object for this instance only.
        var playerId = instance.options.id + '-player';
        instance.media.player = new YT.Player(playerId, {
          events: {
            'onReady': function(event) {
              instance.media.onReady(event);
            },
            'onStateChange': function(event) {
              instance.media.onPlayerStateChange(event);
            },
            'onPlaybackQualityChange': function(newQuality) {
              instance.media.onQualityChange(newQuality);
            },
            'onError': function(errorCode) {
              instance.media.onError(errorCode);
            }
          }
        });
      }
    }
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
 * Called when an error occurs.
 *
 * @param {string} errorCode The error that was triggered.
 */
minplayer.players.youtube.prototype.onError = function(errorCode) {
  this.trigger('error', errorCode);
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
    'origin': origin
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
 * @see minplayer.players.flash#getPlayerDuration.
 */
minplayer.players.youtube.prototype.getDuration = function(callback) {
  if (this.isReady()) {
    callback(this.player.getDuration());
  }
};

/**
 * @see minplayer.players.base#getPlayerCurrentTime
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
 * @param {function} ready Called when the player is ready.
 */
minplayer.players.vimeo = function(context, options, ready) {

  // Derive from players base.
  minplayer.players.base.call(this, context, options, ready);
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
    'portrait': 0
  });

  // Set the source of the iframe.
  iframe.setAttribute('src', src);

  // Now register this player when the froogaloop code is loaded.
  var _this = this;
  var check = setInterval(function() {
    if (window.Froogaloop) {
      clearInterval(check);
      _this.player = window.Froogaloop(iframe);
      _this.player.addEvent('ready', function() {
        _this.onReady();
      });
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
/** The minplayer namespace. */
var minplayer = minplayer || {};

/** Define the controllers object. */
minplayer.controllers = minplayer.controllers || {};

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
minplayer.controllers.base = function(context, options) {

  // Derive from display
  minplayer.display.call(this, context, options);
};

// Define the prototype for all controllers.
var controllersBase = minplayer.controllers.base;

/** Derive from minplayer.display. */
minplayer.controllers.base.prototype = new minplayer.display();

/** Reset the constructor. */
minplayer.controllers.base.prototype.constructor = minplayer.controllers.base;

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
minplayer.controllers.base.prototype.getElements = function() {
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
minplayer.controllers.base.prototype.construct = function() {

  // Call the minplayer plugin constructor.
  minplayer.display.prototype.construct.call(this);

  // Play or pause the player.
  function playPause(controller, state) {
    var type = state ? 'play' : 'pause';
    controller.display.trigger(type);
    controller.setPlayPause(state);
    if (controller.player) {
      controller.player[type]();
    }
  }

  // Trigger the controller events.
  if (this.elements.play) {
    this.elements.play.bind('click', {obj: this}, function(event) {
      event.preventDefault();
      playPause(event.data.obj, true);
    });
  }

  if (this.elements.pause) {
    this.elements.pause.bind('click', {obj: this}, function(event) {
      event.preventDefault();
      playPause(event.data.obj, false);
    });
  }

  // Fullscreen button.
  var _this = this, sliderOptions = {};
  if (this.elements.fullscreen) {
    this.elements.fullscreen.click(function() {
      var isFull = _this.elements.player.hasClass('fullscreen');
      if (isFull) {
        _this.elements.player.removeClass('fullscreen');
      }
      else {
        _this.elements.player.addClass('fullscreen');
      }
    }).css({'pointer' : 'hand'});
  }

  // Create the slider.
  this.dragging = false;

  // Add a seekBar and volumeBar using jQuery UI Slider.
  if (this.elements.seek) {
    this.seekBar = this.elements.seek.slider({range: 'min'});
  }
  if (this.elements.volume) {
    sliderOptions = {range: 'min', orientation: 'vertical'};
    this.volumeBar = this.elements.volume.slider(sliderOptions);
  }
};

/**
 * Sets the play and pause state of the control bar.
 *
 * @param {boolean} state TRUE - Show Play, FALSE - Show Pause.
 */
minplayer.controllers.base.prototype.setPlayPause = function(state) {
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
 * Sets the time string on the control bar.
 *
 * @param {string} element The name of the element to set.
 * @param {number} time The total time amount to set.
 */
minplayer.controllers.base.prototype.setTimeString = function(element, time) {
  if (this.elements[element]) {
    this.elements[element].text(minplayer.formatTime(time).time);
  }
};

/**
 * @see minplayer.plugin#setPlayer
 */
minplayer.controllers.base.prototype.setPlayer = function(player) {
  minplayer.display.prototype.setPlayer.call(this, player);

  var _this = this;

  // If they have a pause button, then bind to the pause event.
  if (this.elements.pause) {
    player.bind('pause', {obj: this}, function(event) {
      event.data.obj.setPlayPause(true);
    });
  }

  // If they have a play button, then bind to playing.
  if (this.elements.play) {
    player.bind('playing', {obj: this}, function(event) {
      event.data.obj.setPlayPause(false);
    });
  }

  // If they have a duration, then trigger on duration change.
  if (this.elements.duration) {

    // Bind to the duration change event.
    player.bind('durationchange', {obj: this}, function(event, data) {
      event.data.obj.setTimeString('duration', data.duration);
    });

    // Set the timestring to the duration.
    player.getDuration(function(duration) {
      _this.setTimeString('duration', duration);
    });
  }

  // If they have a progress, then bind to the progress.
  if (this.elements.progress) {
    player.bind('progress', {obj: this}, function(event, data) {
      var percent = data.total ? (data.loaded / data.total) * 100 : 0;
      _this.elements.progress.width(percent + '%');
    });
  }

  // If they have a seek bar or timer, bind to the timeupdate.
  if (this.seekBar || this.elements.timer) {
    player.bind('timeupdate', {obj: this}, function(event, data) {
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

  // Register the events for the control bar to control the media.
  if (this.seekBar) {
    this.seekBar.slider({
      start: function(event, ui) {
        _this.dragging = true;
      },
      stop: function(event, ui) {
        _this.dragging = false;
        player.getDuration(function(duration) {
          player.seek((ui.value / 100) * duration);
        });
      },
      slide: function(event, ui) {
        player.getDuration(function(duration) {
          var time = (ui.value / 100) * duration;
          if (!_this.dragging) {
            player.seek(time);
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
        player.setVolume(ui.value / 100);
      }
    });

    // Set the volume to match that of the player.
    player.getVolume(function(vol) {
      _this.volumeBar.slider('option', 'value', (vol * 100));
    });
  }
};
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
  minplayer.display.call(this, context, options);
};

// Extend the plugin prototype.
var templatesBase = minplayer.templates.base;

/** Derive from minplayer.templates.base. */
minplayer.templates.base.prototype = new minplayer.display();

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
