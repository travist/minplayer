Drupal.media = Drupal.media ? Drupal.media : {};
(function($, media) {

  // Define the controllers object.
  media.controllers = media.controllers ? media.controllers : {};

  // Templates constructor.
  media.controllers.base = function(context, options) {

    // Derive from display
    media.display.call(this, context, options);
  };

  /**
   * A static function that will format a time value into a string time format.
   */
  media.formatTime = function(time) {
    time = time ? time : 0;
    var seconds = 0;
    var minutes = 0;
    var hour = 0;

    hour = Math.floor(time / 3600);
    time -= (hour * 3600);
    minutes = Math.floor( time / 60 );
    time -= (minutes * 60);
    seconds = Math.floor(time % 60);

    var timeString = "";

    if( hour ) {
      timeString += String(hour);
      timeString += ":";
    }

    timeString += (minutes >= 10) ? String(minutes) : ("0" + String(minutes));
    timeString += ":";
    timeString += (seconds >= 10) ? String(seconds) : ("0" + String(seconds));
    return {time:timeString,units:""};
  };

  // Define the prototype for all controllers.
  media.controllers.base.prototype = new media.display();
  media.controllers.base.prototype.constructor = media.controllers.base;
  media.controllers.base.prototype = jQuery.extend(media.controllers.base.prototype, {

    // Define elements required by this controller.
    getElements: function() {
      var elements = media.display.prototype.getElements.call(this);
      return jQuery.extend(elements, {
        play:null,
        pause:null,
        fullscreen:null,
        seek:null,
        volume:null,
        timer:null
      });
    },

    // Constructor.
    construct: function() {

      // Call the media plugin constructor.
      media.display.prototype.construct.call(this);

      this.setPlayPause = function(state) {
        if (this.options.elements.play) {
          this.options.elements.play.css('display', state ? 'inherit' : 'none');
        }
        if (this.options.elements.pause) {
          this.options.elements.pause.css('display', state ? 'none' : 'inherit');
        }
      };

      // Play or pause the player.
      this.playPause = function(state) {
        var type = state ? "play" : "pause";
        this.display.trigger(type);
        this.setPlayPause(state);
        if (this.player) {
          this.player[type]();
        }
      };

      // Trigger the controller events.
      if (this.options.elements.play) {
        this.options.elements.play.bind("click", {obj:this}, function(event) {
          event.preventDefault();
          event.data.obj.playPause(true);
        });
      }

      if (this.options.elements.pause) {
        this.options.elements.pause.bind("click", {obj:this}, function(event) {
          event.preventDefault();
          event.data.obj.playPause(false);
        });
      }

      // Fullscreen button.
      var _this = this;
      if (this.options.elements.fullscreen) {
        this.options.elements.fullscreen.css("pointer", "hand").click(function() {
          var isFull = $(_this.options.player.display).hasClass("fullscreen");
          if (isFull) {
            $(_this.options.player.display).removeClass("fullscreen");
          }
          else {
            $(_this.options.player.display).addClass("fullscreen");
          }
        });
      }

      // Add key events to the window.
      $(window).keyup( function( event ) {
        // Escape out of fullscreen if they press ESC or Q.
        var isFull = $(_this.options.player.display).hasClass("fullscreen");
        if (isFull && (event.keyCode == 113 || event.keyCode == 27)) {
          $(_this.options.player.display).removeClass("fullscreen");
        }
      });

      // Create the slider.
      this.dragging = false;

      // Add a seekBar and volumeBar using jQuery UI Slider.
      if (this.options.elements.seek) {
        this.seekBar = this.options.elements.seek.slider({range: "min"});
      }
      if (this.options.elements.volume) {
        this.volumeBar = this.options.elements.volume.slider({range:"min", orientation: "vertical"});
      }
    },

    /**
     * Sets the time string on the control bar.
     */
    setTimeString: function(time) {
      if (this.options.elements.timer) {
        this.options.elements.timer.text(media.formatTime(time).time);
      }
    },

    /**
     * Adds a new media player to this controller.
     */
    setPlayer:function(player) {
      media.display.prototype.setPlayer.call(this, player);
      player.display.bind("pause", {obj:this}, function(event) {
        event.data.obj.setPlayPause(true);
        clearInterval(event.data.obj.interval);
      });
      player.display.bind("playing", {obj:this}, function(event) {
        event.data.obj.setPlayPause(false);
      });
      player.display.bind("durationchange", {obj:this}, function(event, data) {
        event.data.obj.setTimeString(data.duration);
      });
      player.display.bind("timeupdate", {obj:this}, function(event, data) {
        if (!event.data.obj.dragging) {
          var value = data.duration ? (data.currentTime / data.duration)*100 : 0;

          // Update the seek bar if it exists.
          if (event.data.obj.seekBar) {
            event.data.obj.seekBar.slider("option","value",value);
          }

          event.data.obj.setTimeString(data.currentTime);
        }
      });

      // Register the events for the control bar to control the media.
      if (this.seekBar) {
        var _this = this;
        this.seekBar.slider({
          start: function(event,ui) {
            _this.dragging = true;
          },
          stop: function(event,ui) {
            _this.dragging = false;
            var time = (ui.value/100)*player.getDuration();
            player.seek(time);
          },
          slide: function(event,ui) {
            var time = (ui.value/100)*player.getDuration();
            if (!_this.dragging) {
              player.seek(time);
            }

            _this.setTimeString(time);
          }
        });
      }

      // Register the volume bar to adjust the player volume.
      player.setVolume(this.options.volume/100)

      // Setup the volume bar.
      if (this.volumeBar) {
        this.volumeBar.slider("option","value",this.options.volume);
        this.volumeBar.slider({
          slide: function(event,ui) {
            player.setVolume(ui.value/100);
          }
        });
      }
    }
  });

})(jQuery, Drupal.media);