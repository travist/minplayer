Drupal.media = Drupal.media ? Drupal.media : {};
(function($, media) {
  
  // Define the templates class if need be...
  media.templates = media.templates ? media.templates : {};
  
  // Templates constructor.
  media.templates.base = function(context, options) {
    
    // The template options.
    this.options = options;
    
    // The media player.
    this.player = null;
  };

  // Define the prototype for all templates.
  media.templates.base.prototype = {
  
    /**
     * Sets the new media player.
     */
    setPlayer:function(player) {
      this.player = player;
    }
  }
})(jQuery, Drupal.media);


