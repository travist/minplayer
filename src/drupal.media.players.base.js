/** The Drupal namespace. */
Drupal.media = Drupal.media || {};
(function($, media) {

  /** All the media player implementations */
  media.players = media.players || {};

  /**
   * @class The base media player class where all media players derive from.
   *
   * @extends media.display
   * @param {object} context The jQuery context.
   * @param {object} options This components options.
   */
  media.players.base = function(context, options, mediaFile) {

    /** The currently loaded media file. */
    this.mediaFile = mediaFile;

    // Derive from display
    media.display.call(this, context, options);
  };

  // Extend the display prototype.
  media.players.base.prototype = new media.display();
  media.players.base.prototype.constructor = media.players.base;

  /**
   * Get the priority of this media player.
   *
   * @return {number} The priority of this media player.
   */
  media.players.base.getPriority = function() {
    return 0;
  };

  /**
   * Determine if we can play the media file.
   *
   * @param {object} file A {@link media.file} object.
   */
  media.players.base.canPlay = function(file) {
    return false;
  };

  /**
   * @see media.plugin.construct
   */
  media.players.base.prototype.construct = function() {

    // Call the media display constructor.
    media.display.prototype.construct.call(this);

    // Get the player display object.
    if (!this.playerFound()) {

      // Cleanup some events and code.
      this.display.unbind();

      // Remove the media element if found
      if (this.elements.media) {
        this.elements.media.remove();
      }

      // Create a new media player element.
      this.display.html(this.create());
    }

    // Get the player object...
    this.player = this.getPlayer();

    /**
     * Trigger a media event.
     *
     * @param {string} type The event type.
     * @param {object} data The event data object.
     */
    this.trigger = function(type, data) {
      this.display.trigger(type, data);
    };

    this.duration = 0;
    this.currentTime = 0;
  };

  /**
   * Returns if the media player is already within the DOM.
   *
   * @return {boolean} TRUE - if the player is in the DOM, FALSE otherwise.
   */
  media.players.base.prototype.playerFound = function() {
    return false;
  };

  /**
   * Creates the media player and inserts it in the DOM.
   *
   * @return {object} The media player entity.
   */
  media.players.base.prototype.create = function() {
    return null;
  };

  /**
   * Returns the media player object.
   *
   * @return {object} The media player object.
   */
  media.players.base.prototype.getPlayer = function() {
    return null;
  };

  /**
   * Destroy the media player instance from the DOM.
   */
  media.players.base.prototype.destroy = function() {
  };

  /**
   * Loads a new media player.
   *
   * @param {object} file A {@link media.file} object.
   */
  media.players.base.prototype.load = function(file) {

    // Store the media file for future lookup.
    this.mediaFile = file;
  };

  /**
   * Play the loaded media file.
   */
  media.players.base.prototype.play = function() {
  };

  /**
   * Pause the loaded media file.
   */
  media.players.base.prototype.pause = function() {
  };

  /**
   * Stop the loaded media file.
   */
  media.players.base.prototype.stop = function() {
  };

  /**
   * Seek the loaded media.
   *
   * @param {number} pos The position to seek the media. 0 to 1.
   */
  media.players.base.prototype.seek = function(pos) {

  };

  /**
   * Set the volume of the loaded media.
   *
   * @param {number} vol The volume to set the media. 0 to 1.
   */
  media.players.base.prototype.setVolume = function(vol) {
    this.trigger('volumeupdate', vol);
  };

  /**
   * Get the volume from the loaded media.
   *
   * @return {number} The volume of the media; 0 to 1.
   */
  media.players.base.prototype.getVolume = function() {
    return 0;
  };

  /**
   * Return the duration of the loaded media.
   *
   * @return {number} The duration of the loaded media.
   */
  media.players.base.prototype.getDuration = function() {
    return 0;
  };
}(jQuery, Drupal.media));


