/** The Drupal namespace. */
Drupal.media = Drupal.media || {};
(function(media) {

  /**
   * @class The base class for all plugins.
   *
   * @param {object} context The jQuery context.
   * @param {object} options This components options.
   */
  media.plugin = function(context, options) {

    // The media player.
    this.player = null;

    // Only call the constructor if we have a context.
    if (context) {
      this.construct();
    }
  };

  /**
   * The constructor which is called once the context is set.
   * Any class deriving from the plugin class should place all context
   * dependant functionality within this function instead of the standard
   * constructor function since it is called on object derivation as well
   * as object creation.
   */
  media.plugin.prototype.construct = function() {
  };

  /**
   * Sets the current media player.
   *
   * @param {object} player The current media player.
   */
  media.plugin.prototype.setPlayer = function(player) {
    this.player = player;
  };
}(Drupal.media));
