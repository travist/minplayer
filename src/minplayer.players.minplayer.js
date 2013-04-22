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
 * @param {object} queue The event queue to pass events around.
 */
minplayer.players.minplayer = function(context, options, queue) {

  // Derive from players flash.
  minplayer.players.flash.call(this, context, options, queue);
};

/** Derive from minplayer.players.flash. */
minplayer.players.minplayer.prototype = new minplayer.players.flash();

/** Reset the constructor. */
minplayer.players.minplayer.prototype.constructor = minplayer.players.minplayer;

/**
 * @see minplayer.plugin.construct
 * @this minplayer.players.minplayer
 */
minplayer.players.minplayer.prototype.construct = function() {

  // Call the players.flash constructor.
  minplayer.players.flash.prototype.construct.call(this);

  // Set the plugin name within the options.
  this.options.pluginName = 'minplayer';
};

/**
 * Called when the Flash player is ready.
 *
 * @param {string} id The media player ID.
 */
window.onFlashPlayerReady = function(id) {
  var media = minplayer.get(id, 'media');
  var i = media.length;
  while (i--) {
    media[i].onReady();
  }
};

/**
 * Called when the Flash player updates.
 *
 * @param {string} id The media player ID.
 * @param {string} eventType The event type that was triggered.
 */
window.onFlashPlayerUpdate = function(id, eventType) {
  var media = minplayer.get(id, 'media');
  var i = media.length;
  while (i--) {
    media[i].onMediaUpdate(eventType);
  }
};

/**
 * Used to debug from the Flash player to the browser console.
 *
 * @param {string} debug The debug string.
 */
window.onFlashPlayerDebug = function(debug) {
  if (console && console.log) {
    console.log(debug);
  }
};

/**
 * @see minplayer.players.base#getPriority
 * @param {object} file A {@link minplayer.file} object.
 * @return {number} The priority of this media player.
 */
minplayer.players.minplayer.getPriority = function(file) {
  // Force this player if the stream is set.
  return file.stream ? 100 : 1;
};

/**
 * @see minplayer.players.base#canPlay
 * 
 * @param {object} file A {@link minplayer.file} object.
 * @return {boolean} If this player can play this media type.
 */
minplayer.players.minplayer.canPlay = function(file) {

  // If this has a stream, then the minplayer must play it.
  if (file.stream) {
    return true;
  }

  var isWEBM = jQuery.inArray(file.mimetype, [
    'video/x-webm',
    'video/webm',
    'application/octet-stream'
  ]) >= 0;
  return !isWEBM && (file.type === 'video' || file.type === 'audio');
};

/**
 * @see minplayer.players.base#create
 * @return {object} The media player entity.
 */
minplayer.players.minplayer.prototype.createPlayer = function() {

  // Make sure we provide default swfplayer...
  if (!this.options.swfplayer) {
    this.options.swfplayer = 'http://mediafront.org/assets/osmplayer/minplayer';
    this.options.swfplayer += '/flash/minplayer.swf';
  }

  minplayer.players.flash.prototype.createPlayer.call(this);

  // The flash variables for this flash player.
  var flashVars = {
    'id': this.options.id,
    'debug': this.options.debug,
    'config': 'nocontrols',
    'file': this.mediaFile.path,
    'autostart': this.options.autoplay,
    'autoload': this.options.autoload
  };

  // Add a stream if one is provided.
  if (this.mediaFile.stream) {
    flashVars.stream = this.mediaFile.stream;
  }

  // Return a flash media player object.
  return this.getFlash({
    swf: this.options.swfplayer,
    id: this.options.id + '_player',
    width: '100%',
    height: '100%',
    flashvars: flashVars,
    wmode: this.options.wmode
  });
};

/**
 * Called when the Flash player has an update.
 *
 * @param {string} eventType The event that was triggered in the player.
 */
minplayer.players.minplayer.prototype.onMediaUpdate = function(eventType) {
  switch (eventType) {
    case 'mediaMeta':
      this.onLoaded();
      break;
    case 'mediaConnected':
      this.onLoaded();
      this.onPaused();
      break;
    case 'mediaPlaying':
      this.onPlaying();
      break;
    case 'mediaPaused':
      this.onPaused();
      break;
    case 'mediaComplete':
      this.onComplete();
      break;
  }
};

/**
 * @see minplayer.players.base#load
 */
minplayer.players.minplayer.prototype.load = function(file, callback) {
  minplayer.players.flash.prototype.load.call(this, file, function() {
    this.player.loadMedia(file.path, file.stream);
    if (callback) {
      callback.call(this);
    }
  });
};

/**
 * @see minplayer.players.base#play
 */
minplayer.players.minplayer.prototype.play = function(callback) {
  minplayer.players.flash.prototype.play.call(this, function() {
    this.player.playMedia();
    if (callback) {
      callback.call(this);
    }
  });
};

/**
 * @see minplayer.players.base#pause
 */
minplayer.players.minplayer.prototype.pause = function(callback) {
  minplayer.players.flash.prototype.pause.call(this, function() {
    this.player.pauseMedia();
    if (callback) {
      callback.call(this);
    }
  });
};

/**
 * @see minplayer.players.base#stop
 */
minplayer.players.minplayer.prototype.stop = function(callback) {
  minplayer.players.flash.prototype.stop.call(this, function() {
    this.player.stopMedia();
    if (callback) {
      callback.call(this);
    }
  });
};

/**
 * @see minplayer.players.base#seek
 */
minplayer.players.minplayer.prototype.seek = function(pos, callback) {
  minplayer.players.flash.prototype.seek.call(this, pos, function() {
    this.player.seekMedia(pos);
    if (callback) {
      callback.call(this);
    }
  });
};

/**
 * @see minplayer.players.base#setVolume
 */
minplayer.players.minplayer.prototype.setVolume = function(vol, callback) {
  minplayer.players.flash.prototype.setVolume.call(this, vol, function() {
    this.player.setVolume(vol);
    if (callback) {
      callback.call(this);
    }
  });
};

/**
 * @see minplayer.players.base#getVolume
 */
minplayer.players.minplayer.prototype.getVolume = function(callback) {
  this.whenReady(function() {
    callback(this.player.getVolume());
  });
};

/**
 * @see minplayer.players.flash#getDuration
 */
minplayer.players.minplayer.prototype.getDuration = function(callback) {
  this.whenReady(function() {
    if (this.options.duration) {
      callback(this.options.duration);
    }
    else {
      // Check to see if it is immediately available.
      var duration = this.player.getDuration();
      if (duration) {
        callback(duration);
      }
      else {

        // If not, then poll every second for the duration.
        this.poll('duration', (function(player) {
          return function() {
            duration = player.player.getDuration();
            if (duration) {
              callback(duration);
            }
            return !duration;
          };
        })(this), 1000);
      }
    }
  });
};

/**
 * @see minplayer.players.base#getCurrentTime
 */
minplayer.players.minplayer.prototype.getCurrentTime = function(callback) {
  this.whenReady(function() {
    callback(this.player.getCurrentTime());
  });
};

/**
 * @see minplayer.players.base#getBytesLoaded
 */
minplayer.players.minplayer.prototype.getBytesLoaded = function(callback) {
  this.whenReady(function() {
    callback(this.player.getMediaBytesLoaded());
  });
};

/**
 * @see minplayer.players.base#getBytesTotal.
 */
minplayer.players.minplayer.prototype.getBytesTotal = function(callback) {
  this.whenReady(function() {
    callback(this.player.getMediaBytesTotal());
  });
};
