/**
 * The base template class which all templates should derive.
 */
Drupal.media = Drupal.media || {};
(function($, media) {

  // Define the templates class if need be...
  media.templates = media.templates || {};

  /**
   * @constructor
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
  templatesBase.prototype = new media.display();
  templatesBase.prototype.constructor = templatesBase;
  templatesBase.prototype = jQuery.extend(templatesBase.prototype, {

    /**
     * @see media.display.getElements
     */
    getElements: function() {
      var elements = media.display.prototype.getElements.call(this);
      return jQuery.extend(elements, {
        display: null,
        player: null
      });
    },

    /**
     * The player is going into full screen mode.
     */
    onFullScreen: function(full) {

    }
  });
}(jQuery, Drupal.media));


