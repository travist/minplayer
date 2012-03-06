/** The minplayer namespace. */
minplayer = minplayer || {};

/**
 * @constructor
 * @extends minplayer.plugin
 * @class Base class used to provide the display and options for any component
 * deriving from this class.  Components who derive are expected to provide
 * the elements that they define by implementing the getElements method.
 *
 * @param {string} name The name of this plugin.
 * @param {object} context The jQuery context this component resides.
 * @param {object} options The options for this component.
 */
minplayer.display = function(name, context, options) {

  // See if we allow resize on this display.
  this.allowResize = false;

  if (context) {

    // Set the display.
    this.display = this.getDisplay(context, options);
  }

  // Derive from plugin
  minplayer.plugin.call(this, name, context, options);
};

/** Derive from minplayer.plugin. */
minplayer.display.prototype = new minplayer.plugin();

/** Reset the constructor. */
minplayer.display.prototype.constructor = minplayer.display;

/**
 * Returns the display for this component.
 *
 * @param {object} context The original context.
 * @param {object} options The options for this component.
 * @return {object} The jQuery context for this display.
 */
minplayer.display.prototype.getDisplay = function(context, options) {
  return jQuery(context);
};

/**
 * @see minplayer.plugin.construct
 */
minplayer.display.prototype.construct = function() {

  // Call the plugin constructor.
  minplayer.plugin.prototype.construct.call(this);

  // Extend all display elements.
  this.options.elements = this.options.elements || {};
  jQuery.extend(this.options.elements, this.getElements());
  this.elements = this.options.elements;

  // Only do this if they allow resize for this display.
  if (this.allowResize) {

    // Set the resize timeout and this pointer.
    var resizeTimeout = 0;
    var _this = this;

    // Add a handler to trigger a resize event.
    jQuery(window).resize(function() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function() {
        _this.onResize();
      }, 200);
    });
  }
};

/**
 * Called when the window resizes.
 */
minplayer.display.prototype.onResize = function() {
};

/**
 * Make this display element go fullscreen.
 *
 * @param {boolean} full Tell the player to go into fullscreen or not.
 */
minplayer.display.prototype.fullscreen = function(full) {
  var isFull = this.isFullScreen();
  if (isFull && !full) {
    this.display.removeClass('fullscreen');
    if (screenfull) {
      screenfull.exit();
    }
    this.trigger('fullscreen', false);
  }
  else if (!isFull && full) {
    this.display.addClass('fullscreen');
    if (screenfull) {
      var _this = this;
      screenfull.request(this.display[0]);
      screenfull.onchange = function(e) {
        if (!screenfull.isFullscreen) {
          _this.fullscreen(false);
        }
      };
    }
    this.trigger('fullscreen', true);
  }
};

/**
 * Toggle fullscreen.
 */
minplayer.display.prototype.toggleFullScreen = function() {
  this.fullscreen(!this.isFullScreen());
};

/**
 * Checks to see if we are in fullscreen mode.
 *
 * @return {boolean} TRUE - fullscreen, FALSE - otherwise.
 */
minplayer.display.prototype.isFullScreen = function() {
  return this.display.hasClass('fullscreen');
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

/**
 * From https://github.com/sindresorhus/screenfull.js
 */
/*global Element:true*/
(function(window, document) {
  'use strict';
  var methods = (function() {
    var methodMap = [
      [
        'requestFullscreen',
        'exitFullscreen',
        'fullscreenchange',
        'fullscreen',
        'fullscreenElement'
      ],
      [
        'webkitRequestFullScreen',
        'webkitCancelFullScreen',
        'webkitfullscreenchange',
        'webkitIsFullScreen',
        'webkitCurrentFullScreenElement'
      ],
      [
        'mozRequestFullScreen',
        'mozCancelFullScreen',
        'mozfullscreenchange',
        'mozFullScreen',
        'mozFullScreenElement'
      ]
    ];
    for (var i = 0, l = methodMap.length; i < l; i++) {
      var val = methodMap[i];
      if (val[1] in document) {
        return val;
      }
    }
  })();

  if (!methods) {
    return window.screenfull = false;
  }

  var keyboardAllowed = 'ALLOW_KEYBOARD_INPUT' in Element;

  var screenfull = {
    init: function() {
      document.addEventListener(methods[2], function(e) {
        screenfull.isFullscreen = document[methods[3]];
        screenfull.element = document[methods[4]];
        screenfull.onchange(e);
      });
      return this;
    },
    isFullscreen: document[methods[3]],
    element: document[methods[4]],
    request: function(elem) {
      elem = elem || document.documentElement;
      elem[methods[0]](keyboardAllowed && Element.ALLOW_KEYBOARD_INPUT);
      // Work around Safari 5.1 bug: reports support for keyboard in fullscreen
      // even though it doesn't.
      if (!document.isFullscreen) {
        elem[methods[0]]();
      }
    },
    exit: function() {
      document[methods[1]]();
    },
    toggle: function(elem) {
      if (this.isFullscreen) {
        this.exit();
      } else {
        this.request(elem);
      }
    },
    onchange: function() {}
  };

  window.screenfull = screenfull.init();
})(window, document);
