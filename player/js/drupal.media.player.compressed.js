Drupal.media=Drupal.media||{};(function(d){function a(a,c){if(typeof a.canPlayType==="function"){var e=a.canPlayType(c);return"no"!==e&&""!==e}else return false}d.compatibility=function(){var b=null,b=document.createElement("video");this.videoOGG=a(b,"video/ogg");this.videoH264=a(b,"video/mp4");this.videoWEBM=a(b,"video/x-webm");b=document.createElement("audio");this.audioOGG=a(b,"audio/ogg");this.audioMP3=a(b,"audio/mpeg");this.audioMP4=a(b,"audio/mp4")};if(!d.playTypes)d.playTypes=new d.compatibility})(Drupal.media);
Drupal.media=Drupal.media||{};(function(d){d.flags=function(){this.flag=0;this.ids={};this.numFlags=0};d.flags.prototype.setFlag=function(a,b){if(!this.ids.hasOwnProperty(a))this.ids[a]=this.numFlags,this.numFlags++;b?this.flag|=1<<this.ids[a]:this.flag&=~(1<<this.ids[a])}})(Drupal.media);Drupal.media=Drupal.media||{};(function(d){d.plugin=function(a){this.player=null;a&&this.construct()};d.plugin.prototype.construct=function(){};d.plugin.prototype.setPlayer=function(a){this.player=a}})(Drupal.media);
Drupal.media=Drupal.media||{};(function(d,a){a.display=function(b,c){if(b)this.display=d(b),this.options=c,this.options.elements=this.options.elements||{},d.extend(this.options.elements,this.getElements()),this.elements=this.options.elements;a.plugin.call(this,b,c)};a.display.prototype=new a.plugin;a.display.prototype.constructor=a.display;a.display.prototype.getElements=function(){return{}};a.display.prototype.isValid=function(){return this.display.length>0}})(jQuery,Drupal.media);
Drupal.media=Drupal.media||{};
(function(d,a){if(!d.fn.mediaplayer)d.fn.mediaplayer=function(b){return d(this).each(function(){a.player[d(this).selector]||new a.player(d(this),b)})};a.player=function(b,c){c=d.extend({id:"player",controller:"default",template:"default",volume:80,swfplayer:"",wmode:"transparent",attributes:{},settings:{}},c);a.player[c.id]=this;a.display.call(this,b,c)};a.player.prototype=new a.display;a.player.prototype.constructor=a.player;a.player.prototype.construct=function(){a.display.prototype.construct.call(this);var b=
{},c=null,c=null,e=a.plugins.length,f=[];this.media=b=null;for(this.allPlugins={};e--;)b=a.plugins[e],c=b.element?d(b.element,this.display):this.display,c=new b.object(c,this.options),this.addPlugin(b.id,c);this.currentPlayer="html5";this.elements.media&&((b=this.elements.media.attr("src"))&&f.push({path:b}),d("source",this.elements.media).each(function(){f.push({path:d(this).attr("src"),mimetype:d(this).attr("type"),codecs:d(this).attr("codecs")})}));d(window).bind("keyup",{obj:this},function(a){a.data.obj.display.hasClass("fullscreen")&&
(a.keyCode===113||a.keyCode===27)&&a.data.obj.display.removeClass("fullscreen")});this.load(f)};a.player.prototype.getMediaFile=function(b){if(typeof b==="string")return new a.file({path:b});if(b.path)return new a.file(b);for(var c=b.length,e=null,f=null;c--;)f=b[c],f=typeof f==="string"?new a.file({path:f}):new a.file(f),f.priority>0&&(e=f);return e};a.player.prototype.load=function(b){var b=this.getMediaFile(b),c="",e="";if(b){if(!this.media||b.player.toString()!==this.currentPlayer){this.currentPlayer=
b.player.toString();this.media&&this.media.destroy();if(this.elements.display)e=a.players[b.player],this.media=new e(this.elements.display,this.options,b);for(c in this.allPlugins)this.allPlugins.hasOwnProperty(c)&&this.allPlugins[c].setPlayer(this.media)}this.media&&this.media.load(b)}};a.player.prototype.addPlugin=function(a,c){c.isValid()&&(this.allPlugins[a]=c)};a.player.prototype.getPlugin=function(a){return this.allPlugins[a]};a.player.prototype.play=function(){this.media&&this.media.play()};
a.player.prototype.pause=function(){this.media&&this.media.pause()};a.player.prototype.stop=function(){this.media&&this.media.stop()};a.player.prototype.seek=function(a){this.media&&this.media.seek(a)};a.player.prototype.setVolume=function(a){this.media&&this.media.setVolume(a)};a.player.prototype.getVolume=function(){return this.media?this.media.getVolume():0};a.player.prototype.getDuration=function(){return this.media?this.media.getDuration():0}})(jQuery,Drupal.media);
Drupal.media=Drupal.media||{};
(function(d){d.file=function(a){this.duration=a.duration||0;this.bytesTotal=a.bytesTotal||0;this.quality=a.quality||0;this.stream=a.stream||"";this.path=a.path||"";this.codecs=a.codecs||"";this.extension=a.extension||this.getFileExtension();this.mimetype=a.mimetype||this.getMimeType();this.type=a.type||this.getType();this.player=a.player||this.getBestPlayer();this.priority=a.priority||this.getPriority()};d.file.prototype.getBestPlayer=function(){var a=null,b=0,c=this;jQuery.each(d.players,function(e,
f){var d=f.getPriority();f.canPlay(c)&&d>b&&(a=e,b=d)});return a};d.file.prototype.getPriority=function(){var a=1;this.player&&(a=d.players[this.player].getPriority());switch(this.mimetype){case "video/x-webm":return a*10;case "video/mp4":case "audio/mp4":case "audio/mpeg":return a*9;case "video/ogg":case "audio/ogg":case "video/quicktime":return a*8;default:return a*5}};d.file.prototype.getFileExtension=function(){return this.path.substring(this.path.lastIndexOf(".")+1).toLowerCase()};d.file.prototype.getMimeType=
function(){switch(this.extension){case "mp4":case "m4v":case "flv":case "f4v":return"video/mp4";case "webm":return"video/x-webm";case "ogg":case "ogv":return"video/ogg";case "3g2":return"video/3gpp2";case "3gpp":case "3gp":return"video/3gpp";case "mov":return"video/quicktime";case "swf":return"application/x-shockwave-flash";case "oga":return"audio/ogg";case "mp3":return"audio/mpeg";case "m4a":case "f4a":return"audio/mp4";case "aac":return"audio/aac";case "wav":return"audio/vnd.wave";case "wma":return"audio/x-ms-wma";
default:return"unknown"}};d.file.prototype.getType=function(){switch(this.mimetype){case "video/mp4":case "video/x-webm":case "video/ogg":case "video/3gpp2":case "video/3gpp":case "video/quicktime":return"video";case "audio/mp3":case "audio/mp4":case "audio/ogg":return"audio";default:return"unknown"}}})(Drupal.media);Drupal.media=Drupal.media||{};
(function(d,a){a.playLoader=a.playLoader||{};a.playLoader.base=function(b,c){this.busy=new a.flags;this.bigPlay=new a.flags;a.display.call(this,b,c)};a.playLoader.base.prototype=new a.display;a.playLoader.base.prototype.constructor=a.playLoader.base;a.playLoader.base.prototype.construct=function(){a.display.prototype.construct.call(this);this.elements.bigPlay&&this.elements.bigPlay.bind("click",{obj:this},function(a){a.preventDefault();d(this).hide();a.data.obj.player&&a.data.obj.player.play()})};
a.playLoader.base.prototype.checkVisibility=function(){this.busy.flag?this.elements.busy.show():this.elements.busy.hide();this.bigPlay.flag?this.elements.bigPlay.show():this.elements.bigPlay.hide();(this.bigPlay.flag||this.busy.flag)&&this.display.show();!this.bigPlay.flag&&!this.busy.flag&&this.display.hide()};a.playLoader.base.prototype.setPlayer=function(b){a.display.prototype.setPlayer.call(this,b);var c=this;b.display.bind("loadstart",function(){c.busy.setFlag("media",true);c.bigPlay.setFlag("media",
true);c.checkVisibility()});b.display.bind("waiting",function(){c.busy.setFlag("media",true);c.checkVisibility()});b.display.bind("loadedmetadata",function(){c.busy.setFlag("media",false);c.checkVisibility()});b.display.bind("loadeddata",function(){c.busy.setFlag("media",false);c.checkVisibility()});b.display.bind("playing",function(){c.busy.setFlag("media",false);c.bigPlay.setFlag("media",false);c.checkVisibility()});b.display.bind("pause",function(){c.bigPlay.setFlag("media",true);c.checkVisibility()})}})(jQuery,
Drupal.media);Drupal.media=Drupal.media||{};
(function(d,a){a.players=a.players||{};a.players.base=function(b,c,e){this.mediaFile=e;a.display.call(this,b,c)};a.players.base.prototype=new a.display;a.players.base.prototype.constructor=a.players.base;a.players.base.getPriority=function(){return 0};a.players.base.canPlay=function(){return false};a.players.base.prototype.construct=function(){a.display.prototype.construct.call(this);this.playerFound()||(this.display.unbind(),this.elements.media&&this.elements.media.remove(),this.display.html(this.create()));
this.player=this.getPlayer();this.trigger=function(a,c){this.display.trigger(a,c)};this.currentTime=this.duration=0};a.players.base.prototype.playerFound=function(){return false};a.players.base.prototype.create=function(){return null};a.players.base.prototype.getPlayer=function(){return null};a.players.base.prototype.destroy=function(){};a.players.base.prototype.load=function(a){this.mediaFile=a};a.players.base.prototype.play=function(){};a.players.base.prototype.pause=function(){};a.players.base.prototype.stop=
function(){};a.players.base.prototype.seek=function(){};a.players.base.prototype.setVolume=function(a){this.trigger("volumeupdate",a)};a.players.base.prototype.getVolume=function(){return 0};a.players.base.prototype.getDuration=function(){return 0}})(jQuery,Drupal.media);Drupal.media=Drupal.media||{};
(function(d,a){a.players=a.players||{};a.players.html5=function(b,c,e){a.players.base.call(this,b,c,e)};a.players.html5.prototype=new a.players.base;a.players.html5.prototype.constructor=a.players.html5;a.players.html5.getPriority=function(){return 10};a.players.html5.canPlay=function(b){switch(b.mimetype){case "video/ogg":return a.playTypes.videoOGG;case "video/mp4":return a.playTypes.videoH264;case "video/x-webm":return a.playTypes.videoWEBM;case "audio/ogg":return a.playTypes.audioOGG;case "audio/mpeg":return a.playTypes.audioMP3;
case "audio/mp4":return a.playTypes.audioMP4;default:return false}};a.players.html5.prototype.construct=function(){a.players.base.prototype.construct.call(this);this.loaded=false;var b=this;if(this.player)this.player.addEventListener("abort",function(){b.trigger("abort")},true),this.player.addEventListener("loadstart",function(){b.trigger("loadstart")},true),this.player.addEventListener("loadeddata",function(){b.trigger("loadeddata")},true),this.player.addEventListener("loadedmetadata",function(){b.trigger("loadedmetadata")},
true),this.player.addEventListener("canplaythrough",function(){b.trigger("canplaythrough")},true),this.player.addEventListener("ended",function(){b.trigger("ended")},true),this.player.addEventListener("pause",function(){b.trigger("pause")},true),this.player.addEventListener("play",function(){b.trigger("play")},true),this.player.addEventListener("playing",function(){b.trigger("playing")},true),this.player.addEventListener("error",function(){b.trigger("error")},true),this.player.addEventListener("waiting",
function(){b.trigger("waiting")},true),this.player.addEventListener("timeupdate",function(){var a=this.duration,e=this.currentTime;b.duration=a;b.currentTime=e;b.trigger("timeupdate",{currentTime:e,duration:a})},true),this.player.addEventListener("durationchange",function(){b.duration=this.duration;b.trigger("durationchange",{duration:this.duration})},true),this.player.addEventListener("progress",function(a){b.trigger("progress",{loaded:a.loaded,total:a.total})},true),this.autoBuffer()?this.player.autobuffer=
true:(this.player.autobuffer=false,this.player.preload="none")};a.players.html5.prototype.autoBuffer=function(){var a=this.player.preload!=="none";return typeof this.player.hasAttribute==="function"?this.player.hasAttribute("preload")&&a:false};a.players.html5.prototype.playerFound=function(){return this.display.find(this.mediaFile.type).length>0};a.players.html5.prototype.create=function(){var a=document.createElement(this.mediaFile.type),c="";for(c in this.options.attributes)this.options.attributes.hasOwnProperty(c)&&
a.setAttribute(c,this.options.attributes[c]);return a};a.players.html5.prototype.getPlayer=function(){return this.options.elements.media.eq(0)[0]};a.players.html5.prototype.load=function(b){a.players.base.prototype.load.call(this,b);if(this.loaded){var c='<source src="'+b.path+'" ';c+='type="'+b.mimetype+'"';c+=b.codecs?' codecs="'+b.path+'">':">";this.options.elements.player.attr("src","").empty().html(c)}this.loaded=true};a.players.html5.prototype.play=function(){a.players.base.prototype.play.call(this);
this.player.play()};a.players.html5.prototype.pause=function(){a.players.base.prototype.pause.call(this);this.player.pause()};a.players.html5.prototype.stop=function(){a.players.base.prototype.stop.call(this);this.media.pause();this.player.src=""};a.players.html5.prototype.seek=function(b){a.players.base.prototype.seek.call(this,b);this.player.currentTime=b};a.players.html5.prototype.setVolume=function(b){a.players.base.prototype.setVolume.call(this,b);this.player.volume=b};a.players.html5.prototype.getVolume=
function(){return this.player.volume};a.players.html5.prototype.getDuration=function(){var a=this.player.duration;return a===Infinity?0:a}})(jQuery,Drupal.media);Drupal.media=Drupal.media||{};
(function(d,a){a.players=a.players||{};a.players.flash=function(b,c,e){this.mediaInterval=this.durationInterval=null;this.duration=0;this.ready=false;a.players.base.call(this,b,c,e)};a.players.flash.prototype=new a.players.base;a.players.flash.prototype.constructor=a.players.flash;a.players.flash.getPriority=function(){return 0};a.players.flash.canPlay=function(){return false};a.players.flash.getFlash=function(a){var c=window.location.protocol,e=null,f=null,g="",h={},f=null;c.charAt(c.length-1)===
":"&&c.substring(0,c.length-1);e=document.createElement("object");e.setAttribute("width",a.width);e.setAttribute("height",a.height);e.setAttribute("id",a.id);e.setAttribute("name",a.id);e.setAttribute("playerType",a.playerType);h={allowScriptAccess:"always",allowfullscreen:"true",movie:a.swf,wmode:a.wmode,quality:"high",FlashVars:d.param(a.flashvars)};for(g in h)h.hasOwnProperty(g)&&(f=document.createElement("param"),f.setAttribute("name",g),f.setAttribute("value",h[g]),e.appendChild(f));f=document.createElement("embed");
for(g in h)h.hasOwnProperty(g)&&(g=g==="movie"?"src":g,f.setAttribute(g,h[g]));f.setAttribute("width",a.width);f.setAttribute("height",a.height);f.setAttribute("id",a.id);f.setAttribute("name",a.id);f.setAttribute("swLiveConnect","true");f.setAttribute("type","application/x-shockwave-flash");e.appendChild(f);return e};a.players.flash.prototype.onReady=function(){var a=this;this.ready=true;this.trigger("loadstart");this.durationInterval=setInterval(function(){a.getDuration()&&(clearInterval(a.durationInterval),
a.trigger("durationchange",{duration:a.getDuration()}))},1E3)};a.players.flash.prototype.onPlaying=function(){var a=this;this.trigger("playing");this.mediaInterval=setInterval(function(){var c=a.getCurrentTime(),e=a.getDuration();a.trigger("timeupdate",{currentTime:c,duration:e})},1E3)};a.players.flash.prototype.onPaused=function(){this.trigger("pause");clearInterval(this.mediaInterval)};a.players.flash.prototype.onMeta=function(){clearInterval(this.durationInterval);this.trigger("loadeddata");this.trigger("loadedmetadata");
this.trigger("durationchange",{duration:this.getDuration()})};a.players.flash.prototype.reset=function(){this.ready=false;this.duration=0};a.players.flash.prototype.destroy=function(){this.reset()};a.players.flash.prototype.playerFound=function(){return this.display.find('object[playerType="flash"]').length>0};a.players.flash.prototype.create=function(){this.reset();return null};a.players.flash.prototype.getPlayer=function(){return d(d.browser.msie?"object":"embed",this.display).eq(0)[0]};a.players.flash.prototype.load=
function(b){this.duration=0;a.players.base.prototype.load.call(this,b)};a.players.flash.prototype.getPlayerDuration=function(){return 0};a.players.flash.prototype.getDuration=function(){return this.duration?this.duration:this.isReady()?this.duration=this.getPlayerDuration():a.players.base.prototype.getDuration.call(this)};a.players.flash.prototype.isReady=function(){return this.player&&this.ready}})(jQuery,Drupal.media);Drupal.media=Drupal.media||{};
(function(d,a){a.players=a.players||{};a.players.minplayer=function(b,e,f){this.onMediaUpdate=function(b){if(this.ready)switch(b){case "mediaMeta":a.players.flash.prototype.onMeta.call(this);break;case "mediaPlaying":a.players.flash.prototype.onPlaying.call(this);break;case "mediaPaused":a.players.flash.prototype.onPaused.call(this)}};a.players.flash.call(this,b,e,f)};a.players.minplayer.prototype=new a.players.flash;a.players.minplayer.prototype.constructor=a.players.minplayer;window.onFlashPlayerReady=
function(b){if(a.player[b])a.player[b].media.onReady()};window.onFlashPlayerUpdate=function(b,e){if(a.player[b])a.player[b].media.onMediaUpdate(e)};var b=console||{log:function(){}};window.onFlashPlayerDebug=function(a){b.log(a)};a.players.minplayer.getPriority=function(){return 1};a.players.minplayer.canPlay=function(a){switch(a.mimetype){case "video/mp4":case "video/x-webm":case "video/quicktime":case "video/3gpp2":case "video/3gpp":case "application/x-shockwave-flash":case "audio/mpeg":case "audio/mp4":case "audio/aac":case "audio/vnd.wave":case "audio/x-ms-wma":return true;
default:return false}};a.players.minplayer.prototype.create=function(){a.players.flash.prototype.create.call(this);return a.players.flash.getFlash({swf:this.options.swfplayer,id:this.options.id+"_player",playerType:"flash",width:this.options.settings.width,height:"100%",flashvars:{id:this.options.id,debug:this.options.settings.debug,config:"nocontrols",file:this.mediaFile.path,autostart:this.options.settings.autoplay},wmode:this.options.wmode})};a.players.minplayer.prototype.load=function(b){a.players.flash.prototype.load.call(this,
b);this.isReady()&&this.player.loadMedia(this.mediaFile.path,this.mediaFile.stream)};a.players.minplayer.prototype.play=function(){a.players.flash.prototype.play.call(this);this.isReady()&&this.player.playMedia()};a.players.minplayer.prototype.pause=function(){a.players.flash.prototype.pause.call(this);this.isReady()&&this.player.pauseMedia()};a.players.minplayer.prototype.stop=function(){a.players.flash.prototype.stop.call(this);this.isReady()&&this.player.stopMedia()};a.players.minplayer.prototype.seek=
function(b){a.players.flash.prototype.seek.call(this,b);this.isReady()&&this.player.seekMedia(b)};a.players.minplayer.prototype.setVolume=function(b){a.players.flash.prototype.setVolume.call(this,b);this.isReady()&&this.player.setVolume(b)};a.players.minplayer.prototype.getVolume=function(){return this.isReady()?this.player.getVolume():a.players.flash.prototype.getVolume.call(this)};a.players.minplayer.prototype.getPlayerDuration=function(){return this.isReady()?this.player.getDuration():0};a.players.minplayer.prototype.getCurrentTime=
function(){return this.isReady()?this.player.getCurrentTime():0};a.players.minplayer.prototype.getBytesLoaded=function(){return this.isReady()?this.player.getMediaBytesLoaded():0};a.players.minplayer.prototype.getBytesTotal=function(){return this.isReady()?this.player.getMediaBytesTotal():0}})(jQuery,Drupal.media);Drupal.media=Drupal.media||{};
(function(d,a){a.players=a.players||{};a.players.youtube=function(b,c,e){a.players.flash.call(this,b,c,e);this.quality="default"};a.players.youtube.prototype=new a.players.flash;a.players.youtube.prototype.constructor=a.players.youtube;window.onYouTubePlayerReady=function(b){if(a.player[b])a.player[b].media.onReady()};a.players.youtube.prototype.construct=function(){a.players.flash.prototype.construct.call(this);this.getPlayerState=function(a){switch(a){case 5:return"ready";case 3:return"waiting";
case 2:return"pause";case 1:return"play";case 0:return"ended";case -1:return"abort";default:return"unknown"}};var b=this;window[this.options.id+"StateChange"]=function(a){b.trigger(b.getPlayerState(a))};window[this.options.id+"PlayerError"]=function(a){b.trigger("error",a)};window[this.options.id+"QualityChange"]=function(a){b.quality=a};if(this.player){var c=this.options.id+"PlayerError",e=this.options.id+"QualityChange";this.player.addEventListener("onStateChange",this.options.id+"StateChange");
this.player.addEventListener("onError",c);this.player.addEventListener("onPlaybackQualityChange",e)}};a.players.youtube.getPriority=function(){return 10};a.players.youtube.canPlay=function(a){return a.mimetype==="video/youtube"?true:a.path.search(/^http(s)?\:\/\/(www\.)?youtube\.com/i)===0};a.players.youtube.prototype.create=function(){a.players.base.prototype.flash.call(this);var b={file:this.mediaFile.path,autostart:this.options.settings.autoplay},c="http://www.youtube.com/apiplayer?rand="+Math.floor(Math.random()*
1E6);c+="&amp;version=3&amp;enablejsapi=1&amp;playerapiid=";c+=this.options.id;return a.players.flash.getFlash({swf:c,id:this.options.id+"_player",playerType:"flash",width:this.options.settings.width,height:"100%",flashvars:b,wmode:this.options.wmode})};a.players.youtube.prototype.regex=function(){return/^http[s]?\:\/\/(www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9]+)/i};a.players.youtube.prototype.load=function(b){a.players.flash.prototype.load.call(this,b);if(this.isReady()){var b=this.regex(),c="",
c=this.mediaFile.path.search(b)===0?this.mediaFile.path.replace(b,"$2"):this.mediaFile.path;this.player.loadVideoById(c,0,this.quality)}};a.players.youtube.prototype.play=function(){a.players.flash.prototype.play.call(this);this.isReady()&&this.player.playVideo()};a.players.youtube.prototype.pause=function(){a.players.flash.prototype.pause.call(this);this.isReady()&&this.player.pauseVideo()};a.players.youtube.prototype.stop=function(){a.players.flash.prototype.stop.call(this);this.isReady()&&this.player.stopVideo()};
a.players.youtube.prototype.seek=function(b){a.players.flash.prototype.seek.call(this,b);this.isReady()&&this.player.seekTo(b,true)};a.players.youtube.prototype.setVolume=function(b){a.players.flash.prototype.setVolume.call(this,b);this.isReady()&&this.player.setVolume(b*100)};a.players.youtube.prototype.getVolume=function(){return this.isReady()?this.player.getVolume()/100:a.players.flash.prototype.getVolume.call(this)};a.players.youtube.prototype.getPlayerDuration=function(){return this.isReady()?
this.player.getDuration():0};a.players.youtube.prototype.getCurrentTime=function(){return this.isReady()?this.player.getCurrentTime():0};a.players.youtube.prototype.getBytesLoaded=function(){return this.isReady()?this.player.getVideoBytesLoaded():0};a.players.youtube.prototype.getBytesTotal=function(){return this.isReady()?this.player.getVideoBytesTotal():0}})(jQuery,Drupal.media);Drupal.media=Drupal.media||{};
(function(d,a){a.controllers=a.controllers||{};a.controllers.base=function(b,c){a.display.call(this,b,c)};a.controllers.base.prototype=new a.display;a.controllers.base.prototype.constructor=a.controllers.base;a.formatTime=function(a){var a=a||0,c=0,e=0,f=0,d="",f=Math.floor(a/3600);a-=f*3600;e=Math.floor(a/60);a-=e*60;c=Math.floor(a%60);f&&(d+=String(f),d+=":");d+=e>=10?String(e):"0"+String(e);d+=":";d+=c>=10?String(c):"0"+String(c);return{time:d,units:""}};a.controllers.base.prototype.getElements=
function(){var b=a.display.prototype.getElements.call(this);return d.extend(b,{play:null,pause:null,fullscreen:null,seek:null,volume:null,timer:null})};a.controllers.base.prototype.construct=function(){function b(a,b){var c=b?"play":"pause";a.display.trigger(c);a.setPlayPause(b);if(a.player)a.player[c]()}a.display.prototype.construct.call(this);this.elements.play&&this.elements.play.bind("click",{obj:this},function(a){a.preventDefault();b(a.data.obj,true)});this.elements.pause&&this.elements.pause.bind("click",
{obj:this},function(a){a.preventDefault();b(a.data.obj,false)});var c=this,e={};this.elements.fullscreen&&this.elements.fullscreen.click(function(){c.elements.player.hasClass("fullscreen")?c.elements.player.removeClass("fullscreen"):c.elements.player.addClass("fullscreen")}).css({pointer:"hand"});this.dragging=false;if(this.elements.seek)this.seekBar=this.elements.seek.slider({range:"min"});if(this.elements.volume)e={range:"min",orientation:"vertical"},this.volumeBar=this.elements.volume.slider(e)};
a.controllers.base.prototype.setPlayPause=function(a){var c="";this.elements.play&&this.elements.play.css("display",a?"inherit":"none");this.elements.pause&&this.elements.pause.css("display",a?"none":"inherit")};a.controllers.base.prototype.setTimeString=function(b,c){this.elements[b]&&this.elements[b].text(a.formatTime(c).time)};a.controllers.base.prototype.setPlayer=function(b){a.display.prototype.setPlayer.call(this,b);b.display.bind("pause",{obj:this},function(a){a.data.obj.setPlayPause(true);
clearInterval(a.data.obj.interval)});b.display.bind("playing",{obj:this},function(a){a.data.obj.setPlayPause(false)});b.display.bind("durationchange",{obj:this},function(a,b){a.data.obj.setTimeString("duration",b.duration)});b.display.bind("timeupdate",{obj:this},function(a,b){if(!a.data.obj.dragging){var c=0;b.duration&&(c=b.currentTime/b.duration*100);a.data.obj.seekBar&&a.data.obj.seekBar.slider("option","value",c);a.data.obj.setTimeString("timer",b.currentTime)}});if(this.seekBar){var c=this;
this.seekBar.slider({start:function(){c.dragging=true},stop:function(a,d){c.dragging=false;var g=d.value/100*b.getDuration();b.seek(g)},slide:function(a,d){var g=d.value/100*b.getDuration();c.dragging||b.seek(g);c.setTimeString("timer",g)}})}b.setVolume(this.options.volume/100);this.volumeBar&&(this.volumeBar.slider("option","value",this.options.volume),this.volumeBar.slider({slide:function(a,c){b.setVolume(c.value/100)}}))}})(jQuery,Drupal.media);Drupal.media=Drupal.media||{};
(function(d,a){a.templates=a.templates||{};a.templates.base=function(b,c){a.display.call(this,b,c)};a.templates.base.prototype=new a.display;a.templates.base.prototype.getElements=function(){var b=a.display.prototype.getElements.call(this);return d.extend(b,{player:null,display:null,media:null})};a.templates.base.prototype.onFullScreen=function(){}})(jQuery,Drupal.media);
