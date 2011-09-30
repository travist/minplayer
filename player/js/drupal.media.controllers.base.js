Drupal.media = Drupal.media ? Drupal.media : {};
(function($, media) {

  // Define the controllers object.
  media.controllers = media.controllers ? media.controllers : {};

  // Templates constructor.
  media.controllers.base = function(context, options) {

    // Derive from plugin
    media.plugin.call(this, context, options);
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
  media.controllers.base.prototype = new media.plugin();
  media.controllers.base.prototype.constructor = media.controllers.base;
  media.controllers.base.prototype = jQuery.extend(media.controllers.base.prototype, {

    // Constructor.
    construct: function() {

      // Call the media plugin constructor.
      media.plugin.prototype.construct.call(this);
    }
  });

})(jQuery, Drupal.media);