/**
 * Drupal.media.compatibility
 *
 * This class is used to define the types of media that can be played within the
 * browser.
 *
 * Usage:
 *
 *   if (Drupal.media.playTypes.videoOGG) {
 *     console.log("This browser can play OGG video");
 *   }
 *
 *   if (Drupal.media.playTypes.videoH264) {
 *     console.log("This browser can play H264 video");
 *   }
 *
 *   if (Drupal.media.playTypes.videoWEBM) {
 *     console.log("This browser can play WebM video");
 *   }
 *
 *   if (Drupal.media.playTypes.audioOGG) {
 *     console.log("This browser can play OGG audio");
 *   }
 *
 *   if (Drupal.media.playTypes.audioMP3) {
 *     console.log("This browser can play MP3 audio");
 *   }
 *
 *   if (Drupal.media.audioMP4) {
 *     console.log("This browser can play MP4 audio");
 *   }
 */
Drupal.media = Drupal.media || {};
(function(media) {

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

  // Private function to get the playtypes.
  function getPlayTypes() {
    var types = {}, elem = null;

    // Check for video types...
    elem = document.createElement('video');
    types.videoOGG = checkPlayType(elem, 'video/ogg');
    types.videoH264 = checkPlayType(elem, 'video/mp4');
    types.videoWEBM = checkPlayType(elem, 'video/x-webm');

    // Now check for audio types...
    elem = document.createElement('audio');
    types.audioOGG = checkPlayType(elem, 'audio/ogg');
    types.audioMP3 = checkPlayType(elem, 'audio/mpeg');
    types.audioMP4 = checkPlayType(elem, 'audio/mp4');

    return types;
  }

  // If the playTypes have not yet been determined, do so on script load.
  if (!media.playTypes) {
    media.playTypes = getPlayTypes();
  }
}(Drupal.media));
/**
 * Drupal.media.flags - This is a class used to keep track of flag states
 * which is used to control the busy cursor, big play button, among other
 * items in which multiple components can have an interest in hiding or showing
 * a single element on the screen.
 *
 * Usage:
 *
 *   // Declare a flags variable.
 *   var flags = new Drupal.media.flags();
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
 */
Drupal.media = Drupal.media || {};
(function($, media) {

  // constructor.
  media.flags = function() {

    // The flag.
    this.flag = 0;

    // Id map to reference id with the flag index.
    this.ids = {};

    // The number of flags.
    this.numFlags = 0;
  };

  // Define the prototype.
  media.flags.prototype = jQuery.extend(media.flags.prototype, {

    /**
     * Sets a flag based on boolean logic operators.
     *
     * @param {string} id The id of the controller interested in this flag.
     * @param {boolean} value The value of this flag ( true or false ).
     */
    setFlag: function(id, value) {

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
    }
  });
}(jQuery, Drupal.media));
/**
 * The base class for all plugins.
 */
Drupal.media = Drupal.media || {};
(function($, media) {

  /**
   * @constructor
   */
  media.plugin = function(context, options) {

    // The media player.
    this.player = null;

    // Only call the constructor if we have a context.
    if (context) {
      this.construct();
    }
  };

  // Define the prototype for all controllers.
  media.plugin.prototype = jQuery.extend(media.plugin.prototype, {

    /**
     * The constructor which is called once the context is set.
     * Any class deriving from the plugin class should place all context
     * dependant functionality within this function instead of the standard
     * constructor function since it is called on object derivation as well
     * as object creation.
     */
    construct: function() {},

    /**
     * Sets the current media player.
     *
     * @param {object} player The current media player.
     */
    setPlayer: function(player) {
      this.player = player;
    }
  });
}(jQuery, Drupal.media));
/**
 * Drupal.media.display
 *
 * Base class used to provide the display and options for any component
 * deriving from this class.  Components who derive are expected to provide
 * the elements that they define by implementing the getElements method.
 */
