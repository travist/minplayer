/** The Drupal namespace. */
Drupal.media = Drupal.media || {};
(function($, media) {

  /** All the media player implementations */
  media.players = media.players || {};

  /**
   * @class The Flash media player class to control the flash fallback.
   *
   * @extends media.display
   * @param {object} context The jQuery context.
   * @param {object} options This components options.
   */
  media.players.flash = function(context, options, mediaFile) {

    this.durationInterval = null;
    this.mediaInterval = null;
    this.duration = 0;
    this.ready = false;

    // Derive from players base.
    media.players.base.call(this, context, options, mediaFile);
  };

  // Define the prototype.
  media.players.flash.prototype = new media.players.base();
  media.players.flash.prototype.constructor = media.players.flash;

  /**
   * @see media.players.base#getPriority
   */
  media.players.flash.getPriority = function() {
    return 0;
  };

  /**
   * @see media.players.base#canPlay
   */
  media.players.flash.canPlay = function(file) {
    return false;
  };

  /**
   * Called when the player is ready.
   */
  media.players.flash.prototype.onReady = function() {
    var _this = this;
    this.ready = true;
    this.trigger('loadstart');

    // Perform a check for the duration every second until it shows up.
    this.durationInterval = setInterval(function() {
      if (_this.getDuration()) {
        clearInterval(_this.durationInterval);
        _this.trigger('durationchange', {duration: _this.getDuration()});
      }
    }, 1000);
  };

  /**
   * Should be called when the media is playing.
   */
  media.players.flash.prototype.onPlaying = function() {
    var _this = this;
    this.trigger('playing');
    this.mediaInterval = setInterval(function() {
      var cTime = _this.getCurrentTime();
      var dur = _this.getDuration();
      var data = {currentTime: cTime, duration: dur};
      _this.trigger('timeupdate', data);
    }, 1000);
  };

  /**
   * Should be called when the media is paused.
   */
  media.players.flash.prototype.onPaused = function() {
    this.trigger('pause');
    clearInterval(this.mediaInterval);
  };

  /**
   * Should be called when the meta data has finished loading.
   */
  media.players.flash.prototype.onMeta = function() {
    clearInterval(this.durationInterval);
    this.trigger('loadeddata');
    this.trigger('loadedmetadata');
    this.trigger('durationchange', {duration: this.getDuration()});
  };

  /**
   * API to return the Flash player code provided params.
   *
   * @param {object} params The params used to populate the Flash code.
   */
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
      'FlashVars': $.param(params.flashvars)
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

  /**
   * Reset the flash player variables.
   */
  media.players.flash.prototype.reset = function() {
    this.ready = false;
    this.duration = 0;
  };

  /**
   * @see media.players.base#destroy
   */
  media.players.flash.prototype.destroy = function() {
    this.reset();
  };

  /**
   * @see media.players.base#playerFound
   */
  media.players.flash.prototype.playerFound = function() {
    return (this.display.find('object[playerType="flash"]').length > 0);
  };

  /**
   * @see media.players.base#create
   */
  media.players.flash.prototype.create = function() {
    // Reset the variables.
    this.reset();
    return null;
  };

  /**
   * @see media.players.base#getPlayer
   */
  media.players.flash.prototype.getPlayer = function() {
    // IE needs the object, everyone else just needs embed.
    var object = $.browser.msie ? 'object' : 'embed';
    return $(object, this.display).eq(0)[0];
  };

  /**
   * @see media.players.base#load
   */
  media.players.flash.prototype.load = function(file) {
    this.duration = 0;
    media.players.base.prototype.load.call(this, file);
  };

  /**
   * Return the player time duration.
   *
   * @return {int} The player duration.
   */
  media.players.flash.prototype.getPlayerDuration = function() {
    return 0;
  };

  /**
   * @see media.players.base#getDuration
   */
  media.players.flash.prototype.getDuration = function() {

    // Make sure to cache the duration since it is called often.
    if (this.duration) {
      return this.duration;
    }
    else if (this.isReady()) {
      this.duration = this.getPlayerDuration();
      return this.duration;
    }
    else {
      return media.players.base.prototype.getDuration.call(this);
    }
  };

  /**
   * @see media.players.base#isReady
   */
  media.players.flash.prototype.isReady = function() {
    return (this.player && this.ready);
  };
}(jQuery, Drupal.media));
