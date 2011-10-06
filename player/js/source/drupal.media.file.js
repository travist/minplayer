/**
 * Drupal.media.file
 *
 * A wrapper class used to provide all the data necessary to control an
 * individual file within this media player.
 */
Drupal.media = Drupal.media || {};
(function(media) {

  /**
   * @constructor
   * @param {object} file A media file object with minimal required information.
   */
  media.file = function(file) {
    this.duration = file.duration || 0;
    this.bytesTotal = file.bytesTotal || 0;
    this.quality = file.quality || 0;
    this.stream = file.stream || '';
    this.path = file.path || '';
    this.codecs = file.codecs || '';

    // These should be provided, but just in case...
    this.extension = file.extension || this.getFileExtension();
    this.mimetype = file.mimetype || this.getMimeType();
    this.type = file.type || this.getType();
    this.player = file.player || this.getBestPlayer();
    this.priority = file.priority || this.getPriority();
  };

  media.file.prototype = jQuery.extend(media.file.prototype, {

    /**
     * Returns the best player for the job.
     *
     * @return {string} The best player to play the media file.
     */
    getBestPlayer: function() {
      var bestplayer = null, bestpriority = 0, _this = this;
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
     * The priority of this file is determined by the priority of the best
     * player multiplied by the priority of the mimetype.
     *
     * @return {integer} The priority of the media file.
     */
    getPriority: function() {
      var priority = 1;
      if (this.player) {
        priority = media.players[this.player].getPriority();
      }
      switch (this.mimetype) {
        case 'video/x-webm':
          return priority * 10;
        case 'video/mp4':
        case 'audio/mp4':
        case 'audio/mpeg':
          return priority * 9;
        case 'video/ogg':
        case 'audio/ogg':
        case 'video/quicktime':
          return priority * 8;
        default:
          return priority * 5;
      }
    },

    /**
     * Returns the file extension of the file path.
     *
     * @return {string} The file extension.
     */
    getFileExtension: function() {
      return this.path.substring(this.path.lastIndexOf('.') + 1).toLowerCase();
    },

    /**
     * Returns the proper mimetype based off of the extension.
     *
     * @return {string} The mimetype of the file based off of extension.
     */
    getMimeType: function() {
      switch (this.extension) {
        case 'mp4': case 'm4v': case 'flv': case 'f4v':
          return 'video/mp4';
        case'webm':
          return 'video/x-webm';
        case 'ogg': case 'ogv':
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
        case 'm4a': case 'f4a':
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

    /**
     * The type of media this is: video or audio.
     *
     * @return {string} "video" or "audio" based on what the type of media this
     * is.
     */
    getType: function() {
      switch (this.mimetype) {
        case 'video/mp4':
        case 'video/x-webm':
        case 'video/ogg':
        case 'video/3gpp2':
        case 'video/3gpp':
        case 'video/quicktime':
          return 'video';
        case 'audio/mp3':
        case 'audio/mp4':
        case 'audio/ogg':
          return 'audio';
        default:
          return 'unknown';
      }
    }
  });
}(Drupal.media));


