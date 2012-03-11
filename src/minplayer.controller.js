/** The minplayer namespace. */
var minplayer = minplayer || {};

/**
 * @constructor
 * @extends minplayer.display
 * @class This is the base minplayer controller.  Other controllers can derive
 * from the base and either build on top of it or simply define the elements
 * that this base controller uses.
 *
 * @param {object} context The jQuery context.
 * @param {object} options This components options.
 */
minplayer.controller = function(context, options) {

  // Derive from display
  minplayer.display.call(this, 'controller', context, options);
};

/** Derive from minplayer.display. */
minplayer.controller.prototype = new minplayer.display();

/** Reset the constructor. */
minplayer.controller.prototype.constructor = minplayer.controller;

/**
 * A static function that will format a time value into a string time format.
 *
 * @param {integer} time An integer value of time.
 * @return {string} A string representation of the time.
 */
minplayer.formatTime = function(time) {
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

/**
 * @see minplayer.display#getElements
 * @return {object} The elements defined by this display.
 */
minplayer.controller.prototype.getElements = function() {
  var elements = minplayer.display.prototype.getElements.call(this);
  return jQuery.extend(elements, {
    play: null,
    pause: null,
    fullscreen: null,
    seek: null,
    progress: null,
    volume: null,
    timer: null
  });
};

/**
 * @see minplayer.plugin#construct
 */
minplayer.controller.prototype.construct = function() {

  // Call the minplayer plugin constructor.
  minplayer.display.prototype.construct.call(this);

  // Keep track of if we are dragging...
  this.dragging = false;

  // If they have a seek bar.
  if (this.elements.seek) {

    // Create the seek bar slider control.
    this.seekBar = this.elements.seek.slider({
      range: 'min'
    });
  }

  // If they have a volume bar.
  if (this.elements.volume) {

    // Create the volume bar slider control.
    this.volumeBar = this.elements.volume.slider({
      range: 'min',
      orientation: 'vertical'
    });
  }

  // Get the player plugin.
  this.get('player', function(player) {

    // If they have a fullscreen button.
    if (this.elements.fullscreen) {

      // Bind to the click event.
      this.elements.fullscreen.unbind().bind('click', function(e) {

        // Toggle fullscreen mode.
        player.toggleFullScreen();
      }).css({'pointer' : 'hand'});
    }
  });

  // Get the media plugin.
  this.get('media', function(media) {

    var _this = this;

    // If they have a pause button
    if (this.elements.pause) {

      // Bind to the click on this button.
      this.elements.pause.unbind().bind('click', {obj: this}, function(e) {
        e.preventDefault();
        e.data.obj.playPause(false, media);
      });

      // Bind to the pause event of the media.
      media.bind('pause', {obj: this}, function(e) {
        e.data.obj.setPlayPause(true);
      });
    }

    // If they have a play button
    if (this.elements.play) {

      // Bind to the click on this button.
      this.elements.play.unbind().bind('click', {obj: this}, function(e) {
        e.preventDefault();
        e.data.obj.playPause(true, media);
      });

      // Bind to the play event of the media.
      media.bind('playing', {obj: this}, function(e) {
        e.data.obj.setPlayPause(false);
      });
    }

    // If they have a duration, then trigger on duration change.
    if (this.elements.duration) {

      // Bind to the duration change event.
      media.bind('durationchange', {obj: this}, function(e, data) {
        e.data.obj.setTimeString('duration', data.duration);
      });

      // Set the timestring to the duration.
      media.getDuration(function(duration) {
        _this.setTimeString('duration', duration);
      });
    }

    // If they have a progress element.
    if (this.elements.progress) {

      // Bind to the progress event.
      media.bind('progress', {obj: this}, function(e, data) {
        var percent = data.total ? (data.loaded / data.total) * 100 : 0;
        e.data.obj.elements.progress.width(percent + '%');
      });
    }

    // If they have a seek bar or timer, bind to the timeupdate.
    if (this.seekBar || this.elements.timer) {

      // Bind to the time update event.
      media.bind('timeupdate', {obj: this}, function(e, data) {
        if (!e.data.obj.dragging) {
          var value = 0;
          if (data.duration) {
            value = (data.currentTime / data.duration) * 100;
          }

          // Update the seek bar if it exists.
          if (e.data.obj.seekBar) {
            e.data.obj.seekBar.slider('option', 'value', value);
          }

          e.data.obj.setTimeString('timer', data.currentTime);
        }
      });
    }

    // If they have a seekBar element.
    if (this.seekBar) {

      // Register the events for the control bar to control the media.
      this.seekBar.slider({
        start: function(event, ui) {
          _this.dragging = true;
        },
        stop: function(event, ui) {
          _this.dragging = false;
          media.getDuration(function(duration) {
            media.seek((ui.value / 100) * duration);
          });
        },
        slide: function(event, ui) {
          media.getDuration(function(duration) {
            var time = (ui.value / 100) * duration;
            if (!_this.dragging) {
              media.seek(time);
            }
            _this.setTimeString('timer', time);
          });
        }
      });
    }

    // Setup the volume bar.
    if (this.volumeBar) {

      // Create the slider.
      this.volumeBar.slider({
        slide: function(event, ui) {
          media.setVolume(ui.value / 100);
        }
      });

      media.bind('volumeupdate', {obj: this}, function(event, vol) {
        event.data.obj.volumeBar.slider('option', 'value', (vol * 100));
      });

      // Set the volume to match that of the player.
      media.getVolume(function(vol) {
        _this.volumeBar.slider('option', 'value', (vol * 100));
      });
    }
  });

  // We are now ready.
  this.ready();
};

/**
 * Sets the play and pause state of the control bar.
 *
 * @param {boolean} state TRUE - Show Play, FALSE - Show Pause.
 */
minplayer.controller.prototype.setPlayPause = function(state) {
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

/**
 * Plays or pauses the media.
 *
 * @param {bool} state true => play, false => pause.
 * @param {object} media The media player object.
 */
minplayer.controller.prototype.playPause = function(state, media) {
  var type = state ? 'play' : 'pause';
  this.display.trigger(type);
  this.setPlayPause(!state);
  if (media) {
    media[type]();
  }
};

/**
 * Sets the time string on the control bar.
 *
 * @param {string} element The name of the element to set.
 * @param {number} time The total time amount to set.
 */
minplayer.controller.prototype.setTimeString = function(element, time) {
  if (this.elements[element]) {
    this.elements[element].text(minplayer.formatTime(time).time);
  }
};
