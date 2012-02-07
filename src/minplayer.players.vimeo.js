/** The minplayer namespace. */
var minplayer = minplayer || {};

/** All the media player implementations */
minplayer.players = minplayer.players || {};

/**
 * @constructor
 * @extends minplayer.players.flash
 * @class The vimeo media player.
 *
 * @param {object} context The jQuery context.
 * @param {object} options This components options.
 * @param {function} ready Called when the player is ready.
 */
minplayer.players.vimeo = function(context, options, ready) {

  // Reset the variables to initial state.
  this.reset();

  // Derive from players base.
  minplayer.players.flash.call(this, context, options, ready);
};

/** Derive from minplayer.players.flash. */
minplayer.players.vimeo.prototype = new minplayer.players.flash();

/** Reset the constructor. */
minplayer.players.vimeo.prototype.constructor = minplayer.players.vimeo;

/**
 * @see minplayer.players.flash#getPriority
 * @return {number} The priority of this media player.
 */
minplayer.players.vimeo.getPriority = function() {
  return 10;
};

/**
 * @see minplayer.players.flash#canPlay
 * @param {object} file A {@link minplayer.file} object.
 * @return {boolean} If this player can play this media type.
 */
minplayer.players.vimeo.canPlay = function(file) {

  // Check for the mimetype for vimeo.
  if (file.mimetype === 'video/vimeo') {
    return true;
  }

  // If the path is a vimeo path, then return true.
  return (file.path.search(/^http(s)?\:\/\/(www\.)?vimeo\.com/i) === 0);
};

/**
 * Return the ID for a provided media file.
 *
 * @param {object} file A {@link minplayer.file} object.
 * @return {string} The ID for the provided media.
 */
minplayer.players.vimeo.getMediaId = function(file) {
  var regex = /^http[s]?\:\/\/(www\.)?vimeo\.com\/(\?v\=)?([0-9]+)/i;
  if (file.path.search(regex) === 0) {
    return file.path.replace(regex, '$3');
  }
  else {
    return file.path;
  }
};

/**
 * @see minplayer.players.flash#reset
 */
minplayer.players.vimeo.prototype.reset = function() {

  // Reset the flash variables..
  minplayer.players.flash.prototype.reset.call(this);

  // Store the bytes loaded.
  this.bytesLoaded = new minplayer.async();

  // Store the bytes total.
  this.bytesTotal = new minplayer.async();
};

/**
 * @see minplayer.players.flash#create
 * @return {object} The media player entity.
 */
minplayer.players.vimeo.prototype.create = function() {

  // Call the flash create first.
  minplayer.players.flash.prototype.create.call(this);

  // Reset all variables.
  this.reset();

  // Insert the Vimeo Froogaloop player.
  var tag = document.createElement('script');
  tag.src = 'http://a.vimeocdn.com/js/froogaloop2.min.js';
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  // Create the iframe for this player.
  var iframe = document.createElement('iframe');
  iframe.setAttribute('id', this.options.id + '-player');
  iframe.setAttribute('type', 'text/html');
  iframe.setAttribute('width', '100%');
  iframe.setAttribute('height', '100%');
  iframe.setAttribute('frameborder', '0');

  // Get the source.
  var src = 'http://player.vimeo.com/video/';
  src += this.mediaFile.id + '?';

  // Add the parameters to the src.
  src += jQuery.param({
    'wmode': 'opaque',
    'api': 1,
    'player_id': this.options.id + '-player',
    'title': 0,
    'byline': 0,
    'portrait': 0
  });

  // Set the source of the iframe.
  iframe.setAttribute('src', src);

  // Now register this player when the froogaloop code is loaded.
  var _this = this;
  var check = setInterval(function() {
    if (window.Froogaloop) {
      clearInterval(check);
      _this.player = window.Froogaloop(iframe);
      _this.player.addEvent('ready', function() {
        _this.onReady();
      });
    }
  }, 200);

  // Trigger that the load has started.
  this.trigger('loadstart');

  // Return the player.
  return iframe;
};

