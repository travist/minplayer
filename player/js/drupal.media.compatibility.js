Drupal.media = Drupal.media ? Drupal.media : {};
(function(media) {
  if( !media.playTypes ) {
    // Private function to check a single element's play type.
    function checkPlayType( elem, playType ) {
      if( (typeof elem.canPlayType) == 'function' ) {
        return ("no" != elem.canPlayType(playType)) && ("" != elem.canPlayType(playType));
      }
      else {
        return false;
      }
    };

    // Private function to get the playtypes.
    function getPlayTypes() {
      var types = {};

      // Check for video types...
      var elem = document.createElement("video");
      types.videoOGG  = checkPlayType( elem, "video/ogg");
      types.videoH264  = checkPlayType( elem, "video/mp4");
      types.videoWEBM = checkPlayType( elem, "video/x-webm");

      // Now check for audio types...
      elem = document.createElement("audio");
      types.audioOGG = checkPlayType( elem, "audio/ogg");
      types.audioMP3 = checkPlayType( elem, "audio/mpeg");
      types.audioMP4 = checkPlayType( elem, 'audio/mp4');

      return types;
    }

    // Cache for future lookups.
    media.playTypes = getPlayTypes();
  }
})(Drupal.media);
