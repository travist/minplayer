Drupal.media = Drupal.media ? Drupal.media : {};
(function($, media) {

  media.display = function(context, options) {
    this.display = $(context);
    this.options = options;
  };
  
  media.display.prototype = {
    isValid:function() { 
      return (this.display.length > 0); 
    }
  }
  
})(jQuery, Drupal.media);