(function(a){function o(b,c){return parseInt(a.css(b,c))||0}function n(a,b,c){var d=a.parentNode,e=a.style,f=(d.offsetWidth-a.offsetWidth)/2-o(d,"borderLeftWidth"),g=(d.offsetHeight-a.offsetHeight)/2-o(d,"borderTopWidth");b&&(e.left=f>0?f+"px":"0"),c&&(e.top=g>0?g+"px":"0")}function m(a){if(!!g){var b=g[a===!0?g.length-1:0];b&&b.focus()}}function l(b){if(b.keyCode&&b.keyCode==9&&f&&b.data.constrainTabKey){var c=g,d=!b.shiftKey&&b.target===c[c.length-1],e=b.shiftKey&&b.target===c[0];if(d||e){setTimeout(function(){m(e)},10);return!1}}var h=b.data;if(a(b.target).parents("div."+h.blockMsgClass).length>0)return!0;return a(b.target).parents().children().filter("div.block").length==0}function k(b,c,d){var e=c==window,g=a(c);if(!!b||!(e&&!f||!e&&!g.data("block.isBlocked"))){e||g.data("block.isBlocked",b);if(!d.bindEvents||b&&!d.showOverlay)return;var h="mousedown mouseup keydown keypress";b?a(document).bind(h,d,l):a(document).unbind(h,l)}}function j(b,c,d,e){b.each(function(a,b){this.parentNode&&this.parentNode.removeChild(this)}),c&&c.el&&(c.el.style.display=c.display,c.el.style.position=c.position,c.parent&&c.parent.appendChild(c.el),a(e).removeData("block.history")),typeof d.onUnblock=="function"&&d.onUnblock(e,d)}function i(b,c){var d=b==window,e=a(b),h=e.data("block.history"),i=e.data("block.timeout");i&&(clearTimeout(i),e.removeData("block.timeout")),c=a.extend({},a.block.defaults,c||{}),k(0,b,c);var l;d?l=a("body").children().filter(".block").add("body > .block"):l=a(".block",b),d&&(f=g=null),c.fadeOut?(l.fadeOut(c.fadeOut),setTimeout(function(){j(l,h,c,b)},c.fadeOut)):j(l,h,c,b)}function h(c,h){var j=c==window,l=h&&h.message!==undefined?h.message:undefined;h=a.extend({},a.block.defaults,h||{}),h.overlayCSS=a.extend({},a.block.defaults.overlayCSS,h.overlayCSS||{});var p=a.extend({},a.block.defaults.css,h.css||{}),q=a.extend({},a.block.defaults.themedCSS,h.themedCSS||{});l=l===undefined?h.message:l,j&&f&&i(window,{fadeOut:0});if(l&&typeof l!="string"&&(l.parentNode||l.jquery)){var r=l.jquery?l[0]:l,s={};a(c).data("block.history",s),s.el=r,s.parent=r.parentNode,s.display=r.style.display,s.position=r.style.position,s.parent&&s.parent.removeChild(r)}var t=h.baseZ,u=a.browser.msie||h.forceIframe?a('<iframe class="block" style="z-index:'+t++ +';display:none;border:none;margin:0;padding:0;position:absolute;width:100%;height:100%;top:0;left:0" src="'+h.iframeSrc+'"></iframe>'):a('<div class="block" style="display:none"></div>'),v=h.theme?a('<div class="block blockOverlay ui-widget-overlay" style="z-index:'+t++ +';display:none"></div>'):a('<div class="block blockOverlay" style="z-index:'+t++ +';display:none;border:none;margin:0;padding:0;width:100%;height:100%;top:0;left:0"></div>'),w,x;h.theme&&j?x='<div class="block '+h.blockMsgClass+' blockPage ui-dialog ui-widget ui-corner-all" style="z-index:'+t+';display:none;position:fixed">'+'<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">'+(h.title||"&nbsp;")+"</div>"+'<div class="ui-widget-content ui-dialog-content"></div>'+"</div>":h.theme?x='<div class="block '+h.blockMsgClass+' blockElement ui-dialog ui-widget ui-corner-all" style="z-index:'+t+';display:none;position:absolute">'+'<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">'+(h.title||"&nbsp;")+"</div>"+'<div class="ui-widget-content ui-dialog-content"></div>'+"</div>":j?x='<div class="block '+h.blockMsgClass+' blockPage" style="z-index:'+t+';display:none;position:fixed"></div>':x='<div class="block '+h.blockMsgClass+' blockElement" style="z-index:'+t+';display:none;position:absolute"></div>',w=a(x),l&&(h.theme?(w.css(q),w.addClass("ui-widget-content")):w.css(p)),!h.theme&&(!h.applyPlatformOpacityRules||!a.browser.mozilla||!/Linux/.test(navigator.platform))&&v.css(h.overlayCSS),v.css("position",j?"fixed":"absolute"),(a.browser.msie||h.forceIframe)&&u.css("opacity",0);var y=[u,v,w],z=j?a("body"):a(c);a.each(y,function(){this.appendTo(z)}),h.theme&&h.draggable&&a.fn.draggable&&w.draggable({handle:".ui-dialog-titlebar",cancel:"li"});var A=d&&(!a.boxModel||a("object,embed",j?null:c).length>0);if(e||A){j&&h.allowBodyStretch&&a.boxModel&&a("html,body").css("height","100%");if((e||!a.boxModel)&&!j)var B=o(c,"borderTopWidth"),C=o(c,"borderLeftWidth"),D=B?"(0 - "+B+")":0,E=C?"(0 - "+C+")":0;a.each([u,v,w],function(a,b){var c=b[0].style;c.position="absolute";if(a<2)j?c.setExpression("height","Math.max(document.body.scrollHeight, document.body.offsetHeight) - (jQuery.boxModel?0:"+h.quirksmodeOffsetHack+') + "px"'):c.setExpression("height",'this.parentNode.offsetHeight + "px"'),j?c.setExpression("width",'jQuery.boxModel && document.documentElement.clientWidth || document.body.clientWidth + "px"'):c.setExpression("width",'this.parentNode.offsetWidth + "px"'),E&&c.setExpression("left",E),D&&c.setExpression("top",D);else if(h.centerY)j&&c.setExpression("top",'(document.documentElement.clientHeight || document.body.clientHeight) / 2 - (this.offsetHeight / 2) + (blah = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"'),c.marginTop=0;else if(!h.centerY&&j){var d=h.css&&h.css.top?parseInt(h.css.top):0,e="((document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "+d+') + "px"';c.setExpression("top",e)}})}l&&(h.theme?w.find(".ui-widget-content").append(l):w.append(l),(l.jquery||l.nodeType)&&a(l).show()),(a.browser.msie||h.forceIframe)&&h.showOverlay&&u.show();if(h.fadeIn){var F=h.onBlock?h.onBlock:b,G=h.showOverlay&&!l?F:b,H=l?F:b;h.showOverlay&&v._fadeIn(h.fadeIn,G),l&&w._fadeIn(h.fadeIn,H)}else h.showOverlay&&v.show(),l&&w.show(),h.onBlock&&h.onBlock();k(1,c,h),j?(f=w[0],g=a(":input:enabled:visible",f),h.focusInput&&setTimeout(m,20)):n(w[0],h.centerX,h.centerY);if(h.timeout){var I=setTimeout(function(){j?a.unblock(h):a(c).unblock(h)},h.timeout);a(c).data("block.timeout",I)}}if(/1\.(0|1|2)\.(0|1|2)/.test(a.fn.jquery)||/^1.1/.test(a.fn.jquery))alert("block requires jQuery v1.2.3 or later!  You are using v"+a.fn.jquery);else{a.fn._fadeIn=a.fn.fadeIn;var b=function(){},c=document.documentMode||0,d=a.browser.msie&&(a.browser.version<8&&!c||c<8),e=a.browser.msie&&/MSIE 6.0/.test(navigator.userAgent)&&!c;a.block=function(a){h(window,a)},a.unblock=function(a){i(window,a)},a.growlUI=function(b,c,d,e){var f=a('<div class="growlUI"></div>');b&&f.append("<h1>"+b+"</h1>"),c&&f.append("<h2>"+c+"</h2>"),d==undefined&&(d=3e3),a.block({message:f,fadeIn:700,fadeOut:1e3,centerY:!1,timeout:d,showOverlay:!1,onUnblock:e,css:a.block.defaults.growlCSS})},a.fn.block=function(b){return this.unblock({fadeOut:0}).each(function(){a.css(this,"position")=="static"&&(this.style.position="relative"),a.browser.msie&&(this.style.zoom=1),h(this,b)})},a.fn.unblock=function(a){return this.each(function(){i(this,a)})},a.block.version=2.38,a.block.defaults={message:"<h1>Please wait...</h1>",title:null,draggable:!0,theme:!1,css:{padding:0,margin:0,width:"30%",top:"40%",left:"35%",textAlign:"center",color:"#000",border:"3px solid #aaa",backgroundColor:"#fff",cursor:"wait"},themedCSS:{width:"30%",top:"40%",left:"35%"},overlayCSS:{backgroundColor:"#000",opacity:.6,cursor:"wait"},growlCSS:{width:"350px",top:"10px",left:"",right:"10px",border:"none",padding:"5px",opacity:.6,cursor:"default",color:"#fff",backgroundColor:"#000","-webkit-border-radius":"10px","-moz-border-radius":"10px","border-radius":"10px"},iframeSrc:/^https/i.test(window.location.href||"")?"javascript:false":"about:blank",forceIframe:!1,baseZ:1e3,centerX:!0,centerY:!0,allowBodyStretch:!0,bindEvents:!0,constrainTabKey:!0,fadeIn:200,fadeOut:400,timeout:0,showOverlay:!0,focusInput:!0,applyPlatformOpacityRules:!0,onBlock:null,onUnblock:null,quirksmodeOffsetHack:4,blockMsgClass:"blockMsg"};var f=null,g=[]}})(jQuery)