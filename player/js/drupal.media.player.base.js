/* 
 * Interface class that all the players derive from.
 */
Drupal.media = Drupal.media ? Drupal.media : {};
(function($, player) {
  player = player ? player : {};
  player.players = player.players ? player.players : {};

  // Player constructor.
  player.players.base = function() {
    // The player object.
    this.player = null;

    // The media file object.
    this.mediaFile = null;

    // The trigger function
    this.trigger = function( data ) {
      // Pass this along for jQuery to manage.
      this.display.trigger("mediaupdate", data);
    };

    // The bind function.
    this.bind = function() {
      this.display.bind();
    };
  };

  // Define the prototype.
  player.players.base.prototype = {
    canPlay: function() { return false; },
    load: function( file ) {
      // Reset the player object.
      this.player = null;

      // Get the media player for this file.
      this.mediaFile = new file( file );

      // Clear the display.
      this.display.children().remove();
    },
    play: function() {},
    pause: function() {},
    stop: function() {},
    seek: function( pos ) {},
    setVolume: function( vol ) {},
    getVolume: function() { return 0; },
    getDuration: function() { return 0; }
  }
})(jQuery, Drupal.media.player);