/**
 * @see minplayer.players.flash#getPlayer
 * @return {object} The media player object.
 */
minplayer.players.vimeo.prototype.getPlayer = function() {
  return this.player;
};

/**
 * @see minplayer.players.flash#onReady
 */
minplayer.players.vimeo.prototype.onReady = function(player_id) {
  // Store the this pointer within this context.
  var _this = this;

  // Add the other listeners.
  this.player.addEvent('loadProgress', function(progress) {
    _this.duration.set(parseFloat(progress.duration));
    _this.bytesLoaded.set(progress.bytesLoaded);
    _this.bytesTotal.set(progress.bytesTotal);
  });

  this.player.addEvent('playProgress', function(progress) {
    _this.duration.set(parseFloat(progress.duration));
    _this.currentTime.set(parseFloat(progress.seconds));
  });

  this.player.addEvent('play', function() {
    _this.onPlaying();
  });

  this.player.addEvent('pause', function() {
    _this.onPaused();
  });

  this.player.addEvent('finish', function() {
    _this.trigger('ended');
  });

  minplayer.players.flash.prototype.onReady.call(this);
  this.onMeta();
};

/**
 * Checks to see if this player can be found.
 * @return {bool} TRUE - Player is found, FALSE - otherwise.
 */
minplayer.players.vimeo.prototype.playerFound = function() {
  var iframe = this.display.find('iframe#' + this.options.id + '-player');
  return (iframe.length > 0);
};

/**
 * @see minplayer.players.flash#play
 */
minplayer.players.vimeo.prototype.play = function() {
  minplayer.players.flash.prototype.play.call(this);
  if (this.isReady()) {
    this.player.api('play');
  }
};

/**
 * @see minplayer.players.flash#pause
 */
minplayer.players.vimeo.prototype.pause = function() {
  minplayer.players.flash.prototype.pause.call(this);
  if (this.isReady()) {
    this.player.api('pause');
  }
};

/**
 * @see minplayer.players.flash#stop
 */
minplayer.players.vimeo.prototype.stop = function() {
  minplayer.players.flash.prototype.stop.call(this);
  if (this.isReady()) {
    this.player.api('unload');
  }
};

/**
 * @see minplayer.players.flash#seek
 */
minplayer.players.vimeo.prototype.seek = function(pos) {
  minplayer.players.flash.prototype.seek.call(this, pos);
  if (this.isReady()) {
    this.player.api('seekTo', pos);
  }
};

/**
 * @see minplayer.players.flash#setVolume
 */
minplayer.players.vimeo.prototype.setVolume = function(vol) {
  minplayer.players.flash.prototype.setVolume.call(this, vol);
  if (this.isReady()) {
    this.volume.set(vol);
    this.player.api('setVolume', vol);
  }
};

/**
 * @see minplayer.players.base#getVolume
 *
 * @param {function} Called when the volume is determined.
 */
minplayer.players.vimeo.prototype.getVolume = function(callback) {
  var _this = this;
  this.player.api('getVolume', function(vol) {
    callback(vol);
  });
};

/**
 * @see minplayer.players.flash#getPlayerDuration.
 * @return {int} The player duration.
 */
minplayer.players.vimeo.prototype.getPlayerDuration = function() {
  return this.isReady() ? this.duration.value : 0;
};

/**
 * @see minplayer.players.base#getPlayerCurrentTime
 * @return {number} The current playhead time.
 */
minplayer.players.vimeo.prototype.getPlayerCurrentTime = function() {
  return this.isReady() ? this.currentTime.value : 0;
};

/**
 * @see minplayer.players.flash#getBytesLoaded.
 * @return {number} Returns the bytes loaded from the media.
 */
minplayer.players.vimeo.prototype.getBytesLoaded = function() {
  return this.isReady() ? this.bytesLoaded.value : 0;
};

/**
 * @see minplayer.players.flash#getBytesTotal.
 * @return {number} The total number of bytes of the loaded media.
 */
minplayer.players.vimeo.prototype.getBytesTotal = function() {
  return this.isReady() ? this.bytesTotal.value : 0;
};
