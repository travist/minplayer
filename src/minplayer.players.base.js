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
 * Clears all the intervals.
 */
minplayer.players.base.prototype.clearIntervals = function() {
  // Stop the intervals.
  this.playInterval = false;
  this.progressInterval = false;
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

  // Stop the intervals.
  this.clearIntervals();

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
  this.progressInterval = true;

  // Create a poll to get the progress.
  this.poll(function() {

    // Only do this if the play interval is set.
    if (_this.progressInterval) {

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
    }

    return _this.progressInterval;
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

  // Set the playInterval to true.
  this.playInterval = true;

  // Create a poll to get the timeupate.
  this.poll(function() {

    // Only do this if the play interval is set.
    if (_this.playInterval) {

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

    return _this.playInterval;
  });
};

/**
 * Should be called when the media is paused.
 */
minplayer.players.base.prototype.onPaused = function() {

  // Trigger an event that we are paused.
  this.trigger('pause');

  // Stop the play interval.
  this.playInterval = false;
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

