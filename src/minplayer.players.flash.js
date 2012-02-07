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
 * @param {function} ready Called when the player is ready.
 */
minplayer.players.flash = function(context, options, ready) {

  this.mediaInterval = null;

  // Derive from players base.
  minplayer.players.base.call(this, context, options, ready);
};

/** Derive from minplayer.players.base. */
minplayer.players.flash.prototype = new minplayer.players.base();

/** Reset the constructor. */
minplayer.players.flash.prototype.constructor = minplayer.players.flash;

/**
 * @see minplayer.players.base#getPriority
 * @return {number} The priority of this media player.
 */
minplayer.players.flash.getPriority = function() {
  return 0;
};

/**
 * @see minplayer.players.base#canPlay
 * @param {object} file A {@link minplayer.file} object.
 * @return {boolean} If this player can play this media type.
 */
minplayer.players.flash.canPlay = function(file) {
  return false;
};

/**
 * API to return the Flash player code provided params.
 *
 * @param {object} params The params used to populate the Flash code.
 * @return {object} A Flash DOM element.
 */
minplayer.players.flash.getFlash = function(params) {
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
      if (paramKey === 'movie') {
        embed.setAttribute('src', flashParams[paramKey]);
      }
      else {
        embed.setAttribute(paramKey, flashParams[paramKey]);
      }
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

/**
 * Called when the player is ready.
 */
minplayer.players.flash.prototype.onReady = function() {

  // Call the base on ready.
  minplayer.players.base.prototype.onReady.call(this);

  // Trigger that the load has started.
  this.trigger('loadstart');
};

/**
 * Should be called when the media is playing.
 */
minplayer.players.flash.prototype.onPlaying = function() {
  var _this = this;
  this.trigger('playing');
  this.mediaInterval = setInterval(function() {
    _this.trigger('timeupdate', {
      currentTime: _this.getPlayerCurrentTime(),
      duration: _this.getPlayerDuration()
    });
  }, 1000);
};

/**
 * Should be called when the minplayer is paused.
 */
minplayer.players.flash.prototype.onPaused = function() {
  this.trigger('pause');
  clearInterval(this.mediaInterval);
};

/**
 * Should be called when the meta data has finished loading.
 */
minplayer.players.flash.prototype.onMeta = function() {
  this.trigger('loadeddata');
  this.trigger('loadedmetadata');
};

/**
 * @see minplayer.players.base#playerFound
 * @return {boolean} TRUE - if the player is in the DOM, FALSE otherwise.
 */
minplayer.players.flash.prototype.playerFound = function() {
  return (this.display.find('object[playerType="flash"]').length > 0);
};

/**
 * @see minplayer.players.base#create
 * @return {object} The media player entity.
 */
minplayer.players.flash.prototype.create = function() {
  // Reset the variables.
  this.reset();
  return null;
};

/**
 * @see minplayer.players.base#getPlayer
 * @return {object} The media player object.
 */
minplayer.players.flash.prototype.getPlayer = function() {
  // IE needs the object, everyone else just needs embed.
  var object = jQuery.browser.msie ? 'object' : 'embed';
  return jQuery(object, this.display).eq(0)[0];
};

/**
 * Return the players current time.
 *
 * @return {number} The players current time.
 */
minplayer.players.flash.prototype.getPlayerCurrentTime = function() {
  return 0;
};

/**
 * @see minplayer.players.base#getPlayTime
 * @return {number} The duration of the loaded media.
 */
minplayer.players.flash.prototype.getCurrentTime = function(callback) {
  var _this = this;
  return this.currentTime.get(callback, function() {
    return _this.getPlayerCurrentTime();
  });
};

/**
 * Return the player time duration.
 *
 * @return {int} The player duration.
 */
minplayer.players.flash.prototype.getPlayerDuration = function() {
  return 0;
};

/**
 * @see minplayer.players.base#getDuration
 * @return {number} The duration of the loaded media.
 */
minplayer.players.flash.prototype.getDuration = function(callback) {
  var _this = this;
  return this.duration.get(callback, function() {
    return _this.getPlayerDuration();
  });
};
