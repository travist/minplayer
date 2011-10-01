Drupal.media = Drupal.media ? Drupal.media : {};
(function($, media) {

  // constructor.
  media.flags = function() {

    // The flags.
    this.flags = 0;

    // Id map to reference id with the flag index.
    this.ids = {};

    // The number of flags.
    this.numFlags = 0;
  };

  // Define the prototype.
  media.flags.prototype = jQuery.extend(media.flags.prototype, {

    /**
     * Sets a flag based on boolean logic operators.
     */
    setFlag: function(id, value) {

      // Define this id if it isn't present.
      if (!this.ids.hasOwnProperty(id)) {
        this.ids[id] = this.numFlags;
        this.numFlags++;
      }

      // Use binary operations to keep track of the flag state
      if (value) {
        this.flags |= (1 << this.ids[id]);
      }
      else {
        this.flags &= ~(1 << this.ids[id]);
      }
    }
  });
})(jQuery, Drupal.media);