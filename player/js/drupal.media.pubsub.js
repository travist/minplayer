/* 
 * Loosly based off of the pubsub system found at https://github.com/phiggins42/bloody-jquery-plugins/blob/master/pubsub.js
 */
(function($, media) {
  media.pubsub = function() {
    this.queue = {};
  };

  media.pubsub.prototype = {
    trigger: function( type, args ) {
      this.queue[type] && jQuery.each(this.queue[type], function(){
        this.apply(jQuery, args || []);
      });
    },
    bind: function( type, callback ) {
      if(!this.queue[type]){
        this.queue[type] = [];
      }
      cache[topic].push(callback);
		return [topic, callback];
    },
    unbind: function() {
      
    }
  };
})(jQuery, Drupal ? Drupal.media : {});


