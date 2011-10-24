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
  media.players.youtube = function(context, options, mediaFile) {

    // Derive from players flash.
    media.players.flash.call(this, context, options, mediaFile);

    /** The quality of the YouTube stream. */
    this.quality = 'default';
  };

  // Called when the YouTube player is ready.
  window.onYouTubePlayerReady = function(id) {
    if (media.player[id]) {
      media.player[id].media.onReady();
    }
  };

  /**
   * @see media.plugin.construct
   */
  media.players.youtube.prototype.construct = function() {

    // Call flash constructor.
    media.players.flash.prototype.construct.call(this);

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
   * @see media.players.base#getPriority
   */
  media.players.youtube.getPriority = function() {
    return 10;
  };

  /**
   * @see media.players.base#canPlay
   */
  media.players.youtube.canPlay = function(file) {

    // Check for the mimetype for youtube.
    if (file.mimetype === 'video/youtube') {
      return true;
    }

    // If the path is a YouTube path, then return true.
    return (file.path.search(/^http(s)?\:\/\/(www\.)?youtube\.com/i) === 0);
  };

  // Define the prototype.
  media.players.youtube.prototype = new media.players.flash();
  media.players.youtube.prototype.constructor = media.players.youtube;

  /**
   * @see media.players.base#create
   */
  media.players.youtube.prototype.create = function() {

    media.players.base.prototype.flash.call(this);

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
    return media.players.youtube.getFlash({
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
  media.players.youtube.prototype.regex = function() {
    return /^http[s]?\:\/\/(www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9]+)/i;
  };

  /**
   * @see media.players.base#load
   */
  media.players.youtube.prototype.load = function(file) {
    media.players.flash.prototype.load.call(this, file);
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
   * @see media.players.base#play
   */
  media.players.youtube.prototype.play = function() {
    media.players.flash.prototype.play.call(this);
    if (this.isReady()) {
      this.player.playVideo();
    }
  };

  /**
   * @see media.players.base#pause
   */
  media.players.youtube.prototype.pause = function() {
    media.players.flash.prototype.pause.call(this);
    if (this.isReady()) {
      this.player.pauseVideo();
    }
  };

  /**
   * @see media.players.base#stop
   */
  media.players.youtube.prototype.stop = function() {
    media.players.flash.prototype.stop.call(this);
    if (this.isReady()) {
      this.player.stopVideo();
    }
  };

  /**
   * @see media.players.base#seek
   */
  media.players.youtube.prototype.seek = function(pos) {
    media.players.flash.prototype.seek.call(this, pos);
    if (this.isReady()) {
      this.player.seekTo(pos, true);
    }
  };

  /**
   * @see media.players.base#setVolume
   */
  media.players.youtube.prototype.setVolume = function(vol) {
    media.players.flash.prototype.setVolume.call(this, vol);
    if (this.isReady()) {
      this.player.setVolume(vol * 100);
    }
  };

  /**
   * @see media.players.base#getVolume
   */
  media.players.youtube.prototype.getVolume = function() {
    if (this.isReady()) {
      return (this.player.getVolume() / 100);
    }
    else {
      return media.players.flash.prototype.getVolume.call(this);
    }
  };

  /**
   * @see media.players.flash#getPlayerDuration
   */
  media.players.youtube.prototype.getPlayerDuration = function() {
    return this.isReady() ? this.player.getDuration() : 0;
  };

  /**
   * @see media.players.base#getCurrentTime
   */
  media.players.youtube.prototype.getCurrentTime = function() {
    return this.isReady() ? this.player.getCurrentTime() : 0;
  };

  /**
   * @see media.players.base#getBytesLoaded
   */
  media.players.youtube.prototype.getBytesLoaded = function() {
    return this.isReady() ? this.player.getVideoBytesLoaded() : 0;
  };

  /**
   * @see media.players.base#getBytesTotal
   */
  media.players.youtube.prototype.getBytesTotal = function() {
    return this.isReady() ? this.player.getVideoBytesTotal() : 0;
  };
}(jQuery, Drupal.media));
