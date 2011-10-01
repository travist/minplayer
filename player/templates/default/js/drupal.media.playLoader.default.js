Drupal.media = Drupal.media ? Drupal.media : {};
(function($, media) {

  // Define the busy object.
  media.playLoader = media.playLoader ? media.playLoader : {};

  // constructor.
  media.playLoader["default"] = function(context, options) {

    // Derive from busy.base
    media.playLoader.base.call(this, context, options);
  };

  // Define the prototype for all controllers.
  media.playLoader["default"].prototype = new media.playLoader.base();
  media.playLoader["default"].prototype.constructor = media.playLoader["default"];
  media.playLoader["default"].prototype = jQuery.extend(media.playLoader["default"].prototype, {

    // Return the elements
    getElements: function() {
      var elements = media.playLoader.base.prototype.getElements.call(this);
      return jQuery.extend(elements, {
        busy:jQuery(".media-player-loader", this.display),
        bigPlay:jQuery(".media-player-big-play", this.display)
      });
    }
  });

  // Add this to the media.plugins array.
  media.plugins = media.plugins || [];
  media.plugins.push({
    id:"play_loader_default",
    object:media.playLoader["default"],
    element:".media-player-play-loader"
  });
})(jQuery, Drupal.media);