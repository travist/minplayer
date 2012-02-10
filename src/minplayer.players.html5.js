/** The minplayer namespace. */
var minplayer = minplayer || {};

/** All the media player implementations */
minplayer.players = minplayer.players || {};

/**
 * @constructor
 * @extends minplayer.display
 * @class The HTML5 media player implementation.
 *
 * @param {object} context The jQuery context.
 * @param {object} options This components options.
 * @param {function} ready Called when the player is ready.
 */
minplayer.players.html5 = function(context, options, ready) {

  // Derive players base.
  minplayer.players.base.call(this, context, options, ready);
};

/** Derive from minplayer.players.base. */
minplayer.players.html5.prototype = new minplayer.players.base();

/** Reset the constructor. */
minplayer.players.html5.prototype.constructor = minplayer.players.html5;

/**
 * @see minplayer.players.base#getPriority
 * @return {number} The priority of this media player.
 */
minplayer.players.html5.getPriority = function() {
  return 10;
};

/**
 * @see minplayer.players.base#canPlay
 * @return {boolean} If this player can play this media type.
 */
minplayer.players.html5.canPlay = function(file) {
  switch (file.mimetype) {
    case 'video/ogg':
      return minplayer.playTypes.videoOGG;
    case 'video/mp4':
      return minplayer.playTypes.videoH264;
    case 'video/x-webm':
      return minplayer.playTypes.videoWEBM;
    case 'audio/ogg':
      return minplayer.playTypes.audioOGG;
    case 'audio/mpeg':
      return minplayer.playTypes.audioMP3;
    case 'audio/mp4':
      return minplayer.playTypes.audioMP4;
    default:
      return false;
  }
};

/**
 * @see minplayer.plugin.construct
 */
minplayer.players.html5.prototype.construct = function() {

  // Call base constructor.
  minplayer.players.base.prototype.construct.call(this);

  // Store the this pointer...
  var _this = this;

  // For the HTML5 player, we will just pass events along...
  if (this.media) {
    this.media.addEventListener('abort', function() {
      _this.trigger('abort');
    }, false);
    this.media.addEventListener('loadstart', function() {
      _this.onReady();
    }, false);
    this.media.addEventListener('loadeddata', function() {
      _this.onLoaded();
    }, false);
    this.media.addEventListener('loadedmetadata', function() {
      _this.onLoaded();
    }, false);
    this.media.addEventListener('canplaythrough', function() {
      _this.onLoaded();
    }, false);
    this.media.addEventListener('ended', function() {
      _this.onComplete();
    }, false);
    this.media.addEventListener('pause', function() {
      _this.onPaused();
    }, false);
    this.media.addEventListener('play', function() {
      _this.onPlaying();
    }, false);
    this.media.addEventListener('playing', function() {
      _this.onPlaying();
    }, false);
    this.media.addEventListener('error', function() {
      var error = '';
      switch (this.error.code) {
         case MEDIA_ERR_NETWORK:
            error = 'Network error - please try again later.';
            break;
         case MEDIA_ERR_DECODE:
            error = 'Video is broken..';
            break;
         case MEDIA_ERR_SRC_NOT_SUPPORTED:
            error = 'Sorry, your browser can\'t play this video.';
            break;
       }
      _this.trigger('error', error);
    }, false);
    this.media.addEventListener('waiting', function() {
      _this.onWaiting();
    }, false);
    this.media.addEventListener('durationchange', function() {
      _this.duration.set(this.duration);
      _this.trigger('durationchange', {duration: this.duration});
    }, false);
    this.media.addEventListener('progress', function(event) {
      _this.bytesTotal.set(event.total);
      _this.bytesLoaded.set(event.loaded);
    }, false);
    if (this.autoBuffer()) {
      this.media.autobuffer = true;
    } else {
      this.media.autobuffer = false;
      this.media.preload = 'none';
    }
  }
};

/**
 * Determine if this player is able to autobuffer.
 * @return {boolean} TRUE - the player is able to autobuffer.
 */
minplayer.players.html5.prototype.autoBuffer = function() {
  var preload = this.media.preload !== 'none';
  if (typeof this.media.hasAttribute === 'function') {
    return this.media.hasAttribute('preload') && preload;
  }
  else {
    return false;
  }
};

/**
 * @see minplayer.players.base#playerFound
 * @return {boolean} TRUE - if the player is in the DOM, FALSE otherwise.
 */
minplayer.players.html5.prototype.playerFound = function() {
  return (this.display.find(this.mediaFile.type).length > 0);
};

/**
 * @see minplayer.players.base#create
 * @return {object} The media player entity.
 */
