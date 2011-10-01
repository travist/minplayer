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

    // Return the elements
    getElements: function() {
      var elements = media.controllers.base.prototype.getElements.call(this);
      return jQuery.extend(elements, {
        play:jQuery(".media-player-play", this.display),
        pause:jQuery(".media-player-pause", this.display),
        fullscreen:jQuery(".media-player-fullscreen", this.display),
        seek:jQuery(".media-player-seek", this.display),
        volume:jQuery(".media-player-volume-slider", this.display),
        timer:jQuery(".media-player-timer", this.display)
      });
    }
  });

  // Add this to the media.plugins array.
  media.plugins = media.plugins || [];
  media.plugins.push({
    id:"controller_default",
    object:media.controllers["default"],
    element:".media-player-controls"
  });
})(jQuery, Drupal.media);