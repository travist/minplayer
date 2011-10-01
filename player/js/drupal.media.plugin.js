Drupal.media = Drupal.media ? Drupal.media : {};
(function($, media) {

  // constructor.
  media.plugin = function(context, options) {

    // The media player.
    this.player = null;

    // Only call the constructor if we have a context.
    if (context) {
      this.construct();
    }
  };

  // Define the prototype for all controllers.
  media.plugin.prototype = jQuery.extend(media.plugin.prototype, {
    construct:function() {},

    /**
     * Sets the media player....
     */
    setPlayer: function(player) {
      this.player = player;
    }
  });
})(jQuery, Drupal.media);