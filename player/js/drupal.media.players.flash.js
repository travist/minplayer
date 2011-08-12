Drupal.media = Drupal.media ? Drupal.media : {};
(function($, media) {
  media.players = media.players ? media.players : {};

  // Player constructor.
  media.players.flash = function(context, options) {
    
    // Derive from players base.
    media.players.base.call(this, context, options);
  };

  // Get the priority for this player...
  media.players.flash.getPriority = function() {
    return 1;
  };
  
  // See if we can play this player.
  media.players.flash.canPlay = function(file) {
    switch( file.mimetype ) {
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
  };

  // Define the prototype.
  media.players.flash.prototype = new media.players.base();
  media.players.flash.prototype.constructor = media.players.flash;
  media.players.flash.prototype = jQuery.extend(media.players.flash.prototype, {
    load: function( file ) {
      media.players.base.prototype.load.call(this, file);
    },
    play: function() {
      media.players.base.prototype.play.call(this);
    },
    pause: function() {
      media.players.base.prototype.pause.call(this);
    },
    stop: function() {
      media.players.base.prototype.stop.call(this);
    },
    seek: function( pos ) {
      media.players.base.prototype.seek.call(this, pos);
    },
    setVolume: function( vol ) {
      media.players.base.prototype.setVolume.call(this, vol);
    },
    getVolume: function() {
      return media.players.base.prototype.getVolume.call(this);
    },
    getDuration: function() {
      return media.players.base.prototype.getDuration.call(this);
    }
  });
})(jQuery, Drupal.media);
