/** The Drupal namespace. */
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

  /**
   * @class This class is used to define the types of media that can be played
   * within the browser.
   * <p>
   * <strong>Usage:</strong>
   * <pre><code>
   *   var playTypes = new media.compatibility();
   *
   *   if (playTypes.videoOGG) {
   *     console.log("This browser can play OGG video");
   *   }
   *
   *   if (playTypes.videoH264) {
   *     console.log("This browser can play H264 video");
   *   }
   *
   *   if (playTypes.videoWEBM) {
   *     console.log("This browser can play WebM video");
   *   }
   *
   *   if (playTypes.audioOGG) {
   *     console.log("This browser can play OGG audio");
   *   }
   *
   *   if (playTypes.audioMP3) {
   *     console.log("This browser can play MP3 audio");
   *   }
   *
   *   if (playTypes.audioMP4) {
   *     console.log("This browser can play MP4 audio");
   *   }
   * </code></pre>
   */
  media.compatibility = function() {
    var elem = null;

    // Create a video element.
    elem = document.createElement('video');

    /** Can play OGG video */
    this.videoOGG = checkPlayType(elem, 'video/ogg');

    /** Can play H264 video */
    this.videoH264 = checkPlayType(elem, 'video/mp4');

    /** Can play WEBM video */
    this.videoWEBM = checkPlayType(elem, 'video/x-webm');

    // Create an audio element.
    elem = document.createElement('audio');

    /** Can play audio OGG */
    this.audioOGG = checkPlayType(elem, 'audio/ogg');

    /** Can play audio MP3 */
    this.audioMP3 = checkPlayType(elem, 'audio/mpeg');

    /** Can play audio MP4 */
    this.audioMP4 = checkPlayType(elem, 'audio/mp4');
  };

  /** Store all the playtypes for this browser */
  if (!media.playTypes) {
    media.playTypes = new media.compatibility();
  }
}(Drupal.media));
