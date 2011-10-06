/**
 * The base class for all plugins.
 */
Drupal.media = Drupal.media || {};
(function($, media) {

  /**
   * @constructor
   */
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

    /**
     * The constructor which is called once the context is set.
     * Any class deriving from the plugin class should place all context
     * dependant functionality within this function instead of the standard
     * constructor function since it is called on object derivation as well
     * as object creation.
     */
    construct: function() {},

    /**
     * Sets the current media player.
     *
     * @param {object} player The current media player.
     */
    setPlayer: function(player) {
      this.player = player;
    }
  });
}(jQuery, Drupal.media));