minplayer.players.html5.prototype.create = function() {
  minplayer.players.base.prototype.create.call(this);
  var element = document.createElement(this.mediaFile.type), attribute = '';
  for (attribute in this.options.attributes) {
    if (this.options.attributes.hasOwnProperty(attribute)) {
      element.setAttribute(attribute, this.options.attributes[attribute]);
    }
  }
  return element;
};

/**
 * @see minplayer.players.base#getMedia
 * @return {object} The media player object.
 */
minplayer.players.html5.prototype.getMedia = function() {
  return this.options.elements.media.eq(0)[0];
};

/**
 * @see minplayer.players.base#load
 */
minplayer.players.html5.prototype.load = function(file) {

  if (file && this.isReady()) {

    // Get the current source.
    var src = this.options.elements.player.attr('src');

    // If the source is different.
    if (src != file.path) {

      // Change the source...
      var code = '<source src="' + file.path + '" ';
      code += 'type="' + file.mimetype + '"';
      code += file.codecs ? ' codecs="' + file.path + '">' : '>';
      this.options.elements.player.attr('src', '').empty().html(code);
    }
  }

  // Always call the base first on load...
  minplayer.players.base.prototype.load.call(this, file);
};

/**
 * @see minplayer.players.base#play
 */
minplayer.players.html5.prototype.play = function() {
  minplayer.players.base.prototype.play.call(this);
  if (this.isReady()) {
    this.media.play();
  }
};

/**
 * @see minplayer.players.base#pause
 */
minplayer.players.html5.prototype.pause = function() {
  minplayer.players.base.prototype.pause.call(this);
  if (this.isReady()) {
    this.media.pause();
  }
};

/**
 * @see minplayer.players.base#stop
 */
minplayer.players.html5.prototype.stop = function() {
  minplayer.players.base.prototype.stop.call(this);
  if (this.isReady()) {
    this.media.pause();
    this.media.src = '';
  }
};

/**
 * @see minplayer.players.base#seek
 */
minplayer.players.html5.prototype.seek = function(pos) {
  minplayer.players.base.prototype.seek.call(this, pos);
  if (this.isReady()) {
    this.media.currentTime = pos;
  }
};

/**
 * @see minplayer.players.base#setVolume
 */
minplayer.players.html5.prototype.setVolume = function(vol) {
  minplayer.players.base.prototype.setVolume.call(this, vol);
  if (this.isReady()) {
    this.media.volume = vol;
  }
};

/**
 * @see minplayer.players.base#getVolume
 */
minplayer.players.html5.prototype.getVolume = function(callback) {
  if (this.isReady()) {
    callback(this.media.volume);
  }
};

/**
 * @see minplayer.players.base#getDuration
 */
minplayer.players.html5.prototype.getDuration = function(callback) {
  if (this.isReady()) {
    callback(this.media.duration);
  }
};

/**
 * @see minplayer.players.base#getCurrentTime
 */
minplayer.players.html5.prototype.getCurrentTime = function(callback) {
  if (this.isReady()) {
    callback(this.media.currentTime);
  }
};

/**
 * @see minplayer.players.base#getBytesLoaded
 */
minplayer.players.html5.prototype.getBytesLoaded = function(callback) {
  if (this.isReady()) {
    var loaded = 0;

    // Check several different possibilities.
    if (this.bytesLoaded.value) {
      loaded = this.bytesLoaded.value;
    }
    else if (this.media.buffered &&
        this.media.buffered.length > 0 &&
        this.media.buffered.end &&
        this.media.duration) {
      loaded = this.media.buffered.end(0);
    }
    else if (this.media.bytesTotal != undefined &&
             this.media.bytesTotal > 0 &&
             this.media.bufferedBytes != undefined) {
      loaded = this.media.bufferedBytes;
    }

    // Return the loaded amount.
    callback(loaded);
  }
};

/**
 * @see minplayer.players.base#getBytesTotal
 */
minplayer.players.html5.prototype.getBytesTotal = function(callback) {
  if (this.isReady()) {

    var total = 0;

    // Check several different possibilities.
    if (this.bytesTotal.value) {
      total = this.bytesTotal.value;
    }
    else if (this.media.buffered &&
        this.media.buffered.length > 0 &&
        this.media.buffered.end &&
        this.media.duration) {
      total = this.media.duration;
    }
    else if (this.media.bytesTotal != undefined &&
             this.media.bytesTotal > 0 &&
             this.media.bufferedBytes != undefined) {
      total = this.media.bytesTotal;
    }

    // Return the loaded amount.
    callback(total);
  }
};
