/**
 * The Flash media player class to control the flash fallback.
 */
Drupal.media = Drupal.media || {};
(function($, media) {
  media.players = media.players || {};

  /**
   * @constructor
   * @extends media.display
   * @param {object} context The jQuery context.
   * @param {object} options This components options.
   */
  media.players.flash = function(context, options, mediaFile) {

    var _this = this, interval = null, durationInterval = null;

    this.duration = 0;

    // Called when the flash player is ready.
    this.onReady = function() {
      this.ready = true;
      this.trigger('loadstart');

      // Perform a check for the duration every second until it shows up.
      durationInterval = setInterval(function() {
        if (_this.getDuration()) {
          clearInterval(durationInterval);
          _this.trigger('durationchange', {duration: _this.getDuration()});
        }
      }, 1000);
    };

    // Called when the flash provides a media update.
    this.onMediaUpdate = function(eventType) {
      if (this.ready) {
        switch (eventType) {
          case 'mediaMeta':
            clearInterval(durationInterval);
            this.trigger('loadeddata');
            this.trigger('loadedmetadata');
            this.trigger('durationchange', {duration: this.getDuration()});
            break;
          case 'mediaPlaying':
            this.trigger('playing');
            interval = setInterval(function() {
              var cTime = _this.getCurrentTime();
              var dur = _this.getDuration();
              var data = {currentTime: cTime, duration: dur};
              _this.trigger('timeupdate', data);
            }, 1000);
            break;
          case 'mediaPaused':
            this.trigger('pause');
            clearInterval(interval);
            break;
        }
      }
    };

    // Derive from players base.
    media.players.base.call(this, context, options, mediaFile);
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

  // Get the priority for this player...
  media.players.flash.getPriority = function() {
    return 1;
  };

  // See if we can play this player.
  media.players.flash.canPlay = function(file) {
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

  // API function to get flash player object.
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
  media.players.flash.prototype = jQuery.extend(media.players.flash.prototype, {

    reset: function() {
      this.ready = false;
      this.duration = 0;
    },

    // Destroy the player.
    destroy: function() {
      this.reset();
    },

    // Return if a player can be found.
    playerFound: function() {
      return (this.display.find('object[playerType="flash"]').length > 0);
    },

    // Create a new flash player.
    create: function() {

      // Reset the variables.
      this.reset();

      // The flash variables for this flash player.
      var flashVars = {
        'id': this.options.id,
        'debug': this.options.settings.debug,
        'config': 'nocontrols',
        'file': this.mediaFile.path,
        'autostart': this.options.settings.autoplay
      };

      // Return a flash media player object.
      return media.players.flash.getFlash({
        swf: this.options.swfplayer,
        id: this.options.id + '_player',
        playerType: 'flash',
        width: this.options.settings.width,
        height: '100%',
        flashvars: flashVars,
        wmode: this.options.wmode
      });
    },

    // Returns the player object.
    getPlayer: function() {

      // IE needs the object, everyone else just needs embed.
      var object = jQuery.browser.msie ? 'object' : 'embed';
      return $(object, this.display).eq(0)[0];
    },

    load: function(file) {
      this.duration = 0;
      media.players.base.prototype.load.call(this, file);
      if (this.player && this.ready) {
        this.player.loadMedia(this.mediaFile.path, this.mediaFile.stream);
      }
    },
    play: function() {
      media.players.base.prototype.play.call(this);
      if (this.player && this.ready) {
        this.player.playMedia();
      }
    },
    pause: function() {
      media.players.base.prototype.pause.call(this);
      if (this.player && this.ready) {
        this.player.pauseMedia();
      }
    },
    stop: function() {
      media.players.base.prototype.stop.call(this);
      if (this.player && this.ready) {
        this.player.stopMedia();
      }
    },
    seek: function(pos) {
      media.players.base.prototype.seek.call(this, pos);
      if (this.player && this.ready) {
        this.player.seekMedia(pos);
      }
    },
    setVolume: function(vol) {
      media.players.base.prototype.setVolume.call(this, vol);
      if (this.player && this.ready) {
        this.player.setVolume(vol);
      }
    },
    getVolume: function() {
      if (this.player && this.ready) {
        return this.player.getVolume();
      }
      else {
        return media.players.base.prototype.getVolume.call(this);
      }
    },
    getDuration: function() {

      // Make sure to cache the duration since it is called often.
      if (this.duration) {
        return this.duration;
      }
      else if (this.player && this.ready) {
        this.duration = this.player.getDuration();
        return this.player.getDuration();
      }
      else {
        return media.players.base.prototype.getDuration.call(this);
      }
    },
    isReady: function() {
      return (this.player && this.ready);
    },
    getCurrentTime: function() {
      return this.isReady() ? this.player.getCurrentTime() : 0;
    },
    getBytesLoaded: function() {
      return this.isReady() ? this.player.getMediaBytesLoaded() : 0;
    },
    getBytesTotal: function() {
      return this.isReady() ? this.player.getMediaBytesTotal() : 0;
    }
  });
}(jQuery, Drupal.media));
