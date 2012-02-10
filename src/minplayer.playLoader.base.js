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

  // The preview image.
  this.preview = null;

  // Derive from display
  minplayer.display.call(this, context, options);
};

/** Derive from minplayer.display. */
minplayer.playLoader.base.prototype = new minplayer.display();

/** Reset the constructor. */
minplayer.playLoader.base.prototype.constructor = minplayer.playLoader.base;

/**
 * The constructor.
 */
minplayer.playLoader.base.prototype.construct = function() {

  // Set the name of this plugin.
  this.options.name = 'playLoader';

  // Call the media display constructor.
  minplayer.display.prototype.construct.call(this);

  // Add the preview to the options.
  if (this.elements.preview) {

    // Get the poster image.
    if (!this.options.preview) {
      this.options.preview = this.elements.media.attr('poster');
    }

    // Reset the media's poster image.
    this.elements.media.attr('poster', '');

    // If there is a preview to show...
    if (this.options.preview) {

      // Say that this has a preview.
      this.elements.preview.addClass('has-preview').show();

      // Create a new preview image.
      this.preview = new minplayer.image(this.elements.preview, this.options);

      // Create the image.
      this.preview.load(this.options.preview);
    }
    else {

      // Hide the preview.
      this.elements.preview.hide();
    }
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

  // Only bind if this player does not have its own play loader.
  if (!player.hasPlayLoader()) {

    // Trigger a play event when someone clicks on the controller.
    if (this.elements.bigPlay) {
      this.elements.bigPlay.unbind();
      this.elements.bigPlay.bind('click', {player: player}, function(event) {
        event.preventDefault();
        jQuery(this).hide();
        event.data.player.play();
      });
    }

    // Bind to the player events to control the play loader.
    player.bind('loadstart', {obj: this}, function(event) {
      event.data.obj.busy.setFlag('media', true);
      event.data.obj.bigPlay.setFlag('media', true);
      if (event.data.obj.preview) {
        event.data.obj.elements.preview.show();
      }
      event.data.obj.checkVisibility();
    });
    player.bind('waiting', {obj: this}, function(event) {
      event.data.obj.busy.setFlag('media', true);
      event.data.obj.checkVisibility();
    });
    player.bind('loadeddata', {obj: this}, function(event) {
      event.data.obj.busy.setFlag('media', false);
      event.data.obj.checkVisibility();
    });
    player.bind('playing', {obj: this}, function(event) {
      event.data.obj.busy.setFlag('media', false);
      event.data.obj.bigPlay.setFlag('media', false);
      if (event.data.obj.preview) {
        event.data.obj.elements.preview.hide();
      }
      event.data.obj.checkVisibility();
    });
    player.bind('pause', {obj: this}, function(event) {
      event.data.obj.bigPlay.setFlag('media', true);
      event.data.obj.checkVisibility();
    });
  }
  else {

    // Hide the busy cursor.
    if (this.elements.busy) {
      this.elements.busy.hide();
    }

    // Hide the big play button.
    if (this.elements.bigPlay) {
      this.elements.bigPlay.unbind();
      this.elements.bigPlay.hide();
    }

    // Hide the display.
    this.display.hide();
  }
};