Drupal.media = Drupal.media || {};
(function($, media) {

  /**
   * @constructor
   * @extends media.plugin
   * @param {object} context The jQuery context this component resides.
   * @param {object} options The options for this component.
   */
  media.display = function(context, options) {

    if (context) {

      // Set the display and options.
      this.display = $(context);
      this.options = options;

      // Extend all display elements.
      this.options.elements = this.options.elements || {};
      jQuery.extend(this.options.elements, this.getElements());
      this.elements = this.options.elements;
    }

    // Derive from plugin
    media.plugin.call(this, context, options);
  };

  // Define the prototype for all controllers.
  media.display.prototype = new media.plugin();
  media.display.prototype.constructor = media.display;
  media.display.prototype = jQuery.extend(media.display.prototype, {

    /**
     * Returns all the jQuery elements that this component uses.
     *
     * @return {object} An object which defines all the jQuery elements that
     * this component uses.
     */
    getElements: function() { return {}; },

    /**
     * Returns if this component is valid and exists within the DOM.
     *
     * @return {boolean} TRUE if the plugin display is valid.
     */
    isValid: function() {
      return (this.display.length > 0);
    }
  });
}(jQuery, Drupal.media));
/**
 * The core media player class which governs the media player functionality.
 */
Drupal.media = Drupal.media || {};
(function($, media) {

  /**
   * Define a way to instanciate a player using the jQuery method.
   *
   * @param {object} options The options for this media player.
   */
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
   * @constructor
   * @extends media.display
   * @param {object} context The jQuery context.
   * @param {object} options This components options.
   */
  media.player = function(context, options) {

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

    // Set the player item.
    options.player = this;

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
  media.player.prototype = jQuery.extend(media.player.prototype, {

    /**
     * @see media.plugin.construct
     */
    construct: function() {

      // Call the media display constructor.
      media.display.prototype.construct.call(this);

      // Store the this pointer for callbacks.
      var pluginInfo = {};
      var plugin = null;
      var pluginContext = null;
      var i = media.plugins.length;
      var _files = [];
      var mediaSrc = null;

      // The current player.
      this.media = null;

      // All of the plugin objects.
      this.allPlugins = {};

      // Iterate through all of our plugins and add them to our plugins array.
      while (i--) {
        pluginInfo = media.plugins[i];
        if (pluginInfo.element) {
          pluginContext = jQuery(pluginInfo.element, this.display);
        }
        else {
          pluginContext = this.display;
        }
        plugin = new pluginInfo.object(pluginContext, this.options);
        this.addPlugin(pluginInfo.id, plugin);
      }

      // Variable to store the current media player.
      this.currentPlayer = 'html5';

      // Get the files involved...
      if (this.elements.player) {
        mediaSrc = this.elements.player.attr('src');
        if (mediaSrc) {
          _files.push({'path': mediaSrc});
        }
        $('source', this.elements.player).each(function() {
          _files.push({
            'path': $(this).attr('src'),
            'mimetype': $(this).attr('type'),
            'codecs': $(this).attr('codecs')
          });
        });
      }

      // Now load these files.
      this.load(_files);
    },

    /**
     * Returns the full media player object.
     * @param {array} files An array of files to chose from.
     * @return {object} The best media file to play in the current browser.
     */
    getMediaFile: function(files) {
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
    },

    /**
     * Load a set of files or a single file for the media player.
     *
     * @param {array} files An array of files to chose from to load.
     */
    load: function(files) {

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
    },

    /**
     * Add a new plugin to the media player.
     *
     * @param {string} id The plugin ID.
     * @param {object} plugin A new plugin object, derived from media.plugin.
     */
    addPlugin: function(id, plugin) {

      // Only continue if the plugin exists.
      if (plugin.isValid()) {

        // Add to plugins.
        this.allPlugins[id] = plugin;
      }
    },

    /**
     * Returns a plugin provided a plugin ID.
     *
     * @param {string} id The plugin ID to retrieve.
     * @return {object} The plugin matching the provided ID.
     */
    getPlugin: function(id) {
      return this.allPlugins[id];
    },

    /**
     * Play the currently loaded media file.  Use load first to load a
     * media file into the media player.
     */
    play: function() {
      if (this.media) {
        this.media.play();
      }
    },

    /**
     * Pause the media.
     */
    pause: function() {
      if (this.media) {
        this.media.pause();
      }
    },

    /**
     * Stop the media.
     */
    stop: function() {
      if (this.media) {
        this.media.stop();
      }
    },

    /**
     * Seek the media to the provided position.
     *
     * @param {number} pos The position to seek.  0 to 1.
     */
    seek: function(pos) {
      if (this.media) {
        this.media.seek(pos);
      }
    },

    /**
     * Set the volume of the media being played.
     *
     * @param {number} vol The volume to set.  0 to 1.
     */
    setVolume: function(vol) {
      if (this.media) {
        this.media.setVolume(vol);
      }
    },

    /**
     * Get the current volume setting.
     *
     * @return {number} The current volume level. 0 to 1.
     */
    getVolume: function() {
      return this.media ? this.media.getVolume() : 0;
    },

    /**
     * Get the current media duration.
     *
     * @return {number} The current media duration.
     */
    getDuration: function() {
      return this.media ? this.media.getDuration() : 0;
    }
  });
}(jQuery, Drupal.media));
/**
 * Drupal.media.file
 *
 * A wrapper class used to provide all the data necessary to control an
 * individual file within this media player.
 */
Drupal.media = Drupal.media || {};
(function(media) {

  /**
   * @constructor
   * @param {object} file A media file object with minimal required information.
   */
  media.file = function(file) {
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

  media.file.prototype = jQuery.extend(media.file.prototype, {

    /**
     * Returns the best player for the job.
     *
     * @return {string} The best player to play the media file.
     */
    getBestPlayer: function() {
      var bestplayer = null, bestpriority = 0, _this = this;
      jQuery.each(media.players, function(name, player) {
        var priority = player.getPriority();
        if (player.canPlay(_this) && (priority > bestpriority)) {
          bestplayer = name;
          bestpriority = priority;
        }
      });
      return bestplayer;
    },

    /**
     * The priority of this file is determined by the priority of the best
     * player multiplied by the priority of the mimetype.
     *
     * @return {integer} The priority of the media file.
     */
    getPriority: function() {
      var priority = 1;
      if (this.player) {
        priority = media.players[this.player].getPriority();
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
    },

    /**
     * Returns the file extension of the file path.
     *
     * @return {string} The file extension.
     */
    getFileExtension: function() {
      return this.path.substring(this.path.lastIndexOf('.') + 1).toLowerCase();
    },

    /**
     * Returns the proper mimetype based off of the extension.
     *
     * @return {string} The mimetype of the file based off of extension.
     */
    getMimeType: function() {
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
    },

    /**
     * The type of media this is: video or audio.
     *
     * @return {string} "video" or "audio" based on what the type of media this
     * is.
     */
    getType: function() {
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
    }
  });
}(Drupal.media));


/**
 * The play loader base class, which is used to control the busy cursor, big
 * play button, and the opaque background which shows when the player is paused.
 */
Drupal.media = Drupal.media || {};
(function($, media) {

  // Define the busy object.
  media.playLoader = media.playLoader || {};

  /**
   * @constructor
   * @extends media.display
   * @param {object} context The jQuery context.
   * @param {object} options This components options.
   */
  media.playLoader.base = function(context, options) {

    // Define the flags that control the busy cursor.
    this.busy = new media.flags();

    // Define the flags that control the big play button.
    this.bigPlay = new media.flags();

    // Derive from display
    media.display.call(this, context, options);
  };

  // Define the prototype for all controllers.
  var playLoaderBase = media.playLoader.base;
  playLoaderBase.prototype = new media.display();
  playLoaderBase.prototype.constructor = playLoaderBase;
  playLoaderBase.prototype = jQuery.extend(playLoaderBase.prototype, {

    /**
     * @see media.plugin.construct
     */
    construct: function() {

      // Call the media plugin constructor.
      media.display.prototype.construct.call(this);

      // Trigger a play event when someone clicks on the controller.
      if (this.elements.bigPlay) {
        this.elements.bigPlay.bind('click', {obj: this}, function(event) {
          event.preventDefault();
          $(this).hide();
          if (event.data.obj.player) {
            event.data.obj.player.play();
          }
        });
      }
    },

    /**
     * Hide or show certain elements based on the state of the busy and big play
     * button.
     */
    checkVisibility: function() {

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
    },

    /**
     * @see media.plugin.setPlayer
     */
    setPlayer: function(player) {
      media.display.prototype.setPlayer.call(this, player);
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
    }
  });
}(jQuery, Drupal.media));
/**
 * The base media player class where all media players derive from.
 */
Drupal.media = Drupal.media || {};
(function($, media) {
  media.players = media.players || {};

  /**
   * @constructor
   * @extends media.display
   * @param {object} context The jQuery context.
   * @param {object} options This components options.
   */
  media.players.base = function(context, options, mediaFile) {

    // Store the media file.
    this.mediaFile = mediaFile;

    // Derive from display
    media.display.call(this, context, options);
  };

  // Define the priority.
  media.players.base.getPriority = function() {
    return 0;
  };

  // See if we can play this media.
  media.players.base.canPlay = function(file) {
    return false;
  };

  // Extend the display prototype.
  media.players.base.prototype = new media.display();
  media.players.base.prototype.constructor = media.players.base;
  media.players.base.prototype = jQuery.extend(media.players.base.prototype, {

    /**
     * @see media.plugin.construct
     */
    construct: function() {

      // Call the media display constructor.
      media.display.prototype.construct.call(this);

      // Get the player display object.
      if (!this.playerFound()) {

        // Cleanup some events and code.
        this.display.unbind();

        // Remove the media element if found
        if (this.elements.player) {
          this.elements.player.remove();
        }

        // Create a new media player element.
        this.display.html(this.create());
      }

      // Get the player object...
      this.player = this.getPlayer();

      // The trigger event.
      this.trigger = function(type, data) {
        this.display.trigger(type, data);
      };

      this.duration = 0;
      this.currentTime = 0;
    },
    playerFound: function() { return false; },
    create: function() { return null; },
    getPlayer: function() { return null; },
    destroy: function() {},
    load: function(file) {

      // Store the media file for future lookup.
      this.mediaFile = file;
    },
    play: function() {},
    pause: function() {},
    stop: function() {},
    seek: function(pos) {},
    setVolume: function(vol) {
      this.trigger('volumeupdate', vol);
    },
    getVolume: function() { return 0; },
    getDuration: function() { return 0; }
  });
}(jQuery, Drupal.media));


/**
 * The HTML5 media player implementation.
 */
Drupal.media = Drupal.media || {};
(function($, media) {
  media.players = media.players || {};

  /**
   * @constructor
   * @extends media.display
   * @param {object} context The jQuery context.
   * @param {object} options This components options.
   */
  media.players.html5 = function(context, options, mediaFile) {

    // Derive players base.
    media.players.base.call(this, context, options, mediaFile);
  };

  // Get the priority for this player...
  media.players.html5.getPriority = function() {
    return 10;
  };

  // See if we can play this player.
  media.players.html5.canPlay = function(file) {
    switch (file.mimetype) {
      case 'video/ogg':
        return media.playTypes.videoOGG;
      case 'video/mp4':
        return media.playTypes.videoH264;
      case 'video/x-webm':
        return media.playTypes.videoWEBM;
      case 'audio/ogg':
        return media.playTypes.audioOGG;
      case 'audio/mpeg':
        return media.playTypes.audioMP3;
      case 'audio/mp4':
        return media.playTypes.audioMP4;
      default:
        return false;
    }
  };

  // Define the prototype.
  media.players.html5.prototype = new media.players.base();
  media.players.html5.prototype.constructor = media.players.html5;
  media.players.html5.prototype = jQuery.extend(media.players.html5.prototype, {

    /**
     * @see media.plugin.construct
     */
    construct: function() {

      // Call base constructor.
      media.players.base.prototype.construct.call(this);

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
    },

    // Determine if this player is able to autobuffer.
    autoBuffer: function() {
      var preload = this.player.preload !== 'none';
      if (typeof this.player.hasAttribute === 'function') {
        return this.player.hasAttribute('preload') && preload;
      }
      else {
        return false;
      }
    },

    // Return if a player can be found.
    playerFound: function() {
      return (this.display.find(this.mediaFile.type).length > 0);
    },

    // Create a new <video> or <audio> element.
    create: function() {
      var element = document.createElement(this.mediaFile.type), attribute = '';
      for (attribute in this.options.attributes) {
        if (this.options.attributes.hasOwnProperty(attribute)) {
          element.setAttribute(attribute, this.options.attributes[attribute]);
        }
      }
      return element;
    },

    // Returns the player object.
    getPlayer: function() {
      return this.options.elements.player.eq(0)[0];
    },

    load: function(file) {
      // Always call the base first on load...
      media.players.base.prototype.load.call(this, file);

      if (this.loaded) {
        // Change the source...
        var code = '<source src="' + file.path + '" ';
        code += 'type="' + file.mimetype + '"';
        code += file.codecs ? ' codecs="' + file.path + '">' : '>';
        this.options.elements.player.attr('src', '').empty().html(code);
      }

      // Set the loaded flag.
      this.loaded = true;
    },
    play: function() {
      media.players.base.prototype.play.call(this);
      this.player.play();
    },
    pause: function() {
      media.players.base.prototype.pause.call(this);
      this.player.pause();
    },
    stop: function() {
      media.players.base.prototype.stop.call(this);
      this.media.pause();
      this.player.src = '';
    },
    seek: function(pos) {
      media.players.base.prototype.seek.call(this, pos);
      this.player.currentTime = pos;
    },
    setVolume: function(vol) {
      media.players.base.prototype.setVolume.call(this, vol);
      this.player.volume = vol;
    },
    getVolume: function() {
      return this.player.volume;
    },
    getDuration: function() {
      var dur = this.player.duration;
      return (dur === Infinity) ? 0 : dur;
    }
  });
}(jQuery, Drupal.media));
/**
 * The Flash media player class to control the flash fallback.
 */
Drupal.media = Drupal.media || {};
(function($, media) {
  media.players = media.players || {};

  /**
   * @constructor
   * @extends media.display
   * @param {object} context The jQuery context.
   * @param {object} options This components options.
   */
  media.players.flash = function(context, options, mediaFile) {

    var _this = this, interval = null, durationInterval = null;

    this.duration = 0;

    // Called when the flash player is ready.
    this.onReady = function() {
      this.ready = true;
      this.trigger('loadstart');

      // Perform a check for the duration every second until it shows up.
      durationInterval = setInterval(function() {
        if (_this.getDuration()) {
          clearInterval(durationInterval);
          _this.trigger('durationchange', {duration: _this.getDuration()});
        }
      }, 1000);
    };

    // Called when the flash provides a media update.
    this.onMediaUpdate = function(eventType) {
      if (this.ready) {
        switch (eventType) {
          case 'mediaMeta':
            clearInterval(durationInterval);
            this.trigger('loadeddata');
            this.trigger('loadedmetadata');
            this.trigger('durationchange', {duration: this.getDuration()});
            break;
          case 'mediaPlaying':
            this.trigger('playing');
            interval = setInterval(function() {
              var cTime = _this.getCurrentTime();
              var dur = _this.getDuration();
              var data = {currentTime: cTime, duration: dur};
              _this.trigger('timeupdate', data);
            }, 1000);
            break;
          case 'mediaPaused':
            this.trigger('pause');
            clearInterval(interval);
            break;
        }
      }
    };

    // Derive from players base.
    media.players.base.call(this, context, options, mediaFile);
  };

  window.onFlashPlayerReady = function(id) {
    if (media.player[id]) {
      media.player[id].media.onReady();
    }
  };

  window.onFlashPlayerUpdate = function(id, eventType) {
    if (media.player[id]) {
      media.player[id].media.onMediaUpdate(eventType);
    }
  };

  var debugConsole = console || {log: function(data) {}};
  window.onFlashPlayerDebug = function(debug) {
    debugConsole.log(debug);
  };

  // Get the priority for this player...
  media.players.flash.getPriority = function() {
    return 1;
  };

  // See if we can play this player.
  media.players.flash.canPlay = function(file) {
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

  // API function to get flash player object.
  media.players.flash.getFlash = function(params) {
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
        paramKey = (paramKey === 'movie') ? 'src' : paramKey;
        embed.setAttribute(paramKey, flashParams[paramKey]);
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

  // Define the prototype.
  media.players.flash.prototype = new media.players.base();
  media.players.flash.prototype.constructor = media.players.flash;
  media.players.flash.prototype = jQuery.extend(media.players.flash.prototype, {

    reset: function() {
      this.ready = false;
      this.duration = 0;
    },

    // Destroy the player.
    destroy: function() {
      this.reset();
    },

    // Return if a player can be found.
    playerFound: function() {
      return (this.display.find('object[playerType="flash"]').length > 0);
    },

    // Create a new flash player.
    create: function() {

      // Reset the variables.
      this.reset();

      // The flash variables for this flash player.
      var flashVars = {
        'id': this.options.id,
        'debug': this.options.settings.debug,
        'config': 'nocontrols',
        'file': this.mediaFile.path,
        'autostart': this.options.settings.autoplay
      };

      // Return a flash media player object.
      return media.players.flash.getFlash({
        swf: this.options.swfplayer,
        id: this.options.id + '_player',
        playerType: 'flash',
        width: this.options.settings.width,
        height: '100%',
        flashvars: flashVars,
        wmode: this.options.wmode
      });
    },

    // Returns the player object.
    getPlayer: function() {

      // IE needs the object, everyone else just needs embed.
      var object = jQuery.browser.msie ? 'object' : 'embed';
      return $(object, this.display).eq(0)[0];
    },

    load: function(file) {
      this.duration = 0;
      media.players.base.prototype.load.call(this, file);
      if (this.player && this.ready) {
        this.player.loadMedia(this.mediaFile.path, this.mediaFile.stream);
      }
    },
    play: function() {
      media.players.base.prototype.play.call(this);
      if (this.player && this.ready) {
        this.player.playMedia();
      }
    },
    pause: function() {
      media.players.base.prototype.pause.call(this);
      if (this.player && this.ready) {
        this.player.pauseMedia();
      }
    },
    stop: function() {
      media.players.base.prototype.stop.call(this);
      if (this.player && this.ready) {
        this.player.stopMedia();
      }
    },
    seek: function(pos) {
      media.players.base.prototype.seek.call(this, pos);
      if (this.player && this.ready) {
        this.player.seekMedia(pos);
      }
    },
    setVolume: function(vol) {
      media.players.base.prototype.setVolume.call(this, vol);
      if (this.player && this.ready) {
        this.player.setVolume(vol);
      }
    },
    getVolume: function() {
      if (this.player && this.ready) {
        return this.player.getVolume();
      }
      else {
        return media.players.base.prototype.getVolume.call(this);
      }
    },
    getDuration: function() {

      // Make sure to cache the duration since it is called often.
      if (this.duration) {
        return this.duration;
      }
      else if (this.player && this.ready) {
        this.duration = this.player.getDuration();
        return this.player.getDuration();
      }
      else {
        return media.players.base.prototype.getDuration.call(this);
      }
    },
    isReady: function() {
      return (this.player && this.ready);
    },
    getCurrentTime: function() {
      return this.isReady() ? this.player.getCurrentTime() : 0;
    },
    getBytesLoaded: function() {
      return this.isReady() ? this.player.getMediaBytesLoaded() : 0;
    },
    getBytesTotal: function() {
      return this.isReady() ? this.player.getMediaBytesTotal() : 0;
    }
  });
}(jQuery, Drupal.media));
/**
 * Drupal.media.controllers.base
 *
 * This is the base media controller.  Other controllers can derive from the
 * base and either build on top of it or simply define the elements that this
 * base controller uses.
 */
Drupal.media = Drupal.media || {};
(function($, media) {

  // Define the controllers object.
  media.controllers = media.controllers || {};

  /**
   * @constructor
   * @extends media.display
   * @param {object} context The jQuery context.
   * @param {object} options This components options.
   */
  media.controllers.base = function(context, options) {

    // Derive from display
    media.display.call(this, context, options);
  }

  /**
   * A static function that will format a time value into a string time format.
   *
   * @param {integer} time An integer value of time.
   * @return {string} A string representation of the time.
   */
  media.formatTime = function(time) {
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

  // Define the prototype for all controllers.
  var controllersBase = media.controllers.base;
  controllersBase.prototype = new media.display();
  controllersBase.prototype.constructor = controllersBase;
  controllersBase.prototype = jQuery.extend(controllersBase.prototype, {

    /**
     * @see media.display.getElements
     */
    getElements: function() {
      var elements = media.display.prototype.getElements.call(this);
      return jQuery.extend(elements, {
        play: null,
        pause: null,
        fullscreen: null,
        seek: null,
        volume: null,
        timer: null
      });
    },

    /**
     * @see media.plugin.construct
     */
    construct: function() {

      // Call the media plugin constructor.
      media.display.prototype.construct.call(this);

      this.setPlayPause = function(state) {
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

      // Play or pause the player.
      this.playPause = function(state) {
        var type = state ? 'play' : 'pause';
        this.display.trigger(type);
        this.setPlayPause(state);
        if (this.player) {
          this.player[type]();
        }
      };

      // Trigger the controller events.
      if (this.elements.play) {
        this.elements.play.bind('click', {obj: this}, function(event) {
          event.preventDefault();
          event.data.obj.playPause(true);
        });
      }

      if (this.elements.pause) {
        this.elements.pause.bind('click', {obj: this}, function(event) {
          event.preventDefault();
          event.data.obj.playPause(false);
        });
      }

      // Fullscreen button.
      var _this = this, sliderOptions = {};
      if (this.elements.fullscreen) {
        this.elements.fullscreen.click(function() {
          var isFull = $(_this.options.player.display).hasClass('fullscreen');
          if (isFull) {
            $(_this.options.player.display).removeClass('fullscreen');
          }
          else {
            $(_this.options.player.display).addClass('fullscreen');
          }
        }).css({'pointer' : 'hand'});
      }

      // Add key events to the window.
      $(window).keyup(function(event) {
        // Escape out of fullscreen if they press ESC or Q.
        var isFull = $(_this.options.player.display).hasClass('fullscreen');
        if (isFull && (event.keyCode === 113 || event.keyCode === 27)) {
          $(_this.options.player.display).removeClass('fullscreen');
        }
      });

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
    },

    /**
     * Sets the time string on the control bar.
     *
     * @param {string} element The name of the element to set.
     * @param {number} time The total time amount to set.
     */
    setTimeString: function(element, time) {
      if (this.elements[element]) {
        this.elements[element].text(media.formatTime(time).time);
      }
    },

    /**
     * @see media.plugin.setPlayer
     */
    setPlayer: function(player) {
      media.display.prototype.setPlayer.call(this, player);
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
    }
  });

}(jQuery, Drupal.media));
/**
 * The base template class which all templates should derive.
 */
Drupal.media = Drupal.media || {};
(function($, media) {

  // Define the templates class if need be...
  media.templates = media.templates || {};

  /**
   * @constructor
   * @extends media.display
   * @param {object} context The jQuery context.
   * @param {object} options This components options.
   */
  media.templates.base = function(context, options) {

    // Derive from display
    media.display.call(this, context, options);
  };

  // Extend the plugin prototype.
  var templatesBase = media.templates.base;
  templatesBase.prototype = new media.display();
  templatesBase.prototype.constructor = templatesBase;
  templatesBase.prototype = jQuery.extend(templatesBase.prototype, {

    /**
     * @see media.display.getElements
     */
    getElements: function() {
      var elements = media.display.prototype.getElements.call(this);
      return jQuery.extend(elements, {
        display: null,
        player: null
      });
    },

    /**
     * The player is going into full screen mode.
     */
    onFullScreen: function(full) {

    }
  });
}(jQuery, Drupal.media));


