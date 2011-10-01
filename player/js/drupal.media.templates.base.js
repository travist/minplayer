Drupal.media = Drupal.media ? Drupal.media : {};
(function($, media) {

  // Define the templates class if need be...
  media.templates = media.templates ? media.templates : {};

  // Templates constructor.
  media.templates.base = function(context, options) {

    // Derive from display
    media.display.call(this, context, options);
  };

  // Extend the plugin prototype.
  media.templates.base.prototype = new media.display();
  media.templates.base.prototype.constructor = media.templates.base;
  media.templates.base.prototype = jQuery.extend(media.templates.base.prototype, {

    /**
     * The template should define the player element.
     */
    getElements: function() {
      var elements = media.display.prototype.getElements.call(this);
      return jQuery.extend(elements, {
        display:null,
        player:null
      });
    },

    /**
     * The player is going into full screen mode.
     */
    onFullScreen:function(full) {

    }
  });
})(jQuery, Drupal.media);


