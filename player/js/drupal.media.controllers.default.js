Drupal.media = Drupal.media ? Drupal.media : {};
(function($, media) {

  // Define the controllers object.
  media.controllers = media.controllers ? media.controllers : {};

  /**
   * Constructor for the media.controller
   */
  media.controllers["default"] = function( context, options ) {

    // Derive from base controller
    media.controllers.base.call(this, context, options);
  };

  /**
   * Define the controller prototype.
   */
  media.controllers["default"].prototype = new media.controllers.base();
  media.controllers["default"].prototype.constructor = media.controllers["default"];
  media.controllers["default"].prototype = jQuery.extend(media.controllers["default"].prototype, {

    // Constructor
    construct:function() {

      // Call base constructor.
      media.controllers.base.prototype.construct.call(this);

      var playState = false;
      this.setPlayPause = function(state) {
        if (state != playState) {
          playState = state;
          $(this.options.id + "_play", this.display).css('display', state ? 'inherit' : 'none');
          $(this.options.id + "_pause", this.display).css('display', state ? 'none' : 'inherit');
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
      $(this.options.id + "_play", this.display).bind("click", {obj:this}, function(event) {
        event.preventDefault();
        event.data.obj.playPause(true);
      });

      $(this.options.id + "_pause", this.display).bind("click", {obj:this}, function(event) {
        event.preventDefault();
        event.data.obj.playPause(false);
      });

      // Fullscreen button.
      var _this = this;
      $(this.options.id + "_fullscreen").css("pointer", "hand").click(function() {
        var isFull = $(_this.options.player.display).hasClass("fullscreen");
        if (isFull) {
          $(_this.options.player.display).removeClass("fullscreen");
        }
        else {
          $(_this.options.player.display).addClass("fullscreen");
        }
      });

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
      this.timer = $(this.options.id + '_timer');
      this.update = $(this.options.id + '_update');

      // Add a seekBar and volumeBar using jQuery UI Slider.
      this.seekBar = $(this.options.id + '_seek').slider({range: "min"});
      this.volumeBar = $(this.options.id + '_volume').slider({range:"min", orientation: "vertical"});
    },

    /**
     * Adds a new media player to this controller.
     */
    setPlayer:function(player) {
      media.controllers.base.prototype.setPlayer.call(this, player);
      player.display.bind("pause", {obj:this}, function(event) {
        event.data.obj.setPlayPause(true);
        clearInterval(event.data.obj.interval);
      });
      player.display.bind("playing", {obj:this}, function(event) {
        event.data.obj.setPlayPause(false);
      });
      player.display.bind("durationchange", {obj:this}, function(event, data) {
        var timeString = media.formatTime(data.duration).time;
        event.data.obj.timer.text(timeString);
      });
      player.display.bind("timeupdate", {obj:this}, function(event, data) {
        if (!event.data.obj.dragging) {
          var value = data.duration ? (data.currentTime / data.duration)*100 : 0;
          event.data.obj.seekBar.slider("option","value",value);
          var timeString = media.formatTime(data.currentTime).time;
          event.data.obj.timer.text(timeString);
        }
      });

      // Register the events for the control bar to control the media.
      var _this = this;
      this.seekBar.slider({
        start: function(event,ui) {
          console.log("start");
          _this.dragging = true;
        },
        stop: function(event,ui) {
          console.log("stop");
          _this.dragging = false;
          var time = (ui.value/100)*player.getDuration();
          player.seek(time);
        },
        slide: function(event,ui) {
          console.log("slide");
          var time = (ui.value/100)*player.getDuration();
          if (!_this.dragging) {
            player.seek(time);
          }
          var timeString = media.formatTime(time).time;
          _this.timer.text(timeString);
        }
      });

      // Register the volume bar to adjust the player volume.
      player.setVolume(this.options.volume/100)
      this.volumeBar.slider("option","value",this.options.volume);
      this.volumeBar.slider({
        slide: function(event,ui) {
          player.setVolume(ui.value/100);
        }
      });
    }
  });

})(jQuery, Drupal.media);