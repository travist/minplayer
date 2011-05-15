/* 
 * File object to contain all information important to a media file.
 */
(function(media) {
  media.file = function( file ) {
    this.duration = file.duration ? file.duration : 0;
    this.bytesTotal = file.bytesTotal ? file.bytesTotal : 0;
    this.quality = file.quality ? file.quality : 0;
    this.stream = file.stream ? file.stream : '';
    this.path = file.path ? file.path : '';

    // These should be provided, but just in case...
    this.extension = file.extension ? file.extension : this.getFileExtension();
    this.mimetype = file.mimetype ? file.mimetype : this.getMimeType();
    this.type = file.type ? file.mediatype : this.getType();
  };

  media.file.prototype = {
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
  };
})(Drupal ? Drupal.media : {});


