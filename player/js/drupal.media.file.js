/**
 * Drupal.media.file
 *
 * A wrapper class used to provide all the data necessary to control an
 * individual file within this media player.
 */
Drupal.media = Drupal.media ? Drupal.media : {};
(function(media) {

  /**
   * Constructor
   *
   * @param - A media file object with minimal required information.
   */
  media.file = function( file ) {
    this.duration = file.duration ? file.duration : 0;
    this.bytesTotal = file.bytesTotal ? file.bytesTotal : 0;
    this.quality = file.quality ? file.quality : 0;
    this.stream = file.stream ? file.stream : '';
    this.path = file.path ? file.path : '';
    this.codecs = file.codecs ? file.codecs : '';

    // These should be provided, but just in case...
    this.extension = file.extension ? file.extension : this.getFileExtension();
    this.mimetype = file.mimetype ? file.mimetype : this.getMimeType();
    this.type = file.type ? file.mediatype : this.getType();
    this.player = file.player ? file.player : this.getBestPlayer();
    this.priority = file.priority ? file.priority : this.getPriority();
  };

  media.file.prototype = jQuery.extend(media.file.prototype, {

    // Returns the best media player for this file.
    getBestPlayer: function() {
      var bestplayer = null;
      var bestpriority = 0;
      var _this = this;
      jQuery.each(media.players, function(name, player) {
        var priority = player.getPriority();
        if (player.canPlay(_this) && (priority > bestpriority)) {
          bestplayer = name;
          bestpriority = priority;
        }
      });
      return bestplayer;
    },

    /**
     * The priority of this file is determined by the priority of the best player multiplied by the
     * priority of the mimetype.
     */
    getPriority: function() {
      var priority = 1;
      if (this.player) {
        priority = media.players[this.player].getPriority();
      }
      switch (this.mimetype) {
        case 'video/x-webm':
          return priority*10;
        case 'video/mp4':
        case 'audio/mp4':
        case 'audio/mpeg':
          return priority*9;
        case 'video/ogg':
        case 'audio/ogg':
        case 'video/quicktime':
          return priority*8;
        default:
          return priority*5;
      }
      return priority;
    },

    getFileExtension: function() {
      return this.path.substring(this.path.lastIndexOf(".") + 1).toLowerCase();
    },
    getMimeType: function() {
      switch( this.extension ) {
        case 'mp4':case 'm4v':case 'flv':case 'f4v':
          return 'video/mp4';
        case'webm':
          return 'video/x-webm';
        case 'ogg':case 'ogv':
          return 'video/ogg';
        case '3g2':
          return 'video/3gpp2';
        case '3gpp':
        case '3gp':
          return 'video/3gpp';
        case 'mov':
          return 'video/quicktime';
        case'swf':
          return 'application/x-shockwave-flash';
        case 'oga':
          return 'audio/ogg';
        case 'mp3':
          return 'audio/mpeg';
        case 'm4a':case 'f4a':
          return 'audio/mp4';
        case 'aac':
          return 'audio/aac';
        case 'wav':
          return 'audio/vnd.wave';
        case 'wma':
          return 'audio/x-ms-wma';
        default:
          return 'unknown';
      }
    },
    getType: function() {
      switch( this.mimetype ) {
        case 'video/mp4': case 'video/x-webm': case 'video/ogg': case 'video/3gpp2': case 'video/3gpp': case 'video/quicktime':
          return 'video';
        case '': case '': case '':
          return 'audio';
        default:
          return 'unknown';
      }
    }
  });
})(Drupal.media);


