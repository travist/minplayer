/** The minplayer namespace. */
var minplayer = minplayer || {};

// Make sure minplayer.templates is defined.
minplayer.templates = minplayer.templates ? minplayer.templates : {};

// Template constructor.
minplayer.templates["default"] = function(context, options) {

  // Derive from the base template.
  minplayer.templates.base.call(this, context, options);
};

/**
 * Define this template prototype.
 */
minplayer.templates["default"].prototype = new minplayer.templates.base();
minplayer.templates["default"].prototype.constructor = minplayer.templates["default"];

minplayer.templates["default"].prototype.getElements = function() {
  var elements = minplayer.templates.base.prototype.getElements.call(this);
  return jQuery.extend(elements, {
    player:this.display,
    display:jQuery(".media-player-display", this.display),
    media:jQuery(this.options.id + "-player", this.display)
  });
};

// Add this to the minplayer.plugins array.
minplayer.plugins = minplayer.plugins || [];
minplayer.plugins.push({
  id:"default_template",
  object:minplayer.templates["default"]
});
