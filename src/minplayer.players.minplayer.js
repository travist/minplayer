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
