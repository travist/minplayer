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
 * @param {object} mediaFile The media file for this player.
 */
minplayer.players.youtube = function(context, options, mediaFile) {

  // Derive from players base.
  minplayer.players.base.call(this, context, options, mediaFile);

  /** Determine if the player is ready. */
  this.ready = false;

  /** The quality of the YouTube stream. */
  this.quality = 'default';
};

/** Derive from minplayer.players.base. */
minplayer.players.youtube.prototype = new minplayer.players.base();

/** Reset the constructor. */
minplayer.players.youtube.prototype.constructor = minplayer.players.youtube;

/**
 * @see minplayer.plugin.construct
 */
minplayer.players.youtube.prototype.construct = function() {

  // Call base constructor.
  minplayer.players.base.prototype.construct.call(this);
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
        var playerId = instance.options.id + '_player';
        instance.media.player = new YT.Player(playerId, {
          height: instance.options.settings.height,
          width: instance.options.settings.width,
          videoId: instance.media.mediaFile.id,
          playerVars: {controls: '0'},
          events: {
            'onReady': function(event) {
              instance.media.onPlayerReady(event);
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
 * @return {string} The standardized state for this YouTube state.
 */
minplayer.players.youtube.prototype.getPlayerState = function(playerState) {
  switch (playerState) {
    case -1:
    case YT.PlayerState.CUED:
      return 'ready';
    case YT.PlayerState.BUFFERING:
      return 'waiting';
    case YT.PlayerState.PAUSED:
      return 'pause';
    case YT.PlayerState.PLAYING:
      return 'play';
    case YT.PlayerState.ENDED:
      return 'ended';
    default:
      return 'unknown';
  }
};

/**
 * Called when the youtube player is ready.
 *
 * @param {object} event A JavaScript Event.
 */
minplayer.players.youtube.prototype.onPlayerReady = function(event) {
  this.ready = true;
};

/**
 * Called when the player state changes.
 *
 * @param {object} event A JavaScript Event.
 */
minplayer.players.youtube.prototype.onPlayerStateChange = function(event) {
  this.trigger(this.getPlayerState(event.data));
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
 * @see minplayer.players.base#create
 * @return {object} The media player entity.
 */
minplayer.players.youtube.prototype.create = function() {

  // Call the base create first.
  minplayer.players.base.prototype.create.call(this);

  // Insert the YouTube iframe API player.
  var tag = document.createElement('script');
  tag.src = 'http://www.youtube.com/player_api?enablejsapi=1';
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  // Now register this player.
  this.register();

  // Create a div tag for the youtube api to do the rest.
  var player = document.createElement('div');
  player.setAttribute('id', this.options.id + '_player');

  // Return the player.
  return player;
};

/**
 * @see minplayer.players.base#load
 */
minplayer.players.youtube.prototype.load = function(file) {
  minplayer.players.base.prototype.load.call(this, file);
  if (this.ready) {
    this.player.loadVideoById(this.mediaFile.id, 0, this.quality);
  }
};

/**
 * @see minplayer.players.base#play
 */
minplayer.players.youtube.prototype.play = function() {
  minplayer.players.base.prototype.play.call(this);
  if (this.ready) {
    this.player.playVideo();
  }
};

/**
 * @see minplayer.players.base#pause
 */
minplayer.players.youtube.prototype.pause = function() {
  minplayer.players.base.prototype.pause.call(this);
  if (this.ready) {
    this.player.pauseVideo();
  }
};

/**
 * @see minplayer.players.base#stop
 */
minplayer.players.youtube.prototype.stop = function() {
  minplayer.players.base.prototype.stop.call(this);
  if (this.ready) {
    this.player.stopVideo();
  }
};

/**
 * @see minplayer.players.base#seek
 */
minplayer.players.youtube.prototype.seek = function(pos) {
  minplayer.players.base.prototype.seek.call(this, pos);
  if (this.ready) {
    this.player.seekTo(pos, true);
  }
};

/**
 * @see minplayer.players.base#setVolume
 */
minplayer.players.youtube.prototype.setVolume = function(vol) {
  minplayer.players.base.prototype.setVolume.call(this, vol);
  if (this.ready) {
    this.player.setVolume(vol * 100);
  }
};

/**
 * @see minplayer.players.base#getVolume
 * @return {number} The volume of the media; 0 to 1.
 */
minplayer.players.youtube.prototype.getVolume = function() {
  if (this.ready) {
    return (this.player.getVolume() / 100);
  }
  else {
    return minplayer.players.base.prototype.getVolume.call(this);
  }
};

/**
 * @see minplayer.players.flash#getPlayerDuration.
 * @return {int} The player duration.
 */
minplayer.players.youtube.prototype.getPlayerDuration = function() {
  return this.ready ? this.player.getDuration() : 0;
};

/**
 * @see minplayer.players.base#getCurrentTime
 * @return {number} The current playhead time.
 */
minplayer.players.youtube.prototype.getCurrentTime = function() {
  return this.ready ? this.player.getCurrentTime() : 0;
};

/**
 * @see minplayer.players.base#getBytesLoaded.
 * @return {number} Returns the bytes loaded from the media.
 */
minplayer.players.youtube.prototype.getBytesLoaded = function() {
  return this.ready ? this.player.getVideoBytesLoaded() : 0;
};

/**
 * @see minplayer.players.base#getBytesTotal.
 * @return {number} The total number of bytes of the loaded media.
 */
minplayer.players.youtube.prototype.getBytesTotal = function() {
  return this.ready ? this.player.getVideoBytesTotal() : 0;
};
