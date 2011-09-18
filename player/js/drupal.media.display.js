Drupal.media = Drupal.media ? Drupal.media : {};
(function($, media) {

  media.display = function(context, options) {
    if (context) {
      this.display = $(context);
      this.options = options;
      this.construct();
    }
  };

  media.display.prototype = {
    construct:function() {},
    isValid:function() {
      return (this.display.length > 0);
    }
  }

})(jQuery, Drupal.media);