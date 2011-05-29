<?php

/**
 * @file
 * Field module functionality for the html5 media module.
 */

/**
 * Implements hook_field_widget_info()
 */
function html5_media_field_widget_info() {
  return array(
    'mediaplayer' => array(
      'label' => t('Media Player'),
      'field types' => array('file'),
      'settings' => array(
        'mediaplayer' => array(
          'width' => 550,
          'height' => 450,
          'fluidwidth' => 1,
          'fluidheight' => 1,
        )
      ),
      'behaviors' => array(
        'multiple values' => FIELD_BEHAVIOR_CUSTOM,
        'default value' => FIELD_BEHAVIOR_NONE,
      ),
    ),
  );  
}

/**
 * Implements hook_field_widget_settings_form().
 */
function html5_media_field_widget_settings_form($field, $instance) {
  $widget = $instance['widget'];
  $settings = $widget['settings'];

  // Store all settings in the media player array.
  $form['mediaplayer'] = array(
    '#type' => 'fieldset',
    '#title' => 'Media Player Settings',
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
    '#weight' => 20
  );
  
  // Add all the custom settings for the core media player.
  $form['mediaplayer']['width'] = array(
    '#type' => 'textfield',
    '#title' => t('Player Width'),
    '#field_suffix' => 'px',
    '#size' => 4,
    '#default_value' => $settings['mediaplayer']['width'],
    '#description' => t('Select the width of the media player.')
  );
  
  $form['mediaplayer']['fluidwidth'] = array(
    '#type' => 'checkbox',
    '#title' => t('Fluid Width'),
    '#description' => t('Adjust the width of the media player to fit its parent element.'),
    '#default_value' => $settings['mediaplayer']['fluidwidth']
  );
  
  $form['mediaplayer']['height'] = array(
    '#type' => 'textfield',
    '#title' => t('Player Height'),
    '#field_suffix' => 'px',
    '#size' => 4,
    '#default_value' => $settings['mediaplayer']['height'],
    '#description' => t('Select the height of the media player.')
  );  
  
  $form['mediaplayer']['fluidheight'] = array(
    '#type' => 'checkbox',
    '#title' => t('Fluid Height'),
    '#description' => 'Adjust the height of the media player according to the width automatically.',
    '#default_value' => $settings['mediaplayer']['fluidheight']
  );
    

  return $form;
}

/**
 * Define the media player widget form.
 * 
 * @param type $form
 * @param type $form_state
 * @param type $field
 * @param type $instance
 * @param type $langcode
 * @param type $items
 * @param type $delta
 * @param type $element 
 */
function html5_media_field_widget_form(&$form, &$form_state, $field, $instance, $langcode, $items, $delta, $element) {
  
  // Just use the file field widget for the media player widget form.
  return file_field_widget_form($form, $form_state, $field, $instance, $langcode, $items, $delta, $element);
}

/**
 * Implements hook_field_formatter_info().
 */
function html5_media_field_formatter_info() {
  return array(
    'mediaplayer' => array(
      'label' => t('Media Player'),
      'description' => t('Display this file within a media player.'),
      'field types' => array('file')
    )
  );
}

/**
 * Implements hook_field_formatter_view().
 */
function html5_media_field_formatter_view($entity_type, $entity, $field, $instance, $langcode, $items, $display) {
  
  // Pass all the variables to our template.
  return array(array(
    '#theme' => 'media_player',
    '#params' => array(
      '#entity' => $entity,
      '#field' => $field,
      '#instance' => $instance,
      '#langcode' => $langcode,
      '#items' => $items,
      '#display' => $display
    )
  ));
}
