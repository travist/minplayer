Drupal.media = Drupal.media ? Drupal.media : {};
(function($, media) {  
  
  // Make sure media.templates is defined.
  media.templates = media.templates ? media.templates : {};
  
  // Template constructor.
  media.templates["default"] = function(context, options) {
    media.templates.base.call(this, context, options);
    
    // Set the controller to the default controller.
    options.controller = "default";
  };    
  
  /**
   * Define this template prototype.
   */
  media.templates["default"].prototype = new media.templates.base();
  media.templates["default"].prototype.constructor = media.templates["default"];
  media.templates["default"].prototype = jQuery.extend(media.templates["default"].prototype, {});
  
})(jQuery, Drupal.media);