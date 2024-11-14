/*!
 * jquery.unevent.js 0.2
 * https://github.com/yckart/jquery.unevent.js
 *
 * Copyright (c) 2013 Yannick Albert (http://yckart.com)
 * Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php).
 * 2013/07/26
**/
;(function ($) {
    var on = $.fn.on, timer;
    $.fn.on = function () {
        var args = Array.apply(null, arguments);
        var last = args[args.length - 1];

        if (isNaN(last) || (last === 1 && args.pop())) return on.apply(this, args);

        var delay = args.pop();
        var fn = args.pop();

        args.push(function () {
            var self = this, params = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () {
                fn.apply(self, params);
            }, delay);
        });

        return on.apply(this, args);
    };
}(this.jQuery || this.Zepto));


// Expanding Textareas v0.1.1
// MIT License
// https://github.com/bgrins/ExpandingTextareas

(function(factory) {
  // Add jQuery via AMD registration or browser globals
  if (typeof define === 'function' && define.amd) {
    define([ 'jquery' ], factory);
  }
  else {
    factory(jQuery);
  }
}(function ($) {

  var Expanding = function($textarea, opts) {
    Expanding._registry.push(this);

    this.$textarea = $textarea;
    this.$textCopy = $("<span />");
    this.$clone = $("<pre class='expanding-clone'><br /></pre>").prepend(this.$textCopy);

    this._resetStyles();
    this._setCloneStyles();
    this._setTextareaStyles();

    $textarea
      .wrap($("<div class='expanding-wrapper' style='position:relative' />"))
      .after(this.$clone);

    this.attach();
    this.update();
    if (opts.update) $textarea.bind("update.expanding", opts.update);
  };

  // Stores (active) `Expanding` instances
  // Destroyed instances are removed
  Expanding._registry = [];

  // Returns the `Expanding` instance given a DOM node
  Expanding.getExpandingInstance = function(textarea) {
    var $textareas = $.map(Expanding._registry, function(instance) {
        return instance.$textarea[0];
      }),
      index = $.inArray(textarea, $textareas);
    return index > -1 ? Expanding._registry[index] : null;
  };

  // Returns the version of Internet Explorer or -1
  // (indicating the use of another browser).
  // From: http://msdn.microsoft.com/en-us/library/ms537509(v=vs.85).aspx#ParsingUA
  var ieVersion = (function() {
    var v = -1;
    if (navigator.appName === "Microsoft Internet Explorer") {
      var ua = navigator.userAgent;
      var re = new RegExp("MSIE ([0-9]{1,}[\\.0-9]{0,})");
      if (re.exec(ua) !== null) v = parseFloat(RegExp.$1);
    }
    return v;
  })();

  // Check for oninput support
  // IE9 supports oninput, but not when deleting text, so keyup is used.
  // onpropertychange _is_ supported by IE8/9, but may not be fired unless
  // attached with `attachEvent`
  // (see: http://stackoverflow.com/questions/18436424/ie-onpropertychange-event-doesnt-fire),
  // and so is avoided altogether.
  var inputSupported = "oninput" in document.createElement("input") && ieVersion !== 9;

  Expanding.prototype = {

    // Attaches input events
    // Only attaches `keyup` events if `input` is not fully suported
    attach: function() {
      var events = 'input.expanding change.expanding',
        _this = this;
      if(!inputSupported) events += ' keyup.expanding';
      this.$textarea.bind(events, function() { _this.update(); });
    },

    // Updates the clone with the textarea value
    update: function() {
      this.$textCopy.text(this.$textarea.val().replace(/\r\n/g, "\n"));

      // Use `triggerHandler` to prevent conflicts with `update` in Prototype.js
      this.$textarea.triggerHandler("update.expanding");
    },

    // Tears down the plugin: removes generated elements, applies styles
    // that were prevously present, removes instance from registry,
    // unbinds events
    destroy: function() {
      this.$clone.remove();
      this.$textarea
        .unwrap()
        .attr('style', this._oldTextareaStyles || '');
      delete this._oldTextareaStyles;
      var index = $.inArray(this, Expanding._registry);
      if (index > -1) Expanding._registry.splice(index, 1);
      this.$textarea.unbind(
        'input.expanding change.expanding keyup.expanding update.expanding');
    },

    // Applies reset styles to the textarea and clone
    // Stores the original textarea styles in case of destroying
    _resetStyles: function() {
      this._oldTextareaStyles = this.$textarea.attr('style');

      this.$textarea.add(this.$clone).css({
        margin: 0,
        webkitBoxSizing: "border-box",
        mozBoxSizing: "border-box",
        boxSizing: "border-box",
        width: "100%"
      });
    },

    // Sets the basic clone styles and copies styles over from the textarea
    _setCloneStyles: function() {
      var css = {
        display: 'block',
        border: '0 solid',
        visibility: 'hidden',
        minHeight: this.$textarea.outerHeight()
      };

      if(this.$textarea.attr("wrap") === "off") css.overflowX = "scroll";
      else css.whiteSpace = "pre-wrap";

      this.$clone.css(css);
      this._copyTextareaStylesToClone();
    },

    _copyTextareaStylesToClone: function() {
      var _this = this,
        properties = [
          'lineHeight', 'textDecoration', 'letterSpacing',
          'fontSize', 'fontFamily', 'fontStyle',
          'fontWeight', 'textTransform', 'textAlign',
          'direction', 'wordSpacing', 'fontSizeAdjust',
          'wordWrap', 'word-break',
          'borderLeftWidth', 'borderRightWidth',
          'borderTopWidth','borderBottomWidth',
          'paddingLeft', 'paddingRight',
          'paddingTop','paddingBottom', 'maxHeight'];

      $.each(properties, function(i, property) {
        var val = _this.$textarea.css(property);

        // Prevent overriding percentage css values.
        if(_this.$clone.css(property) !== val) {
          _this.$clone.css(property, val);
          if(property === 'maxHeight' && val !== 'none') {
            _this.$clone.css('overflow', 'hidden');
          }
        }
      });
    },

    _setTextareaStyles: function() {
      this.$textarea.css({
        position: "absolute",
        top: 0,
        left: 0,
        height: "100%",
        resize: "none",
        overflow: "auto"
      });
    }
  };

  $.expanding = $.extend({
    autoInitialize: true,
    initialSelector: "textarea.expanding",
    opts: {
      update: function() { }
    }
  }, $.expanding || {});

  $.fn.expanding = function(o) {

    if (o === "destroy") {
      this.each(function() {
        var instance = Expanding.getExpandingInstance(this);
        if (instance) instance.destroy();
      });
      return this;
    }

    // Checks to see if any of the given DOM nodes have the
    // expanding behaviour.
    if (o === "active") {
      return !!this.filter(function() {
        return !!Expanding.getExpandingInstance(this);
      }).length;
    }

    var opts = $.extend({ }, $.expanding.opts, o);

    this.filter("textarea").each(function() {
      var visible = this.offsetWidth > 0 || this.offsetHeight > 0,
          initialized = Expanding.getExpandingInstance(this);

      if(visible && !initialized) new Expanding($(this), opts);
      else {
        if(!visible) _warn("ExpandingTextareas: attempt to initialize an invisible textarea. Call expanding() again once it has been inserted into the page and/or is visible.");
        if(initialized) _warn("ExpandingTextareas: attempt to initialize a textarea that has already been initialized. Subsequent calls are ignored.");
      }
    });
    return this;
  };

  function _warn(text) {
    if(window.console && console.warn) console.warn(text);
  }

  $(function () {
    if ($.expanding.autoInitialize) {
      $($.expanding.initialSelector).expanding();
    }
  });

}));

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2001 Robert Penner
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
 */
 
