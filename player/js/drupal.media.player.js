(function($, media) {
  /*
   * This is the main media player file for the media player.
   *
   * Although this is designed to play HTML5, it will have a pluggable
   * system that will allow any module to implement their own javascript
   * class to implement their own player API's.
   */

  /**
   * Constructor for the media.player
   */
  media.player = function( context ) {

    // The current player.
    this.media = null;

    // The media display.
    this.display = $(context);

    // Define the load function.
    this.load = function( file ) {

      // Empty the current display.
      this.display.empty();

      // Get the media player for this file.
      this.mediaFile = new media.file( file );

      // Now get the player for this file.
      this.media = new this.getPlayer();

      // Now create the media player.
      this.media.loadPlayer();
    };
  }

  /**
   * Define the media player interface.
   */
  media.player.prototype = {
    getPlayer: function() {
      alert('No media players defined!');
      return null;
    },
    loadPlayer: function() {},
    play: function() {
      if( this.media ) {
        this.media.play();
      }
    },
    pause: function() {
      if( this.media ) {
        this.media.pause();
      }
    },
    stop: function() {
      if( this.media ) {
        this.media.stop();
      }
    },
    seek: function( pos ) {
      if( this.media ) {
        this.media.seek(pos);
      }
    },
    setVolume: function( vol ) {
      if( this.media ) {
        this.media.setVolume( vol );
      }
    },
    getVolume: function() { 
      return this.media ? this.media.getVolume() : 0;
    },
    getDuration: function() { 
      return this.media ? this.media.getDuration() : 0;
    }
  };
})(jQuery, (Drupal ? Drupal.media : {}));
