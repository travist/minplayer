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
 * @param {object} mediaFile The media file for this player.
 */
minplayer.players.html5 = function(context, options, mediaFile) {

  // Derive players base.
  minplayer.players.base.call(this, context, options, mediaFile);
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
 * @param {object} file A {@link minplayer.file} object.
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
};

/**
 * Determine if this player is able to autobuffer.
 * @return {boolean} TRUE - the player is able to autobuffer.
 */
minplayer.players.html5.prototype.autoBuffer = function() {
  var preload = this.player.preload !== 'none';
  if (typeof this.player.hasAttribute === 'function') {
    return this.player.hasAttribute('preload') && preload;
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
  var element = document.createElement(this.mediaFile.type), attribute = '';
  for (attribute in this.options.attributes) {
    if (this.options.attributes.hasOwnProperty(attribute)) {
      element.setAttribute(attribute, this.options.attributes[attribute]);
    }
  }
  return element;
};

/**
 * @see minplayer.players.base#getPlayer
 * @return {object} The media player object.
 */
minplayer.players.html5.prototype.getPlayer = function() {
  return this.options.elements.media.eq(0)[0];
};

/**
 * @see minplayer.players.base#load
 */
minplayer.players.html5.prototype.load = function(file) {
  // Always call the base first on load...
  minplayer.players.base.prototype.load.call(this, file);

  if (this.loaded) {
    // Change the source...
    var code = '<source src="' + file.path + '" ';
    code += 'type="' + file.mimetype + '"';
    code += file.codecs ? ' codecs="' + file.path + '">' : '>';
    this.options.elements.player.attr('src', '').empty().html(code);
  }

  // Set the loaded flag.
  this.loaded = true;
};

/**
 * @see minplayer.players.base#play
 */
minplayer.players.html5.prototype.play = function() {
  minplayer.players.base.prototype.play.call(this);
  this.player.play();
};

/**
 * @see minplayer.players.base#pause
 */
minplayer.players.html5.prototype.pause = function() {
  minplayer.players.base.prototype.pause.call(this);
  this.player.pause();
};

/**
 * @see minplayer.players.base#stop
 */
minplayer.players.html5.prototype.stop = function() {
  minplayer.players.base.prototype.stop.call(this);
  this.player.pause();
  this.player.src = '';
};

/**
 * @see minplayer.players.base#seek
 */
minplayer.players.html5.prototype.seek = function(pos) {
  minplayer.players.base.prototype.seek.call(this, pos);
  this.player.currentTime = pos;
};

/**
 * @see minplayer.players.base#setVolume
 */
minplayer.players.html5.prototype.setVolume = function(vol) {
  minplayer.players.base.prototype.setVolume.call(this, vol);
  this.player.volume = vol;
};

/**
 * @see minplayer.players.base#getVolume
 * @return {number} The volume of the media; 0 to 1.
 */
minplayer.players.html5.prototype.getVolume = function() {
  return this.player.volume;
};

/**
 * @see minplayer.players.base#getDuration
 * @return {number} The duration of the loaded media.
 */
minplayer.players.html5.prototype.getDuration = function() {
  var dur = this.player.duration;
  return (dur === Infinity) ? 0 : dur;
};