/*! jQuery Mobile v1.4.2 | Copyright 2010, 2014 jQuery Foundation, Inc. | jquery.org/license */
(function(e,t,n){typeof define=="function"&&define.amd?define(["jquery"],function(r){return n(r,e,t),r.mobile}):n(e.jQuery,e,t)})(this,document,function(e,t,n,r){(function(e,t,n,r){function T(e){while(e&&typeof e.originalEvent!="undefined")e=e.originalEvent;return e}function N(t,n){var i=t.type,s,o,a,l,c,h,p,d,v;t=e.Event(t),t.type=n,s=t.originalEvent,o=e.event.props,i.search(/^(mouse|click)/)>-1&&(o=f);if(s)for(p=o.length,l;p;)l=o[--p],t[l]=s[l];i.search(/mouse(down|up)|click/)>-1&&!t.which&&(t.which=1);if(i.search(/^touch/)!==-1){a=T(s),i=a.touches,c=a.changedTouches,h=i&&i.length?i[0]:c&&c.length?c[0]:r;if(h)for(d=0,v=u.length;d<v;d++)l=u[d],t[l]=h[l]}return t}function C(t){var n={},r,s;while(t){r=e.data(t,i);for(s in r)r[s]&&(n[s]=n.hasVirtualBinding=!0);t=t.parentNode}return n}function k(t,n){var r;while(t){r=e.data(t,i);if(r&&(!n||r[n]))return t;t=t.parentNode}return null}function L(){g=!1}function A(){g=!0}function O(){E=0,v.length=0,m=!1,A()}function M(){L()}function _(){D(),c=setTimeout(function(){c=0,O()},e.vmouse.resetTimerDuration)}function D(){c&&(clearTimeout(c),c=0)}function P(t,n,r){var i;if(r&&r[t]||!r&&k(n.target,t))i=N(n,t),e(n.target).trigger(i);return i}function H(t){var n=e.data(t.target,s),r;!m&&(!E||E!==n)&&(r=P("v"+t.type,t),r&&(r.isDefaultPrevented()&&t.preventDefault(),r.isPropagationStopped()&&t.stopPropagation(),r.isImmediatePropagationStopped()&&t.stopImmediatePropagation()))}function B(t){var n=T(t).touches,r,i,o;n&&n.length===1&&(r=t.target,i=C(r),i.hasVirtualBinding&&(E=w++,e.data(r,s,E),D(),M(),d=!1,o=T(t).touches[0],h=o.pageX,p=o.pageY,P("vmouseover",t,i),P("vmousedown",t,i)))}function j(e){if(g)return;d||P("vmousecancel",e,C(e.target)),d=!0,_()}function F(t){if(g)return;var n=T(t).touches[0],r=d,i=e.vmouse.moveDistanceThreshold,s=C(t.target);d=d||Math.abs(n.pageX-h)>i||Math.abs(n.pageY-p)>i,d&&!r&&P("vmousecancel",t,s),P("vmousemove",t,s),_()}function I(e){if(g)return;A();var t=C(e.target),n,r;P("vmouseup",e,t),d||(n=P("vclick",e,t),n&&n.isDefaultPrevented()&&(r=T(e).changedTouches[0],v.push({touchID:E,x:r.clientX,y:r.clientY}),m=!0)),P("vmouseout",e,t),d=!1,_()}function q(t){var n=e.data(t,i),r;if(n)for(r in n)if(n[r])return!0;return!1}function R(){}function U(t){var n=t.substr(1);return{setup:function(){q(this)||e.data(this,i,{});var r=e.data(this,i);r[t]=!0,l[t]=(l[t]||0)+1,l[t]===1&&b.bind(n,H),e(this).bind(n,R),y&&(l.touchstart=(l.touchstart||0)+1,l.touchstart===1&&b.bind("touchstart",B).bind("touchend",I).bind("touchmove",F).bind("scroll",j))},teardown:function(){--l[t],l[t]||b.unbind(n,H),y&&(--l.touchstart,l.touchstart||b.unbind("touchstart",B).unbind("touchmove",F).unbind("touchend",I).unbind("scroll",j));var r=e(this),s=e.data(this,i);s&&(s[t]=!1),r.unbind(n,R),q(this)||r.removeData(i)}}}var i="virtualMouseBindings",s="virtualTouchID",o="vmouseover vmousedown vmousemove vmouseup vclick vmouseout vmousecancel".split(" "),u="clientX clientY pageX pageY screenX screenY".split(" "),a=e.event.mouseHooks?e.event.mouseHooks.props:[],f=e.event.props.concat(a),l={},c=0,h=0,p=0,d=!1,v=[],m=!1,g=!1,y="addEventListener"in n,b=e(n),w=1,E=0,S,x;e.vmouse={moveDistanceThreshold:10,clickDistanceThreshold:10,resetTimerDuration:1500};for(x=0;x<o.length;x++)e.event.special[o[x]]=U(o[x]);y&&n.addEventListener("click",function(t){var n=v.length,r=t.target,i,o,u,a,f,l;if(n){i=t.clientX,o=t.clientY,S=e.vmouse.clickDistanceThreshold,u=r;while(u){for(a=0;a<n;a++){f=v[a],l=0;if(u===r&&Math.abs(f.x-i)<S&&Math.abs(f.y-o)<S||e.data(u,s)===f.touchID){t.preventDefault(),t.stopPropagation();return}}u=u.parentNode}}},!0)})(e,t,n),function(e){e.mobile={}}(e),function(e,t){var r={touch:"ontouchend"in n};e.mobile.support=e.mobile.support||{},e.extend(e.support,r),e.extend(e.mobile.support,r)}(e),function(e,t,r){function l(t,n,i,s){var o=i.type;i.type=n,s?e.event.trigger(i,r,t):e.event.dispatch.call(t,i),i.type=o}var i=e(n),s=e.mobile.support.touch,o="touchmove scroll",u=s?"touchstart":"mousedown",a=s?"touchend":"mouseup",f=s?"touchmove":"mousemove";e.each("touchstart touchmove touchend tap taphold swipe swipeleft swiperight scrollstart scrollstop".split(" "),function(t,n){e.fn[n]=function(e){return e?this.bind(n,e):this.trigger(n)},e.attrFn&&(e.attrFn[n]=!0)}),e.event.special.scrollstart={enabled:!0,setup:function(){function s(e,n){r=n,l(t,r?"scrollstart":"scrollstop",e)}var t=this,n=e(t),r,i;n.bind(o,function(t){if(!e.event.special.scrollstart.enabled)return;r||s(t,!0),clearTimeout(i),i=setTimeout(function(){s(t,!1)},50)})},teardown:function(){e(this).unbind(o)}},e.event.special.tap={tapholdThreshold:750,emitTapOnTaphold:!0,setup:function(){var t=this,n=e(t),r=!1;n.bind("vmousedown",function(s){function a(){clearTimeout(u)}function f(){a(),n.unbind("vclick",c).unbind("vmouseup",a),i.unbind("vmousecancel",f)}function c(e){f(),!r&&o===e.target?l(t,"tap",e):r&&e.stopPropagation()}r=!1;if(s.which&&s.which!==1)return!1;var o=s.target,u;n.bind("vmouseup",a).bind("vclick",c),i.bind("vmousecancel",f),u=setTimeout(function(){e.event.special.tap.emitTapOnTaphold||(r=!0),l(t,"taphold",e.Event("taphold",{target:o}))},e.event.special.tap.tapholdThreshold)})},teardown:function(){e(this).unbind("vmousedown").unbind("vclick").unbind("vmouseup"),i.unbind("vmousecancel")}},e.event.special.swipe={scrollSupressionThreshold:30,durationThreshold:1e3,horizontalDistanceThreshold:30,verticalDistanceThreshold:30,getLocation:function(e){var n=t.pageXOffset,r=t.pageYOffset,i=e.clientX,s=e.clientY;if(e.pageY===0&&Math.floor(s)>Math.floor(e.pageY)||e.pageX===0&&Math.floor(i)>Math.floor(e.pageX))i-=n,s-=r;else if(s<e.pageY-r||i<e.pageX-n)i=e.pageX-n,s=e.pageY-r;return{x:i,y:s}},start:function(t){var n=t.originalEvent.touches?t.originalEvent.touches[0]:t,r=e.event.special.swipe.getLocation(n);return{time:(new Date).getTime(),coords:[r.x,r.y],origin:e(t.target)}},stop:function(t){var n=t.originalEvent.touches?t.originalEvent.touches[0]:t,r=e.event.special.swipe.getLocation(n);return{time:(new Date).getTime(),coords:[r.x,r.y]}},handleSwipe:function(t,n,r,i){if(n.time-t.time<e.event.special.swipe.durationThreshold&&Math.abs(t.coords[0]-n.coords[0])>e.event.special.swipe.horizontalDistanceThreshold&&Math.abs(t.coords[1]-n.coords[1])<e.event.special.swipe.verticalDistanceThreshold){var s=t.coords[0]>n.coords[0]?"swipeleft":"swiperight";return l(r,"swipe",e.Event("swipe",{target:i,swipestart:t,swipestop:n}),!0),l(r,s,e.Event(s,{target:i,swipestart:t,swipestop:n}),!0),!0}return!1},eventInProgress:!1,setup:function(){var t,n=this,r=e(n),s={};t=e.data(this,"mobile-events"),t||(t={length:0},e.data(this,"mobile-events",t)),t.length++,t.swipe=s,s.start=function(t){if(e.event.special.swipe.eventInProgress)return;e.event.special.swipe.eventInProgress=!0;var r,o=e.event.special.swipe.start(t),u=t.target,l=!1;s.move=function(t){if(!o)return;r=e.event.special.swipe.stop(t),l||(l=e.event.special.swipe.handleSwipe(o,r,n,u),l&&(e.event.special.swipe.eventInProgress=!1)),Math.abs(o.coords[0]-r.coords[0])>e.event.special.swipe.scrollSupressionThreshold&&t.preventDefault()},s.stop=function(){l=!0,e.event.special.swipe.eventInProgress=!1,i.off(f,s.move),s.move=null},i.on(f,s.move).one(a,s.stop)},r.on(u,s.start)},teardown:function(){var t,n;t=e.data(this,"mobile-events"),t&&(n=t.swipe,delete t.swipe,t.length--,t.length===0&&e.removeData(this,"mobile-events")),n&&(n.start&&e(this).off(u,n.start),n.move&&i.off(f,n.move),n.stop&&i.off(a,n.stop))}},e.each({scrollstop:"scrollstart",taphold:"tap",swipeleft:"swipe",swiperight:"swipe"},function(t,n){e.event.special[t]={setup:function(){e(this).bind(n,e.noop)},teardown:function(){e(this).unbind(n)}}})}(e,this)});
