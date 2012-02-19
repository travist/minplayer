/** The minplayer namespace. */
var minplayer = minplayer || {};

// Default player.
minplayer["default"] = function(context, options) {

  // Derive from minplayer.
  minplayer.call(this, context, options);
};

/**
 * Define this template prototype.
 */
minplayer["default"].prototype = new minplayer();
minplayer["default"].prototype.constructor = minplayer["default"];

// Get the elements for this player.
minplayer["default"].prototype.getElements = function() {
  var elements = minplayer.prototype.getElements.call(this);

  // If the tag is video or audio, then build out the player.
  var tag = this.display.get(0).tagName.toLowerCase();
  if (tag == 'video' || tag == 'audio') {

    // Get the media object from the display.
    var media = this.display.attr({
      'id': this.options.id + '-player',
      'class': 'media-player-media',
      'width': '100%',
      'height': '100%'
    });

    // Wrap the media display around the media element.
    var mediaDisplay = jQuery(document.createElement('div'));
    mediaDisplay.attr('class', 'media-player-display');
    mediaDisplay = media.wrap(mediaDisplay).parent('.media-player-display');

    // Wrap the main player around the media display.
    var playerDisplay = jQuery(document.createElement('div'));
    playerDisplay.attr({
      'id': this.options.id,
      'class': 'media-player'
    });
    playerDisplay = mediaDisplay.wrap(playerDisplay).parent('.media-player');

    // Now set the main display to the playerDisplay.
    this.display = playerDisplay;

    // Also set the main player context to this display.
    var player = this.get('player');
    player.display = playerDisplay;

    // Mark a flag that says this display needs to be built.
    this.display.build = true;
  }

  // Return the jQuery elements.
  return jQuery.extend(elements, {
    player:this.display,
    display:jQuery(".media-player-display", this.display),
    media:jQuery("#" + this.options.id + "-player", this.display),
    error:jQuery('.media-player-error', this.display)
  });
};
