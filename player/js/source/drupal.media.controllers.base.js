/**
 * Drupal.media.controllers.base
 *
 * This is the base media controller.  Other controllers can derive from the
 * base and either build on top of it or simply define the elements that this
 * base controller uses.
 */
Drupal.media = Drupal.media || {};
(function($, media) {

  // Define the controllers object.
  media.controllers = media.controllers || {};

  /**
   * @constructor
   * @extends media.display
   * @param {object} context The jQuery context.
   * @param {object} options This components options.
   */
  media.controllers.base = function(context, options) {

    // Derive from display
    media.display.call(this, context, options);
  }

  /**
   * A static function that will format a time value into a string time format.
   *
   * @param {integer} time An integer value of time.
   * @return {string} A string representation of the time.
   */
  media.formatTime = function(time) {
    time = time || 0;
    var seconds = 0, minutes = 0, hour = 0, timeString = '';

    hour = Math.floor(time / 3600);
    time -= (hour * 3600);
    minutes = Math.floor(time / 60);
    time -= (minutes * 60);
    seconds = Math.floor(time % 60);

    if (hour) {
      timeString += String(hour);
      timeString += ':';
    }

    timeString += (minutes >= 10) ? String(minutes) : ('0' + String(minutes));
    timeString += ':';
    timeString += (seconds >= 10) ? String(seconds) : ('0' + String(seconds));
    return {time: timeString, units: ''};
  };

  // Define the prototype for all controllers.
  var controllersBase = media.controllers.base;
  controllersBase.prototype = new media.display();
  controllersBase.prototype.constructor = controllersBase;
  controllersBase.prototype = jQuery.extend(controllersBase.prototype, {

    /**
     * @see media.display.getElements
     */
    getElements: function() {
      var elements = media.display.prototype.getElements.call(this);
      return jQuery.extend(elements, {
        play: null,
        pause: null,
        fullscreen: null,
        seek: null,
        volume: null,
        timer: null
      });
    },

    /**
     * @see media.plugin.construct
     */
    construct: function() {

      // Call the media plugin constructor.
      media.display.prototype.construct.call(this);

      this.setPlayPause = function(state) {
        var css = '';
        if (this.elements.play) {
          css = state ? 'inherit' : 'none';
          this.elements.play.css('display', css);
        }
        if (this.elements.pause) {
          css = state ? 'none' : 'inherit';
          this.elements.pause.css('display', css);
        }
      };

      // Play or pause the player.
      this.playPause = function(state) {
        var type = state ? 'play' : 'pause';
        this.display.trigger(type);
        this.setPlayPause(state);
        if (this.player) {
          this.player[type]();
        }
      };

      // Trigger the controller events.
      if (this.elements.play) {
        this.elements.play.bind('click', {obj: this}, function(event) {
          event.preventDefault();
          event.data.obj.playPause(true);
        });
      }

      if (this.elements.pause) {
        this.elements.pause.bind('click', {obj: this}, function(event) {
          event.preventDefault();
          event.data.obj.playPause(false);
        });
      }

      // Fullscreen button.
      var _this = this, sliderOptions = {};
      if (this.elements.fullscreen) {
        this.elements.fullscreen.click(function() {
          var isFull = $(_this.options.player.display).hasClass('fullscreen');
          if (isFull) {
            $(_this.options.player.display).removeClass('fullscreen');
          }
          else {
            $(_this.options.player.display).addClass('fullscreen');
          }
        }).css({'pointer' : 'hand'});
      }

      // Add key events to the window.
      $(window).keyup(function(event) {
        // Escape out of fullscreen if they press ESC or Q.
        var isFull = $(_this.options.player.display).hasClass('fullscreen');
        if (isFull && (event.keyCode === 113 || event.keyCode === 27)) {
          $(_this.options.player.display).removeClass('fullscreen');
        }
      });

      // Create the slider.
      this.dragging = false;

      // Add a seekBar and volumeBar using jQuery UI Slider.
      if (this.elements.seek) {
        this.seekBar = this.elements.seek.slider({range: 'min'});
      }
      if (this.elements.volume) {
        sliderOptions = {range: 'min', orientation: 'vertical'};
        this.volumeBar = this.elements.volume.slider(sliderOptions);
      }
    },

    /**
     * Sets the time string on the control bar.
     *
     * @param {string} element The name of the element to set.
     * @param {number} time The total time amount to set.
     */
    setTimeString: function(element, time) {
      if (this.elements[element]) {
        this.elements[element].text(media.formatTime(time).time);
      }
    },

    /**
     * @see media.plugin.setPlayer
     */
    setPlayer: function(player) {
      media.display.prototype.setPlayer.call(this, player);
      player.display.bind('pause', {obj: this}, function(event) {
        event.data.obj.setPlayPause(true);
        clearInterval(event.data.obj.interval);
      });
      player.display.bind('playing', {obj: this}, function(event) {
        event.data.obj.setPlayPause(false);
      });
      player.display.bind('durationchange', {obj: this}, function(event, data) {
        event.data.obj.setTimeString('duration', data.duration);
      });
      player.display.bind('timeupdate', {obj: this}, function(event, data) {
        if (!event.data.obj.dragging) {
          var value = 0;
          if (data.duration) {
            value = (data.currentTime / data.duration) * 100;
          }

          // Update the seek bar if it exists.
          if (event.data.obj.seekBar) {
            event.data.obj.seekBar.slider('option', 'value', value);
          }

          event.data.obj.setTimeString('timer', data.currentTime);
        }
      });

      // Register the events for the control bar to control the media.
      if (this.seekBar) {
        var _this = this;
        this.seekBar.slider({
          start: function(event, ui) {
            _this.dragging = true;
          },
          stop: function(event, ui) {
            _this.dragging = false;
            var time = (ui.value / 100) * player.getDuration();
            player.seek(time);
          },
          slide: function(event, ui) {
            var time = (ui.value / 100) * player.getDuration();
            if (!_this.dragging) {
              player.seek(time);
            }

            _this.setTimeString('timer', time);
          }
        });
      }

      // Register the volume bar to adjust the player volume.
      player.setVolume(this.options.volume / 100);

      // Setup the volume bar.
      if (this.volumeBar) {
        this.volumeBar.slider('option', 'value', this.options.volume);
        this.volumeBar.slider({
          slide: function(event, ui) {
            player.setVolume(ui.value / 100);
          }
        });
      }
    }
  });

}(jQuery, Drupal.media));
