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
        'template' => 'default',
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
function file_field_widget_settings_form($field, $instance) {
  $widget = $instance['widget'];
  $settings = $widget['settings'];

  // Add all the custom settings for the core media player.
  $form['template'] = array(
    '#type' => 'select',
    '#title' => t('Media Player Template'),
    '#options' => array(
      'default' => t('Default')
    ),
    '#default_value' => $settings['template'],
    '#description' => t('Select which template you would like to use for this Media Player.')
  );

  return $form;
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
function html5_field_formatter_view($entity_type, $entity, $field, $instance, $langcode, $items, $display) {
  return array(array(
    '#theme' => 'mediaplayer',
    '#entity' => $entity
  ));
}