/**
 * The Flash media player.
 */
Drupal.media = Drupal.media ? Drupal.media : {};
(function($, player) {
  player = player ? player : {};
  player.players = player.players ? player.players : {};

  // Player constructor.
  player.players.flash = function() {
    player.players.base.call(this);
  };

  // Hook up the media player to the base player.
  player.players.flash.prototype = new player.players.base();
  player.players.flash.constructor = player.players.flash;

  // Define the prototype.
  (function(flash, base) {
    flash.prototype = {
      canPlay: function() {
        switch( this.mediaFile.mimetype ) {
          case "video/mp4":
          case "video/x-webm":
          case "video/quicktime":
          case "video/3gpp2":
          case "video/3gpp":
          case "application/x-shockwave-flash":
          case "audio/mpeg":
          case "audio/mp4":
          case "audio/aac":
          case "audio/vnd.wave":
          case "audio/x-ms-wma":
            return true;

          default:
            return false;
        }
      },
      load: function( file ) {
        base.prototype.load.call(this, file);
      },
      play: function() {
        base.prototype.play.call(this);
      },
      pause: function() {
        base.prototype.pause.call(this);
      },
      stop: function() {
        base.prototype.stop.call(this);
      },
      seek: function( pos ) {
        base.prototype.seek.call(this, pos);
      },
      setVolume: function( vol ) {
        base.prototype.setVolume.call(this, vol);
      },
      getVolume: function() {
        return base.prototype.getVolume.call(this);
      },
      getDuration: function() {
        return base.prototype.getDuration.call(this);
      }
    }
  })( player.players.flash, player.players.base );
})(jQuery, Drupal.media.player);
