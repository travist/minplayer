Drupal.media = Drupal.media ? Drupal.media : {};
(function($, media) {

  // Globally collect all of the elements defined.
  media.elements = {};

  media.display = function(context, options) {

    if (context) {
      this.display = $(context);
      this.options = options;
    }

    // Extend all display elements.
    jQuery.extend(media.elements, this.getElements());

    // Derive from plugin
    media.plugin.call(this, context, options);
  };

  // Define the prototype for all controllers.
  media.display.prototype = new media.plugin();
  media.display.prototype.constructor = media.display;
  media.display.prototype = jQuery.extend(media.display.prototype, {
    getElements:function() { return {}; },
    isValid:function() {
      return (this.display.length > 0);
    }
  });
})(jQuery, Drupal.media);