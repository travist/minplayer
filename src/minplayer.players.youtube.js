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
