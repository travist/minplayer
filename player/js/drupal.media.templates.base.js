Drupal.media = Drupal.media ? Drupal.media : {};
(function($, media) {

  // Define the templates class if need be...
  media.templates = media.templates ? media.templates : {};

  // Templates constructor.
  media.templates.base = function(context, options) {

    // Derive from plugin
    media.plugin.call(this, context, options);
  };

  // Extend the plugin prototype.
  media.templates.base.prototype = new media.plugin();
  media.templates.base.prototype.constructor = media.templates.base;
  media.templates.base.prototype = {

    /**
     * The player is going into full screen mode.
     */
    onFullScreen:function(full) {

    }
  }
})(jQuery, Drupal.media);


