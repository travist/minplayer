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
  media.players.minplayer = function(context, options, mediaFile) {

    // Called when the flash provides a media update.
    this.onMediaUpdate = function(eventType) {
      if (this.ready) {
        switch (eventType) {
          case 'mediaMeta':
            media.players.flash.prototype.onMeta.call(this);
            break;
          case 'mediaPlaying':
            media.players.flash.prototype.onPlaying.call(this);
            break;
          case 'mediaPaused':
            media.players.flash.prototype.onPaused.call(this);
            break;
        }
      }
    };

    // Derive from players flash.
    media.players.flash.call(this, context, options, mediaFile);
  };

  window.onFlashPlayerReady = function(id) {
    if (media.player[id]) {
      media.player[id].media.onReady();
    }
  };

  window.onFlashPlayerUpdate = function(id, eventType) {
    if (media.player[id]) {
      media.player[id].media.onMediaUpdate(eventType);
    }
  };

  var debugConsole = console || {log: function(data) {}};
  window.onFlashPlayerDebug = function(debug) {
    debugConsole.log(debug);
  };

  /**
   * @see media.players.base#getPriority
   */
  media.players.minplayer.getPriority = function() {
    return 1;
  };

  /**
   * @see media.players.base#canPlay
   */
  media.players.minplayer.canPlay = function(file) {
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

  // Define the prototype.
  media.players.minplayer.prototype = new media.players.flash();
  media.players.minplayer.prototype.constructor = media.players.minplayer;

  /**
   * @see media.players.base#create
   */
  media.players.minplayer.prototype.create = function() {

    media.players.base.prototype.flash.call(this);

    // The flash variables for this flash player.
    var flashVars = {
      'id': this.options.id,
      'debug': this.options.settings.debug,
      'config': 'nocontrols',
      'file': this.mediaFile.path,
      'autostart': this.options.settings.autoplay
    };

    // Return a flash media player object.
    return media.players.minplayer.getFlash({
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
   * @see media.players.base#load
   */
  media.players.minplayer.prototype.load = function(file) {
    media.players.flash.prototype.load.call(this, file);
    if (this.isReady()) {
      this.player.loadMedia(this.mediaFile.path, this.mediaFile.stream);
    }
  };

  /**
   * @see media.players.base#play
   */
  media.players.minplayer.prototype.play = function() {
    media.players.flash.prototype.play.call(this);
    if (this.isReady()) {
      this.player.playMedia();
    }
  };

  /**
   * @see media.players.base#pause
   */
  media.players.minplayer.prototype.pause = function() {
    media.players.flash.prototype.pause.call(this);
    if (this.isReady()) {
      this.player.pauseMedia();
    }
  };

  /**
   * @see media.players.base#stop
   */
  media.players.minplayer.prototype.stop = function() {
    media.players.flash.prototype.stop.call(this);
    if (this.isReady()) {
      this.player.stopMedia();
    }
  };

  /**
   * @see media.players.base#seek
   */
  media.players.minplayer.prototype.seek = function(pos) {
    media.players.flash.prototype.seek.call(this, pos);
    if (this.isReady()) {
      this.player.seekMedia(pos);
    }
  };

  /**
   * @see media.players.base#setVolume
   */
  media.players.minplayer.prototype.setVolume = function(vol) {
    media.players.flash.prototype.setVolume.call(this, vol);
    if (this.isReady()) {
      this.player.setVolume(vol);
    }
  };

  /**
   * @see media.players.base#getVolume
   */
  media.players.minplayer.prototype.getVolume = function() {
    if (this.isReady()) {
      return this.player.getVolume();
    }
    else {
      return media.players.flash.prototype.getVolume.call(this);
    }
  };

  /**
   * @see media.players.flash#getPlayerDuration
   */
  media.players.minplayer.prototype.getPlayerDuration = function() {
    return this.isReady() ? this.player.getDuration() : 0;
  };

  /**
   * @see media.players.base#getCurrentTime
   */
  media.players.minplayer.prototype.getCurrentTime = function() {
    return this.isReady() ? this.player.getCurrentTime() : 0;
  };

  /**
   * @see media.players.base#getBytesLoaded
   */
  media.players.minplayer.prototype.getBytesLoaded = function() {
    return this.isReady() ? this.player.getMediaBytesLoaded() : 0;
  };

  /**
   * @see media.players.base#getBytesTotal
   */
  media.players.minplayer.prototype.getBytesTotal = function() {
    return this.isReady() ? this.player.getMediaBytesTotal() : 0;
  };
}(jQuery, Drupal.media));
