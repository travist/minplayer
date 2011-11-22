/** The Drupal namespace. */
Drupal.media = Drupal.media || {};
(function($, media) {

  // Add a way to instanciate using jQuery prototype.
  if (!$.fn.mediaplayer) {
    $.fn.mediaplayer = function(options) {
      return $(this).each(function() {
        if (!media.player[$(this).selector]) {
          new media.player($(this), options);
        }
      });
    };
  }

  /**
   * @class The core media player class which governs the media player
   * functionality.
   *
   * <p><strong>Usage:</strong>
   * <pre><code>
   *
   *   // Create a media player.
   *   var player = $("#player").mediaplayer({
   *
   *   });
   *
   * </code></pre>
   * </p>
   *
   * @extends media.display
   * @param {object} context The jQuery context.
   * @param {object} options This components options.
   */
  media.player = function(context, options) {

    // Make sure we provide default options...
    options = $.extend({
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
    media.player[options.id] = this;

    // Derive from display
    media.display.call(this, context, options);
  };

  /**
   * Define the media player interface.
   */
  media.player.prototype = new media.display();
  media.player.prototype.constructor = media.player;

  /**
   * @see media.plugin.construct
   */
  media.player.prototype.construct = function() {

    // Call the media display constructor.
    media.display.prototype.construct.call(this);

    // Store the this pointer for callbacks.
    var pluginInfo = {};
    var plugin = null;
    var pluginContext = null;
    var i = media.plugins.length;
    var _files = [];
    var mediaSrc = null;

    /** The current player. */
    this.media = null;

    /** All of the plugin objects. */
    this.allPlugins = {};

    // Iterate through all of our plugins and add them to our plugins array.
    while (i--) {
      pluginInfo = media.plugins[i];
      if (pluginInfo.element) {
        pluginContext = $(pluginInfo.element, this.display);
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
      $('source', this.elements.media).each(function() {
        _files.push({
          'path': $(this).attr('src'),
          'mimetype': $(this).attr('type'),
          'codecs': $(this).attr('codecs')
        });
      });
    }

    // Add key events to the window.
    $(window).bind('keyup', {obj: this}, function(event) {
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
  media.player.prototype.getMediaFile = function(files) {
    if (typeof files === 'string') {
      return new media.file({'path': files});
    }

    if (files.path) {
      return new media.file(files);
    }

    // Add the files and get the best player to play.
    var i = files.length, bestPriority = 0, mFile = null, file = null;
    while (i--) {
      file = files[i];

      // Get the media file object.
      if (typeof file === 'string') {
        file = new media.file({'path': file});
      }
      else {
        file = new media.file(file);
      }

      // Determine the best file for this browser.
      if (file.priority > bestPriority) {
        mFile = file;
      }
    }

    // Return the media file.
    return mFile;
  };

  /**
   * Load a set of files or a single file for the media player.
   *
   * @param {array} files An array of files to chose from to load.
   */
  media.player.prototype.load = function(files) {

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
          pClass = media.players[mFile.player];
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
  media.player.prototype.addPlugin = function(id, plugin) {

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
  media.player.prototype.getPlugin = function(id) {
    return this.allPlugins[id];
  };

  /**
   * Play the currently loaded media file.  Use load first to load a
   * media file into the media player.
   */
  media.player.prototype.play = function() {
    if (this.media) {
      this.media.play();
    }
  };

  /**
   * Pause the media.
   */
  media.player.prototype.pause = function() {
    if (this.media) {
      this.media.pause();
    }
  };

  /**
   * Stop the media.
   */
  media.player.prototype.stop = function() {
    if (this.media) {
      this.media.stop();
    }
  };

  /**
   * Seek the media to the provided position.
   *
   * @param {number} pos The position to seek.  0 to 1.
   */
  media.player.prototype.seek = function(pos) {
    if (this.media) {
      this.media.seek(pos);
    }
  };

  /**
   * Set the volume of the media being played.
   *
   * @param {number} vol The volume to set.  0 to 1.
   */
  media.player.prototype.setVolume = function(vol) {
    if (this.media) {
      this.media.setVolume(vol);
    }
  };

  /**
   * Get the current volume setting.
   *
   * @return {number} The current volume level. 0 to 1.
   */
  media.player.prototype.getVolume = function() {
    return this.media ? this.media.getVolume() : 0;
  };

  /**
   * Get the current media duration.
   *
   * @return {number} The current media duration.
   */
  media.player.prototype.getDuration = function() {
    return this.media ? this.media.getDuration() : 0;
  };
}(jQuery, Drupal.media));
