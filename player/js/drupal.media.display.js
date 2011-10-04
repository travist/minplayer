Drupal.media = Drupal.media ? Drupal.media : {};
(function($, media) {

  media.display = function(context, options) {

    if (context) {

      // Set the display and options.
      this.display = $(context);
      this.options = options;

      // Extend all display elements.
      this.options.elements = this.options.elements || {};
      jQuery.extend(this.options.elements, this.getElements());
    }

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