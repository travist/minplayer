/**
 * The html5 media player.
 */
(function($, player) {
  player = player ? player : {};
  player.players = player.players ? player.players : {};

  // Player constructor.
  player.players.html5 = function() {
    player.players.base.call(this);
  };

  // Hook up the media player to the base player.
  player.players.html5.prototype = new player.players.base();
  player.players.html5.constructor = player.players.html5;

  // Define the prototype.
  (function(html5, base) {
    html5.prototype = {
      canPlay: function() {
        switch( this.mediaFile.mimetype ) {
          case "video/ogg":
            return Drupal.media.compatibility().videoOGG;
          case "video/mp4":
            return Drupal.media.compatibility().videoH264;
          case "video/x-webm":
            return Drupal.media.compatibility().videoWEBM;
          case "audio/ogg":
            return Drupal.media.compatibility().audioOGG;
          case "audio/mpeg":
            return Drupal.media.compatibility().audioMP3;
          case "audio/mp4":
            return Drupal.media.compatibility().audioMP4;
          default:
            return false;
        }
      },
      load: function( file ) {
        // Always call the base first on load...
        base.prototype.load.call(this, file);

        // Create our html player.
        var id = 'player' + Math.random();
        var html = '<' + this.mediaFile.type + ' style="position:absolute" id="' + id + '"';
        html += (this.mediaFile.type == "video") ? ' width="100%" height="100%"' : '';
        html += ' src="' + this.mediaFile.path + '">Unable to display media.';
        html += '</' + this.mediaFile.type + '>';
        this.display.append( html );

        // Now create the media elements.
        this.display.append(html);

        // Now set the player object.
        this.player = this.display.find('#' + id).eq(0)[0];

        // Now bind to the events.
        if( this.player ) {
          this.player.addEventListener( "abort", function() {
            this.trigger({type:"stopped"});
          }, true);
          this.player.addEventListener( "loadstart", function() {
            this.trigger({type:"ready"});
          }, true);
          this.player.addEventListener( "loadeddata", function() {
            this.trigger({type:"loaded", busy:"hide"});
          }, true);
          this.player.addEventListener( "loadedmetadata", function() {
            this.trigger({type:"meta"});
          }, true);
          this.player.addEventListener( "canplaythrough", function() {
            this.trigger({type:"canplay", busy:"hide"});
          }, true);
          this.player.addEventListener( "ended", function() {
            this.trigger({type:"complete"});
          }, true);
          this.player.addEventListener( "pause", function() {
            this.trigger({type:"paused"});
          }, true);
          this.player.addEventListener( "play", function() {
            this.trigger({type:"playing"});
          }, true);
          this.player.addEventListener( "playing", function() {
            this.trigger({type:"playing", busy:"hide"});
          }, true);
          this.player.addEventListener( "error", function() {
            this.trigger({type:"error"});
          }, true);
          this.player.addEventListener( "waiting", function() {
            this.trigger({type:"waiting", busy:"show"});
          }, true);
          this.player.addEventListener( "timeupdate", function() {
            this.trigger({type:"timeupdate", busy:"hide"});
          }, true);
          this.player.addEventListener( "durationchange", function() {
            this.trigger({type:"durationupdate", duration:this.duration});
          }, true);
          this.player.addEventListener( "progress", function( event ) {
            this.trigger({type:"progress", loaded:event.loaded, total:event.total});
          }, true);

          if (typeof this.player.hasAttribute == "function" && this.player.hasAttribute("preload") && this.player.preload != "none") {
            this.player.autobuffer = true;
          } else {
            this.player.autobuffer = false;
            this.player.preload = "none";
          }
        }
      },
      play: function() {
        base.prototype.play.call(this);
        this.player.play();
      },
      pause: function() {
        base.prototype.pause.call(this);
        this.player.pause();
      },
      stop: function() {
        base.prototype.stop.call(this);
        this.media.pause();
        this.player.src = '';
      },
      seek: function( pos ) {
        base.prototype.seek.call(this, pos);
        this.player.currentTime = pos;
      },
      setVolume: function( vol ) {
        base.prototype.setVolume.call(this, vol);
        this.player.volume = vol;
      },
      getVolume: function() {
        return this.player.volume;
      },
      getDuration: function() {
        var dur = this.player.duration;
        return (dur === Infinity) ? 0 : dur;
      }
    }
  })( player.players.html5, player.players.base );
})(jQuery, (Drupal.media ? Drupal.media.player : {}));
