/** The minplayer namespace. */
minplayer = minplayer || {};

/**
 * @constructor
 * @extends minplayer.plugin
 * @class Base class used to provide the display and options for any component
 * deriving from this class.  Components who derive are expected to provide
 * the elements that they define by implementing the getElements method.
 *
 * @param {object} context The jQuery context this component resides.
 * @param {object} options The options for this component.
 */
minplayer.display = function(context, options) {

  if (context) {

    // Set the display and options.
    this.display = jQuery(context);
    this.options = options;

    // Extend all display elements.
    this.options.elements = this.options.elements || {};
    jQuery.extend(this.options.elements, this.getElements());
    this.elements = this.options.elements;
  }

  // Derive from plugin
  minplayer.plugin.call(this, context, options);
};

/** Derive from minplayer.plugin. */
minplayer.display.prototype = new minplayer.plugin();

/** Reset the constructor. */
minplayer.display.prototype.constructor = minplayer.display;

/**
 * Trigger a media event.
 *
 * @param {string} type The event type.
 * @param {object} data The event data object.
 * @return {object} The jQuery prototype.
 */
minplayer.display.prototype.trigger = function(type, data) {
  return this.display.trigger(type, data);
};

/**
 * Bind to a media event.
 *
 * @param {string} types The event type.
 * @param {object} data The data to bind with the event.
 * @param {function} fn The callback function.
 * @return {object} The jQuery prototype.
 **/
minplayer.display.prototype.bind = function(types, data, fn) {

  // We will always unbind first for media events.
  return this.display.unbind(types, fn).bind(types, data, fn);
};

/**
 * Returns a scaled rectangle provided a ratio and the container rect.
 *
 * @param {number} ratio The width/height ratio of what is being scaled.
 * @param {object} rect The bounding rectangle for scaling.
 * @return {object} The Rectangle object of the scaled rectangle.
 */
minplayer.display.prototype.getScaledRect = function(ratio, rect) {
  var scaledRect = {};
  scaledRect.x = rect.x ? rect.x : 0;
  scaledRect.y = rect.y ? rect.y : 0;
  scaledRect.width = rect.width ? rect.width : 0;
  scaledRect.height = rect.height ? rect.height : 0;
  if (ratio) {
    if ((rect.width / rect.height) > ratio) {
      scaledRect.height = rect.height;
      scaledRect.width = Math.floor(rect.height * ratio);
    }
    else {
      scaledRect.height = Math.floor(rect.width / ratio);
      scaledRect.width = rect.width;
    }
    scaledRect.x = Math.floor((rect.width - scaledRect.width) / 2);
    scaledRect.y = Math.floor((rect.height - scaledRect.height) / 2);
  }
  return scaledRect;
};

/**
 * Returns all the jQuery elements that this component uses.
 *
 * @return {object} An object which defines all the jQuery elements that
 * this component uses.
 */
minplayer.display.prototype.getElements = function() {
  return {};
};

/**
 * Returns if this component is valid and exists within the DOM.
 *
 * @return {boolean} TRUE if the plugin display is valid.
 */
minplayer.display.prototype.isValid = function() {
  return (this.display.length > 0);
};
