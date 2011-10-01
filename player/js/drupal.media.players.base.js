Drupal.media = Drupal.media ? Drupal.media : {};
(function($, media) {
  media.players = media.players ? media.players : {};

  // Player constructor.
  media.players.base = function(context, options, mediaFile) {

    // Store the media file.
    this.mediaFile = mediaFile;

    // Derive from display
    media.display.call(this, context, options);
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
    construct: function() {

      // Call the media display constructor.
      media.display.prototype.construct.call(this);

      // Get the player display object.
      if (!this.playerFound()) {

        // Cleanup some events and code.
        this.display.unbind();

        // Remove the media element if found
        if (media.elements.player) {
          media.elements.player.remove();
        }

        // Create a new media player element.
        this.display.html(this.create());
      }

      // Get the player object...
      this.player = this.getPlayer();

      // The trigger event.
      this.trigger = function(type, data) {
        this.display.trigger(type, data);
      };

      this.duration = 0;
      this.currentTime = 0;
    },
    playerFound: function() { return false; },
    create: function() { return null; },
    getPlayer: function() { return null; },
    destroy: function() {},
    load: function( file ) {

      // Store the media file for future lookup.
      this.mediaFile = file;
    },
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


