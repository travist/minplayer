Drupal.media = Drupal.media ? Drupal.media : {};
(function($, media) {

  // Make sure media.templates is defined.
  media.templates = media.templates ? media.templates : {};

  // Template constructor.
  media.templates["default"] = function(context, options) {

    // Derive from the base template.
    media.templates.base.call(this, context, options);
  };

  /**
   * Define this template prototype.
   */
  media.templates["default"].prototype = new media.templates.base();
  media.templates["default"].prototype.constructor = media.templates["default"];
  media.templates["default"].prototype = jQuery.extend(media.templates["default"].prototype, {
    getElements: function() {
      var elements = media.templates.base.prototype.getElements.call(this);
      return jQuery.extend(elements, {
        player:this.display,
        display:$(".media-player-display", this.display),
        media:$(this.options.id + "-player", this.display)
      });
    }
  });

  // Add this to the media.plugins array.
  media.plugins = media.plugins || [];
  media.plugins.push({
    id:"default_template",
    object:media.templates["default"]
  });

})(jQuery, Drupal.media);