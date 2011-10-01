Drupal.media = Drupal.media ? Drupal.media : {};
(function($, media) {

  // constructor.
  media.className = function(context, options) {

    // Derive from display
    media.display.call(this, context, options);
  };

  // Define the prototype.
  media.className.prototype = new media.display();
  media.className.prototype.constructor = media.className;
  media.className.prototype = jQuery.extend(media.className.prototype, {


  });
})(jQuery, Drupal.media);