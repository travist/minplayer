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
    settings: {}
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
  if (typeof files === 'string') {
    return new minplayer.file({'path': files});
  }

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

  // Return the minplayer file.
  return mFile;
};

/**
 * Load a set of files or a single file for the media player.
 *
 * @param {array} files An array of files to chose from to load.
 */
minplayer.player.prototype.load = function(files) {

  // Get the best media file.
  var mFile = this.getMediaFile(files), id = '', pClass = '';

  // Only do something if we have a valid file.
  if (mFile) {

    // Only destroy if the current player is different than the new player.
    if (!this.media || (mFile.player.toString() !== this.currentPlayer)) {

      // Set the current media player.
      this.currentPlayer = mFile.player.toString();

      // Make sure the player has an option to cleanup.
      if (this.media) {
        this.media.destroy();
      }

      // Create a new media player for this file.
      if (this.elements.display) {
        pClass = minplayer.players[mFile.player];
        this.media = new pClass(this.elements.display, this.options, mFile);
      }

      // Iterate through all plugins and add the player to them.
      for (id in this.allPlugins) {
        if (this.allPlugins.hasOwnProperty(id)) {
          this.allPlugins[id].setPlayer(this.media);
        }
      }
    }

    // If the media exists, then load it.
    if (this.media) {

      // Now load this media.
      this.media.load(mFile);
    }
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
 * @return {number} The current volume level. 0 to 1.
 */
minplayer.player.prototype.getVolume = function() {
  return this.media ? this.media.getVolume() : 0;
};

/**
 * Get the current media duration.
 *
 * @return {number} The current media duration.
 */
minplayer.player.prototype.getDuration = function() {
  return this.media ? this.media.getDuration() : 0;
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
 * @see minplayer.plugin#construct
 */
minplayer.playLoader.base.prototype.construct = function() {

  // Call the minplayer plugin constructor.
  minplayer.display.prototype.construct.call(this);

  // Trigger a play event when someone clicks on the controller.
  if (this.elements.bigPlay) {
    this.elements.bigPlay.bind('click', {obj: this}, function(event) {
      event.preventDefault();
      jQuery(this).hide();
      if (event.data.obj.player) {
        event.data.obj.player.play();
      }
    });
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

/**
 * @see minplayer.plugin#setPlayer
 */
minplayer.playLoader.base.prototype.setPlayer = function(player) {
  minplayer.display.prototype.setPlayer.call(this, player);
  var _this = this;
  player.display.bind('loadstart', function(event) {
    _this.busy.setFlag('media', true);
    _this.bigPlay.setFlag('media', true);
    _this.checkVisibility();
  });
  player.display.bind('waiting', function(event) {
    _this.busy.setFlag('media', true);
    _this.checkVisibility();
  });
  player.display.bind('loadedmetadata', function(event) {
    _this.busy.setFlag('media', false);
    _this.checkVisibility();
  });
  player.display.bind('loadeddata', function(event) {
    _this.busy.setFlag('media', false);
    _this.checkVisibility();
  });
  player.display.bind('playing', function(event) {
    _this.busy.setFlag('media', false);
    _this.bigPlay.setFlag('media', false);
    _this.checkVisibility();
  });
  player.display.bind('pause', function(event) {
    _this.bigPlay.setFlag('media', true);
    _this.checkVisibility();
  });
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
 * @param {object} mediaFile The media file for this player.
 */
minplayer.players.base = function(context, options, mediaFile) {

  /** The currently loaded media file. */
  this.mediaFile = mediaFile;

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

  /**
   * Trigger a media event.
   * @this media.players.base.
   * @param {string} type The event type.
   * @param {object} data The event data object.
   */
  this.trigger = function(type, data) {
    this.display.trigger(type, data);
  };

  this.duration = 0;
  this.currentTime = 0;
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
  return null;
};

/**
 * Returns the media player object.
 *
 * @return {object} The media player object.
 */
minplayer.players.base.prototype.getPlayer = function() {
  return null;
};

/**
 * Destroy the media player instance from the DOM.
 */
minplayer.players.base.prototype.destroy = function() {
};

/**
 * Loads a new media player.
 *
 * @param {object} file A {@link minplayer.file} object.
 */
minplayer.players.base.prototype.load = function(file) {

  // Store the media file for future lookup.
  this.mediaFile = file;
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
 * @return {number} The volume of the media; 0 to 1.
 */
minplayer.players.base.prototype.getVolume = function() {
  return 0;
};

/**
 * Return the duration of the loaded media.
 *
 * @return {number} The duration of the loaded media.
 */
minplayer.players.base.prototype.getDuration = function() {
  return 0;
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
 * @param {object} mediaFile The media file for this player.
 */
minplayer.players.html5 = function(context, options, mediaFile) {

  // Derive players base.
  minplayer.players.base.call(this, context, options, mediaFile);
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
 * @param {object} file A {@link minplayer.file} object.
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

  // See if we are loaded.
  this.loaded = false;

  // Store the this pointer...
  var _this = this;

  // For the HTML5 player, we will just pass events along...
  if (this.player) {
    this.player.addEventListener('abort', function() {
      _this.trigger('abort');
    }, true);
    this.player.addEventListener('loadstart', function() {
      _this.trigger('loadstart');
    }, true);
    this.player.addEventListener('loadeddata', function() {
      _this.trigger('loadeddata');
    }, true);
    this.player.addEventListener('loadedmetadata', function() {
      _this.trigger('loadedmetadata');
    }, true);
    this.player.addEventListener('canplaythrough', function() {
      _this.trigger('canplaythrough');
    }, true);
    this.player.addEventListener('ended', function() {
      _this.trigger('ended');
    }, true);
    this.player.addEventListener('pause', function() {
      _this.trigger('pause');
    }, true);
    this.player.addEventListener('play', function() {
      _this.trigger('play');
    }, true);
    this.player.addEventListener('playing', function() {
      _this.trigger('playing');
    }, true);
    this.player.addEventListener('error', function() {
      _this.trigger('error');
    }, true);
    this.player.addEventListener('waiting', function() {
      _this.trigger('waiting');
    }, true);
    this.player.addEventListener('timeupdate', function(event) {
      var dur = this.duration;
      var cTime = this.currentTime;
      _this.duration = dur;
      _this.currentTime = cTime;
      _this.trigger('timeupdate', {currentTime: cTime, duration: dur});
    }, true);
    this.player.addEventListener('durationchange', function() {
      _this.duration = this.duration;
      _this.trigger('durationchange', {duration: this.duration});
    }, true);
    this.player.addEventListener('progress', function(event) {
      _this.trigger('progress', {loaded: event.loaded, total: event.total});
    }, true);

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
  // Always call the base first on load...
  minplayer.players.base.prototype.load.call(this, file);

  if (this.loaded) {
    // Change the source...
    var code = '<source src="' + file.path + '" ';
    code += 'type="' + file.mimetype + '"';
    code += file.codecs ? ' codecs="' + file.path + '">' : '>';
    this.options.elements.player.attr('src', '').empty().html(code);
  }

  // Set the loaded flag.
  this.loaded = true;
};

/**
 * @see minplayer.players.base#play
 */
minplayer.players.html5.prototype.play = function() {
  minplayer.players.base.prototype.play.call(this);
  this.player.play();
};

/**
 * @see minplayer.players.base#pause
 */
minplayer.players.html5.prototype.pause = function() {
  minplayer.players.base.prototype.pause.call(this);
  this.player.pause();
};

/**
 * @see minplayer.players.base#stop
 */
minplayer.players.html5.prototype.stop = function() {
  minplayer.players.base.prototype.stop.call(this);
  this.player.pause();
  this.player.src = '';
};

/**
 * @see minplayer.players.base#seek
 */
minplayer.players.html5.prototype.seek = function(pos) {
  minplayer.players.base.prototype.seek.call(this, pos);
  this.player.currentTime = pos;
};

/**
 * @see minplayer.players.base#setVolume
 */
minplayer.players.html5.prototype.setVolume = function(vol) {
  minplayer.players.base.prototype.setVolume.call(this, vol);
  this.player.volume = vol;
};

/**
 * @see minplayer.players.base#getVolume
 * @return {number} The volume of the media; 0 to 1.
 */
minplayer.players.html5.prototype.getVolume = function() {
  return this.player.volume;
};

/**
 * @see minplayer.players.base#getDuration
 * @return {number} The duration of the loaded media.
 */
minplayer.players.html5.prototype.getDuration = function() {
  var dur = this.player.duration;
  return (dur === Infinity) ? 0 : dur;
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
 * @param {object} mediaFile The media file for this player.
 */
minplayer.players.flash = function(context, options, mediaFile) {

  this.durationInterval = null;
  this.mediaInterval = null;
  this.duration = 0;
  this.ready = false;

  // Derive from players base.
  minplayer.players.base.call(this, context, options, mediaFile);
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
 * @param {object} file A {@link minplayer.file} object.
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
 * Called when the player is ready.
 */
minplayer.players.flash.prototype.onReady = function() {
  var _this = this;
  this.ready = true;
  this.trigger('loadstart');

  // Perform a check for the duration every second until it shows up.
  this.durationInterval = setInterval(function() {
    if (_this.getDuration()) {
      clearInterval(_this.durationInterval);
      _this.trigger('durationchange', {duration: _this.getDuration()});
    }
  }, 1000);
};

/**
 * Should be called when the media is playing.
 */
minplayer.players.flash.prototype.onPlaying = function() {
  var _this = this;
  this.trigger('playing');
  this.mediaInterval = setInterval(function() {
    var cTime = _this.getCurrentTime();
    var dur = _this.getDuration();
    var data = {currentTime: cTime, duration: dur};
    _this.trigger('timeupdate', data);
  }, 1000);
};

/**
 * Should be called when the minplayer is paused.
 */
minplayer.players.flash.prototype.onPaused = function() {
  this.trigger('pause');
  clearInterval(this.minplayerInterval);
};

/**
 * Should be called when the meta data has finished loading.
 */
minplayer.players.flash.prototype.onMeta = function() {
  clearInterval(this.durationInterval);
  this.trigger('loadeddata');
  this.trigger('loadedmetadata');
  this.trigger('durationchange', {duration: this.getDuration()});
};

/**
 * Reset the flash player variables.
 */
minplayer.players.flash.prototype.reset = function() {
  this.ready = false;
  this.duration = 0;
};

/**
 * @see minplayer.players.base#destroy
 */
minplayer.players.flash.prototype.destroy = function() {
  this.reset();
};

/**
 * @see minplayer.players.base#playerFound
 * @return {boolean} TRUE - if the player is in the DOM, FALSE otherwise.
 */
minplayer.players.flash.prototype.playerFound = function() {
  return (this.display.find('object[playerType="flash"]').length > 0);
};

/**
 * @see minplayer.players.base#create
 * @return {object} The media player entity.
 */
minplayer.players.flash.prototype.create = function() {
  // Reset the variables.
  this.reset();
  return null;
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

/**
 * @see minplayer.players.base#load
 */
minplayer.players.flash.prototype.load = function(file) {
  this.duration = 0;
  minplayer.players.base.prototype.load.call(this, file);
};

/**
 * Return the player time duration.
 *
 * @return {int} The player duration.
 */
minplayer.players.flash.prototype.getPlayerDuration = function() {
  return 0;
};

/**
 * @see minplayer.players.base#getDuration
 * @return {number} The duration of the loaded media.
 */
minplayer.players.flash.prototype.getDuration = function() {

  // Make sure to cache the duration since it is called often.
  if (this.duration) {
    return this.duration;
  }
  else if (this.isReady()) {
    this.duration = this.getPlayerDuration();
    return this.duration;
  }
  else {
    return minplayer.players.base.prototype.getDuration.call(this);
  }
};

/**
 * @see minplayer.players.base#isReady
 * @return {boolean} Checks to see if the Flash is ready.
 */
minplayer.players.flash.prototype.isReady = function() {
  return (this.player && this.ready);
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
 * @param {object} mediaFile The media file for this player.
 */
minplayer.players.minplayer = function(context, options, mediaFile) {

  // Called when the flash provides a media update.
  this.onMediaUpdate = function(eventType) {
    if (this.ready) {
      switch (eventType) {
        case 'mediaMeta':
          minplayer.players.flash.prototype.onMeta.call(this);
          break;
        case 'mediaPlaying':
          minplayer.players.flash.prototype.onPlaying.call(this);
          break;
        case 'mediaPaused':
          minplayer.players.flash.prototype.onPaused.call(this);
          break;
      }
    }
  };

  // Derive from players flash.
  minplayer.players.flash.call(this, context, options, mediaFile);
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
 * @param {object} file A {@link minplayer.file} object.
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
 * @see minplayer.players.base#load
 */
minplayer.players.minplayer.prototype.load = function(file) {
  minplayer.players.flash.prototype.load.call(this, file);
  if (this.isReady()) {
    this.player.loadMedia(this.mediaFile.path, this.mediaFile.stream);
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
 * @return {number} The volume of the media; 0 to 1.
 */
minplayer.players.minplayer.prototype.getVolume = function() {
  if (this.isReady()) {
    return this.player.getVolume();
  }
  else {
    return minplayer.players.flash.prototype.getVolume.call(this);
  }
};

/**
 * @see minplayer.players.flash#getPlayerDuration
 * @return {int} The player duration.
 */
minplayer.players.minplayer.prototype.getPlayerDuration = function() {
  return this.isReady() ? this.player.getDuration() : 0;
};

/**
 * @see minplayer.players.base#getCurrentTime
 * @return {number} The current playhead time.
 */
minplayer.players.minplayer.prototype.getCurrentTime = function() {
  return this.isReady() ? this.player.getCurrentTime() : 0;
};

/**
 * @see minplayer.players.base#getBytesLoaded
 * @return {number} Returns the bytes loaded from the media.
 */
minplayer.players.minplayer.prototype.getBytesLoaded = function() {
  return this.isReady() ? this.player.getMediaBytesLoaded() : 0;
};

/**
 * @see minplayer.players.base#getBytesTotal.
 * @return {number} The total number of bytes of the loaded media.
 */
minplayer.players.minplayer.prototype.getBytesTotal = function() {
  return this.isReady() ? this.player.getMediaBytesTotal() : 0;
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
 * @param {object} mediaFile The media file for this player.
 */
minplayer.players.youtube = function(context, options, mediaFile) {

  // Derive from players flash.
  minplayer.players.flash.call(this, context, options, mediaFile);

  /** The quality of the YouTube stream. */
  this.quality = 'default';
};

/** Derive from minplayer.players.flash. */
minplayer.players.youtube.prototype = new minplayer.players.flash();

/** Reset the constructor. */
minplayer.players.youtube.prototype.constructor = minplayer.players.youtube;

/**
 * Called when the YouTube player is ready.
 *
 * @param {string} id The media player ID.
 */
window.onYouTubePlayerReady = function(id) {
  if (minplayer.player[id]) {
    minplayer.player[id].media.onReady();
  }
};

/**
 * @see minplayer.plugin.construct
 */
minplayer.players.youtube.prototype.construct = function() {

  // Call flash constructor.
  minplayer.players.flash.prototype.construct.call(this);

  // Translates the player state for the YouTube API player.
  this.getPlayerState = function(playerState) {
    switch (playerState) {
      case 5:
        return 'ready';
      case 3:
        return 'waiting';
      case 2:
        return 'pause';
      case 1:
        return 'play';
      case 0:
        return 'ended';
      case -1:
        return 'abort';
      default:
        return 'unknown';
    }
  };

  // Create our callback functions.
  var _this = this;
  window[this.options.id + 'StateChange'] = function(newState) {
    _this.trigger(_this.getPlayerState(newState));
  };

  window[this.options.id + 'PlayerError'] = function(errorCode) {
    _this.trigger('error', errorCode);
  };

  window[this.options.id + 'QualityChange'] = function(newQuality) {
    _this.quality = newQuality;
  };

  // Add our event listeners.
  if (this.player) {
    var onStateChange = this.options.id + 'StateChange';
    var onError = this.options.id + 'PlayerError';
    var onQuality = this.options.id + 'QualityChange';
    this.player.addEventListener('onStateChange', onStateChange);
    this.player.addEventListener('onError', onError);
    this.player.addEventListener('onPlaybackQualityChange', onQuality);
  }
};

/**
 * @see minplayer.players.base#getPriority
 * @return {number} The priority of this media player.
 */
minplayer.players.youtube.getPriority = function() {
  return 10;
};

/**
 * @see minplayer.players.base#canPlay
 * @param {object} file A {@link minplayer.file} object.
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
 * @see minplayer.players.base#create
 * @return {object} The media player entity.
 */
minplayer.players.youtube.prototype.create = function() {

  minplayer.players.base.prototype.flash.call(this);

  // The flash variables for this flash player.
  var flashVars = {
    'file': this.mediaFile.path,
    'autostart': this.options.settings.autoplay
  };

  // Return a flash media player object.
  var rand = Math.floor(Math.random() * 1000000);
  var flashPlayer = 'http://www.youtube.com/apiplayer?rand=' + rand;
  flashPlayer += '&amp;version=3&amp;enablejsapi=1&amp;playerapiid=';
  flashPlayer += this.options.id;
  return minplayer.players.flash.getFlash({
    swf: flashPlayer,
    id: this.options.id + '_player',
    playerType: 'flash',
    width: this.options.settings.width,
    height: '100%',
    flashvars: flashVars,
    wmode: this.options.wmode
  });
};

/**
 * Return the Regular Expression to find a YouTube ID.
 *
 * @return {RegEx} A regular expression to find a YouTube ID.
 */
minplayer.players.youtube.prototype.regex = function() {
  return /^http[s]?\:\/\/(www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9]+)/i;
};

/**
 * @see minplayer.players.base#load
 */
minplayer.players.youtube.prototype.load = function(file) {
  minplayer.players.flash.prototype.load.call(this, file);
  if (this.isReady()) {
    var regex = this.regex();
    var id = '';
    if (this.mediaFile.path.search(regex) === 0) {
      id = this.mediaFile.path.replace(regex, '$2');
    }
    else {
      id = this.mediaFile.path;
    }
    this.player.loadVideoById(id, 0, this.quality);
  }
};

/**
 * @see minplayer.players.base#play
 */
minplayer.players.youtube.prototype.play = function() {
  minplayer.players.flash.prototype.play.call(this);
  if (this.isReady()) {
    this.player.playVideo();
  }
};

/**
 * @see minplayer.players.base#pause
 */
minplayer.players.youtube.prototype.pause = function() {
  minplayer.players.flash.prototype.pause.call(this);
  if (this.isReady()) {
    this.player.pauseVideo();
  }
};

/**
 * @see minplayer.players.base#stop
 */
minplayer.players.youtube.prototype.stop = function() {
  minplayer.players.flash.prototype.stop.call(this);
  if (this.isReady()) {
    this.player.stopVideo();
  }
};

/**
 * @see minplayer.players.base#seek
 */
minplayer.players.youtube.prototype.seek = function(pos) {
  minplayer.players.flash.prototype.seek.call(this, pos);
  if (this.isReady()) {
    this.player.seekTo(pos, true);
  }
};

/**
 * @see minplayer.players.base#setVolume
 */
minplayer.players.youtube.prototype.setVolume = function(vol) {
  minplayer.players.flash.prototype.setVolume.call(this, vol);
  if (this.isReady()) {
    this.player.setVolume(vol * 100);
  }
};

/**
 * @see minplayer.players.base#getVolume
 * @return {number} The volume of the media; 0 to 1.
 */
minplayer.players.youtube.prototype.getVolume = function() {
  if (this.isReady()) {
    return (this.player.getVolume() / 100);
  }
  else {
    return minplayer.players.flash.prototype.getVolume.call(this);
  }
};

/**
 * @see minplayer.players.flash#getPlayerDuration.
 * @return {int} The player duration.
 */
minplayer.players.youtube.prototype.getPlayerDuration = function() {
  return this.isReady() ? this.player.getDuration() : 0;
};

/**
 * @see minplayer.players.base#getCurrentTime
 * @return {number} The current playhead time.
 */
minplayer.players.youtube.prototype.getCurrentTime = function() {
  return this.isReady() ? this.player.getCurrentTime() : 0;
};

/**
 * @see minplayer.players.base#getBytesLoaded.
 * @return {number} Returns the bytes loaded from the media.
 */
minplayer.players.youtube.prototype.getBytesLoaded = function() {
  return this.isReady() ? this.player.getVideoBytesLoaded() : 0;
};

/**
 * @see minplayer.players.base#getBytesTotal.
 * @return {number} The total number of bytes of the loaded media.
 */
minplayer.players.youtube.prototype.getBytesTotal = function() {
  return this.isReady() ? this.player.getVideoBytesTotal() : 0;
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
  player.display.bind('pause', {obj: this}, function(event) {
    event.data.obj.setPlayPause(true);
    clearInterval(event.data.obj.interval);
  });
  player.display.bind('playing', {obj: this}, function(event) {
    event.data.obj.setPlayPause(false);
  });
  player.display.bind('durationchange', {obj: this}, function(event, data) {
    event.data.obj.setTimeString('duration', data.duration);
  });
  player.display.bind('timeupdate', {obj: this}, function(event, data) {
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

  // Register the events for the control bar to control the media.
  if (this.seekBar) {
    var _this = this;
    this.seekBar.slider({
      start: function(event, ui) {
        _this.dragging = true;
      },
      stop: function(event, ui) {
        _this.dragging = false;
        var time = (ui.value / 100) * player.getDuration();
        player.seek(time);
      },
      slide: function(event, ui) {
        var time = (ui.value / 100) * player.getDuration();
        if (!_this.dragging) {
          player.seek(time);
        }

        _this.setTimeString('timer', time);
      }
    });
  }

  // Register the volume bar to adjust the player volume.
  player.setVolume(this.options.volume / 100);

  // Setup the volume bar.
  if (this.volumeBar) {
    this.volumeBar.slider('option', 'value', this.options.volume);
    this.volumeBar.slider({
      slide: function(event, ui) {
        player.setVolume(ui.value / 100);
      }
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
