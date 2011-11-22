/** The Drupal namespace. */
Drupal.media = Drupal.media || {};
(function($, media) {

  /** All the media player implementations */
  media.players = media.players || {};

  /**
   * @class The HTML5 media player implementation.
   *
   * @extends media.display
   * @param {object} context The jQuery context.
   * @param {object} options This components options.
   */
  media.players.html5 = function(context, options, mediaFile) {

    // Derive players base.
    media.players.base.call(this, context, options, mediaFile);
  };

  // Define the prototype.
  media.players.html5.prototype = new media.players.base();
  media.players.html5.prototype.constructor = media.players.html5;

  /**
   * @see media.players.base#getPriority
   */
  media.players.html5.getPriority = function() {
    return 10;
  };

  /**
   * @see media.players.base#canPlay
   */
  media.players.html5.canPlay = function(file) {
    switch (file.mimetype) {
      case 'video/ogg':
        return media.playTypes.videoOGG;
      case 'video/mp4':
        return media.playTypes.videoH264;
      case 'video/x-webm':
        return media.playTypes.videoWEBM;
      case 'audio/ogg':
        return media.playTypes.audioOGG;
      case 'audio/mpeg':
        return media.playTypes.audioMP3;
      case 'audio/mp4':
        return media.playTypes.audioMP4;
      default:
        return false;
    }
  };

  /**
   * @see media.plugin.construct
   */
  media.players.html5.prototype.construct = function() {

    // Call base constructor.
    media.players.base.prototype.construct.call(this);

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

  // Determine if this player is able to autobuffer.
  media.players.html5.prototype.autoBuffer = function() {
    var preload = this.player.preload !== 'none';
    if (typeof this.player.hasAttribute === 'function') {
      return this.player.hasAttribute('preload') && preload;
    }
    else {
      return false;
    }
  };

  /**
   * @see media.players.base#playerFound
   */
  media.players.html5.prototype.playerFound = function() {
    return (this.display.find(this.mediaFile.type).length > 0);
  };

  /**
   * @see media.players.base#create
   */
  media.players.html5.prototype.create = function() {
    var element = document.createElement(this.mediaFile.type), attribute = '';
    for (attribute in this.options.attributes) {
      if (this.options.attributes.hasOwnProperty(attribute)) {
        element.setAttribute(attribute, this.options.attributes[attribute]);
      }
    }
    return element;
  };

  /**
   * @see media.players.base#getPlayer
   */
  media.players.html5.prototype.getPlayer = function() {
    return this.options.elements.media.eq(0)[0];
  };

  /**
   * @see media.players.base#load
   */
  media.players.html5.prototype.load = function(file) {
    // Always call the base first on load...
    media.players.base.prototype.load.call(this, file);

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
   * @see media.players.base#play
   */
  media.players.html5.prototype.play = function() {
    media.players.base.prototype.play.call(this);
    this.player.play();
  };

  /**
   * @see media.players.base#pause
   */
  media.players.html5.prototype.pause = function() {
    media.players.base.prototype.pause.call(this);
    this.player.pause();
  };

  /**
   * @see media.players.base#stop
   */
  media.players.html5.prototype.stop = function() {
    media.players.base.prototype.stop.call(this);
    this.media.pause();
    this.player.src = '';
  };

  /**
   * @see media.players.base#seek
   */
  media.players.html5.prototype.seek = function(pos) {
    media.players.base.prototype.seek.call(this, pos);
    this.player.currentTime = pos;
  };

  /**
   * @see media.players.base#setVolume
   */
  media.players.html5.prototype.setVolume = function(vol) {
    media.players.base.prototype.setVolume.call(this, vol);
    this.player.volume = vol;
  };

  /**
   * @see media.players.base#getVolume
   */
  media.players.html5.prototype.getVolume = function() {
    return this.player.volume;
  };

  /**
   * @see media.players.base#getDuration
   */
  media.players.html5.prototype.getDuration = function() {
    var dur = this.player.duration;
    return (dur === Infinity) ? 0 : dur;
  };
}(jQuery, Drupal.media));
