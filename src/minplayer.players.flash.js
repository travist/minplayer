/** The minplayer namespace. */
var minplayer = minplayer || {};

/** All the media player implementations */
minplayer.players = minplayer.players || {};

/**
 * @constructor
 * @extends minplayer.display
 * @class The Flash media player class to control the flash fallback.
 *
 * @param {object} context The jQuery context.
 * @param {object} options This components options.
 */
minplayer.players.flash = function(context, options) {

  // Derive from players base.
  minplayer.players.base.call(this, context, options);
};

/** Derive from minplayer.players.base. */
minplayer.players.flash.prototype = new minplayer.players.base();

/** Reset the constructor. */
minplayer.players.flash.prototype.constructor = minplayer.players.flash;

/**
 * @see minplayer.players.base#getPriority
 * @return {number} The priority of this media player.
 */
minplayer.players.flash.getPriority = function() {
  return 0;
};

/**
 * @see minplayer.players.base#canPlay
 * @return {boolean} If this player can play this media type.
 */
minplayer.players.flash.canPlay = function(file) {
  return false;
};

/**
 * API to return the Flash player code provided params.
 *
 * @param {object} params The params used to populate the Flash code.
 * @return {object} A Flash DOM element.
 */
minplayer.players.flash.getFlash = function(params) {
  // Get the protocol.
  var protocol = window.location.protocol;
  if (protocol.charAt(protocol.length - 1) == ':') {
    protocol = protocol.substring(0, protocol.length - 1);
  }

  // Convert the flashvars object to a string...
  var flashVarsString = jQuery.param(params.flashvars);

  // Get the HTML flash object string.
  var flash = '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" ';
  flash += 'codebase="' + protocol;
  flash += '://fpdownload.macromedia.com';
  flash += '/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" ';
  flash += 'playerType="' + params.playerType + '" ';
  flash += 'width="' + params.width + '" ';
  flash += 'height="' + params.height + '" ';
  flash += 'id="' + params.id + '" ';
  flash += 'name="' + params.id + '"> ';
  flash += '<param name="allowScriptAccess" value="always"></param>';
  flash += '<param name="allowfullscreen" value="true" />';
  flash += '<param name="movie" value="' + params.swf + '"></param>';
  flash += '<param name="wmode" value="' + params.wmode + '"></param>';
  flash += '<param name="quality" value="high"></param>';
  flash += '<param name="FlashVars" value="' + flashVarsString + '"></param>';
  flash += '<embed src="' + params.swf + '" ';
  flash += 'quality="high" ';
  flash += 'width="' + params.width + '" height="' + params.height + '" ';
  flash += 'id="' + params.id + '" name="' + params.id + '" ';
  flash += 'swLiveConnect="true" allowScriptAccess="always" ';
  flash += 'wmode="' + params.wmode + '"';
  flash += 'allowfullscreen="true" type="application/x-shockwave-flash" ';
  flash += 'FlashVars="' + flashVarsString + '" ';
  flash += 'pluginspage="' + protocol;
  flash += '://www.macromedia.com/go/getflashplayer" />';
  flash += '</object>';
  return flash;
};

/**
 * @see minplayer.players.base#playerFound
 * @return {boolean} TRUE - if the player is in the DOM, FALSE otherwise.
 */
minplayer.players.flash.prototype.playerFound = function() {
  return (this.display.find('object[playerType="flash"]').length > 0);
};

/**
 * @see minplayer.players.base#getPlayer
 * @return {object} The media player object.
 */
minplayer.players.flash.prototype.getPlayer = function() {
  // IE needs the object, everyone else just needs embed.
  var object = jQuery.browser.msie ? 'object' : 'embed';
  return jQuery(object, this.display).eq(0)[0];
};
