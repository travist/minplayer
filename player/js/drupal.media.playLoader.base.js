Drupal.media = Drupal.media ? Drupal.media : {};
(function($, media) {

  // Define the busy object.
  media.playLoader = media.playLoader ? media.playLoader : {};

  // constructor.
  media.playLoader.base = function(context, options) {

    // Define the flags that control the busy cursor.
    this.busy = new media.flags();

    // Define the flags that control the big play button.
    this.bigPlay = new media.flags();

    // Derive from display
    media.display.call(this, context, options);
  };

  // Define the prototype for all controllers.
  media.playLoader.base.prototype = new media.display();
  media.playLoader.base.prototype.constructor = media.playLoader.base;
  media.playLoader.base.prototype = jQuery.extend(media.playLoader.base.prototype, {

    // Constructor.
    construct: function() {

      // Call the media plugin constructor.
      media.display.prototype.construct.call(this);

      // Trigger a play event when someone clicks on the controller.
      if (media.elements.bigPlay) {
        media.elements.bigPlay.bind("click", {obj:this}, function(event) {
          event.preventDefault();
          media.elements.bigPlay.hide();
          if (event.data.obj.player) {
            event.data.obj.player.play();
          }
        });
      }
    },

    /**
     * Hide or show certain elements based on the state of the busy and big play button.
     */
    checkVisibility: function() {

      // Hide or show the busy cursor based on the flags.
      if (this.busy.flags) {
        media.elements.busy.show();
      }
      else {
        media.elements.busy.hide();
      }

      // Hide or show the big play button based on the flags.
      if (this.bigPlay.flags) {
        media.elements.bigPlay.show();
      }
      else {
        media.elements.bigPlay.hide();
      }

      // Show the control either flag is set.
      if (this.bigPlay.flags || this.busy.flags) {
        this.display.show();
      }

      // Hide the whole control if both flags are 0.
      if (!this.bigPlay.flags && !this.busy.flags) {
        this.display.hide();
      }
    },

    /**
     * Override the setPlayer routine so that we can trigger off of media events.
     */
    setPlayer: function(player) {
      media.display.prototype.setPlayer.call(this, player);
      var _this = this;
      player.display.bind("loadstart", function(event) {
        _this.busy.setFlag("media", true);
        _this.bigPlay.setFlag("media", true);
        _this.checkVisibility();
      });
      player.display.bind("waiting", function(event) {
        _this.busy.setFlag("media", true);
        _this.checkVisibility();
      });
      player.display.bind("loadedmetadata", function(event) {
        _this.busy.setFlag("media", false);
        _this.checkVisibility();
      });
      player.display.bind("loadeddata", function(event) {
        _this.busy.setFlag("media", false);
        _this.checkVisibility();
      });
      player.display.bind("playing", function(event) {
        _this.busy.setFlag("media", false);
        _this.bigPlay.setFlag("media", false);
        _this.checkVisibility();
      });
      player.display.bind("pause", function(event) {
        _this.bigPlay.setFlag("media", true);
        _this.checkVisibility();
      });
    }
  });
})(jQuery, Drupal.media);