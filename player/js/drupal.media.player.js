Drupal.media = Drupal.media ? Drupal.media : {};
(function($, media) {

  /**
   * Constructor for the media.player
   */
  media.player = function( context, options ) {

    // Make sure we provide default options...
    options = jQuery.extend({
      controller:"default",
      template:"default",
      id:"player",
      volume:80,
      swfplayer:"",
      wmode:"transparent",
      attributes:{},
      settings:{},
      debug:false
    }, options);

    // Set the player item.
    options.player = this;

    // Derive from display
    media.display.call(this, context, options);
  };

  /**
   * Define the media player interface.
   */
  media.player.prototype = new media.display();
  media.player.prototype.constructor = media.player;
  media.player.prototype = jQuery.extend(media.player.prototype, {

    // Constructor
    construct: function() {

      // Call the media display constructor.
      media.display.prototype.construct.call(this);

      // Store the this pointer for callbacks.
      var _this = this;

      // Store this player in global scope so that it can be accessed by outside libraries.
      media.player[this.options.id] = this;

      // The current player.
      this.media = null;

      // All of the plugin objects.
      this.plugins = {};

      // Iterate through all of our plugins and add them to our plugins array.
      var plugin = {};
      var pluginContext = null;
      var i = media.plugins.length;
      while (i--) {
        plugin = media.plugins[i];
        pluginContext = plugin.element ? jQuery(plugin.element, this.display) : this.display;
        this.addPlugin(plugin.id, new plugin.object(pluginContext, this.options));
      }

      // Variable to store the current media file.
      this.mediaFile = {player:"html5"};

      // Get the files involved...
      var _files = [];
      if (this.options.elements.player) {
        var mediaSrc = this.options.elements.player.attr('src');
        if (mediaSrc) {
          _files.push({"path":mediaSrc});
        }
        $("source", this.options.elements.player).each(function() {
          _files.push({
            "path":$(this).attr('src'),
            "mimetype":$(this).attr('type'),
            "codecs":$(this).attr('codecs')
          });
        });
      }

      // Now load these files.
      this.load(_files);
    },

    // Returns the best media file to play given a list of files.
    getMediaFile: function(files) {
      if (typeof files == 'string') {
        return new media.file({"path":files});
      }

      if (files.path) {
        return new media.file(files);
      }

      // Add the files and get the best player to play.
      var i=files.length;
      var bestPriority = 0;
      var mediaFile = null;
      var file = null;
      while(i--) {
        file = files[i];

        // Get the media file object.
        file = (typeof file == 'string') ? new media.file({"path":file}) : new media.file(file);

        // Determine the best file for this browser.
        if (file.priority > bestPriority) {
          mediaFile = file;
        }
      }

      // Return the media file.
      return mediaFile;
    },

    // Load a set of files or a single file for the media player.
    load:function(files) {

      // Get the current media player.
      var currentPlayer = this.mediaFile.player;

      // Get the best media file.
      this.mediaFile = this.getMediaFile(files);

      // Only destroy if the current player is different than the new player.
      if (!this.media || (this.mediaFile.player != currentPlayer)) {

        // Make sure the player has an option to cleanup.
        if (this.media) {
          this.media.destroy();
        }

        // Create a new media player for this file.
        if (this.options.elements.display) {
          this.media = new media.players[this.mediaFile.player](this.options.elements.display, this.options, this.mediaFile);
        }

        // Iterate through all plugins and add the player to them.
        var id = "";
        for (id in this.plugins) {
          if (this.plugins.hasOwnProperty(id)) {
            this.plugins[id].setPlayer(this.media);
          }
        }
      }

      if (this.media) {
        // Now load this media.
        this.media.load(this.mediaFile);
      }
    },

    // Allow multiple plugins.
    addPlugin: function(id, plugin) {

      // Only continue if the plugin exists.
      if (plugin.isValid()) {

        // Add to plugins.
        this.plugins[id] = plugin;
      }
    },
    getPlugin: function(id) {
      return this.plugins[id];
    },
    play: function() {
      if( this.media ) {
        this.media.play();
      }
    },
    pause: function() {
      if( this.media ) {
        this.media.pause();
      }
    },
    stop: function() {
      if( this.media ) {
        this.media.stop();
      }
    },
    seek: function( pos ) {
      if( this.media ) {
        this.media.seek(pos);
      }
    },
    setVolume: function( vol ) {
      if( this.media ) {
        this.media.setVolume( vol );
      }
    },
    getVolume: function() {
      return this.media ? this.media.getVolume() : 0;
    },
    getDuration: function() {
      return this.media ? this.media.getDuration() : 0;
    }
  });
})(jQuery, Drupal.media);
