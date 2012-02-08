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
    file: null,
    preview: ''
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

    // Get the poster image.
    if (!this.options.preview) {
      this.options.preview = this.elements.media.attr('poster');
    }

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

    var _this = this;

    // Get the class name and create the new player.
    pClass = minplayer.players[this.options.file.player];

    // Create the new media player.
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
