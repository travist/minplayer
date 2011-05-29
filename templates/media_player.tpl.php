<<?php print $media_type ?> <?php print drupal_attributes($media_attributes) ?>>
  <?php foreach($media_files as $file): ?>
    <source <?php print drupal_attributes(html5_media_source($file)) ?>>
  <?php endforeach; ?>
  <?php foreach($media_plugins as $plugin): ?>
    <?php print $plugin; ?>
  <?php endforeach; ?>
</<?php print $media_type ?>>
