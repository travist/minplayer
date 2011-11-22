/** The Drupal namespace. */
Drupal.media = Drupal.media || {};
(function($, media) {

  /** All of the template implementations */
  media.templates = media.templates || {};

  /**
   * @class The base template class which all templates should derive.
   *
   * @extends media.display
   * @param {object} context The jQuery context.
   * @param {object} options This components options.
   */
  media.templates.base = function(context, options) {

    // Derive from display
    media.display.call(this, context, options);
  };

  // Extend the plugin prototype.
  var templatesBase = media.templates.base;
  media.templates.base.prototype = new media.display();

  /**
   * @see media.display#getElements
   */
  media.templates.base.prototype.getElements = function() {
    var elements = media.display.prototype.getElements.call(this);
    return $.extend(elements, {
      player: null,
      display: null,
      media: null
    });
  };

  /**
   * Called when the media player goes into full screen mode.
   *
   * @param {boolean} full TRUE - The player is in fullscreen, FALSE otherwise.
   */
  media.templates.base.prototype.onFullScreen = function(full) {
  };
}(jQuery, Drupal.media));


