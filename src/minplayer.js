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
      if (!minplayer.plugin.instances[options.id]) {
        new minplayer(jQuery(this), options);
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
    controller: 'default',
    template: 'default',
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

  // Derive from display
  minplayer.display.call(this, 'player', context, options);
}, minplayer);

/** Derive from minplayer.display. */
minplayer.prototype = new minplayer.display();

/** Reset the constructor. */
minplayer.prototype.constructor = minplayer;

/**
 * @see minplayer.plugin.construct
 */
minplayer.prototype.construct = function() {

  // Call the minplayer display constructor.
  minplayer.display.prototype.construct.call(this);

  /** Variable to store the current media player. */
  this.currentPlayer = 'html5';

  // Add key events to the window.
  this.addKeyEvents();

  // Now load these files.
  this.load(this.getFiles());

  // We are now ready.
  this.ready();
};

/**
 * Sets an error on the player.
 *
 * @param {string} error The error to display on the player.
 */
minplayer.prototype.error = function(error) {
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
 * Called when the player initializes.
 */
minplayer.prototype.initialize = function() {

  // Iterate through each plugin.
  var _this = this;
  this.eachPlugin(function(name, plugin) {

    // Bind to the error event.
    plugin.bind('error', function(event, data) {
      _this.error(data);
    });

    // Bind to the fullscreen event.
    plugin.bind('fullscreen', function(event, data) {
      _this.resize();
    });
  });

  // Load the media.
  this.getPlugin('media').load();
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
  if (!this.player || (player !== this.currentPlayer)) {

    // Set the current media player.
    this.currentPlayer = player;

    // Do nothing if we don't have a display.
    if (!this.elements.display) {
      this.error('No media display found.');
      return;
    }

    // If the media exists, then destroy it.
    if (this.player) {
      this.player.destory();
    }

    // Get the class name and create the new player.
    pClass = minplayer.players[this.options.file.player];

    // Create the new media player.
    this.player = new pClass(this.elements.display, this.options);
  }

  // If the media object already exists...
  else if (this.player) {

    // Now load the different media file.
    this.player.load(this.options.file);
  }
};

/**
 * Called when the player is resized.
 */
minplayer.prototype.resize = function() {

  // Call onRezie for each plugin.
  this.eachPlugin(function(name, plugin) {
    plugin.onResize();
  });
};

/**
 * Play the currently loaded media file.  Use load first to load a
 * media file into the media player.
 */
minplayer.prototype.play = function() {
  if (this.player) {
    this.player.play();
  }
};

/**
 * Pause the media.
 */
minplayer.prototype.pause = function() {
  if (this.player) {
    this.player.pause();
  }
};

/**
 * Stop the media.
 */
minplayer.prototype.stop = function() {
  if (this.player) {
    this.player.stop();
  }
};

/**
 * Seek the media to the provided position.
 *
 * @param {number} pos The position to seek.  0 to 1.
 */
minplayer.prototype.seek = function(pos) {
  if (this.player) {
    this.player.seek(pos);
  }
};

/**
 * Set the volume of the media being played.
 *
 * @param {number} vol The volume to set.  0 to 1.
 */
minplayer.prototype.setVolume = function(vol) {
  if (this.player) {
    this.player.setVolume(vol);
  }
};

/**
 * Get the current volume setting.
 *
 * @param {function} callback The callback that is called when the volume
 * is known.
 * @return {number} The current volume level. 0 to 1.
 */
minplayer.prototype.getVolume = function(callback) {
  return this.player ? this.player.getVolume(callback) : 0;
};

/**
 * Get the current media duration.
 *
 * @param {function} callback The callback that is called when the duration
 * is known.
 * @return {number} The current media duration.
 */
minplayer.prototype.getDuration = function(callback) {
  return this.player ? this.player.getDuration(callback) : 0;
};
