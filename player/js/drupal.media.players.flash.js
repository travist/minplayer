Drupal.media = Drupal.media ? Drupal.media : {};
(function($, media) {
  media.players = media.players ? media.players : {};

  // Player constructor.
  media.players.flash = function(context, options, mediaFile) {

    // Derive from players base.
    media.players.base.call(this, context, options, mediaFile);
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

  // API function to get flash player object.
  media.players.flash.getFlash = function( swf, id, playerType, width, height, flashvars, wmode ) {
    // Get the protocol.
    var protocol = window.location.protocol;
    if (protocol.charAt(protocol.length - 1) == ':') {
      protocol = protocol.substring(0, protocol.length - 1);
    }

    // Convert the flashvars object to a string...
    var flashVarsString = jQuery.param(flashvars);

    // Create an object element.
    var element = document.createElement('object');
    element.setAttribute('classid', 'clsid:d27cdb6e-ae6d-11cf-96b8-444553540000');
    element.setAttribute('codebase', protocol + '://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0');
    element.setAttribute('width', width);
    element.setAttribute('height', height);
    element.setAttribute('id', id);
    element.setAttribute('name', id);
    element.setAttribute('playerType', playerType);

    // Setup a params array to make the param additions eaiser.
    var params = {
      "allowScriptAccess":"always",
      "allowfullscreen":"true",
      "movie":swf,
      "wmode":wmode,
      "quality":"high",
      "FlashVars":flashVarsString
    };

    // Add the parameters.
    var paramKey = '';
    var param = null;
    for (paramKey in params) {
      param = document.createElement('param');
      param.setAttribute('name', paramKey);
      param.setAttribute('value', params[paramKey]);
      element.appendChild(param);
    }

    // Add the embed element.
    var embed = document.createElement('embed');
    for (paramKey in params) {
      embed.setAttribute((paramKey === 'movie') ? 'src' : paramKey, params[paramKey]);
    }

    embed.setAttribute('width', width);
    embed.setAttribute('height', height);
    embed.setAttribute('id', id);
    embed.setAttribute('name', id);
    embed.setAttribute('swLiveConnect', 'true');
    embed.setAttribute('type', 'application/x-shockwave-flash');
    embed.setAttribute('pluginspage', protocol + '://www.macromedia.com/go/getflashplayer');
    element.appendChild(embed);
    return element;
  };

  // Define the prototype.
  media.players.flash.prototype = new media.players.base();
  media.players.flash.prototype.constructor = media.players.flash;
  media.players.flash.prototype = jQuery.extend(media.players.flash.prototype, {

    // Return if a player can be found.
    playerFound: function() {
      return (this.display.find('object[playerType="flash"]').length > 0);
    },

    // Create a new flash player.
    create: function() {

      // The flash variables for this flash player.
      var flashVars = {
        'config':'nocontrols',
        'file':this.mediaFile.path,
        'autostart':this.options.settings.autoplay
      };

      // Return a flash media player object.
      return media.players.flash.getFlash(
        this.options.swfplayer,
        this.options.id + "_player",
        "flash",
        this.options.settings.width,
        this.options.settings.height,
        flashVars,
        this.options.wmode
      );
    },

    // Returns the player object.
    getPlayer: function() {

      // IE needs the object, everyone else just needs embed.
      var object = jQuery.browser.msie ? 'object' : 'embed';
      return $(object, this.display).eq(0)[0];
    },

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
