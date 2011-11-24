/** The minplayer namespace. */
var minplayer = minplayer || {};

/** Define the playLoader object. */
minplayer.playLoader = minplayer.playLoader || {};

/**
 * @constructor
 * @extends minplayer.display
 * @class The play loader base class, which is used to control the busy
 * cursor, big play button, and the opaque background which shows when the
 * player is paused.
 *
 * @param {object} context The jQuery context.
 * @param {object} options This components options.
 */
minplayer.playLoader.base = function(context, options) {

  // Define the flags that control the busy cursor.
  this.busy = new minplayer.flags();

  // Define the flags that control the big play button.
  this.bigPlay = new minplayer.flags();

  // Derive from display
  minplayer.display.call(this, context, options);
};

/** Derive from minplayer.display. */
minplayer.playLoader.base.prototype = new minplayer.display();

/** Reset the constructor. */
minplayer.playLoader.base.prototype.constructor = minplayer.playLoader.base;

/**
 * @see minplayer.plugin#construct
 */
minplayer.playLoader.base.prototype.construct = function() {

  // Call the minplayer plugin constructor.
  minplayer.display.prototype.construct.call(this);

  // Trigger a play event when someone clicks on the controller.
  if (this.elements.bigPlay) {
    this.elements.bigPlay.bind('click', {obj: this}, function(event) {
      event.preventDefault();
      jQuery(this).hide();
      if (event.data.obj.player) {
        event.data.obj.player.play();
      }
    });
  }
};

/**
 * Hide or show certain elements based on the state of the busy and big play
 * button.
 */
minplayer.playLoader.base.prototype.checkVisibility = function() {

  // Hide or show the busy cursor based on the flags.
  if (this.busy.flag) {
    this.elements.busy.show();
  }
  else {
    this.elements.busy.hide();
  }

  // Hide or show the big play button based on the flags.
  if (this.bigPlay.flag) {
    this.elements.bigPlay.show();
  }
  else {
    this.elements.bigPlay.hide();
  }

  // Show the control either flag is set.
  if (this.bigPlay.flag || this.busy.flag) {
    this.display.show();
  }

  // Hide the whole control if both flags are 0.
  if (!this.bigPlay.flag && !this.busy.flag) {
    this.display.hide();
  }
};

/**
 * @see minplayer.plugin#setPlayer
 */
minplayer.playLoader.base.prototype.setPlayer = function(player) {
  minplayer.display.prototype.setPlayer.call(this, player);
  var _this = this;
  player.display.bind('loadstart', function(event) {
    _this.busy.setFlag('media', true);
    _this.bigPlay.setFlag('media', true);
    _this.checkVisibility();
  });
  player.display.bind('waiting', function(event) {
    _this.busy.setFlag('media', true);
    _this.checkVisibility();
  });
  player.display.bind('loadedmetadata', function(event) {
    _this.busy.setFlag('media', false);
    _this.checkVisibility();
  });
  player.display.bind('loadeddata', function(event) {
    _this.busy.setFlag('media', false);
    _this.checkVisibility();
  });
  player.display.bind('playing', function(event) {
    _this.busy.setFlag('media', false);
    _this.bigPlay.setFlag('media', false);
    _this.checkVisibility();
  });
  player.display.bind('pause', function(event) {
    _this.bigPlay.setFlag('media', true);
    _this.checkVisibility();
  });
};
