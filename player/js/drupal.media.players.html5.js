Drupal.media = Drupal.media ? Drupal.media : {};
(function($, media) {
  media.players = media.players ? media.players : {};

  // Player constructor.
  media.players.html5 = function(context, options, mediaFile) {

    // Derive players base.
    media.players.base.call(this, context, options, mediaFile);
  };

  // Get the priority for this player...
  media.players.html5.getPriority = function() {
    return 10;
  };

  // See if we can play this player.
  media.players.html5.canPlay = function(file) {
    return false;
    switch (file.mimetype) {
      case "video/ogg":
        return media.playTypes.videoOGG;
      case "video/mp4":
        return media.playTypes.videoH264;
      case "video/x-webm":
        return media.playTypes.videoWEBM;
      case "audio/ogg":
        return media.playTypes.audioOGG;
      case "audio/mpeg":
        return media.playTypes.audioMP3;
      case "audio/mp4":
        return media.playTypes.audioMP4;
      default:
        return false;
    }
  };

  // Define the prototype.
  media.players.html5.prototype = new media.players.base();
  media.players.html5.prototype.constructor = media.players.html5;
  media.players.html5.prototype = jQuery.extend(media.players.html5.prototype, {

    // Constructor
    construct: function() {

      // Call base constructor.
      media.players.base.prototype.construct.call(this);

      // See if we are loaded.
      this.loaded = false;

      // Store the this pointer...
      var _this = this;

      // For the HTML5 player, we will just pass events along...
      if( this.player ) {
        this.player.addEventListener( "abort", function() {
          _this.trigger("abort");
        }, true);
        this.player.addEventListener( "loadstart", function() {
          _this.trigger("loadstart");
        }, true);
        this.player.addEventListener( "loadeddata", function() {
          _this.trigger("loadeddata");
        }, true);
        this.player.addEventListener( "loadedmetadata", function() {
          _this.trigger("loadedmetadata");
        }, true);
        this.player.addEventListener( "canplaythrough", function() {
          _this.trigger("canplaythrough");
        }, true);
        this.player.addEventListener( "ended", function() {
          _this.trigger("ended");
        }, true);
        this.player.addEventListener( "pause", function() {
          _this.trigger("pause");
        }, true);
        this.player.addEventListener( "play", function() {
          _this.trigger("play");
        }, true);
        this.player.addEventListener( "playing", function() {
          _this.trigger("playing");
        }, true);
        this.player.addEventListener( "error", function() {
          _this.trigger("error");
        }, true);
        this.player.addEventListener( "waiting", function() {
          _this.trigger("waiting");
        }, true);
        this.player.addEventListener( "timeupdate", function(event) {
          _this.duration = this.duration;
          _this.currentTime = this.currentTime;
          _this.trigger("timeupdate", {currentTime:this.currentTime, duration:this.duration});
        }, true);
        this.player.addEventListener( "durationchange", function() {
          _this.duration = this.duration;
          _this.trigger("durationchange", {duration:this.duration});
        }, true);
        this.player.addEventListener( "progress", function( event ) {
          _this.trigger("progress", {loaded:event.loaded, total:event.total});
        }, true);

        if (typeof this.player.hasAttribute == "function" && this.player.hasAttribute("preload") && this.player.preload != "none") {
          this.player.autobuffer = true;
        } else {
          this.player.autobuffer = false;
          this.player.preload = "none";
        }
      }
    },

    // Return if a player can be found.
    playerFound: function() {
      return (this.display.find(this.mediaFile.type).length > 0);
    },

    // Create a new <video> or <audio> element.
    create: function() {
      var element = document.createElement(this.mediaFile.type);
      var attribute = '';
      for (attribute in this.options.attributes) {
        element.setAttribute(attribute, attributes[attribute]);
      }
      return element;
    },

    // Returns the player object.
    getPlayer: function() {
      return $(this.playerId, this.display).eq(0)[0];
    },

    load: function( file ) {
      // Always call the base first on load...
      media.players.base.prototype.load.call(this, file);

      if (this.loaded) {
        // Change the source...
        var code = '<source src="' + file.path + '" type="' + file.mimetype + '"';
        code += file.codecs ? ' codecs="' + file.path + '">' : '>';
        $(this.options.id + "_player").attr('src', '').empty().html(code);
      }

      // Set the loaded flag.
      this.loaded = true;
    },
    play: function() {
      media.players.base.prototype.play.call(this);
      this.player.play();
    },
    pause: function() {
      media.players.base.prototype.pause.call(this);
      this.player.pause();
    },
    stop: function() {
      media.players.base.prototype.stop.call(this);
      this.media.pause();
      this.player.src = '';
    },
    seek: function( pos ) {
      media.players.base.prototype.seek.call(this, pos);
      this.player.currentTime = pos;
    },
    setVolume: function( vol ) {
      media.players.base.prototype.setVolume.call(this, vol);
      this.player.volume = vol;
    },
    getVolume: function() {
      return this.player.volume;
    },
    getDuration: function() {
      var dur = this.player.duration;
      return (dur === Infinity) ? 0 : dur;
    }
  });
})(jQuery, Drupal.media);
