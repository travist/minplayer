Drupal.media = Drupal.media ? Drupal.media : {};
(function($, media) {
  media.players = media.players ? media.players : {};

  // Player constructor.
  media.players.base = function(context, options) {
    
    // Derive from display
    media.display.call(this, context, options);
    
    // The trigger event.
    this.trigger = function(type, data) {
      this.display.trigger(type, data);
    };      
    
    this.duration = 0;
    this.currentTime = 0;
  };
  
  // Define the priority.
  media.players.base.getPriority = function() {
    return 0;
  };
  
  // See if we can play this media.
  media.players.base.canPlay = function(file) {
    return false;
  };

  // Extend the display prototype.
  media.players.base.prototype = new media.display();
  media.players.base.prototype.constructor = media.players.base;
  media.players.base.prototype = jQuery.extend(media.players.base.prototype, {
    destroy: function() {},
    load: function( file ) {},
    play: function() {},
    pause: function() {},
    stop: function() {},
    seek: function( pos ) {},
    setVolume: function( vol ) {
      this.trigger("volumeupdate", vol);
    },
    getVolume: function() { return 0; },
    getDuration: function() { return 0; }
  });
})(jQuery, Drupal.media);


