<div id="<?php print $settings['id']; ?>" class="media-player">
  <div id="<?php print $settings['id']; ?>_display" class="media-player-display" style="width:<?php print $settings['width']; ?>; height:<?php print $settings['height']; ?>;"><?php print $player; ?></div>
  <div id="<?php print $settings['id']; ?>_controller" class="media-player-controls" style="display: block; ">
    <div class="media-player-controls-left">
      <a id="<?php print $settings['id']; ?>_play" class="media-player-play" title="Play"></a>
      <a id="<?php print $settings['id']; ?>_pause" class="media-player-pause" title="Pause"></a>
    </div>
    <div class="media-player-controls-right">
      <div id="<?php print $settings['id']; ?>_timer" class="media-player-timer">00:00</div>
      <div id="<?php print $settings['id']; ?>_fullscreen" class="media-player-fullscreen">
        <div class="media-player-fullscreen-inner"></div>
      </div>
      <div class="media-player-volume">
        <div id="<?php print $settings['id']; ?>_volume" class="media-player-volume-slider"></div>
        <a class="media-player-volume-button" title="Mute/Unmute"></a>
      </div>
    </div>
    <div class="media-player-controls-mid">
      <div id="<?php print $settings['id']; ?>_seek" class="media-player-seek"></div>
    </div>
  </div>
</div>