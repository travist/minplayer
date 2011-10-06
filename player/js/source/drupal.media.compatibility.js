/**
 * Drupal.media.compatibility
 *
 * This class is used to define the types of media that can be played within the
 * browser.
 *
 * Usage:
 *
 *   if (Drupal.media.playTypes.videoOGG) {
 *     console.log("This browser can play OGG video");
 *   }
 *
 *   if (Drupal.media.playTypes.videoH264) {
 *     console.log("This browser can play H264 video");
 *   }
 *
 *   if (Drupal.media.playTypes.videoWEBM) {
 *     console.log("This browser can play WebM video");
 *   }
 *
 *   if (Drupal.media.playTypes.audioOGG) {
 *     console.log("This browser can play OGG audio");
 *   }
 *
 *   if (Drupal.media.playTypes.audioMP3) {
 *     console.log("This browser can play MP3 audio");
 *   }
 *
 *   if (Drupal.media.audioMP4) {
 *     console.log("This browser can play MP4 audio");
 *   }
 */
Drupal.media = Drupal.media || {};
(function(media) {

  // Private function to check a single element's play type.
  function checkPlayType(elem, playType) {
    if ((typeof elem.canPlayType) === 'function') {
      var canPlay = elem.canPlayType(playType);
      return ('no' !== canPlay) && ('' !== canPlay);
    }
    else {
      return false;
    }
  }

  // Private function to get the playtypes.
  function getPlayTypes() {
    var types = {}, elem = null;

    // Check for video types...
    elem = document.createElement('video');
    types.videoOGG = checkPlayType(elem, 'video/ogg');
    types.videoH264 = checkPlayType(elem, 'video/mp4');
    types.videoWEBM = checkPlayType(elem, 'video/x-webm');

    // Now check for audio types...
    elem = document.createElement('audio');
    types.audioOGG = checkPlayType(elem, 'audio/ogg');
    types.audioMP3 = checkPlayType(elem, 'audio/mpeg');
    types.audioMP4 = checkPlayType(elem, 'audio/mp4');

    return types;
  }

  // If the playTypes have not yet been determined, do so on script load.
  if (!media.playTypes) {
    media.playTypes = getPlayTypes();
  }
}(Drupal.media));
