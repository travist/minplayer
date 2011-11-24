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

  // Store the this pointer for callbacks.
  var pluginInfo = {};
  var plugin = null;
  var pluginContext = null;
  var i = minplayer.plugins.length;
  var _files = [];
  var mediaSrc = null;

  /** The current player. */
  this.media = null;

  /** All of the plugin objects. */
  this.allPlugins = {};

  // Iterate through all of our plugins and add them to our plugins array.
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

  /** Variable to store the current media player. */
  this.currentPlayer = 'html5';

  // Get the files involved...
  if (this.elements.media) {
    mediaSrc = this.elements.media.attr('src');
    if (mediaSrc) {
      _files.push({'path': mediaSrc});
    }
    jQuery('source', this.elements.media).each(function() {
      _files.push({
        'path': jQuery(this).attr('src'),
        'mimetype': jQuery(this).attr('type'),
        'codecs': jQuery(this).attr('codecs')
      });
    });
  }

  // Add key events to the window.
  jQuery(window).bind('keyup', {obj: this}, function(event) {
    // Escape out of fullscreen if they press ESC or Q.
    var isFull = event.data.obj.display.hasClass('fullscreen');
    if (isFull && (event.keyCode === 113 || event.keyCode === 27)) {
      event.data.obj.display.removeClass('fullscreen');
    }
  });

  // Now load these files.
  this.load(_files);
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
