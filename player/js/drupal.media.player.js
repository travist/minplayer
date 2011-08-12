Drupal.media = Drupal.media ? Drupal.media : {};
(function($, media) {   
  /**
   * Constructor for the media.player
   */
  media.player = function( context, options ) {
    
    // Make sure we provide default options...
    options = jQuery.extend({
      controller:"base",
      template:"default",
      id:"player",
      volume:80
    }, options);
    
    // Derive from display
    media.display.call(this, context, options);

    // Store the this pointer for callbacks.
    var _this = this;

    // The current player.
    this.media = null;
    
    // The controllers that control this media player.
    this.controllers = [];
    
    // Setup our template.
    if (media.templates[options.template]) {
      this.template = new media.templates[options.template](context, options);
    }    
    
    // Add the default controller.
    if (media.controllers[options.controller]) {
      this.addController(new media.controllers[options.controller](jQuery(options.id + "_controller", context), options));
    }

    // The best media file to play.
    this.mediaFile = null;

    // Get the files involved...
    var _files = [];
    var mediaDisplay = $(options.id + "_player");
    var mediaSrc = mediaDisplay.attr('src');
    if (mediaSrc) {
      _files.push({"path":mediaSrc});
    }
    $("source", mediaDisplay).each(function() {
      _files.push({
        "path":$(this).attr('src'), 
        "mimetype":$(this).attr('type'), 
        "codecs":$(this).attr('codecs')
      });
    });
    
    // Now load these files.
    this.load(_files);
  }

  /**
   * Define the media player interface.
   */
  media.player.prototype = new media.display();
  media.player.prototype.constructor = media.player;
  media.player.prototype = jQuery.extend(media.player.prototype, {
    
    // Returns the best media file to play given a list of files.
    getMediaFile: function(files) {
      if (typeof files == 'string') {
        return new media.file({"path":file});
      }
      
      if (files.path) {
        return new media.file(file);
      }
      
      // Add the files and get the best player to play.
      var i=files.length;
      var bestPriority = 0;
      var mediaFile = null;
      while(i--) {
        var file = files[i];
        
        // Get the media file object.
        file = (typeof file == 'string') ? new media.file({"path":file}) : new media.file(file);
        
        // Determine the best file for this browser.
        if (file.priority > bestPriority) {
          mediaFile = file;
        }
      }
      
      // Return the media file.
      return mediaFile;
    },
    
    // Load a set of files or a single file for the media player.
    load:function(files) {
      
      // Empty the current media display.
      if (this.media) {
        this.media.destroy();
      }
      
      // Get the best media file.
      this.mediaFile = this.getMediaFile(files);
      
      // Create a new media player for this file.
      this.media = new media.players[this.mediaFile.player]($(this.options.id + "_display"), this.options);
      
      // Iterate through all controllers and add the player to them.
      var i = this.controllers.length;
      while (i--) {
        this.controllers[i].setPlayer(this.media);
      }
      
      // Set the template media player.
      if (this.template) {
        this.template.setPlayer(this.media);
      }
      
      // Now load this media.
      this.media.load(this.mediaFile);
    },
    
    // Allow multiple controllers.
    addController: function(controller) {
      
      // Only continue if the controller exists.
      if (controller.isValid()) {

        // Add to controllers.
        this.controllers.push(controller);
      }
    },
    play: function() {
      if( this.media ) {
        this.media.play();
      }
    },
    pause: function() {
      if( this.media ) {
        this.media.pause();
      }
    },
    stop: function() {
      if( this.media ) {
        this.media.stop();
      }
    },
    seek: function( pos ) {
      if( this.media ) {
        this.media.seek(pos);
      }
    },
    setVolume: function( vol ) {
      if( this.media ) {
        this.media.setVolume( vol );
      }
    },
    getVolume: function() { 
      return this.media ? this.media.getVolume() : 0;
    },
    getDuration: function() { 
      return this.media ? this.media.getDuration() : 0;
    }
  });
})(jQuery, Drupal.media);
