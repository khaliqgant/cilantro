define(["cilantro/define/events"],function(a){var b={description:$('<div id="description"></div>').appendTo("body")};b.description.timeout=null,b.description.bind(a.ACTIVATE_DESCRIPTION,function(a){clearTimeout(b.description.timeout);var c,d,e=$(a.target),f=e.offset(),g=e.outerWidth(),h=e.children(".description").html();b.description.html(h),c=b.description.outerHeight(),d=$(window).height()-(c+f.top),b.description.css({left:f.left+g+20,top:f.top+(d<0?d:0)}).show();return!1}),b.description.bind(a.DEACTIVATE_DESCRIPTION,function(a,c){c=c||0,b.description.timeout=setTimeout(function(){b.description.fadeOut(100)},c);return!1}),b.description.bind({mouseover:function(){clearTimeout(b.description.timeout)},mouseout:function(){b.description.trigger(a.DEACTIVATE_DESCRIPTION,[200])}})})