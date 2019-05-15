/*
 jQuery JavaScript Library v1.7.2
 http://jquery.com/

 Copyright 2011, John Resig
 Dual licensed under the MIT or GPL Version 2 licenses.
 http://jquery.org/license

 Includes Sizzle.js
 http://sizzlejs.com/
 Copyright 2011, The Dojo Foundation
 Released under the MIT, BSD, and GPL Licenses.

 Date: Wed Mar 21 12:46:34 2012 -0700
*/
var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.findInternal = function(a, c, d) {
  a instanceof String && (a = String(a));
  for (var b = a.length, e = 0; e < b; e++) {
    var f = a[e];
    if (c.call(d, f, e, a)) {
      return {i:e, v:f};
    }
  }
  return {i:-1, v:void 0};
};
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, c, d) {
  a != Array.prototype && a != Object.prototype && (a[c] = d.value);
};
$jscomp.getGlobal = function(a) {
  return "undefined" != typeof window && window === a ? a : "undefined" != typeof global && null != global ? global : a;
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.polyfill = function(a, c, d, b) {
  if (c) {
    d = $jscomp.global;
    a = a.split(".");
    for (b = 0; b < a.length - 1; b++) {
      var e = a[b];
      e in d || (d[e] = {});
      d = d[e];
    }
    a = a[a.length - 1];
    b = d[a];
    c = c(b);
    c != b && null != c && $jscomp.defineProperty(d, a, {configurable:!0, writable:!0, value:c});
  }
};
$jscomp.polyfill("Array.prototype.find", function(a) {
  return a ? a : function(a, d) {
    return $jscomp.findInternal(this, a, d).v;
  };
}, "es6", "es3");
$jscomp.polyfill("Array.prototype.fill", function(a) {
  return a ? a : function(a, d, b) {
    var c = this.length || 0;
    0 > d && (d = Math.max(0, c + d));
    if (null == b || b > c) {
      b = c;
    }
    b = Number(b);
    0 > b && (b = Math.max(0, c + b));
    for (d = Number(d || 0); d < b; d++) {
      this[d] = a;
    }
    return this;
  };
}, "es6", "es3");
$jscomp.checkStringArgs = function(a, c, d) {
  if (null == a) {
    throw new TypeError("The 'this' value for String.prototype." + d + " must not be null or undefined");
  }
  if (c instanceof RegExp) {
    throw new TypeError("First argument to String.prototype." + d + " must not be a regular expression");
  }
  return a + "";
};
$jscomp.polyfill("String.prototype.repeat", function(a) {
  return a ? a : function(a) {
    var c = $jscomp.checkStringArgs(this, null, "repeat");
    if (0 > a || 1342177279 < a) {
      throw new RangeError("Invalid count value");
    }
    a |= 0;
    for (var b = ""; a;) {
      if (a & 1 && (b += c), a >>>= 1) {
        c += c;
      }
    }
    return b;
  };
}, "es6", "es3");
$jscomp.SYMBOL_PREFIX = "jscomp_symbol_";
$jscomp.initSymbol = function() {
  $jscomp.initSymbol = function() {
  };
  $jscomp.global.Symbol || ($jscomp.global.Symbol = $jscomp.Symbol);
};
$jscomp.Symbol = function() {
  var a = 0;
  return function(c) {
    return $jscomp.SYMBOL_PREFIX + (c || "") + a++;
  };
}();
$jscomp.initSymbolIterator = function() {
  $jscomp.initSymbol();
  var a = $jscomp.global.Symbol.iterator;
  a || (a = $jscomp.global.Symbol.iterator = $jscomp.global.Symbol("iterator"));
  "function" != typeof Array.prototype[a] && $jscomp.defineProperty(Array.prototype, a, {configurable:!0, writable:!0, value:function() {
    return $jscomp.arrayIterator(this);
  }});
  $jscomp.initSymbolIterator = function() {
  };
};
$jscomp.arrayIterator = function(a) {
  var c = 0;
  return $jscomp.iteratorPrototype(function() {
    return c < a.length ? {done:!1, value:a[c++]} : {done:!0};
  });
};
$jscomp.iteratorPrototype = function(a) {
  $jscomp.initSymbolIterator();
  a = {next:a};
  a[$jscomp.global.Symbol.iterator] = function() {
    return this;
  };
  return a;
};
$jscomp.iteratorFromArray = function(a, c) {
  $jscomp.initSymbolIterator();
  a instanceof String && (a += "");
  var d = 0, b = {next:function() {
    if (d < a.length) {
      var e = d++;
      return {value:c(e, a[e]), done:!1};
    }
    b.next = function() {
      return {done:!0, value:void 0};
    };
    return b.next();
  }};
  b[Symbol.iterator] = function() {
    return b;
  };
  return b;
};
$jscomp.polyfill("Array.prototype.values", function(a) {
  return a ? a : function() {
    return $jscomp.iteratorFromArray(this, function(a, d) {
      return d;
    });
  };
}, "es8", "es3");
$jscomp.polyfill("Array.from", function(a) {
  return a ? a : function(a, d, b) {
    $jscomp.initSymbolIterator();
    d = null != d ? d : function(a) {
      return a;
    };
    var c = [], f = a[Symbol.iterator];
    if ("function" == typeof f) {
      for (a = f.call(a); !(f = a.next()).done;) {
        c.push(d.call(b, f.value));
      }
    } else {
      f = a.length;
      for (var g = 0; g < f; g++) {
        c.push(d.call(b, a[g]));
      }
    }
    return c;
  };
}, "es6", "es3");
function parseISO8601(a) {
  var c = a.split("T");
  a = c[0].split("-");
  c = c[1].split("Z")[0].split(":");
  var d = c[2].split("."), b = Number(c[0]), e = new Date;
  return e.setUTCFullYear(Number(a[0])), e.setUTCMonth(Number(a[1]) - 1), e.setUTCDate(Number(a[2])), e.setUTCHours(Number(b)), e.setUTCMinutes(Number(c[1])), e.setUTCSeconds(Number(d[0])), d[1] ? e.setUTCMilliseconds(Number(d[1])) : e.setUTCMilliseconds(0), e;
}
(function(a, c) {
  function d(a) {
    var b = va[a] = {}, c;
    a = a.split(/\s+/);
    var e = 0;
    for (c = a.length; e < c; e++) {
      b[a[e]] = !0;
    }
    return b;
  }
  function b(a, b, e) {
    if (e === c && 1 === a.nodeType) {
      if (e = "data-" + b.replace(fa, "-$1").toLowerCase(), e = a.getAttribute(e), "string" == typeof e) {
        try {
          e = "true" === e ? !0 : "false" === e ? !1 : "null" === e ? null : h.isNumeric(e) ? +e : T.test(e) ? h.parseJSON(e) : e;
        } catch (Ra) {
        }
        h.data(a, b, e);
      } else {
        e = c;
      }
    }
    return e;
  }
  function e(a) {
    for (var b in a) {
      if (("data" !== b || !h.isEmptyObject(a[b])) && "toJSON" !== b) {
        return !1;
      }
    }
    return !0;
  }
  function f(a, b, c) {
    var e = b + "defer", d = b + "queue", f = b + "mark", r = h._data(a, e);
    !r || "queue" !== c && h._data(a, d) || "mark" !== c && h._data(a, f) || setTimeout(function() {
      h._data(a, d) || h._data(a, f) || (h.removeData(a, e, !0), r.fire());
    }, 0);
  }
  function g() {
    return !1;
  }
  function l() {
    return !0;
  }
  function k(a) {
    return !a || !a.parentNode || 11 === a.parentNode.nodeType;
  }
  function n(a, b, c) {
    b = b || 0;
    if (h.isFunction(b)) {
      return h.grep(a, function(a, e) {
        return !!b.call(a, e, a) === c;
      });
    }
    if (b.nodeType) {
      return h.grep(a, function(a, e) {
        return a === b === c;
      });
    }
    if ("string" == typeof b) {
      var e = h.grep(a, function(a) {
        return 1 === a.nodeType;
      });
      if (J.test(b)) {
        return h.filter(b, e, !c);
      }
      b = h.filter(b, e);
    }
    return h.grep(a, function(a, e) {
      return 0 <= h.inArray(a, b) === c;
    });
  }
  function q(a) {
    var b = Y.split("|");
    a = a.createDocumentFragment();
    if (a.createElement) {
      for (; b.length;) {
        a.createElement(b.pop());
      }
    }
    return a;
  }
  function u(a, b) {
    return h.nodeName(a, "table") ? a.getElementsByTagName("tbody")[0] || a.appendChild(a.ownerDocument.createElement("tbody")) : a;
  }
  function m(a, b) {
    if (1 === b.nodeType && h.hasData(a)) {
      var c, e;
      var d = h._data(a);
      a = h._data(b, d);
      var f = d.events;
      if (f) {
        for (c in delete a.handle, a.events = {}, f) {
          for (d = 0, e = f[c].length; d < e; d++) {
            h.event.add(b, c, f[c][d]);
          }
        }
      }
      a.data && (a.data = h.extend({}, a.data));
    }
  }
  function p(a, b) {
    if (1 === b.nodeType) {
      b.clearAttributes && b.clearAttributes();
      b.mergeAttributes && b.mergeAttributes(a);
      var c = b.nodeName.toLowerCase();
      "object" === c ? b.outerHTML = a.outerHTML : "input" !== c || "checkbox" !== a.type && "radio" !== a.type ? "option" === c ? b.selected = a.defaultSelected : "input" === c || "textarea" === c ? b.defaultValue = a.defaultValue : "script" === c && b.text !== a.text && (b.text = a.text) : (a.checked && (b.defaultChecked = b.checked = a.checked), b.value !== a.value && (b.value = a.value));
      b.removeAttribute(h.expando);
      b.removeAttribute("_submit_attached");
      b.removeAttribute("_change_attached");
    }
  }
  function v(a) {
    return "undefined" != typeof a.getElementsByTagName ? a.getElementsByTagName("*") : "undefined" != typeof a.querySelectorAll ? a.querySelectorAll("*") : [];
  }
  function w(a) {
    if ("checkbox" === a.type || "radio" === a.type) {
      a.defaultChecked = a.checked;
    }
  }
  function A(a) {
    var b = (a.nodeName || "").toLowerCase();
    "input" === b ? w(a) : "script" !== b && "undefined" != typeof a.getElementsByTagName && h.grep(a.getElementsByTagName("input"), w);
  }
  function D(a, b, c) {
    var e = "width" === b ? a.offsetWidth : a.offsetHeight, d = "width" === b ? 1 : 0;
    if (0 < e) {
      if ("border" !== c) {
        for (; 4 > d; d += 2) {
          c || (e -= parseFloat(h.css(a, "padding" + wa[d])) || 0), "margin" === c ? e += parseFloat(h.css(a, c + wa[d])) || 0 : e -= parseFloat(h.css(a, "border" + wa[d] + "Width")) || 0;
        }
      }
      return e + "px";
    }
    e = Ia(a, b);
    if (0 > e || null == e) {
      e = a.style[b];
    }
    if (Sa.test(e)) {
      return e;
    }
    e = parseFloat(e) || 0;
    if (c) {
      for (; 4 > d; d += 2) {
        e += parseFloat(h.css(a, "padding" + wa[d])) || 0, "padding" !== c && (e += parseFloat(h.css(a, "border" + wa[d] + "Width")) || 0), "margin" === c && (e += parseFloat(h.css(a, c + wa[d])) || 0);
      }
    }
    return e + "px";
  }
  function x(a) {
    return function(b, c) {
      "string" != typeof b && (c = b, b = "*");
      if (h.isFunction(c)) {
        b = b.toLowerCase().split(Za);
        for (var e = 0, d = b.length, f, r; e < d; e++) {
          f = b[e], (r = /^\+/.test(f)) && (f = f.substr(1) || "*"), f = a[f] = a[f] || [], f[r ? "unshift" : "push"](c);
        }
      }
    };
  }
  function F(a, b, e, d, f, g) {
    f = f || b.dataTypes[0];
    g = g || {};
    g[f] = !0;
    f = a[f];
    for (var r = 0, m = f ? f.length : 0, B = a === Ta, h; r < m && (B || !h); r++) {
      h = f[r](b, e, d), "string" == typeof h && (!B || g[h] ? h = c : (b.dataTypes.unshift(h), h = F(a, b, e, d, h, g)));
    }
    return (B || !h) && !g["*"] && (h = F(a, b, e, d, "*", g)), h;
  }
  function C(a, b) {
    var e, d, f = h.ajaxSettings.flatOptions || {};
    for (e in b) {
      b[e] !== c && ((f[e] ? a : d || (d = {}))[e] = b[e]);
    }
    d && h.extend(!0, a, d);
  }
  function O(a, b, c, e) {
    if (h.isArray(b)) {
      h.each(b, function(b, d) {
        c || kb.test(a) ? e(a, d) : O(a + "[" + ("object" == typeof d ? b : "") + "]", d, c, e);
      });
    } else {
      if (c || "object" !== h.type(b)) {
        e(a, b);
      } else {
        for (var d in b) {
          O(a + "[" + d + "]", b[d], c, e);
        }
      }
    }
  }
  function M() {
    try {
      return new a.XMLHttpRequest;
    } catch (r) {
    }
  }
  function ra() {
    Ja = c;
  }
  function Q(a, b) {
    var c = {};
    return h.each(Ma.concat.apply([], Ma.slice(0, b)), function() {
      c[this] = a;
    }), c;
  }
  function za(a) {
    if (!Ua[a]) {
      var b = z.body, c = h("<" + a + ">").appendTo(b), e = c.css("display");
      c.remove();
      if ("none" === e || "" === e) {
        la || (la = z.createElement("iframe"), la.frameBorder = la.width = la.height = 0), b.appendChild(la), Aa && la.createElement || (Aa = (la.contentWindow || la.contentDocument).document, Aa.write((h.support.boxModel ? "<!doctype html>" : "") + "<html><body>"), Aa.close()), c = Aa.createElement(a), Aa.body.appendChild(c), e = h.css(c, "display"), b.removeChild(la);
      }
      Ua[a] = e;
    }
    return Ua[a];
  }
  function xa(a) {
    return h.isWindow(a) ? a : 9 === a.nodeType ? a.defaultView || a.parentWindow : !1;
  }
  var z = a.document, ma = a.navigator, Ba = a.location, h = function() {
    function b() {
      if (!e.isReady) {
        try {
          z.documentElement.doScroll("left");
        } catch (Mb) {
          setTimeout(b, 1);
          return;
        }
        e.ready();
      }
    }
    var e = function(a, b) {
      return new e.fn.init(a, b, g);
    }, d = a.jQuery, f = a.$, g, m = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/, h = /\S/, l = /^\s+/, p = /\s+$/, q = /^<(\w+)\s*\/?>(?:<\/\1>)?$/, n = /^[\],:{}\s]*$/, k = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, C = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, v = /(?:^|:|,)(?:\s*\[)+/g, D = /(webkit)[ \/]([\w.]+)/, u = /(opera)(?:.*version)?[ \/]([\w.]+)/, I = /(msie) ([\w.]+)/, w = /(mozilla)(?:.*? rv:([\w.]+))?/, Y = /-([a-z]|[0-9])/ig, aa = /^-ms-/, x = function(a, e) {
      return (e + "").toUpperCase();
    }, Ka = ma.userAgent, Na, A, L, ua = Object.prototype.toString, F = Object.prototype.hasOwnProperty, P = Array.prototype.push, ba = Array.prototype.slice, O = String.prototype.trim, Da = Array.prototype.indexOf, da = {};
    return e.fn = e.prototype = {constructor:e, init:function(a, b, d) {
      var f, r, g;
      if (!a) {
        return this;
      }
      if (a.nodeType) {
        return this.context = this[0] = a, this.length = 1, this;
      }
      if ("body" === a && !b && z.body) {
        return this.context = z, this[0] = z.body, this.selector = a, this.length = 1, this;
      }
      if ("string" == typeof a) {
        "<" === a.charAt(0) && ">" === a.charAt(a.length - 1) && 3 <= a.length ? f = [null, a, null] : f = m.exec(a);
        if (f && (f[1] || !b)) {
          if (f[1]) {
            return b = b instanceof e ? b[0] : b, g = b ? b.ownerDocument || b : z, r = q.exec(a), r ? e.isPlainObject(b) ? (a = [z.createElement(r[1])], e.fn.attr.call(a, b, !0)) : a = [g.createElement(r[1])] : (r = e.buildFragment([f[1]], [g]), a = (r.cacheable ? e.clone(r.fragment) : r.fragment).childNodes), e.merge(this, a);
          }
          if ((b = z.getElementById(f[2])) && b.parentNode) {
            if (b.id !== f[2]) {
              return d.find(a);
            }
            this.length = 1;
            this[0] = b;
          }
          return this.context = z, this.selector = a, this;
        }
        return !b || b.jquery ? (b || d).find(a) : this.constructor(b).find(a);
      }
      return e.isFunction(a) ? d.ready(a) : (a.selector !== c && (this.selector = a.selector, this.context = a.context), e.makeArray(a, this));
    }, selector:"", jquery:"1.7.2", length:0, size:function() {
      return this.length;
    }, toArray:function() {
      return ba.call(this, 0);
    }, get:function(a) {
      return null == a ? this.toArray() : 0 > a ? this[this.length + a] : this[a];
    }, pushStack:function(a, b, c) {
      var d = this.constructor();
      return e.isArray(a) ? P.apply(d, a) : e.merge(d, a), d.prevObject = this, d.context = this.context, "find" === b ? d.selector = this.selector + (this.selector ? " " : "") + c : b && (d.selector = this.selector + "." + b + "(" + c + ")"), d;
    }, each:function(a, b) {
      return e.each(this, a, b);
    }, ready:function(a) {
      return e.bindReady(), A.add(a), this;
    }, eq:function(a) {
      return a = +a, -1 === a ? this.slice(a) : this.slice(a, a + 1);
    }, first:function() {
      return this.eq(0);
    }, last:function() {
      return this.eq(-1);
    }, slice:function() {
      return this.pushStack(ba.apply(this, arguments), "slice", ba.call(arguments).join(","));
    }, map:function(a) {
      return this.pushStack(e.map(this, function(b, e) {
        return a.call(b, e, b);
      }));
    }, end:function() {
      return this.prevObject || this.constructor(null);
    }, push:P, sort:[].sort, splice:[].splice}, e.fn.init.prototype = e.fn, e.extend = e.fn.extend = function() {
      var a, b, d, f, r = arguments[0] || {}, g = 1, m = arguments.length, h = !1;
      "boolean" == typeof r && (h = r, r = arguments[1] || {}, g = 2);
      "object" != typeof r && !e.isFunction(r) && (r = {});
      for (m === g && (r = this, --g); g < m; g++) {
        if (null != (a = arguments[g])) {
          for (b in a) {
            var B = r[b];
            var l = a[b];
            r !== l && (h && l && (e.isPlainObject(l) || (d = e.isArray(l))) ? (d ? (d = !1, f = B && e.isArray(B) ? B : []) : f = B && e.isPlainObject(B) ? B : {}, r[b] = e.extend(h, f, l)) : l !== c && (r[b] = l));
          }
        }
      }
      return r;
    }, e.extend({noConflict:function(b) {
      return a.$ === e && (a.$ = f), b && a.jQuery === e && (a.jQuery = d), e;
    }, isReady:!1, readyWait:1, holdReady:function(a) {
      a ? e.readyWait++ : e.ready(!0);
    }, ready:function(a) {
      if (!0 === a && !--e.readyWait || !0 !== a && !e.isReady) {
        if (!z.body) {
          return setTimeout(e.ready, 1);
        }
        e.isReady = !0;
        !0 !== a && 0 < --e.readyWait || (A.fireWith(z, [e]), e.fn.trigger && e(z).trigger("ready").off("ready"));
      }
    }, bindReady:function() {
      if (!A) {
        A = e.Callbacks("once memory");
        if ("complete" === z.readyState) {
          return setTimeout(e.ready, 1);
        }
        if (z.addEventListener) {
          z.addEventListener("DOMContentLoaded", L, !1), a.addEventListener("load", e.ready, !1);
        } else {
          if (z.attachEvent) {
            z.attachEvent("onreadystatechange", L);
            a.attachEvent("onload", e.ready);
            var c = !1;
            try {
              c = null == a.frameElement;
            } catch ($a) {
            }
            z.documentElement.doScroll && c && b();
          }
        }
      }
    }, isFunction:function(a) {
      return "function" === e.type(a);
    }, isArray:Array.isArray || function(a) {
      return "array" === e.type(a);
    }, isWindow:function(a) {
      return null != a && a == a.window;
    }, isNumeric:function(a) {
      return !isNaN(parseFloat(a)) && isFinite(a);
    }, type:function(a) {
      return null == a ? String(a) : da[ua.call(a)] || "object";
    }, isPlainObject:function(a) {
      if (!a || "object" !== e.type(a) || a.nodeType || e.isWindow(a)) {
        return !1;
      }
      try {
        if (a.constructor && !F.call(a, "constructor") && !F.call(a.constructor.prototype, "isPrototypeOf")) {
          return !1;
        }
      } catch (Pb) {
        return !1;
      }
      for (var b in a) {
      }
      return b === c || F.call(a, b);
    }, isEmptyObject:function(a) {
      for (var b in a) {
        return !1;
      }
      return !0;
    }, error:function(a) {
      throw Error(a);
    }, parseJSON:function(b) {
      if ("string" != typeof b || !b) {
        return null;
      }
      b = e.trim(b);
      if (a.JSON && a.JSON.parse) {
        return a.JSON.parse(b);
      }
      if (n.test(b.replace(k, "@").replace(C, "]").replace(v, ""))) {
        return (new Function("return " + b))();
      }
      e.error("Invalid JSON: " + b);
    }, parseXML:function(b) {
      if ("string" != typeof b || !b) {
        return null;
      }
      var d, f;
      try {
        a.DOMParser ? (f = new DOMParser, d = f.parseFromString(b, "text/xml")) : (d = new ActiveXObject("Microsoft.XMLDOM"), d.async = "false", d.loadXML(b));
      } catch (Qb) {
        d = c;
      }
      return (!d || !d.documentElement || d.getElementsByTagName("parsererror").length) && e.error("Invalid XML: " + b), d;
    }, noop:function() {
    }, globalEval:function(b) {
      b && h.test(b) && (a.execScript || function(b) {
        a.eval.call(a, b);
      })(b);
    }, camelCase:function(a) {
      return a.replace(aa, "ms-").replace(Y, x);
    }, nodeName:function(a, b) {
      return a.nodeName && a.nodeName.toUpperCase() === b.toUpperCase();
    }, each:function(a, b, d) {
      var f, r = 0, g = a.length, m = g === c || e.isFunction(a);
      if (d) {
        if (m) {
          for (f in a) {
            if (!1 === b.apply(a[f], d)) {
              break;
            }
          }
        } else {
          for (; r < g && !1 !== b.apply(a[r++], d);) {
          }
        }
      } else {
        if (m) {
          for (f in a) {
            if (!1 === b.call(a[f], f, a[f])) {
              break;
            }
          }
        } else {
          for (; r < g && !1 !== b.call(a[r], r, a[r++]);) {
          }
        }
      }
      return a;
    }, trim:O ? function(a) {
      return null == a ? "" : O.call(a);
    } : function(a) {
      return null == a ? "" : a.toString().replace(l, "").replace(p, "");
    }, makeArray:function(a, b) {
      b = b || [];
      if (null != a) {
        var c = e.type(a);
        null == a.length || "string" === c || "function" === c || "regexp" === c || e.isWindow(a) ? P.call(b, a) : e.merge(b, a);
      }
      return b;
    }, inArray:function(a, b, e) {
      if (b) {
        if (Da) {
          return Da.call(b, a, e);
        }
        var c = b.length;
        for (e = e ? 0 > e ? Math.max(0, c + e) : e : 0; e < c; e++) {
          if (e in b && b[e] === a) {
            return e;
          }
        }
      }
      return -1;
    }, merge:function(a, b) {
      var e = a.length, d = 0;
      if ("number" == typeof b.length) {
        for (var f = b.length; d < f; d++) {
          a[e++] = b[d];
        }
      } else {
        for (; b[d] !== c;) {
          a[e++] = b[d++];
        }
      }
      return a.length = e, a;
    }, grep:function(a, b, e) {
      var c = [];
      e = !!e;
      for (var d = 0, f = a.length; d < f; d++) {
        var r = !!b(a[d], d);
        e !== r && c.push(a[d]);
      }
      return c;
    }, map:function(a, b, d) {
      var f, r = [], g = 0, m = a.length;
      if (a instanceof e || m !== c && "number" == typeof m && (0 < m && a[0] && a[m - 1] || 0 === m || e.isArray(a))) {
        for (; g < m; g++) {
          var h = b(a[g], g, d);
          null != h && (r[r.length] = h);
        }
      } else {
        for (f in a) {
          h = b(a[f], f, d), null != h && (r[r.length] = h);
        }
      }
      return r.concat.apply([], r);
    }, guid:1, proxy:function(a, b) {
      if ("string" == typeof b) {
        var d = a[b];
        b = a;
        a = d;
      }
      if (!e.isFunction(a)) {
        return c;
      }
      var f = ba.call(arguments, 2);
      d = function() {
        return a.apply(b, f.concat(ba.call(arguments)));
      };
      return d.guid = a.guid = a.guid || d.guid || e.guid++, d;
    }, access:function(a, b, d, f, r, g, m) {
      var h = null == d, B = 0, l = a.length;
      if (d && "object" == typeof d) {
        for (B in d) {
          e.access(a, b, B, d[B], 1, g, f);
        }
        r = 1;
      } else {
        if (f !== c) {
          var p = m === c && e.isFunction(f);
          h && (p ? (p = b, b = function(a, b, c) {
            return p.call(e(a), c);
          }) : (b.call(a, f), b = null));
          if (b) {
            for (; B < l; B++) {
              b(a[B], d, p ? f.call(a[B], B, b(a[B], d)) : f, m);
            }
          }
          r = 1;
        }
      }
      return r ? a : h ? b.call(a) : l ? b(a[0], d) : g;
    }, now:function() {
      return (new Date).getTime();
    }, uaMatch:function(a) {
      a = a.toLowerCase();
      a = D.exec(a) || u.exec(a) || I.exec(a) || 0 > a.indexOf("compatible") && w.exec(a) || [];
      return {browser:a[1] || "", version:a[2] || "0"};
    }, sub:function() {
      function a(b, e) {
        return new a.fn.init(b, e);
      }
      e.extend(!0, a, this);
      a.superclass = this;
      a.fn = a.prototype = this();
      a.fn.constructor = a;
      a.sub = this.sub;
      a.fn.init = function(c, d) {
        return d && d instanceof e && !(d instanceof a) && (d = a(d)), e.fn.init.call(this, c, d, b);
      };
      a.fn.init.prototype = a.fn;
      var b = a(z);
      return a;
    }, browser:{}}), e.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(a, b) {
      da["[object " + b + "]"] = b.toLowerCase();
    }), Na = e.uaMatch(Ka), Na.browser && (e.browser[Na.browser] = !0, e.browser.version = Na.version), e.browser.webkit && (e.browser.safari = !0), h.test("\u00a0") && (l = /^[\s\xA0]+/, p = /[\s\xA0]+$/), g = e(z), z.addEventListener ? L = function() {
      z.removeEventListener("DOMContentLoaded", L, !1);
      e.ready();
    } : z.attachEvent && (L = function() {
      "complete" === z.readyState && (z.detachEvent("onreadystatechange", L), e.ready());
    }), e;
  }(), va = {};
  h.Callbacks = function(a) {
    a = a ? va[a] || d(a) : {};
    var b = [], e = [], f, r, g, m, l, p, q = function(e) {
      var c;
      var d = 0;
      for (c = e.length; d < c; d++) {
        var f = e[d];
        var r = h.type(f);
        "array" === r ? q(f) : "function" !== r || a.unique && k.has(f) || b.push(f);
      }
    }, n = function(c, d) {
      d = d || [];
      f = !a.memory || [c, d];
      g = r = !0;
      p = m || 0;
      m = 0;
      for (l = b.length; b && p < l; p++) {
        if (!1 === b[p].apply(c, d) && a.stopOnFalse) {
          f = !0;
          break;
        }
      }
      g = !1;
      b && (a.once ? !0 === f ? k.disable() : b = [] : e && e.length && (f = e.shift(), k.fireWith(f[0], f[1])));
    }, k = {add:function() {
      if (b) {
        var a = b.length;
        q(arguments);
        g ? l = b.length : f && !0 !== f && (m = a, n(f[0], f[1]));
      }
      return this;
    }, remove:function() {
      if (b) {
        for (var e = arguments, c = 0, d = e.length; c < d; c++) {
          for (var f = 0; f < b.length && (e[c] !== b[f] || (g && f <= l && (l--, f <= p && p--), b.splice(f--, 1), !a.unique)); f++) {
          }
        }
      }
      return this;
    }, has:function(a) {
      if (b) {
        for (var e = 0, c = b.length; e < c; e++) {
          if (a === b[e]) {
            return !0;
          }
        }
      }
      return !1;
    }, empty:function() {
      return b = [], this;
    }, disable:function() {
      return b = e = f = c, this;
    }, disabled:function() {
      return !b;
    }, lock:function() {
      return e = c, (!f || !0 === f) && k.disable(), this;
    }, locked:function() {
      return !e;
    }, fireWith:function(b, c) {
      return e && (g ? a.once || e.push([b, c]) : (!a.once || !f) && n(b, c)), this;
    }, fire:function() {
      return k.fireWith(this, arguments), this;
    }, fired:function() {
      return !!r;
    }};
    return k;
  };
  var N = [].slice;
  h.extend({Deferred:function(a) {
    var b = h.Callbacks("once memory"), e = h.Callbacks("once memory"), c = h.Callbacks("memory"), d = "pending", f = {resolve:b, reject:e, notify:c}, r = {done:b.add, fail:e.add, progress:c.add, state:function() {
      return d;
    }, isResolved:b.fired, isRejected:e.fired, then:function(a, b, e) {
      return g.done(a).fail(b).progress(e), this;
    }, always:function() {
      return g.done.apply(g, arguments).fail.apply(g, arguments), this;
    }, pipe:function(a, b, e) {
      return h.Deferred(function(c) {
        h.each({done:[a, "resolve"], fail:[b, "reject"], progress:[e, "notify"]}, function(a, b) {
          var e = b[0], d = b[1], f;
          h.isFunction(e) ? g[a](function() {
            (f = e.apply(this, arguments)) && h.isFunction(f.promise) ? f.promise().then(c.resolve, c.reject, c.notify) : c[d + "With"](this === g ? c : this, [f]);
          }) : g[a](c[d]);
        });
      }).promise();
    }, promise:function(a) {
      if (null == a) {
        a = r;
      } else {
        for (var b in r) {
          a[b] = r[b];
        }
      }
      return a;
    }}, g = r.promise({}), m;
    for (m in f) {
      g[m] = f[m].fire, g[m + "With"] = f[m].fireWith;
    }
    return g.done(function() {
      d = "resolved";
    }, e.disable, c.lock).fail(function() {
      d = "rejected";
    }, b.disable, c.lock), a && a.call(g, g), g;
  }, when:function(a) {
    function b(a) {
      return function(b) {
        c[a] = 1 < arguments.length ? N.call(arguments, 0) : b;
        --g || m.resolveWith(m, c);
      };
    }
    function e(a) {
      return function(b) {
        r[a] = 1 < arguments.length ? N.call(arguments, 0) : b;
        m.notifyWith(l, r);
      };
    }
    var c = N.call(arguments, 0), d = 0, f = c.length, r = Array(f), g = f, m = 1 >= f && a && h.isFunction(a.promise) ? a : h.Deferred(), l = m.promise();
    if (1 < f) {
      for (; d < f; d++) {
        c[d] && c[d].promise && h.isFunction(c[d].promise) ? c[d].promise().then(b(d), m.reject, e(d)) : --g;
      }
      g || m.resolveWith(m, c);
    } else {
      m !== a && m.resolveWith(m, f ? [a] : []);
    }
    return l;
  }});
  h.support = function() {
    var b, e, c, d = z.createElement("div");
    d.setAttribute("className", "t");
    d.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>";
    var f = d.getElementsByTagName("*");
    var g = d.getElementsByTagName("a")[0];
    if (!f || !f.length || !g) {
      return {};
    }
    var m = z.createElement("select");
    var l = m.appendChild(z.createElement("option"));
    f = d.getElementsByTagName("input")[0];
    var p = {leadingWhitespace:3 === d.firstChild.nodeType, tbody:!d.getElementsByTagName("tbody").length, htmlSerialize:!!d.getElementsByTagName("link").length, style:/top/.test(g.getAttribute("style")), hrefNormalized:"/a" === g.getAttribute("href"), opacity:/^0.55/.test(g.style.opacity), cssFloat:!!g.style.cssFloat, checkOn:"on" === f.value, optSelected:l.selected, getSetAttribute:"t" !== d.className, enctype:!!z.createElement("form").enctype, html5Clone:"<:nav></:nav>" !== z.createElement("nav").cloneNode(!0).outerHTML, 
    submitBubbles:!0, changeBubbles:!0, focusinBubbles:!1, deleteExpando:!0, noCloneEvent:!0, inlineBlockNeedsLayout:!1, shrinkWrapBlocks:!1, reliableMarginRight:!0, pixelMargin:!0};
    h.boxModel = p.boxModel = "CSS1Compat" === z.compatMode;
    f.checked = !0;
    p.noCloneChecked = f.cloneNode(!0).checked;
    m.disabled = !0;
    p.optDisabled = !l.disabled;
    try {
      delete d.test;
    } catch (Lb) {
      p.deleteExpando = !1;
    }
    !d.addEventListener && d.attachEvent && d.fireEvent && (d.attachEvent("onclick", function() {
      p.noCloneEvent = !1;
    }), d.cloneNode(!0).fireEvent("onclick"));
    f = z.createElement("input");
    f.value = "t";
    f.setAttribute("type", "radio");
    p.radioValue = "t" === f.value;
    f.setAttribute("checked", "checked");
    f.setAttribute("name", "t");
    d.appendChild(f);
    g = z.createDocumentFragment();
    g.appendChild(d.lastChild);
    p.checkClone = g.cloneNode(!0).cloneNode(!0).lastChild.checked;
    p.appendChecked = f.checked;
    g.removeChild(f);
    g.appendChild(d);
    if (d.attachEvent) {
      for (e in{submit:1, change:1, focusin:1}) {
        f = "on" + e, (c = f in d) || (d.setAttribute(f, "return;"), c = "function" == typeof d[f]), p[e + "Bubbles"] = c;
      }
    }
    return g.removeChild(d), g = m = l = d = f = null, h(function() {
      var e, f = z.getElementsByTagName("body")[0];
      if (f) {
        var r = z.createElement("div");
        r.style.cssText = "padding:0;margin:0;border:0;visibility:hidden;width:0;height:0;position:static;top:0;margin-top:1px";
        f.insertBefore(r, f.firstChild);
        d = z.createElement("div");
        r.appendChild(d);
        d.innerHTML = "<table><tr><td style='padding:0;margin:0;border:0;display:none'></td><td>t</td></tr></table>";
        b = d.getElementsByTagName("td");
        c = 0 === b[0].offsetHeight;
        b[0].style.display = "";
        b[1].style.display = "none";
        p.reliableHiddenOffsets = c && 0 === b[0].offsetHeight;
        a.getComputedStyle && (d.innerHTML = "", e = z.createElement("div"), e.style.width = "0", e.style.marginRight = "0", d.style.width = "2px", d.appendChild(e), p.reliableMarginRight = 0 === (parseInt((a.getComputedStyle(e, null) || {marginRight:0}).marginRight, 10) || 0));
        "undefined" != typeof d.style.zoom && (d.innerHTML = "", d.style.width = d.style.padding = "1px", d.style.border = 0, d.style.overflow = "hidden", d.style.display = "inline", d.style.zoom = 1, p.inlineBlockNeedsLayout = 3 === d.offsetWidth, d.style.display = "block", d.style.overflow = "visible", d.innerHTML = "<div style='width:5px;'></div>", p.shrinkWrapBlocks = 3 !== d.offsetWidth);
        d.style.cssText = "position:absolute;top:0;left:0;width:1px;height:1px;padding:0;margin:0;border:0;visibility:hidden;";
        d.innerHTML = "<div style='position:absolute;top:0;left:0;width:1px;height:1px;padding:0;margin:0;border:5px solid #000;display:block;'><div style='padding:0;margin:0;border:0;display:block;overflow:hidden;'></div></div><table style='position:absolute;top:0;left:0;width:1px;height:1px;padding:0;margin:0;border:5px solid #000;' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>";
        e = d.firstChild;
        var g = e.firstChild;
        var m = e.nextSibling.firstChild.firstChild;
        m = {doesNotAddBorder:5 !== g.offsetTop, doesAddBorderForTableAndCells:5 === m.offsetTop};
        g.style.position = "fixed";
        g.style.top = "20px";
        m.fixedPosition = 20 === g.offsetTop || 15 === g.offsetTop;
        g.style.position = g.style.top = "";
        e.style.overflow = "hidden";
        e.style.position = "relative";
        m.subtractsBorderForOverflowNotVisible = -5 === g.offsetTop;
        m.doesNotIncludeMarginInBodyOffset = 1 !== f.offsetTop;
        a.getComputedStyle && (d.style.marginTop = "1%", p.pixelMargin = "1%" !== (a.getComputedStyle(d, null) || {marginTop:0}).marginTop);
        "undefined" != typeof r.style.zoom && (r.style.zoom = 1);
        f.removeChild(r);
        d = null;
        h.extend(p, m);
      }
    }), p;
  }();
  var T = /^(?:\{.*\}|\[.*\])$/, fa = /([A-Z])/g;
  h.extend({cache:{}, uuid:0, expando:"jQuery" + (h.fn.jquery + Math.random()).replace(/\D/g, ""), noData:{embed:!0, object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000", applet:!0}, hasData:function(a) {
    return a = a.nodeType ? h.cache[a[h.expando]] : a[h.expando], !!a && !e(a);
  }, data:function(a, b, e, d) {
    if (h.acceptData(a)) {
      var f, r, g, m = h.expando, B = "string" == typeof b, l = a.nodeType, p = l ? h.cache : a, q = l ? a[m] : a[m] && m, n = "events" === b;
      if (q && p[q] && (n || d || p[q].data) || !B || e !== c) {
        q || (l ? a[m] = q = ++h.uuid : q = m);
        p[q] || (p[q] = {}, l || (p[q].toJSON = h.noop));
        if ("object" == typeof b || "function" == typeof b) {
          d ? p[q] = h.extend(p[q], b) : p[q].data = h.extend(p[q].data, b);
        }
        return f = r = p[q], d || (r.data || (r.data = {}), r = r.data), e !== c && (r[h.camelCase(b)] = e), n && !r[b] ? f.events : (B ? (g = r[b], null == g && (g = r[h.camelCase(b)])) : g = r, g);
      }
    }
  }, removeData:function(a, b, c) {
    if (h.acceptData(a)) {
      var d, f, r = h.expando, g = a.nodeType, m = g ? h.cache : a, B = g ? a[r] : r;
      if (m[B]) {
        if (b && (d = c ? m[B] : m[B].data)) {
          h.isArray(b) || (b in d ? b = [b] : (b = h.camelCase(b), b in d ? b = [b] : b = b.split(" ")));
          var l = 0;
          for (f = b.length; l < f; l++) {
            delete d[b[l]];
          }
          if (!(c ? e : h.isEmptyObject)(d)) {
            return;
          }
        }
        if (!c && (delete m[B].data, !e(m[B]))) {
          return;
        }
        h.support.deleteExpando || !m.setInterval ? delete m[B] : m[B] = null;
        g && (h.support.deleteExpando ? delete a[r] : a.removeAttribute ? a.removeAttribute(r) : a[r] = null);
      }
    }
  }, _data:function(a, b, e) {
    return h.data(a, b, e, !0);
  }, acceptData:function(a) {
    if (a.nodeName) {
      var b = h.noData[a.nodeName.toLowerCase()];
      if (b) {
        return !0 !== b && a.getAttribute("classid") === b;
      }
    }
    return !0;
  }});
  h.fn.extend({data:function(a, e) {
    var d, f, g, r = this[0], m = 0, B = null;
    if (a === c) {
      if (this.length && (B = h.data(r), 1 === r.nodeType && !h._data(r, "parsedAttrs"))) {
        var l = r.attributes;
        for (g = l.length; m < g; m++) {
          var p = l[m].name;
          0 === p.indexOf("data-") && (p = h.camelCase(p.substring(5)), b(r, p, B[p]));
        }
        h._data(r, "parsedAttrs", !0);
      }
      return B;
    }
    return "object" == typeof a ? this.each(function() {
      h.data(this, a);
    }) : (d = a.split(".", 2), d[1] = d[1] ? "." + d[1] : "", f = d[1] + "!", h.access(this, function(e) {
      if (e === c) {
        return B = this.triggerHandler("getData" + f, [d[0]]), B === c && r && (B = h.data(r, a), B = b(r, a, B)), B === c && d[1] ? this.data(d[0]) : B;
      }
      d[1] = e;
      this.each(function() {
        var b = h(this);
        b.triggerHandler("setData" + f, d);
        h.data(this, a, e);
        b.triggerHandler("changeData" + f, d);
      });
    }, null, e, 1 < arguments.length, null, !1));
  }, removeData:function(a) {
    return this.each(function() {
      h.removeData(this, a);
    });
  }});
  h.extend({_mark:function(a, b) {
    a && (b = (b || "fx") + "mark", h._data(a, b, (h._data(a, b) || 0) + 1));
  }, _unmark:function(a, b, e) {
    !0 !== a && (e = b, b = a, a = !1);
    if (b) {
      e = e || "fx";
      var c = e + "mark";
      (a = a ? 0 : (h._data(b, c) || 1) - 1) ? h._data(b, c, a) : (h.removeData(b, c, !0), f(b, e, "mark"));
    }
  }, queue:function(a, b, e) {
    var c;
    if (a) {
      return b = (b || "fx") + "queue", c = h._data(a, b), e && (!c || h.isArray(e) ? c = h._data(a, b, h.makeArray(e)) : c.push(e)), c || [];
    }
  }, dequeue:function(a, b) {
    b = b || "fx";
    var e = h.queue(a, b), c = e.shift(), d = {};
    "inprogress" === c && (c = e.shift());
    c && ("fx" === b && e.unshift("inprogress"), h._data(a, b + ".run", d), c.call(a, function() {
      h.dequeue(a, b);
    }, d));
    e.length || (h.removeData(a, b + "queue " + b + ".run", !0), f(a, b, "queue"));
  }});
  h.fn.extend({queue:function(a, b) {
    var e = 2;
    return "string" != typeof a && (b = a, a = "fx", e--), arguments.length < e ? h.queue(this[0], a) : b === c ? this : this.each(function() {
      var e = h.queue(this, a, b);
      "fx" === a && "inprogress" !== e[0] && h.dequeue(this, a);
    });
  }, dequeue:function(a) {
    return this.each(function() {
      h.dequeue(this, a);
    });
  }, delay:function(a, b) {
    return a = h.fx ? h.fx.speeds[a] || a : a, b = b || "fx", this.queue(b, function(b, e) {
      var c = setTimeout(b, a);
      e.stop = function() {
        clearTimeout(c);
      };
    });
  }, clearQueue:function(a) {
    return this.queue(a || "fx", []);
  }, promise:function(a, b) {
    function e() {
      --r || d.resolveWith(f, [f]);
    }
    "string" != typeof a && (b = a, a = c);
    a = a || "fx";
    var d = h.Deferred(), f = this, g = f.length, r = 1, m = a + "defer", B = a + "queue";
    a += "mark";
    for (var l; g--;) {
      if (l = h.data(f[g], m, c, !0) || (h.data(f[g], B, c, !0) || h.data(f[g], a, c, !0)) && h.data(f[g], m, h.Callbacks("once memory"), !0)) {
        r++, l.add(e);
      }
    }
    return e(), d.promise(b);
  }});
  var K = /[\n\t\r]/g, ha = /\s+/, Ca = /\r/g, oa = /^(?:button|input)$/i, ja = /^(?:button|input|object|select|textarea)$/i, sa = /^a(?:rea)?$/i, Oa = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i, La = h.support.getSetAttribute, H, y;
  h.fn.extend({attr:function(a, b) {
    return h.access(this, h.attr, a, b, 1 < arguments.length);
  }, removeAttr:function(a) {
    return this.each(function() {
      h.removeAttr(this, a);
    });
  }, prop:function(a, b) {
    return h.access(this, h.prop, a, b, 1 < arguments.length);
  }, removeProp:function(a) {
    return a = h.propFix[a] || a, this.each(function() {
      try {
        this[a] = c, delete this[a];
      } catch (B) {
      }
    });
  }, addClass:function(a) {
    var b, e;
    if (h.isFunction(a)) {
      return this.each(function(b) {
        h(this).addClass(a.call(this, b, this.className));
      });
    }
    if (a && "string" == typeof a) {
      var c = a.split(ha);
      var d = 0;
      for (b = this.length; d < b; d++) {
        var f = this[d];
        if (1 === f.nodeType) {
          if (f.className || 1 !== c.length) {
            var g = " " + f.className + " ";
            var r = 0;
            for (e = c.length; r < e; r++) {
              ~g.indexOf(" " + c[r] + " ") || (g += c[r] + " ");
            }
            f.className = h.trim(g);
          } else {
            f.className = a;
          }
        }
      }
    }
    return this;
  }, removeClass:function(a) {
    var b, e;
    if (h.isFunction(a)) {
      return this.each(function(b) {
        h(this).removeClass(a.call(this, b, this.className));
      });
    }
    if (a && "string" == typeof a || a === c) {
      var d = (a || "").split(ha);
      var f = 0;
      for (b = this.length; f < b; f++) {
        var g = this[f];
        if (1 === g.nodeType && g.className) {
          if (a) {
            var r = (" " + g.className + " ").replace(K, " ");
            var m = 0;
            for (e = d.length; m < e; m++) {
              r = r.replace(" " + d[m] + " ", " ");
            }
            g.className = h.trim(r);
          } else {
            g.className = "";
          }
        }
      }
    }
    return this;
  }, toggleClass:function(a, b) {
    var e = typeof a, c = "boolean" == typeof b;
    return h.isFunction(a) ? this.each(function(e) {
      h(this).toggleClass(a.call(this, e, this.className, b), b);
    }) : this.each(function() {
      if ("string" === e) {
        for (var d, f = 0, g = h(this), r = b, m = a.split(ha); d = m[f++];) {
          r = c ? r : !g.hasClass(d), g[r ? "addClass" : "removeClass"](d);
        }
      } else {
        if ("undefined" === e || "boolean" === e) {
          this.className && h._data(this, "__className__", this.className), this.className = this.className || !1 === a ? "" : h._data(this, "__className__") || "";
        }
      }
    });
  }, hasClass:function(a) {
    a = " " + a + " ";
    for (var b = 0, e = this.length; b < e; b++) {
      if (1 === this[b].nodeType && -1 < (" " + this[b].className + " ").replace(K, " ").indexOf(a)) {
        return !0;
      }
    }
    return !1;
  }, val:function(a) {
    var b, e, d, f = this[0];
    if (arguments.length) {
      return d = h.isFunction(a), this.each(function(e) {
        var f = h(this), g;
        1 === this.nodeType && (d ? g = a.call(this, e, f.val()) : g = a, null == g ? g = "" : "number" == typeof g ? g += "" : h.isArray(g) && (g = h.map(g, function(a) {
          return null == a ? "" : a + "";
        })), b = h.valHooks[this.type] || h.valHooks[this.nodeName.toLowerCase()], b && "set" in b && b.set(this, g, "value") !== c || (this.value = g));
      });
    }
    if (f) {
      return b = h.valHooks[f.type] || h.valHooks[f.nodeName.toLowerCase()], b && "get" in b && (e = b.get(f, "value")) !== c ? e : (e = f.value, "string" == typeof e ? e.replace(Ca, "") : null == e ? "" : e);
    }
  }});
  h.extend({valHooks:{option:{get:function(a) {
    var b = a.attributes.value;
    return !b || b.specified ? a.value : a.text;
  }}, select:{get:function(a) {
    var b, e = a.selectedIndex, c = [], d = a.options, f = "select-one" === a.type;
    if (0 > e) {
      return null;
    }
    a = f ? e : 0;
    for (b = f ? e + 1 : d.length; a < b; a++) {
      var g = d[a];
      if (!(!g.selected || (h.support.optDisabled ? g.disabled : null !== g.getAttribute("disabled")) || g.parentNode.disabled && h.nodeName(g.parentNode, "optgroup"))) {
        g = h(g).val();
        if (f) {
          return g;
        }
        c.push(g);
      }
    }
    return f && !c.length && d.length ? h(d[e]).val() : c;
  }, set:function(a, b) {
    var e = h.makeArray(b);
    return h(a).find("option").each(function() {
      this.selected = 0 <= h.inArray(h(this).val(), e);
    }), e.length || (a.selectedIndex = -1), e;
  }}}, attrFn:{val:!0, css:!0, html:!0, text:!0, data:!0, width:!0, height:!0, offset:!0}, attr:function(a, b, e, d) {
    var f, g, r = a.nodeType;
    if (a && 3 !== r && 8 !== r && 2 !== r) {
      if (d && b in h.attrFn) {
        return h(a)[b](e);
      }
      if ("undefined" == typeof a.getAttribute) {
        return h.prop(a, b, e);
      }
      (d = 1 !== r || !h.isXMLDoc(a)) && (b = b.toLowerCase(), g = h.attrHooks[b] || (Oa.test(b) ? pa : H));
      if (e !== c) {
        if (null === e) {
          h.removeAttr(a, b);
          return;
        }
        return g && "set" in g && d && (f = g.set(a, e, b)) !== c ? f : (a.setAttribute(b, "" + e), e);
      }
      return g && "get" in g && d && null !== (f = g.get(a, b)) ? f : (f = a.getAttribute(b), null === f ? c : f);
    }
  }, removeAttr:function(a, b) {
    var e, c, d, f, g = 0;
    if (b && 1 === a.nodeType) {
      for (b = b.toLowerCase().split(ha), d = b.length; g < d; g++) {
        (c = b[g]) && (e = h.propFix[c] || c, f = Oa.test(c), f || h.attr(a, c, ""), a.removeAttribute(La ? c : e), f && e in a && (a[e] = !1));
      }
    }
  }, attrHooks:{type:{set:function(a, b) {
    if (oa.test(a.nodeName) && a.parentNode) {
      h.error("type property can't be changed");
    } else {
      if (!h.support.radioValue && "radio" === b && h.nodeName(a, "input")) {
        var e = a.value;
        return a.setAttribute("type", b), e && (a.value = e), b;
      }
    }
  }}, value:{get:function(a, b) {
    return H && h.nodeName(a, "button") ? H.get(a, b) : b in a ? a.value : null;
  }, set:function(a, b, e) {
    if (H && h.nodeName(a, "button")) {
      return H.set(a, b, e);
    }
    a.value = b;
  }}}, propFix:{tabindex:"tabIndex", readonly:"readOnly", "for":"htmlFor", "class":"className", maxlength:"maxLength", cellspacing:"cellSpacing", cellpadding:"cellPadding", rowspan:"rowSpan", colspan:"colSpan", usemap:"useMap", frameborder:"frameBorder", contenteditable:"contentEditable"}, prop:function(a, b, e) {
    var d, f, g, r = a.nodeType;
    if (a && 3 !== r && 8 !== r && 2 !== r) {
      return g = 1 !== r || !h.isXMLDoc(a), g && (b = h.propFix[b] || b, f = h.propHooks[b]), e !== c ? f && "set" in f && (d = f.set(a, e, b)) !== c ? d : a[b] = e : f && "get" in f && null !== (d = f.get(a, b)) ? d : a[b];
    }
  }, propHooks:{tabIndex:{get:function(a) {
    var b = a.getAttributeNode("tabindex");
    return b && b.specified ? parseInt(b.value, 10) : ja.test(a.nodeName) || sa.test(a.nodeName) && a.href ? 0 : c;
  }}}});
  h.attrHooks.tabindex = h.propHooks.tabIndex;
  var pa = {get:function(a, b) {
    var e, d = h.prop(a, b);
    return !0 === d || "boolean" != typeof d && (e = a.getAttributeNode(b)) && !1 !== e.nodeValue ? b.toLowerCase() : c;
  }, set:function(a, b, e) {
    var c;
    return !1 === b ? h.removeAttr(a, e) : (c = h.propFix[e] || e, c in a && (a[c] = !0), a.setAttribute(e, e.toLowerCase())), e;
  }};
  La || (y = {name:!0, id:!0, coords:!0}, H = h.valHooks.button = {get:function(a, b) {
    var e;
    return e = a.getAttributeNode(b), e && (y[b] ? "" !== e.nodeValue : e.specified) ? e.nodeValue : c;
  }, set:function(a, b, e) {
    var c = a.getAttributeNode(e);
    return c || (c = z.createAttribute(e), a.setAttributeNode(c)), c.nodeValue = b + "";
  }}, h.attrHooks.tabindex.set = H.set, h.each(["width", "height"], function(a, b) {
    h.attrHooks[b] = h.extend(h.attrHooks[b], {set:function(a, e) {
      if ("" === e) {
        return a.setAttribute(b, "auto"), e;
      }
    }});
  }), h.attrHooks.contenteditable = {get:H.get, set:function(a, b, e) {
    "" === b && (b = "false");
    H.set(a, b, e);
  }});
  h.support.hrefNormalized || h.each(["href", "src", "width", "height"], function(a, b) {
    h.attrHooks[b] = h.extend(h.attrHooks[b], {get:function(a) {
      a = a.getAttribute(b, 2);
      return null === a ? c : a;
    }});
  });
  h.support.style || (h.attrHooks.style = {get:function(a) {
    return a.style.cssText.toLowerCase() || c;
  }, set:function(a, b) {
    return a.style.cssText = "" + b;
  }});
  h.support.optSelected || (h.propHooks.selected = h.extend(h.propHooks.selected, {get:function(a) {
    a = a.parentNode;
    return a && (a.selectedIndex, a.parentNode && a.parentNode.selectedIndex), null;
  }}));
  h.support.enctype || (h.propFix.enctype = "encoding");
  h.support.checkOn || h.each(["radio", "checkbox"], function() {
    h.valHooks[this] = {get:function(a) {
      return null === a.getAttribute("value") ? "on" : a.value;
    }};
  });
  h.each(["radio", "checkbox"], function() {
    h.valHooks[this] = h.extend(h.valHooks[this], {set:function(a, b) {
      if (h.isArray(b)) {
        return a.checked = 0 <= h.inArray(h(a).val(), b);
      }
    }});
  });
  var na = /^(?:textarea|input|select)$/i, X = /^([^\.]*)?(?:\.(.+))?$/, E = /(?:^|\s)hover(\.\S+)?\b/, R = /^key/, S = /^(?:mouse|contextmenu)|click/, U = /^(?:focusinfocus|focusoutblur)$/, G = /^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/, V = function(a) {
    a = G.exec(a);
    return a && (a[1] = (a[1] || "").toLowerCase(), a[3] = a[3] && new RegExp("(?:^|\\s)" + a[3] + "(?:\\s|$)")), a;
  }, W = function(a) {
    return h.event.special.hover ? a : a.replace(E, "mouseenter$1 mouseleave$1");
  };
  h.event = {add:function(a, b, e, d, f) {
    var g, m, r, l;
    if (3 !== a.nodeType && 8 !== a.nodeType && b && e && (g = h._data(a))) {
      e.handler && (l = e, e = l.handler, f = l.selector);
      e.guid || (e.guid = h.guid++);
      (r = g.events) || (g.events = r = {});
      (m = g.handle) || (g.handle = m = function(a) {
        return "undefined" == typeof h || a && h.event.triggered === a.type ? c : h.event.dispatch.apply(m.elem, arguments);
      }, m.elem = a);
      b = h.trim(W(b)).split(" ");
      for (g = 0; g < b.length; g++) {
        var p = X.exec(b[g]) || [];
        var q = p[1];
        var n = (p[2] || "").split(".").sort();
        var B = h.event.special[q] || {};
        q = (f ? B.delegateType : B.bindType) || q;
        B = h.event.special[q] || {};
        p = h.extend({type:q, origType:p[1], data:d, handler:e, guid:e.guid, selector:f, quick:f && V(f), namespace:n.join(".")}, l);
        var k = r[q];
        k || (k = r[q] = [], k.delegateCount = 0, B.setup && !1 !== B.setup.call(a, d, n, m) || (a.addEventListener ? a.addEventListener(q, m, !1) : a.attachEvent && a.attachEvent("on" + q, m)));
        B.add && (B.add.call(a, p), p.handler.guid || (p.handler.guid = e.guid));
        f ? k.splice(k.delegateCount++, 0, p) : k.push(p);
        h.event.global[q] = !0;
      }
      a = null;
    }
  }, global:{}, remove:function(a, b, e, c, d) {
    var f = h.hasData(a) && h._data(a), g, m, r, l, p;
    if (f && (l = f.events)) {
      b = h.trim(W(b || "")).split(" ");
      for (g = 0; g < b.length; g++) {
        var q = X.exec(b[g]) || [];
        var n = m = q[1];
        q = q[2];
        if (n) {
          var B = h.event.special[n] || {};
          n = (c ? B.delegateType : B.bindType) || n;
          var k = l[n] || [];
          var C = k.length;
          q = q ? new RegExp("(^|\\.)" + q.split(".").sort().join("\\.(?:.*\\.)?") + "(\\.|$)") : null;
          for (r = 0; r < k.length; r++) {
            var v = k[r];
            !d && m !== v.origType || e && e.guid !== v.guid || q && !q.test(v.namespace) || c && c !== v.selector && ("**" !== c || !v.selector) || (k.splice(r--, 1), v.selector && k.delegateCount--, !B.remove || B.remove.call(a, v));
          }
          0 === k.length && C !== k.length && ((!B.teardown || !1 === B.teardown.call(a, q)) && h.removeEvent(a, n, f.handle), delete l[n]);
        } else {
          for (n in l) {
            h.event.remove(a, n + b[g], e, c, !0);
          }
        }
      }
      h.isEmptyObject(l) && (p = f.handle, p && (p.elem = null), h.removeData(a, ["events", "handle"], !0));
    }
  }, customEvent:{getData:!0, setData:!0, changeData:!0}, trigger:function(b, e, d, f) {
    if (!d || 3 !== d.nodeType && 8 !== d.nodeType) {
      var g = b.type || b, m = [], r, l, p;
      if (!U.test(g + h.event.triggered) && (0 <= g.indexOf("!") && (g = g.slice(0, -1), r = !0), 0 <= g.indexOf(".") && (m = g.split("."), g = m.shift(), m.sort()), d && !h.event.customEvent[g] || h.event.global[g])) {
        if (b = "object" == typeof b ? b[h.expando] ? b : new h.Event(g, b) : new h.Event(g), b.type = g, b.isTrigger = !0, b.exclusive = r, b.namespace = m.join("."), b.namespace_re = b.namespace ? new RegExp("(^|\\.)" + m.join("\\.(?:.*\\.)?") + "(\\.|$)") : null, r = 0 > g.indexOf(":") ? "on" + g : "", d) {
          b.result = c;
          b.target || (b.target = d);
          e = null != e ? h.makeArray(e) : [];
          e.unshift(b);
          var q = h.event.special[g] || {};
          if (!q.trigger || !1 !== q.trigger.apply(d, e)) {
            var n = [[d, q.bindType || g]];
            if (!f && !q.noBubble && !h.isWindow(d)) {
              var B = q.delegateType || g;
              m = U.test(B + g) ? d : d.parentNode;
              for (l = null; m; m = m.parentNode) {
                n.push([m, B]), l = m;
              }
              l && l === d.ownerDocument && n.push([l.defaultView || l.parentWindow || a, B]);
            }
            for (B = 0; B < n.length && !b.isPropagationStopped(); B++) {
              m = n[B][0], b.type = n[B][1], (p = (h._data(m, "events") || {})[b.type] && h._data(m, "handle")) && p.apply(m, e), (p = r && m[r]) && h.acceptData(m) && !1 === p.apply(m, e) && b.preventDefault();
            }
            return b.type = g, !f && !b.isDefaultPrevented() && (!q._default || !1 === q._default.apply(d.ownerDocument, e)) && ("click" !== g || !h.nodeName(d, "a")) && h.acceptData(d) && r && d[g] && ("focus" !== g && "blur" !== g || 0 !== b.target.offsetWidth) && !h.isWindow(d) && (l = d[r], l && (d[r] = null), h.event.triggered = g, d[g](), h.event.triggered = c, l && (d[r] = l)), b.result;
          }
        } else {
          for (B in d = h.cache, d) {
            d[B].events && d[B].events[g] && h.event.trigger(b, e, d[B].handle.elem, !0);
          }
        }
      }
    }
  }, dispatch:function(b) {
    b = h.event.fix(b || a.event);
    var e = (h._data(this, "events") || {})[b.type] || [], d = e.delegateCount, f = [].slice.call(arguments, 0), g = !b.exclusive && !b.namespace, m = h.event.special[b.type] || {}, r = [], l, p;
    f[0] = b;
    b.delegateTarget = this;
    if (!m.preDispatch || !1 !== m.preDispatch.call(this, b)) {
      if (d && (!b.button || "click" !== b.type)) {
        var q = h(this);
        q.context = this.ownerDocument || this;
        for (p = b.target; p != this; p = p.parentNode || this) {
          if (!0 !== p.disabled) {
            var n = {};
            var k = [];
            q[0] = p;
            for (l = 0; l < d; l++) {
              var C = e[l];
              var v = C.selector;
              if (n[v] === c) {
                var D = n, u = v;
                if (C.quick) {
                  var I = C.quick;
                  var w = p.attributes || {};
                  I = (!I[1] || p.nodeName.toLowerCase() === I[1]) && (!I[2] || (w.id || {}).value === I[2]) && (!I[3] || I[3].test((w["class"] || {}).value));
                } else {
                  I = q.is(v);
                }
                D[u] = I;
              }
              n[v] && k.push(C);
            }
            k.length && r.push({elem:p, matches:k});
          }
        }
      }
      e.length > d && r.push({elem:this, matches:e.slice(d)});
      for (l = 0; l < r.length && !b.isPropagationStopped(); l++) {
        for (d = r[l], b.currentTarget = d.elem, e = 0; e < d.matches.length && !b.isImmediatePropagationStopped(); e++) {
          if (C = d.matches[e], g || !b.namespace && !C.namespace || b.namespace_re && b.namespace_re.test(C.namespace)) {
            b.data = C.data, b.handleObj = C, C = ((h.event.special[C.origType] || {}).handle || C.handler).apply(d.elem, f), C !== c && (b.result = C, !1 === C && (b.preventDefault(), b.stopPropagation()));
          }
        }
      }
      return m.postDispatch && m.postDispatch.call(this, b), b.result;
    }
  }, props:"attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "), fixHooks:{}, keyHooks:{props:["char", "charCode", "key", "keyCode"], filter:function(a, b) {
    return null == a.which && (a.which = null != b.charCode ? b.charCode : b.keyCode), a;
  }}, mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "), filter:function(a, b) {
    var e, d, f, g = b.button, m = b.fromElement;
    return null == a.pageX && null != b.clientX && (e = a.target.ownerDocument || z, d = e.documentElement, f = e.body, a.pageX = b.clientX + (d && d.scrollLeft || f && f.scrollLeft || 0) - (d && d.clientLeft || f && f.clientLeft || 0), a.pageY = b.clientY + (d && d.scrollTop || f && f.scrollTop || 0) - (d && d.clientTop || f && f.clientTop || 0)), !a.relatedTarget && m && (a.relatedTarget = m === a.target ? b.toElement : m), !a.which && g !== c && (a.which = g & 1 ? 1 : g & 2 ? 3 : g & 4 ? 2 : 0), 
    a;
  }}, fix:function(a) {
    if (a[h.expando]) {
      return a;
    }
    var b, e = a, d = h.event.fixHooks[a.type] || {}, f = d.props ? this.props.concat(d.props) : this.props;
    a = h.Event(e);
    for (b = f.length; b;) {
      var g = f[--b];
      a[g] = e[g];
    }
    return a.target || (a.target = e.srcElement || z), 3 === a.target.nodeType && (a.target = a.target.parentNode), a.metaKey === c && (a.metaKey = a.ctrlKey), d.filter ? d.filter(a, e) : a;
  }, special:{ready:{setup:h.bindReady}, load:{noBubble:!0}, focus:{delegateType:"focusin"}, blur:{delegateType:"focusout"}, beforeunload:{setup:function(a, b, e) {
    h.isWindow(this) && (this.onbeforeunload = e);
  }, teardown:function(a, b) {
    this.onbeforeunload === b && (this.onbeforeunload = null);
  }}}, simulate:function(a, b, e, c) {
    a = h.extend(new h.Event, e, {type:a, isSimulated:!0, originalEvent:{}});
    c ? h.event.trigger(a, null, b) : h.event.dispatch.call(b, a);
    a.isDefaultPrevented() && e.preventDefault();
  }};
  h.event.handle = h.event.dispatch;
  h.removeEvent = z.removeEventListener ? function(a, b, e) {
    a.removeEventListener && a.removeEventListener(b, e, !1);
  } : function(a, b, e) {
    a.detachEvent && a.detachEvent("on" + b, e);
  };
  h.Event = function(a, b) {
    if (!(this instanceof h.Event)) {
      return new h.Event(a, b);
    }
    a && a.type ? (this.originalEvent = a, this.type = a.type, this.isDefaultPrevented = a.defaultPrevented || !1 === a.returnValue || a.getPreventDefault && a.getPreventDefault() ? l : g) : this.type = a;
    b && h.extend(this, b);
    this.timeStamp = a && a.timeStamp || h.now();
    this[h.expando] = !0;
  };
  h.Event.prototype = {preventDefault:function() {
    this.isDefaultPrevented = l;
    var a = this.originalEvent;
    a && (a.preventDefault ? a.preventDefault() : a.returnValue = !1);
  }, stopPropagation:function() {
    this.isPropagationStopped = l;
    var a = this.originalEvent;
    a && (a.stopPropagation && a.stopPropagation(), a.cancelBubble = !0);
  }, stopImmediatePropagation:function() {
    this.isImmediatePropagationStopped = l;
    this.stopPropagation();
  }, isDefaultPrevented:g, isPropagationStopped:g, isImmediatePropagationStopped:g};
  h.each({mouseenter:"mouseover", mouseleave:"mouseout"}, function(a, b) {
    h.event.special[a] = {delegateType:b, bindType:b, handle:function(a) {
      var e = a.relatedTarget, c = a.handleObj;
      if (!e || e !== this && !h.contains(this, e)) {
        a.type = c.origType;
        var d = c.handler.apply(this, arguments);
        a.type = b;
      }
      return d;
    }};
  });
  h.support.submitBubbles || (h.event.special.submit = {setup:function() {
    if (h.nodeName(this, "form")) {
      return !1;
    }
    h.event.add(this, "click._submit keypress._submit", function(a) {
      a = a.target;
      (a = h.nodeName(a, "input") || h.nodeName(a, "button") ? a.form : c) && !a._submit_attached && (h.event.add(a, "submit._submit", function(a) {
        a._submit_bubble = !0;
      }), a._submit_attached = !0);
    });
  }, postDispatch:function(a) {
    a._submit_bubble && (delete a._submit_bubble, this.parentNode && !a.isTrigger && h.event.simulate("submit", this.parentNode, a, !0));
  }, teardown:function() {
    if (h.nodeName(this, "form")) {
      return !1;
    }
    h.event.remove(this, "._submit");
  }});
  h.support.changeBubbles || (h.event.special.change = {setup:function() {
    if (na.test(this.nodeName)) {
      if ("checkbox" === this.type || "radio" === this.type) {
        h.event.add(this, "propertychange._change", function(a) {
          "checked" === a.originalEvent.propertyName && (this._just_changed = !0);
        }), h.event.add(this, "click._change", function(a) {
          this._just_changed && !a.isTrigger && (this._just_changed = !1, h.event.simulate("change", this, a, !0));
        });
      }
      return !1;
    }
    h.event.add(this, "beforeactivate._change", function(a) {
      a = a.target;
      na.test(a.nodeName) && !a._change_attached && (h.event.add(a, "change._change", function(a) {
        this.parentNode && !a.isSimulated && !a.isTrigger && h.event.simulate("change", this.parentNode, a, !0);
      }), a._change_attached = !0);
    });
  }, handle:function(a) {
    var b = a.target;
    if (this !== b || a.isSimulated || a.isTrigger || "radio" !== b.type && "checkbox" !== b.type) {
      return a.handleObj.handler.apply(this, arguments);
    }
  }, teardown:function() {
    return h.event.remove(this, "._change"), na.test(this.nodeName);
  }});
  h.support.focusinBubbles || h.each({focus:"focusin", blur:"focusout"}, function(a, b) {
    var e = 0, c = function(a) {
      h.event.simulate(b, a.target, h.event.fix(a), !0);
    };
    h.event.special[b] = {setup:function() {
      0 === e++ && z.addEventListener(a, c, !0);
    }, teardown:function() {
      0 === --e && z.removeEventListener(a, c, !0);
    }};
  });
  h.fn.extend({on:function(a, b, e, d, f) {
    var m, r;
    if ("object" == typeof a) {
      "string" != typeof b && (e = e || b, b = c);
      for (r in a) {
        this.on(r, b, e, a[r], f);
      }
      return this;
    }
    null == e && null == d ? (d = b, e = b = c) : null == d && ("string" == typeof b ? (d = e, e = c) : (d = e, e = b, b = c));
    if (!1 === d) {
      d = g;
    } else {
      if (!d) {
        return this;
      }
    }
    return 1 === f && (m = d, d = function(a) {
      return h().off(a), m.apply(this, arguments);
    }, d.guid = m.guid || (m.guid = h.guid++)), this.each(function() {
      h.event.add(this, a, d, e, b);
    });
  }, one:function(a, b, e, c) {
    return this.on(a, b, e, c, 1);
  }, off:function(a, b, e) {
    if (a && a.preventDefault && a.handleObj) {
      var d = a.handleObj;
      return h(a.delegateTarget).off(d.namespace ? d.origType + "." + d.namespace : d.origType, d.selector, d.handler), this;
    }
    if ("object" == typeof a) {
      for (d in a) {
        this.off(d, b, a[d]);
      }
      return this;
    }
    if (!1 === b || "function" == typeof b) {
      e = b, b = c;
    }
    return !1 === e && (e = g), this.each(function() {
      h.event.remove(this, a, e, b);
    });
  }, bind:function(a, b, e) {
    return this.on(a, null, b, e);
  }, unbind:function(a, b) {
    return this.off(a, null, b);
  }, live:function(a, b, e) {
    return h(this.context).on(a, this.selector, b, e), this;
  }, die:function(a, b) {
    return h(this.context).off(a, this.selector || "**", b), this;
  }, delegate:function(a, b, e, c) {
    return this.on(b, a, e, c);
  }, undelegate:function(a, b, e) {
    return 1 == arguments.length ? this.off(a, "**") : this.off(b, a, e);
  }, trigger:function(a, b) {
    return this.each(function() {
      h.event.trigger(a, b, this);
    });
  }, triggerHandler:function(a, b) {
    if (this[0]) {
      return h.event.trigger(a, b, this[0], !0);
    }
  }, toggle:function(a) {
    var b = arguments, e = a.guid || h.guid++, c = 0, d = function(e) {
      var d = (h._data(this, "lastToggle" + a.guid) || 0) % c;
      return h._data(this, "lastToggle" + a.guid, d + 1), e.preventDefault(), b[d].apply(this, arguments) || !1;
    };
    for (d.guid = e; c < b.length;) {
      b[c++].guid = e;
    }
    return this.click(d);
  }, hover:function(a, b) {
    return this.mouseenter(a).mouseleave(b || a);
  }});
  h.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(a, b) {
    h.fn[b] = function(a, e) {
      return null == e && (e = a, a = null), 0 < arguments.length ? this.on(b, null, a, e) : this.trigger(b);
    };
    h.attrFn && (h.attrFn[b] = !0);
    R.test(b) && (h.event.fixHooks[b] = h.event.keyHooks);
    S.test(b) && (h.event.fixHooks[b] = h.event.mouseHooks);
  });
  (function() {
    function a(a, b, e, c, f, g) {
      f = 0;
      for (var m = c.length; f < m; f++) {
        var h = c[f];
        if (h) {
          var r = !1;
          for (h = h[a]; h;) {
            if (h[d] === e) {
              r = c[h.sizset];
              break;
            }
            1 === h.nodeType && !g && (h[d] = e, h.sizset = f);
            if (h.nodeName.toLowerCase() === b) {
              r = h;
              break;
            }
            h = h[a];
          }
          c[f] = r;
        }
      }
    }
    function b(a, b, e, c, f, g) {
      f = 0;
      for (var m = c.length; f < m; f++) {
        var h = c[f];
        if (h) {
          var r = !1;
          for (h = h[a]; h;) {
            if (h[d] === e) {
              r = c[h.sizset];
              break;
            }
            if (1 === h.nodeType) {
              if (g || (h[d] = e, h.sizset = f), "string" != typeof b) {
                if (h === b) {
                  r = !0;
                  break;
                }
              } else {
                if (0 < k.filter(b, [h]).length) {
                  r = h;
                  break;
                }
              }
            }
            h = h[a];
          }
          c[f] = r;
        }
      }
    }
    var e = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g, d = "sizcache" + (Math.random() + "").replace(".", ""), f = 0, g = Object.prototype.toString, m = !1, l = !0, p = /\\/g, q = /\r\n/g, n = /\W/;
    [0, 0].sort(function() {
      return l = !1, 0;
    });
    var k = function(a, b, c, d) {
      c = c || [];
      var f = b = b || z;
      if (1 !== b.nodeType && 9 !== b.nodeType) {
        return [];
      }
      if (!a || "string" != typeof a) {
        return c;
      }
      var m, h, r, l, p = !0, q = k.isXML(b), n = [], C = a;
      do {
        if (e.exec(""), m = e.exec(C)) {
          if (C = m[3], n.push(m[1]), m[2]) {
            var B = m[3];
            break;
          }
        }
      } while (m);
      if (1 < n.length && D.exec(a)) {
        if (2 === n.length && v.relative[n[0]]) {
          var u = L(n[0] + n[1], b, d);
        } else {
          for (u = v.relative[n[0]] ? [b] : k(n.shift(), b); n.length;) {
            a = n.shift(), v.relative[a] && (a += n.shift()), u = L(a, u, d);
          }
        }
      } else {
        if (!d && 1 < n.length && 9 === b.nodeType && !q && v.match.ID.test(n[0]) && !v.match.ID.test(n[n.length - 1]) && (r = k.find(n.shift(), b, q), b = r.expr ? k.filter(r.expr, r.set)[0] : r.set[0]), b) {
          for (r = d ? {expr:n.pop(), set:w(d)} : k.find(n.pop(), 1 !== n.length || "~" !== n[0] && "+" !== n[0] || !b.parentNode ? b : b.parentNode, q), u = r.expr ? k.filter(r.expr, r.set) : r.set, 0 < n.length ? h = w(u) : p = !1; n.length;) {
            m = l = n.pop(), v.relative[l] ? m = n.pop() : l = "", null == m && (m = b), v.relative[l](h, m, q);
          }
        } else {
          h = [];
        }
      }
      h || (h = u);
      h || k.error(l || a);
      if ("[object Array]" === g.call(h)) {
        if (p) {
          if (b && 1 === b.nodeType) {
            for (a = 0; null != h[a]; a++) {
              h[a] && (!0 === h[a] || 1 === h[a].nodeType && k.contains(b, h[a])) && c.push(u[a]);
            }
          } else {
            for (a = 0; null != h[a]; a++) {
              h[a] && 1 === h[a].nodeType && c.push(u[a]);
            }
          }
        } else {
          c.push.apply(c, h);
        }
      } else {
        w(h, c);
      }
      return B && (k(B, f, c, d), k.uniqueSort(c)), c;
    };
    k.uniqueSort = function(a) {
      if (Y && (m = l, a.sort(Y), m)) {
        for (var b = 1; b < a.length; b++) {
          a[b] === a[b - 1] && a.splice(b--, 1);
        }
      }
      return a;
    };
    k.matches = function(a, b) {
      return k(a, null, null, b);
    };
    k.matchesSelector = function(a, b) {
      return 0 < k(b, null, null, [a]).length;
    };
    k.find = function(a, b, e) {
      var c, d;
      if (!a) {
        return [];
      }
      var f = 0;
      for (c = v.order.length; f < c; f++) {
        var g = v.order[f];
        if (d = v.leftMatch[g].exec(a)) {
          var m = d[1];
          d.splice(1, 1);
          if ("\\" !== m.substr(m.length - 1)) {
            d[1] = (d[1] || "").replace(p, "");
            var h = v.find[g](d, b, e);
            if (null != h) {
              a = a.replace(v.match[g], "");
              break;
            }
          }
        }
      }
      return h || (h = "undefined" != typeof b.getElementsByTagName ? b.getElementsByTagName("*") : []), {set:h, expr:a};
    };
    k.filter = function(a, b, e, d) {
      for (var f, g, m, h, r, l, p, q, n = a, C = [], B = b, D = b && b[0] && k.isXML(b[0]); a && b.length;) {
        for (m in v.filter) {
          if (null != (f = v.leftMatch[m].exec(a)) && f[2] && (l = v.filter[m], r = f[1], g = !1, f.splice(1, 1), "\\" !== r.substr(r.length - 1))) {
            B === C && (C = []);
            if (v.preFilter[m]) {
              if (f = v.preFilter[m](f, B, e, C, d, D), !f) {
                g = h = !0;
              } else {
                if (!0 === f) {
                  continue;
                }
              }
            }
            if (f) {
              for (p = 0; null != (r = B[p]); p++) {
                r && (h = l(r, f, p, B), q = d ^ h, e && null != h ? q ? g = !0 : B[p] = !1 : q && (C.push(r), g = !0));
              }
            }
            if (h !== c) {
              e || (B = C);
              a = a.replace(v.match[m], "");
              if (!g) {
                return [];
              }
              break;
            }
          }
        }
        if (a === n) {
          if (null != g) {
            break;
          }
          k.error(a);
        }
        n = a;
      }
      return B;
    };
    k.error = function(a) {
      throw Error("Syntax error, unrecognized expression: " + a);
    };
    var C = k.getText = function(a) {
      var b;
      var e = a.nodeType;
      var c = "";
      if (e) {
        if (1 === e || 9 === e || 11 === e) {
          if ("string" == typeof a.textContent) {
            return a.textContent;
          }
          if ("string" == typeof a.innerText) {
            return a.innerText.replace(q, "");
          }
          for (a = a.firstChild; a; a = a.nextSibling) {
            c += C(a);
          }
        } else {
          if (3 === e || 4 === e) {
            return a.nodeValue;
          }
        }
      } else {
        for (e = 0; b = a[e]; e++) {
          8 !== b.nodeType && (c += C(b));
        }
      }
      return c;
    }, v = k.selectors = {order:["ID", "NAME", "TAG"], match:{ID:/#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/, CLASS:/\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/, NAME:/\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/, ATTR:/\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/, TAG:/^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/, CHILD:/:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/, POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/, 
    PSEUDO:/:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/}, leftMatch:{}, attrMap:{"class":"className", "for":"htmlFor"}, attrHandle:{href:function(a) {
      return a.getAttribute("href");
    }, type:function(a) {
      return a.getAttribute("type");
    }}, relative:{"+":function(a, b) {
      var e = "string" == typeof b, c = e && !n.test(b);
      e = e && !c;
      c && (b = b.toLowerCase());
      c = 0;
      for (var d = a.length, f; c < d; c++) {
        if (f = a[c]) {
          for (; (f = f.previousSibling) && 1 !== f.nodeType;) {
          }
          a[c] = e || f && f.nodeName.toLowerCase() === b ? f || !1 : f === b;
        }
      }
      e && k.filter(b, a, !0);
    }, ">":function(a, b) {
      var e, c = "string" == typeof b, d = 0, f = a.length;
      if (c && !n.test(b)) {
        for (b = b.toLowerCase(); d < f; d++) {
          if (e = a[d]) {
            e = e.parentNode, a[d] = e.nodeName.toLowerCase() === b ? e : !1;
          }
        }
      } else {
        for (; d < f; d++) {
          (e = a[d]) && (a[d] = c ? e.parentNode : e.parentNode === b);
        }
        c && k.filter(b, a, !0);
      }
    }, "":function(e, c, d) {
      var g, m = f++, h = b;
      "string" == typeof c && !n.test(c) && (c = c.toLowerCase(), g = c, h = a);
      h("parentNode", c, m, e, g, d);
    }, "~":function(e, c, d) {
      var g, m = f++, h = b;
      "string" == typeof c && !n.test(c) && (c = c.toLowerCase(), g = c, h = a);
      h("previousSibling", c, m, e, g, d);
    }}, find:{ID:function(a, b, e) {
      if ("undefined" != typeof b.getElementById && !e) {
        return (a = b.getElementById(a[1])) && a.parentNode ? [a] : [];
      }
    }, NAME:function(a, b) {
      if ("undefined" != typeof b.getElementsByName) {
        var e = [];
        b = b.getElementsByName(a[1]);
        for (var c = 0, d = b.length; c < d; c++) {
          b[c].getAttribute("name") === a[1] && e.push(b[c]);
        }
        return 0 === e.length ? null : e;
      }
    }, TAG:function(a, b) {
      if ("undefined" != typeof b.getElementsByTagName) {
        return b.getElementsByTagName(a[1]);
      }
    }}, preFilter:{CLASS:function(a, b, e, c, d, f) {
      a = " " + a[1].replace(p, "") + " ";
      if (f) {
        return a;
      }
      f = 0;
      for (var g; null != (g = b[f]); f++) {
        g && (d ^ (g.className && 0 <= (" " + g.className + " ").replace(/[\t\n\r]/g, " ").indexOf(a)) ? e || c.push(g) : e && (b[f] = !1));
      }
      return !1;
    }, ID:function(a) {
      return a[1].replace(p, "");
    }, TAG:function(a, b) {
      return a[1].replace(p, "").toLowerCase();
    }, CHILD:function(a) {
      if ("nth" === a[1]) {
        a[2] || k.error(a[0]);
        a[2] = a[2].replace(/^\+|\s*/g, "");
        var b = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec("even" === a[2] && "2n" || "odd" === a[2] && "2n+1" || !/\D/.test(a[2]) && "0n+" + a[2] || a[2]);
        a[2] = b[1] + (b[2] || 1) - 0;
        a[3] = b[3] - 0;
      } else {
        a[2] && k.error(a[0]);
      }
      return a[0] = f++, a;
    }, ATTR:function(a, b, e, c, d, f) {
      b = a[1] = a[1].replace(p, "");
      return !f && v.attrMap[b] && (a[1] = v.attrMap[b]), a[4] = (a[4] || a[5] || "").replace(p, ""), "~=" === a[2] && (a[4] = " " + a[4] + " "), a;
    }, PSEUDO:function(a, b, c, d, f) {
      if ("not" === a[1]) {
        if (!(1 < (e.exec(a[3]) || "").length || /^\w/.test(a[3]))) {
          return a = k.filter(a[3], b, c, 1 ^ f), c || d.push.apply(d, a), !1;
        }
        a[3] = k(a[3], null, null, b);
      } else {
        if (v.match.POS.test(a[0]) || v.match.CHILD.test(a[0])) {
          return !0;
        }
      }
      return a;
    }, POS:function(a) {
      return a.unshift(!0), a;
    }}, filters:{enabled:function(a) {
      return !1 === a.disabled && "hidden" !== a.type;
    }, disabled:function(a) {
      return !0 === a.disabled;
    }, checked:function(a) {
      return !0 === a.checked;
    }, selected:function(a) {
      return a.parentNode && a.parentNode.selectedIndex, !0 === a.selected;
    }, parent:function(a) {
      return !!a.firstChild;
    }, empty:function(a) {
      return !a.firstChild;
    }, has:function(a, b, e) {
      return !!k(e[3], a).length;
    }, header:function(a) {
      return /h\d/i.test(a.nodeName);
    }, text:function(a) {
      var b = a.getAttribute("type"), e = a.type;
      return "input" === a.nodeName.toLowerCase() && "text" === e && (b === e || null === b);
    }, radio:function(a) {
      return "input" === a.nodeName.toLowerCase() && "radio" === a.type;
    }, checkbox:function(a) {
      return "input" === a.nodeName.toLowerCase() && "checkbox" === a.type;
    }, file:function(a) {
      return "input" === a.nodeName.toLowerCase() && "file" === a.type;
    }, password:function(a) {
      return "input" === a.nodeName.toLowerCase() && "password" === a.type;
    }, submit:function(a) {
      var b = a.nodeName.toLowerCase();
      return ("input" === b || "button" === b) && "submit" === a.type;
    }, image:function(a) {
      return "input" === a.nodeName.toLowerCase() && "image" === a.type;
    }, reset:function(a) {
      var b = a.nodeName.toLowerCase();
      return ("input" === b || "button" === b) && "reset" === a.type;
    }, button:function(a) {
      var b = a.nodeName.toLowerCase();
      return "input" === b && "button" === a.type || "button" === b;
    }, input:function(a) {
      return /input|select|textarea|button/i.test(a.nodeName);
    }, focus:function(a) {
      return a === a.ownerDocument.activeElement;
    }}, setFilters:{first:function(a, b) {
      return 0 === b;
    }, last:function(a, b, e, c) {
      return b === c.length - 1;
    }, even:function(a, b) {
      return 0 === b % 2;
    }, odd:function(a, b) {
      return 1 === b % 2;
    }, lt:function(a, b, e) {
      return b < e[3] - 0;
    }, gt:function(a, b, e) {
      return b > e[3] - 0;
    }, nth:function(a, b, e) {
      return e[3] - 0 === b;
    }, eq:function(a, b, e) {
      return e[3] - 0 === b;
    }}, filter:{PSEUDO:function(a, b, e, c) {
      var d = b[1], f = v.filters[d];
      if (f) {
        return f(a, e, b, c);
      }
      if ("contains" === d) {
        return 0 <= (a.textContent || a.innerText || C([a]) || "").indexOf(b[3]);
      }
      if ("not" === d) {
        b = b[3];
        e = 0;
        for (c = b.length; e < c; e++) {
          if (b[e] === a) {
            return !1;
          }
        }
        return !0;
      }
      k.error(d);
    }, CHILD:function(a, b) {
      var e, c;
      var f = b[1];
      var g = a;
      switch(f) {
        case "only":
        case "first":
          for (; g = g.previousSibling;) {
            if (1 === g.nodeType) {
              return !1;
            }
          }
          if ("first" === f) {
            return !0;
          }
          g = a;
        case "last":
          for (; g = g.nextSibling;) {
            if (1 === g.nodeType) {
              return !1;
            }
          }
          return !0;
        case "nth":
          f = b[2];
          var m = b[3];
          if (1 === f && 0 === m) {
            return !0;
          }
          b = b[0];
          if ((e = a.parentNode) && (e[d] !== b || !a.nodeIndex)) {
            var h = 0;
            for (g = e.firstChild; g; g = g.nextSibling) {
              1 === g.nodeType && (g.nodeIndex = ++h);
            }
            e[d] = b;
          }
          return c = a.nodeIndex - m, 0 === f ? 0 === c : 0 === c % f && 0 <= c / f;
      }
    }, ID:function(a, b) {
      return 1 === a.nodeType && a.getAttribute("id") === b;
    }, TAG:function(a, b) {
      return "*" === b && 1 === a.nodeType || !!a.nodeName && a.nodeName.toLowerCase() === b;
    }, CLASS:function(a, b) {
      return -1 < (" " + (a.className || a.getAttribute("class")) + " ").indexOf(b);
    }, ATTR:function(a, b) {
      var e = b[1];
      a = k.attr ? k.attr(a, e) : v.attrHandle[e] ? v.attrHandle[e](a) : null != a[e] ? a[e] : a.getAttribute(e);
      e = a + "";
      var c = b[2];
      b = b[4];
      return null == a ? "!=" === c : !c && k.attr ? null != a : "=" === c ? e === b : "*=" === c ? 0 <= e.indexOf(b) : "~=" === c ? 0 <= (" " + e + " ").indexOf(b) : b ? "!=" === c ? e !== b : "^=" === c ? 0 === e.indexOf(b) : "$=" === c ? e.substr(e.length - b.length) === b : "|=" === c ? e === b || e.substr(0, b.length + 1) === b + "-" : !1 : e && !1 !== a;
    }, POS:function(a, b, e, c) {
      var d = v.setFilters[b[2]];
      if (d) {
        return d(a, e, b, c);
      }
    }}}, D = v.match.POS, I = function(a, b) {
      return "\\" + (b - 0 + 1);
    }, u;
    for (u in v.match) {
      v.match[u] = new RegExp(v.match[u].source + /(?![^\[]*\])(?![^\(]*\))/.source), v.leftMatch[u] = new RegExp(/(^(?:.|\r|\n)*?)/.source + v.match[u].source.replace(/\\(\d+)/g, I));
    }
    v.match.globalPOS = D;
    var w = function(a, b) {
      return a = Array.prototype.slice.call(a, 0), b ? (b.push.apply(b, a), b) : a;
    };
    try {
      Array.prototype.slice.call(z.documentElement.childNodes, 0)[0].nodeType;
    } catch (Ka) {
      w = function(a, b) {
        var e = 0;
        b = b || [];
        if ("[object Array]" === g.call(a)) {
          Array.prototype.push.apply(b, a);
        } else {
          if ("number" == typeof a.length) {
            for (var c = a.length; e < c; e++) {
              b.push(a[e]);
            }
          } else {
            for (; a[e]; e++) {
              b.push(a[e]);
            }
          }
        }
        return b;
      };
    }
    var Y, aa;
    z.documentElement.compareDocumentPosition ? Y = function(a, b) {
      return a === b ? (m = !0, 0) : a.compareDocumentPosition && b.compareDocumentPosition ? a.compareDocumentPosition(b) & 4 ? -1 : 1 : a.compareDocumentPosition ? -1 : 1;
    } : (Y = function(a, b) {
      if (a === b) {
        return m = !0, 0;
      }
      if (a.sourceIndex && b.sourceIndex) {
        return a.sourceIndex - b.sourceIndex;
      }
      var e = [], c = [];
      var d = a.parentNode;
      var f = b.parentNode;
      var g = d;
      if (d === f) {
        return aa(a, b);
      }
      if (!d) {
        return -1;
      }
      if (!f) {
        return 1;
      }
      for (; g;) {
        e.unshift(g), g = g.parentNode;
      }
      for (g = f; g;) {
        c.unshift(g), g = g.parentNode;
      }
      d = e.length;
      f = c.length;
      for (g = 0; g < d && g < f; g++) {
        if (e[g] !== c[g]) {
          return aa(e[g], c[g]);
        }
      }
      return g === d ? aa(a, c[g], -1) : aa(e[g], b, 1);
    }, aa = function(a, b, e) {
      if (a === b) {
        return e;
      }
      for (a = a.nextSibling; a;) {
        if (a === b) {
          return -1;
        }
        a = a.nextSibling;
      }
      return 1;
    });
    (function() {
      var a = z.createElement("div"), b = "script" + (new Date).getTime(), e = z.documentElement;
      a.innerHTML = "<a name='" + b + "'/>";
      e.insertBefore(a, e.firstChild);
      z.getElementById(b) && (v.find.ID = function(a, b, e) {
        if ("undefined" != typeof b.getElementById && !e) {
          return (b = b.getElementById(a[1])) ? b.id === a[1] || "undefined" != typeof b.getAttributeNode && b.getAttributeNode("id").nodeValue === a[1] ? [b] : c : [];
        }
      }, v.filter.ID = function(a, b) {
        var e = "undefined" != typeof a.getAttributeNode && a.getAttributeNode("id");
        return 1 === a.nodeType && e && e.nodeValue === b;
      });
      e.removeChild(a);
      e = a = null;
    })();
    (function() {
      var a = z.createElement("div");
      a.appendChild(z.createComment(""));
      0 < a.getElementsByTagName("*").length && (v.find.TAG = function(a, b) {
        b = b.getElementsByTagName(a[1]);
        if ("*" === a[1]) {
          a = [];
          for (var e = 0; b[e]; e++) {
            1 === b[e].nodeType && a.push(b[e]);
          }
          b = a;
        }
        return b;
      });
      a.innerHTML = "<a href='#'></a>";
      a.firstChild && "undefined" != typeof a.firstChild.getAttribute && "#" !== a.firstChild.getAttribute("href") && (v.attrHandle.href = function(a) {
        return a.getAttribute("href", 2);
      });
      a = null;
    })();
    z.querySelectorAll && function() {
      var a = k, b = z.createElement("div");
      b.innerHTML = "<p class='TEST'></p>";
      if (!b.querySelectorAll || 0 !== b.querySelectorAll(".TEST").length) {
        k = function(b, e, c, d) {
          e = e || z;
          if (!d && !k.isXML(e)) {
            var f = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(b);
            if (f && (1 === e.nodeType || 9 === e.nodeType)) {
              if (f[1]) {
                return w(e.getElementsByTagName(b), c);
              }
              if (f[2] && v.find.CLASS && e.getElementsByClassName) {
                return w(e.getElementsByClassName(f[2]), c);
              }
            }
            if (9 === e.nodeType) {
              if ("body" === b && e.body) {
                return w([e.body], c);
              }
              if (f && f[3]) {
                var g = e.getElementById(f[3]);
                if (!g || !g.parentNode) {
                  return w([], c);
                }
                if (g.id === f[3]) {
                  return w([g], c);
                }
              }
              try {
                return w(e.querySelectorAll(b), c);
              } catch ($a) {
              }
            } else {
              if (1 === e.nodeType && "object" !== e.nodeName.toLowerCase()) {
                f = e;
                var m = (g = e.getAttribute("id")) || "__sizzle__", h = e.parentNode, r = /^\s*[+~]/.test(b);
                g ? m = m.replace(/'/g, "\\$&") : e.setAttribute("id", m);
                r && h && (e = e.parentNode);
                try {
                  if (!r || h) {
                    return w(e.querySelectorAll("[id='" + m + "'] " + b), c);
                  }
                } catch ($a) {
                } finally {
                  g || f.removeAttribute("id");
                }
              }
            }
          }
          return a(b, e, c, d);
        };
        for (var e in a) {
          k[e] = a[e];
        }
        b = null;
      }
    }();
    (function() {
      var a = z.documentElement, b = a.matchesSelector || a.mozMatchesSelector || a.webkitMatchesSelector || a.msMatchesSelector;
      if (b) {
        var e = !b.call(z.createElement("div"), "div"), c = !1;
        try {
          b.call(z.documentElement, "[test!='']:sizzle");
        } catch (Nb) {
          c = !0;
        }
        k.matchesSelector = function(a, d) {
          d = d.replace(/=\s*([^'"\]]*)\s*\]/g, "='$1']");
          if (!k.isXML(a)) {
            try {
              if (c || !v.match.PSEUDO.test(d) && !/!=/.test(d)) {
                var f = b.call(a, d);
                if (f || !e || a.document && 11 !== a.document.nodeType) {
                  return f;
                }
              }
            } catch (Ob) {
            }
          }
          return 0 < k(d, null, null, [a]).length;
        };
      }
    })();
    (function() {
      var a = z.createElement("div");
      a.innerHTML = "<div class='test e'></div><div class='test'></div>";
      a.getElementsByClassName && 0 !== a.getElementsByClassName("e").length && (a.lastChild.className = "e", 1 !== a.getElementsByClassName("e").length && (v.order.splice(1, 0, "CLASS"), v.find.CLASS = function(a, b, e) {
        if ("undefined" != typeof b.getElementsByClassName && !e) {
          return b.getElementsByClassName(a[1]);
        }
      }, a = null));
    })();
    z.documentElement.contains ? k.contains = function(a, b) {
      return a !== b && (a.contains ? a.contains(b) : !0);
    } : z.documentElement.compareDocumentPosition ? k.contains = function(a, b) {
      return !!(a.compareDocumentPosition(b) & 16);
    } : k.contains = function() {
      return !1;
    };
    k.isXML = function(a) {
      return (a = (a ? a.ownerDocument || a : 0).documentElement) ? "HTML" !== a.nodeName : !1;
    };
    var L = function(a, b, e) {
      var c, d = [], f = "";
      for (b = b.nodeType ? [b] : b; c = v.match.PSEUDO.exec(a);) {
        f += c[0], a = a.replace(v.match.PSEUDO, "");
      }
      a = v.relative[a] ? a + "*" : a;
      c = 0;
      for (var g = b.length; c < g; c++) {
        k(a, b[c], d, e);
      }
      return k.filter(f, d);
    };
    k.attr = h.attr;
    k.selectors.attrMap = {};
    h.find = k;
    h.expr = k.selectors;
    h.expr[":"] = h.expr.filters;
    h.unique = k.uniqueSort;
    h.text = k.getText;
    h.isXMLDoc = k.isXML;
    h.contains = k.contains;
  })();
  var ka = /Until$/, ca = /^(?:parents|prevUntil|prevAll)/, Z = /,/, J = /^.[^:#\[\.,]*$/, ia = Array.prototype.slice, ta = h.expr.match.globalPOS, I = {children:!0, contents:!0, next:!0, prev:!0};
  h.fn.extend({find:function(a) {
    var b = this, e;
    if ("string" != typeof a) {
      return h(a).filter(function() {
        g = 0;
        for (e = b.length; g < e; g++) {
          if (h.contains(b[g], this)) {
            return !0;
          }
        }
      });
    }
    var c = this.pushStack("", "find", a), d, f;
    var g = 0;
    for (e = this.length; g < e; g++) {
      var m = c.length;
      h.find(a, this[g], c);
      if (0 < g) {
        for (d = m; d < c.length; d++) {
          for (f = 0; f < m; f++) {
            if (c[f] === c[d]) {
              c.splice(d--, 1);
              break;
            }
          }
        }
      }
    }
    return c;
  }, has:function(a) {
    var b = h(a);
    return this.filter(function() {
      for (var a = 0, e = b.length; a < e; a++) {
        if (h.contains(this, b[a])) {
          return !0;
        }
      }
    });
  }, not:function(a) {
    return this.pushStack(n(this, a, !1), "not", a);
  }, filter:function(a) {
    return this.pushStack(n(this, a, !0), "filter", a);
  }, is:function(a) {
    return !!a && ("string" == typeof a ? ta.test(a) ? 0 <= h(a, this.context).index(this[0]) : 0 < h.filter(a, this).length : 0 < this.filter(a).length);
  }, closest:function(a, b) {
    var e = [], c, d, f = this[0];
    if (h.isArray(a)) {
      for (d = 1; f && f.ownerDocument && f !== b;) {
        for (c = 0; c < a.length; c++) {
          h(f).is(a[c]) && e.push({selector:a[c], elem:f, level:d});
        }
        f = f.parentNode;
        d++;
      }
      return e;
    }
    var g = ta.test(a) || "string" != typeof a ? h(a, b || this.context) : 0;
    c = 0;
    for (d = this.length; c < d; c++) {
      for (f = this[c]; f;) {
        if (g ? -1 < g.index(f) : h.find.matchesSelector(f, a)) {
          e.push(f);
          break;
        }
        f = f.parentNode;
        if (!f || !f.ownerDocument || f === b || 11 === f.nodeType) {
          break;
        }
      }
    }
    return e = 1 < e.length ? h.unique(e) : e, this.pushStack(e, "closest", a);
  }, index:function(a) {
    return a ? "string" == typeof a ? h.inArray(this[0], h(a)) : h.inArray(a.jquery ? a[0] : a, this) : this[0] && this[0].parentNode ? this.prevAll().length : -1;
  }, add:function(a, b) {
    a = "string" == typeof a ? h(a, b) : h.makeArray(a && a.nodeType ? [a] : a);
    b = h.merge(this.get(), a);
    return this.pushStack(k(a[0]) || k(b[0]) ? b : h.unique(b));
  }, andSelf:function() {
    return this.add(this.prevObject);
  }});
  h.each({parent:function(a) {
    return (a = a.parentNode) && 11 !== a.nodeType ? a : null;
  }, parents:function(a) {
    return h.dir(a, "parentNode");
  }, parentsUntil:function(a, b, e) {
    return h.dir(a, "parentNode", e);
  }, next:function(a) {
    return h.nth(a, 2, "nextSibling");
  }, prev:function(a) {
    return h.nth(a, 2, "previousSibling");
  }, nextAll:function(a) {
    return h.dir(a, "nextSibling");
  }, prevAll:function(a) {
    return h.dir(a, "previousSibling");
  }, nextUntil:function(a, b, e) {
    return h.dir(a, "nextSibling", e);
  }, prevUntil:function(a, b, e) {
    return h.dir(a, "previousSibling", e);
  }, siblings:function(a) {
    return h.sibling((a.parentNode || {}).firstChild, a);
  }, children:function(a) {
    return h.sibling(a.firstChild);
  }, contents:function(a) {
    return h.nodeName(a, "iframe") ? a.contentDocument || a.contentWindow.document : h.makeArray(a.childNodes);
  }}, function(a, b) {
    h.fn[a] = function(e, c) {
      var d = h.map(this, b, e);
      return ka.test(a) || (c = e), c && "string" == typeof c && (d = h.filter(c, d)), d = 1 < this.length && !I[a] ? h.unique(d) : d, (1 < this.length || Z.test(c)) && ca.test(a) && (d = d.reverse()), this.pushStack(d, a, ia.call(arguments).join(","));
    };
  });
  h.extend({filter:function(a, b, e) {
    return e && (a = ":not(" + a + ")"), 1 === b.length ? h.find.matchesSelector(b[0], a) ? [b[0]] : [] : h.find.matches(a, b);
  }, dir:function(a, b, e) {
    var d = [];
    for (a = a[b]; a && 9 !== a.nodeType && (e === c || 1 !== a.nodeType || !h(a).is(e));) {
      1 === a.nodeType && d.push(a), a = a[b];
    }
    return d;
  }, nth:function(a, b, e, c) {
    b = b || 1;
    for (c = 0; a && (1 !== a.nodeType || ++c !== b); a = a[e]) {
    }
    return a;
  }, sibling:function(a, b) {
    for (var e = []; a; a = a.nextSibling) {
      1 === a.nodeType && a !== b && e.push(a);
    }
    return e;
  }});
  var Y = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video", ua = / jQuery\d+="(?:\d+|null)"/g, aa = /^\s+/, L = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig, ba = /<([\w:]+)/, P = /<tbody/i, Da = /<|&#?\w+;/, qa = /<(?:script|style)/i, da = /<(?:script|object|embed|option|style)/i, Ea = new RegExp("<(?:" + Y + ")[\\s/>]", "i"), ab = /checked\s*(?:[^=]|=\s*.checked.)/i, 
  bb = /\/(java|ecma)script/i, lb = /^\s*<!(?:\[CDATA\[|\-\-)/, ea = {option:[1, "<select multiple='multiple'>", "</select>"], legend:[1, "<fieldset>", "</fieldset>"], thead:[1, "<table>", "</table>"], tr:[2, "<table><tbody>", "</tbody></table>"], td:[3, "<table><tbody><tr>", "</tr></tbody></table>"], col:[2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"], area:[1, "<map>", "</map>"], _default:[0, "", ""]}, Wa = q(z);
  ea.optgroup = ea.option;
  ea.tbody = ea.tfoot = ea.colgroup = ea.caption = ea.thead;
  ea.th = ea.td;
  h.support.htmlSerialize || (ea._default = [1, "div<div>", "</div>"]);
  h.fn.extend({text:function(a) {
    return h.access(this, function(a) {
      return a === c ? h.text(this) : this.empty().append((this[0] && this[0].ownerDocument || z).createTextNode(a));
    }, null, a, arguments.length);
  }, wrapAll:function(a) {
    if (h.isFunction(a)) {
      return this.each(function(b) {
        h(this).wrapAll(a.call(this, b));
      });
    }
    if (this[0]) {
      var b = h(a, this[0].ownerDocument).eq(0).clone(!0);
      this[0].parentNode && b.insertBefore(this[0]);
      b.map(function() {
        for (var a = this; a.firstChild && 1 === a.firstChild.nodeType;) {
          a = a.firstChild;
        }
        return a;
      }).append(this);
    }
    return this;
  }, wrapInner:function(a) {
    return h.isFunction(a) ? this.each(function(b) {
      h(this).wrapInner(a.call(this, b));
    }) : this.each(function() {
      var b = h(this), e = b.contents();
      e.length ? e.wrapAll(a) : b.append(a);
    });
  }, wrap:function(a) {
    var b = h.isFunction(a);
    return this.each(function(e) {
      h(this).wrapAll(b ? a.call(this, e) : a);
    });
  }, unwrap:function() {
    return this.parent().each(function() {
      h.nodeName(this, "body") || h(this).replaceWith(this.childNodes);
    }).end();
  }, append:function() {
    return this.domManip(arguments, !0, function(a) {
      1 === this.nodeType && this.appendChild(a);
    });
  }, prepend:function() {
    return this.domManip(arguments, !0, function(a) {
      1 === this.nodeType && this.insertBefore(a, this.firstChild);
    });
  }, before:function() {
    if (this[0] && this[0].parentNode) {
      return this.domManip(arguments, !1, function(a) {
        this.parentNode.insertBefore(a, this);
      });
    }
    if (arguments.length) {
      var a = h.clean(arguments);
      return a.push.apply(a, this.toArray()), this.pushStack(a, "before", arguments);
    }
  }, after:function() {
    if (this[0] && this[0].parentNode) {
      return this.domManip(arguments, !1, function(a) {
        this.parentNode.insertBefore(a, this.nextSibling);
      });
    }
    if (arguments.length) {
      var a = this.pushStack(this, "after", arguments);
      return a.push.apply(a, h.clean(arguments)), a;
    }
  }, remove:function(a, b) {
    for (var e = 0, c; null != (c = this[e]); e++) {
      if (!a || h.filter(a, [c]).length) {
        !b && 1 === c.nodeType && (h.cleanData(c.getElementsByTagName("*")), h.cleanData([c])), c.parentNode && c.parentNode.removeChild(c);
      }
    }
    return this;
  }, empty:function() {
    for (var a = 0, b; null != (b = this[a]); a++) {
      for (1 === b.nodeType && h.cleanData(b.getElementsByTagName("*")); b.firstChild;) {
        b.removeChild(b.firstChild);
      }
    }
    return this;
  }, clone:function(a, b) {
    return a = null == a ? !1 : a, b = null == b ? a : b, this.map(function() {
      return h.clone(this, a, b);
    });
  }, html:function(a) {
    return h.access(this, function(a) {
      var b = this[0] || {}, e = 0, d = this.length;
      if (a === c) {
        return 1 === b.nodeType ? b.innerHTML.replace(ua, "") : null;
      }
      if (!("string" != typeof a || qa.test(a) || !h.support.leadingWhitespace && aa.test(a) || ea[(ba.exec(a) || ["", ""])[1].toLowerCase()])) {
        a = a.replace(L, "<$1></$2>");
        try {
          for (; e < d; e++) {
            b = this[e] || {}, 1 === b.nodeType && (h.cleanData(b.getElementsByTagName("*")), b.innerHTML = a);
          }
          b = 0;
        } catch (Ib) {
        }
      }
      b && this.empty().append(a);
    }, null, a, arguments.length);
  }, replaceWith:function(a) {
    return this[0] && this[0].parentNode ? h.isFunction(a) ? this.each(function(b) {
      var e = h(this), c = e.html();
      e.replaceWith(a.call(this, b, c));
    }) : ("string" != typeof a && (a = h(a).detach()), this.each(function() {
      var b = this.nextSibling, e = this.parentNode;
      h(this).remove();
      b ? h(b).before(a) : h(e).append(a);
    })) : this.length ? this.pushStack(h(h.isFunction(a) ? a() : a), "replaceWith", a) : this;
  }, detach:function(a) {
    return this.remove(a, !0);
  }, domManip:function(a, b, e) {
    var d, f, g = a[0], m = [];
    if (!h.support.checkClone && 3 === arguments.length && "string" == typeof g && ab.test(g)) {
      return this.each(function() {
        h(this).domManip(a, b, e, !0);
      });
    }
    if (h.isFunction(g)) {
      return this.each(function(d) {
        var f = h(this);
        a[0] = g.call(this, d, b ? f.html() : c);
        f.domManip(a, b, e);
      });
    }
    if (this[0]) {
      var l = g && g.parentNode;
      h.support.parentNode && l && 11 === l.nodeType && l.childNodes.length === this.length ? d = {fragment:l} : d = h.buildFragment(a, this, m);
      l = d.fragment;
      1 === l.childNodes.length ? f = l = l.firstChild : f = l.firstChild;
      if (f) {
        b = b && h.nodeName(f, "tr");
        for (var p = 0, q = this.length, n = q - 1; p < q; p++) {
          e.call(b ? u(this[p], f) : this[p], d.cacheable || 1 < q && p < n ? h.clone(l, !0, !0) : l);
        }
      }
      m.length && h.each(m, function(a, b) {
        b.src ? h.ajax({type:"GET", global:!1, url:b.src, async:!1, dataType:"script"}) : h.globalEval((b.text || b.textContent || b.innerHTML || "").replace(lb, "/*$0*/"));
        b.parentNode && b.parentNode.removeChild(b);
      });
    }
    return this;
  }});
  h.buildFragment = function(a, b, e) {
    var c, d, f, g, m = a[0];
    return b && b[0] && (g = b[0].ownerDocument || b[0]), g.createDocumentFragment || (g = z), 1 === a.length && "string" == typeof m && 512 > m.length && g === z && "<" === m.charAt(0) && !da.test(m) && (h.support.checkClone || !ab.test(m)) && (h.support.html5Clone || !Ea.test(m)) && (d = !0, f = h.fragments[m], f && 1 !== f && (c = f)), c || (c = g.createDocumentFragment(), h.clean(a, g, c, e)), d && (h.fragments[m] = f ? c : 1), {fragment:c, cacheable:d};
  };
  h.fragments = {};
  h.each({appendTo:"append", prependTo:"prepend", insertBefore:"before", insertAfter:"after", replaceAll:"replaceWith"}, function(a, b) {
    h.fn[a] = function(e) {
      var c = [];
      e = h(e);
      var d = 1 === this.length && this[0].parentNode;
      if (d && 11 === d.nodeType && 1 === d.childNodes.length && 1 === e.length) {
        return e[b](this[0]), this;
      }
      d = 0;
      for (var f = e.length; d < f; d++) {
        var g = (0 < d ? this.clone(!0) : this).get();
        h(e[d])[b](g);
        c = c.concat(g);
      }
      return this.pushStack(c, a, e.selector);
    };
  });
  h.extend({clone:function(a, b, e) {
    var c;
    if (h.support.html5Clone || h.isXMLDoc(a) || !Ea.test("<" + a.nodeName + ">")) {
      var d = a.cloneNode(!0);
    } else {
      d = z.createElement("div"), d = (Wa.appendChild(d), d.innerHTML = a.outerHTML, d.firstChild);
    }
    var f = d;
    if (!(h.support.noCloneEvent && h.support.noCloneChecked || 1 !== a.nodeType && 11 !== a.nodeType || h.isXMLDoc(a))) {
      p(a, f);
      d = v(a);
      var g = v(f);
      for (c = 0; d[c]; ++c) {
        g[c] && p(d[c], g[c]);
      }
    }
    if (b && (m(a, f), e)) {
      for (d = v(a), g = v(f), c = 0; d[c]; ++c) {
        m(d[c], g[c]);
      }
    }
    return f;
  }, clean:function(a, b, e, c) {
    var d = [];
    b = b || z;
    "undefined" == typeof b.createElement && (b = b.ownerDocument || b[0] && b[0].ownerDocument || z);
    for (var f = 0, g; null != (g = a[f]); f++) {
      if ("number" == typeof g && (g += ""), g) {
        if ("string" == typeof g) {
          if (Da.test(g)) {
            g = g.replace(L, "<$1></$2>");
            var m = (ba.exec(g) || ["", ""])[1].toLowerCase();
            var l = ea[m] || ea._default, p = l[0], n = b.createElement("div"), k = Wa.childNodes, r;
            b === z ? Wa.appendChild(n) : q(b).appendChild(n);
            for (n.innerHTML = l[1] + g + l[2]; p--;) {
              n = n.lastChild;
            }
            if (!h.support.tbody) {
              for (p = P.test(g), l = "table" !== m || p ? "<table>" !== l[1] || p ? [] : n.childNodes : n.firstChild && n.firstChild.childNodes, m = l.length - 1; 0 <= m; --m) {
                h.nodeName(l[m], "tbody") && !l[m].childNodes.length && l[m].parentNode.removeChild(l[m]);
              }
            }
            !h.support.leadingWhitespace && aa.test(g) && n.insertBefore(b.createTextNode(aa.exec(g)[0]), n.firstChild);
            g = n.childNodes;
            n && (n.parentNode.removeChild(n), 0 < k.length && (r = k[k.length - 1], r && r.parentNode && r.parentNode.removeChild(r)));
          } else {
            g = b.createTextNode(g);
          }
        }
        var C;
        if (!h.support.appendChecked) {
          if (g[0] && "number" == typeof(C = g.length)) {
            for (m = 0; m < C; m++) {
              A(g[m]);
            }
          } else {
            A(g);
          }
        }
        g.nodeType ? d.push(g) : d = h.merge(d, g);
      }
    }
    if (e) {
      for (a = function(a) {
        return !a.type || bb.test(a.type);
      }, f = 0; d[f]; f++) {
        b = d[f], c && h.nodeName(b, "script") && (!b.type || bb.test(b.type)) ? c.push(b.parentNode ? b.parentNode.removeChild(b) : b) : (1 === b.nodeType && (g = h.grep(b.getElementsByTagName("script"), a), d.splice.apply(d, [f + 1, 0].concat(g))), e.appendChild(b));
      }
    }
    return d;
  }, cleanData:function(a) {
    for (var b, e, c = h.cache, d = h.event.special, f = h.support.deleteExpando, g = 0, m; null != (m = a[g]); g++) {
      if (!m.nodeName || !h.noData[m.nodeName.toLowerCase()]) {
        if (e = m[h.expando]) {
          if ((b = c[e]) && b.events) {
            for (var l in b.events) {
              d[l] ? h.event.remove(m, l) : h.removeEvent(m, l, b.handle);
            }
            b.handle && (b.handle.elem = null);
          }
          f ? delete m[h.expando] : m.removeAttribute && m.removeAttribute(h.expando);
          delete c[e];
        }
      }
    }
  }});
  var ya = /alpha\([^)]*\)/i, mb = /opacity=([^)]*)/, nb = /([A-Z]|^ms)/g, ob = /^[\-+]?(?:\d*\.)?\d+$/i, Sa = /^-?(?:\d*\.)?\d+(?!px)[^\d\s]+$/i, pb = /^([\-+])=([\-+.\de]+)/, qb = /^margin/, rb = {position:"absolute", visibility:"hidden", display:"block"}, wa = ["Top", "Right", "Bottom", "Left"], cb, db;
  h.fn.css = function(a, b) {
    return h.access(this, function(a, b, e) {
      return e !== c ? h.style(a, b, e) : h.css(a, b);
    }, a, b, 1 < arguments.length);
  };
  h.extend({cssHooks:{opacity:{get:function(a, b) {
    return b ? (a = Ia(a, "opacity"), "" === a ? "1" : a) : a.style.opacity;
  }}}, cssNumber:{fillOpacity:!0, fontWeight:!0, lineHeight:!0, opacity:!0, orphans:!0, widows:!0, zIndex:!0, zoom:!0}, cssProps:{"float":h.support.cssFloat ? "cssFloat" : "styleFloat"}, style:function(a, b, e, d) {
    if (a && 3 !== a.nodeType && 8 !== a.nodeType && a.style) {
      var f, g = h.camelCase(b), m = a.style, l = h.cssHooks[g];
      b = h.cssProps[g] || g;
      if (e === c) {
        return l && "get" in l && (f = l.get(a, !1, d)) !== c ? f : m[b];
      }
      d = typeof e;
      "string" === d && (f = pb.exec(e)) && (e = +(f[1] + 1) * +f[2] + parseFloat(h.css(a, b)), d = "number");
      if (!(null == e || "number" === d && isNaN(e) || ("number" === d && !h.cssNumber[g] && (e += "px"), l && "set" in l && (e = l.set(a, e)) === c))) {
        try {
          m[b] = e;
        } catch (Kb) {
        }
      }
    }
  }, css:function(a, b, e) {
    var d;
    b = h.camelCase(b);
    var f = h.cssHooks[b];
    b = h.cssProps[b] || b;
    "cssFloat" === b && (b = "float");
    if (f && "get" in f && (d = f.get(a, !0, e)) !== c) {
      return d;
    }
    if (Ia) {
      return Ia(a, b);
    }
  }, swap:function(a, b, e) {
    var c = {}, d;
    for (d in b) {
      c[d] = a.style[d], a.style[d] = b[d];
    }
    e = e.call(a);
    for (d in b) {
      a.style[d] = c[d];
    }
    return e;
  }});
  h.curCSS = h.css;
  z.defaultView && z.defaultView.getComputedStyle && (cb = function(a, b) {
    var e, c, d, f, g = a.style;
    return b = b.replace(nb, "-$1").toLowerCase(), (c = a.ownerDocument.defaultView) && (d = c.getComputedStyle(a, null)) && (e = d.getPropertyValue(b), "" === e && !h.contains(a.ownerDocument.documentElement, a) && (e = h.style(a, b))), !h.support.pixelMargin && d && qb.test(b) && Sa.test(e) && (f = g.width, g.width = e, e = d.width, g.width = f), e;
  });
  z.documentElement.currentStyle && (db = function(a, b) {
    var e, c, d, f = a.currentStyle && a.currentStyle[b], g = a.style;
    return null == f && g && (d = g[b]) && (f = d), Sa.test(f) && (e = g.left, c = a.runtimeStyle && a.runtimeStyle.left, c && (a.runtimeStyle.left = a.currentStyle.left), g.left = "fontSize" === b ? "1em" : f, f = g.pixelLeft + "px", g.left = e, c && (a.runtimeStyle.left = c)), "" === f ? "auto" : f;
  });
  var Ia = cb || db;
  h.each(["height", "width"], function(a, b) {
    h.cssHooks[b] = {get:function(a, e, c) {
      if (e) {
        return 0 !== a.offsetWidth ? D(a, b, c) : h.swap(a, rb, function() {
          return D(a, b, c);
        });
      }
    }, set:function(a, b) {
      return ob.test(b) ? b + "px" : b;
    }};
  });
  h.support.opacity || (h.cssHooks.opacity = {get:function(a, b) {
    return mb.test((b && a.currentStyle ? a.currentStyle.filter : a.style.filter) || "") ? parseFloat(RegExp.$1) / 100 + "" : b ? "1" : "";
  }, set:function(a, b) {
    var e = a.style;
    a = a.currentStyle;
    var c = h.isNumeric(b) ? "alpha(opacity=" + 100 * b + ")" : "", d = a && a.filter || e.filter || "";
    e.zoom = 1;
    if (1 <= b && "" === h.trim(d.replace(ya, "")) && (e.removeAttribute("filter"), a && !a.filter)) {
      return;
    }
    e.filter = ya.test(d) ? d.replace(ya, c) : d + " " + c;
  }});
  h(function() {
    h.support.reliableMarginRight || (h.cssHooks.marginRight = {get:function(a, b) {
      return h.swap(a, {display:"inline-block"}, function() {
        return b ? Ia(a, "margin-right") : a.style.marginRight;
      });
    }});
  });
  h.expr && h.expr.filters && (h.expr.filters.hidden = function(a) {
    var b = a.offsetHeight;
    return 0 === a.offsetWidth && 0 === b || !h.support.reliableHiddenOffsets && "none" === (a.style && a.style.display || h.css(a, "display"));
  }, h.expr.filters.visible = function(a) {
    return !h.expr.filters.hidden(a);
  });
  h.each({margin:"", padding:"", border:"Width"}, function(a, b) {
    h.cssHooks[a + b] = {expand:function(e) {
      var c = "string" == typeof e ? e.split(" ") : [e], d = {};
      for (e = 0; 4 > e; e++) {
        d[a + wa[e] + b] = c[e] || c[e - 2] || c[0];
      }
      return d;
    }};
  });
  var sb = /%20/g, kb = /\[\]$/, eb = /\r?\n/g, tb = /#.*$/, ub = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, vb = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i, wb = /^(?:GET|HEAD)$/, xb = /^\/\//, fb = /\?/, yb = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, zb = /^(?:select|textarea)/i, Za = /\s+/, Ab = /([?&])_=[^&]*/, gb = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/, hb = h.fn.load, Ta = {}, ib = {};
  try {
    var Fa = Ba.href;
  } catch (r) {
    Fa = z.createElement("a"), Fa.href = "", Fa = Fa.href;
  }
  var Ga = gb.exec(Fa.toLowerCase()) || [];
  h.fn.extend({load:function(a, b, e) {
    if ("string" != typeof a && hb) {
      return hb.apply(this, arguments);
    }
    if (!this.length) {
      return this;
    }
    var d = a.indexOf(" ");
    if (0 <= d) {
      var f = a.slice(d, a.length);
      a = a.slice(0, d);
    }
    d = "GET";
    b && (h.isFunction(b) ? (e = b, b = c) : "object" == typeof b && (b = h.param(b, h.ajaxSettings.traditional), d = "POST"));
    var g = this;
    return h.ajax({url:a, type:d, dataType:"html", data:b, complete:function(a, b, c) {
      c = a.responseText;
      a.isResolved() && (a.done(function(a) {
        c = a;
      }), g.html(f ? h("<div>").append(c.replace(yb, "")).find(f) : c));
      e && g.each(e, [c, b, a]);
    }}), this;
  }, serialize:function() {
    return h.param(this.serializeArray());
  }, serializeArray:function() {
    return this.map(function() {
      return this.elements ? h.makeArray(this.elements) : this;
    }).filter(function() {
      return this.name && !this.disabled && (this.checked || zb.test(this.nodeName) || vb.test(this.type));
    }).map(function(a, b) {
      a = h(this).val();
      return null == a ? null : h.isArray(a) ? h.map(a, function(a, e) {
        return {name:b.name, value:a.replace(eb, "\r\n")};
      }) : {name:b.name, value:a.replace(eb, "\r\n")};
    }).get();
  }});
  h.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function(a, b) {
    h.fn[b] = function(a) {
      return this.on(b, a);
    };
  });
  h.each(["get", "post"], function(a, b) {
    h[b] = function(a, e, d, f) {
      return h.isFunction(e) && (f = f || d, d = e, e = c), h.ajax({type:b, url:a, data:e, success:d, dataType:f});
    };
  });
  h.extend({getScript:function(a, b) {
    return h.get(a, c, b, "script");
  }, getJSON:function(a, b, e) {
    return h.get(a, b, e, "json");
  }, ajaxSetup:function(a, b) {
    return b ? C(a, h.ajaxSettings) : (b = a, a = h.ajaxSettings), C(a, b), a;
  }, ajaxSettings:{url:Fa, isLocal:/^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/.test(Ga[1]), global:!0, type:"GET", contentType:"application/x-www-form-urlencoded; charset=UTF-8", processData:!0, async:!0, accepts:{xml:"application/xml, text/xml", html:"text/html", text:"text/plain", json:"application/json, text/javascript", "*":"*/*"}, contents:{xml:/xml/, html:/html/, json:/json/}, responseFields:{xml:"responseXML", text:"responseText"}, converters:{"* text":a.String, "text html":!0, 
  "text json":h.parseJSON, "text xml":h.parseXML}, flatOptions:{context:!0, url:!0}}, ajaxPrefilter:x(Ta), ajaxTransport:x(ib), ajax:function(a, b) {
    function e(a, b, e, n) {
      if (2 !== u) {
        u = 2;
        v && clearTimeout(v);
        r = c;
        k = n || "";
        w.readyState = 0 < a ? 4 : 0;
        n = b;
        if (e) {
          var q = d, C = w, D = q.contents, I = q.dataTypes, aa = q.responseFields, L, A;
          for (P in aa) {
            P in e && (C[aa[P]] = e[P]);
          }
          for (; "*" === I[0];) {
            I.shift(), L === c && (L = q.mimeType || C.getResponseHeader("content-type"));
          }
          if (L) {
            for (P in D) {
              if (D[P] && D[P].test(L)) {
                I.unshift(P);
                break;
              }
            }
          }
          if (I[0] in e) {
            var x = I[0];
          } else {
            for (P in e) {
              if (!I[0] || q.converters[P + " " + I[0]]) {
                x = P;
                break;
              }
              A || (A = P);
            }
            x = x || A;
          }
          e = x ? (x !== I[0] && I.unshift(x), e[x]) : void 0;
        } else {
          e = c;
        }
        if (200 <= a && 300 > a || 304 === a) {
          if (d.ifModified) {
            if (L = w.getResponseHeader("Last-Modified")) {
              h.lastModified[B] = L;
            }
            if (L = w.getResponseHeader("Etag")) {
              h.etag[B] = L;
            }
          }
          if (304 === a) {
            n = "notmodified";
            var ua = !0;
          } else {
            try {
              L = d;
              L.dataFilter && (e = L.dataFilter(e, L.dataType));
              var F = L.dataTypes;
              var P = {};
              var ba, O, Da = F.length, da = F[0];
              for (ba = 1; ba < Da; ba++) {
                if (1 === ba) {
                  for (O in L.converters) {
                    "string" == typeof O && (P[O.toLowerCase()] = L.converters[O]);
                  }
                }
                var Q = da;
                da = F[ba];
                if ("*" === da) {
                  da = Q;
                } else {
                  if ("*" !== Q && Q !== da) {
                    var y = Q + " " + da;
                    var qa = P[y] || P["* " + da];
                    if (!qa) {
                      var M = c;
                      for (z in P) {
                        var ya = z.split(" ");
                        if (ya[0] === Q || "*" === ya[0]) {
                          if (M = P[ya[1] + " " + da]) {
                            var z = P[z];
                            !0 === z ? qa = M : !0 === M && (qa = z);
                            break;
                          }
                        }
                      }
                    }
                    qa || M || h.error("No conversion from " + y.replace(" ", " to "));
                    !0 !== qa && (e = qa ? qa(e) : M(z(e)));
                  }
                }
              }
              var Ra = e;
              n = "success";
              ua = !0;
            } catch (Bb) {
              n = "parsererror";
              var Ea = Bb;
            }
          }
        } else {
          if (Ea = n, !n || a) {
            n = "error", 0 > a && (a = 0);
          }
        }
        w.status = a;
        w.statusText = "" + (b || n);
        ua ? m.resolveWith(f, [Ra, n, w]) : m.rejectWith(f, [w, n, Ea]);
        w.statusCode(p);
        p = c;
        Y && g.trigger("ajax" + (ua ? "Success" : "Error"), [w, d, ua ? Ra : Ea]);
        l.fireWith(f, [w, n]);
        Y && (g.trigger("ajaxComplete", [w, d]), --h.active || h.event.trigger("ajaxStop"));
      }
    }
    "object" == typeof a && (b = a, a = c);
    b = b || {};
    var d = h.ajaxSetup({}, b), f = d.context || d, g = f !== d && (f.nodeType || f instanceof h) ? h(f) : h.event, m = h.Deferred(), l = h.Callbacks("once memory"), p = d.statusCode || {}, n = {}, q = {}, k, C, r, v, D, u = 0, I, w = {readyState:0, setRequestHeader:function(a, b) {
      if (!u) {
        var e = a.toLowerCase();
        a = q[e] = q[e] || a;
        n[a] = b;
      }
      return this;
    }, getAllResponseHeaders:function() {
      return 2 === u ? k : null;
    }, getResponseHeader:function(a) {
      var b;
      if (2 === u) {
        if (!C) {
          for (C = {}; b = ub.exec(k);) {
            C[b[1].toLowerCase()] = b[2];
          }
        }
        b = C[a.toLowerCase()];
      }
      return b === c ? null : b;
    }, overrideMimeType:function(a) {
      return u || (d.mimeType = a), this;
    }, abort:function(a) {
      return a = a || "abort", r && r.abort(a), e(0, a), this;
    }};
    m.promise(w);
    w.success = w.done;
    w.error = w.fail;
    w.complete = l.add;
    w.statusCode = function(a) {
      if (a) {
        if (2 > u) {
          for (b in a) {
            p[b] = [p[b], a[b]];
          }
        } else {
          var b = a[w.status];
          w.then(b, b);
        }
      }
      return this;
    };
    d.url = ((a || d.url) + "").replace(tb, "").replace(xb, Ga[1] + "//");
    d.dataTypes = h.trim(d.dataType || "*").toLowerCase().split(Za);
    null == d.crossDomain && (D = gb.exec(d.url.toLowerCase()), d.crossDomain = !(!D || D[1] == Ga[1] && D[2] == Ga[2] && (D[3] || ("http:" === D[1] ? 80 : 443)) == (Ga[3] || ("http:" === Ga[1] ? 80 : 443))));
    d.data && d.processData && "string" != typeof d.data && (d.data = h.param(d.data, d.traditional));
    F(Ta, d, b, w);
    if (2 === u) {
      return !1;
    }
    var Y = d.global;
    d.type = d.type.toUpperCase();
    d.hasContent = !wb.test(d.type);
    Y && 0 === h.active++ && h.event.trigger("ajaxStart");
    if (!d.hasContent) {
      d.data && (d.url += (fb.test(d.url) ? "&" : "?") + d.data, delete d.data);
      var B = d.url;
      !1 === d.cache && (a = h.now(), D = d.url.replace(Ab, "$1_=" + a), d.url = D + (D === d.url ? (fb.test(d.url) ? "&" : "?") + "_=" + a : ""));
    }
    (d.data && d.hasContent && !1 !== d.contentType || b.contentType) && w.setRequestHeader("Content-Type", d.contentType);
    d.ifModified && (B = B || d.url, h.lastModified[B] && w.setRequestHeader("If-Modified-Since", h.lastModified[B]), h.etag[B] && w.setRequestHeader("If-None-Match", h.etag[B]));
    w.setRequestHeader("Accept", d.dataTypes[0] && d.accepts[d.dataTypes[0]] ? d.accepts[d.dataTypes[0]] + ("*" !== d.dataTypes[0] ? ", */*; q=0.01" : "") : d.accepts["*"]);
    for (I in d.headers) {
      w.setRequestHeader(I, d.headers[I]);
    }
    if (!d.beforeSend || !1 !== d.beforeSend.call(f, w, d) && 2 !== u) {
      for (I in{success:1, error:1, complete:1}) {
        w[I](d[I]);
      }
      if (r = F(ib, d, b, w)) {
        w.readyState = 1;
        Y && g.trigger("ajaxSend", [w, d]);
        d.async && 0 < d.timeout && (v = setTimeout(function() {
          w.abort("timeout");
        }, d.timeout));
        try {
          u = 1, r.send(n, e);
        } catch (Ka) {
          if (!(2 > u)) {
            throw Ka;
          }
          e(-1, Ka);
        }
      } else {
        e(-1, "No Transport");
      }
      return w;
    }
    return w.abort(), !1;
  }, param:function(a, b) {
    var e = [], d = function(a, b) {
      b = h.isFunction(b) ? b() : b;
      e[e.length] = encodeURIComponent(a) + "=" + encodeURIComponent(b);
    };
    b === c && (b = h.ajaxSettings.traditional);
    if (h.isArray(a) || a.jquery && !h.isPlainObject(a)) {
      h.each(a, function() {
        d(this.name, this.value);
      });
    } else {
      for (var f in a) {
        O(f, a[f], b, d);
      }
    }
    return e.join("&").replace(sb, "+");
  }});
  h.extend({active:0, lastModified:{}, etag:{}});
  var Cb = h.now(), Pa = /(=)\?(&|$)|\?\?/i;
  h.ajaxSetup({jsonp:"callback", jsonpCallback:function() {
    return h.expando + "_" + Cb++;
  }});
  h.ajaxPrefilter("json jsonp", function(b, e, c) {
    e = "string" == typeof b.data && /^application\/x\-www\-form\-urlencoded/.test(b.contentType);
    if ("jsonp" === b.dataTypes[0] || !1 !== b.jsonp && (Pa.test(b.url) || e && Pa.test(b.data))) {
      var d, f = b.jsonpCallback = h.isFunction(b.jsonpCallback) ? b.jsonpCallback() : b.jsonpCallback, g = a[f], m = b.url, l = b.data, p = "$1" + f + "$2";
      return !1 !== b.jsonp && (m = m.replace(Pa, p), b.url === m && (e && (l = l.replace(Pa, p)), b.data === l && (m += (/\?/.test(m) ? "&" : "?") + b.jsonp + "=" + f))), b.url = m, b.data = l, a[f] = function(a) {
        d = [a];
      }, c.always(function() {
        a[f] = g;
        d && h.isFunction(g) && a[f](d[0]);
      }), b.converters["script json"] = function() {
        return d || h.error(f + " was not called"), d[0];
      }, b.dataTypes[0] = "json", "script";
    }
  });
  h.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"}, contents:{script:/javascript|ecmascript/}, converters:{"text script":function(a) {
    return h.globalEval(a), a;
  }}});
  h.ajaxPrefilter("script", function(a) {
    a.cache === c && (a.cache = !1);
    a.crossDomain && (a.type = "GET", a.global = !1);
  });
  h.ajaxTransport("script", function(a) {
    if (a.crossDomain) {
      var b, e = z.head || z.getElementsByTagName("head")[0] || z.documentElement;
      return {send:function(d, f) {
        b = z.createElement("script");
        b.async = "async";
        a.scriptCharset && (b.charset = a.scriptCharset);
        b.src = a.url;
        b.onload = b.onreadystatechange = function(a, d) {
          if (d || !b.readyState || /loaded|complete/.test(b.readyState)) {
            b.onload = b.onreadystatechange = null, e && b.parentNode && e.removeChild(b), b = c, d || f(200, "success");
          }
        };
        e.insertBefore(b, e.firstChild);
      }, abort:function() {
        b && b.onload(0, 1);
      }};
    }
  });
  var Xa = a.ActiveXObject ? function() {
    for (var a in Ha) {
      Ha[a](0, 1);
    }
  } : !1, Db = 0, Ha;
  h.ajaxSettings.xhr = a.ActiveXObject ? function() {
    var b;
    if (!(b = !this.isLocal && M())) {
      a: {
        try {
          b = new a.ActiveXObject("Microsoft.XMLHTTP");
          break a;
        } catch (B) {
        }
        b = void 0;
      }
    }
    return b;
  } : M;
  (function(a) {
    h.extend(h.support, {ajax:!!a, cors:!!a && "withCredentials" in a});
  })(h.ajaxSettings.xhr());
  h.support.ajax && h.ajaxTransport(function(b) {
    if (!b.crossDomain || h.support.cors) {
      var e;
      return {send:function(d, f) {
        var g = b.xhr(), m, l;
        b.username ? g.open(b.type, b.url, b.async, b.username, b.password) : g.open(b.type, b.url, b.async);
        if (b.xhrFields) {
          for (l in b.xhrFields) {
            g[l] = b.xhrFields[l];
          }
        }
        b.mimeType && g.overrideMimeType && g.overrideMimeType(b.mimeType);
        b.crossDomain || d["X-Requested-With"] || (d["X-Requested-With"] = "XMLHttpRequest");
        try {
          for (l in d) {
            g.setRequestHeader(l, d[l]);
          }
        } catch (Jb) {
        }
        g.send(b.hasContent && b.data || null);
        e = function(a, d) {
          var l;
          try {
            if (e && (d || 4 === g.readyState)) {
              if (e = c, m && (g.onreadystatechange = h.noop, Xa && delete Ha[m]), d) {
                4 !== g.readyState && g.abort();
              } else {
                var p = g.status;
                var n = g.getAllResponseHeaders();
                var q = {};
                (l = g.responseXML) && l.documentElement && (q.xml = l);
                try {
                  q.text = g.responseText;
                } catch (Va) {
                }
                try {
                  var k = g.statusText;
                } catch (Va) {
                  k = "";
                }
                p || !b.isLocal || b.crossDomain ? 1223 === p && (p = 204) : p = q.text ? 200 : 404;
              }
            }
          } catch (Va) {
            d || f(-1, Va);
          }
          q && f(p, k, q, n);
        };
        b.async && 4 !== g.readyState ? (m = ++Db, Xa && (Ha || (Ha = {}, h(a).unload(Xa)), Ha[m] = e), g.onreadystatechange = e) : e();
      }, abort:function() {
        e && e(0, 1);
      }};
    }
  });
  var Ua = {}, la, Aa, Eb = /^(?:toggle|show|hide)$/, Fb = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i, Qa, Ma = [["height", "marginTop", "marginBottom", "paddingTop", "paddingBottom"], ["width", "marginLeft", "marginRight", "paddingLeft", "paddingRight"], ["opacity"]], Ja;
  h.fn.extend({show:function(a, b, e) {
    var c;
    if (a || 0 === a) {
      return this.animate(Q("show", 3), a, b, e);
    }
    b = 0;
    for (e = this.length; b < e; b++) {
      a = this[b], a.style && (c = a.style.display, !h._data(a, "olddisplay") && "none" === c && (c = a.style.display = ""), ("" === c && "none" === h.css(a, "display") || !h.contains(a.ownerDocument.documentElement, a)) && h._data(a, "olddisplay", za(a.nodeName)));
    }
    for (b = 0; b < e; b++) {
      if (a = this[b], a.style && (c = a.style.display, "" === c || "none" === c)) {
        a.style.display = h._data(a, "olddisplay") || "";
      }
    }
    return this;
  }, hide:function(a, b, e) {
    if (a || 0 === a) {
      return this.animate(Q("hide", 3), a, b, e);
    }
    var c;
    b = 0;
    for (e = this.length; b < e; b++) {
      a = this[b], a.style && (c = h.css(a, "display"), "none" !== c && !h._data(a, "olddisplay") && h._data(a, "olddisplay", c));
    }
    for (b = 0; b < e; b++) {
      this[b].style && (this[b].style.display = "none");
    }
    return this;
  }, _toggle:h.fn.toggle, toggle:function(a, b, e) {
    var c = "boolean" == typeof a;
    return h.isFunction(a) && h.isFunction(b) ? this._toggle.apply(this, arguments) : null == a || c ? this.each(function() {
      var b = c ? a : h(this).is(":hidden");
      h(this)[b ? "show" : "hide"]();
    }) : this.animate(Q("toggle", 3), a, b, e), this;
  }, fadeTo:function(a, b, e, c) {
    return this.filter(":hidden").css("opacity", 0).show().end().animate({opacity:b}, a, e, c);
  }, animate:function(a, b, e, c) {
    function d() {
      !1 === f.queue && h._mark(this);
      var b = h.extend({}, f), e = 1 === this.nodeType, c = e && h(this).is(":hidden"), d, g, m, l, p, n, q;
      b.animatedProperties = {};
      for (g in a) {
        var k = h.camelCase(g);
        g !== k && (a[k] = a[g], delete a[g]);
        if ((d = h.cssHooks[k]) && "expand" in d) {
          var C = d.expand(a[k]);
          delete a[k];
          for (g in C) {
            g in a || (a[g] = C[g]);
          }
        }
      }
      for (k in a) {
        d = a[k];
        h.isArray(d) ? (b.animatedProperties[k] = d[1], d = a[k] = d[0]) : b.animatedProperties[k] = b.specialEasing && b.specialEasing[k] || b.easing || "swing";
        if ("hide" === d && c || "show" === d && !c) {
          return b.complete.call(this);
        }
        e && ("height" === k || "width" === k) && (b.overflow = [this.style.overflow, this.style.overflowX, this.style.overflowY], "inline" === h.css(this, "display") && "none" === h.css(this, "float") && (h.support.inlineBlockNeedsLayout && "inline" !== za(this.nodeName) ? this.style.zoom = 1 : this.style.display = "inline-block"));
      }
      null != b.overflow && (this.style.overflow = "hidden");
      for (g in a) {
        e = new h.fx(this, b, g), d = a[g], Eb.test(d) ? (q = h._data(this, "toggle" + g) || ("toggle" === d ? c ? "show" : "hide" : 0), q ? (h._data(this, "toggle" + g, "show" === q ? "hide" : "show"), e[q]()) : e[d]()) : (m = Fb.exec(d), l = e.cur(), m ? (p = parseFloat(m[2]), n = m[3] || (h.cssNumber[g] ? "" : "px"), "px" !== n && (h.style(this, g, (p || 1) + n), l *= (p || 1) / e.cur(), h.style(this, g, l + n)), m[1] && (p = ("-=" === m[1] ? -1 : 1) * p + l), e.custom(l, p, n)) : e.custom(l, 
        d, ""));
      }
      return !0;
    }
    var f = h.speed(b, e, c);
    return h.isEmptyObject(a) ? this.each(f.complete, [!1]) : (a = h.extend({}, a), !1 === f.queue ? this.each(d) : this.queue(f.queue, d));
  }, stop:function(a, b, e) {
    return "string" != typeof a && (e = b, b = a, a = c), b && !1 !== a && this.queue(a || "fx", []), this.each(function() {
      var b, c = !1, d = h.timers, f = h._data(this);
      e || h._unmark(!0, this);
      if (null == a) {
        for (b in f) {
          if (f[b] && f[b].stop && b.indexOf(".run") === b.length - 4) {
            var g = f[b];
            h.removeData(this, b, !0);
            g.stop(e);
          }
        }
      } else {
        f[b = a + ".run"] && f[b].stop && (f = f[b], h.removeData(this, b, !0), f.stop(e));
      }
      for (b = d.length; b--;) {
        d[b].elem !== this || null != a && d[b].queue !== a || (e ? d[b](!0) : d[b].saveState(), c = !0, d.splice(b, 1));
      }
      e && c || h.dequeue(this, a);
    });
  }});
  h.each({slideDown:Q("show", 1), slideUp:Q("hide", 1), slideToggle:Q("toggle", 1), fadeIn:{opacity:"show"}, fadeOut:{opacity:"hide"}, fadeToggle:{opacity:"toggle"}}, function(a, b) {
    h.fn[a] = function(a, e, c) {
      return this.animate(b, a, e, c);
    };
  });
  h.extend({speed:function(a, b, e) {
    var c = a && "object" == typeof a ? h.extend({}, a) : {complete:e || !e && b || h.isFunction(a) && a, duration:a, easing:e && b || b && !h.isFunction(b) && b};
    c.duration = h.fx.off ? 0 : "number" == typeof c.duration ? c.duration : c.duration in h.fx.speeds ? h.fx.speeds[c.duration] : h.fx.speeds._default;
    if (null == c.queue || !0 === c.queue) {
      c.queue = "fx";
    }
    return c.old = c.complete, c.complete = function(a) {
      h.isFunction(c.old) && c.old.call(this);
      c.queue ? h.dequeue(this, c.queue) : !1 !== a && h._unmark(this);
    }, c;
  }, easing:{linear:function(a) {
    return a;
  }, swing:function(a) {
    return -Math.cos(a * Math.PI) / 2 + .5;
  }}, timers:[], fx:function(a, b, e) {
    this.options = b;
    this.elem = a;
    this.prop = e;
    b.orig = b.orig || {};
  }});
  h.fx.prototype = {update:function() {
    this.options.step && this.options.step.call(this.elem, this.now, this);
    (h.fx.step[this.prop] || h.fx.step._default)(this);
  }, cur:function() {
    if (null == this.elem[this.prop] || this.elem.style && null != this.elem.style[this.prop]) {
      var a, b = h.css(this.elem, this.prop);
      return isNaN(a = parseFloat(b)) ? b && "auto" !== b ? b : 0 : a;
    }
    return this.elem[this.prop];
  }, custom:function(a, b, e) {
    function d(a) {
      return f.step(a);
    }
    var f = this, g = h.fx;
    this.startTime = Ja || (setTimeout(ra, 0), Ja = h.now());
    this.end = b;
    this.now = this.start = a;
    this.pos = this.state = 0;
    this.unit = e || this.unit || (h.cssNumber[this.prop] ? "" : "px");
    d.queue = this.options.queue;
    d.elem = this.elem;
    d.saveState = function() {
      h._data(f.elem, "fxshow" + f.prop) === c && (f.options.hide ? h._data(f.elem, "fxshow" + f.prop, f.start) : f.options.show && h._data(f.elem, "fxshow" + f.prop, f.end));
    };
    d() && h.timers.push(d) && !Qa && (Qa = setInterval(g.tick, g.interval));
  }, show:function() {
    var a = h._data(this.elem, "fxshow" + this.prop);
    this.options.orig[this.prop] = a || h.style(this.elem, this.prop);
    this.options.show = !0;
    a !== c ? this.custom(this.cur(), a) : this.custom("width" === this.prop || "height" === this.prop ? 1 : 0, this.cur());
    h(this.elem).show();
  }, hide:function() {
    this.options.orig[this.prop] = h._data(this.elem, "fxshow" + this.prop) || h.style(this.elem, this.prop);
    this.options.hide = !0;
    this.custom(this.cur(), 0);
  }, step:function(a) {
    var b, e, c = Ja || (setTimeout(ra, 0), Ja = h.now()), d = !0, f = this.elem, g = this.options;
    if (a || c >= g.duration + this.startTime) {
      this.now = this.end;
      this.pos = this.state = 1;
      this.update();
      g.animatedProperties[this.prop] = !0;
      for (b in g.animatedProperties) {
        !0 !== g.animatedProperties[b] && (d = !1);
      }
      if (d) {
        null != g.overflow && !h.support.shrinkWrapBlocks && h.each(["", "X", "Y"], function(a, b) {
          f.style["overflow" + b] = g.overflow[a];
        });
        g.hide && h(f).hide();
        if (g.hide || g.show) {
          for (b in g.animatedProperties) {
            h.style(f, b, g.orig[b]), h.removeData(f, "fxshow" + b, !0), h.removeData(f, "toggle" + b, !0);
          }
        }
        (a = g.complete) && (g.complete = !1, a.call(f));
      }
      return !1;
    }
    return Infinity == g.duration ? this.now = c : (e = c - this.startTime, this.state = e / g.duration, this.pos = h.easing[g.animatedProperties[this.prop]](this.state, e, 0, 1, g.duration), this.now = this.start + (this.end - this.start) * this.pos), this.update(), !0;
  }};
  h.extend(h.fx, {tick:function() {
    for (var a, b = h.timers, e = 0; e < b.length; e++) {
      a = b[e], !a() && b[e] === a && b.splice(e--, 1);
    }
    b.length || h.fx.stop();
  }, interval:13, stop:function() {
    clearInterval(Qa);
    Qa = null;
  }, speeds:{slow:600, fast:200, _default:400}, step:{opacity:function(a) {
    h.style(a.elem, "opacity", a.now);
  }, _default:function(a) {
    a.elem.style && null != a.elem.style[a.prop] ? a.elem.style[a.prop] = a.now + a.unit : a.elem[a.prop] = a.now;
  }}});
  h.each(Ma.concat.apply([], Ma), function(a, b) {
    b.indexOf("margin") && (h.fx.step[b] = function(a) {
      h.style(a.elem, b, Math.max(0, a.now) + a.unit);
    });
  });
  h.expr && h.expr.filters && (h.expr.filters.animated = function(a) {
    return h.grep(h.timers, function(b) {
      return a === b.elem;
    }).length;
  });
  var Ya, Gb = /^t(?:able|d|h)$/i, jb = /^(?:body|html)$/i;
  "getBoundingClientRect" in z.documentElement ? Ya = function(a, b, e, c) {
    try {
      c = a.getBoundingClientRect();
    } catch (Hb) {
    }
    if (!c || !h.contains(e, a)) {
      return c ? {top:c.top, left:c.left} : {top:0, left:0};
    }
    a = b.body;
    b = xa(b);
    return {top:c.top + (b.pageYOffset || h.support.boxModel && e.scrollTop || a.scrollTop) - (e.clientTop || a.clientTop || 0), left:c.left + (b.pageXOffset || h.support.boxModel && e.scrollLeft || a.scrollLeft) - (e.clientLeft || a.clientLeft || 0)};
  } : Ya = function(a, b, e) {
    var c = a.offsetParent, d = b.body;
    var f = (b = b.defaultView) ? b.getComputedStyle(a, null) : a.currentStyle;
    for (var g = a.offsetTop, m = a.offsetLeft; (a = a.parentNode) && a !== d && a !== e && (!h.support.fixedPosition || "fixed" !== f.position);) {
      f = b ? b.getComputedStyle(a, null) : a.currentStyle, g -= a.scrollTop, m -= a.scrollLeft, a === c && (g += a.offsetTop, m += a.offsetLeft, h.support.doesNotAddBorder && (!h.support.doesAddBorderForTableAndCells || !Gb.test(a.nodeName)) && (g += parseFloat(f.borderTopWidth) || 0, m += parseFloat(f.borderLeftWidth) || 0), c = a.offsetParent), h.support.subtractsBorderForOverflowNotVisible && "visible" !== f.overflow && (g += parseFloat(f.borderTopWidth) || 0, m += parseFloat(f.borderLeftWidth) || 
      0);
    }
    if ("relative" === f.position || "static" === f.position) {
      g += d.offsetTop, m += d.offsetLeft;
    }
    return h.support.fixedPosition && "fixed" === f.position && (g += Math.max(e.scrollTop, d.scrollTop), m += Math.max(e.scrollLeft, d.scrollLeft)), {top:g, left:m};
  };
  h.fn.offset = function(a) {
    if (arguments.length) {
      return a === c ? this : this.each(function(b) {
        h.offset.setOffset(this, a, b);
      });
    }
    var b = this[0], e = b && b.ownerDocument;
    return e ? b === e.body ? h.offset.bodyOffset(b) : Ya(b, e, e.documentElement) : null;
  };
  h.offset = {bodyOffset:function(a) {
    var b = a.offsetTop, e = a.offsetLeft;
    return h.support.doesNotIncludeMarginInBodyOffset && (b += parseFloat(h.css(a, "marginTop")) || 0, e += parseFloat(h.css(a, "marginLeft")) || 0), {top:b, left:e};
  }, setOffset:function(a, b, e) {
    var c = h.css(a, "position");
    "static" === c && (a.style.position = "relative");
    var d = h(a), f = d.offset(), g = h.css(a, "top"), m = h.css(a, "left"), l = {}, p = {}, n, q;
    ("absolute" === c || "fixed" === c) && -1 < h.inArray("auto", [g, m]) ? (p = d.position(), n = p.top, q = p.left) : (n = parseFloat(g) || 0, q = parseFloat(m) || 0);
    h.isFunction(b) && (b = b.call(a, e, f));
    null != b.top && (l.top = b.top - f.top + n);
    null != b.left && (l.left = b.left - f.left + q);
    "using" in b ? b.using.call(a, l) : d.css(l);
  }};
  h.fn.extend({position:function() {
    if (!this[0]) {
      return null;
    }
    var a = this[0], b = this.offsetParent(), e = this.offset(), c = jb.test(b[0].nodeName) ? {top:0, left:0} : b.offset();
    return e.top -= parseFloat(h.css(a, "marginTop")) || 0, e.left -= parseFloat(h.css(a, "marginLeft")) || 0, c.top += parseFloat(h.css(b[0], "borderTopWidth")) || 0, c.left += parseFloat(h.css(b[0], "borderLeftWidth")) || 0, {top:e.top - c.top, left:e.left - c.left};
  }, offsetParent:function() {
    return this.map(function() {
      for (var a = this.offsetParent || z.body; a && !jb.test(a.nodeName) && "static" === h.css(a, "position");) {
        a = a.offsetParent;
      }
      return a;
    });
  }});
  h.each({scrollLeft:"pageXOffset", scrollTop:"pageYOffset"}, function(a, b) {
    var e = /Y/.test(b);
    h.fn[a] = function(d) {
      return h.access(this, function(a, d, f) {
        var g = xa(a);
        if (f === c) {
          return g ? b in g ? g[b] : h.support.boxModel && g.document.documentElement[d] || g.document.body[d] : a[d];
        }
        g ? g.scrollTo(e ? h(g).scrollLeft() : f, e ? f : h(g).scrollTop()) : a[d] = f;
      }, a, d, arguments.length, null);
    };
  });
  h.each({Height:"height", Width:"width"}, function(a, b) {
    var e = "client" + a, d = "scroll" + a, f = "offset" + a;
    h.fn["inner" + a] = function() {
      var a = this[0];
      return a ? a.style ? parseFloat(h.css(a, b, "padding")) : this[b]() : null;
    };
    h.fn["outer" + a] = function(a) {
      var e = this[0];
      return e ? e.style ? parseFloat(h.css(e, b, a ? "margin" : "border")) : this[b]() : null;
    };
    h.fn[b] = function(a) {
      return h.access(this, function(a, b, g) {
        var m, l, p, n;
        if (h.isWindow(a)) {
          return m = a.document, l = m.documentElement[e], h.support.boxModel && l || m.body && m.body[e] || l;
        }
        if (9 === a.nodeType) {
          return m = a.documentElement, m[e] >= m[d] ? m[e] : Math.max(a.body[d], m[d], a.body[f], m[f]);
        }
        if (g === c) {
          return p = h.css(a, b), n = parseFloat(p), h.isNumeric(n) ? n : p;
        }
        h(a).css(b, g);
      }, b, a, arguments.length, null);
    };
  });
  a.jQuery = a.$ = h;
  "function" == typeof define && define.amd && define.amd.jQuery && define("jquery", [], function() {
    return h;
  });
})(window);
"use strict";
(function(a) {
  function c(a) {
    if (!a) {
      return !1;
    }
    this.x = String(a).replace(/middle/i, "center").match(/left|right|center/i)[0].toLowerCase();
    this.y = String(a).replace(/middle/i, "center").match(/top|bottom|center/i)[0].toLowerCase();
    this.offset = {left:0, top:0};
    this.precedance = -1 < a.charAt(0).search(/^(t|b)/) ? "y" : "x";
    this.string = function() {
      return "y" === this.precedance ? this.y + this.x : this.x + this.y;
    };
  }
  function d(a, b, e) {
    b = {bottomright:[[0, 0], [b, e], [b, 0]], bottomleft:[[0, 0], [b, 0], [0, e]], topright:[[0, e], [b, 0], [b, e]], topleft:[[0, 0], [0, e], [b, e]], topcenter:[[0, e], [b / 2, 0], [b, e]], bottomcenter:[[0, 0], [b, 0], [b / 2, e]], rightcenter:[[0, 0], [b, e / 2], [0, e]], leftcenter:[[b, 0], [b, e], [0, e / 2]]};
    return b.lefttop = b.bottomright, b.righttop = b.bottomleft, b.leftbottom = b.topright, b.rightbottom = b.topleft, b[a];
  }
  function b(b) {
    var e;
    return a("<canvas />").get(0).getContext ? e = {topLeft:[b, b], topRight:[0, b], bottomLeft:[b, 0], bottomRight:[0, 0]} : a.browser.msie && (e = {topLeft:[-90, 90, 0], topRight:[-90, 90, -b], bottomLeft:[90, 270, 0], bottomRight:[90, 270, -b]}), e;
  }
  function e(b, e) {
    var c;
    b = a.extend(!0, {}, b);
    for (c in b) {
      !0 === e && /(tip|classes)/i.test(c) ? delete b[c] : !e && /(width|border|tip|title|classes|user)/i.test(c) && delete b[c];
    }
    return b;
  }
  function f(a) {
    return "object" != typeof a.tip && (a.tip = {corner:a.tip}), "object" != typeof a.tip.size && (a.tip.size = {width:a.tip.size, height:a.tip.size}), "object" != typeof a.border && (a.border = {width:a.border}), "object" != typeof a.width && (a.width = {value:a.width}), "string" == typeof a.width.max && (a.width.max = parseInt(a.width.max.replace(/([0-9]+)/i, "$1"), 10)), "string" == typeof a.width.min && (a.width.min = parseInt(a.width.min.replace(/([0-9]+)/i, "$1"), 10)), "number" == typeof a.tip.size.x && 
    (a.tip.size.width = a.tip.size.x, delete a.tip.size.x), "number" == typeof a.tip.size.y && (a.tip.size.height = a.tip.size.y, delete a.tip.size.y), a;
  }
  function g() {
    var b, e, c;
    var d = [!0, {}];
    for (b = 0; b < arguments.length; b++) {
      d.push(arguments[b]);
    }
    for (b = [a.extend.apply(a, d)]; "string" == typeof b[0].name;) {
      b.unshift(f(a.fn.qtip.styles[b[0].name]));
    }
    return b.unshift(!0, {classes:{tooltip:"qtip-" + (arguments[0].name || "defaults")}}, a.fn.qtip.styles.defaults), e = a.extend.apply(a, b), c = a.browser.msie ? 1 : 0, e.tip.size.width += c, e.tip.size.height += c, 0 < e.tip.size.width % 2 && (e.tip.size.width += 1), 0 < e.tip.size.height % 2 && (e.tip.size.height += 1), !0 === e.tip.corner && ("center" === this.options.position.corner.tooltip && "center" === this.options.position.corner.target ? e.tip.corner = !1 : e.tip.corner = this.options.position.corner.tooltip), 
    e;
  }
  function l(a, b, e, c) {
    a = a.get(0).getContext("2d");
    a.fillStyle = c;
    a.beginPath();
    a.arc(b[0], b[1], e, 0, 2 * Math.PI, !1);
    a.fill();
  }
  function k() {
    var e, c;
    var d = this;
    d.elements.wrapper.find(".qtip-borderBottom, .qtip-borderTop").remove();
    var f = d.options.style.border.width;
    var g = d.options.style.border.radius;
    var m = d.options.style.border.color || d.options.style.tip.color;
    var p = b(g);
    var n = {};
    for (q in p) {
      n[q] = '<div rel="' + q + '" style="' + (/Left/.test(q) ? "left" : "right") + ":0; position:absolute; height:" + g + "px; width:" + g + 'px; overflow:hidden; line-height:0.1px; font-size:1px">', a("<canvas />").get(0).getContext ? n[q] += '<canvas height="' + g + '" width="' + g + '" style="vertical-align: top"></canvas>' : a.browser.msie && (e = 2 * g + 3, n[q] += '<v:arc stroked="false" fillcolor="' + m + '" startangle="' + p[q][0] + '" endangle="' + p[q][1] + '" style="width:' + e + "px; height:" + 
      e + "px; margin-top:" + (/bottom/.test(q) ? -2 : -1) + "px; margin-left:" + (/Right/.test(q) ? p[q][2] - 3.5 : -1) + 'px; vertical-align:top; display:inline-block; behavior:url(#default#VML)"></v:arc>'), n[q] += "</div>";
    }
    var q = d.getDimensions().width - 2 * Math.max(f, g);
    q = '<div class="qtip-betweenCorners" style="height:' + g + "px; width:" + q + "px; overflow:hidden; background-color:" + m + '; line-height:0.1px; font-size:1px;">';
    d.elements.wrapper.prepend('<div class="qtip-borderTop" dir="ltr" style="height:' + g + "px; margin-left:" + g + 'px; line-height:0.1px; font-size:1px; padding:0;">' + n.topLeft + n.topRight + q);
    d.elements.wrapper.append('<div class="qtip-borderBottom" dir="ltr" style="height:' + g + "px; margin-left:" + g + 'px; line-height:0.1px; font-size:1px; padding:0;">' + n.bottomLeft + n.bottomRight + q);
    a("<canvas />").get(0).getContext ? d.elements.wrapper.find("canvas").each(function() {
      c = p[a(this).parent("[rel]:first").attr("rel")];
      l.call(d, a(this), c, g, m);
    }) : a.browser.msie && d.elements.tooltip.append('<v:image style="behavior:url(#default#VML);"></v:image>');
    d.elements.contentWrapper.css({border:"0px solid " + m, borderWidth:Math.max(f - g, 0) + "px " + Math.max(g, g + (f - g)) + "px"});
  }
  function n(a, b, e) {
    a = a.get(0).getContext("2d");
    a.fillStyle = e;
    a.beginPath();
    a.moveTo(b[0][0], b[0][1]);
    a.lineTo(b[1][0], b[1][1]);
    a.lineTo(b[2][0], b[2][1]);
    a.fill();
  }
  function q(b) {
    var e, d;
    if (!1 !== this.options.style.tip.corner && this.elements.tip) {
      b || (b = new c(this.elements.tip.attr("rel")));
      var f = e = a.browser.msie ? 1 : 0;
      this.elements.tip.css(b[b.precedance], 0);
      "y" === b.precedance ? (a.browser.msie && (6 === parseInt(a.browser.version.charAt(0), 10) ? e = "top" === b.y ? -3 : 1 : e = "top" === b.y ? 1 : 2), "center" === b.x ? this.elements.tip.css({left:"50%", marginLeft:-(this.options.style.tip.size.width / 2)}) : "left" === b.x ? this.elements.tip.css({left:this.options.style.border.radius - f}) : this.elements.tip.css({right:this.options.style.border.radius + f}), "top" === b.y ? this.elements.tip.css({top:-e}) : this.elements.tip.css({bottom:e})) : 
      (a.browser.msie && (e = 6 === parseInt(a.browser.version.charAt(0), 10) ? 1 : "left" === b.x ? 1 : 2), "center" === b.y ? this.elements.tip.css({top:"50%", marginTop:-(this.options.style.tip.size.height / 2)}) : "top" === b.y ? this.elements.tip.css({top:this.options.style.border.radius - f}) : this.elements.tip.css({bottom:this.options.style.border.radius + f}), "left" === b.x ? this.elements.tip.css({left:-e}) : this.elements.tip.css({right:e}));
      f = "padding-" + b[b.precedance];
      b = this.options.style.tip.size["x" === b.precedance ? "width" : "height"];
      this.elements.tooltip.css("padding", 0).css(f, b);
      a.browser.msie && 6 === parseInt(a.browser.version.charAt(0), 6) && (d = parseInt(this.elements.tip.css("margin-top"), 10) || 0, d += parseInt(this.elements.content.css("margin-top"), 10) || 0, this.elements.tip.css({marginTop:d}));
    }
  }
  function u(b) {
    var e, f, g;
    null !== this.elements.tip && this.elements.tip.remove();
    var m = this.options.style.tip.color || this.options.style.border.color;
    if (!1 !== this.options.style.tip.corner) {
      b || (b = new c(this.options.style.tip.corner));
      var l = d(b.string(), this.options.style.tip.size.width, this.options.style.tip.size.height);
      this.elements.tip = '<div class="' + this.options.style.classes.tip + '" dir="ltr" rel="' + b.string() + '" style="position:absolute; height:' + this.options.style.tip.size.height + "px; width:" + this.options.style.tip.size.width + 'px; margin:0 auto; line-height:0.1px; font-size:1px;"></div>';
      this.elements.tooltip.prepend(this.elements.tip);
      a("<canvas />").get(0).getContext ? g = '<canvas height="' + this.options.style.tip.size.height + '" width="' + this.options.style.tip.size.width + '"></canvas>' : a.browser.msie && (e = this.options.style.tip.size.width + "," + this.options.style.tip.size.height, f = "m" + l[0][0] + "," + l[0][1], f += " l" + l[1][0] + "," + l[1][1], f += " " + l[2][0] + "," + l[2][1], f += " xe", g = '<v:shape fillcolor="' + m + '" stroked="false" filled="true" path="' + f + '" coordsize="' + e + '" style="width:' + 
      this.options.style.tip.size.width + "px; height:" + this.options.style.tip.size.height + "px; line-height:0.1px; display:inline-block; behavior:url(#default#VML); vertical-align:" + ("top" === b.y ? "bottom" : "top") + '"></v:shape>', g += '<v:image style="behavior:url(#default#VML);"></v:image>', this.elements.contentWrapper.css("position", "relative"));
      this.elements.tip = this.elements.tooltip.find("." + this.options.style.classes.tip).eq(0);
      this.elements.tip.html(g);
      a("<canvas  />").get(0).getContext && n.call(this, this.elements.tip.find("canvas:first"), l, m);
      "top" === b.y && a.browser.msie && 6 === parseInt(a.browser.version.charAt(0), 10) && this.elements.tip.css({marginTop:-4});
      q.call(this, b);
    }
  }
  function m() {
    var b = this;
    null !== b.elements.title && b.elements.title.remove();
    b.elements.tooltip.attr("aria-labelledby", "qtip-" + b.id + "-title");
    b.elements.title = a('<div id="qtip-' + b.id + '-title" class="' + b.options.style.classes.title + '"></div>').css(e(b.options.style.title, !0)).css({zoom:a.browser.msie ? 1 : 0}).prependTo(b.elements.contentWrapper);
    b.options.content.title.text && b.updateTitle.call(b, b.options.content.title.text);
    !1 !== b.options.content.title.button && "string" == typeof b.options.content.title.button && (b.elements.button = a('<a class="' + b.options.style.classes.button + '" role="button" style="float:right; position: relative"></a>').css(e(b.options.style.button, !0)).html(b.options.content.title.button).prependTo(b.elements.title).click(function(a) {
      b.status.disabled || b.hide(a);
    }));
  }
  function p() {
    function b(b) {
      !0 !== d.status.disabled && (clearTimeout(d.timers.inactive), d.timers.inactive = setTimeout(function() {
        a(m).each(function() {
          g.unbind(this + ".qtip-inactive");
          d.elements.content.unbind(this + ".qtip-inactive");
        });
        d.hide(b);
      }, d.options.hide.delay));
    }
    function e(e) {
      !0 !== d.status.disabled && ("inactive" === d.options.hide.when.event && (a(m).each(function() {
        g.bind(this + ".qtip-inactive", b);
        d.elements.content.bind(this + ".qtip-inactive", b);
      }), b()), clearTimeout(d.timers.show), clearTimeout(d.timers.hide), 0 < d.options.show.delay ? d.timers.show = setTimeout(function() {
        d.show(e);
      }, d.options.show.delay) : d.show(e));
    }
    function c(b) {
      if (!0 !== d.status.disabled) {
        if (!0 === d.options.hide.fixed && /mouse(out|leave)/i.test(d.options.hide.when.event) && 0 < a(b.relatedTarget).parents('div.qtip[id^="qtip"]').length) {
          return b.stopPropagation(), b.preventDefault(), clearTimeout(d.timers.hide), !1;
        }
        clearTimeout(d.timers.show);
        clearTimeout(d.timers.hide);
        d.elements.tooltip.stop(!0, !0);
        d.timers.hide = setTimeout(function() {
          d.hide(b);
        }, d.options.hide.delay);
      }
    }
    var d = this;
    var f = d.options.show.when.target;
    var g = d.options.hide.when.target;
    d.options.hide.fixed && (g = g.add(d.elements.tooltip));
    var m = "click dblclick mousedown mouseup mousemove mouseout mouseenter mouseleave mouseover".split(" ");
    !0 === d.options.hide.fixed && d.elements.tooltip.bind("mouseover.qtip", function() {
      !0 !== d.status.disabled && clearTimeout(d.timers.hide);
    });
    1 === d.options.show.when.target.add(d.options.hide.when.target).length && d.options.show.when.event === d.options.hide.when.event && "inactive" !== d.options.hide.when.event || "unfocus" === d.options.hide.when.event ? (d.cache.toggle = 0, f.bind(d.options.show.when.event + ".qtip", function(a) {
      0 === d.cache.toggle ? e(a) : c(a);
    })) : (f.bind(d.options.show.when.event + ".qtip", e), "inactive" !== d.options.hide.when.event && g.bind(d.options.hide.when.event + ".qtip", c));
    /(fixed|absolute)/.test(d.options.position.type) && d.elements.tooltip.bind("mouseover.qtip", d.focus);
    "mouse" === d.options.position.target && "static" !== d.options.position.type && f.bind("mousemove.qtip", function(a) {
      d.cache.mouse = {x:a.pageX, y:a.pageY};
      !1 === d.status.disabled && !0 === d.options.position.adjust.mouse && "static" !== d.options.position.type && "none" !== d.elements.tooltip.css("display") && d.updatePosition(a);
    });
  }
  function v() {
    var a = this.getDimensions();
    this.elements.bgiframe = this.elements.wrapper.prepend('<iframe class="qtip-bgiframe" frameborder="0" tabindex="-1" src="javascript:false" style="display:block; position:absolute; z-index:-1; filter:alpha(opacity=\'0\'); border: 1px solid red; height:' + a.height + "px; width:" + a.width + 'px" />').children(".qtip-bgiframe:first");
  }
  function w() {
    var b, c, d, f;
    this.beforeRender.call(this);
    this.status.rendered = 2;
    this.elements.tooltip = '<div qtip="' + this.id + '" id="qtip-' + this.id + '" role="tooltip" aria-describedby="qtip-' + this.id + '-content" class="qtip ' + (this.options.style.classes.tooltip || this.options.style) + '" style="display:none; -moz-border-radius:0; -webkit-border-radius:0; border-radius:0; position:' + this.options.position.type + ';">   <div class="qtip-wrapper" style="position:relative; overflow:hidden; text-align:left;">     <div class="qtip-contentWrapper" style="overflow:hidden;">        <div id="qtip-' + 
    this.id + '-content" class="qtip-content ' + this.options.style.classes.content + '"></div> </div></div></div>';
    this.elements.tooltip = a(this.elements.tooltip);
    this.elements.tooltip.appendTo(this.options.position.container);
    this.elements.tooltip.data("qtip", {current:0, interfaces:[this]});
    this.elements.wrapper = this.elements.tooltip.children("div:first");
    this.elements.contentWrapper = this.elements.wrapper.children("div:first");
    this.elements.content = this.elements.contentWrapper.children("div:first").css(e(this.options.style));
    a.browser.msie && this.elements.wrapper.add(this.elements.content).css({zoom:1});
    "unfocus" === this.options.hide.when.event && this.elements.tooltip.attr("unfocus", !0);
    "number" == typeof this.options.style.width.value && this.updateWidth();
    a("<canvas />").get(0).getContext || a.browser.msie ? (0 < this.options.style.border.radius ? k.call(this) : this.elements.contentWrapper.css({border:this.options.style.border.width + "px solid " + this.options.style.border.color}), !1 !== this.options.style.tip.corner && u.call(this)) : (this.elements.contentWrapper.css({border:this.options.style.border.width + "px solid " + this.options.style.border.color}), this.options.style.border.radius = 0, this.options.style.tip.corner = !1);
    "string" == typeof this.options.content.text && 0 < this.options.content.text.length || this.options.content.text.jquery && 0 < this.options.content.text.length ? b = this.options.content.text : 0 < this.elements.target.attr("title").length ? (this.cache.attr = ["title", this.elements.target.attr("title")], b = this.cache.attr[1].replace(/\n/gi, "<br />")) : 0 < this.elements.target.attr("alt").length ? (this.cache.attr = ["alt", this.elements.target.attr("alt")], b = this.cache.attr[1].replace(/\n/gi, 
    "<br />")) : b = " ";
    !1 !== this.options.content.title.text && m.call(this);
    this.updateContent(b, !1);
    p.call(this);
    !0 === this.options.show.ready && this.show();
    !1 !== this.options.content.url && (c = this.options.content.url, d = this.options.content.data, f = this.options.content.method || "get", this.loadContent(c, d, f));
    this.status.rendered = !0;
    this.onRender.call(this);
  }
  function A(f, m, p) {
    var k = this;
    k.id = p;
    k.options = m;
    k.status = {animated:!1, rendered:!1, disabled:!1, focused:!1};
    k.elements = {target:f.addClass(k.options.style.classes.target), tooltip:null, wrapper:null, content:null, contentWrapper:null, title:null, button:null, tip:null, bgiframe:null};
    k.cache = {attr:null, mouse:{}, toggle:0, overflow:{left:!1, top:!1}};
    k.timers = {};
    a.extend(k, k.options.api, {show:function(b) {
      function e() {
        k.elements.tooltip.attr("aria-hidden", !0);
        "static" !== k.options.position.type && k.focus();
        k.onShow.call(k, b);
        a.browser.msie && k.elements.tooltip.get(0).style.removeAttribute("filter");
        k.elements.tooltip.css({opacity:""});
      }
      var c;
      if (!k.status.rendered) {
        return !1;
      }
      if ("none" !== k.elements.tooltip.css("display")) {
        return k;
      }
      k.cache.attr && k.elements.target.removeAttr(k.cache.attr[0]);
      k.elements.tooltip.stop(!0, !1);
      if (!1 === k.beforeShow.call(k, b)) {
        return k;
      }
      k.cache.toggle = 1;
      "static" !== k.options.position.type && k.updatePosition(b, 0 < k.options.show.effect.length && 2 !== k.rendered);
      "object" == typeof k.options.show.solo ? c = a(k.options.show.solo) : !0 === k.options.show.solo && (c = a("div.qtip").not(k.elements.tooltip));
      c && c.each(function() {
        !0 === a(this).qtip("api").status.rendered && a(this).qtip("api").hide();
      });
      if ("function" == typeof k.options.show.effect.type) {
        k.options.show.effect.type.call(k.elements.tooltip, k.options.show.effect.length), k.elements.tooltip.queue(function() {
          e();
          a(this).dequeue();
        });
      } else {
        switch(k.options.show.effect.type.toLowerCase()) {
          case "fade":
            k.elements.tooltip.fadeIn(k.options.show.effect.length, e);
            break;
          case "slide":
            k.elements.tooltip.slideDown(k.options.show.effect.length, function() {
              e();
              "static" !== k.options.position.type && k.updatePosition(b, !0);
            });
            break;
          case "grow":
            k.elements.tooltip.show(k.options.show.effect.length, e);
            break;
          default:
            k.elements.tooltip.show(null, e);
        }
        k.elements.tooltip.addClass(k.options.style.classes.active);
      }
      return k;
    }, hide:function(b) {
      function e() {
        k.elements.tooltip.attr("aria-hidden", !0);
        k.elements.tooltip.css({opacity:""});
        k.onHide.call(k, b);
      }
      if (!k.status.rendered) {
        return !1;
      }
      if ("none" === k.elements.tooltip.css("display")) {
        return k;
      }
      k.cache.attr && k.elements.target.attr(k.cache.attr[0], k.cache.attr[1]);
      clearTimeout(k.timers.show);
      k.elements.tooltip.stop(!0, !1);
      if (!1 === k.beforeHide.call(k, b)) {
        return k;
      }
      k.cache.toggle = 0;
      if ("function" == typeof k.options.hide.effect.type) {
        k.options.hide.effect.type.call(k.elements.tooltip, k.options.hide.effect.length), k.elements.tooltip.queue(function() {
          e();
          a(this).dequeue();
        });
      } else {
        switch(k.options.hide.effect.type.toLowerCase()) {
          case "fade":
            k.elements.tooltip.fadeOut(k.options.hide.effect.length, e);
            break;
          case "slide":
            k.elements.tooltip.slideUp(k.options.hide.effect.length, e);
            break;
          case "grow":
            k.elements.tooltip.hide(k.options.hide.effect.length, e);
            break;
          default:
            k.elements.tooltip.hide(null, e);
        }
        k.elements.tooltip.removeClass(k.options.style.classes.active);
      }
      return k;
    }, toggle:function(a, b) {
      b = /boolean|number/.test(typeof b) ? b : !k.elements.tooltip.is(":visible");
      return k[b ? "show" : "hide"](a), k;
    }, updatePosition:function(b, e) {
      if (!k.status.rendered) {
        return !1;
      }
      var d = m.position, f = a(d.target), g = k.elements.tooltip.outerWidth(), l = k.elements.tooltip.outerHeight(), p, n = d.corner.tooltip, q = d.corner.target, h, w, D = {left:function() {
        var b = a(window).scrollLeft(), e = a(window).width() + a(window).scrollLeft(), c = "center" === n.x ? g / 2 : g, f = "center" === n.x ? A / 2 : A, m = ("center" === n.x ? 1 : 2) * k.options.style.border.radius, h = -2 * d.adjust.x, l = x.left + g;
        if (l > e) {
          var p = h - c - f + m;
          if (x.left + p > b || b - (x.left + p) < l - e) {
            return {adjust:p, tip:"right"};
          }
        }
        return x.left < b && (p = h + c + f - m, l + p < e || l + p - e < b - x.left) ? {adjust:p, tip:"left"} : {adjust:0, tip:n.x};
      }, top:function() {
        var b = a(window).scrollTop(), e = a(window).height() + a(window).scrollTop(), c = "center" === n.y ? l / 2 : l, f = "center" === n.y ? p / 2 : p, g = ("center" === n.y ? 1 : 2) * k.options.style.border.radius, m = -2 * d.adjust.y, h = x.top + l;
        if (h > e) {
          var q = m - c - f + g;
          if (x.top + q > b || b - (x.top + q) < h - e) {
            return {adjust:q, tip:"bottom"};
          }
        }
        return x.top < b && (q = m + c + f - g, h + q < e || h + q - e < b - x.top) ? {adjust:q, tip:"top"} : {adjust:0, tip:n.y};
      }};
      if (b && "mouse" === m.position.target) {
        q = {x:"left", y:"top"};
        var A = p = 0;
        var x = {top:b.pageY, left:b.pageX};
      } else {
        if (f[0] === document) {
          A = f.width(), p = f.height(), x = {top:0, left:0};
        } else {
          if (f[0] === window) {
            A = f.width(), p = f.height(), x = {top:f.scrollTop(), left:f.scrollLeft()};
          } else {
            if (f.is("area")) {
              var C = k.options.position.target.attr("coords").split(",");
              for (w = 0; w < C.length; w++) {
                C[w] = parseInt(C[w], 10);
              }
              w = k.options.position.target.parent("map").attr("name");
              var F = a('img[usemap="#' + w + '"]:first').offset();
              f.position = {left:Math.floor(F.left + C[0]), top:Math.floor(F.top + C[1])};
              switch(k.options.position.target.attr("shape").toLowerCase()) {
                case "rect":
                  A = Math.ceil(Math.abs(C[2] - C[0]));
                  p = Math.ceil(Math.abs(C[3] - C[1]));
                  break;
                case "circle":
                  A = C[2] + 1;
                  p = C[2] + 1;
                  break;
                case "poly":
                  A = C[0];
                  p = C[1];
                  for (w = 0; w < C.length; w++) {
                    0 === w % 2 ? (C[w] > A && (A = C[w]), C[w] < C[0] && (x.left = Math.floor(F.left + C[w]))) : (C[w] > p && (p = C[w]), C[w] < C[1] && (x.top = Math.floor(F.top + C[w])));
                  }
                  A -= x.left - F.left;
                  p -= x.top - F.top;
              }
              A -= 2;
              p -= 2;
            } else {
              A = f.outerWidth(), p = f.outerHeight(), x = f.offset();
            }
          }
        }
        x.left += "right" === q.x ? A : "center" === q.x ? A / 2 : 0;
        x.top += "bottom" === q.y ? p : "center" === q.y ? p / 2 : 0;
      }
      return x.left += d.adjust.x + ("right" === n.x ? -g : "center" === n.x ? -g / 2 : 0), x.top += d.adjust.y + ("bottom" === n.y ? -l : "center" === n.y ? -l / 2 : 0), 0 < k.options.style.border.radius && ("left" === n.x ? x.left -= k.options.style.border.radius : "right" === n.x && (x.left += k.options.style.border.radius), "top" === n.y ? x.top -= k.options.style.border.radius : "bottom" === n.y && (x.top += k.options.style.border.radius)), d.adjust.screen && function() {
        var a = 0, b = 0, e = D.left(), d = D.top(), f = new c(m.style.tip.corner);
        k.elements.tip && f && (0 !== d.adjust && (x.top += d.adjust, f.y = b = d.tip), 0 !== e.adjust && (x.left += e.adjust, f.x = a = e.tip), k.cache.overflow = {left:!1 === a, top:!1 === b}, k.elements.tip.attr("rel") !== f.string() && u.call(k, f));
      }(), !k.elements.bgiframe && a.browser.msie && 6 === parseInt(a.browser.version.charAt(0), 10) && v.call(k), h = k.beforePositionUpdate.call(k, b), !1 === h ? k : ("mouse" !== m.position.target && !0 === e ? (k.status.animated = !0, k.elements.tooltip.stop().animate(x, 200, "swing", function() {
        k.status.animated = !1;
      })) : k.elements.tooltip.css(x), k.onPositionUpdate.call(k, b), k);
    }, updateWidth:function(b) {
      if (!k.status.rendered || b && "number" != typeof b) {
        return !1;
      }
      var e = k.elements.contentWrapper.siblings().add(k.elements.tip).add(k.elements.button), c = k.elements.wrapper.add(k.elements.contentWrapper.children()), d = k.elements.tooltip, f = k.options.style.width.max, g = k.options.style.width.min;
      return b || ("number" == typeof k.options.style.width.value ? b = k.options.style.width.value : (k.elements.tooltip.css({width:"auto"}), e.hide(), d.width(b), a.browser.msie && c.css({zoom:""}), b = k.getDimensions().width, k.options.style.width.value || (b = Math.min(Math.max(b, g), f)))), b % 2 && (b += 1), k.elements.tooltip.width(b), e.show(), k.options.style.border.radius && k.elements.tooltip.find(".qtip-betweenCorners").each(function(e) {
        a(this).width(b - 2 * k.options.style.border.radius);
      }), a.browser.msie && (c.css({zoom:1}), k.elements.wrapper.width(b), k.elements.bgiframe && k.elements.bgiframe.width(b).height(k.getDimensions.height)), k;
    }, updateStyle:function(c) {
      var f, m, p, q, v;
      return k.status.rendered && "string" == typeof c && a.fn.qtip.styles[c] ? (k.options.style = g.call(k, a.fn.qtip.styles[c], k.options.user.style), k.elements.content.css(e(k.options.style)), !1 !== k.options.content.title.text && k.elements.title.css(e(k.options.style.title, !0)), k.elements.contentWrapper.css({borderColor:k.options.style.border.color}), !1 !== k.options.style.tip.corner && (a("<canvas />").get(0).getContext ? (f = k.elements.tooltip.find(".qtip-tip canvas:first"), p = f.get(0).getContext("2d"), 
      p.clearRect(0, 0, 300, 300), q = f.parent("div[rel]:first").attr("rel"), v = d(q, k.options.style.tip.size.width, k.options.style.tip.size.height), n.call(k, f, v, k.options.style.tip.color || k.options.style.border.color)) : a.browser.msie && (f = k.elements.tooltip.find('.qtip-tip [nodeName="shape"]'), f.attr("fillcolor", k.options.style.tip.color || k.options.style.border.color))), 0 < k.options.style.border.radius && (k.elements.tooltip.find(".qtip-betweenCorners").css({backgroundColor:k.options.style.border.color}), 
      a("<canvas />").get(0).getContext ? (m = b(k.options.style.border.radius), k.elements.tooltip.find(".qtip-wrapper canvas").each(function() {
        p = a(this).get(0).getContext("2d");
        p.clearRect(0, 0, 300, 300);
        q = a(this).parent("div[rel]:first").attr("rel");
        l.call(k, a(this), m[q], k.options.style.border.radius, k.options.style.border.color);
      })) : a.browser.msie && k.elements.tooltip.find('.qtip-wrapper [nodeName="arc"]').each(function() {
        a(this).attr("fillcolor", k.options.style.border.color);
      })), k) : !1;
    }, updateContent:function(b, e) {
      function c() {
        k.updateWidth();
        !1 !== e && ("static" !== k.options.position.type && k.updatePosition(k.elements.tooltip.is(":visible"), !0), !1 !== k.options.style.tip.corner && q.call(k));
      }
      var d, f;
      if (!k.status.rendered || !b) {
        return !1;
      }
      var g = k.beforeContentUpdate.call(k, b);
      if ("string" == typeof g) {
        b = g;
      } else {
        if (!1 === g) {
          return;
        }
      }
      return a.browser.msie && k.elements.contentWrapper.children().css({zoom:"normal"}), b.jquery && 0 < b.length ? b.clone(!0).appendTo(k.elements.content).show() : k.elements.content.html(b), d = k.elements.content.find("img[complete=false]"), 0 < d.length ? (f = 0, d.each(function(b) {
        a('<img src="' + a(this).attr("src") + '" />').load(function() {
          ++f === d.length && c();
        });
      })) : c(), k.onContentUpdate.call(k), k;
    }, loadContent:function(b, e, c) {
      function d(a) {
        k.onContentLoad.call(k);
        k.updateContent(a);
      }
      var f;
      return k.status.rendered ? (f = k.beforeContentLoad.call(k), !1 === f ? k : ("post" === c ? a.post(b, e, d) : a.get(b, e, d), k)) : !1;
    }, updateTitle:function(a) {
      var b;
      return k.status.rendered && a ? (b = k.beforeTitleUpdate.call(k), !1 === b ? k : (k.elements.button && (k.elements.button = k.elements.button.clone(!0)), k.elements.title.html(a), k.elements.button && k.elements.title.prepend(k.elements.button), k.onTitleUpdate.call(k), k)) : !1;
    }, focus:function(b) {
      var e;
      if (!k.status.rendered || "static" === k.options.position.type) {
        return !1;
      }
      var c = parseInt(k.elements.tooltip.css("z-index"), 10);
      var d = 15E3 + a('div.qtip[id^="qtip"]').length - 1;
      if (!k.status.focused && c !== d) {
        c = k.beforeFocus.call(k, b);
        if (!1 === c) {
          return k;
        }
        a('div.qtip[id^="qtip"]').not(k.elements.tooltip).each(function() {
          !0 === a(this).qtip("api").status.rendered && (e = parseInt(a(this).css("z-index"), 10), "number" == typeof e && -1 < e && a(this).css({zIndex:parseInt(a(this).css("z-index"), 10) - 1}), a(this).qtip("api").status.focused = !1);
        });
        k.elements.tooltip.css({zIndex:d});
        k.status.focused = !0;
        k.onFocus.call(k, b);
      }
      return k;
    }, disable:function(a) {
      return k.status.rendered ? (k.status.disabled = a ? !0 : !1, k) : !1;
    }, destroy:function() {
      var b;
      if (!1 === k.beforeDestroy.call(k)) {
        return k;
      }
      k.status.rendered ? (k.options.show.when.target.unbind("mousemove.qtip", k.updatePosition), k.options.show.when.target.unbind("mouseout.qtip", k.hide), k.options.show.when.target.unbind(k.options.show.when.event + ".qtip"), k.options.hide.when.target.unbind(k.options.hide.when.event + ".qtip"), k.elements.tooltip.unbind(k.options.hide.when.event + ".qtip"), k.elements.tooltip.unbind("mouseover.qtip", k.focus), k.elements.tooltip.remove()) : k.options.show.when.target.unbind(k.options.show.when.event + 
      ".qtip-" + k.id + "-create");
      if ("object" == typeof k.elements.target.data("qtip")) {
        var e = k.elements.target.data("qtip").interfaces;
        if ("object" == typeof e && 0 < e.length) {
          for (b = 0; b < e.length - 1; b++) {
            e[b].id === k.id && e.splice(b, 1);
          }
        }
      }
      return a.fn.qtip.interfaces.splice(k.id, 1), "object" == typeof e && 0 < e.length ? k.elements.target.data("qtip").current = e.length - 1 : k.elements.target.removeData("qtip"), k.onDestroy.call(k), k.elements.target;
    }, getPosition:function() {
      var a, b;
      return k.status.rendered ? (a = "none" !== k.elements.tooltip.css("display") ? !1 : !0, a && k.elements.tooltip.css({visiblity:"hidden"}).show(), b = k.elements.tooltip.offset(), a && k.elements.tooltip.css({visiblity:"visible"}).hide(), b) : !1;
    }, getDimensions:function() {
      var a, b;
      return k.status.rendered ? (a = k.elements.tooltip.is(":visible") ? !1 : !0, a && k.elements.tooltip.css({visiblity:"hidden"}).show(), b = {height:k.elements.tooltip.outerHeight(), width:k.elements.tooltip.outerWidth()}, a && k.elements.tooltip.css({visiblity:"visible"}).hide(), b) : !1;
    }});
  }
  a(document).ready(function() {
    var b;
    a(window).bind("resize scroll", function(e) {
      for (b = 0; b < a.fn.qtip.interfaces.length; b++) {
        var c = a.fn.qtip.interfaces[b];
        c && c.status && c.status.rendered && "static" !== c.options.position.type && (c.options.position.adjust.scroll && "scroll" === e.type || c.options.position.adjust.resize && "resize" === e.type) && c.updatePosition(e, !0);
      }
    });
    a(document).bind("mousedown.qtip", function(b) {
      0 === a(b.target).parents("div.qtip").length && a(".qtip[unfocus]").each(function() {
        var e = a(this).qtip("api");
        a(this).is(":visible") && e && e.status && !e.status.disabled && 1 < a(b.target).add(e.elements.target).length && e.hide(b);
      });
    });
  });
  a.fn.qtip = function(b, e) {
    var d, m, k, l, p, n, q;
    if ("string" == typeof b) {
      if (!a(this).data("qtip")) {
        return a(this);
      }
      if ("api" === b) {
        return a(this).data("qtip").interfaces[a(this).data("qtip").current];
      }
      if ("interfaces" === b) {
        return a(this).data("qtip").interfaces;
      }
    } else {
      b || (b = {});
      if ("object" != typeof b.content || b.content.jquery && 0 < b.content.length) {
        b.content = {text:b.content};
      }
      "object" != typeof b.content.title && (b.content.title = {text:b.content.title});
      "object" != typeof b.position && (b.position = {corner:b.position});
      "object" != typeof b.position.corner && (b.position.corner = {target:b.position.corner, tooltip:b.position.corner});
      "object" != typeof b.show && (b.show = {when:b.show});
      "object" != typeof b.show.when && (b.show.when = {event:b.show.when});
      "object" != typeof b.show.effect && (b.show.effect = {type:b.show.effect});
      "object" != typeof b.hide && (b.hide = {when:b.hide});
      "object" != typeof b.hide.when && (b.hide.when = {event:b.hide.when});
      "object" != typeof b.hide.effect && (b.hide.effect = {type:b.hide.effect});
      "object" != typeof b.style && (b.style = {name:b.style});
      b.style = f(b.style);
      var v = a.extend(!0, {}, a.fn.qtip.defaults, b);
      v.style = g.call({options:v}, v.style);
      v.user = a.extend(!0, {}, b);
    }
    return a(this).each(function() {
      if ("string" == typeof b) {
        if (p = b.toLowerCase(), k = a(this).qtip("interfaces"), "object" == typeof k) {
          if (!0 === e && "destroy" === p) {
            for (d = k.length - 1; -1 < d; d--) {
              "object" == typeof k[d] && k[d].destroy();
            }
          } else {
            for (!0 !== e && (k = [a(this).qtip("api")]), d = 0; d < k.length; d++) {
              "destroy" === p ? k[d].destroy() : !0 === k[d].status.rendered && ("show" === p ? k[d].show() : "hide" === p ? k[d].hide() : "focus" === p ? k[d].focus() : "disable" === p ? k[d].disable(!0) : "enable" === p ? k[d].disable(!1) : "update" === p && k[d].updatePosition());
            }
          }
        }
      } else {
        n = a.extend(!0, {}, v);
        n.hide.effect.length = v.hide.effect.length;
        n.show.effect.length = v.show.effect.length;
        !1 === n.position.container && (n.position.container = a(document.body));
        !1 === n.position.target && (n.position.target = a(this));
        !1 === n.show.when.target && (n.show.when.target = a(this));
        !1 === n.hide.when.target && (n.hide.when.target = a(this));
        n.position.corner.tooltip = new c(n.position.corner.tooltip);
        n.position.corner.target = new c(n.position.corner.target);
        m = a.fn.qtip.interfaces.length;
        for (d = 0; d < m; d++) {
          if ("undefined" == typeof a.fn.qtip.interfaces[d]) {
            m = d;
            break;
          }
        }
        l = new A(a(this), n, m);
        a.fn.qtip.interfaces[m] = l;
        "object" == typeof a(this).data("qtip") && a(this).data("qtip") ? ("undefined" == typeof a(this).attr("qtip") && (a(this).data("qtip").current = a(this).data("qtip").interfaces.length), a(this).data("qtip").interfaces.push(l)) : a(this).data("qtip", {current:0, interfaces:[l]});
        !1 === n.content.prerender && !1 !== n.show.when.event && !0 !== n.show.ready ? n.show.when.target.bind(n.show.when.event + ".qtip-" + m + "-create", {qtip:m}, function(b) {
          q = a.fn.qtip.interfaces[b.data.qtip];
          q.options.show.when.target.unbind(q.options.show.when.event + ".qtip-" + b.data.qtip + "-create");
          q.cache.mouse = {x:b.pageX, y:b.pageY};
          w.call(q);
          q.options.show.when.target.trigger(q.options.show.when.event);
        }) : (l.cache.mouse = {x:n.show.when.target.offset().left, y:n.show.when.target.offset().top}, w.call(l));
      }
    });
  };
  a.fn.qtip.interfaces = [];
  a.fn.qtip.log = {error:function() {
    return this;
  }};
  a.fn.qtip.constants = {};
  a.fn.qtip.defaults = {content:{prerender:!1, text:!1, url:!1, data:null, title:{text:!1, button:!1}}, position:{target:!1, corner:{target:"bottomRight", tooltip:"topLeft"}, adjust:{x:0, y:0, mouse:!0, screen:!1, scroll:!0, resize:!0}, type:"absolute", container:!1}, show:{when:{target:!1, event:"mouseover"}, effect:{type:"fade", length:100}, delay:140, solo:!1, ready:!1}, hide:{when:{target:!1, event:"mouseout"}, effect:{type:"fade", length:100}, delay:0, fixed:!1}, api:{beforeRender:function() {
  }, onRender:function() {
  }, beforePositionUpdate:function() {
  }, onPositionUpdate:function() {
  }, beforeShow:function() {
  }, onShow:function() {
  }, beforeHide:function() {
  }, onHide:function() {
  }, beforeContentUpdate:function() {
  }, onContentUpdate:function() {
  }, beforeContentLoad:function() {
  }, onContentLoad:function() {
  }, beforeTitleUpdate:function() {
  }, onTitleUpdate:function() {
  }, beforeDestroy:function() {
  }, onDestroy:function() {
  }, beforeFocus:function() {
  }, onFocus:function() {
  }}};
  a.fn.qtip.styles = {defaults:{background:"white", color:"#111", overflow:"hidden", textAlign:"left", width:{min:0, max:250}, padding:"5px 9px", border:{width:1, radius:0, color:"#d3d3d3"}, tip:{corner:!1, color:!1, size:{width:13, height:13}, opacity:1}, title:{background:"#e1e1e1", fontWeight:"bold", padding:"7px 12px"}, button:{cursor:"pointer"}, classes:{target:"", tip:"qtip-tip", title:"qtip-title", button:"qtip-button", content:"qtip-content", active:"qtip-active"}}, cream:{border:{width:3, 
  radius:0, color:"#F9E98E"}, title:{background:"#F0DE7D", color:"#A27D35"}, background:"#FBF7AA", color:"#A27D35", classes:{tooltip:"qtip-cream"}}, light:{border:{width:3, radius:0, color:"#E2E2E2"}, title:{background:"#f1f1f1", color:"#454545"}, background:"white", color:"#454545", classes:{tooltip:"qtip-light"}}, dark:{border:{width:3, radius:0, color:"#303030"}, title:{background:"#404040", color:"#f3f3f3"}, background:"#505050", color:"#f3f3f3", classes:{tooltip:"qtip-dark"}}, red:{border:{width:3, 
  radius:0, color:"#CE6F6F"}, title:{background:"#f28279", color:"#9C2F2F"}, background:"#F79992", color:"#9C2F2F", classes:{tooltip:"qtip-red"}}, green:{border:{width:3, radius:0, color:"#A9DB66"}, title:{background:"#b9db8c", color:"#58792E"}, background:"#CDE6AC", color:"#58792E", classes:{tooltip:"qtip-green"}}, blue:{border:{width:3, radius:0, color:"#ADD9ED"}, title:{background:"#D0E9F5", color:"#5E99BD"}, background:"#E5F6FE", color:"#4D9FBF", classes:{tooltip:"qtip-blue"}}};
})(jQuery);
(function(a, c) {
  a.fn.jPlayer = function(b) {
    var e = "string" == typeof b, d = Array.prototype.slice.call(arguments, 1), g = this;
    b = !e && d.length ? a.extend.apply(null, [!0, b].concat(d)) : b;
    return e && "_" === b.charAt(0) ? g : (e ? this.each(function() {
      var e = a.data(this, "jPlayer"), f = e && a.isFunction(e[b]) ? e[b].apply(e, d) : e;
      if (f !== e && f !== c) {
        return g = f, !1;
      }
    }) : this.each(function() {
      var e = a.data(this, "jPlayer");
      e ? e.option(b || {}) : a.data(this, "jPlayer", new a.jPlayer(b, this));
    }), g);
  };
  a.jPlayer = function(b, e) {
    if (arguments.length) {
      this.element = a(e);
      this.options = a.extend(!0, {}, this.options, b);
      var c = this;
      this.element.bind("remove.jPlayer", function() {
        c.destroy();
      });
      this._init();
    }
  };
  a.jPlayer.emulateMethods = "load play pause";
  a.jPlayer.emulateStatus = "src readyState networkState currentTime duration paused ended playbackRate";
  a.jPlayer.emulateOptions = "muted volume";
  a.jPlayer.reservedEvent = "ready flashreset resize repeat error warning";
  a.jPlayer.event = {ready:"jPlayer_ready", flashreset:"jPlayer_flashreset", resize:"jPlayer_resize", repeat:"jPlayer_repeat", click:"jPlayer_click", error:"jPlayer_error", warning:"jPlayer_warning", loadstart:"jPlayer_loadstart", progress:"jPlayer_progress", suspend:"jPlayer_suspend", abort:"jPlayer_abort", emptied:"jPlayer_emptied", stalled:"jPlayer_stalled", play:"jPlayer_play", pause:"jPlayer_pause", loadedmetadata:"jPlayer_loadedmetadata", loadeddata:"jPlayer_loadeddata", waiting:"jPlayer_waiting", 
  playing:"jPlayer_playing", canplay:"jPlayer_canplay", canplaythrough:"jPlayer_canplaythrough", seeking:"jPlayer_seeking", seeked:"jPlayer_seeked", timeupdate:"jPlayer_timeupdate", ended:"jPlayer_ended", ratechange:"jPlayer_ratechange", durationchange:"jPlayer_durationchange", volumechange:"jPlayer_volumechange"};
  a.jPlayer.htmlEvent = "loadstart abort emptied stalled loadedmetadata loadeddata canplay canplaythrough ratechange".split(" ");
  a.jPlayer.pause = function() {
    a.each(a.jPlayer.prototype.instances, function(a, e) {
      e.data("jPlayer").status.srcSet && e.jPlayer("pause");
    });
  };
  a.jPlayer.timeFormat = {showHour:!1, showMin:!0, showSec:!0, padHour:!1, padMin:!0, padSec:!0, sepHour:":", sepMin:":", sepSec:""};
  a.jPlayer.convertTime = function(b) {
    var e = new Date(1E3 * b), c = e.getUTCHours();
    b = e.getUTCMinutes();
    e = e.getUTCSeconds();
    c = a.jPlayer.timeFormat.padHour && 10 > c ? "0" + c : c;
    b = a.jPlayer.timeFormat.padMin && 10 > b ? "0" + b : b;
    e = a.jPlayer.timeFormat.padSec && 10 > e ? "0" + e : e;
    return (a.jPlayer.timeFormat.showHour ? c + a.jPlayer.timeFormat.sepHour : "") + (a.jPlayer.timeFormat.showMin ? b + a.jPlayer.timeFormat.sepMin : "") + (a.jPlayer.timeFormat.showSec ? e + a.jPlayer.timeFormat.sepSec : "");
  };
  a.jPlayer.uaBrowser = function(a) {
    a = a.toLowerCase();
    var b = /(opera)(?:.*version)?[ \/]([\w.]+)/, c = /(msie) ([\w.]+)/, d = /(mozilla)(?:.*? rv:([\w.]+))?/;
    a = /(webkit)[ \/]([\w.]+)/.exec(a) || b.exec(a) || c.exec(a) || 0 > a.indexOf("compatible") && d.exec(a) || [];
    return {browser:a[1] || "", version:a[2] || "0"};
  };
  a.jPlayer.uaPlatform = function(a) {
    var b = a.toLowerCase(), c = /(android)/, d = /(mobile)/;
    a = /(ipad|iphone|ipod|android|blackberry|playbook|windows ce|webos)/.exec(b) || [];
    b = /(ipad|playbook)/.exec(b) || !d.exec(b) && c.exec(b) || [];
    return a[1] && (a[1] = a[1].replace(/\s/g, "_")), {platform:a[1] || "", tablet:b[1] || ""};
  };
  a.jPlayer.browser = {};
  a.jPlayer.platform = {};
  var d = a.jPlayer.uaBrowser(navigator.userAgent);
  d.browser && (a.jPlayer.browser[d.browser] = !0, a.jPlayer.browser.version = d.version);
  d = a.jPlayer.uaPlatform(navigator.userAgent);
  d.platform && (a.jPlayer.platform[d.platform] = !0, a.jPlayer.platform.mobile = !d.tablet, a.jPlayer.platform.tablet = !!d.tablet);
  a.jPlayer.prototype = {count:0, version:{script:"2.1.0", needFlash:"2.1.0", flash:"unknown"}, options:{swfPath:"js", solution:"html, flash", supplied:"mp3", preload:"metadata", volume:.8, muted:!1, wmode:"opaque", backgroundColor:"#000000", cssSelectorAncestor:"#jp_container_1", cssSelector:{videoPlay:".jp-video-play", play:".jp-play", pause:".jp-pause", stop:".jp-stop", seekBar:".jp-seek-bar", playBar:".jp-play-bar", mute:".jp-mute", unmute:".jp-unmute", volumeBar:".jp-volume-bar", volumeBarValue:".jp-volume-bar-value", 
  volumeMax:".jp-volume-max", currentTime:".jp-current-time", duration:".jp-duration", fullScreen:".jp-full-screen", restoreScreen:".jp-restore-screen", repeat:".jp-repeat", repeatOff:".jp-repeat-off", gui:".jp-gui", noSolution:".jp-no-solution"}, fullScreen:!1, autohide:{restored:!1, full:!0, fadeIn:200, fadeOut:600, hold:1e3}, loop:!1, repeat:function(b) {
    b.jPlayer.options.loop ? a(this).unbind(".jPlayerRepeat").bind(a.jPlayer.event.ended + ".jPlayer.jPlayerRepeat", function() {
      a(this).jPlayer("play");
    }) : a(this).unbind(".jPlayerRepeat");
  }, nativeVideoControls:{}, noFullScreen:{msie:/msie [0-6]/, ipad:/ipad.*?os [0-4]/, iphone:/iphone/, ipod:/ipod/, android_pad:/android [0-3](?!.*?mobile)/, android_phone:/android.*?mobile/, blackberry:/blackberry/, windows_ce:/windows ce/, webos:/webos/}, noVolume:{ipad:/ipad/, iphone:/iphone/, ipod:/ipod/, android_pad:/android(?!.*?mobile)/, android_phone:/android.*?mobile/, blackberry:/blackberry/, windows_ce:/windows ce/, webos:/webos/, playbook:/playbook/}, verticalVolume:!1, idPrefix:"jp", 
  noConflict:"jQuery", emulateHtml:!1, errorAlerts:!1, warningAlerts:!1}, optionsAudio:{size:{width:"0px", height:"0px", cssClass:""}, sizeFull:{width:"0px", height:"0px", cssClass:""}}, optionsVideo:{size:{width:"480px", height:"270px", cssClass:"jp-video-270p"}, sizeFull:{width:"100%", height:"100%", cssClass:"jp-video-full"}}, instances:{}, status:{src:"", media:{}, paused:!0, format:{}, formatType:"", waitForPlay:!0, waitForLoad:!0, srcSet:!1, video:!1, seekPercent:0, currentPercentRelative:0, 
  currentPercentAbsolute:0, currentTime:0, duration:0, readyState:0, networkState:0, playbackRate:1, ended:0}, internal:{ready:!1}, solution:{html:!0, flash:!0}, format:{mp3:{codec:'audio/mpeg; codecs="mp3"', flashCanPlay:!0, media:"audio"}, m4a:{codec:'audio/mp4; codecs="mp4a.40.2"', flashCanPlay:!0, media:"audio"}, oga:{codec:'audio/ogg; codecs="vorbis"', flashCanPlay:!1, media:"audio"}, wav:{codec:'audio/wav; codecs="1"', flashCanPlay:!1, media:"audio"}, webma:{codec:'audio/webm; codecs="vorbis"', 
  flashCanPlay:!1, media:"audio"}, fla:{codec:"audio/x-flv", flashCanPlay:!0, media:"audio"}, m4v:{codec:'video/mp4; codecs="avc1.42E01E, mp4a.40.2"', flashCanPlay:!0, media:"video"}, ogv:{codec:'video/ogg; codecs="theora, vorbis"', flashCanPlay:!1, media:"video"}, webmv:{codec:'video/webm; codecs="vorbis, vp8"', flashCanPlay:!1, media:"video"}, flv:{codec:"video/x-flv", flashCanPlay:!0, media:"video"}}, _init:function() {
    var b = this;
    this.element.empty();
    this.status = a.extend({}, this.status);
    this.internal = a.extend({}, this.internal);
    this.internal.domNode = this.element.get(0);
    this.formats = [];
    this.solutions = [];
    this.require = {};
    this.htmlElement = {};
    this.html = {};
    this.html.audio = {};
    this.html.video = {};
    this.flash = {};
    this.css = {};
    this.css.cs = {};
    this.css.jq = {};
    this.ancestorJq = [];
    this.options.volume = this._limitValue(this.options.volume, 0, 1);
    a.each(this.options.supplied.toLowerCase().split(","), function(e, c) {
      var d = c.replace(/^\s+|\s+$/g, "");
      if (b.format[d]) {
        var f = !1;
        a.each(b.formats, function(a, b) {
          if (d === b) {
            return f = !0, !1;
          }
        });
        f || b.formats.push(d);
      }
    });
    a.each(this.options.solution.toLowerCase().split(","), function(e, c) {
      var d = c.replace(/^\s+|\s+$/g, "");
      if (b.solution[d]) {
        var f = !1;
        a.each(b.solutions, function(a, b) {
          if (d === b) {
            return f = !0, !1;
          }
        });
        f || b.solutions.push(d);
      }
    });
    this.internal.instance = "jp_" + this.count;
    this.instances[this.internal.instance] = this.element;
    this.element.attr("id") || this.element.attr("id", this.options.idPrefix + "_jplayer_" + this.count);
    this.internal.self = a.extend({}, {id:this.element.attr("id"), jq:this.element});
    this.internal.audio = a.extend({}, {id:this.options.idPrefix + "_audio_" + this.count, jq:c});
    this.internal.video = a.extend({}, {id:this.options.idPrefix + "_video_" + this.count, jq:c});
    this.internal.flash = a.extend({}, {id:this.options.idPrefix + "_flash_" + this.count, jq:c, swf:this.options.swfPath + (".swf" !== this.options.swfPath.toLowerCase().slice(-4) ? (this.options.swfPath && "/" !== this.options.swfPath.slice(-1) ? "/" : "") + "Jplayer.swf" : "")});
    this.internal.poster = a.extend({}, {id:this.options.idPrefix + "_poster_" + this.count, jq:c});
    a.each(a.jPlayer.event, function(a, e) {
      b.options[a] !== c && (b.element.bind(e + ".jPlayer", b.options[a]), b.options[a] = c);
    });
    this.require.audio = !1;
    this.require.video = !1;
    a.each(this.formats, function(a, e) {
      b.require[b.format[e].media] = !0;
    });
    this.options = this.require.video ? a.extend(!0, {}, this.optionsVideo, this.options) : a.extend(!0, {}, this.optionsAudio, this.options);
    this._setSize();
    this.status.nativeVideoControls = this._uaBlocklist(this.options.nativeVideoControls);
    this.status.noFullScreen = this._uaBlocklist(this.options.noFullScreen);
    this.status.noVolume = this._uaBlocklist(this.options.noVolume);
    this._restrictNativeVideoControls();
    this.htmlElement.poster = document.createElement("img");
    this.htmlElement.poster.id = this.internal.poster.id;
    this.htmlElement.poster.onload = function() {
      b.status.video && !b.status.waitForPlay || b.internal.poster.jq.show();
    };
    this.element.append(this.htmlElement.poster);
    this.internal.poster.jq = a("#" + this.internal.poster.id);
    this.internal.poster.jq.css({width:this.status.width, height:this.status.height});
    this.internal.poster.jq.hide();
    this.internal.poster.jq.bind("click.jPlayer", function() {
      b._trigger(a.jPlayer.event.click);
    });
    this.html.audio.available = !1;
    this.require.audio && (this.htmlElement.audio = document.createElement("audio"), this.htmlElement.audio.id = this.internal.audio.id, this.html.audio.available = !!this.htmlElement.audio.canPlayType && this._testCanPlayType(this.htmlElement.audio));
    this.html.video.available = !1;
    this.require.video && (this.htmlElement.video = document.createElement("video"), this.htmlElement.video.id = this.internal.video.id, this.html.video.available = !!this.htmlElement.video.canPlayType && this._testCanPlayType(this.htmlElement.video));
    this.flash.available = this._checkForFlash(10);
    this.html.canPlay = {};
    this.flash.canPlay = {};
    a.each(this.formats, function(a, e) {
      b.html.canPlay[e] = b.html[b.format[e].media].available && "" !== b.htmlElement[b.format[e].media].canPlayType(b.format[e].codec);
      b.flash.canPlay[e] = b.format[e].flashCanPlay && b.flash.available;
    });
    this.html.desired = !1;
    this.flash.desired = !1;
    a.each(this.solutions, function(e, c) {
      if (0 === e) {
        b[c].desired = !0;
      } else {
        var d = !1, f = !1;
        a.each(b.formats, function(a, e) {
          b[b.solutions[0]].canPlay[e] && ("video" === b.format[e].media ? f = !0 : d = !0);
        });
        b[c].desired = b.require.audio && !d || b.require.video && !f;
      }
    });
    this.html.support = {};
    this.flash.support = {};
    a.each(this.formats, function(a, e) {
      b.html.support[e] = b.html.canPlay[e] && b.html.desired;
      b.flash.support[e] = b.flash.canPlay[e] && b.flash.desired;
    });
    this.html.used = !1;
    this.flash.used = !1;
    a.each(this.solutions, function(e, c) {
      a.each(b.formats, function(a, e) {
        if (b[c].support[e]) {
          return b[c].used = !0, !1;
        }
      });
    });
    this._resetActive();
    this._resetGate();
    this._cssSelectorAncestor(this.options.cssSelectorAncestor);
    this.html.used || this.flash.used ? this.css.jq.noSolution.length && this.css.jq.noSolution.hide() : (this._error({type:a.jPlayer.error.NO_SOLUTION, context:"{solution:'" + this.options.solution + "', supplied:'" + this.options.supplied + "'}", message:a.jPlayer.errorMsg.NO_SOLUTION, hint:a.jPlayer.errorHint.NO_SOLUTION}), this.css.jq.noSolution.length && this.css.jq.noSolution.show());
    if (this.flash.used) {
      var e = "jQuery=" + encodeURI(this.options.noConflict) + "&id=" + encodeURI(this.internal.self.id) + "&vol=" + this.options.volume + "&muted=" + this.options.muted;
      if (a.browser.msie && 8 >= Number(a.browser.version)) {
        e = ['<param name="movie" value="' + this.internal.flash.swf + '" />', '<param name="FlashVars" value="' + e + '" />', '<param name="allowScriptAccess" value="always" />', '<param name="bgcolor" value="' + this.options.backgroundColor + '" />', '<param name="wmode" value="' + this.options.wmode + '" />'];
        var d = document.createElement('<object id="' + this.internal.flash.id + '" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" width="0" height="0"></object>');
        for (var g = 0; g < e.length; g++) {
          d.appendChild(document.createElement(e[g]));
        }
      } else {
        g = function(a, b, e) {
          var c = document.createElement("param");
          c.setAttribute("name", b);
          c.setAttribute("value", e);
          a.appendChild(c);
        }, d = document.createElement("object"), d.setAttribute("id", this.internal.flash.id), d.setAttribute("data", this.internal.flash.swf), d.setAttribute("type", "application/x-shockwave-flash"), d.setAttribute("width", "1"), d.setAttribute("height", "1"), g(d, "flashvars", e), g(d, "allowscriptaccess", "always"), g(d, "bgcolor", this.options.backgroundColor), g(d, "wmode", this.options.wmode);
      }
      this.element.append(d);
      this.internal.flash.jq = a(d);
    }
    this.html.used && (this.html.audio.available && (this._addHtmlEventListeners(this.htmlElement.audio, this.html.audio), this.element.append(this.htmlElement.audio), this.internal.audio.jq = a("#" + this.internal.audio.id)), this.html.video.available && (this._addHtmlEventListeners(this.htmlElement.video, this.html.video), this.element.append(this.htmlElement.video), this.internal.video.jq = a("#" + this.internal.video.id), this.status.nativeVideoControls ? this.internal.video.jq.css({width:this.status.width, 
    height:this.status.height}) : this.internal.video.jq.css({width:"0px", height:"0px"}), this.internal.video.jq.bind("click.jPlayer", function() {
      b._trigger(a.jPlayer.event.click);
    })));
    this.options.emulateHtml && this._emulateHtmlBridge();
    this.html.used && !this.flash.used && setTimeout(function() {
      b.internal.ready = !0;
      b.version.flash = "n/a";
      b._trigger(a.jPlayer.event.repeat);
      b._trigger(a.jPlayer.event.ready);
    }, 100);
    this._updateNativeVideoControls();
    this._updateInterface();
    this._updateButtons(!1);
    this._updateAutohide();
    this._updateVolume(this.options.volume);
    this._updateMute(this.options.muted);
    this.css.jq.videoPlay.length && this.css.jq.videoPlay.hide();
    a.jPlayer.prototype.count++;
  }, destroy:function() {
    this.clearMedia();
    this._removeUiClass();
    this.css.jq.currentTime.length && this.css.jq.currentTime.text("");
    this.css.jq.duration.length && this.css.jq.duration.text("");
    a.each(this.css.jq, function(a, e) {
      e.length && e.unbind(".jPlayer");
    });
    this.internal.poster.jq.unbind(".jPlayer");
    this.internal.video.jq && this.internal.video.jq.unbind(".jPlayer");
    this.options.emulateHtml && this._destroyHtmlBridge();
    this.element.removeData("jPlayer");
    this.element.unbind(".jPlayer");
    this.element.empty();
    delete this.instances[this.internal.instance];
  }, enable:function() {
  }, disable:function() {
  }, _testCanPlayType:function(a) {
    try {
      return a.canPlayType(this.format.mp3.codec), !0;
    } catch (e) {
      return !1;
    }
  }, _uaBlocklist:function(b) {
    var e = navigator.userAgent.toLowerCase(), c = !1;
    return a.each(b, function(a, b) {
      if (b && b.test(e)) {
        return c = !0, !1;
      }
    }), c;
  }, _restrictNativeVideoControls:function() {
    this.require.audio && this.status.nativeVideoControls && (this.status.nativeVideoControls = !1, this.status.noFullScreen = !0);
  }, _updateNativeVideoControls:function() {
    this.html.video.available && this.html.used && (this.htmlElement.video.controls = this.status.nativeVideoControls, this._updateAutohide(), this.status.nativeVideoControls && this.require.video ? (this.internal.poster.jq.hide(), this.internal.video.jq.css({width:this.status.width, height:this.status.height})) : this.status.waitForPlay && this.status.video && (this.internal.poster.jq.show(), this.internal.video.jq.css({width:"0px", height:"0px"})));
  }, _addHtmlEventListeners:function(b, e) {
    var c = this;
    b.preload = this.options.preload;
    b.muted = this.options.muted;
    b.volume = this.options.volume;
    b.addEventListener("progress", function() {
      e.gate && (c._getHtmlStatus(b), c._updateInterface(), c._trigger(a.jPlayer.event.progress));
    }, !1);
    b.addEventListener("timeupdate", function() {
      e.gate && (c._getHtmlStatus(b), c._updateInterface(), c._trigger(a.jPlayer.event.timeupdate));
    }, !1);
    b.addEventListener("durationchange", function() {
      e.gate && (c.status.duration = this.duration, c._getHtmlStatus(b), c._updateInterface(), c._trigger(a.jPlayer.event.durationchange));
    }, !1);
    b.addEventListener("play", function() {
      e.gate && (c._updateButtons(!0), c._html_checkWaitForPlay(), c._trigger(a.jPlayer.event.play));
    }, !1);
    b.addEventListener("playing", function() {
      e.gate && (c._updateButtons(!0), c._seeked(), c._trigger(a.jPlayer.event.playing));
    }, !1);
    b.addEventListener("pause", function() {
      e.gate && (c._updateButtons(!1), c._trigger(a.jPlayer.event.pause));
    }, !1);
    b.addEventListener("waiting", function() {
      e.gate && (c._seeking(), c._trigger(a.jPlayer.event.waiting));
    }, !1);
    b.addEventListener("seeking", function() {
      e.gate && (c._seeking(), c._trigger(a.jPlayer.event.seeking));
    }, !1);
    b.addEventListener("seeked", function() {
      e.gate && (c._seeked(), c._trigger(a.jPlayer.event.seeked));
    }, !1);
    b.addEventListener("volumechange", function() {
      e.gate && (c.options.volume = b.volume, c.options.muted = b.muted, c._updateMute(), c._updateVolume(), c._trigger(a.jPlayer.event.volumechange));
    }, !1);
    b.addEventListener("suspend", function() {
      e.gate && (c._seeked(), c._trigger(a.jPlayer.event.suspend));
    }, !1);
    b.addEventListener("ended", function() {
      e.gate && (a.jPlayer.browser.webkit || (c.htmlElement.media.currentTime = 0), c.htmlElement.media.pause(), c._updateButtons(!1), c._getHtmlStatus(b, !0), c._updateInterface(), c._trigger(a.jPlayer.event.ended));
    }, !1);
    b.addEventListener("error", function() {
      e.gate && (c._updateButtons(!1), c._seeked(), c.status.srcSet) && (clearTimeout(c.internal.htmlDlyCmdId), c.status.waitForLoad = !0, c.status.waitForPlay = !0, c.status.video && !c.status.nativeVideoControls && c.internal.video.jq.css({width:"0px", height:"0px"}), c._validString(c.status.media.poster) && !c.status.nativeVideoControls && c.internal.poster.jq.show(), c.css.jq.videoPlay.length && c.css.jq.videoPlay.show(), c._error({type:a.jPlayer.error.URL, context:c.status.src, message:a.jPlayer.errorMsg.URL, 
      hint:a.jPlayer.errorHint.URL}));
    }, !1);
    a.each(a.jPlayer.htmlEvent, function(d, f) {
      b.addEventListener(this, function() {
        e.gate && c._trigger(a.jPlayer.event[f]);
      }, !1);
    });
  }, _getHtmlStatus:function(a, e) {
    var b = 0, c = 0;
    a.duration && (this.status.duration = a.duration);
    var d = a.currentTime;
    var k = 0 < this.status.duration ? 100 * d / this.status.duration : 0;
    "object" == typeof a.seekable && 0 < a.seekable.length ? (b = 0 < this.status.duration ? 100 * a.seekable.end(a.seekable.length - 1) / this.status.duration : 100, c = 100 * a.currentTime / a.seekable.end(a.seekable.length - 1)) : (b = 100, c = k);
    e && (k = c = d = 0);
    this.status.seekPercent = b;
    this.status.currentPercentRelative = c;
    this.status.currentPercentAbsolute = k;
    this.status.currentTime = d;
    this.status.readyState = a.readyState;
    this.status.networkState = a.networkState;
    this.status.playbackRate = a.playbackRate;
    this.status.ended = a.ended;
  }, _resetStatus:function() {
    this.status = a.extend({}, this.status, a.jPlayer.prototype.status);
  }, _trigger:function(b, e, c) {
    b = a.Event(b);
    b.jPlayer = {};
    b.jPlayer.version = a.extend({}, this.version);
    b.jPlayer.options = a.extend(!0, {}, this.options);
    b.jPlayer.status = a.extend(!0, {}, this.status);
    b.jPlayer.html = a.extend(!0, {}, this.html);
    b.jPlayer.flash = a.extend(!0, {}, this.flash);
    e && (b.jPlayer.error = a.extend({}, e));
    c && (b.jPlayer.warning = a.extend({}, c));
    this.element.trigger(b);
  }, jPlayerFlashEvent:function(b, e) {
    if (b === a.jPlayer.event.ready) {
      if (this.internal.ready) {
        if (this.flash.gate) {
          if (this.status.srcSet) {
            var c = this.status.currentTime, d = this.status.paused;
            this.setMedia(this.status.media);
            0 < c && (d ? this.pause(c) : this.play(c));
          }
          this._trigger(a.jPlayer.event.flashreset);
        }
      } else {
        this.internal.ready = !0, this.internal.flash.jq.css({width:"0px", height:"0px"}), this.version.flash = e.version, this.version.needFlash !== this.version.flash && this._error({type:a.jPlayer.error.VERSION, context:this.version.flash, message:a.jPlayer.errorMsg.VERSION + this.version.flash, hint:a.jPlayer.errorHint.VERSION}), this._trigger(a.jPlayer.event.repeat), this._trigger(b);
      }
    }
    if (this.flash.gate) {
      switch(b) {
        case a.jPlayer.event.progress:
          this._getFlashStatus(e);
          this._updateInterface();
          this._trigger(b);
          break;
        case a.jPlayer.event.timeupdate:
          this._getFlashStatus(e);
          this._updateInterface();
          this._trigger(b);
          break;
        case a.jPlayer.event.play:
          this._seeked();
          this._updateButtons(!0);
          this._trigger(b);
          break;
        case a.jPlayer.event.pause:
          this._updateButtons(!1);
          this._trigger(b);
          break;
        case a.jPlayer.event.ended:
          this._updateButtons(!1);
          this._trigger(b);
          break;
        case a.jPlayer.event.click:
          this._trigger(b);
          break;
        case a.jPlayer.event.error:
          this.status.waitForLoad = !0;
          this.status.waitForPlay = !0;
          this.status.video && this.internal.flash.jq.css({width:"0px", height:"0px"});
          this._validString(this.status.media.poster) && this.internal.poster.jq.show();
          this.css.jq.videoPlay.length && this.status.video && this.css.jq.videoPlay.show();
          this.status.video ? this._flash_setVideo(this.status.media) : this._flash_setAudio(this.status.media);
          this._updateButtons(!1);
          this._error({type:a.jPlayer.error.URL, context:e.src, message:a.jPlayer.errorMsg.URL, hint:a.jPlayer.errorHint.URL});
          break;
        case a.jPlayer.event.seeking:
          this._seeking();
          this._trigger(b);
          break;
        case a.jPlayer.event.seeked:
          this._seeked();
          this._trigger(b);
          break;
        case a.jPlayer.event.ready:
          break;
        default:
          this._trigger(b);
      }
    }
    return !1;
  }, _getFlashStatus:function(a) {
    this.status.seekPercent = a.seekPercent;
    this.status.currentPercentRelative = a.currentPercentRelative;
    this.status.currentPercentAbsolute = a.currentPercentAbsolute;
    this.status.currentTime = a.currentTime;
    this.status.duration = a.duration;
    this.status.readyState = 4;
    this.status.networkState = 0;
    this.status.playbackRate = 1;
    this.status.ended = !1;
  }, _updateButtons:function(a) {
    a !== c && (this.status.paused = !a, this.css.jq.play.length && this.css.jq.pause.length && (a ? (this.css.jq.play.hide(), this.css.jq.pause.show()) : (this.css.jq.play.show(), this.css.jq.pause.hide())));
    this.css.jq.restoreScreen.length && this.css.jq.fullScreen.length && (this.status.noFullScreen ? (this.css.jq.fullScreen.hide(), this.css.jq.restoreScreen.hide()) : this.options.fullScreen ? (this.css.jq.fullScreen.hide(), this.css.jq.restoreScreen.show()) : (this.css.jq.fullScreen.show(), this.css.jq.restoreScreen.hide()));
    this.css.jq.repeat.length && this.css.jq.repeatOff.length && (this.options.loop ? (this.css.jq.repeat.hide(), this.css.jq.repeatOff.show()) : (this.css.jq.repeat.show(), this.css.jq.repeatOff.hide()));
  }, _updateInterface:function() {
    this.css.jq.seekBar.length && this.css.jq.seekBar.width(this.status.seekPercent + "%");
    this.css.jq.playBar.length && this.css.jq.playBar.width(this.status.currentPercentRelative + "%");
    this.css.jq.currentTime.length && this.css.jq.currentTime.text(a.jPlayer.convertTime(this.status.currentTime));
    this.css.jq.duration.length && this.css.jq.duration.text(a.jPlayer.convertTime(this.status.duration));
  }, _seeking:function() {
    this.css.jq.seekBar.length && this.css.jq.seekBar.addClass("jp-seeking-bg");
  }, _seeked:function() {
    this.css.jq.seekBar.length && this.css.jq.seekBar.removeClass("jp-seeking-bg");
  }, _resetGate:function() {
    this.html.audio.gate = !1;
    this.html.video.gate = !1;
    this.flash.gate = !1;
  }, _resetActive:function() {
    this.html.active = !1;
    this.flash.active = !1;
  }, setMedia:function(b) {
    var e = this, c = !1, d = this.status.media.poster !== b.poster;
    this._resetMedia();
    this._resetGate();
    this._resetActive();
    a.each(this.formats, function(d, f) {
      var g = "video" === e.format[f].media;
      a.each(e.solutions, function(a, d) {
        if (e[d].support[f] && e._validString(b[f])) {
          return a = "html" === d, g ? (a ? (e.html.video.gate = !0, e._html_setVideo(b), e.html.active = !0) : (e.flash.gate = !0, e._flash_setVideo(b), e.flash.active = !0), e.css.jq.videoPlay.length && e.css.jq.videoPlay.show(), e.status.video = !0) : (a ? (e.html.audio.gate = !0, e._html_setAudio(b), e.html.active = !0) : (e.flash.gate = !0, e._flash_setAudio(b), e.flash.active = !0), e.css.jq.videoPlay.length && e.css.jq.videoPlay.hide(), e.status.video = !1), c = !0, !1;
        }
      });
      if (c) {
        return !1;
      }
    });
    c ? ((!this.status.nativeVideoControls || !this.html.video.gate) && this._validString(b.poster) && (d ? this.htmlElement.poster.src = b.poster : this.internal.poster.jq.show()), this.status.srcSet = !0, this.status.media = a.extend({}, b), this._updateButtons(!1), this._updateInterface()) : this._error({type:a.jPlayer.error.NO_SUPPORT, context:"{supplied:'" + this.options.supplied + "'}", message:a.jPlayer.errorMsg.NO_SUPPORT, hint:a.jPlayer.errorHint.NO_SUPPORT});
  }, _resetMedia:function() {
    this._resetStatus();
    this._updateButtons(!1);
    this._updateInterface();
    this._seeked();
    this.internal.poster.jq.hide();
    clearTimeout(this.internal.htmlDlyCmdId);
    this.html.active ? this._html_resetMedia() : this.flash.active && this._flash_resetMedia();
  }, clearMedia:function() {
    this._resetMedia();
    this.html.active ? this._html_clearMedia() : this.flash.active && this._flash_clearMedia();
    this._resetGate();
    this._resetActive();
  }, load:function() {
    this.status.srcSet ? this.html.active ? this._html_load() : this.flash.active && this._flash_load() : this._urlNotSetError("load");
  }, play:function(a) {
    a = "number" == typeof a ? a : NaN;
    this.status.srcSet ? this.html.active ? this._html_play(a) : this.flash.active && this._flash_play(a) : this._urlNotSetError("play");
  }, videoPlay:function() {
    this.play();
  }, pause:function(a) {
    a = "number" == typeof a ? a : NaN;
    this.status.srcSet ? this.html.active ? this._html_pause(a) : this.flash.active && this._flash_pause(a) : this._urlNotSetError("pause");
  }, pauseOthers:function() {
    var b = this;
    a.each(this.instances, function(a, c) {
      b.element !== c && c.data("jPlayer").status.srcSet && c.jPlayer("pause");
    });
  }, stop:function() {
    this.status.srcSet ? this.html.active ? this._html_pause(0) : this.flash.active && this._flash_pause(0) : this._urlNotSetError("stop");
  }, playHead:function(a) {
    a = this._limitValue(a, 0, 100);
    this.status.srcSet ? this.html.active ? this._html_playHead(a) : this.flash.active && this._flash_playHead(a) : this._urlNotSetError("playHead");
  }, _muted:function(b) {
    this.options.muted = b;
    this.html.used && this._html_mute(b);
    this.flash.used && this._flash_mute(b);
    this.html.video.gate || this.html.audio.gate || (this._updateMute(b), this._updateVolume(this.options.volume), this._trigger(a.jPlayer.event.volumechange));
  }, mute:function(a) {
    a = a === c ? !0 : !!a;
    this._muted(a);
  }, unmute:function(a) {
    a = a === c ? !0 : !!a;
    this._muted(!a);
  }, _updateMute:function(a) {
    a === c && (a = this.options.muted);
    this.css.jq.mute.length && this.css.jq.unmute.length && (this.status.noVolume ? (this.css.jq.mute.hide(), this.css.jq.unmute.hide()) : a ? (this.css.jq.mute.hide(), this.css.jq.unmute.show()) : (this.css.jq.mute.show(), this.css.jq.unmute.hide()));
  }, volume:function(b) {
    b = this._limitValue(b, 0, 1);
    this.options.volume = b;
    this.html.used && this._html_volume(b);
    this.flash.used && this._flash_volume(b);
    this.html.video.gate || this.html.audio.gate || (this._updateVolume(b), this._trigger(a.jPlayer.event.volumechange));
  }, volumeBar:function(a) {
    if (this.css.jq.volumeBar.length) {
      var b = this.css.jq.volumeBar.offset(), c = a.pageX - b.left, d = this.css.jq.volumeBar.width();
      a = this.css.jq.volumeBar.height() - a.pageY + b.top;
      b = this.css.jq.volumeBar.height();
      this.options.verticalVolume ? this.volume(a / b) : this.volume(c / d);
    }
    this.options.muted && this._muted(!1);
  }, volumeBarValue:function(a) {
    this.volumeBar(a);
  }, _updateVolume:function(a) {
    a === c && (a = this.options.volume);
    a = this.options.muted ? 0 : a;
    this.status.noVolume ? (this.css.jq.volumeBar.length && this.css.jq.volumeBar.hide(), this.css.jq.volumeBarValue.length && this.css.jq.volumeBarValue.hide(), this.css.jq.volumeMax.length && this.css.jq.volumeMax.hide()) : (this.css.jq.volumeBar.length && this.css.jq.volumeBar.show(), this.css.jq.volumeBarValue.length && (this.css.jq.volumeBarValue.show(), this.css.jq.volumeBarValue[this.options.verticalVolume ? "height" : "width"](100 * a + "%")), this.css.jq.volumeMax.length && this.css.jq.volumeMax.show());
  }, volumeMax:function() {
    this.volume(1);
    this.options.muted && this._muted(!1);
  }, _cssSelectorAncestor:function(b) {
    var e = this;
    this.options.cssSelectorAncestor = b;
    this._removeUiClass();
    this.ancestorJq = b ? a(b) : [];
    b && 1 !== this.ancestorJq.length && this._warning({type:a.jPlayer.warning.CSS_SELECTOR_COUNT, context:b, message:a.jPlayer.warningMsg.CSS_SELECTOR_COUNT + this.ancestorJq.length + " found for cssSelectorAncestor.", hint:a.jPlayer.warningHint.CSS_SELECTOR_COUNT});
    this._addUiClass();
    a.each(this.options.cssSelector, function(a, b) {
      e._cssSelector(a, b);
    });
  }, _cssSelector:function(b, e) {
    var c = this;
    "string" == typeof e ? a.jPlayer.prototype.options.cssSelector[b] ? (this.css.jq[b] && this.css.jq[b].length && this.css.jq[b].unbind(".jPlayer"), this.options.cssSelector[b] = e, this.css.cs[b] = this.options.cssSelectorAncestor + " " + e, this.css.jq[b] = e ? a(this.css.cs[b]) : [], this.css.jq[b].length && this.css.jq[b].bind("click.jPlayer", function(e) {
      return c[b](e), a(this).blur(), !1;
    }), e && 1 !== this.css.jq[b].length && this._warning({type:a.jPlayer.warning.CSS_SELECTOR_COUNT, context:this.css.cs[b], message:a.jPlayer.warningMsg.CSS_SELECTOR_COUNT + this.css.jq[b].length + " found for " + b + " method.", hint:a.jPlayer.warningHint.CSS_SELECTOR_COUNT})) : this._warning({type:a.jPlayer.warning.CSS_SELECTOR_METHOD, context:b, message:a.jPlayer.warningMsg.CSS_SELECTOR_METHOD, hint:a.jPlayer.warningHint.CSS_SELECTOR_METHOD}) : this._warning({type:a.jPlayer.warning.CSS_SELECTOR_STRING, 
    context:e, message:a.jPlayer.warningMsg.CSS_SELECTOR_STRING, hint:a.jPlayer.warningHint.CSS_SELECTOR_STRING});
  }, seekBar:function(a) {
    if (this.css.jq.seekBar) {
      var b = this.css.jq.seekBar.offset();
      a = a.pageX - b.left;
      b = this.css.jq.seekBar.width();
      this.playHead(100 * a / b);
    }
  }, playBar:function(a) {
    this.seekBar(a);
  }, repeat:function() {
    this._loop(!0);
  }, repeatOff:function() {
    this._loop(!1);
  }, _loop:function(b) {
    this.options.loop !== b && (this.options.loop = b, this._updateButtons(), this._trigger(a.jPlayer.event.repeat));
  }, currentTime:function() {
  }, duration:function() {
  }, gui:function() {
  }, noSolution:function() {
  }, option:function(b, e) {
    var d = b;
    if (0 === arguments.length) {
      return a.extend(!0, {}, this.options);
    }
    if ("string" == typeof b) {
      var g = b.split(".");
      if (e === c) {
        d = a.extend(!0, {}, this.options);
        for (var l = 0; l < g.length; l++) {
          if (d[g[l]] === c) {
            return this._warning({type:a.jPlayer.warning.OPTION_KEY, context:b, message:a.jPlayer.warningMsg.OPTION_KEY, hint:a.jPlayer.warningHint.OPTION_KEY}), c;
          }
          d = d[g[l]];
        }
        return d;
      }
      l = d = {};
      for (var k = 0; k < g.length; k++) {
        k < g.length - 1 ? (l[g[k]] = {}, l = l[g[k]]) : l[g[k]] = e;
      }
    }
    return this._setOptions(d), this;
  }, _setOptions:function(b) {
    var e = this;
    return a.each(b, function(a, b) {
      e._setOption(a, b);
    }), this;
  }, _setOption:function(b, e) {
    var c = this;
    switch(b) {
      case "volume":
        this.volume(e);
        break;
      case "muted":
        this._muted(e);
        break;
      case "cssSelectorAncestor":
        this._cssSelectorAncestor(e);
        break;
      case "cssSelector":
        a.each(e, function(a, b) {
          c._cssSelector(a, b);
        });
        break;
      case "fullScreen":
        this.options[b] !== e && (this._removeUiClass(), this.options[b] = e, this._refreshSize());
        break;
      case "size":
        !this.options.fullScreen && this.options[b].cssClass !== e.cssClass && this._removeUiClass();
        this.options[b] = a.extend({}, this.options[b], e);
        this._refreshSize();
        break;
      case "sizeFull":
        this.options.fullScreen && this.options[b].cssClass !== e.cssClass && this._removeUiClass();
        this.options[b] = a.extend({}, this.options[b], e);
        this._refreshSize();
        break;
      case "autohide":
        this.options[b] = a.extend({}, this.options[b], e);
        this._updateAutohide();
        break;
      case "loop":
        this._loop(e);
        break;
      case "nativeVideoControls":
        this.options[b] = a.extend({}, this.options[b], e);
        this.status.nativeVideoControls = this._uaBlocklist(this.options.nativeVideoControls);
        this._restrictNativeVideoControls();
        this._updateNativeVideoControls();
        break;
      case "noFullScreen":
        this.options[b] = a.extend({}, this.options[b], e);
        this.status.nativeVideoControls = this._uaBlocklist(this.options.nativeVideoControls);
        this.status.noFullScreen = this._uaBlocklist(this.options.noFullScreen);
        this._restrictNativeVideoControls();
        this._updateButtons();
        break;
      case "noVolume":
        this.options[b] = a.extend({}, this.options[b], e);
        this.status.noVolume = this._uaBlocklist(this.options.noVolume);
        this._updateVolume();
        this._updateMute();
        break;
      case "emulateHtml":
        this.options[b] !== e && ((this.options[b] = e) ? this._emulateHtmlBridge() : this._destroyHtmlBridge());
    }
    return this;
  }, _refreshSize:function() {
    this._setSize();
    this._addUiClass();
    this._updateSize();
    this._updateButtons();
    this._updateAutohide();
    this._trigger(a.jPlayer.event.resize);
  }, _setSize:function() {
    this.options.fullScreen ? (this.status.width = this.options.sizeFull.width, this.status.height = this.options.sizeFull.height, this.status.cssClass = this.options.sizeFull.cssClass) : (this.status.width = this.options.size.width, this.status.height = this.options.size.height, this.status.cssClass = this.options.size.cssClass);
    this.element.css({width:this.status.width, height:this.status.height});
  }, _addUiClass:function() {
    this.ancestorJq.length && this.ancestorJq.addClass(this.status.cssClass);
  }, _removeUiClass:function() {
    this.ancestorJq.length && this.ancestorJq.removeClass(this.status.cssClass);
  }, _updateSize:function() {
    this.internal.poster.jq.css({width:this.status.width, height:this.status.height});
    !this.status.waitForPlay && this.html.active && this.status.video || this.html.video.available && this.html.used && this.status.nativeVideoControls ? this.internal.video.jq.css({width:this.status.width, height:this.status.height}) : !this.status.waitForPlay && this.flash.active && this.status.video && this.internal.flash.jq.css({width:this.status.width, height:this.status.height});
  }, _updateAutohide:function() {
    var a = this, e = function() {
      a.css.jq.gui.fadeIn(a.options.autohide.fadeIn, function() {
        clearTimeout(a.internal.autohideId);
        a.internal.autohideId = setTimeout(function() {
          a.css.jq.gui.fadeOut(a.options.autohide.fadeOut);
        }, a.options.autohide.hold);
      });
    };
    this.css.jq.gui.length && (this.css.jq.gui.stop(!0, !0), clearTimeout(this.internal.autohideId), this.element.unbind(".jPlayerAutohide"), this.css.jq.gui.unbind(".jPlayerAutohide"), this.status.nativeVideoControls ? this.css.jq.gui.hide() : this.options.fullScreen && this.options.autohide.full || !this.options.fullScreen && this.options.autohide.restored ? (this.element.bind("mousemove.jPlayer.jPlayerAutohide", e), this.css.jq.gui.bind("mousemove.jPlayer.jPlayerAutohide", e), this.css.jq.gui.hide()) : 
    this.css.jq.gui.show());
  }, fullScreen:function() {
    this._setOption("fullScreen", !0);
  }, restoreScreen:function() {
    this._setOption("fullScreen", !1);
  }, _html_initMedia:function() {
    this.htmlElement.media.src = this.status.src;
    "none" !== this.options.preload && this._html_load();
    this._trigger(a.jPlayer.event.timeupdate);
  }, _html_setAudio:function(b) {
    var e = this;
    a.each(this.formats, function(a, c) {
      if (e.html.support[c] && b[c]) {
        return e.status.src = b[c], e.status.format[c] = !0, e.status.formatType = c, !1;
      }
    });
    this.htmlElement.media = this.htmlElement.audio;
    this._html_initMedia();
  }, _html_setVideo:function(b) {
    var e = this;
    a.each(this.formats, function(a, c) {
      if (e.html.support[c] && b[c]) {
        return e.status.src = b[c], e.status.format[c] = !0, e.status.formatType = c, !1;
      }
    });
    this.status.nativeVideoControls && (this.htmlElement.video.poster = this._validString(b.poster) ? b.poster : "");
    this.htmlElement.media = this.htmlElement.video;
    this._html_initMedia();
  }, _html_resetMedia:function() {
    this.htmlElement.media && (this.htmlElement.media.id === this.internal.video.id && !this.status.nativeVideoControls && this.internal.video.jq.css({width:"0px", height:"0px"}), this.htmlElement.media.pause());
  }, _html_clearMedia:function() {
    this.htmlElement.media && (this.htmlElement.media.src = "", this.htmlElement.media.load());
  }, _html_load:function() {
    this.status.waitForLoad && (this.status.waitForLoad = !1, this.htmlElement.media.load());
    clearTimeout(this.internal.htmlDlyCmdId);
  }, _html_play:function(a) {
    var b = this;
    this._html_load();
    this.htmlElement.media.play();
    if (!isNaN(a)) {
      try {
        this.htmlElement.media.currentTime = a;
      } catch (f) {
        this.internal.htmlDlyCmdId = setTimeout(function() {
          b.play(a);
        }, 100);
        return;
      }
    }
    this._html_checkWaitForPlay();
  }, _html_pause:function(a) {
    var b = this;
    0 < a ? this._html_load() : clearTimeout(this.internal.htmlDlyCmdId);
    this.htmlElement.media.pause();
    if (!isNaN(a)) {
      try {
        this.htmlElement.media.currentTime = a;
      } catch (f) {
        this.internal.htmlDlyCmdId = setTimeout(function() {
          b.pause(a);
        }, 100);
        return;
      }
    }
    0 < a && this._html_checkWaitForPlay();
  }, _html_playHead:function(a) {
    var b = this;
    this._html_load();
    try {
      if ("object" == typeof this.htmlElement.media.seekable && 0 < this.htmlElement.media.seekable.length) {
        this.htmlElement.media.currentTime = a * this.htmlElement.media.seekable.end(this.htmlElement.media.seekable.length - 1) / 100;
      } else {
        if (!(0 < this.htmlElement.media.duration) || isNaN(this.htmlElement.media.duration)) {
          throw "e";
        }
        this.htmlElement.media.currentTime = a * this.htmlElement.media.duration / 100;
      }
    } catch (f) {
      this.internal.htmlDlyCmdId = setTimeout(function() {
        b.playHead(a);
      }, 100);
      return;
    }
    this.status.waitForLoad || this._html_checkWaitForPlay();
  }, _html_checkWaitForPlay:function() {
    this.status.waitForPlay && (this.status.waitForPlay = !1, this.css.jq.videoPlay.length && this.css.jq.videoPlay.hide(), this.status.video && (this.internal.poster.jq.hide(), this.internal.video.jq.css({width:this.status.width, height:this.status.height})));
  }, _html_volume:function(a) {
    this.html.audio.available && (this.htmlElement.audio.volume = a);
    this.html.video.available && (this.htmlElement.video.volume = a);
  }, _html_mute:function(a) {
    this.html.audio.available && (this.htmlElement.audio.muted = a);
    this.html.video.available && (this.htmlElement.video.muted = a);
  }, _flash_setAudio:function(b) {
    var e = this;
    try {
      if (a.each(this.formats, function(a, c) {
        if (e.flash.support[c] && b[c]) {
          switch(c) {
            case "m4a":
            case "fla":
              e._getMovie().fl_setAudio_m4a(b[c]);
              break;
            case "mp3":
              e._getMovie().fl_setAudio_mp3(b[c]);
          }
          return e.status.src = b[c], e.status.format[c] = !0, e.status.formatType = c, !1;
        }
      }), "auto" === this.options.preload) {
        this._flash_load(), this.status.waitForLoad = !1;
      }
    } catch (f) {
      this._flashError(f);
    }
  }, _flash_setVideo:function(b) {
    var e = this;
    try {
      if (a.each(this.formats, function(a, c) {
        if (e.flash.support[c] && b[c]) {
          switch(c) {
            case "m4v":
            case "flv":
              e._getMovie().fl_setVideo_m4v(b[c]);
          }
          return e.status.src = b[c], e.status.format[c] = !0, e.status.formatType = c, !1;
        }
      }), "auto" === this.options.preload) {
        this._flash_load(), this.status.waitForLoad = !1;
      }
    } catch (f) {
      this._flashError(f);
    }
  }, _flash_resetMedia:function() {
    this.internal.flash.jq.css({width:"0px", height:"0px"});
    this._flash_pause(NaN);
  }, _flash_clearMedia:function() {
    try {
      this._getMovie().fl_clearMedia();
    } catch (b) {
      this._flashError(b);
    }
  }, _flash_load:function() {
    try {
      this._getMovie().fl_load();
    } catch (b) {
      this._flashError(b);
    }
    this.status.waitForLoad = !1;
  }, _flash_play:function(a) {
    try {
      this._getMovie().fl_play(a);
    } catch (e) {
      this._flashError(e);
    }
    this.status.waitForLoad = !1;
    this._flash_checkWaitForPlay();
  }, _flash_pause:function(a) {
    try {
      this._getMovie().fl_pause(a);
    } catch (e) {
      this._flashError(e);
    }
    0 < a && (this.status.waitForLoad = !1, this._flash_checkWaitForPlay());
  }, _flash_playHead:function(a) {
    try {
      this._getMovie().fl_play_head(a);
    } catch (e) {
      this._flashError(e);
    }
    this.status.waitForLoad || this._flash_checkWaitForPlay();
  }, _flash_checkWaitForPlay:function() {
    this.status.waitForPlay && (this.status.waitForPlay = !1, this.css.jq.videoPlay.length && this.css.jq.videoPlay.hide(), this.status.video && (this.internal.poster.jq.hide(), this.internal.flash.jq.css({width:this.status.width, height:this.status.height})));
  }, _flash_volume:function(a) {
    try {
      this._getMovie().fl_volume(a);
    } catch (e) {
      this._flashError(e);
    }
  }, _flash_mute:function(a) {
    try {
      this._getMovie().fl_mute(a);
    } catch (e) {
      this._flashError(e);
    }
  }, _getMovie:function() {
    return document[this.internal.flash.id];
  }, _checkForFlash:function(a) {
    var b = !1;
    if (window.ActiveXObject) {
      try {
        new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + a), b = !0;
      } catch (f) {
      }
    } else {
      navigator.plugins && 0 < navigator.mimeTypes.length && navigator.plugins["Shockwave Flash"] && navigator.plugins["Shockwave Flash"].description.replace(/.*\s(\d+\.\d+).*/, "$1") >= a && (b = !0);
    }
    return b;
  }, _validString:function(a) {
    return a && "string" == typeof a;
  }, _limitValue:function(a, e, c) {
    return a < e ? e : a > c ? c : a;
  }, _urlNotSetError:function(b) {
    this._error({type:a.jPlayer.error.URL_NOT_SET, context:b, message:a.jPlayer.errorMsg.URL_NOT_SET, hint:a.jPlayer.errorHint.URL_NOT_SET});
  }, _flashError:function(b) {
    var e = this.internal.ready ? "FLASH_DISABLED" : "FLASH";
    this._error({type:a.jPlayer.error[e], context:this.internal.flash.swf, message:a.jPlayer.errorMsg[e] + b.message, hint:a.jPlayer.errorHint[e]});
    this.internal.flash.jq.css({width:"1px", height:"1px"});
  }, _error:function(b) {
    this._trigger(a.jPlayer.event.error, b);
    this.options.errorAlerts && this._alert("Error!" + (b.message ? "\n\n" + b.message : "") + (b.hint ? "\n\n" + b.hint : "") + "\n\nContext: " + b.context);
  }, _warning:function(b) {
    this._trigger(a.jPlayer.event.warning, c, b);
    this.options.warningAlerts && this._alert("Warning!" + (b.message ? "\n\n" + b.message : "") + (b.hint ? "\n\n" + b.hint : "") + "\n\nContext: " + b.context);
  }, _alert:function(a) {
    alert("jPlayer " + this.version.script + " : id='" + this.internal.self.id + "' : " + a);
  }, _emulateHtmlBridge:function() {
    var b = this;
    a.each(a.jPlayer.emulateMethods.split(/\s+/g), function(a, c) {
      b.internal.domNode[c] = function(a) {
        b[c](a);
      };
    });
    a.each(a.jPlayer.event, function(e, c) {
      var d = !0;
      a.each(a.jPlayer.reservedEvent.split(/\s+/g), function(a, b) {
        if (b === e) {
          return d = !1;
        }
      });
      d && b.element.bind(c + ".jPlayer.jPlayerHtml", function() {
        b._emulateHtmlUpdate();
        var a = document.createEvent("Event");
        a.initEvent(e, !1, !0);
        b.internal.domNode.dispatchEvent(a);
      });
    });
  }, _emulateHtmlUpdate:function() {
    var b = this;
    a.each(a.jPlayer.emulateStatus.split(/\s+/g), function(a, c) {
      b.internal.domNode[c] = b.status[c];
    });
    a.each(a.jPlayer.emulateOptions.split(/\s+/g), function(a, c) {
      b.internal.domNode[c] = b.options[c];
    });
  }, _destroyHtmlBridge:function() {
    var b = this;
    this.element.unbind(".jPlayerHtml");
    a.each((a.jPlayer.emulateMethods + " " + a.jPlayer.emulateStatus + " " + a.jPlayer.emulateOptions).split(/\s+/g), function(a, c) {
      delete b.internal.domNode[c];
    });
  }};
  a.jPlayer.error = {FLASH:"e_flash", FLASH_DISABLED:"e_flash_disabled", NO_SOLUTION:"e_no_solution", NO_SUPPORT:"e_no_support", URL:"e_url", URL_NOT_SET:"e_url_not_set", VERSION:"e_version"};
  a.jPlayer.errorMsg = {FLASH:"jPlayer's Flash fallback is not configured correctly, or a command was issued before the jPlayer Ready event. Details: ", FLASH_DISABLED:"jPlayer's Flash fallback has been disabled by the browser due to the CSS rules you have used. Details: ", NO_SOLUTION:"No solution can be found by jPlayer in this browser. Neither HTML nor Flash can be used.", NO_SUPPORT:"It is not possible to play any media format provided in setMedia() on this browser using your current options.", 
  URL:"Media URL could not be loaded.", URL_NOT_SET:"Attempt to issue media playback commands, while no media url is set.", VERSION:"jPlayer " + a.jPlayer.prototype.version.script + " needs Jplayer.swf version " + a.jPlayer.prototype.version.needFlash + " but found "};
  a.jPlayer.errorHint = {FLASH:"Check your swfPath option and that Jplayer.swf is there.", FLASH_DISABLED:"Check that you have not display:none; the jPlayer entity or any ancestor.", NO_SOLUTION:"Review the jPlayer options: support and supplied.", NO_SUPPORT:"Video or audio formats defined in the supplied option are missing.", URL:"Check media URL is valid.", URL_NOT_SET:"Use setMedia() to set the media URL.", VERSION:"Update jPlayer files."};
  a.jPlayer.warning = {CSS_SELECTOR_COUNT:"e_css_selector_count", CSS_SELECTOR_METHOD:"e_css_selector_method", CSS_SELECTOR_STRING:"e_css_selector_string", OPTION_KEY:"e_option_key"};
  a.jPlayer.warningMsg = {CSS_SELECTOR_COUNT:"The number of css selectors found did not equal one: ", CSS_SELECTOR_METHOD:"The methodName given in jPlayer('cssSelector') is not a valid jPlayer method.", CSS_SELECTOR_STRING:"The methodCssSelector given in jPlayer('cssSelector') is not a String or is empty.", OPTION_KEY:"The option requested in jPlayer('option') is undefined."};
  a.jPlayer.warningHint = {CSS_SELECTOR_COUNT:"Check your css selector and the ancestor.", CSS_SELECTOR_METHOD:"Check your method name.", CSS_SELECTOR_STRING:"Check your css selector is a string.", OPTION_KEY:"Check your option name."};
})(jQuery);
(function(a) {
  a.toJSON = function(b) {
    if ("object" == typeof JSON && JSON.stringify) {
      return JSON.stringify(b);
    }
    var e = typeof b;
    if (null === b) {
      return "null";
    }
    if ("undefined" != e) {
      if ("number" == e || "boolean" == e) {
        return b + "";
      }
      if ("string" == e) {
        return a.quoteString(b);
      }
      if ("object" == e) {
        if ("function" == typeof b.toJSON) {
          return a.toJSON(b.toJSON());
        }
        if (b.constructor === Date) {
          var c = b.getUTCMonth() + 1;
          10 > c && (c = "0" + c);
          var d = b.getUTCDate();
          10 > d && (d = "0" + d);
          e = b.getUTCFullYear();
          var l = b.getUTCHours();
          10 > l && (l = "0" + l);
          var k = b.getUTCMinutes();
          10 > k && (k = "0" + k);
          var n = b.getUTCSeconds();
          10 > n && (n = "0" + n);
          b = b.getUTCMilliseconds();
          return 100 > b && (b = "0" + b), 10 > b && (b = "0" + b), '"' + e + "-" + c + "-" + d + "T" + l + ":" + k + ":" + n + "." + b + 'Z"';
        }
        if (b.constructor === Array) {
          c = [];
          for (d = 0; d < b.length; d++) {
            c.push(a.toJSON(b[d]) || "null");
          }
          return "[" + c.join(",") + "]";
        }
        c = [];
        for (d in b) {
          e = typeof d;
          if ("number" == e) {
            e = '"' + d + '"';
          } else {
            if ("string" != e) {
              continue;
            }
            e = a.quoteString(d);
          }
          "function" != typeof b[d] && (l = a.toJSON(b[d]), c.push(e + ":" + l));
        }
        return "{" + c.join(", ") + "}";
      }
    }
  };
  a.evalJSON = function(a) {
    return "object" == typeof JSON && JSON.parse ? JSON.parse(a) : eval("(" + a + ")");
  };
  a.secureEvalJSON = function(a) {
    if ("object" == typeof JSON && JSON.parse) {
      return JSON.parse(a);
    }
    var b = a.replace(/\\["\\\/bfnrtu]/g, "@");
    b = b.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]");
    b = b.replace(/(?:^|:|,)(?:\s*\[)+/g, "");
    if (/^[\],:{}\s]*$/.test(b)) {
      return eval("(" + a + ")");
    }
    throw new SyntaxError("Error parsing JSON, source is not valid.");
  };
  a.quoteString = function(a) {
    return a.match(c) ? '"' + a.replace(c, function(a) {
      var b = d[a];
      return "string" == typeof b ? b : (b = a.charCodeAt(), "\\u00" + Math.floor(b / 16).toString(16) + (b % 16).toString(16));
    }) + '"' : '"' + a + '"';
  };
  var c = /["\\\x00-\x1f\x7f-\x9f]/g, d = {"\b":"\\b", "\t":"\\t", "\n":"\\n", "\f":"\\f", "\r":"\\r", '"':'\\"', "\\":"\\\\"};
})(jQuery);
jQuery.ui || function(a) {
  a.ui = {version:"1.8", plugin:{add:function(c, d, b) {
    c = a.ui[c].prototype;
    for (var e in b) {
      c.plugins[e] = c.plugins[e] || [], c.plugins[e].push([d, b[e]]);
    }
  }, call:function(a, d, b) {
    if ((d = a.plugins[d]) && a.element[0].parentNode) {
      for (var e = 0; e < d.length; e++) {
        a.options[d[e][0]] && d[e][1].apply(a.element, b);
      }
    }
  }}, contains:function(a, d) {
    return document.compareDocumentPosition ? a.compareDocumentPosition(d) & 16 : a !== d && a.contains(d);
  }, hasScroll:function(c, d) {
    if ("hidden" == a(c).css("overflow")) {
      return !1;
    }
    d = d && "left" == d ? "scrollLeft" : "scrollTop";
    var b = !1;
    return 0 < c[d] ? !0 : (c[d] = 1, b = 0 < c[d], c[d] = 0, b);
  }, isOverAxis:function(a, d, b) {
    return a > d && a < d + b;
  }, isOver:function(c, d, b, e, f, g) {
    return a.ui.isOverAxis(c, b, f) && a.ui.isOverAxis(d, e, g);
  }, keyCode:{BACKSPACE:8, CAPS_LOCK:20, COMMA:188, CONTROL:17, DELETE:46, DOWN:40, END:35, ENTER:13, ESCAPE:27, HOME:36, INSERT:45, LEFT:37, NUMPAD_ADD:107, NUMPAD_DECIMAL:110, NUMPAD_DIVIDE:111, NUMPAD_ENTER:108, NUMPAD_MULTIPLY:106, NUMPAD_SUBTRACT:109, PAGE_DOWN:34, PAGE_UP:33, PERIOD:190, RIGHT:39, SHIFT:16, SPACE:32, TAB:9, UP:38}};
  a.fn.extend({_focus:a.fn.focus, focus:function(c, d) {
    return "number" == typeof c ? this.each(function() {
      var b = this;
      setTimeout(function() {
        a(b).focus();
        d && d.call(b);
      }, c);
    }) : this._focus.apply(this, arguments);
  }, enableSelection:function() {
    return this.attr("unselectable", "off").css("MozUserSelect", "").unbind("selectstart.ui");
  }, disableSelection:function() {
    return this.attr("unselectable", "on").css("MozUserSelect", "none").bind("selectstart.ui", function() {
      return !1;
    });
  }, scrollParent:function() {
    var c;
    return a.browser.msie && /(static|relative)/.test(this.css("position")) || /absolute/.test(this.css("position")) ? c = this.parents().filter(function() {
      return /(relative|absolute|fixed)/.test(a.curCSS(this, "position", 1)) && /(auto|scroll)/.test(a.curCSS(this, "overflow", 1) + a.curCSS(this, "overflow-y", 1) + a.curCSS(this, "overflow-x", 1));
    }).eq(0) : c = this.parents().filter(function() {
      return /(auto|scroll)/.test(a.curCSS(this, "overflow", 1) + a.curCSS(this, "overflow-y", 1) + a.curCSS(this, "overflow-x", 1));
    }).eq(0), /fixed/.test(this.css("position")) || !c.length ? a(document) : c;
  }, zIndex:function(c) {
    if (void 0 !== c) {
      return this.css("zIndex", c);
    }
    if (this.length) {
      c = a(this[0]);
      for (var d; c.length && c[0] !== document;) {
        d = c.css("position");
        if ("absolute" == d || "relative" == d || "fixed" == d) {
          if (d = parseInt(c.css("zIndex")), !isNaN(d) && 0 != d) {
            return d;
          }
        }
        c = c.parent();
      }
    }
    return 0;
  }});
  a.extend(a.expr[":"], {data:function(c, d, b) {
    return !!a.data(c, b[3]);
  }, focusable:function(c) {
    var d = c.nodeName.toLowerCase(), b = a.attr(c, "tabindex");
    return (/input|select|textarea|button|object/.test(d) ? !c.disabled : "a" == d || "area" == d ? c.href || !isNaN(b) : !isNaN(b)) && !a(c)["area" == d ? "parents" : "closest"](":hidden").length;
  }, tabbable:function(c) {
    var d = a.attr(c, "tabindex");
    return (isNaN(d) || 0 <= d) && a(c).is(":focusable");
  }});
}(jQuery);
(function(a) {
  var c = a.fn.remove;
  a.fn.remove = function(d, b) {
    return this.each(function() {
      return b || (!d || a.filter(d, [this]).length) && a("*", this).add(this).each(function() {
        a(this).triggerHandler("remove");
      }), c.call(a(this), d, b);
    });
  };
  a.widget = function(c, b, e) {
    var d = c.split(".")[0];
    c = c.split(".")[1];
    var g = d + "-" + c;
    e || (e = b, b = a.Widget);
    a.expr[":"][g] = function(b) {
      return !!a.data(b, c);
    };
    a[d] = a[d] || {};
    a[d][c] = function(a, b) {
      arguments.length && this._createWidget(a, b);
    };
    b = new b;
    b.options = a.extend({}, b.options);
    a[d][c].prototype = a.extend(!0, b, {namespace:d, widgetName:c, widgetEventPrefix:a[d][c].prototype.widgetEventPrefix || c, widgetBaseClass:g}, e);
    a.widget.bridge(c, a[d][c]);
  };
  a.widget.bridge = function(c, b) {
    a.fn[c] = function(e) {
      var d = "string" == typeof e, g = Array.prototype.slice.call(arguments, 1), l = this;
      return e = !d && g.length ? a.extend.apply(null, [!0, e].concat(g)) : e, d && "_" === e.substring(0, 1) ? l : (d ? this.each(function() {
        var b = a.data(this, c), d = b && a.isFunction(b[e]) ? b[e].apply(b, g) : b;
        if (d !== b && void 0 !== d) {
          return l = d, !1;
        }
      }) : this.each(function() {
        var d = a.data(this, c);
        d ? (e && d.option(e), d._init()) : a.data(this, c, new b(e, this));
      }), l);
    };
  };
  a.Widget = function(a, b) {
    arguments.length && this._createWidget(a, b);
  };
  a.Widget.prototype = {widgetName:"widget", widgetEventPrefix:"", options:{disabled:!1}, _createWidget:function(c, b) {
    this.element = a(b).data(this.widgetName, this);
    this.options = a.extend(!0, {}, this.options, a.metadata && a.metadata.get(b)[this.widgetName], c);
    var e = this;
    this.element.bind("remove." + this.widgetName, function() {
      e.destroy();
    });
    this._create();
    this._init();
  }, _create:function() {
  }, _init:function() {
  }, destroy:function() {
    this.element.unbind("." + this.widgetName).removeData(this.widgetName);
    this.widget().unbind("." + this.widgetName).removeAttr("aria-disabled").removeClass(this.widgetBaseClass + "-disabled " + this.namespace + "-state-disabled");
  }, widget:function() {
    return this.element;
  }, option:function(c, b) {
    var e = c, d = this;
    if (0 === arguments.length) {
      return a.extend({}, d.options);
    }
    if ("string" == typeof c) {
      if (void 0 === b) {
        return this.options[c];
      }
      e = {};
      e[c] = b;
    }
    return a.each(e, function(a, b) {
      d._setOption(a, b);
    }), d;
  }, _setOption:function(a, b) {
    return this.options[a] = b, "disabled" === a && this.widget()[b ? "addClass" : "removeClass"](this.widgetBaseClass + "-disabled " + this.namespace + "-state-disabled").attr("aria-disabled", b), this;
  }, enable:function() {
    return this._setOption("disabled", !1);
  }, disable:function() {
    return this._setOption("disabled", !0);
  }, _trigger:function(c, b, e) {
    var d = this.options[c];
    b = a.Event(b);
    b.type = (c === this.widgetEventPrefix ? c : this.widgetEventPrefix + c).toLowerCase();
    e = e || {};
    if (b.originalEvent) {
      c = a.event.props.length;
      for (var g; c;) {
        g = a.event.props[--c], b[g] = b.originalEvent[g];
      }
    }
    return this.element.trigger(b, e), !(a.isFunction(d) && !1 === d.call(this.element[0], b, e) || b.isDefaultPrevented());
  }};
})(jQuery);
(function(a) {
  a.widget("ui.mouse", {options:{cancel:":input,option", distance:1, delay:0}, _mouseInit:function() {
    var a = this;
    this.element.bind("mousedown." + this.widgetName, function(c) {
      return a._mouseDown(c);
    }).bind("click." + this.widgetName, function(c) {
      if (a._preventClickEvent) {
        return a._preventClickEvent = !1, c.stopImmediatePropagation(), !1;
      }
    });
    this.started = !1;
  }, _mouseDestroy:function() {
    this.element.unbind("." + this.widgetName);
  }, _mouseDown:function(c) {
    c.originalEvent = c.originalEvent || {};
    if (!c.originalEvent.mouseHandled) {
      this._mouseStarted && this._mouseUp(c);
      this._mouseDownEvent = c;
      var d = this, b = 1 == c.which, e = "string" == typeof this.options.cancel ? a(c.target).parents().add(c.target).filter(this.options.cancel).length : !1;
      if (!b || e || !this._mouseCapture(c)) {
        return !0;
      }
      (this.mouseDelayMet = !this.options.delay) || (this._mouseDelayTimer = setTimeout(function() {
        d.mouseDelayMet = !0;
      }, this.options.delay));
      return this._mouseDistanceMet(c) && this._mouseDelayMet(c) && (this._mouseStarted = !1 !== this._mouseStart(c), !this._mouseStarted) ? (c.preventDefault(), !0) : (this._mouseMoveDelegate = function(a) {
        return d._mouseMove(a);
      }, this._mouseUpDelegate = function(a) {
        return d._mouseUp(a);
      }, a(document).bind("mousemove." + this.widgetName, this._mouseMoveDelegate).bind("mouseup." + this.widgetName, this._mouseUpDelegate), a.browser.safari || c.preventDefault(), c.originalEvent.mouseHandled = !0, !0);
    }
  }, _mouseMove:function(c) {
    return a.browser.msie && !c.button ? this._mouseUp(c) : this._mouseStarted ? (this._mouseDrag(c), c.preventDefault()) : (this._mouseDistanceMet(c) && this._mouseDelayMet(c) && (this._mouseStarted = !1 !== this._mouseStart(this._mouseDownEvent, c), this._mouseStarted ? this._mouseDrag(c) : this._mouseUp(c)), !this._mouseStarted);
  }, _mouseUp:function(c) {
    return a(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate), this._mouseStarted && (this._mouseStarted = !1, this._preventClickEvent = c.target == this._mouseDownEvent.target, this._mouseStop(c)), !1;
  }, _mouseDistanceMet:function(a) {
    return Math.max(Math.abs(this._mouseDownEvent.pageX - a.pageX), Math.abs(this._mouseDownEvent.pageY - a.pageY)) >= this.options.distance;
  }, _mouseDelayMet:function(a) {
    return this.mouseDelayMet;
  }, _mouseStart:function(a) {
  }, _mouseDrag:function(a) {
  }, _mouseStop:function(a) {
  }, _mouseCapture:function(a) {
    return !0;
  }});
})(jQuery);
(function(a) {
  a.ui = a.ui || {};
  var c = /left|center|right/, d = /top|center|bottom/, b = a.fn.position, e = a.fn.offset;
  a.fn.position = function(e) {
    if (!e || !e.of) {
      return b.apply(this, arguments);
    }
    e = a.extend({}, e);
    var f = a(e.of), l = (e.collision || "flip").split(" "), k = e.offset ? e.offset.split(" ") : [0, 0], n, q, u;
    return 9 === e.of.nodeType ? (n = f.width(), q = f.height(), u = {top:0, left:0}) : e.of.scrollTo && e.of.document ? (n = f.width(), q = f.height(), u = {top:f.scrollTop(), left:f.scrollLeft()}) : e.of.preventDefault ? (e.at = "left top", n = q = 0, u = {top:e.of.pageY, left:e.of.pageX}) : (n = f.outerWidth(), q = f.outerHeight(), u = f.offset()), a.each(["my", "at"], function() {
      var a = (e[this] || "").split(" ");
      1 === a.length && (a = c.test(a[0]) ? a.concat(["center"]) : d.test(a[0]) ? ["center"].concat(a) : ["center", "center"]);
      a[0] = c.test(a[0]) ? a[0] : "center";
      a[1] = d.test(a[1]) ? a[1] : "center";
      e[this] = a;
    }), 1 === l.length && (l[1] = l[0]), k[0] = parseInt(k[0], 10) || 0, 1 === k.length && (k[1] = k[0]), k[1] = parseInt(k[1], 10) || 0, "right" === e.at[0] ? u.left += n : "center" === e.at[0] && (u.left += n / 2), "bottom" === e.at[1] ? u.top += q : "center" === e.at[1] && (u.top += q / 2), u.left += k[0], u.top += k[1], this.each(function() {
      var b = a(this), c = b.outerWidth(), d = b.outerHeight(), f = a.extend({}, u);
      "right" === e.my[0] ? f.left -= c : "center" === e.my[0] && (f.left -= c / 2);
      "bottom" === e.my[1] ? f.top -= d : "center" === e.my[1] && (f.top -= d / 2);
      a.each(["left", "top"], function(b, g) {
        a.ui.position[l[b]] && a.ui.position[l[b]][g](f, {targetWidth:n, targetHeight:q, elemWidth:c, elemHeight:d, offset:k, my:e.my, at:e.at});
      });
      a.fn.bgiframe && b.bgiframe();
      b.offset(a.extend(f, {using:e.using}));
    });
  };
  a.ui.position = {fit:{left:function(b, e) {
    var c = a(window);
    e = b.left + e.elemWidth - c.width() - c.scrollLeft();
    b.left = 0 < e ? b.left - e : Math.max(0, b.left);
  }, top:function(b, e) {
    var c = a(window);
    e = b.top + e.elemHeight - c.height() - c.scrollTop();
    b.top = 0 < e ? b.top - e : Math.max(0, b.top);
  }}, flip:{left:function(b, e) {
    if ("center" !== e.at[0]) {
      var c = a(window);
      c = b.left + e.elemWidth - c.width() - c.scrollLeft();
      var d = "left" === e.my[0] ? -e.elemWidth : "right" === e.my[0] ? e.elemWidth : 0, f = -2 * e.offset[0];
      b.left += 0 > b.left ? d + e.targetWidth + f : 0 < c ? d - e.targetWidth + f : 0;
    }
  }, top:function(b, e) {
    if ("center" !== e.at[1]) {
      var c = a(window);
      c = b.top + e.elemHeight - c.height() - c.scrollTop();
      var d = "top" === e.my[1] ? -e.elemHeight : "bottom" === e.my[1] ? e.elemHeight : 0, f = "top" === e.at[1] ? e.targetHeight : -e.targetHeight, g = -2 * e.offset[1];
      b.top += 0 > b.top ? d + e.targetHeight + g : 0 < c ? d + f + g : 0;
    }
  }}};
  a.offset.setOffset || (a.offset.setOffset = function(b, e) {
    /static/.test(a.curCSS(b, "position")) && (b.style.position = "relative");
    var c = a(b), d = c.offset(), f = parseInt(a.curCSS(b, "top", !0), 10) || 0, g = parseInt(a.curCSS(b, "left", !0), 10) || 0;
    d = {top:e.top - d.top + f, left:e.left - d.left + g};
    "using" in e ? e.using.call(b, d) : c.css(d);
  }, a.fn.offset = function(b) {
    var c = this[0];
    return c && c.ownerDocument ? b ? this.each(function() {
      a.offset.setOffset(this, b);
    }) : e.call(this) : null;
  });
})(jQuery);
(function(a) {
  a.widget("ui.draggable", a.ui.mouse, {widgetEventPrefix:"drag", options:{addClasses:!0, appendTo:"parent", axis:!1, connectToSortable:!1, containment:!1, cursor:"auto", cursorAt:!1, grid:!1, handle:!1, helper:"original", iframeFix:!1, opacity:!1, refreshPositions:!1, revert:!1, revertDuration:500, scope:"default", scroll:!0, scrollSensitivity:20, scrollSpeed:20, snap:!1, snapMode:"both", snapTolerance:20, stack:!1, zIndex:!1}, _create:function() {
    "original" == this.options.helper && !/^(?:r|a|f)/.test(this.element.css("position")) && (this.element[0].style.position = "relative");
    this.options.addClasses && this.element.addClass("ui-draggable");
    this.options.disabled && this.element.addClass("ui-draggable-disabled");
    this._mouseInit();
  }, destroy:function() {
    if (this.element.data("draggable")) {
      return this.element.removeData("draggable").unbind(".draggable").removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled"), this._mouseDestroy(), this;
    }
  }, _mouseCapture:function(c) {
    var d = this.options;
    return this.helper || d.disabled || a(c.target).is(".ui-resizable-handle") ? !1 : (this.handle = this._getHandle(c), this.handle ? !0 : !1);
  }, _mouseStart:function(c) {
    var d = this.options;
    return this.helper = this._createHelper(c), this._cacheHelperProportions(), a.ui.ddmanager && (a.ui.ddmanager.current = this), this._cacheMargins(), this.cssPosition = this.helper.css("position"), this.scrollParent = this.helper.scrollParent(), this.offset = this.positionAbs = this.element.offset(), this.offset = {top:this.offset.top - this.margins.top, left:this.offset.left - this.margins.left}, a.extend(this.offset, {click:{left:c.pageX - this.offset.left, top:c.pageY - this.offset.top}, parent:this._getParentOffset(), 
    relative:this._getRelativeOffset()}), this.originalPosition = this.position = this._generatePosition(c), this.originalPageX = c.pageX, this.originalPageY = c.pageY, d.cursorAt && this._adjustOffsetFromHelper(d.cursorAt), d.containment && this._setContainment(), !1 === this._trigger("start", c) ? (this._clear(), !1) : (this._cacheHelperProportions(), a.ui.ddmanager && !d.dropBehaviour && a.ui.ddmanager.prepareOffsets(this, c), this.helper.addClass("ui-draggable-dragging"), this._mouseDrag(c, !0), 
    !0);
  }, _mouseDrag:function(c, d) {
    this.position = this._generatePosition(c);
    this.positionAbs = this._convertPositionTo("absolute");
    if (!d) {
      d = this._uiHash();
      if (!1 === this._trigger("drag", c, d)) {
        return this._mouseUp({}), !1;
      }
      this.position = d.position;
    }
    this.options.axis && "y" == this.options.axis || (this.helper[0].style.left = this.position.left + "px");
    this.options.axis && "x" == this.options.axis || (this.helper[0].style.top = this.position.top + "px");
    return a.ui.ddmanager && a.ui.ddmanager.drag(this, c), !1;
  }, _mouseStop:function(c) {
    var d = !1;
    a.ui.ddmanager && !this.options.dropBehaviour && (d = a.ui.ddmanager.drop(this, c));
    this.dropped && (d = this.dropped, this.dropped = !1);
    if (!this.element[0] || !this.element[0].parentNode) {
      return !1;
    }
    if ("invalid" == this.options.revert && !d || "valid" == this.options.revert && d || !0 === this.options.revert || a.isFunction(this.options.revert) && this.options.revert.call(this.element, d)) {
      var b = this;
      a(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function() {
        !1 !== b._trigger("stop", c) && b._clear();
      });
    } else {
      !1 !== this._trigger("stop", c) && this._clear();
    }
    return !1;
  }, cancel:function() {
    return this.helper.is(".ui-draggable-dragging") ? this._mouseUp({}) : this._clear(), this;
  }, _getHandle:function(c) {
    var d = this.options.handle && a(this.options.handle, this.element).length ? !1 : !0;
    return a(this.options.handle, this.element).find("*").andSelf().each(function() {
      this == c.target && (d = !0);
    }), d;
  }, _createHelper:function(c) {
    var d = this.options;
    c = a.isFunction(d.helper) ? a(d.helper.apply(this.element[0], [c])) : "clone" == d.helper ? this.element.clone() : this.element;
    return c.parents("body").length || c.appendTo("parent" == d.appendTo ? this.element[0].parentNode : d.appendTo), c[0] != this.element[0] && !/(fixed|absolute)/.test(c.css("position")) && c.css("position", "absolute"), c;
  }, _adjustOffsetFromHelper:function(c) {
    "string" == typeof c && (c = c.split(" "));
    a.isArray(c) && (c = {left:+c[0], top:+c[1] || 0});
    "left" in c && (this.offset.click.left = c.left + this.margins.left);
    "right" in c && (this.offset.click.left = this.helperProportions.width - c.right + this.margins.left);
    "top" in c && (this.offset.click.top = c.top + this.margins.top);
    "bottom" in c && (this.offset.click.top = this.helperProportions.height - c.bottom + this.margins.top);
  }, _getParentOffset:function() {
    this.offsetParent = this.helper.offsetParent();
    var c = this.offsetParent.offset();
    "absolute" == this.cssPosition && this.scrollParent[0] != document && a.ui.contains(this.scrollParent[0], this.offsetParent[0]) && (c.left += this.scrollParent.scrollLeft(), c.top += this.scrollParent.scrollTop());
    if (this.offsetParent[0] == document.body || this.offsetParent[0].tagName && "html" == this.offsetParent[0].tagName.toLowerCase() && a.browser.msie) {
      c = {top:0, left:0};
    }
    return {top:c.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0), left:c.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)};
  }, _getRelativeOffset:function() {
    if ("relative" == this.cssPosition) {
      var a = this.element.position();
      return {top:a.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(), left:a.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft()};
    }
    return {top:0, left:0};
  }, _cacheMargins:function() {
    this.margins = {left:parseInt(this.element.css("marginLeft"), 10) || 0, top:parseInt(this.element.css("marginTop"), 10) || 0};
  }, _cacheHelperProportions:function() {
    this.helperProportions = {width:this.helper.outerWidth(), height:this.helper.outerHeight()};
  }, _setContainment:function() {
    var c = this.options;
    "parent" == c.containment && (c.containment = this.helper[0].parentNode);
    if ("document" == c.containment || "window" == c.containment) {
      this.containment = [0 - this.offset.relative.left - this.offset.parent.left, 0 - this.offset.relative.top - this.offset.parent.top, a("document" == c.containment ? document : window).width() - this.helperProportions.width - this.margins.left, (a("document" == c.containment ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top];
    }
    if (/^(document|window|parent)$/.test(c.containment) || c.containment.constructor == Array) {
      c.containment.constructor == Array && (this.containment = c.containment);
    } else {
      var d = a(c.containment)[0];
      if (d) {
        c = a(c.containment).offset();
        var b = "hidden" != a(d).css("overflow");
        this.containment = [c.left + (parseInt(a(d).css("borderLeftWidth"), 10) || 0) + (parseInt(a(d).css("paddingLeft"), 10) || 0) - this.margins.left, c.top + (parseInt(a(d).css("borderTopWidth"), 10) || 0) + (parseInt(a(d).css("paddingTop"), 10) || 0) - this.margins.top, c.left + (b ? Math.max(d.scrollWidth, d.offsetWidth) : d.offsetWidth) - (parseInt(a(d).css("borderLeftWidth"), 10) || 0) - (parseInt(a(d).css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left, c.top + 
        (b ? Math.max(d.scrollHeight, d.offsetHeight) : d.offsetHeight) - (parseInt(a(d).css("borderTopWidth"), 10) || 0) - (parseInt(a(d).css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top];
      }
    }
  }, _convertPositionTo:function(c, d) {
    d || (d = this.position);
    c = "absolute" == c ? 1 : -1;
    var b = "absolute" != this.cssPosition || this.scrollParent[0] != document && a.ui.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent, e = /(html|body)/i.test(b[0].tagName);
    return {top:d.top + this.offset.relative.top * c + this.offset.parent.top * c - (a.browser.safari && 526 > a.browser.version && "fixed" == this.cssPosition ? 0 : ("fixed" == this.cssPosition ? -this.scrollParent.scrollTop() : e ? 0 : b.scrollTop()) * c), left:d.left + this.offset.relative.left * c + this.offset.parent.left * c - (a.browser.safari && 526 > a.browser.version && "fixed" == this.cssPosition ? 0 : ("fixed" == this.cssPosition ? -this.scrollParent.scrollLeft() : e ? 0 : b.scrollLeft()) * 
    c)};
  }, _generatePosition:function(c) {
    var d = this.options, b = "absolute" != this.cssPosition || this.scrollParent[0] != document && a.ui.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent, e = /(html|body)/i.test(b[0].tagName), f = c.pageX, g = c.pageY;
    this.originalPosition && (this.containment && (c.pageX - this.offset.click.left < this.containment[0] && (f = this.containment[0] + this.offset.click.left), c.pageY - this.offset.click.top < this.containment[1] && (g = this.containment[1] + this.offset.click.top), c.pageX - this.offset.click.left > this.containment[2] && (f = this.containment[2] + this.offset.click.left), c.pageY - this.offset.click.top > this.containment[3] && (g = this.containment[3] + this.offset.click.top)), d.grid && (g = 
    this.originalPageY + Math.round((g - this.originalPageY) / d.grid[1]) * d.grid[1], g = this.containment ? g - this.offset.click.top < this.containment[1] || g - this.offset.click.top > this.containment[3] ? g - this.offset.click.top < this.containment[1] ? g + d.grid[1] : g - d.grid[1] : g : g, f = this.originalPageX + Math.round((f - this.originalPageX) / d.grid[0]) * d.grid[0], f = this.containment ? f - this.offset.click.left < this.containment[0] || f - this.offset.click.left > this.containment[2] ? 
    f - this.offset.click.left < this.containment[0] ? f + d.grid[0] : f - d.grid[0] : f : f));
    return {top:g - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + (a.browser.safari && 526 > a.browser.version && "fixed" == this.cssPosition ? 0 : "fixed" == this.cssPosition ? -this.scrollParent.scrollTop() : e ? 0 : b.scrollTop()), left:f - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + (a.browser.safari && 526 > a.browser.version && "fixed" == this.cssPosition ? 0 : "fixed" == this.cssPosition ? -this.scrollParent.scrollLeft() : e ? 
    0 : b.scrollLeft())};
  }, _clear:function() {
    this.helper.removeClass("ui-draggable-dragging");
    this.helper[0] != this.element[0] && !this.cancelHelperRemoval && this.helper.remove();
    this.helper = null;
    this.cancelHelperRemoval = !1;
  }, _trigger:function(c, d, b) {
    return b = b || this._uiHash(), a.ui.plugin.call(this, c, [d, b]), "drag" == c && (this.positionAbs = this._convertPositionTo("absolute")), a.Widget.prototype._trigger.call(this, c, d, b);
  }, plugins:{}, _uiHash:function(a) {
    return {helper:this.helper, position:this.position, originalPosition:this.originalPosition, offset:this.positionAbs};
  }});
  a.extend(a.ui.draggable, {version:"1.8"});
  a.ui.plugin.add("draggable", "connectToSortable", {start:function(c, d) {
    var b = a(this).data("draggable"), e = b.options, f = a.extend({}, d, {item:b.element});
    b.sortables = [];
    a(e.connectToSortable).each(function() {
      var e = a.data(this, "sortable");
      e && !e.options.disabled && (b.sortables.push({instance:e, shouldRevert:e.options.revert}), e._refreshItems(), e._trigger("activate", c, f));
    });
  }, stop:function(c, d) {
    var b = a(this).data("draggable"), e = a.extend({}, d, {item:b.element});
    a.each(b.sortables, function() {
      this.instance.isOver ? (this.instance.isOver = 0, b.cancelHelperRemoval = !0, this.instance.cancelHelperRemoval = !1, this.shouldRevert && (this.instance.options.revert = !0), this.instance._mouseStop(c), this.instance.options.helper = this.instance.options._helper, "original" == b.options.helper && this.instance.currentItem.css({top:"auto", left:"auto"})) : (this.instance.cancelHelperRemoval = !1, this.instance._trigger("deactivate", c, e));
    });
  }, drag:function(c, d) {
    var b = a(this).data("draggable"), e = this;
    a.each(b.sortables, function(f) {
      this.instance.positionAbs = b.positionAbs;
      this.instance.helperProportions = b.helperProportions;
      this.instance.offset.click = b.offset.click;
      this.instance._intersectsWith(this.instance.containerCache) ? (this.instance.isOver || (this.instance.isOver = 1, this.instance.currentItem = a(e).clone().appendTo(this.instance.element).data("sortable-item", !0), this.instance.options._helper = this.instance.options.helper, this.instance.options.helper = function() {
        return d.helper[0];
      }, c.target = this.instance.currentItem[0], this.instance._mouseCapture(c, !0), this.instance._mouseStart(c, !0, !0), this.instance.offset.click.top = b.offset.click.top, this.instance.offset.click.left = b.offset.click.left, this.instance.offset.parent.left -= b.offset.parent.left - this.instance.offset.parent.left, this.instance.offset.parent.top -= b.offset.parent.top - this.instance.offset.parent.top, b._trigger("toSortable", c), b.dropped = this.instance.element, b.currentItem = b.element, 
      this.instance.fromOutside = b), this.instance.currentItem && this.instance._mouseDrag(c)) : this.instance.isOver && (this.instance.isOver = 0, this.instance.cancelHelperRemoval = !0, this.instance.options.revert = !1, this.instance._trigger("out", c, this.instance._uiHash(this.instance)), this.instance._mouseStop(c, !0), this.instance.options.helper = this.instance.options._helper, this.instance.currentItem.remove(), this.instance.placeholder && this.instance.placeholder.remove(), b._trigger("fromSortable", 
      c), b.dropped = !1);
    });
  }});
  a.ui.plugin.add("draggable", "cursor", {start:function(c, d) {
    c = a("body");
    d = a(this).data("draggable").options;
    c.css("cursor") && (d._cursor = c.css("cursor"));
    c.css("cursor", d.cursor);
  }, stop:function(c, d) {
    c = a(this).data("draggable").options;
    c._cursor && a("body").css("cursor", c._cursor);
  }});
  a.ui.plugin.add("draggable", "iframeFix", {start:function(c, d) {
    c = a(this).data("draggable").options;
    a(!0 === c.iframeFix ? "iframe" : c.iframeFix).each(function() {
      a('<div class="ui-draggable-iframeFix" style="background: #fff;"></div>').css({width:this.offsetWidth + "px", height:this.offsetHeight + "px", position:"absolute", opacity:"0.001", zIndex:1E3}).css(a(this).offset()).appendTo("body");
    });
  }, stop:function(c, d) {
    a("div.ui-draggable-iframeFix").each(function() {
      this.parentNode.removeChild(this);
    });
  }});
  a.ui.plugin.add("draggable", "opacity", {start:function(c, d) {
    c = a(d.helper);
    d = a(this).data("draggable").options;
    c.css("opacity") && (d._opacity = c.css("opacity"));
    c.css("opacity", d.opacity);
  }, stop:function(c, d) {
    c = a(this).data("draggable").options;
    c._opacity && a(d.helper).css("opacity", c._opacity);
  }});
  a.ui.plugin.add("draggable", "scroll", {start:function(c, d) {
    c = a(this).data("draggable");
    c.scrollParent[0] != document && "HTML" != c.scrollParent[0].tagName && (c.overflowOffset = c.scrollParent.offset());
  }, drag:function(c, d) {
    d = a(this).data("draggable");
    var b = d.options, e = !1;
    d.scrollParent[0] != document && "HTML" != d.scrollParent[0].tagName ? (b.axis && "x" == b.axis || (d.overflowOffset.top + d.scrollParent[0].offsetHeight - c.pageY < b.scrollSensitivity ? d.scrollParent[0].scrollTop = e = d.scrollParent[0].scrollTop + b.scrollSpeed : c.pageY - d.overflowOffset.top < b.scrollSensitivity && (d.scrollParent[0].scrollTop = e = d.scrollParent[0].scrollTop - b.scrollSpeed)), b.axis && "y" == b.axis || (d.overflowOffset.left + d.scrollParent[0].offsetWidth - c.pageX < 
    b.scrollSensitivity ? d.scrollParent[0].scrollLeft = e = d.scrollParent[0].scrollLeft + b.scrollSpeed : c.pageX - d.overflowOffset.left < b.scrollSensitivity && (d.scrollParent[0].scrollLeft = e = d.scrollParent[0].scrollLeft - b.scrollSpeed))) : (b.axis && "x" == b.axis || (c.pageY - a(document).scrollTop() < b.scrollSensitivity ? e = a(document).scrollTop(a(document).scrollTop() - b.scrollSpeed) : a(window).height() - (c.pageY - a(document).scrollTop()) < b.scrollSensitivity && (e = a(document).scrollTop(a(document).scrollTop() + 
    b.scrollSpeed))), b.axis && "y" == b.axis || (c.pageX - a(document).scrollLeft() < b.scrollSensitivity ? e = a(document).scrollLeft(a(document).scrollLeft() - b.scrollSpeed) : a(window).width() - (c.pageX - a(document).scrollLeft()) < b.scrollSensitivity && (e = a(document).scrollLeft(a(document).scrollLeft() + b.scrollSpeed))));
    !1 !== e && a.ui.ddmanager && !b.dropBehaviour && a.ui.ddmanager.prepareOffsets(d, c);
  }});
  a.ui.plugin.add("draggable", "snap", {start:function(c, d) {
    var b = a(this).data("draggable");
    c = b.options;
    b.snapElements = [];
    a(c.snap.constructor != String ? c.snap.items || ":data(draggable)" : c.snap).each(function() {
      var e = a(this), c = e.offset();
      this != b.element[0] && b.snapElements.push({item:this, width:e.outerWidth(), height:e.outerHeight(), top:c.top, left:c.left});
    });
  }, drag:function(c, d) {
    for (var b = a(this).data("draggable"), e = b.options, f = e.snapTolerance, g = d.offset.left, l = g + b.helperProportions.width, k = d.offset.top, n = k + b.helperProportions.height, q = b.snapElements.length - 1; 0 <= q; q--) {
      var u = b.snapElements[q].left, m = u + b.snapElements[q].width, p = b.snapElements[q].top, v = p + b.snapElements[q].height;
      if (u - f < g && g < m + f && p - f < k && k < v + f || u - f < g && g < m + f && p - f < n && n < v + f || u - f < l && l < m + f && p - f < k && k < v + f || u - f < l && l < m + f && p - f < n && n < v + f) {
        if ("inner" != e.snapMode) {
          var w = Math.abs(p - n) <= f, A = Math.abs(v - k) <= f, D = Math.abs(u - l) <= f, x = Math.abs(m - g) <= f;
          w && (d.position.top = b._convertPositionTo("relative", {top:p - b.helperProportions.height, left:0}).top - b.margins.top);
          A && (d.position.top = b._convertPositionTo("relative", {top:v, left:0}).top - b.margins.top);
          D && (d.position.left = b._convertPositionTo("relative", {top:0, left:u - b.helperProportions.width}).left - b.margins.left);
          x && (d.position.left = b._convertPositionTo("relative", {top:0, left:m}).left - b.margins.left);
        }
        var F = w || A || D || x;
        "outer" != e.snapMode && (w = Math.abs(p - k) <= f, A = Math.abs(v - n) <= f, D = Math.abs(u - g) <= f, x = Math.abs(m - l) <= f, w && (d.position.top = b._convertPositionTo("relative", {top:p, left:0}).top - b.margins.top), A && (d.position.top = b._convertPositionTo("relative", {top:v - b.helperProportions.height, left:0}).top - b.margins.top), D && (d.position.left = b._convertPositionTo("relative", {top:0, left:u}).left - b.margins.left), x && (d.position.left = b._convertPositionTo("relative", 
        {top:0, left:m - b.helperProportions.width}).left - b.margins.left));
        !b.snapElements[q].snapping && (w || A || D || x || F) && b.options.snap.snap && b.options.snap.snap.call(b.element, c, a.extend(b._uiHash(), {snapItem:b.snapElements[q].item}));
        b.snapElements[q].snapping = w || A || D || x || F;
      } else {
        b.snapElements[q].snapping && b.options.snap.release && b.options.snap.release.call(b.element, c, a.extend(b._uiHash(), {snapItem:b.snapElements[q].item})), b.snapElements[q].snapping = !1;
      }
    }
  }});
  a.ui.plugin.add("draggable", "stack", {start:function(c, d) {
    c = a(this).data("draggable").options;
    c = a.makeArray(a(c.stack)).sort(function(b, c) {
      return (parseInt(a(b).css("zIndex"), 10) || 0) - (parseInt(a(c).css("zIndex"), 10) || 0);
    });
    if (c.length) {
      var b = parseInt(c[0].style.zIndex) || 0;
      a(c).each(function(a) {
        this.style.zIndex = b + a;
      });
      this[0].style.zIndex = b + c.length;
    }
  }});
  a.ui.plugin.add("draggable", "zIndex", {start:function(c, d) {
    c = a(d.helper);
    d = a(this).data("draggable").options;
    c.css("zIndex") && (d._zIndex = c.css("zIndex"));
    c.css("zIndex", d.zIndex);
  }, stop:function(c, d) {
    c = a(this).data("draggable").options;
    c._zIndex && a(d.helper).css("zIndex", c._zIndex);
  }});
})(jQuery);
(function(a) {
  a.widget("ui.droppable", {widgetEventPrefix:"drop", options:{accept:"*", activeClass:!1, addClasses:!0, greedy:!1, hoverClass:!1, scope:"default", tolerance:"intersect"}, _create:function() {
    var c = this.options, d = c.accept;
    this.isover = 0;
    this.isout = 1;
    this.accept = a.isFunction(d) ? d : function(a) {
      return a.is(d);
    };
    this.proportions = {width:this.element[0].offsetWidth, height:this.element[0].offsetHeight};
    a.ui.ddmanager.droppables[c.scope] = a.ui.ddmanager.droppables[c.scope] || [];
    a.ui.ddmanager.droppables[c.scope].push(this);
    c.addClasses && this.element.addClass("ui-droppable");
  }, destroy:function() {
    for (var c = a.ui.ddmanager.droppables[this.options.scope], d = 0; d < c.length; d++) {
      c[d] == this && c.splice(d, 1);
    }
    return this.element.removeClass("ui-droppable ui-droppable-disabled").removeData("droppable").unbind(".droppable"), this;
  }, _setOption:function(c, d) {
    "accept" == c && (this.accept = a.isFunction(d) ? d : function(a) {
      return a.is(d);
    });
    a.Widget.prototype._setOption.apply(this, arguments);
  }, _activate:function(c) {
    var d = a.ui.ddmanager.current;
    this.options.activeClass && this.element.addClass(this.options.activeClass);
    d && this._trigger("activate", c, this.ui(d));
  }, _deactivate:function(c) {
    var d = a.ui.ddmanager.current;
    this.options.activeClass && this.element.removeClass(this.options.activeClass);
    d && this._trigger("deactivate", c, this.ui(d));
  }, _over:function(c) {
    var d = a.ui.ddmanager.current;
    d && (d.currentItem || d.element)[0] != this.element[0] && this.accept.call(this.element[0], d.currentItem || d.element) && (this.options.hoverClass && this.element.addClass(this.options.hoverClass), this._trigger("over", c, this.ui(d)));
  }, _out:function(c) {
    var d = a.ui.ddmanager.current;
    d && (d.currentItem || d.element)[0] != this.element[0] && this.accept.call(this.element[0], d.currentItem || d.element) && (this.options.hoverClass && this.element.removeClass(this.options.hoverClass), this._trigger("out", c, this.ui(d)));
  }, _drop:function(c, d) {
    var b = d || a.ui.ddmanager.current;
    if (!b || (b.currentItem || b.element)[0] == this.element[0]) {
      return !1;
    }
    var e = !1;
    return this.element.find(":data(droppable)").not(".ui-draggable-dragging").each(function() {
      var c = a.data(this, "droppable");
      if (c.options.greedy && !c.options.disabled && c.options.scope == b.options.scope && c.accept.call(c.element[0], b.currentItem || b.element) && a.ui.intersect(b, a.extend(c, {offset:c.element.offset()}), c.options.tolerance)) {
        return e = !0, !1;
      }
    }), e ? !1 : this.accept.call(this.element[0], b.currentItem || b.element) ? (this.options.activeClass && this.element.removeClass(this.options.activeClass), this.options.hoverClass && this.element.removeClass(this.options.hoverClass), this._trigger("drop", c, this.ui(b)), this.element) : !1;
  }, ui:function(a) {
    return {draggable:a.currentItem || a.element, helper:a.helper, position:a.position, offset:a.positionAbs};
  }});
  a.extend(a.ui.droppable, {version:"1.8"});
  a.ui.intersect = function(c, d, b) {
    if (!d.offset) {
      return !1;
    }
    var e = (c.positionAbs || c.position.absolute).left, f = e + c.helperProportions.width, g = (c.positionAbs || c.position.absolute).top, l = g + c.helperProportions.height, k = d.offset.left, n = k + d.proportions.width, q = d.offset.top, u = q + d.proportions.height;
    switch(b) {
      case "fit":
        return k < e && f < n && q < g && l < u;
      case "intersect":
        return k < e + c.helperProportions.width / 2 && f - c.helperProportions.width / 2 < n && q < g + c.helperProportions.height / 2 && l - c.helperProportions.height / 2 < u;
      case "pointer":
        return a.ui.isOver((c.positionAbs || c.position.absolute).top + (c.clickOffset || c.offset.click).top, (c.positionAbs || c.position.absolute).left + (c.clickOffset || c.offset.click).left, q, k, d.proportions.height, d.proportions.width);
      case "touch":
        return (g >= q && g <= u || l >= q && l <= u || g < q && l > u) && (e >= k && e <= n || f >= k && f <= n || e < k && f > n);
      default:
        return !1;
    }
  };
  a.ui.ddmanager = {current:null, droppables:{"default":[]}, prepareOffsets:function(c, d) {
    var b = a.ui.ddmanager.droppables[c.options.scope] || [], e = d ? d.type : null, f = (c.currentItem || c.element).find(":data(droppable)").andSelf(), g = 0;
    a: for (; g < b.length; g++) {
      if (!(b[g].options.disabled || c && !b[g].accept.call(b[g].element[0], c.currentItem || c.element))) {
        for (var l = 0; l < f.length; l++) {
          if (f[l] == b[g].element[0]) {
            b[g].proportions.height = 0;
            continue a;
          }
        }
        b[g].visible = "none" != b[g].element.css("display");
        b[g].visible && (b[g].offset = b[g].element.offset(), b[g].proportions = {width:b[g].element[0].offsetWidth, height:b[g].element[0].offsetHeight}, "mousedown" == e && b[g]._activate.call(b[g], d));
      }
    }
  }, drop:function(c, d) {
    var b = !1;
    return a.each(a.ui.ddmanager.droppables[c.options.scope] || [], function() {
      this.options && (!this.options.disabled && this.visible && a.ui.intersect(c, this, this.options.tolerance) && (b = b || this._drop.call(this, d)), !this.options.disabled && this.visible && this.accept.call(this.element[0], c.currentItem || c.element) && (this.isout = 1, this.isover = 0, this._deactivate.call(this, d)));
    }), b;
  }, drag:function(c, d) {
    c.options.refreshPositions && a.ui.ddmanager.prepareOffsets(c, d);
    a.each(a.ui.ddmanager.droppables[c.options.scope] || [], function() {
      if (!this.options.disabled && !this.greedyChild && this.visible) {
        var b = a.ui.intersect(c, this, this.options.tolerance);
        if (b = b || 1 != this.isover ? b && 0 == this.isover ? "isover" : null : "isout") {
          var e;
          if (this.options.greedy) {
            var f = this.element.parents(":data(droppable):eq(0)");
            f.length && (e = a.data(f[0], "droppable"), e.greedyChild = "isover" == b ? 1 : 0);
          }
          e && "isover" == b && (e.isover = 0, e.isout = 1, e._out.call(e, d));
          this[b] = 1;
          this["isout" == b ? "isover" : "isout"] = 0;
          this["isover" == b ? "_over" : "_out"].call(this, d);
          e && "isout" == b && (e.isout = 0, e.isover = 1, e._over.call(e, d));
        }
      }
    });
  }};
})(jQuery);
(function(a) {
  a.widget("ui.resizable", a.ui.mouse, {widgetEventPrefix:"resize", options:{alsoResize:!1, animate:!1, animateDuration:"slow", animateEasing:"swing", aspectRatio:!1, autoHide:!1, containment:!1, ghost:!1, grid:!1, handles:"e,s,se", helper:!1, maxHeight:null, maxWidth:null, minHeight:10, minWidth:10, zIndex:1E3}, _create:function() {
    var b = this, e = this.options;
    this.element.addClass("ui-resizable");
    a.extend(this, {_aspectRatio:!!e.aspectRatio, aspectRatio:e.aspectRatio, originalElement:this.element, _proportionallyResizeElements:[], _helper:e.helper || e.ghost || e.animate ? e.helper || "ui-resizable-helper" : null});
    this.element[0].nodeName.match(/canvas|textarea|input|select|button|img/i) && (/relative/.test(this.element.css("position")) && a.browser.opera && this.element.css({position:"relative", top:"auto", left:"auto"}), this.element.wrap(a('<div class="ui-wrapper" style="overflow: hidden;"></div>').css({position:this.element.css("position"), width:this.element.outerWidth(), height:this.element.outerHeight(), top:this.element.css("top"), left:this.element.css("left")})), this.element = this.element.parent().data("resizable", 
    this.element.data("resizable")), this.elementIsWrapper = !0, this.element.css({marginLeft:this.originalElement.css("marginLeft"), marginTop:this.originalElement.css("marginTop"), marginRight:this.originalElement.css("marginRight"), marginBottom:this.originalElement.css("marginBottom")}), this.originalElement.css({marginLeft:0, marginTop:0, marginRight:0, marginBottom:0}), this.originalResizeStyle = this.originalElement.css("resize"), this.originalElement.css("resize", "none"), this._proportionallyResizeElements.push(this.originalElement.css({position:"static", 
    zoom:1, display:"block"})), this.originalElement.css({margin:this.originalElement.css("margin")}), this._proportionallyResize());
    this.handles = e.handles || (a(".ui-resizable-handle", this.element).length ? {n:".ui-resizable-n", e:".ui-resizable-e", s:".ui-resizable-s", w:".ui-resizable-w", se:".ui-resizable-se", sw:".ui-resizable-sw", ne:".ui-resizable-ne", nw:".ui-resizable-nw"} : "e,s,se");
    if (this.handles.constructor == String) {
      "all" == this.handles && (this.handles = "n,e,s,w,se,sw,ne,nw");
      var c = this.handles.split(",");
      this.handles = {};
      for (var d = 0; d < c.length; d++) {
        var l = a.trim(c[d]), k = a('<div class="ui-resizable-handle ui-resizable-' + l + '"></div>');
        /sw|se|ne|nw/.test(l) && k.css({zIndex:++e.zIndex});
        "se" == l && k.addClass("ui-icon ui-icon-gripsmall-diagonal-se");
        this.handles[l] = ".ui-resizable-" + l;
        this.element.append(k);
      }
    }
    this._renderAxis = function(b) {
      b = b || this.element;
      for (var e in this.handles) {
        this.handles[e].constructor == String && (this.handles[e] = a(this.handles[e], this.element).show());
        if (this.elementIsWrapper && this.originalElement[0].nodeName.match(/textarea|input|select|button/i)) {
          var c = a(this.handles[e], this.element);
          c = /sw|ne|nw|se|n|s/.test(e) ? c.outerHeight() : c.outerWidth();
          var d = ["padding", /ne|nw|n/.test(e) ? "Top" : /se|sw|s/.test(e) ? "Bottom" : /^e$/.test(e) ? "Right" : "Left"].join("");
          b.css(d, c);
          this._proportionallyResize();
        }
        a(this.handles[e]);
      }
    };
    this._renderAxis(this.element);
    this._handles = a(".ui-resizable-handle", this.element).disableSelection();
    this._handles.mouseover(function() {
      if (!b.resizing) {
        if (this.className) {
          var a = this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i);
        }
        b.axis = a && a[1] ? a[1] : "se";
      }
    });
    e.autoHide && (this._handles.hide(), a(this.element).addClass("ui-resizable-autohide").hover(function() {
      a(this).removeClass("ui-resizable-autohide");
      b._handles.show();
    }, function() {
      b.resizing || (a(this).addClass("ui-resizable-autohide"), b._handles.hide());
    }));
    this._mouseInit();
  }, destroy:function() {
    this._mouseDestroy();
    var b = function(b) {
      a(b).removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing").removeData("resizable").unbind(".resizable").find(".ui-resizable-handle").remove();
    };
    if (this.elementIsWrapper) {
      b(this.element);
      var e = this.element;
      e.after(this.originalElement.css({position:e.css("position"), width:e.outerWidth(), height:e.outerHeight(), top:e.css("top"), left:e.css("left")})).remove();
    }
    return this.originalElement.css("resize", this.originalResizeStyle), b(this.originalElement), this;
  }, _mouseCapture:function(b) {
    var e = !1, c;
    for (c in this.handles) {
      a(this.handles[c])[0] == b.target && (e = !0);
    }
    return !this.options.disabled && e;
  }, _mouseStart:function(b) {
    var e = this.options, d = this.element.position(), g = this.element;
    this.resizing = !0;
    this.documentScroll = {top:a(document).scrollTop(), left:a(document).scrollLeft()};
    (g.is(".ui-draggable") || /absolute/.test(g.css("position"))) && g.css({position:"absolute", top:d.top, left:d.left});
    a.browser.opera && /relative/.test(g.css("position")) && g.css({position:"relative", top:"auto", left:"auto"});
    this._renderProxy();
    d = c(this.helper.css("left"));
    var l = c(this.helper.css("top"));
    e.containment && (d += a(e.containment).scrollLeft() || 0, l += a(e.containment).scrollTop() || 0);
    this.offset = this.helper.offset();
    this.position = {left:d, top:l};
    this.size = this._helper ? {width:g.outerWidth(), height:g.outerHeight()} : {width:g.width(), height:g.height()};
    this.originalSize = this._helper ? {width:g.outerWidth(), height:g.outerHeight()} : {width:g.width(), height:g.height()};
    this.originalPosition = {left:d, top:l};
    this.sizeDiff = {width:g.outerWidth() - g.width(), height:g.outerHeight() - g.height()};
    this.originalMousePosition = {left:b.pageX, top:b.pageY};
    this.aspectRatio = "number" == typeof e.aspectRatio ? e.aspectRatio : this.originalSize.width / this.originalSize.height || 1;
    e = a(".ui-resizable-" + this.axis).css("cursor");
    return a("body").css("cursor", "auto" == e ? this.axis + "-resize" : e), g.addClass("ui-resizable-resizing"), this._propagate("start", b), !0;
  }, _mouseDrag:function(a) {
    var b = this.helper, c = this.originalMousePosition, d = this._change[this.axis];
    if (!d) {
      return !1;
    }
    c = d.apply(this, [a, a.pageX - c.left || 0, a.pageY - c.top || 0]);
    if (this._aspectRatio || a.shiftKey) {
      c = this._updateRatio(c, a);
    }
    return c = this._respectSize(c, a), this._propagate("resize", a), b.css({top:this.position.top + "px", left:this.position.left + "px", width:this.size.width + "px", height:this.size.height + "px"}), !this._helper && this._proportionallyResizeElements.length && this._proportionallyResize(), this._updateCache(c), this._trigger("resize", a, this.ui()), !1;
  }, _mouseStop:function(b) {
    this.resizing = !1;
    var e = this.options;
    if (this._helper) {
      var c = this._proportionallyResizeElements, d = c.length && /textarea/i.test(c[0].nodeName);
      c = d && a.ui.hasScroll(c[0], "left") ? 0 : this.sizeDiff.height;
      d = {width:this.size.width - (d ? 0 : this.sizeDiff.width), height:this.size.height - c};
      c = parseInt(this.element.css("left"), 10) + (this.position.left - this.originalPosition.left) || null;
      var l = parseInt(this.element.css("top"), 10) + (this.position.top - this.originalPosition.top) || null;
      e.animate || this.element.css(a.extend(d, {top:l, left:c}));
      this.helper.height(this.size.height);
      this.helper.width(this.size.width);
      this._helper && !e.animate && this._proportionallyResize();
    }
    return a("body").css("cursor", "auto"), this.element.removeClass("ui-resizable-resizing"), this._propagate("stop", b), this._helper && this.helper.remove(), !1;
  }, _updateCache:function(a) {
    this.offset = this.helper.offset();
    d(a.left) && (this.position.left = a.left);
    d(a.top) && (this.position.top = a.top);
    d(a.height) && (this.size.height = a.height);
    d(a.width) && (this.size.width = a.width);
  }, _updateRatio:function(a, e) {
    e = this.position;
    var b = this.size, c = this.axis;
    return a.height ? a.width = b.height * this.aspectRatio : a.width && (a.height = b.width / this.aspectRatio), "sw" == c && (a.left = e.left + (b.width - a.width), a.top = null), "nw" == c && (a.top = e.top + (b.height - a.height), a.left = e.left + (b.width - a.width)), a;
  }, _respectSize:function(a, e) {
    e = this.options;
    var b = this.axis, c = d(a.width) && e.maxWidth && e.maxWidth < a.width, l = d(a.height) && e.maxHeight && e.maxHeight < a.height, k = d(a.width) && e.minWidth && e.minWidth > a.width, n = d(a.height) && e.minHeight && e.minHeight > a.height;
    k && (a.width = e.minWidth);
    n && (a.height = e.minHeight);
    c && (a.width = e.maxWidth);
    l && (a.height = e.maxHeight);
    var q = this.originalPosition.left + this.originalSize.width, u = this.position.top + this.size.height, m = /sw|nw|w/.test(b);
    b = /nw|ne|n/.test(b);
    k && m && (a.left = q - e.minWidth);
    c && m && (a.left = q - e.maxWidth);
    n && b && (a.top = u - e.minHeight);
    l && b && (a.top = u - e.maxHeight);
    e = !a.width && !a.height;
    return e && !a.left && a.top ? a.top = null : e && !a.top && a.left && (a.left = null), a;
  }, _proportionallyResize:function() {
    if (this._proportionallyResizeElements.length) {
      for (var b = this.helper || this.element, e = 0; e < this._proportionallyResizeElements.length; e++) {
        var c = this._proportionallyResizeElements[e];
        if (!this.borderDif) {
          var d = [c.css("borderTopWidth"), c.css("borderRightWidth"), c.css("borderBottomWidth"), c.css("borderLeftWidth")], l = [c.css("paddingTop"), c.css("paddingRight"), c.css("paddingBottom"), c.css("paddingLeft")];
          this.borderDif = a.map(d, function(a, b) {
            a = parseInt(a, 10) || 0;
            b = parseInt(l[b], 10) || 0;
            return a + b;
          });
        }
        a.browser.msie && (a(b).is(":hidden") || a(b).parents(":hidden").length) || c.css({height:b.height() - this.borderDif[0] - this.borderDif[2] || 0, width:b.width() - this.borderDif[1] - this.borderDif[3] || 0});
      }
    }
  }, _renderProxy:function() {
    var b = this.options;
    this.elementOffset = this.element.offset();
    if (this._helper) {
      this.helper = this.helper || a('<div style="overflow:hidden;"></div>');
      var e = a.browser.msie && 7 > a.browser.version, c = e ? 1 : 0;
      e = e ? 2 : -1;
      this.helper.addClass(this._helper).css({width:this.element.outerWidth() + e, height:this.element.outerHeight() + e, position:"absolute", left:this.elementOffset.left - c + "px", top:this.elementOffset.top - c + "px", zIndex:++b.zIndex});
      this.helper.appendTo("body").disableSelection();
    } else {
      this.helper = this.element;
    }
  }, _change:{e:function(a, e, c) {
    return {width:this.originalSize.width + e};
  }, w:function(a, e, c) {
    return {left:this.originalPosition.left + e, width:this.originalSize.width - e};
  }, n:function(a, e, c) {
    return {top:this.originalPosition.top + c, height:this.originalSize.height - c};
  }, s:function(a, e, c) {
    return {height:this.originalSize.height + c};
  }, se:function(b, e, c) {
    return a.extend(this._change.s.apply(this, arguments), this._change.e.apply(this, [b, e, c]));
  }, sw:function(b, e, c) {
    return a.extend(this._change.s.apply(this, arguments), this._change.w.apply(this, [b, e, c]));
  }, ne:function(b, e, c) {
    return a.extend(this._change.n.apply(this, arguments), this._change.e.apply(this, [b, e, c]));
  }, nw:function(b, e, c) {
    return a.extend(this._change.n.apply(this, arguments), this._change.w.apply(this, [b, e, c]));
  }}, _propagate:function(b, e) {
    a.ui.plugin.call(this, b, [e, this.ui()]);
    "resize" != b && this._trigger(b, e, this.ui());
  }, plugins:{}, ui:function() {
    return {originalElement:this.originalElement, element:this.element, helper:this.helper, position:this.position, size:this.size, originalSize:this.originalSize, originalPosition:this.originalPosition};
  }});
  a.extend(a.ui.resizable, {version:"1.8"});
  a.ui.plugin.add("resizable", "alsoResize", {start:function(b, e) {
    b = a(this).data("resizable").options;
    var c = function(b) {
      a(b).each(function() {
        a(this).data("resizable-alsoresize", {width:parseInt(a(this).width(), 10), height:parseInt(a(this).height(), 10), left:parseInt(a(this).css("left"), 10), top:parseInt(a(this).css("top"), 10)});
      });
    };
    "object" != typeof b.alsoResize || b.alsoResize.parentNode ? c(b.alsoResize) : b.alsoResize.length ? (b.alsoResize = b.alsoResize[0], c(b.alsoResize)) : a.each(b.alsoResize, function(a, b) {
      c(a);
    });
  }, resize:function(b, e) {
    var c = a(this).data("resizable");
    b = c.options;
    e = c.originalSize;
    var d = c.originalPosition, l = {height:c.size.height - e.height || 0, width:c.size.width - e.width || 0, top:c.position.top - d.top || 0, left:c.position.left - d.left || 0}, k = function(b, e) {
      a(b).each(function() {
        var b = a(this), d = a(this).data("resizable-alsoresize"), f = {};
        a.each((e && e.length ? e : ["width", "height", "top", "left"]) || ["width", "height", "top", "left"], function(a, b) {
          (a = (d[b] || 0) + (l[b] || 0)) && 0 <= a && (f[b] = a || null);
        });
        /relative/.test(b.css("position")) && a.browser.opera && (c._revertToRelativePosition = !0, b.css({position:"absolute", top:"auto", left:"auto"}));
        b.css(f);
      });
    };
    "object" != typeof b.alsoResize || b.alsoResize.nodeType ? k(b.alsoResize) : a.each(b.alsoResize, function(a, b) {
      k(a, b);
    });
  }, stop:function(b, e) {
    b = a(this).data("resizable");
    b._revertToRelativePosition && a.browser.opera && (b._revertToRelativePosition = !1, el.css({position:"relative"}));
    a(this).removeData("resizable-alsoresize-start");
  }});
  a.ui.plugin.add("resizable", "animate", {stop:function(b, e) {
    var c = a(this).data("resizable");
    e = c.options;
    var d = c._proportionallyResizeElements, l = d.length && /textarea/i.test(d[0].nodeName), k = l && a.ui.hasScroll(d[0], "left") ? 0 : c.sizeDiff.height;
    l = {width:c.size.width - (l ? 0 : c.sizeDiff.width), height:c.size.height - k};
    k = parseInt(c.element.css("left"), 10) + (c.position.left - c.originalPosition.left) || null;
    var n = parseInt(c.element.css("top"), 10) + (c.position.top - c.originalPosition.top) || null;
    c.element.animate(a.extend(l, n && k ? {top:n, left:k} : {}), {duration:e.animateDuration, easing:e.animateEasing, step:function() {
      var e = {width:parseInt(c.element.css("width"), 10), height:parseInt(c.element.css("height"), 10), top:parseInt(c.element.css("top"), 10), left:parseInt(c.element.css("left"), 10)};
      d && d.length && a(d[0]).css({width:e.width, height:e.height});
      c._updateCache(e);
      c._propagate("resize", b);
    }});
  }});
  a.ui.plugin.add("resizable", "containment", {start:function(b, e) {
    b = a(this).data("resizable");
    e = b.element;
    var d = b.options.containment;
    if (e = d instanceof a ? d.get(0) : /parent/.test(d) ? e.parent().get(0) : d) {
      if (b.containerElement = a(e), /document/.test(d) || d == document) {
        b.containerOffset = {left:0, top:0}, b.containerPosition = {left:0, top:0}, b.parentData = {element:a(document), left:0, top:0, width:a(document).width(), height:a(document).height() || document.body.parentNode.scrollHeight};
      } else {
        var g = a(e), l = [];
        a(["Top", "Right", "Left", "Bottom"]).each(function(a, b) {
          l[a] = c(g.css("padding" + b));
        });
        b.containerOffset = g.offset();
        b.containerPosition = g.position();
        b.containerSize = {height:g.innerHeight() - l[3], width:g.innerWidth() - l[1]};
        d = b.containerOffset;
        var k = b.containerSize.height, n = b.containerSize.width;
        n = a.ui.hasScroll(e, "left") ? e.scrollWidth : n;
        k = a.ui.hasScroll(e) ? e.scrollHeight : k;
        b.parentData = {element:e, left:d.left, top:d.top, width:n, height:k};
      }
    }
  }, resize:function(b, e) {
    e = a(this).data("resizable");
    var c = e.options, d = e.containerOffset, l = e.position;
    b = e._aspectRatio || b.shiftKey;
    var k = {top:0, left:0}, n = e.containerElement;
    n[0] != document && /static/.test(n.css("position")) && (k = d);
    l.left < (e._helper ? d.left : 0) && (e.size.width += e._helper ? e.position.left - d.left : e.position.left - k.left, b && (e.size.height = e.size.width / c.aspectRatio), e.position.left = c.helper ? d.left : 0);
    l.top < (e._helper ? d.top : 0) && (e.size.height += e._helper ? e.position.top - d.top : e.position.top, b && (e.size.width = e.size.height * c.aspectRatio), e.position.top = e._helper ? d.top : 0);
    e.offset.left = e.parentData.left + e.position.left;
    e.offset.top = e.parentData.top + e.position.top;
    c = Math.abs(e.offset.left - k.left + e.sizeDiff.width);
    d = Math.abs((e._helper ? e.offset.top - k.top : e.offset.top - d.top) + e.sizeDiff.height);
    l = e.containerElement.get(0) == e.element.parent().get(0);
    k = /relative|absolute/.test(e.containerElement.css("position"));
    l && k && (c -= e.parentData.left);
    c + e.size.width >= e.parentData.width && (e.size.width = e.parentData.width - c, b && (e.size.height = e.size.width / e.aspectRatio));
    d + e.size.height >= e.parentData.height && (e.size.height = e.parentData.height - d, b && (e.size.width = e.size.height * e.aspectRatio));
  }, stop:function(b, e) {
    b = a(this).data("resizable");
    e = b.options;
    var c = b.containerOffset, d = b.containerPosition, l = b.containerElement, k = a(b.helper), n = k.offset(), q = k.outerWidth() - b.sizeDiff.width;
    k = k.outerHeight() - b.sizeDiff.height;
    b._helper && !e.animate && /relative/.test(l.css("position")) && a(this).css({left:n.left - d.left - c.left, width:q, height:k});
    b._helper && !e.animate && /static/.test(l.css("position")) && a(this).css({left:n.left - d.left - c.left, width:q, height:k});
  }});
  a.ui.plugin.add("resizable", "ghost", {start:function(b, e) {
    b = a(this).data("resizable");
    e = b.options;
    var c = b.size;
    b.ghost = b.originalElement.clone();
    b.ghost.css({opacity:.25, display:"block", position:"relative", height:c.height, width:c.width, margin:0, left:0, top:0}).addClass("ui-resizable-ghost").addClass("string" == typeof e.ghost ? e.ghost : "");
    b.ghost.appendTo(b.helper);
  }, resize:function(b, e) {
    b = a(this).data("resizable");
    b.ghost && b.ghost.css({position:"relative", height:b.size.height, width:b.size.width});
  }, stop:function(b, e) {
    b = a(this).data("resizable");
    b.ghost && b.helper && b.helper.get(0).removeChild(b.ghost.get(0));
  }});
  a.ui.plugin.add("resizable", "grid", {resize:function(b, e) {
    b = a(this).data("resizable");
    var c = b.options, d = b.size;
    e = b.originalSize;
    var l = b.originalPosition, k = b.axis;
    c.grid = "number" == typeof c.grid ? [c.grid, c.grid] : c.grid;
    var n = Math.round((d.width - e.width) / (c.grid[0] || 1)) * (c.grid[0] || 1);
    c = Math.round((d.height - e.height) / (c.grid[1] || 1)) * (c.grid[1] || 1);
    /^(se|s|e)$/.test(k) ? (b.size.width = e.width + n, b.size.height = e.height + c) : /^(ne)$/.test(k) ? (b.size.width = e.width + n, b.size.height = e.height + c, b.position.top = l.top - c) : /^(sw)$/.test(k) ? (b.size.width = e.width + n, b.size.height = e.height + c, b.position.left = l.left - n) : (b.size.width = e.width + n, b.size.height = e.height + c, b.position.top = l.top - c, b.position.left = l.left - n);
  }});
  var c = function(a) {
    return parseInt(a, 10) || 0;
  }, d = function(a) {
    return !isNaN(parseInt(a, 10));
  };
})(jQuery);
(function(a) {
  a.widget("ui.selectable", a.ui.mouse, {options:{appendTo:"body", autoRefresh:!0, distance:0, filter:"*", tolerance:"touch"}, _create:function() {
    var c = this;
    this.element.addClass("ui-selectable");
    this.dragged = !1;
    var d;
    this.refresh = function() {
      d = a(c.options.filter, c.element[0]);
      d.each(function() {
        var b = a(this), e = b.offset();
        a.data(this, "selectable-item", {element:this, $element:b, left:e.left, top:e.top, right:e.left + b.outerWidth(), bottom:e.top + b.outerHeight(), startselected:!1, selected:b.hasClass("ui-selected"), selecting:b.hasClass("ui-selecting"), unselecting:b.hasClass("ui-unselecting")});
      });
    };
    this.refresh();
    this.selectees = d.addClass("ui-selectee");
    this._mouseInit();
    this.helper = a(document.createElement("div")).css({border:"1px dotted black"}).addClass("ui-selectable-helper");
  }, destroy:function() {
    return this.selectees.removeClass("ui-selectee").removeData("selectable-item"), this.element.removeClass("ui-selectable ui-selectable-disabled").removeData("selectable").unbind(".selectable"), this._mouseDestroy(), this;
  }, _mouseStart:function(c) {
    var d = this;
    this.opos = [c.pageX, c.pageY];
    if (!this.options.disabled) {
      var b = this.options;
      this.selectees = a(b.filter, this.element[0]);
      this._trigger("start", c);
      a(b.appendTo).append(this.helper);
      this.helper.css({"z-index":100, position:"absolute", left:c.clientX, top:c.clientY, width:0, height:0});
      b.autoRefresh && this.refresh();
      this.selectees.filter(".ui-selected").each(function() {
        var b = a.data(this, "selectable-item");
        b.startselected = !0;
        c.metaKey || (b.$element.removeClass("ui-selected"), b.selected = !1, b.$element.addClass("ui-unselecting"), b.unselecting = !0, d._trigger("unselecting", c, {unselecting:b.element}));
      });
      a(c.target).parents().andSelf().each(function() {
        var b = a.data(this, "selectable-item");
        if (b) {
          return b.$element.removeClass("ui-unselecting").addClass("ui-selecting"), b.unselecting = !1, b.selecting = !0, b.selected = !0, d._trigger("selecting", c, {selecting:b.element}), !1;
        }
      });
    }
  }, _mouseDrag:function(c) {
    var d = this;
    this.dragged = !0;
    if (!this.options.disabled) {
      var b = this.options, e = this.opos[0], f = this.opos[1], g = c.pageX, l = c.pageY;
      if (e > g) {
        var k = g;
        g = e;
        e = k;
      }
      f > l && (k = l, l = f, f = k);
      return this.helper.css({left:e, top:f, width:g - e, height:l - f}), this.selectees.each(function() {
        var k = a.data(this, "selectable-item");
        if (k && k.element != d.element[0]) {
          var q = !1;
          "touch" == b.tolerance ? q = !(k.left > g || k.right < e || k.top > l || k.bottom < f) : "fit" == b.tolerance && (q = k.left > e && k.right < g && k.top > f && k.bottom < l);
          q ? (k.selected && (k.$element.removeClass("ui-selected"), k.selected = !1), k.unselecting && (k.$element.removeClass("ui-unselecting"), k.unselecting = !1), k.selecting || (k.$element.addClass("ui-selecting"), k.selecting = !0, d._trigger("selecting", c, {selecting:k.element}))) : (k.selecting && (c.metaKey && k.startselected ? (k.$element.removeClass("ui-selecting"), k.selecting = !1, k.$element.addClass("ui-selected"), k.selected = !0) : (k.$element.removeClass("ui-selecting"), k.selecting = 
          !1, k.startselected && (k.$element.addClass("ui-unselecting"), k.unselecting = !0), d._trigger("unselecting", c, {unselecting:k.element}))), k.selected && !c.metaKey && !k.startselected && (k.$element.removeClass("ui-selected"), k.selected = !1, k.$element.addClass("ui-unselecting"), k.unselecting = !0, d._trigger("unselecting", c, {unselecting:k.element})));
        }
      }), !1;
    }
  }, _mouseStop:function(c) {
    var d = this;
    this.dragged = !1;
    return a(".ui-unselecting", this.element[0]).each(function() {
      var b = a.data(this, "selectable-item");
      b.$element.removeClass("ui-unselecting");
      b.unselecting = !1;
      b.startselected = !1;
      d._trigger("unselected", c, {unselected:b.element});
    }), a(".ui-selecting", this.element[0]).each(function() {
      var b = a.data(this, "selectable-item");
      b.$element.removeClass("ui-selecting").addClass("ui-selected");
      b.selecting = !1;
      b.selected = !0;
      b.startselected = !0;
      d._trigger("selected", c, {selected:b.element});
    }), this._trigger("stop", c), this.helper.remove(), !1;
  }});
  a.extend(a.ui.selectable, {version:"1.8"});
})(jQuery);
(function(a) {
  a.widget("ui.sortable", a.ui.mouse, {widgetEventPrefix:"sort", options:{appendTo:"parent", axis:!1, connectWith:!1, containment:!1, cursor:"auto", cursorAt:!1, dropOnEmpty:!0, forcePlaceholderSize:!1, forceHelperSize:!1, grid:!1, handle:!1, helper:"original", items:"> *", opacity:!1, placeholder:!1, revert:!1, scroll:!0, scrollSensitivity:20, scrollSpeed:20, scope:"default", tolerance:"intersect", zIndex:1E3}, _create:function() {
    this.containerCache = {};
    this.element.addClass("ui-sortable");
    this.refresh();
    this.floating = this.items.length ? /left|right/.test(this.items[0].item.css("float")) : !1;
    this.offset = this.element.offset();
    this._mouseInit();
  }, destroy:function() {
    this.element.removeClass("ui-sortable ui-sortable-disabled").removeData("sortable").unbind(".sortable");
    this._mouseDestroy();
    for (var a = this.items.length - 1; 0 <= a; a--) {
      this.items[a].item.removeData("sortable-item");
    }
    return this;
  }, _mouseCapture:function(c, d) {
    if (this.reverting || this.options.disabled || "static" == this.options.type) {
      return !1;
    }
    this._refreshItems(c);
    var b = null, e = this;
    a(c.target).parents().each(function() {
      if (a.data(this, "sortable-item") == e) {
        return b = a(this), !1;
      }
    });
    a.data(c.target, "sortable-item") == e && (b = a(c.target));
    if (!b) {
      return !1;
    }
    if (this.options.handle && !d) {
      var f = !1;
      a(this.options.handle, b).find("*").andSelf().each(function() {
        this == c.target && (f = !0);
      });
      if (!f) {
        return !1;
      }
    }
    return this.currentItem = b, this._removeCurrentsFromItems(), !0;
  }, _mouseStart:function(c, d, b) {
    d = this.options;
    this.currentContainer = this;
    this.refreshPositions();
    this.helper = this._createHelper(c);
    this._cacheHelperProportions();
    this._cacheMargins();
    this.scrollParent = this.helper.scrollParent();
    this.offset = this.currentItem.offset();
    this.offset = {top:this.offset.top - this.margins.top, left:this.offset.left - this.margins.left};
    this.helper.css("position", "absolute");
    this.cssPosition = this.helper.css("position");
    a.extend(this.offset, {click:{left:c.pageX - this.offset.left, top:c.pageY - this.offset.top}, parent:this._getParentOffset(), relative:this._getRelativeOffset()});
    this.originalPosition = this._generatePosition(c);
    this.originalPageX = c.pageX;
    this.originalPageY = c.pageY;
    d.cursorAt && this._adjustOffsetFromHelper(d.cursorAt);
    this.domPosition = {prev:this.currentItem.prev()[0], parent:this.currentItem.parent()[0]};
    this.helper[0] != this.currentItem[0] && this.currentItem.hide();
    this._createPlaceholder();
    d.containment && this._setContainment();
    d.cursor && (a("body").css("cursor") && (this._storedCursor = a("body").css("cursor")), a("body").css("cursor", d.cursor));
    d.opacity && (this.helper.css("opacity") && (this._storedOpacity = this.helper.css("opacity")), this.helper.css("opacity", d.opacity));
    d.zIndex && (this.helper.css("zIndex") && (this._storedZIndex = this.helper.css("zIndex")), this.helper.css("zIndex", d.zIndex));
    this.scrollParent[0] != document && "HTML" != this.scrollParent[0].tagName && (this.overflowOffset = this.scrollParent.offset());
    this._trigger("start", c, this._uiHash());
    this._preserveHelperProportions || this._cacheHelperProportions();
    if (!b) {
      for (b = this.containers.length - 1; 0 <= b; b--) {
        this.containers[b]._trigger("activate", c, this._uiHash(this));
      }
    }
    return a.ui.ddmanager && (a.ui.ddmanager.current = this), a.ui.ddmanager && !d.dropBehaviour && a.ui.ddmanager.prepareOffsets(this, c), this.dragging = !0, this.helper.addClass("ui-sortable-helper"), this._mouseDrag(c), !0;
  }, _mouseDrag:function(c) {
    this.position = this._generatePosition(c);
    this.positionAbs = this._convertPositionTo("absolute");
    this.lastPositionAbs || (this.lastPositionAbs = this.positionAbs);
    if (this.options.scroll) {
      var d = this.options, b = !1;
      this.scrollParent[0] != document && "HTML" != this.scrollParent[0].tagName ? (this.overflowOffset.top + this.scrollParent[0].offsetHeight - c.pageY < d.scrollSensitivity ? this.scrollParent[0].scrollTop = b = this.scrollParent[0].scrollTop + d.scrollSpeed : c.pageY - this.overflowOffset.top < d.scrollSensitivity && (this.scrollParent[0].scrollTop = b = this.scrollParent[0].scrollTop - d.scrollSpeed), this.overflowOffset.left + this.scrollParent[0].offsetWidth - c.pageX < d.scrollSensitivity ? 
      this.scrollParent[0].scrollLeft = b = this.scrollParent[0].scrollLeft + d.scrollSpeed : c.pageX - this.overflowOffset.left < d.scrollSensitivity && (this.scrollParent[0].scrollLeft = b = this.scrollParent[0].scrollLeft - d.scrollSpeed)) : (c.pageY - a(document).scrollTop() < d.scrollSensitivity ? b = a(document).scrollTop(a(document).scrollTop() - d.scrollSpeed) : a(window).height() - (c.pageY - a(document).scrollTop()) < d.scrollSensitivity && (b = a(document).scrollTop(a(document).scrollTop() + 
      d.scrollSpeed)), c.pageX - a(document).scrollLeft() < d.scrollSensitivity ? b = a(document).scrollLeft(a(document).scrollLeft() - d.scrollSpeed) : a(window).width() - (c.pageX - a(document).scrollLeft()) < d.scrollSensitivity && (b = a(document).scrollLeft(a(document).scrollLeft() + d.scrollSpeed)));
      !1 !== b && a.ui.ddmanager && !d.dropBehaviour && a.ui.ddmanager.prepareOffsets(this, c);
    }
    this.positionAbs = this._convertPositionTo("absolute");
    this.options.axis && "y" == this.options.axis || (this.helper[0].style.left = this.position.left + "px");
    this.options.axis && "x" == this.options.axis || (this.helper[0].style.top = this.position.top + "px");
    for (d = this.items.length - 1; 0 <= d; d--) {
      b = this.items[d];
      var e = b.item[0], f = this._intersectsWithPointer(b);
      if (f && e != this.currentItem[0] && this.placeholder[1 == f ? "next" : "prev"]()[0] != e && !a.ui.contains(this.placeholder[0], e) && ("semi-dynamic" == this.options.type ? !a.ui.contains(this.element[0], e) : 1)) {
        this.direction = 1 == f ? "down" : "up";
        if ("pointer" != this.options.tolerance && !this._intersectsWithSides(b)) {
          break;
        }
        this._rearrange(c, b);
        this._trigger("change", c, this._uiHash());
        break;
      }
    }
    return this._contactContainers(c), a.ui.ddmanager && a.ui.ddmanager.drag(this, c), this._trigger("sort", c, this._uiHash()), this.lastPositionAbs = this.positionAbs, !1;
  }, _mouseStop:function(c, d) {
    if (c) {
      a.ui.ddmanager && !this.options.dropBehaviour && a.ui.ddmanager.drop(this, c);
      if (this.options.revert) {
        var b = this;
        d = b.placeholder.offset();
        b.reverting = !0;
        a(this.helper).animate({left:d.left - this.offset.parent.left - b.margins.left + (this.offsetParent[0] == document.body ? 0 : this.offsetParent[0].scrollLeft), top:d.top - this.offset.parent.top - b.margins.top + (this.offsetParent[0] == document.body ? 0 : this.offsetParent[0].scrollTop)}, parseInt(this.options.revert, 10) || 500, function() {
          b._clear(c);
        });
      } else {
        this._clear(c, d);
      }
      return !1;
    }
  }, cancel:function() {
    if (this.dragging) {
      this._mouseUp();
      "original" == this.options.helper ? this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper") : this.currentItem.show();
      for (var c = this.containers.length - 1; 0 <= c; c--) {
        this.containers[c]._trigger("deactivate", null, this._uiHash(this)), this.containers[c].containerCache.over && (this.containers[c]._trigger("out", null, this._uiHash(this)), this.containers[c].containerCache.over = 0);
      }
    }
    return this.placeholder[0].parentNode && this.placeholder[0].parentNode.removeChild(this.placeholder[0]), "original" != this.options.helper && this.helper && this.helper[0].parentNode && this.helper.remove(), a.extend(this, {helper:null, dragging:!1, reverting:!1, _noFinalSort:null}), this.domPosition.prev ? a(this.domPosition.prev).after(this.currentItem) : a(this.domPosition.parent).prepend(this.currentItem), this;
  }, serialize:function(c) {
    var d = this._getItemsAsjQuery(c && c.connected), b = [];
    return c = c || {}, a(d).each(function() {
      var e = (a(c.item || this).attr(c.attribute || "id") || "").match(c.expression || /(.+)[-=_](.+)/);
      e && b.push((c.key || e[1] + "[]") + "=" + (c.key && c.expression ? e[1] : e[2]));
    }), b.join("&");
  }, toArray:function(c) {
    var d = this._getItemsAsjQuery(c && c.connected), b = [];
    return c = c || {}, d.each(function() {
      b.push(a(c.item || this).attr(c.attribute || "id") || "");
    }), b;
  }, _intersectsWith:function(a) {
    var c = this.positionAbs.left, b = c + this.helperProportions.width, e = this.positionAbs.top, f = e + this.helperProportions.height, g = a.left, l = g + a.width, k = a.top, n = k + a.height, q = this.offset.click.top, u = this.offset.click.left;
    return "pointer" == this.options.tolerance || this.options.forcePointerForContainers || "pointer" != this.options.tolerance && this.helperProportions[this.floating ? "width" : "height"] > a[this.floating ? "width" : "height"] ? e + q > k && e + q < n && c + u > g && c + u < l : g < c + this.helperProportions.width / 2 && b - this.helperProportions.width / 2 < l && k < e + this.helperProportions.height / 2 && f - this.helperProportions.height / 2 < n;
  }, _intersectsWithPointer:function(c) {
    var d = a.ui.isOverAxis(this.positionAbs.top + this.offset.click.top, c.top, c.height);
    c = a.ui.isOverAxis(this.positionAbs.left + this.offset.click.left, c.left, c.width);
    d = d && c;
    c = this._getDragVerticalDirection();
    var b = this._getDragHorizontalDirection();
    return d ? this.floating ? b && "right" == b || "down" == c ? 2 : 1 : c && ("down" == c ? 2 : 1) : !1;
  }, _intersectsWithSides:function(c) {
    var d = a.ui.isOverAxis(this.positionAbs.top + this.offset.click.top, c.top + c.height / 2, c.height);
    c = a.ui.isOverAxis(this.positionAbs.left + this.offset.click.left, c.left + c.width / 2, c.width);
    var b = this._getDragVerticalDirection(), e = this._getDragHorizontalDirection();
    return this.floating && e ? "right" == e && c || "left" == e && !c : b && ("down" == b && d || "up" == b && !d);
  }, _getDragVerticalDirection:function() {
    var a = this.positionAbs.top - this.lastPositionAbs.top;
    return 0 != a && (0 < a ? "down" : "up");
  }, _getDragHorizontalDirection:function() {
    var a = this.positionAbs.left - this.lastPositionAbs.left;
    return 0 != a && (0 < a ? "right" : "left");
  }, refresh:function(a) {
    return this._refreshItems(a), this.refreshPositions(), this;
  }, _connectWith:function() {
    var a = this.options;
    return a.connectWith.constructor == String ? [a.connectWith] : a.connectWith;
  }, _getItemsAsjQuery:function(c) {
    var d = [], b = [], e = this._connectWith();
    if (e && c) {
      for (c = e.length - 1; 0 <= c; c--) {
        for (var f = a(e[c]), g = f.length - 1; 0 <= g; g--) {
          var l = a.data(f[g], "sortable");
          l && l != this && !l.options.disabled && b.push([a.isFunction(l.options.items) ? l.options.items.call(l.element) : a(l.options.items, l.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), l]);
        }
      }
    }
    b.push([a.isFunction(this.options.items) ? this.options.items.call(this.element, null, {options:this.options, item:this.currentItem}) : a(this.options.items, this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), this]);
    for (c = b.length - 1; 0 <= c; c--) {
      b[c][0].each(function() {
        d.push(this);
      });
    }
    return a(d);
  }, _removeCurrentsFromItems:function() {
    for (var a = this.currentItem.find(":data(sortable-item)"), d = 0; d < this.items.length; d++) {
      for (var b = 0; b < a.length; b++) {
        a[b] == this.items[d].item[0] && this.items.splice(d, 1);
      }
    }
  }, _refreshItems:function(c) {
    this.items = [];
    this.containers = [this];
    var d = this.items, b = [[a.isFunction(this.options.items) ? this.options.items.call(this.element[0], c, {item:this.currentItem}) : a(this.options.items, this.element), this]], e = this._connectWith();
    if (e) {
      for (var f = e.length - 1; 0 <= f; f--) {
        for (var g = a(e[f]), l = g.length - 1; 0 <= l; l--) {
          var k = a.data(g[l], "sortable");
          k && k != this && !k.options.disabled && (b.push([a.isFunction(k.options.items) ? k.options.items.call(k.element[0], c, {item:this.currentItem}) : a(k.options.items, k.element), k]), this.containers.push(k));
        }
      }
    }
    for (f = b.length - 1; 0 <= f; f--) {
      for (c = b[f][1], e = b[f][0], l = 0, g = e.length; l < g; l++) {
        k = a(e[l]), k.data("sortable-item", c), d.push({item:k, instance:c, width:0, height:0, left:0, top:0});
      }
    }
  }, refreshPositions:function(c) {
    this.offsetParent && this.helper && (this.offset.parent = this._getParentOffset());
    for (var d = this.items.length - 1; 0 <= d; d--) {
      var b = this.items[d], e = this.options.toleranceElement ? a(this.options.toleranceElement, b.item) : b.item;
      c || (b.width = e.outerWidth(), b.height = e.outerHeight());
      e = e.offset();
      b.left = e.left;
      b.top = e.top;
    }
    if (this.options.custom && this.options.custom.refreshContainers) {
      this.options.custom.refreshContainers.call(this);
    } else {
      for (d = this.containers.length - 1; 0 <= d; d--) {
        e = this.containers[d].element.offset(), this.containers[d].containerCache.left = e.left, this.containers[d].containerCache.top = e.top, this.containers[d].containerCache.width = this.containers[d].element.outerWidth(), this.containers[d].containerCache.height = this.containers[d].element.outerHeight();
      }
    }
    return this;
  }, _createPlaceholder:function(c) {
    var d = c || this, b = d.options;
    if (!b.placeholder || b.placeholder.constructor == String) {
      var e = b.placeholder;
      b.placeholder = {element:function() {
        var b = a(document.createElement(d.currentItem[0].nodeName)).addClass(e || d.currentItem[0].className + " ui-sortable-placeholder").removeClass("ui-sortable-helper")[0];
        return e || (b.style.visibility = "hidden"), b;
      }, update:function(a, c) {
        if (!e || b.forcePlaceholderSize) {
          c.height() || c.height(d.currentItem.innerHeight() - parseInt(d.currentItem.css("paddingTop") || 0, 10) - parseInt(d.currentItem.css("paddingBottom") || 0, 10)), c.width() || c.width(d.currentItem.innerWidth() - parseInt(d.currentItem.css("paddingLeft") || 0, 10) - parseInt(d.currentItem.css("paddingRight") || 0, 10));
        }
      }};
    }
    d.placeholder = a(b.placeholder.element.call(d.element, d.currentItem));
    d.currentItem.after(d.placeholder);
    b.placeholder.update(d, d.placeholder);
  }, _contactContainers:function(c) {
    for (var d = null, b = null, e = this.containers.length - 1; 0 <= e; e--) {
      a.ui.contains(this.currentItem[0], this.containers[e].element[0]) || (this._intersectsWith(this.containers[e].containerCache) ? d && a.ui.contains(this.containers[e].element[0], d.element[0]) || (d = this.containers[e], b = e) : this.containers[e].containerCache.over && (this.containers[e]._trigger("out", c, this._uiHash(this)), this.containers[e].containerCache.over = 0));
    }
    if (d) {
      if (1 === this.containers.length) {
        this.containers[b]._trigger("over", c, this._uiHash(this)), this.containers[b].containerCache.over = 1;
      } else {
        if (this.currentContainer != this.containers[b]) {
          d = 1E4;
          e = null;
          for (var f = this.positionAbs[this.containers[b].floating ? "left" : "top"], g = this.items.length - 1; 0 <= g; g--) {
            if (a.ui.contains(this.containers[b].element[0], this.items[g].item[0])) {
              var l = this.items[g][this.containers[b].floating ? "left" : "top"];
              Math.abs(l - f) < d && (d = Math.abs(l - f), e = this.items[g]);
            }
          }
          if (e || this.options.dropOnEmpty) {
            this.currentContainer = this.containers[b], e ? this._rearrange(c, e, null, !0) : this._rearrange(c, null, this.containers[b].element, !0), this._trigger("change", c, this._uiHash()), this.containers[b]._trigger("change", c, this._uiHash(this)), this.options.placeholder.update(this.currentContainer, this.placeholder), this.containers[b]._trigger("over", c, this._uiHash(this)), this.containers[b].containerCache.over = 1;
          }
        }
      }
    }
  }, _createHelper:function(c) {
    var d = this.options;
    c = a.isFunction(d.helper) ? a(d.helper.apply(this.element[0], [c, this.currentItem])) : "clone" == d.helper ? this.currentItem.clone() : this.currentItem;
    return c.parents("body").length || a("parent" != d.appendTo ? d.appendTo : this.currentItem[0].parentNode)[0].appendChild(c[0]), c[0] == this.currentItem[0] && (this._storedCSS = {width:this.currentItem[0].style.width, height:this.currentItem[0].style.height, position:this.currentItem.css("position"), top:this.currentItem.css("top"), left:this.currentItem.css("left")}), ("" == c[0].style.width || d.forceHelperSize) && c.width(this.currentItem.width()), ("" == c[0].style.height || d.forceHelperSize) && 
    c.height(this.currentItem.height()), c;
  }, _adjustOffsetFromHelper:function(c) {
    "string" == typeof c && (c = c.split(" "));
    a.isArray(c) && (c = {left:+c[0], top:+c[1] || 0});
    "left" in c && (this.offset.click.left = c.left + this.margins.left);
    "right" in c && (this.offset.click.left = this.helperProportions.width - c.right + this.margins.left);
    "top" in c && (this.offset.click.top = c.top + this.margins.top);
    "bottom" in c && (this.offset.click.top = this.helperProportions.height - c.bottom + this.margins.top);
  }, _getParentOffset:function() {
    this.offsetParent = this.helper.offsetParent();
    var c = this.offsetParent.offset();
    "absolute" == this.cssPosition && this.scrollParent[0] != document && a.ui.contains(this.scrollParent[0], this.offsetParent[0]) && (c.left += this.scrollParent.scrollLeft(), c.top += this.scrollParent.scrollTop());
    if (this.offsetParent[0] == document.body || this.offsetParent[0].tagName && "html" == this.offsetParent[0].tagName.toLowerCase() && a.browser.msie) {
      c = {top:0, left:0};
    }
    return {top:c.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0), left:c.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)};
  }, _getRelativeOffset:function() {
    if ("relative" == this.cssPosition) {
      var a = this.currentItem.position();
      return {top:a.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(), left:a.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft()};
    }
    return {top:0, left:0};
  }, _cacheMargins:function() {
    this.margins = {left:parseInt(this.currentItem.css("marginLeft"), 10) || 0, top:parseInt(this.currentItem.css("marginTop"), 10) || 0};
  }, _cacheHelperProportions:function() {
    this.helperProportions = {width:this.helper.outerWidth(), height:this.helper.outerHeight()};
  }, _setContainment:function() {
    var c = this.options;
    "parent" == c.containment && (c.containment = this.helper[0].parentNode);
    if ("document" == c.containment || "window" == c.containment) {
      this.containment = [0 - this.offset.relative.left - this.offset.parent.left, 0 - this.offset.relative.top - this.offset.parent.top, a("document" == c.containment ? document : window).width() - this.helperProportions.width - this.margins.left, (a("document" == c.containment ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top];
    }
    if (!/^(document|window|parent)$/.test(c.containment)) {
      var d = a(c.containment)[0];
      c = a(c.containment).offset();
      var b = "hidden" != a(d).css("overflow");
      this.containment = [c.left + (parseInt(a(d).css("borderLeftWidth"), 10) || 0) + (parseInt(a(d).css("paddingLeft"), 10) || 0) - this.margins.left, c.top + (parseInt(a(d).css("borderTopWidth"), 10) || 0) + (parseInt(a(d).css("paddingTop"), 10) || 0) - this.margins.top, c.left + (b ? Math.max(d.scrollWidth, d.offsetWidth) : d.offsetWidth) - (parseInt(a(d).css("borderLeftWidth"), 10) || 0) - (parseInt(a(d).css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left, c.top + 
      (b ? Math.max(d.scrollHeight, d.offsetHeight) : d.offsetHeight) - (parseInt(a(d).css("borderTopWidth"), 10) || 0) - (parseInt(a(d).css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top];
    }
  }, _convertPositionTo:function(c, d) {
    d || (d = this.position);
    c = "absolute" == c ? 1 : -1;
    var b = "absolute" != this.cssPosition || this.scrollParent[0] != document && a.ui.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent, e = /(html|body)/i.test(b[0].tagName);
    return {top:d.top + this.offset.relative.top * c + this.offset.parent.top * c - (a.browser.safari && "fixed" == this.cssPosition ? 0 : ("fixed" == this.cssPosition ? -this.scrollParent.scrollTop() : e ? 0 : b.scrollTop()) * c), left:d.left + this.offset.relative.left * c + this.offset.parent.left * c - (a.browser.safari && "fixed" == this.cssPosition ? 0 : ("fixed" == this.cssPosition ? -this.scrollParent.scrollLeft() : e ? 0 : b.scrollLeft()) * c)};
  }, _generatePosition:function(c) {
    var d = this.options, b = "absolute" != this.cssPosition || this.scrollParent[0] != document && a.ui.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent, e = /(html|body)/i.test(b[0].tagName);
    "relative" != this.cssPosition || this.scrollParent[0] != document && this.scrollParent[0] != this.offsetParent[0] || (this.offset.relative = this._getRelativeOffset());
    var f = c.pageX, g = c.pageY;
    this.originalPosition && (this.containment && (c.pageX - this.offset.click.left < this.containment[0] && (f = this.containment[0] + this.offset.click.left), c.pageY - this.offset.click.top < this.containment[1] && (g = this.containment[1] + this.offset.click.top), c.pageX - this.offset.click.left > this.containment[2] && (f = this.containment[2] + this.offset.click.left), c.pageY - this.offset.click.top > this.containment[3] && (g = this.containment[3] + this.offset.click.top)), d.grid && (g = 
    this.originalPageY + Math.round((g - this.originalPageY) / d.grid[1]) * d.grid[1], g = this.containment ? g - this.offset.click.top < this.containment[1] || g - this.offset.click.top > this.containment[3] ? g - this.offset.click.top < this.containment[1] ? g + d.grid[1] : g - d.grid[1] : g : g, f = this.originalPageX + Math.round((f - this.originalPageX) / d.grid[0]) * d.grid[0], f = this.containment ? f - this.offset.click.left < this.containment[0] || f - this.offset.click.left > this.containment[2] ? 
    f - this.offset.click.left < this.containment[0] ? f + d.grid[0] : f - d.grid[0] : f : f));
    return {top:g - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + (a.browser.safari && "fixed" == this.cssPosition ? 0 : "fixed" == this.cssPosition ? -this.scrollParent.scrollTop() : e ? 0 : b.scrollTop()), left:f - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + (a.browser.safari && "fixed" == this.cssPosition ? 0 : "fixed" == this.cssPosition ? -this.scrollParent.scrollLeft() : e ? 0 : b.scrollLeft())};
  }, _rearrange:function(a, d, b, e) {
    b ? b[0].appendChild(this.placeholder[0]) : d.item[0].parentNode.insertBefore(this.placeholder[0], "down" == this.direction ? d.item[0] : d.item[0].nextSibling);
    this.counter = this.counter ? ++this.counter : 1;
    var c = this, g = this.counter;
    window.setTimeout(function() {
      g == c.counter && c.refreshPositions(!e);
    }, 0);
  }, _clear:function(c, d) {
    this.reverting = !1;
    var b = [];
    !this._noFinalSort && this.currentItem[0].parentNode && this.placeholder.before(this.currentItem);
    this._noFinalSort = null;
    if (this.helper[0] == this.currentItem[0]) {
      for (var e in this._storedCSS) {
        if ("auto" == this._storedCSS[e] || "static" == this._storedCSS[e]) {
          this._storedCSS[e] = "";
        }
      }
      this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper");
    } else {
      this.currentItem.show();
    }
    this.fromOutside && !d && b.push(function(a) {
      this._trigger("receive", a, this._uiHash(this.fromOutside));
    });
    !this.fromOutside && this.domPosition.prev == this.currentItem.prev().not(".ui-sortable-helper")[0] && this.domPosition.parent == this.currentItem.parent()[0] || d || b.push(function(a) {
      this._trigger("update", a, this._uiHash());
    });
    if (!a.ui.contains(this.element[0], this.currentItem[0])) {
      for (d || b.push(function(a) {
        this._trigger("remove", a, this._uiHash());
      }), e = this.containers.length - 1; 0 <= e; e--) {
        a.ui.contains(this.containers[e].element[0], this.currentItem[0]) && !d && (b.push(function(a) {
          return function(b) {
            a._trigger("receive", b, this._uiHash(this));
          };
        }.call(this, this.containers[e])), b.push(function(a) {
          return function(b) {
            a._trigger("update", b, this._uiHash(this));
          };
        }.call(this, this.containers[e])));
      }
    }
    for (e = this.containers.length - 1; 0 <= e; e--) {
      d || b.push(function(a) {
        return function(b) {
          a._trigger("deactivate", b, this._uiHash(this));
        };
      }.call(this, this.containers[e])), this.containers[e].containerCache.over && (b.push(function(a) {
        return function(b) {
          a._trigger("out", b, this._uiHash(this));
        };
      }.call(this, this.containers[e])), this.containers[e].containerCache.over = 0);
    }
    this._storedCursor && a("body").css("cursor", this._storedCursor);
    this._storedOpacity && this.helper.css("opacity", this._storedOpacity);
    this._storedZIndex && this.helper.css("zIndex", "auto" == this._storedZIndex ? "" : this._storedZIndex);
    this.dragging = !1;
    if (this.cancelHelperRemoval) {
      if (!d) {
        this._trigger("beforeStop", c, this._uiHash());
        for (e = 0; e < b.length; e++) {
          b[e].call(this, c);
        }
        this._trigger("stop", c, this._uiHash());
      }
      return !1;
    }
    d || this._trigger("beforeStop", c, this._uiHash());
    this.placeholder[0].parentNode.removeChild(this.placeholder[0]);
    this.helper[0] != this.currentItem[0] && this.helper.remove();
    this.helper = null;
    if (!d) {
      for (e = 0; e < b.length; e++) {
        b[e].call(this, c);
      }
      this._trigger("stop", c, this._uiHash());
    }
    return this.fromOutside = !1, !0;
  }, _trigger:function() {
    !1 === a.Widget.prototype._trigger.apply(this, arguments) && this.cancel();
  }, _uiHash:function(c) {
    var d = c || this;
    return {helper:d.helper, placeholder:d.placeholder || a([]), position:d.position, originalPosition:d.originalPosition, offset:d.positionAbs, item:d.currentItem, sender:c ? c.element : null};
  }});
  a.extend(a.ui.sortable, {version:"1.8"});
})(jQuery);
(function(a) {
  a.widget("ui.accordion", {options:{active:0, animated:"slide", autoHeight:!0, clearStyle:!1, collapsible:!1, event:"click", fillSpace:!1, header:"> li > :first-child,> :not(li):even", icons:{header:"ui-icon-triangle-1-e", headerSelected:"ui-icon-triangle-1-s"}, navigation:!1, navigationFilter:function() {
    return this.href.toLowerCase() == location.href.toLowerCase();
  }}, _create:function() {
    var c = this.options, d = this;
    this.running = 0;
    this.element.addClass("ui-accordion ui-widget ui-helper-reset");
    "UL" == this.element[0].nodeName && this.element.children("li").addClass("ui-accordion-li-fix");
    this.headers = this.element.find(c.header).addClass("ui-accordion-header ui-helper-reset ui-state-default ui-corner-all").bind("mouseenter.accordion", function() {
      a(this).addClass("ui-state-hover");
    }).bind("mouseleave.accordion", function() {
      a(this).removeClass("ui-state-hover");
    }).bind("focus.accordion", function() {
      a(this).addClass("ui-state-focus");
    }).bind("blur.accordion", function() {
      a(this).removeClass("ui-state-focus");
    });
    this.headers.next().addClass("ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom");
    if (c.navigation) {
      var b = this.element.find("a").filter(c.navigationFilter);
      if (b.length) {
        var e = b.closest(".ui-accordion-header");
        e.length ? this.active = e : this.active = b.closest(".ui-accordion-content").prev();
      }
    }
    this.active = this._findActive(this.active || c.active).toggleClass("ui-state-default").toggleClass("ui-state-active").toggleClass("ui-corner-all").toggleClass("ui-corner-top");
    this.active.next().addClass("ui-accordion-content-active");
    this._createIcons();
    a.browser.msie && this.element.find("a").css("zoom", "1");
    this.resize();
    this.element.attr("role", "tablist");
    this.headers.attr("role", "tab").bind("keydown", function(a) {
      return d._keydown(a);
    }).next().attr("role", "tabpanel");
    this.headers.not(this.active || "").attr("aria-expanded", "false").attr("tabIndex", "-1").next().hide();
    this.active.length ? this.active.attr("aria-expanded", "true").attr("tabIndex", "0") : this.headers.eq(0).attr("tabIndex", "0");
    a.browser.safari || this.headers.find("a").attr("tabIndex", "-1");
    c.event && this.headers.bind(c.event + ".accordion", function(a) {
      d._clickHandler.call(d, a, this);
      a.preventDefault();
    });
  }, _createIcons:function() {
    var c = this.options;
    c.icons && (a("<span/>").addClass("ui-icon " + c.icons.header).prependTo(this.headers), this.active.find(".ui-icon").toggleClass(c.icons.header).toggleClass(c.icons.headerSelected), this.element.addClass("ui-accordion-icons"));
  }, _destroyIcons:function() {
    this.headers.children(".ui-icon").remove();
    this.element.removeClass("ui-accordion-icons");
  }, destroy:function() {
    var a = this.options;
    this.element.removeClass("ui-accordion ui-widget ui-helper-reset").removeAttr("role").unbind(".accordion").removeData("accordion");
    this.headers.unbind(".accordion").removeClass("ui-accordion-header ui-helper-reset ui-state-default ui-corner-all ui-state-active ui-corner-top").removeAttr("role").removeAttr("aria-expanded").removeAttr("tabindex");
    this.headers.find("a").removeAttr("tabindex");
    this._destroyIcons();
    var d = this.headers.next().css("display", "").removeAttr("role").removeClass("ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content ui-accordion-content-active");
    return (a.autoHeight || a.fillHeight) && d.css("height", ""), this;
  }, _setOption:function(c, d) {
    a.Widget.prototype._setOption.apply(this, arguments);
    "active" == c && this.activate(d);
    "icons" == c && (this._destroyIcons(), d && this._createIcons());
  }, _keydown:function(c) {
    var d = a.ui.keyCode;
    if (!(this.options.disabled || c.altKey || c.ctrlKey)) {
      var b = this.headers.length, e = this.headers.index(c.target), f = !1;
      switch(c.keyCode) {
        case d.RIGHT:
        case d.DOWN:
          f = this.headers[(e + 1) % b];
          break;
        case d.LEFT:
        case d.UP:
          f = this.headers[(e - 1 + b) % b];
          break;
        case d.SPACE:
        case d.ENTER:
          this._clickHandler({target:c.target}, c.target), c.preventDefault();
      }
      return f ? (a(c.target).attr("tabIndex", "-1"), a(f).attr("tabIndex", "0"), f.focus(), !1) : !0;
    }
  }, resize:function() {
    var c = this.options;
    if (c.fillSpace) {
      if (a.browser.msie) {
        var d = this.element.parent().css("overflow");
        this.element.parent().css("overflow", "hidden");
      }
      var b = this.element.parent().height();
      a.browser.msie && this.element.parent().css("overflow", d);
      this.headers.each(function() {
        b -= a(this).outerHeight(!0);
      });
      this.headers.next().each(function() {
        a(this).height(Math.max(0, b - a(this).innerHeight() + a(this).height()));
      }).css("overflow", "auto");
    } else {
      c.autoHeight && (b = 0, this.headers.next().each(function() {
        b = Math.max(b, a(this).height());
      }).height(b));
    }
    return this;
  }, activate:function(a) {
    this.options.active = a;
    a = this._findActive(a)[0];
    return this._clickHandler({target:a}, a), this;
  }, _findActive:function(c) {
    return c ? "number" == typeof c ? this.headers.filter(":eq(" + c + ")") : this.headers.not(this.headers.not(c)) : !1 === c ? a([]) : this.headers.filter(":eq(0)");
  }, _clickHandler:function(c, d) {
    var b = this.options;
    if (!b.disabled) {
      if (c.target) {
        c = a(c.currentTarget || d), d = c[0] == this.active[0], b.active = b.collapsible && d ? !1 : a(".ui-accordion-header", this.element).index(c), this.running || !b.collapsible && d || (this.active.removeClass("ui-state-active ui-corner-top").addClass("ui-state-default ui-corner-all").find(".ui-icon").removeClass(b.icons.headerSelected).addClass(b.icons.header), d || (c.removeClass("ui-state-default ui-corner-all").addClass("ui-state-active ui-corner-top").find(".ui-icon").removeClass(b.icons.header).addClass(b.icons.headerSelected), 
        c.next().addClass("ui-accordion-content-active")), g = c.next(), e = this.active.next(), f = {options:b, newHeader:d && b.collapsible ? a([]) : c, oldHeader:this.active, newContent:d && b.collapsible ? a([]) : g, oldContent:e}, b = this.headers.index(this.active[0]) > this.headers.index(c[0]), this.active = d ? a([]) : c, this._toggle(g, e, f, d, b));
      } else {
        if (b.collapsible) {
          this.active.removeClass("ui-state-active ui-corner-top").addClass("ui-state-default ui-corner-all").find(".ui-icon").removeClass(b.icons.headerSelected).addClass(b.icons.header);
          this.active.next().addClass("ui-accordion-content-active");
          var e = this.active.next(), f = {options:b, newHeader:a([]), oldHeader:b.active, newContent:a([]), oldContent:e}, g = this.active = a([]);
          this._toggle(g, e, f);
        }
      }
    }
  }, _toggle:function(c, d, b, e, f) {
    var g = this.options, l = this;
    this.toShow = c;
    this.toHide = d;
    this.data = b;
    var k = function() {
      if (l) {
        return l._completed.apply(l, arguments);
      }
    };
    this._trigger("changestart", null, this.data);
    this.running = 0 === d.size() ? c.size() : d.size();
    if (g.animated) {
      b = {};
      g.collapsible && e ? b = {toShow:a([]), toHide:d, complete:k, down:f, autoHeight:g.autoHeight || g.fillSpace} : b = {toShow:c, toHide:d, complete:k, down:f, autoHeight:g.autoHeight || g.fillSpace};
      g.proxied || (g.proxied = g.animated);
      g.proxiedDuration || (g.proxiedDuration = g.duration);
      g.animated = a.isFunction(g.proxied) ? g.proxied(b) : g.proxied;
      g.duration = a.isFunction(g.proxiedDuration) ? g.proxiedDuration(b) : g.proxiedDuration;
      e = a.ui.accordion.animations;
      var n = g.duration, q = g.animated;
      q && !e[q] && !a.easing[q] && (q = "slide");
      e[q] || (e[q] = function(a) {
        this.slide(a, {easing:q, duration:n || 700});
      });
      e[q](b);
    } else {
      g.collapsible && e ? c.toggle() : (d.hide(), c.show()), k(!0);
    }
    d.prev().attr("aria-expanded", "false").attr("tabIndex", "-1").blur();
    c.prev().attr("aria-expanded", "true").attr("tabIndex", "0").focus();
  }, _completed:function(a) {
    var c = this.options;
    this.running = a ? 0 : --this.running;
    this.running || (c.clearStyle && this.toShow.add(this.toHide).css({height:"", overflow:""}), this.toHide.removeClass("ui-accordion-content-active"), this._trigger("change", null, this.data));
  }});
  a.extend(a.ui.accordion, {version:"1.8", animations:{slide:function(c, d) {
    c = a.extend({easing:"swing", duration:300}, c, d);
    if (c.toHide.size()) {
      if (c.toShow.size()) {
        var b = c.toShow.css("overflow"), e = 0, f = {}, g = {};
        d = c.toShow;
        var l = d[0].style.width;
        d.width(parseInt(d.parent().width(), 10) - parseInt(d.css("paddingLeft"), 10) - parseInt(d.css("paddingRight"), 10) - (parseInt(d.css("borderLeftWidth"), 10) || 0) - (parseInt(d.css("borderRightWidth"), 10) || 0));
        a.each(["height", "paddingTop", "paddingBottom"], function(b, e) {
          g[e] = "hide";
          b = ("" + a.css(c.toShow[0], e)).match(/^([\d+-.]+)(.*)$/);
          f[e] = {value:b[1], unit:b[2] || "px"};
        });
        c.toShow.css({height:0, overflow:"hidden"}).show();
        c.toHide.filter(":hidden").each(c.complete).end().filter(":visible").animate(g, {step:function(a, b) {
          "height" == b.prop && (e = 0 === b.end - b.start ? 0 : (b.now - b.start) / (b.end - b.start));
          c.toShow[0].style[b.prop] = e * f[b.prop].value + f[b.prop].unit;
        }, duration:c.duration, easing:c.easing, complete:function() {
          c.autoHeight || c.toShow.css("height", "");
          c.toShow.css("width", l);
          c.toShow.css({overflow:b});
          c.complete();
        }});
      } else {
        c.toHide.animate({height:"hide"}, c);
      }
    } else {
      c.toShow.animate({height:"show"}, c);
    }
  }, bounceslide:function(a) {
    this.slide(a, {easing:a.down ? "easeOutBounce" : "swing", duration:a.down ? 1E3 : 200});
  }}});
})(jQuery);
(function(a) {
  a.widget("ui.autocomplete", {options:{minLength:1, delay:300}, _create:function() {
    var c = this, d = this.element[0].ownerDocument;
    this.element.addClass("ui-autocomplete-input").attr("autocomplete", "off").attr({role:"textbox", "aria-autocomplete":"list", "aria-haspopup":"true"}).bind("keydown.autocomplete", function(b) {
      var e = a.ui.keyCode;
      switch(b.keyCode) {
        case e.PAGE_UP:
          c._move("previousPage", b);
          break;
        case e.PAGE_DOWN:
          c._move("nextPage", b);
          break;
        case e.UP:
          c._move("previous", b);
          b.preventDefault();
          break;
        case e.DOWN:
          c._move("next", b);
          b.preventDefault();
          break;
        case e.ENTER:
          c.menu.active && b.preventDefault();
        case e.TAB:
          if (!c.menu.active) {
            break;
          }
          c.menu.select();
          break;
        case e.ESCAPE:
          c.element.val(c.term);
          c.close(b);
          break;
        case e.SHIFT:
        case e.CONTROL:
        case 18:
          break;
        default:
          clearTimeout(c.searching), c.searching = setTimeout(function() {
            c.search(null, b);
          }, c.options.delay);
      }
    }).bind("focus.autocomplete", function() {
      c.previous = c.element.val();
    }).bind("blur.autocomplete", function(a) {
      clearTimeout(c.searching);
      c.closing = setTimeout(function() {
        c.close(a);
      }, 150);
    });
    this._initSource();
    this.response = function() {
      return c._response.apply(c, arguments);
    };
    this.menu = a("<ul></ul>").addClass("ui-autocomplete").appendTo("body", d).menu({focus:function(a, e) {
      a = e.item.data("item.autocomplete");
      !1 !== c._trigger("focus", null, {item:a}) && c.element.val(a.value);
    }, selected:function(a, e) {
      e = e.item.data("item.autocomplete");
      !1 !== c._trigger("select", a, {item:e}) && c.element.val(e.value);
      c.close(a);
      c.previous = c.element.val();
      c.element[0] !== d.activeElement && c.element.focus();
    }, blur:function(a, e) {
      c.menu.element.is(":visible") && c.element.val(c.term);
    }}).zIndex(this.element.zIndex() + 1).css({top:0, left:0}).hide().data("menu");
    a.fn.bgiframe && this.menu.element.bgiframe();
  }, destroy:function() {
    this.element.removeClass("ui-autocomplete-input ui-widget ui-widget-content").removeAttr("autocomplete").removeAttr("role").removeAttr("aria-autocomplete").removeAttr("aria-haspopup");
    this.menu.element.remove();
    a.Widget.prototype.destroy.call(this);
  }, _setOption:function(c) {
    a.Widget.prototype._setOption.apply(this, arguments);
    "source" === c && this._initSource();
  }, _initSource:function() {
    var c, d;
    a.isArray(this.options.source) ? (c = this.options.source, this.source = function(b, e) {
      var d = new RegExp(a.ui.autocomplete.escapeRegex(b.term), "i");
      e(a.grep(c, function(a) {
        return d.test(a.label || a.value || a);
      }));
    }) : "string" == typeof this.options.source ? (d = this.options.source, this.source = function(b, e) {
      a.getJSON(d, b, e);
    }) : this.source = this.options.source;
  }, search:function(a, d) {
    a = null != a ? a : this.element.val();
    if (a.length < this.options.minLength) {
      return this.close(d);
    }
    clearTimeout(this.closing);
    if (!1 !== this._trigger("search")) {
      return this._search(a);
    }
  }, _search:function(a) {
    this.term = this.element.addClass("ui-autocomplete-loading").val();
    this.source({term:a}, this.response);
  }, _response:function(a) {
    a.length ? (a = this._normalize(a), this._suggest(a), this._trigger("open")) : this.close();
    this.element.removeClass("ui-autocomplete-loading");
  }, close:function(a) {
    clearTimeout(this.closing);
    this.menu.element.is(":visible") && (this._trigger("close", a), this.menu.element.hide(), this.menu.deactivate());
    this.previous !== this.element.val() && this._trigger("change", a);
  }, _normalize:function(c) {
    return c.length && c[0].label && c[0].value ? c : a.map(c, function(c) {
      return "string" == typeof c ? {label:c, value:c} : a.extend({label:c.label || c.value, value:c.value || c.label}, c);
    });
  }, _suggest:function(a) {
    var c = this.menu.element.empty().zIndex(this.element.zIndex() + 1);
    this._renderMenu(c, a);
    this.menu.deactivate();
    this.menu.refresh();
    this.menu.element.show().position({my:"left top", at:"left bottom", of:this.element, collision:"none"});
    a = c.width("").width();
    var b = this.element.width();
    c.width(Math.max(a, b));
  }, _renderMenu:function(c, d) {
    var b = this;
    a.each(d, function(a, d) {
      b._renderItem(c, d);
    });
  }, _renderItem:function(c, d) {
    return a("<li></li>").data("item.autocomplete", d).append("<a>" + d.label + "</a>").appendTo(c);
  }, _move:function(a, d) {
    if (this.menu.element.is(":visible")) {
      if (this.menu.first() && /^previous/.test(a) || this.menu.last() && /^next/.test(a)) {
        this.element.val(this.term), this.menu.deactivate();
      } else {
        this.menu[a]();
      }
    } else {
      this.search(null, d);
    }
  }, widget:function() {
    return this.menu.element;
  }});
  a.extend(a.ui.autocomplete, {escapeRegex:function(a) {
    return a.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi, "\\$1");
  }});
})(jQuery);
(function(a) {
  a.widget("ui.menu", {_create:function() {
    var a = this;
    this.element.addClass("ui-menu ui-widget ui-widget-content ui-corner-all").attr({role:"listbox", "aria-activedescendant":"ui-active-menuitem"}).click(function(c) {
      c.preventDefault();
      a.select();
    });
    this.refresh();
  }, refresh:function() {
    var c = this;
    this.element.children("li:not(.ui-menu-item):has(a)").addClass("ui-menu-item").attr("role", "menuitem").children("a").addClass("ui-corner-all").attr("tabindex", -1).mouseenter(function() {
      c.activate(a(this).parent());
    }).mouseleave(function() {
      c.deactivate();
    });
  }, activate:function(a) {
    this.deactivate();
    if (this.hasScroll()) {
      var c = a.offset().top - this.element.offset().top, b = this.element.attr("scrollTop"), e = this.element.height();
      0 > c ? this.element.attr("scrollTop", b + c) : c > e && this.element.attr("scrollTop", b + c - e + a.height());
    }
    this.active = a.eq(0).children("a").addClass("ui-state-hover").attr("id", "ui-active-menuitem").end();
    this._trigger("focus", null, {item:a});
  }, deactivate:function() {
    this.active && (this.active.children("a").removeClass("ui-state-hover").removeAttr("id"), this._trigger("blur"), this.active = null);
  }, next:function() {
    this.move("next", "li:first");
  }, previous:function() {
    this.move("prev", "li:last");
  }, first:function() {
    return this.active && !this.active.prev().length;
  }, last:function() {
    return this.active && !this.active.next().length;
  }, move:function(a, d) {
    this.active ? (a = this.active[a](), a.length ? this.activate(a) : this.activate(this.element.children(d))) : this.activate(this.element.children(d));
  }, nextPage:function() {
    if (this.hasScroll()) {
      if (!this.active || this.last()) {
        this.activate(this.element.children(":first"));
      } else {
        var c = this.active.offset().top, d = this.element.height(), b = this.element.children("li").filter(function() {
          var b = a(this).offset().top - c - d + a(this).height();
          return 10 > b && -10 < b;
        });
        b.length || (b = this.element.children(":last"));
        this.activate(b);
      }
    } else {
      this.activate(this.element.children(!this.active || this.last() ? ":first" : ":last"));
    }
  }, previousPage:function() {
    if (this.hasScroll()) {
      if (!this.active || this.first()) {
        this.activate(this.element.children(":last"));
      } else {
        var c = this.active.offset().top, d = this.element.height();
        result = this.element.children("li").filter(function() {
          var b = a(this).offset().top - c + d - a(this).height();
          return 10 > b && -10 < b;
        });
        result.length || (result = this.element.children(":first"));
        this.activate(result);
      }
    } else {
      this.activate(this.element.children(!this.active || this.first() ? ":last" : ":first"));
    }
  }, hasScroll:function() {
    return this.element.height() < this.element.attr("scrollHeight");
  }, select:function() {
    this._trigger("selected", null, {item:this.active});
  }});
})(jQuery);
(function(a) {
  var c, d = function(b) {
    a(":ui-button", b.target.form).each(function() {
      var b = a(this).data("button");
      setTimeout(function() {
        b.refresh();
      }, 1);
    });
  }, b = function(b) {
    var e = b.name, c = b.form, d = a([]);
    return e && (c ? d = a(c).find("[name='" + e + "']") : d = a("[name='" + e + "']", b.ownerDocument).filter(function() {
      return !this.form;
    })), d;
  };
  a.widget("ui.button", {options:{text:!0, label:null, icons:{primary:null, secondary:null}}, _create:function() {
    this.element.closest("form").unbind("reset.button").bind("reset.button", d);
    this._determineButtonType();
    this.hasTitle = !!this.buttonElement.attr("title");
    var e = this, f = this.options, g = "checkbox" === this.type || "radio" === this.type, l = "ui-state-hover" + (g ? "" : " ui-state-active");
    null === f.label && (f.label = this.buttonElement.html());
    this.element.is(":disabled") && (f.disabled = !0);
    this.buttonElement.addClass("ui-button ui-widget ui-state-default ui-corner-all").attr("role", "button").bind("mouseenter.button", function() {
      f.disabled || (a(this).addClass("ui-state-hover"), this === c && a(this).addClass("ui-state-active"));
    }).bind("mouseleave.button", function() {
      f.disabled || a(this).removeClass(l);
    }).bind("focus.button", function() {
      a(this).addClass("ui-state-focus");
    }).bind("blur.button", function() {
      a(this).removeClass("ui-state-focus");
    });
    g && this.element.bind("change.button", function() {
      e.refresh();
    });
    "checkbox" === this.type ? this.buttonElement.bind("click.button", function() {
      if (f.disabled) {
        return !1;
      }
      a(this).toggleClass("ui-state-active");
      e.buttonElement.attr("aria-pressed", e.element[0].checked);
    }) : "radio" === this.type ? this.buttonElement.bind("click.button", function() {
      if (f.disabled) {
        return !1;
      }
      a(this).addClass("ui-state-active");
      e.buttonElement.attr("aria-pressed", !0);
      var c = e.element[0];
      b(c).not(c).map(function() {
        return a(this).button("widget")[0];
      }).removeClass("ui-state-active").attr("aria-pressed", !1);
    }) : (this.buttonElement.bind("mousedown.button", function() {
      if (f.disabled) {
        return !1;
      }
      a(this).addClass("ui-state-active");
      c = this;
      a(document).one("mouseup", function() {
        c = null;
      });
    }).bind("mouseup.button", function() {
      if (f.disabled) {
        return !1;
      }
      a(this).removeClass("ui-state-active");
    }).bind("keydown.button", function(b) {
      if (f.disabled) {
        return !1;
      }
      b.keyCode != a.ui.keyCode.SPACE && b.keyCode != a.ui.keyCode.ENTER || a(this).addClass("ui-state-active");
    }).bind("keyup.button", function() {
      a(this).removeClass("ui-state-active");
    }), this.buttonElement.is("a") && this.buttonElement.keyup(function(b) {
      b.keyCode === a.ui.keyCode.SPACE && a(this).click();
    }));
    this._setOption("disabled", f.disabled);
  }, _determineButtonType:function() {
    this.element.is(":checkbox") ? this.type = "checkbox" : this.element.is(":radio") ? this.type = "radio" : this.element.is("input") ? this.type = "input" : this.type = "button";
    if ("checkbox" === this.type || "radio" === this.type) {
      this.buttonElement = this.element.parents().last().find("[for=" + this.element.attr("id") + "]");
      this.element.addClass("ui-helper-hidden-accessible");
      var a = this.element.is(":checked");
      a && this.buttonElement.addClass("ui-state-active");
      this.buttonElement.attr("aria-pressed", a);
    } else {
      this.buttonElement = this.element;
    }
  }, widget:function() {
    return this.buttonElement;
  }, destroy:function() {
    this.element.removeClass("ui-helper-hidden-accessible");
    this.buttonElement.removeClass("ui-button ui-widget ui-state-default ui-corner-all ui-state-hover ui-state-active ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon ui-button-text-only").removeAttr("role").removeAttr("aria-pressed").html(this.buttonElement.find(".ui-button-text").html());
    this.hasTitle || this.buttonElement.removeAttr("title");
    a.Widget.prototype.destroy.call(this);
  }, _setOption:function(b, c) {
    a.Widget.prototype._setOption.apply(this, arguments);
    "disabled" === b && (c ? this.element.attr("disabled", !0) : this.element.removeAttr("disabled"));
    this._resetButton();
  }, refresh:function() {
    var e = this.element.is(":disabled");
    e !== this.options.disabled && this._setOption("disabled", e);
    "radio" === this.type ? b(this.element[0]).each(function() {
      a(this).is(":checked") ? a(this).button("widget").addClass("ui-state-active").attr("aria-pressed", !0) : a(this).button("widget").removeClass("ui-state-active").attr("aria-pressed", !1);
    }) : "checkbox" === this.type && (this.element.is(":checked") ? this.buttonElement.addClass("ui-state-active").attr("aria-pressed", !0) : this.buttonElement.removeClass("ui-state-active").attr("aria-pressed", !1));
  }, _resetButton:function() {
    if ("input" === this.type) {
      this.options.label && this.element.val(this.options.label);
    } else {
      var b = this.buttonElement, c = a("<span></span>").addClass("ui-button-text").html(this.options.label).appendTo(b.empty()).text(), d = this.options.icons, l = d.primary && d.secondary;
      d.primary || d.secondary ? (b.addClass("ui-button-text-icon" + (l ? "s" : "")), d.primary && b.prepend("<span class='ui-button-icon-primary ui-icon " + d.primary + "'></span>"), d.secondary && b.append("<span class='ui-button-icon-secondary ui-icon " + d.secondary + "'></span>"), this.options.text || (b.addClass(l ? "ui-button-icons-only" : "ui-button-icon-only").removeClass("ui-button-text-icons ui-button-text-icon"), this.hasTitle || b.attr("title", c))) : b.addClass("ui-button-text-only");
    }
  }});
  a.widget("ui.buttonset", {_create:function() {
    this.element.addClass("ui-buttonset");
    this._init();
  }, _init:function() {
    this.refresh();
  }, _setOption:function(b, c) {
    "disabled" === b && this.buttons.button("option", b, c);
    a.Widget.prototype._setOption.apply(this, arguments);
  }, refresh:function() {
    this.buttons = this.element.find(":button, :submit, :reset, :checkbox, :radio, a, :data(button)").filter(":ui-button").button("refresh").end().not(":ui-button").button().end().map(function() {
      return a(this).button("widget")[0];
    }).removeClass("ui-corner-all ui-corner-left ui-corner-right").filter(":first").addClass("ui-corner-left").end().filter(":last").addClass("ui-corner-right").end().end();
  }, destroy:function() {
    this.element.removeClass("ui-buttonset");
    this.buttons.map(function() {
      return a(this).button("widget")[0];
    }).removeClass("ui-corner-left ui-corner-right").end().button("destroy");
    a.Widget.prototype.destroy.call(this);
  }});
})(jQuery);
(function(a) {
  a.widget("ui.dialog", {options:{autoOpen:!0, buttons:{}, closeOnEscape:!0, closeText:"close", dialogClass:"", draggable:!0, hide:null, height:"auto", maxHeight:!1, maxWidth:!1, minHeight:150, minWidth:150, modal:!1, position:"center", resizable:!0, show:null, stack:!0, title:"", width:300, zIndex:1E3}, _create:function() {
    this.originalTitle = this.element.attr("title");
    var c = this, d = c.options, b = d.title || c.originalTitle || "&#160;", e = a.ui.dialog.getTitleId(c.element), f = (c.uiDialog = a("<div></div>")).appendTo(document.body).hide().addClass("ui-dialog ui-widget ui-widget-content ui-corner-all " + d.dialogClass).css({zIndex:d.zIndex}).attr("tabIndex", -1).css("outline", 0).keydown(function(b) {
      d.closeOnEscape && b.keyCode && b.keyCode === a.ui.keyCode.ESCAPE && (c.close(b), b.preventDefault());
    }).attr({role:"dialog", "aria-labelledby":e}).mousedown(function(a) {
      c.moveToTop(!1, a);
    });
    c.element.show().removeAttr("title").addClass("ui-dialog-content ui-widget-content").appendTo(f);
    var g = (c.uiDialogTitlebar = a("<div></div>")).addClass("ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix").prependTo(f), l = a('<a href="#"></a>').addClass("ui-dialog-titlebar-close ui-corner-all").attr("role", "button").hover(function() {
      l.addClass("ui-state-hover");
    }, function() {
      l.removeClass("ui-state-hover");
    }).focus(function() {
      l.addClass("ui-state-focus");
    }).blur(function() {
      l.removeClass("ui-state-focus");
    }).click(function(a) {
      return c.close(a), !1;
    }).appendTo(g);
    (c.uiDialogTitlebarCloseText = a("<span></span>")).addClass("ui-icon ui-icon-closethick").text(d.closeText).appendTo(l);
    a("<span></span>").addClass("ui-dialog-title").attr("id", e).html(b).prependTo(g);
    a.isFunction(d.beforeclose) && !a.isFunction(d.beforeClose) && (d.beforeClose = d.beforeclose);
    g.find("*").add(g).disableSelection();
    d.draggable && a.fn.draggable && c._makeDraggable();
    d.resizable && a.fn.resizable && c._makeResizable();
    c._createButtons(d.buttons);
    c._isOpen = !1;
    a.fn.bgiframe && f.bgiframe();
  }, _init:function() {
    this.options.autoOpen && this.open();
  }, destroy:function() {
    return this.overlay && this.overlay.destroy(), this.uiDialog.hide(), this.element.unbind(".dialog").removeData("dialog").removeClass("ui-dialog-content ui-widget-content").hide().appendTo("body"), this.uiDialog.remove(), this.originalTitle && this.element.attr("title", this.originalTitle), this;
  }, widget:function() {
    return this.uiDialog;
  }, close:function(c) {
    var d = this, b;
    if (!1 !== d._trigger("beforeClose", c)) {
      return d.overlay && d.overlay.destroy(), d.uiDialog.unbind("keypress.ui-dialog"), d._isOpen = !1, d.options.hide ? d.uiDialog.hide(d.options.hide, function() {
        d._trigger("close", c);
      }) : (d.uiDialog.hide(), d._trigger("close", c)), a.ui.dialog.overlay.resize(), d.options.modal && (b = 0, a(".ui-dialog").each(function() {
        this !== d.uiDialog[0] && (b = Math.max(b, a(this).css("z-index")));
      }), a.ui.dialog.maxZ = b), d;
    }
  }, isOpen:function() {
    return this._isOpen;
  }, moveToTop:function(c, d) {
    var b = this.options, e;
    return b.modal && !c || !b.stack && !b.modal ? this._trigger("focus", d) : (b.zIndex > a.ui.dialog.maxZ && (a.ui.dialog.maxZ = b.zIndex), this.overlay && (a.ui.dialog.maxZ += 1, this.overlay.$el.css("z-index", a.ui.dialog.overlay.maxZ = a.ui.dialog.maxZ)), e = {scrollTop:this.element.attr("scrollTop"), scrollLeft:this.element.attr("scrollLeft")}, a.ui.dialog.maxZ += 1, this.uiDialog.css("z-index", a.ui.dialog.maxZ), this.element.attr(e), this._trigger("focus", d), this);
  }, open:function() {
    if (!this._isOpen) {
      var c = this.options, d = this.uiDialog;
      return this.overlay = c.modal ? new a.ui.dialog.overlay(this) : null, d.next().length && d.appendTo("body"), this._size(), this._position(c.position), d.show(c.show), this.moveToTop(!0), c.modal && d.bind("keypress.ui-dialog", function(b) {
        if (b.keyCode === a.ui.keyCode.TAB) {
          var e = a(":tabbable", this), c = e.filter(":first");
          e = e.filter(":last");
          if (b.target === e[0] && !b.shiftKey) {
            return c.focus(1), !1;
          }
          if (b.target === c[0] && b.shiftKey) {
            return e.focus(1), !1;
          }
        }
      }), a([]).add(d.find(".ui-dialog-content :tabbable:first")).add(d.find(".ui-dialog-buttonpane :tabbable:first")).add(d).filter(":first").focus(), this._trigger("open"), this._isOpen = !0, this;
    }
  }, _createButtons:function(c) {
    var d = this, b = !1, e = a("<div></div>").addClass("ui-dialog-buttonpane ui-widget-content ui-helper-clearfix");
    d.uiDialog.find(".ui-dialog-buttonpane").remove();
    "object" == typeof c && null !== c && a.each(c, function() {
      return !(b = !0);
    });
    b && (a.each(c, function(b, c) {
      b = a('<button type="button"></button>').text(b).click(function() {
        c.apply(d.element[0], arguments);
      }).appendTo(e);
      a.fn.button && b.button();
    }), e.appendTo(d.uiDialog));
  }, _makeDraggable:function() {
    function c(a) {
      return {position:a.position, offset:a.offset};
    }
    var d = this, b = d.options, e = a(document), f;
    d.uiDialog.draggable({cancel:".ui-dialog-content, .ui-dialog-titlebar-close", handle:".ui-dialog-titlebar", containment:"document", start:function(e, l) {
      f = "auto" === b.height ? "auto" : a(this).height();
      a(this).height(a(this).height()).addClass("ui-dialog-dragging");
      d._trigger("dragStart", e, c(l));
    }, drag:function(a, b) {
      d._trigger("drag", a, c(b));
    }, stop:function(g, l) {
      b.position = [l.position.left - e.scrollLeft(), l.position.top - e.scrollTop()];
      a(this).removeClass("ui-dialog-dragging").height(f);
      d._trigger("dragStop", g, c(l));
      a.ui.dialog.overlay.resize();
    }});
  }, _makeResizable:function(c) {
    function d(a) {
      return {originalPosition:a.originalPosition, originalSize:a.originalSize, position:a.position, size:a.size};
    }
    c = void 0 === c ? this.options.resizable : c;
    var b = this, e = b.options, f = b.uiDialog.css("position");
    c = "string" == typeof c ? c : "n,e,s,w,se,sw,ne,nw";
    b.uiDialog.resizable({cancel:".ui-dialog-content", containment:"document", alsoResize:b.element, maxWidth:e.maxWidth, maxHeight:e.maxHeight, minWidth:e.minWidth, minHeight:b._minHeight(), handles:c, start:function(e, c) {
      a(this).addClass("ui-dialog-resizing");
      b._trigger("resizeStart", e, d(c));
    }, resize:function(a, e) {
      b._trigger("resize", a, d(e));
    }, stop:function(c, f) {
      a(this).removeClass("ui-dialog-resizing");
      e.height = a(this).height();
      e.width = a(this).width();
      b._trigger("resizeStop", c, d(f));
      a.ui.dialog.overlay.resize();
    }}).css("position", f).find(".ui-resizable-se").addClass("ui-icon ui-icon-grip-diagonal-se");
  }, _minHeight:function() {
    var a = this.options;
    return "auto" === a.height ? a.minHeight : Math.min(a.minHeight, a.height);
  }, _position:function(c) {
    var d = [], b = [0, 0];
    c = c || a.ui.dialog.prototype.options.position;
    "string" == typeof c || "object" == typeof c && "0" in c ? (d = c.split ? c.split(" ") : [c[0], c[1]], 1 === d.length && (d[1] = d[0]), a.each(["left", "top"], function(a, c) {
      +d[a] === d[a] && (b[a] = d[a], d[a] = c);
    })) : "object" == typeof c && ("left" in c ? (d[0] = "left", b[0] = c.left) : "right" in c && (d[0] = "right", b[0] = -c.right), "top" in c ? (d[1] = "top", b[1] = c.top) : "bottom" in c && (d[1] = "bottom", b[1] = -c.bottom));
    (c = this.uiDialog.is(":visible")) || this.uiDialog.show();
    this.uiDialog.css({top:0, left:0}).position({my:d.join(" "), at:d.join(" "), offset:b.join(" "), of:window, collision:"fit", using:function(b) {
      var e = a(this).css(b).offset().top;
      0 > e && a(this).css("top", b.top - e);
    }});
    c || this.uiDialog.hide();
  }, _setOption:function(c, d) {
    var b = this.uiDialog, e = b.is(":data(resizable)"), f = !1;
    switch(c) {
      case "beforeclose":
        c = "beforeClose";
        break;
      case "buttons":
        this._createButtons(d);
        break;
      case "closeText":
        this.uiDialogTitlebarCloseText.text("" + d);
        break;
      case "dialogClass":
        b.removeClass(this.options.dialogClass).addClass("ui-dialog ui-widget ui-widget-content ui-corner-all " + d);
        break;
      case "disabled":
        d ? b.addClass("ui-dialog-disabled") : b.removeClass("ui-dialog-disabled");
        break;
      case "draggable":
        d ? this._makeDraggable() : b.draggable("destroy");
        break;
      case "height":
        f = !0;
        break;
      case "maxHeight":
        e && b.resizable("option", "maxHeight", d);
        f = !0;
        break;
      case "maxWidth":
        e && b.resizable("option", "maxWidth", d);
        f = !0;
        break;
      case "minHeight":
        e && b.resizable("option", "minHeight", d);
        f = !0;
        break;
      case "minWidth":
        e && b.resizable("option", "minWidth", d);
        f = !0;
        break;
      case "position":
        this._position(d);
        break;
      case "resizable":
        e && !d && b.resizable("destroy");
        e && "string" == typeof d && b.resizable("option", "handles", d);
        !e && !1 !== d && this._makeResizable(d);
        break;
      case "title":
        a(".ui-dialog-title", this.uiDialogTitlebar).html("" + (d || "&#160;"));
        break;
      case "width":
        f = !0;
    }
    a.Widget.prototype._setOption.apply(this, arguments);
    f && this._size();
  }, _size:function() {
    var a = this.options;
    this.element.css("width", "auto").hide();
    var d = this.uiDialog.css({height:"auto", width:a.width}).height();
    this.element.css("auto" === a.height ? {minHeight:Math.max(a.minHeight - d, 0), height:"auto"} : {minHeight:0, height:Math.max(a.height - d, 0)}).show();
    this.uiDialog.is(":data(resizable)") && this.uiDialog.resizable("option", "minHeight", this._minHeight());
  }});
  a.extend(a.ui.dialog, {version:"1.8", uuid:0, maxZ:0, getTitleId:function(a) {
    a = a.attr("id");
    return a || (this.uuid += 1, a = this.uuid), "ui-dialog-title-" + a;
  }, overlay:function(c) {
    this.$el = a.ui.dialog.overlay.create(c);
  }});
  a.extend(a.ui.dialog.overlay, {instances:[], oldInstances:[], maxZ:0, events:a.map("focus mousedown mouseup keydown keypress click".split(" "), function(a) {
    return a + ".dialog-overlay";
  }).join(" "), create:function(c) {
    0 === this.instances.length && (setTimeout(function() {
      a.ui.dialog.overlay.instances.length && a(document).bind(a.ui.dialog.overlay.events, function(b) {
        return a(b.target).zIndex() >= a.ui.dialog.overlay.maxZ;
      });
    }, 1), a(document).bind("keydown.dialog-overlay", function(b) {
      c.options.closeOnEscape && b.keyCode && b.keyCode === a.ui.keyCode.ESCAPE && (c.close(b), b.preventDefault());
    }), a(window).bind("resize.dialog-overlay", a.ui.dialog.overlay.resize));
    var d = (this.oldInstances.pop() || a("<div></div>").addClass("ui-widget-overlay")).appendTo(document.body).css({width:this.width(), height:this.height()});
    return a.fn.bgiframe && d.bgiframe(), this.instances.push(d), d;
  }, destroy:function(c) {
    this.oldInstances.push(this.instances.splice(a.inArray(c, this.instances), 1)[0]);
    0 === this.instances.length && a([document, window]).unbind(".dialog-overlay");
    c.remove();
    var d = 0;
    a.each(this.instances, function() {
      d = Math.max(d, this.css("z-index"));
    });
    this.maxZ = d;
  }, height:function() {
    var c, d;
    return a.browser.msie && 7 > a.browser.version ? (c = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight), d = Math.max(document.documentElement.offsetHeight, document.body.offsetHeight), c < d ? a(window).height() + "px" : c + "px") : a(document).height() + "px";
  }, width:function() {
    var c, d;
    return a.browser.msie && 7 > a.browser.version ? (c = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth), d = Math.max(document.documentElement.offsetWidth, document.body.offsetWidth), c < d ? a(window).width() + "px" : c + "px") : a(document).width() + "px";
  }, resize:function() {
    var c = a([]);
    a.each(a.ui.dialog.overlay.instances, function() {
      c = c.add(this);
    });
    c.css({width:0, height:0}).css({width:a.ui.dialog.overlay.width(), height:a.ui.dialog.overlay.height()});
  }});
  a.extend(a.ui.dialog.overlay.prototype, {destroy:function() {
    a.ui.dialog.overlay.destroy(this.$el);
  }});
})(jQuery);
(function(a) {
  a.widget("ui.slider", a.ui.mouse, {widgetEventPrefix:"slide", options:{animate:!1, distance:0, max:100, min:0, orientation:"horizontal", range:!1, step:1, value:0, values:null}, _create:function() {
    var c = this, d = this.options;
    this._mouseSliding = this._keySliding = !1;
    this._animateOff = !0;
    this._handleIndex = null;
    this._detectOrientation();
    this._mouseInit();
    this.element.addClass("ui-slider ui-slider-" + this.orientation + " ui-widget ui-widget-content ui-corner-all");
    d.disabled && this.element.addClass("ui-slider-disabled ui-disabled");
    this.range = a([]);
    d.range && (!0 === d.range ? (this.range = a("<div></div>"), d.values || (d.values = [this._valueMin(), this._valueMin()]), d.values.length && 2 != d.values.length && (d.values = [d.values[0], d.values[0]])) : this.range = a("<div></div>"), this.range.appendTo(this.element).addClass("ui-slider-range"), ("min" == d.range || "max" == d.range) && this.range.addClass("ui-slider-range-" + d.range), this.range.addClass("ui-widget-header"));
    0 == a(".ui-slider-handle", this.element).length && a('<a href="#"></a>').appendTo(this.element).addClass("ui-slider-handle");
    if (d.values && d.values.length) {
      for (; a(".ui-slider-handle", this.element).length < d.values.length;) {
        a('<a href="#"></a>').appendTo(this.element).addClass("ui-slider-handle");
      }
    }
    this.handles = a(".ui-slider-handle", this.element).addClass("ui-state-default ui-corner-all");
    this.handle = this.handles.eq(0);
    this.handles.add(this.range).filter("a").click(function(a) {
      a.preventDefault();
    }).hover(function() {
      d.disabled || a(this).addClass("ui-state-hover");
    }, function() {
      a(this).removeClass("ui-state-hover");
    }).focus(function() {
      d.disabled ? a(this).blur() : (a(".ui-slider .ui-state-focus").removeClass("ui-state-focus"), a(this).addClass("ui-state-focus"));
    }).blur(function() {
      a(this).removeClass("ui-state-focus");
    });
    this.handles.each(function(b) {
      a(this).data("index.ui-slider-handle", b);
    });
    this.handles.keydown(function(b) {
      var e = !0, d = a(this).data("index.ui-slider-handle");
      if (!c.options.disabled) {
        switch(b.keyCode) {
          case a.ui.keyCode.HOME:
          case a.ui.keyCode.END:
          case a.ui.keyCode.PAGE_UP:
          case a.ui.keyCode.PAGE_DOWN:
          case a.ui.keyCode.UP:
          case a.ui.keyCode.RIGHT:
          case a.ui.keyCode.DOWN:
          case a.ui.keyCode.LEFT:
            e = !1, c._keySliding || (c._keySliding = !0, a(this).addClass("ui-state-active"), c._start(b, d));
        }
        var g, l, k = c._step();
        c.options.values && c.options.values.length ? g = l = c.values(d) : g = l = c.value();
        switch(b.keyCode) {
          case a.ui.keyCode.HOME:
            l = c._valueMin();
            break;
          case a.ui.keyCode.END:
            l = c._valueMax();
            break;
          case a.ui.keyCode.PAGE_UP:
            l = g + (c._valueMax() - c._valueMin()) / 5;
            break;
          case a.ui.keyCode.PAGE_DOWN:
            l = g - (c._valueMax() - c._valueMin()) / 5;
            break;
          case a.ui.keyCode.UP:
          case a.ui.keyCode.RIGHT:
            if (g == c._valueMax()) {
              return;
            }
            l = g + k;
            break;
          case a.ui.keyCode.DOWN:
          case a.ui.keyCode.LEFT:
            if (g == c._valueMin()) {
              return;
            }
            l = g - k;
        }
        return c._slide(b, d, l), e;
      }
    }).keyup(function(b) {
      var e = a(this).data("index.ui-slider-handle");
      c._keySliding && (c._keySliding = !1, c._stop(b, e), c._change(b, e), a(this).removeClass("ui-state-active"));
    });
    this._refreshValue();
    this._animateOff = !1;
  }, destroy:function() {
    return this.handles.remove(), this.range.remove(), this.element.removeClass("ui-slider ui-slider-horizontal ui-slider-vertical ui-slider-disabled ui-widget ui-widget-content ui-corner-all").removeData("slider").unbind(".slider"), this._mouseDestroy(), this;
  }, _mouseCapture:function(c) {
    var d = this.options;
    if (d.disabled) {
      return !1;
    }
    this.elementSize = {width:this.element.outerWidth(), height:this.element.outerHeight()};
    this.elementOffset = this.element.offset();
    var b = {x:c.pageX, y:c.pageY}, e = this._normValueFromMouse(b), f = this._valueMax() - this._valueMin() + 1, g, l = this, k;
    this.handles.each(function(b) {
      var c = Math.abs(e - l.values(b));
      f > c && (f = c, g = a(this), k = b);
    });
    1 == d.range && this.values(1) == d.min && (g = a(this.handles[++k]));
    this._start(c, k);
    this._mouseSliding = !0;
    l._handleIndex = k;
    g.addClass("ui-state-active").focus();
    d = g.offset();
    return this._clickOffset = a(c.target).parents().andSelf().is(".ui-slider-handle") ? {left:c.pageX - d.left - g.width() / 2, top:c.pageY - d.top - g.height() / 2 - (parseInt(g.css("borderTopWidth"), 10) || 0) - (parseInt(g.css("borderBottomWidth"), 10) || 0) + (parseInt(g.css("marginTop"), 10) || 0)} : {left:0, top:0}, e = this._normValueFromMouse(b), this._slide(c, k, e), this._animateOff = !0, !0;
  }, _mouseStart:function(a) {
    return !0;
  }, _mouseDrag:function(a) {
    var c = this._normValueFromMouse({x:a.pageX, y:a.pageY});
    return this._slide(a, this._handleIndex, c), !1;
  }, _mouseStop:function(a) {
    return this.handles.removeClass("ui-state-active"), this._mouseSliding = !1, this._stop(a, this._handleIndex), this._change(a, this._handleIndex), this._handleIndex = null, this._clickOffset = null, this._animateOff = !1, !1;
  }, _detectOrientation:function() {
    this.orientation = "vertical" == this.options.orientation ? "vertical" : "horizontal";
  }, _normValueFromMouse:function(a) {
    var c, b;
    "horizontal" == this.orientation ? (c = this.elementSize.width, b = a.x - this.elementOffset.left - (this._clickOffset ? this._clickOffset.left : 0)) : (c = this.elementSize.height, b = a.y - this.elementOffset.top - (this._clickOffset ? this._clickOffset.top : 0));
    a = b / c;
    1 < a && (a = 1);
    0 > a && (a = 0);
    "vertical" == this.orientation && (a = 1 - a);
    c = this._valueMax() - this._valueMin();
    c *= a;
    a = c % this.options.step;
    c = this._valueMin() + c - a;
    return a > this.options.step / 2 && (c += this.options.step), parseFloat(c.toFixed(5));
  }, _start:function(a, d) {
    var b = {handle:this.handles[d], value:this.value()};
    this.options.values && this.options.values.length && (b.value = this.values(d), b.values = this.values());
    this._trigger("start", a, b);
  }, _slide:function(a, d, b) {
    if (this.options.values && this.options.values.length) {
      var e = this.values(d ? 0 : 1);
      2 == this.options.values.length && !0 === this.options.range && (0 == d && b > e || 1 == d && b < e) && (b = e);
      b != this.values(d) && (e = this.values(), e[d] = b, a = this._trigger("slide", a, {handle:this.handles[d], value:b, values:e}), this.values(d ? 0 : 1), !1 !== a && this.values(d, b, !0));
    } else {
      b != this.value() && (a = this._trigger("slide", a, {handle:this.handles[d], value:b}), !1 !== a && this.value(b));
    }
  }, _stop:function(a, d) {
    var b = {handle:this.handles[d], value:this.value()};
    this.options.values && this.options.values.length && (b.value = this.values(d), b.values = this.values());
    this._trigger("stop", a, b);
  }, _change:function(a, d) {
    if (!this._keySliding && !this._mouseSliding) {
      var b = {handle:this.handles[d], value:this.value()};
      this.options.values && this.options.values.length && (b.value = this.values(d), b.values = this.values());
      this._trigger("change", a, b);
    }
  }, value:function(a) {
    return arguments.length && (this.options.value = this._trimValue(a), this._refreshValue(), this._change(null, 0)), this._value();
  }, values:function(c, d) {
    1 < arguments.length && (this.options.values[c] = this._trimValue(d), this._refreshValue(), this._change(null, c));
    if (!arguments.length) {
      return this._values();
    }
    if (!a.isArray(arguments[0])) {
      return this.options.values && this.options.values.length ? this._values(c) : this.value();
    }
    for (var b = this.options.values, e = arguments[0], f = 0, g = b.length; f < g; f++) {
      b[f] = this._trimValue(e[f]), this._change(null, f);
    }
    this._refreshValue();
  }, _setOption:function(c, d) {
    var b, e = 0;
    jQuery.isArray(this.options.values) && (e = this.options.values.length);
    a.Widget.prototype._setOption.apply(this, arguments);
    switch(c) {
      case "disabled":
        d ? (this.handles.filter(".ui-state-focus").blur(), this.handles.removeClass("ui-state-hover"), this.handles.attr("disabled", "disabled"), this.element.addClass("ui-disabled")) : (this.handles.removeAttr("disabled"), this.element.removeClass("ui-disabled"));
      case "orientation":
        this._detectOrientation();
        this.element.removeClass("ui-slider-horizontal ui-slider-vertical").addClass("ui-slider-" + this.orientation);
        this._refreshValue();
        break;
      case "value":
        this._animateOff = !0;
        this._refreshValue();
        this._change(null, 0);
        this._animateOff = !1;
        break;
      case "values":
        this._animateOff = !0;
        this._refreshValue();
        for (b = 0; b < e; b++) {
          this._change(null, b);
        }
        this._animateOff = !1;
    }
  }, _step:function() {
    return this.options.step;
  }, _value:function() {
    var a = this.options.value;
    return a = this._trimValue(a), a;
  }, _values:function(a) {
    if (arguments.length) {
      var c = this.options.values[a];
      return c = this._trimValue(c), c;
    }
    c = this.options.values.slice();
    for (var b = 0, e = c.length; b < e; b++) {
      c[b] = this._trimValue(c[b]);
    }
    return c;
  }, _trimValue:function(a) {
    return a < this._valueMin() && (a = this._valueMin()), a > this._valueMax() && (a = this._valueMax()), a;
  }, _valueMin:function() {
    return this.options.min;
  }, _valueMax:function() {
    return this.options.max;
  }, _refreshValue:function() {
    var c = this.options.range, d = this.options, b = this, e = this._animateOff ? !1 : d.animate;
    if (this.options.values && this.options.values.length) {
      this.handles.each(function(c, f) {
        f = (b.values(c) - b._valueMin()) / (b._valueMax() - b._valueMin()) * 100;
        var g = {};
        g["horizontal" == b.orientation ? "left" : "bottom"] = f + "%";
        a(this).stop(1, 1)[e ? "animate" : "css"](g, d.animate);
        !0 === b.options.range && ("horizontal" == b.orientation ? (0 == c && b.range.stop(1, 1)[e ? "animate" : "css"]({left:f + "%"}, d.animate), 1 == c && b.range[e ? "animate" : "css"]({width:f - lastValPercent + "%"}, {queue:!1, duration:d.animate})) : (0 == c && b.range.stop(1, 1)[e ? "animate" : "css"]({bottom:f + "%"}, d.animate), 1 == c && b.range[e ? "animate" : "css"]({height:f - lastValPercent + "%"}, {queue:!1, duration:d.animate})));
        lastValPercent = f;
      });
    } else {
      var f = this.value(), g = this._valueMin(), l = this._valueMax();
      f = l != g ? (f - g) / (l - g) * 100 : 0;
      g = {};
      g["horizontal" == b.orientation ? "left" : "bottom"] = f + "%";
      this.handle.stop(1, 1)[e ? "animate" : "css"](g, d.animate);
      "min" == c && "horizontal" == this.orientation && this.range.stop(1, 1)[e ? "animate" : "css"]({width:f + "%"}, d.animate);
      "max" == c && "horizontal" == this.orientation && this.range[e ? "animate" : "css"]({width:100 - f + "%"}, {queue:!1, duration:d.animate});
      "min" == c && "vertical" == this.orientation && this.range.stop(1, 1)[e ? "animate" : "css"]({height:f + "%"}, d.animate);
      "max" == c && "vertical" == this.orientation && this.range[e ? "animate" : "css"]({height:100 - f + "%"}, {queue:!1, duration:d.animate});
    }
  }});
  a.extend(a.ui.slider, {version:"1.8"});
})(jQuery);
(function(a) {
  var c = 0, d = 0;
  a.widget("ui.tabs", {options:{add:null, ajaxOptions:null, cache:!1, cookie:null, collapsible:!1, disable:null, disabled:[], enable:null, event:"click", fx:null, idPrefix:"ui-tabs-", load:null, panelTemplate:"<div></div>", remove:null, select:null, show:null, spinner:"<em>Loading&#8230;</em>", tabTemplate:'<li><a href="#{href}"><span>#{label}</span></a></li>'}, _create:function() {
    this._tabify(!0);
  }, _setOption:function(a, e) {
    "selected" == a ? this.options.collapsible && e == this.options.selected || this.select(e) : (this.options[a] = e, this._tabify());
  }, _tabId:function(a) {
    return a.title && a.title.replace(/\s/g, "_").replace(/[^A-Za-z0-9\-_:\.]/g, "") || this.options.idPrefix + ++c;
  }, _sanitizeSelector:function(a) {
    return a.replace(/:/g, "\\:");
  }, _cookie:function() {
    var b = this.cookie || (this.cookie = this.options.cookie.name || "ui-tabs-" + ++d);
    return a.cookie.apply(null, [b].concat(a.makeArray(arguments)));
  }, _ui:function(a, e) {
    return {tab:a, panel:e, index:this.anchors.index(a)};
  }, _cleanup:function() {
    this.lis.filter(".ui-state-processing").removeClass("ui-state-processing").find("span:data(label.tabs)").each(function() {
      var b = a(this);
      b.html(b.data("label.tabs")).removeData("label.tabs");
    });
  }, _tabify:function(b) {
    function e(b, e) {
      b.css({display:""});
      !a.support.opacity && e.opacity && b[0].style.removeAttribute("filter");
    }
    this.list = this.element.find("ol,ul").eq(0);
    this.lis = a("li:has(a[href])", this.list);
    this.anchors = this.lis.map(function() {
      return a("a", this)[0];
    });
    this.panels = a([]);
    var c = this, d = this.options, l = /^#.+/;
    this.anchors.each(function(b, e) {
      var f = a(e).attr("href"), g = f.split("#")[0], m;
      g && (g === location.toString().split("#")[0] || (m = a("base")[0]) && g === m.href) && (f = e.hash, e.href = f);
      l.test(f) ? c.panels = c.panels.add(c._sanitizeSelector(f)) : "#" != f ? (a.data(e, "href.tabs", f), a.data(e, "load.tabs", f.replace(/#.*$/, "")), f = c._tabId(e), e.href = "#" + f, e = a("#" + f), e.length || (e = a(d.panelTemplate).attr("id", f).addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").insertAfter(c.panels[b - 1] || c.list), e.data("destroy.tabs", !0)), c.panels = c.panels.add(e)) : d.disabled.push(b);
    });
    b ? (this.element.addClass("ui-tabs ui-widget ui-widget-content ui-corner-all"), this.list.addClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all"), this.lis.addClass("ui-state-default ui-corner-top"), this.panels.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom"), void 0 === d.selected ? (location.hash && this.anchors.each(function(a, b) {
      if (b.hash == location.hash) {
        return d.selected = a, !1;
      }
    }), "number" != typeof d.selected && d.cookie && (d.selected = parseInt(c._cookie(), 10)), "number" != typeof d.selected && this.lis.filter(".ui-tabs-selected").length && (d.selected = this.lis.index(this.lis.filter(".ui-tabs-selected"))), d.selected = d.selected || (this.lis.length ? 0 : -1)) : null === d.selected && (d.selected = -1), d.selected = 0 <= d.selected && this.anchors[d.selected] || 0 > d.selected ? d.selected : 0, d.disabled = a.unique(d.disabled.concat(a.map(this.lis.filter(".ui-state-disabled"), 
    function(a, b) {
      return c.lis.index(a);
    }))).sort(), -1 != a.inArray(d.selected, d.disabled) && d.disabled.splice(a.inArray(d.selected, d.disabled), 1), this.panels.addClass("ui-tabs-hide"), this.lis.removeClass("ui-tabs-selected ui-state-active"), 0 <= d.selected && this.anchors.length && (this.panels.eq(d.selected).removeClass("ui-tabs-hide"), this.lis.eq(d.selected).addClass("ui-tabs-selected ui-state-active"), c.element.queue("tabs", function() {
      c._trigger("show", null, c._ui(c.anchors[d.selected], c.panels[d.selected]));
    }), this.load(d.selected)), a(window).bind("unload", function() {
      c.lis.add(c.anchors).unbind(".tabs");
      c.lis = c.anchors = c.panels = null;
    })) : d.selected = this.lis.index(this.lis.filter(".ui-tabs-selected"));
    this.element[d.collapsible ? "addClass" : "removeClass"]("ui-tabs-collapsible");
    d.cookie && this._cookie(d.selected, d.cookie);
    b = 0;
    for (var k; k = this.lis[b]; b++) {
      a(k)[-1 == a.inArray(b, d.disabled) || a(k).hasClass("ui-tabs-selected") ? "removeClass" : "addClass"]("ui-state-disabled");
    }
    !1 === d.cache && this.anchors.removeData("cache.tabs");
    this.lis.add(this.anchors).unbind(".tabs");
    if ("mouseover" != d.event) {
      var n = function(a, b) {
        b.is(":not(.ui-state-disabled)") && b.addClass("ui-state-" + a);
      };
      this.lis.bind("mouseover.tabs", function() {
        n("hover", a(this));
      });
      this.lis.bind("mouseout.tabs", function() {
        a(this).removeClass("ui-state-hover");
      });
      this.anchors.bind("focus.tabs", function() {
        n("focus", a(this).closest("li"));
      });
      this.anchors.bind("blur.tabs", function() {
        a(this).closest("li").removeClass("ui-state-focus");
      });
    }
    var q, u;
    d.fx && (a.isArray(d.fx) ? (q = d.fx[0], u = d.fx[1]) : q = u = d.fx);
    var m = u ? function(b, d) {
      a(b).closest("li").addClass("ui-tabs-selected ui-state-active");
      d.hide().removeClass("ui-tabs-hide").animate(u, u.duration || "normal", function() {
        e(d, u);
        c._trigger("show", null, c._ui(b, d[0]));
      });
    } : function(b, e) {
      a(b).closest("li").addClass("ui-tabs-selected ui-state-active");
      e.removeClass("ui-tabs-hide");
      c._trigger("show", null, c._ui(b, e[0]));
    }, p = q ? function(a, b) {
      b.animate(q, q.duration || "normal", function() {
        c.lis.removeClass("ui-tabs-selected ui-state-active");
        b.addClass("ui-tabs-hide");
        e(b, q);
        c.element.dequeue("tabs");
      });
    } : function(a, b, e) {
      c.lis.removeClass("ui-tabs-selected ui-state-active");
      b.addClass("ui-tabs-hide");
      c.element.dequeue("tabs");
    };
    this.anchors.bind(d.event + ".tabs", function() {
      var b = this, e = a(this).closest("li"), f = c.panels.filter(":not(.ui-tabs-hide)"), g = a(c._sanitizeSelector(this.hash));
      if (e.hasClass("ui-tabs-selected") && !d.collapsible || e.hasClass("ui-state-disabled") || e.hasClass("ui-state-processing") || !1 === c._trigger("select", null, c._ui(this, g[0]))) {
        return this.blur(), !1;
      }
      d.selected = c.anchors.index(this);
      c.abort();
      if (d.collapsible) {
        if (e.hasClass("ui-tabs-selected")) {
          return d.selected = -1, d.cookie && c._cookie(d.selected, d.cookie), c.element.queue("tabs", function() {
            p(b, f);
          }).dequeue("tabs"), this.blur(), !1;
        }
        if (!f.length) {
          return d.cookie && c._cookie(d.selected, d.cookie), c.element.queue("tabs", function() {
            m(b, g);
          }), c.load(c.anchors.index(this)), this.blur(), !1;
        }
      }
      d.cookie && c._cookie(d.selected, d.cookie);
      if (!g.length) {
        throw "jQuery UI Tabs: Mismatching fragment identifier.";
      }
      f.length && c.element.queue("tabs", function() {
        p(b, f);
      });
      c.element.queue("tabs", function() {
        m(b, g);
      });
      c.load(c.anchors.index(this));
      a.browser.msie && this.blur();
    });
    this.anchors.bind("click.tabs", function() {
      return !1;
    });
  }, destroy:function() {
    var b = this.options;
    return this.abort(), this.element.unbind(".tabs").removeClass("ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-collapsible").removeData("tabs"), this.list.removeClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all"), this.anchors.each(function() {
      var b = a.data(this, "href.tabs");
      b && (this.href = b);
      var c = a(this).unbind(".tabs");
      a.each(["href", "load", "cache"], function(a, b) {
        c.removeData(b + ".tabs");
      });
    }), this.lis.unbind(".tabs").add(this.panels).each(function() {
      a.data(this, "destroy.tabs") ? a(this).remove() : a(this).removeClass("ui-state-default ui-corner-top ui-tabs-selected ui-state-active ui-state-hover ui-state-focus ui-state-disabled ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide");
    }), b.cookie && this._cookie(null, b.cookie), this;
  }, add:function(b, e, c) {
    void 0 === c && (c = this.anchors.length);
    var d = this, f = this.options;
    e = a(f.tabTemplate.replace(/#\{href\}/g, b).replace(/#\{label\}/g, e));
    b = b.indexOf("#") ? this._tabId(a("a", e)[0]) : b.replace("#", "");
    e.addClass("ui-state-default ui-corner-top").data("destroy.tabs", !0);
    var k = a("#" + b);
    return k.length || (k = a(f.panelTemplate).attr("id", b).data("destroy.tabs", !0)), k.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide"), c >= this.lis.length ? (e.appendTo(this.list), k.appendTo(this.list[0].parentNode)) : (e.insertBefore(this.lis[c]), k.insertBefore(this.panels[c])), f.disabled = a.map(f.disabled, function(a, b) {
      return a >= c ? ++a : a;
    }), this._tabify(), 1 == this.anchors.length && (f.selected = 0, e.addClass("ui-tabs-selected ui-state-active"), k.removeClass("ui-tabs-hide"), this.element.queue("tabs", function() {
      d._trigger("show", null, d._ui(d.anchors[0], d.panels[0]));
    }), this.load(0)), this._trigger("add", null, this._ui(this.anchors[c], this.panels[c])), this;
  }, remove:function(b) {
    var e = this.options, c = this.lis.eq(b).remove(), d = this.panels.eq(b).remove();
    return c.hasClass("ui-tabs-selected") && 1 < this.anchors.length && this.select(b + (b + 1 < this.anchors.length ? 1 : -1)), e.disabled = a.map(a.grep(e.disabled, function(a, e) {
      return a != b;
    }), function(a, e) {
      return a >= b ? --a : a;
    }), this._tabify(), this._trigger("remove", null, this._ui(c.find("a")[0], d[0])), this;
  }, enable:function(b) {
    var e = this.options;
    if (-1 != a.inArray(b, e.disabled)) {
      return this.lis.eq(b).removeClass("ui-state-disabled"), e.disabled = a.grep(e.disabled, function(a, e) {
        return a != b;
      }), this._trigger("enable", null, this._ui(this.anchors[b], this.panels[b])), this;
    }
  }, disable:function(a) {
    var b = this.options;
    return a != b.selected && (this.lis.eq(a).addClass("ui-state-disabled"), b.disabled.push(a), b.disabled.sort(), this._trigger("disable", null, this._ui(this.anchors[a], this.panels[a]))), this;
  }, select:function(a) {
    return "string" == typeof a ? a = this.anchors.index(this.anchors.filter("[href$=" + a + "]")) : null === a && (a = -1), -1 == a && this.options.collapsible && (a = this.options.selected), this.anchors.eq(a).trigger(this.options.event + ".tabs"), this;
  }, load:function(b) {
    var e = this, c = this.options, d = this.anchors.eq(b)[0], l = a.data(d, "load.tabs");
    this.abort();
    if (!l || 0 !== this.element.queue("tabs").length && a.data(d, "cache.tabs")) {
      this.element.dequeue("tabs");
    } else {
      this.lis.eq(b).addClass("ui-state-processing");
      if (c.spinner) {
        var k = a("span", d);
        k.data("label.tabs", k.html()).html(c.spinner);
      }
      return this.xhr = a.ajax(a.extend({}, c.ajaxOptions, {url:l, success:function(f, g) {
        a(e._sanitizeSelector(d.hash)).html(f);
        e._cleanup();
        c.cache && a.data(d, "cache.tabs", !0);
        e._trigger("load", null, e._ui(e.anchors[b], e.panels[b]));
        try {
          c.ajaxOptions.success(f, g);
        } catch (u) {
        }
      }, error:function(a, f, g) {
        e._cleanup();
        e._trigger("load", null, e._ui(e.anchors[b], e.panels[b]));
        try {
          c.ajaxOptions.error(a, f, b, d);
        } catch (m) {
        }
      }})), e.element.dequeue("tabs"), this;
    }
  }, abort:function() {
    return this.element.queue([]), this.panels.stop(!1, !0), this.element.queue("tabs", this.element.queue("tabs").splice(-2, 2)), this.xhr && (this.xhr.abort(), delete this.xhr), this._cleanup(), this;
  }, url:function(a, e) {
    return this.anchors.eq(a).removeData("cache.tabs").data("load.tabs", e), this;
  }, length:function() {
    return this.anchors.length;
  }});
  a.extend(a.ui.tabs, {version:"1.8"});
  a.extend(a.ui.tabs.prototype, {rotation:null, rotate:function(a, e) {
    var b = this, c = this.options, d = b._rotate || (b._rotate = function(e) {
      clearTimeout(b.rotation);
      b.rotation = setTimeout(function() {
        var a = c.selected;
        b.select(++a < b.anchors.length ? a : 0);
      }, a);
      e && e.stopPropagation();
    });
    e = b._unrotate || (b._unrotate = e ? function(a) {
      t = c.selected;
      d();
    } : function(a) {
      a.clientX && b.rotate(null);
    });
    return a ? (this.element.bind("tabsshow", d), this.anchors.bind(c.event + ".tabs", e), d()) : (clearTimeout(b.rotation), this.element.unbind("tabsshow", d), this.anchors.unbind(c.event + ".tabs", e), delete this._rotate, delete this._unrotate), this;
  }});
})(jQuery);
(function(a) {
  function c() {
    this.debug = !1;
    this._curInst = null;
    this._keyEvent = !1;
    this._disabledInputs = [];
    this._inDialog = this._datepickerShowing = !1;
    this._mainDivId = "ui-datepicker-div";
    this._inlineClass = "ui-datepicker-inline";
    this._appendClass = "ui-datepicker-append";
    this._triggerClass = "ui-datepicker-trigger";
    this._dialogClass = "ui-datepicker-dialog";
    this._disableClass = "ui-datepicker-disabled";
    this._unselectableClass = "ui-datepicker-unselectable";
    this._currentClass = "ui-datepicker-current-day";
    this._dayOverClass = "ui-datepicker-days-cell-over";
    this.regional = [];
    this.regional[""] = {closeText:"Done", prevText:"Prev", nextText:"Next", currentText:"Today", monthNames:"January February March April May June July August September October November December".split(" "), monthNamesShort:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "), dayNames:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), dayNamesShort:"Sun Mon Tue Wed Thu Fri Sat".split(" "), dayNamesMin:"Su Mo Tu We Th Fr Sa".split(" "), weekHeader:"Wk", dateFormat:"mm/dd/yy", 
    firstDay:0, isRTL:!1, showMonthAfterYear:!1, yearSuffix:""};
    this._defaults = {showOn:"focus", showAnim:"show", showOptions:{}, defaultDate:null, appendText:"", buttonText:"...", buttonImage:"", buttonImageOnly:!1, hideIfNoPrevNext:!1, navigationAsDateFormat:!1, gotoCurrent:!1, changeMonth:!1, changeYear:!1, yearRange:"c-10:c+10", showOtherMonths:!1, selectOtherMonths:!1, showWeek:!1, calculateWeek:this.iso8601Week, shortYearCutoff:"+10", minDate:null, maxDate:null, duration:"_default", beforeShowDay:null, beforeShow:null, onSelect:null, onChangeMonthYear:null, 
    onClose:null, numberOfMonths:1, showCurrentAtPos:0, stepMonths:1, stepBigMonths:12, altField:"", altFormat:"", constrainInput:!0, showButtonPanel:!1, autoSize:!1};
    a.extend(this._defaults, this.regional[""]);
    this.dpDiv = a('<div id="' + this._mainDivId + '" class="ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all ui-helper-hidden-accessible"></div>');
  }
  function d(b, c) {
    a.extend(b, c);
    for (var e in c) {
      if (null == c[e] || void 0 == c[e]) {
        b[e] = c[e];
      }
    }
    return b;
  }
  a.extend(a.ui, {datepicker:{version:"1.8"}});
  var b = (new Date).getTime();
  a.extend(c.prototype, {markerClassName:"hasDatepicker", log:function() {
    this.debug && console.log.apply("", arguments);
  }, _widgetDatepicker:function() {
    return this.dpDiv;
  }, setDefaults:function(a) {
    return d(this._defaults, a || {}), this;
  }, _attachDatepicker:function(b, c) {
    var e = null;
    for (f in this._defaults) {
      var d = b.getAttribute("date:" + f);
      if (d) {
        e = e || {};
        try {
          e[f] = eval(d);
        } catch (q) {
          e[f] = d;
        }
      }
    }
    var f = b.nodeName.toLowerCase();
    d = "div" == f || "span" == f;
    b.id || (b.id = "dp" + ++this.uuid);
    var n = this._newInst(a(b), d);
    n.settings = a.extend({}, c || {}, e || {});
    "input" == f ? this._connectDatepicker(b, n) : d && this._inlineDatepicker(b, n);
  }, _newInst:function(b, c) {
    return {id:b[0].id.replace(/([^A-Za-z0-9_])/g, "\\\\$1"), input:b, selectedDay:0, selectedMonth:0, selectedYear:0, drawMonth:0, drawYear:0, inline:c, dpDiv:c ? a('<div class="' + this._inlineClass + ' ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>') : this.dpDiv};
  }, _connectDatepicker:function(b, c) {
    var e = a(b);
    c.append = a([]);
    c.trigger = a([]);
    e.hasClass(this.markerClassName) || (this._attachments(e, c), e.addClass(this.markerClassName).keydown(this._doKeyDown).keypress(this._doKeyPress).keyup(this._doKeyUp).bind("setData.datepicker", function(a, b, e) {
      c.settings[b] = e;
    }).bind("getData.datepicker", function(a, b) {
      return this._get(c, b);
    }), this._autoSize(c), a.data(b, "datepicker", c));
  }, _attachments:function(b, c) {
    var e = this._get(c, "appendText"), d = this._get(c, "isRTL");
    c.append && c.append.remove();
    e && (c.append = a('<span class="' + this._appendClass + '">' + e + "</span>"), b[d ? "before" : "after"](c.append));
    b.unbind("focus", this._showDatepicker);
    c.trigger && c.trigger.remove();
    e = this._get(c, "showOn");
    "focus" != e && "both" != e || b.focus(this._showDatepicker);
    if ("button" == e || "both" == e) {
      e = this._get(c, "buttonText");
      var f = this._get(c, "buttonImage");
      c.trigger = a(this._get(c, "buttonImageOnly") ? a("<img/>").addClass(this._triggerClass).attr({src:f, alt:e, title:e}) : a('<button type="button"></button>').addClass(this._triggerClass).html("" == f ? e : a("<img/>").attr({src:f, alt:e, title:e})));
      b[d ? "before" : "after"](c.trigger);
      c.trigger.click(function() {
        return a.datepicker._datepickerShowing && a.datepicker._lastInput == b[0] ? a.datepicker._hideDatepicker() : a.datepicker._showDatepicker(b[0]), !1;
      });
    }
  }, _autoSize:function(a) {
    if (this._get(a, "autoSize") && !a.inline) {
      var b = new Date(2009, 11, 20), e = this._get(a, "dateFormat");
      if (e.match(/[DM]/)) {
        var c = function(a) {
          for (var b = 0, e = 0, c = 0; c < a.length; c++) {
            a[c].length > b && (b = a[c].length, e = c);
          }
          return e;
        };
        b.setMonth(c(this._get(a, e.match(/MM/) ? "monthNames" : "monthNamesShort")));
        b.setDate(c(this._get(a, e.match(/DD/) ? "dayNames" : "dayNamesShort")) + 20 - b.getDay());
      }
      a.input.attr("size", this._formatDate(a, b).length);
    }
  }, _inlineDatepicker:function(b, c) {
    var e = a(b);
    e.hasClass(this.markerClassName) || (e.addClass(this.markerClassName).append(c.dpDiv).bind("setData.datepicker", function(a, b, e) {
      c.settings[b] = e;
    }).bind("getData.datepicker", function(a, b) {
      return this._get(c, b);
    }), a.data(b, "datepicker", c), this._setDate(c, this._getDefaultDate(c), !0), this._updateDatepicker(c), this._updateAlternate(c));
  }, _dialogDatepicker:function(b, c, g, l, k) {
    b = this._dialogInst;
    b || (b = "dp" + ++this.uuid, this._dialogInput = a('<input type="text" id="' + b + '" style="position: absolute; top: -100px; width: 0px; z-index: -10;"/>'), this._dialogInput.keydown(this._doKeyDown), a("body").append(this._dialogInput), b = this._dialogInst = this._newInst(this._dialogInput, !1), b.settings = {}, a.data(this._dialogInput[0], "datepicker", b));
    d(b.settings, l || {});
    c = c && c.constructor == Date ? this._formatDate(b, c) : c;
    this._dialogInput.val(c);
    this._pos = k ? k.length ? k : [k.pageX, k.pageY] : null;
    this._pos || (this._pos = [document.documentElement.clientWidth / 2 - 100 + (document.documentElement.scrollLeft || document.body.scrollLeft), document.documentElement.clientHeight / 2 - 150 + (document.documentElement.scrollTop || document.body.scrollTop)]);
    return this._dialogInput.css("left", this._pos[0] + 20 + "px").css("top", this._pos[1] + "px"), b.settings.onSelect = g, this._inDialog = !0, this.dpDiv.addClass(this._dialogClass), this._showDatepicker(this._dialogInput[0]), a.blockUI && a.blockUI(this.dpDiv), a.data(this._dialogInput[0], "datepicker", b), this;
  }, _destroyDatepicker:function(b) {
    var e = a(b), c = a.data(b, "datepicker");
    if (e.hasClass(this.markerClassName)) {
      var d = b.nodeName.toLowerCase();
      a.removeData(b, "datepicker");
      "input" == d ? (c.append.remove(), c.trigger.remove(), e.removeClass(this.markerClassName).unbind("focus", this._showDatepicker).unbind("keydown", this._doKeyDown).unbind("keypress", this._doKeyPress).unbind("keyup", this._doKeyUp)) : ("div" == d || "span" == d) && e.removeClass(this.markerClassName).empty();
    }
  }, _enableDatepicker:function(b) {
    var e = a(b), c = a.data(b, "datepicker");
    if (e.hasClass(this.markerClassName)) {
      var d = b.nodeName.toLowerCase();
      "input" == d ? (b.disabled = !1, c.trigger.filter("button").each(function() {
        this.disabled = !1;
      }).end().filter("img").css({opacity:"1.0", cursor:""})) : "div" != d && "span" != d || e.children("." + this._inlineClass).children().removeClass("ui-state-disabled");
      this._disabledInputs = a.map(this._disabledInputs, function(a) {
        return a == b ? null : a;
      });
    }
  }, _disableDatepicker:function(b) {
    var e = a(b), c = a.data(b, "datepicker");
    if (e.hasClass(this.markerClassName)) {
      var d = b.nodeName.toLowerCase();
      "input" == d ? (b.disabled = !0, c.trigger.filter("button").each(function() {
        this.disabled = !0;
      }).end().filter("img").css({opacity:"0.5", cursor:"default"})) : "div" != d && "span" != d || e.children("." + this._inlineClass).children().addClass("ui-state-disabled");
      this._disabledInputs = a.map(this._disabledInputs, function(a) {
        return a == b ? null : a;
      });
      this._disabledInputs[this._disabledInputs.length] = b;
    }
  }, _isDisabledDatepicker:function(a) {
    if (!a) {
      return !1;
    }
    for (var b = 0; b < this._disabledInputs.length; b++) {
      if (this._disabledInputs[b] == a) {
        return !0;
      }
    }
    return !1;
  }, _getInst:function(b) {
    try {
      return a.data(b, "datepicker");
    } catch (f) {
      throw "Missing instance data for this datepicker";
    }
  }, _optionDatepicker:function(b, c, g) {
    var e = this._getInst(b);
    if (2 == arguments.length && "string" == typeof c) {
      return "defaults" == c ? a.extend({}, a.datepicker._defaults) : e ? "all" == c ? a.extend({}, e.settings) : this._get(e, c) : null;
    }
    var f = c || {};
    "string" == typeof c && (f = {}, f[c] = g);
    if (e) {
      this._curInst == e && this._hideDatepicker();
      var n = this._getDateDatepicker(b, !0);
      d(e.settings, f);
      this._attachments(a(b), e);
      this._autoSize(e);
      this._setDateDatepicker(b, n);
      this._updateDatepicker(e);
    }
  }, _changeDatepicker:function(a, b, c) {
    this._optionDatepicker(a, b, c);
  }, _refreshDatepicker:function(a) {
    (a = this._getInst(a)) && this._updateDatepicker(a);
  }, _setDateDatepicker:function(a, b) {
    (a = this._getInst(a)) && (this._setDate(a, b), this._updateDatepicker(a), this._updateAlternate(a));
  }, _getDateDatepicker:function(a, b) {
    a = this._getInst(a);
    return a && !a.inline && this._setDateFromField(a, b), a ? this._getDate(a) : null;
  }, _doKeyDown:function(b) {
    var e = a.datepicker._getInst(b.target), c = !0, d = e.dpDiv.is(".ui-datepicker-rtl");
    e._keyEvent = !0;
    if (a.datepicker._datepickerShowing) {
      switch(b.keyCode) {
        case 9:
          a.datepicker._hideDatepicker();
          c = !1;
          break;
        case 13:
          return c = a("td." + a.datepicker._dayOverClass, e.dpDiv).add(a("td." + a.datepicker._currentClass, e.dpDiv)), c[0] ? a.datepicker._selectDay(b.target, e.selectedMonth, e.selectedYear, c[0]) : a.datepicker._hideDatepicker(), !1;
        case 27:
          a.datepicker._hideDatepicker();
          break;
        case 33:
          a.datepicker._adjustDate(b.target, b.ctrlKey ? -a.datepicker._get(e, "stepBigMonths") : -a.datepicker._get(e, "stepMonths"), "M");
          break;
        case 34:
          a.datepicker._adjustDate(b.target, b.ctrlKey ? +a.datepicker._get(e, "stepBigMonths") : +a.datepicker._get(e, "stepMonths"), "M");
          break;
        case 35:
          (b.ctrlKey || b.metaKey) && a.datepicker._clearDate(b.target);
          c = b.ctrlKey || b.metaKey;
          break;
        case 36:
          (b.ctrlKey || b.metaKey) && a.datepicker._gotoToday(b.target);
          c = b.ctrlKey || b.metaKey;
          break;
        case 37:
          (b.ctrlKey || b.metaKey) && a.datepicker._adjustDate(b.target, d ? 1 : -1, "D");
          c = b.ctrlKey || b.metaKey;
          b.originalEvent.altKey && a.datepicker._adjustDate(b.target, b.ctrlKey ? -a.datepicker._get(e, "stepBigMonths") : -a.datepicker._get(e, "stepMonths"), "M");
          break;
        case 38:
          (b.ctrlKey || b.metaKey) && a.datepicker._adjustDate(b.target, -7, "D");
          c = b.ctrlKey || b.metaKey;
          break;
        case 39:
          (b.ctrlKey || b.metaKey) && a.datepicker._adjustDate(b.target, d ? -1 : 1, "D");
          c = b.ctrlKey || b.metaKey;
          b.originalEvent.altKey && a.datepicker._adjustDate(b.target, b.ctrlKey ? +a.datepicker._get(e, "stepBigMonths") : +a.datepicker._get(e, "stepMonths"), "M");
          break;
        case 40:
          (b.ctrlKey || b.metaKey) && a.datepicker._adjustDate(b.target, 7, "D");
          c = b.ctrlKey || b.metaKey;
          break;
        default:
          c = !1;
      }
    } else {
      36 == b.keyCode && b.ctrlKey ? a.datepicker._showDatepicker(this) : c = !1;
    }
    c && (b.preventDefault(), b.stopPropagation());
  }, _doKeyPress:function(b) {
    var e = a.datepicker._getInst(b.target);
    if (a.datepicker._get(e, "constrainInput")) {
      e = a.datepicker._possibleChars(a.datepicker._get(e, "dateFormat"));
      var c = String.fromCharCode(void 0 == b.charCode ? b.keyCode : b.charCode);
      return b.ctrlKey || " " > c || !e || -1 < e.indexOf(c);
    }
  }, _doKeyUp:function(b) {
    b = a.datepicker._getInst(b.target);
    if (b.input.val() != b.lastVal) {
      try {
        a.datepicker.parseDate(a.datepicker._get(b, "dateFormat"), b.input ? b.input.val() : null, a.datepicker._getFormatConfig(b)) && (a.datepicker._setDateFromField(b), a.datepicker._updateAlternate(b), a.datepicker._updateDatepicker(b));
      } catch (f) {
        a.datepicker.log(f);
      }
    }
    return !0;
  }, _showDatepicker:function(b) {
    b = b.target || b;
    "input" != b.nodeName.toLowerCase() && (b = a("input", b.parentNode)[0]);
    if (!a.datepicker._isDisabledDatepicker(b) && a.datepicker._lastInput != b) {
      var c = a.datepicker._getInst(b);
      a.datepicker._curInst && a.datepicker._curInst != c && a.datepicker._curInst.dpDiv.stop(!0, !0);
      var e = a.datepicker._get(c, "beforeShow");
      d(c.settings, e ? e.apply(b, [b, c]) : {});
      c.lastVal = null;
      a.datepicker._lastInput = b;
      a.datepicker._setDateFromField(c);
      a.datepicker._inDialog && (b.value = "");
      a.datepicker._pos || (a.datepicker._pos = a.datepicker._findPos(b), a.datepicker._pos[1] += b.offsetHeight);
      var l = !1;
      a(b).parents().each(function() {
        return l |= "fixed" == a(this).css("position"), !l;
      });
      l && a.browser.opera && (a.datepicker._pos[0] -= document.documentElement.scrollLeft, a.datepicker._pos[1] -= document.documentElement.scrollTop);
      e = {left:a.datepicker._pos[0], top:a.datepicker._pos[1]};
      a.datepicker._pos = null;
      c.dpDiv.css({position:"absolute", display:"block", top:"-1000px"});
      a.datepicker._updateDatepicker(c);
      e = a.datepicker._checkOffset(c, e, l);
      c.dpDiv.css({position:a.datepicker._inDialog && a.blockUI ? "static" : l ? "fixed" : "absolute", display:"none", left:e.left + "px", top:e.top + "px"});
      if (!c.inline) {
        e = a.datepicker._get(c, "showAnim");
        var k = a.datepicker._get(c, "duration"), n = function() {
          a.datepicker._datepickerShowing = !0;
          var b = a.datepicker._getBorders(c.dpDiv);
          c.dpDiv.find("iframe.ui-datepicker-cover").css({left:-b[0], top:-b[1], width:c.dpDiv.outerWidth(), height:c.dpDiv.outerHeight()});
        };
        c.dpDiv.zIndex(a(b).zIndex() + 1);
        a.effects && a.effects[e] ? c.dpDiv.show(e, a.datepicker._get(c, "showOptions"), k, n) : c.dpDiv[e || "show"](e ? k : null, n);
        e && k || n();
        c.input.is(":visible") && !c.input.is(":disabled") && c.input.focus();
        a.datepicker._curInst = c;
      }
    }
  }, _updateDatepicker:function(b) {
    var c = this, e = a.datepicker._getBorders(b.dpDiv);
    b.dpDiv.empty().append(this._generateHTML(b)).find("iframe.ui-datepicker-cover").css({left:-e[0], top:-e[1], width:b.dpDiv.outerWidth(), height:b.dpDiv.outerHeight()}).end().find("button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a").bind("mouseout", function() {
      a(this).removeClass("ui-state-hover");
      -1 != this.className.indexOf("ui-datepicker-prev") && a(this).removeClass("ui-datepicker-prev-hover");
      -1 != this.className.indexOf("ui-datepicker-next") && a(this).removeClass("ui-datepicker-next-hover");
    }).bind("mouseover", function() {
      c._isDisabledDatepicker(b.inline ? b.dpDiv.parent()[0] : b.input[0]) || (a(this).parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover"), a(this).addClass("ui-state-hover"), -1 != this.className.indexOf("ui-datepicker-prev") && a(this).addClass("ui-datepicker-prev-hover"), -1 != this.className.indexOf("ui-datepicker-next") && a(this).addClass("ui-datepicker-next-hover"));
    }).end().find("." + this._dayOverClass + " a").trigger("mouseover").end();
    e = this._getNumberOfMonths(b);
    var d = e[1];
    1 < d ? b.dpDiv.addClass("ui-datepicker-multi-" + d).css("width", 17 * d + "em") : b.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width("");
    b.dpDiv[(1 != e[0] || 1 != e[1] ? "add" : "remove") + "Class"]("ui-datepicker-multi");
    b.dpDiv[(this._get(b, "isRTL") ? "add" : "remove") + "Class"]("ui-datepicker-rtl");
    b == a.datepicker._curInst && a.datepicker._datepickerShowing && b.input && b.input.is(":visible") && !b.input.is(":disabled") && b.input.focus();
  }, _getBorders:function(a) {
    var b = function(a) {
      return {thin:1, medium:2, thick:3}[a] || a;
    };
    return [parseFloat(b(a.css("border-left-width"))), parseFloat(b(a.css("border-top-width")))];
  }, _checkOffset:function(b, c, d) {
    var e = b.dpDiv.outerWidth(), f = b.dpDiv.outerHeight(), g = b.input ? b.input.outerWidth() : 0, q = b.input ? b.input.outerHeight() : 0, u = document.documentElement.clientWidth + a(document).scrollLeft(), m = document.documentElement.clientHeight + a(document).scrollTop();
    return c.left -= this._get(b, "isRTL") ? e - g : 0, c.left -= d && c.left == b.input.offset().left ? a(document).scrollLeft() : 0, c.top -= d && c.top == b.input.offset().top + q ? a(document).scrollTop() : 0, c.left -= Math.min(c.left, c.left + e > u && u > e ? Math.abs(c.left + e - u) : 0), c.top -= Math.min(c.top, c.top + f > m && m > f ? Math.abs(f + q) : 0), c;
  }, _findPos:function(b) {
    var c = this._getInst(b);
    for (c = this._get(c, "isRTL"); b && ("hidden" == b.type || 1 != b.nodeType);) {
      b = b[c ? "previousSibling" : "nextSibling"];
    }
    b = a(b).offset();
    return [b.left, b.top];
  }, _hideDatepicker:function(b) {
    var c = this._curInst;
    if (c && (!b || c == a.data(b, "datepicker")) && this._datepickerShowing) {
      b = this._get(c, "showAnim");
      var e = this._get(c, "duration"), d = function() {
        a.datepicker._tidyDialog(c);
        this._curInst = null;
      };
      a.effects && a.effects[b] ? c.dpDiv.hide(b, a.datepicker._get(c, "showOptions"), e, d) : c.dpDiv["slideDown" == b ? "slideUp" : "fadeIn" == b ? "fadeOut" : "hide"](b ? e : null, d);
      b || d();
      (b = this._get(c, "onClose")) && b.apply(c.input ? c.input[0] : null, [c.input ? c.input.val() : "", c]);
      this._datepickerShowing = !1;
      this._lastInput = null;
      this._inDialog && (this._dialogInput.css({position:"absolute", left:"0", top:"-100px"}), a.blockUI && (a.unblockUI(), a("body").append(this.dpDiv)));
      this._inDialog = !1;
    }
  }, _tidyDialog:function(a) {
    a.dpDiv.removeClass(this._dialogClass).unbind(".ui-datepicker-calendar");
  }, _checkExternalClick:function(b) {
    a.datepicker._curInst && (b = a(b.target), b[0].id == a.datepicker._mainDivId || 0 != b.parents("#" + a.datepicker._mainDivId).length || b.hasClass(a.datepicker.markerClassName) || b.hasClass(a.datepicker._triggerClass) || !a.datepicker._datepickerShowing || a.datepicker._inDialog && a.blockUI || a.datepicker._hideDatepicker());
  }, _adjustDate:function(b, c, d) {
    b = a(b);
    var e = this._getInst(b[0]);
    this._isDisabledDatepicker(b[0]) || (this._adjustInstDate(e, c + ("M" == d ? this._get(e, "showCurrentAtPos") : 0), d), this._updateDatepicker(e));
  }, _gotoToday:function(b) {
    b = a(b);
    var c = this._getInst(b[0]);
    if (this._get(c, "gotoCurrent") && c.currentDay) {
      c.selectedDay = c.currentDay, c.drawMonth = c.selectedMonth = c.currentMonth, c.drawYear = c.selectedYear = c.currentYear;
    } else {
      var e = new Date;
      c.selectedDay = e.getDate();
      c.drawMonth = c.selectedMonth = e.getMonth();
      c.drawYear = c.selectedYear = e.getFullYear();
    }
    this._notifyChange(c);
    this._adjustDate(b);
  }, _selectMonthYear:function(b, c, d) {
    b = a(b);
    var e = this._getInst(b[0]);
    e._selectingMonthYear = !1;
    e["selected" + ("M" == d ? "Month" : "Year")] = e["draw" + ("M" == d ? "Month" : "Year")] = parseInt(c.options[c.selectedIndex].value, 10);
    this._notifyChange(e);
    this._adjustDate(b);
  }, _clickMonthYear:function(b) {
    b = a(b);
    b = this._getInst(b[0]);
    b.input && b._selectingMonthYear && !a.browser.msie && b.input.focus();
    b._selectingMonthYear = !b._selectingMonthYear;
  }, _selectDay:function(b, c, d, l) {
    var e = a(b);
    a(l).hasClass(this._unselectableClass) || this._isDisabledDatepicker(e[0]) || (e = this._getInst(e[0]), e.selectedDay = e.currentDay = a("a", l).html(), e.selectedMonth = e.currentMonth = c, e.selectedYear = e.currentYear = d, this._selectDate(b, this._formatDate(e, e.currentDay, e.currentMonth, e.currentYear)));
  }, _clearDate:function(b) {
    b = a(b);
    this._getInst(b[0]);
    this._selectDate(b, "");
  }, _selectDate:function(b, c) {
    b = a(b);
    b = this._getInst(b[0]);
    c = null != c ? c : this._formatDate(b);
    b.input && b.input.val(c);
    this._updateAlternate(b);
    var e = this._get(b, "onSelect");
    e ? e.apply(b.input ? b.input[0] : null, [c, b]) : b.input && b.input.trigger("change");
    b.inline ? this._updateDatepicker(b) : (this._hideDatepicker(), this._lastInput = b.input[0], "object" != typeof b.input[0] && b.input.focus(), this._lastInput = null);
  }, _updateAlternate:function(b) {
    var c = this._get(b, "altField");
    if (c) {
      var e = this._get(b, "altFormat") || this._get(b, "dateFormat"), d = this._getDate(b), k = this.formatDate(e, d, this._getFormatConfig(b));
      a(c).each(function() {
        a(this).val(k);
      });
    }
  }, noWeekends:function(a) {
    a = a.getDay();
    return [0 < a && 6 > a, ""];
  }, iso8601Week:function(a) {
    a = new Date(a.getTime());
    a.setDate(a.getDate() + 4 - (a.getDay() || 7));
    var b = a.getTime();
    return a.setMonth(0), a.setDate(1), Math.floor(Math.round((b - a) / 864E5) / 7) + 1;
  }, parseDate:function(a, b, c) {
    if (null == a || null == b) {
      throw "Invalid arguments";
    }
    b = "object" == typeof b ? b.toString() : b + "";
    if ("" == b) {
      return null;
    }
    for (var e = (c ? c.shortYearCutoff : null) || this._defaults.shortYearCutoff, d = (c ? c.dayNamesShort : null) || this._defaults.dayNamesShort, f = (c ? c.dayNames : null) || this._defaults.dayNames, g = (c ? c.monthNamesShort : null) || this._defaults.monthNamesShort, u = (c ? c.monthNames : null) || this._defaults.monthNames, m = c = -1, p = -1, v = -1, w = !1, A = function(b) {
      b = O + 1 < a.length && a.charAt(O + 1) == b;
      return b && O++, b;
    }, D = function(a) {
      A(a);
      a = new RegExp("^\\d{1," + ("@" == a ? 14 : "!" == a ? 20 : "y" == a ? 4 : "o" == a ? 3 : 2) + "}");
      a = b.substring(C).match(a);
      if (!a) {
        throw "Missing number at position " + C;
      }
      return C += a[0].length, parseInt(a[0], 10);
    }, x = function(a, c, e) {
      a = A(a) ? e : c;
      for (c = 0; c < a.length; c++) {
        if (b.substr(C, a[c].length) == a[c]) {
          return C += a[c].length, c + 1;
        }
      }
      throw "Unknown name at position " + C;
    }, F = function() {
      if (b.charAt(C) != a.charAt(O)) {
        throw "Unexpected literal at position " + C;
      }
      C++;
    }, C = 0, O = 0; O < a.length; O++) {
      if (w) {
        "'" != a.charAt(O) || A("'") ? F() : w = !1;
      } else {
        switch(a.charAt(O)) {
          case "d":
            p = D("d");
            break;
          case "D":
            x("D", d, f);
            break;
          case "o":
            v = D("o");
            break;
          case "m":
            m = D("m");
            break;
          case "M":
            m = x("M", g, u);
            break;
          case "y":
            c = D("y");
            break;
          case "@":
            var M = new Date(D("@"));
            c = M.getFullYear();
            m = M.getMonth() + 1;
            p = M.getDate();
            break;
          case "!":
            M = new Date((D("!") - this._ticksTo1970) / 1E4);
            c = M.getFullYear();
            m = M.getMonth() + 1;
            p = M.getDate();
            break;
          case "'":
            A("'") ? F() : w = !0;
            break;
          default:
            F();
        }
      }
    }
    -1 == c ? c = (new Date).getFullYear() : 100 > c && (c += (new Date).getFullYear() - (new Date).getFullYear() % 100 + (c <= e ? 0 : -100));
    if (-1 < v) {
      m = 1;
      p = v;
      do {
        e = this._getDaysInMonth(c, m - 1);
        if (p <= e) {
          break;
        }
        m++;
        p -= e;
      } while (1);
    }
    M = this._daylightSavingAdjust(new Date(c, m - 1, p));
    if (M.getFullYear() != c || M.getMonth() + 1 != m || M.getDate() != p) {
      throw "Invalid date";
    }
    return M;
  }, ATOM:"yy-mm-dd", COOKIE:"D, dd M yy", ISO_8601:"yy-mm-dd", RFC_822:"D, d M y", RFC_850:"DD, dd-M-y", RFC_1036:"D, d M y", RFC_1123:"D, d M yy", RFC_2822:"D, d M yy", RSS:"D, d M y", TICKS:"!", TIMESTAMP:"@", W3C:"yy-mm-dd", _ticksTo1970:62135596800 * 1E7, formatDate:function(a, b, c) {
    if (!b) {
      return "";
    }
    var e = (c ? c.dayNamesShort : null) || this._defaults.dayNamesShort, d = (c ? c.dayNames : null) || this._defaults.dayNames, f = (c ? c.monthNamesShort : null) || this._defaults.monthNamesShort;
    c = (c ? c.monthNames : null) || this._defaults.monthNames;
    var g = function(b) {
      b = w + 1 < a.length && a.charAt(w + 1) == b;
      return b && w++, b;
    }, u = function(a, b, c) {
      b = "" + b;
      if (g(a)) {
        for (; b.length < c;) {
          b = "0" + b;
        }
      }
      return b;
    }, m = function(a, b, c, e) {
      return g(a) ? e[b] : c[b];
    }, p = "", v = !1;
    if (b) {
      for (var w = 0; w < a.length; w++) {
        if (v) {
          "'" != a.charAt(w) || g("'") ? p += a.charAt(w) : v = !1;
        } else {
          switch(a.charAt(w)) {
            case "d":
              p += u("d", b.getDate(), 2);
              break;
            case "D":
              p += m("D", b.getDay(), e, d);
              break;
            case "o":
              p += u("o", (b.getTime() - (new Date(b.getFullYear(), 0, 0)).getTime()) / 864E5, 3);
              break;
            case "m":
              p += u("m", b.getMonth() + 1, 2);
              break;
            case "M":
              p += m("M", b.getMonth(), f, c);
              break;
            case "y":
              p += g("y") ? b.getFullYear() : (10 > b.getYear() % 100 ? "0" : "") + b.getYear() % 100;
              break;
            case "@":
              p += b.getTime();
              break;
            case "!":
              p += 1E4 * b.getTime() + this._ticksTo1970;
              break;
            case "'":
              g("'") ? p += "'" : v = !0;
              break;
            default:
              p += a.charAt(w);
          }
        }
      }
    }
    return p;
  }, _possibleChars:function(a) {
    for (var b = "", c = !1, e = function(b) {
      b = d + 1 < a.length && a.charAt(d + 1) == b;
      return b && d++, b;
    }, d = 0; d < a.length; d++) {
      if (c) {
        "'" != a.charAt(d) || e("'") ? b += a.charAt(d) : c = !1;
      } else {
        switch(a.charAt(d)) {
          case "d":
          case "m":
          case "y":
          case "@":
            b += "0123456789";
            break;
          case "D":
          case "M":
            return null;
          case "'":
            e("'") ? b += "'" : c = !0;
            break;
          default:
            b += a.charAt(d);
        }
      }
    }
    return b;
  }, _get:function(a, b) {
    return void 0 !== a.settings[b] ? a.settings[b] : this._defaults[b];
  }, _setDateFromField:function(a, b) {
    if (a.input.val() != a.lastVal) {
      var c = this._get(a, "dateFormat"), e = a.lastVal = a.input ? a.input.val() : null, d;
      var f = d = this._getDefaultDate(a);
      var q = this._getFormatConfig(a);
      try {
        f = this.parseDate(c, e, q) || d;
      } catch (u) {
        this.log(u), e = b ? "" : e;
      }
      a.selectedDay = f.getDate();
      a.drawMonth = a.selectedMonth = f.getMonth();
      a.drawYear = a.selectedYear = f.getFullYear();
      a.currentDay = e ? f.getDate() : 0;
      a.currentMonth = e ? f.getMonth() : 0;
      a.currentYear = e ? f.getFullYear() : 0;
      this._adjustInstDate(a);
    }
  }, _getDefaultDate:function(a) {
    return this._restrictMinMax(a, this._determineDate(a, this._get(a, "defaultDate"), new Date));
  }, _determineDate:function(b, c, d) {
    var e = function(a) {
      var b = new Date;
      return b.setDate(b.getDate() + a), b;
    }, f = function(c) {
      try {
        return a.datepicker.parseDate(a.datepicker._get(b, "dateFormat"), c, a.datepicker._getFormatConfig(b));
      } catch (w) {
      }
      var e = (c.toLowerCase().match(/^c/) ? a.datepicker._getDate(b) : null) || new Date, d = e.getFullYear(), f = e.getMonth();
      e = e.getDate();
      for (var g = /([+-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g, k = g.exec(c); k;) {
        switch(k[2] || "d") {
          case "d":
          case "D":
            e += parseInt(k[1], 10);
            break;
          case "w":
          case "W":
            e += 7 * parseInt(k[1], 10);
            break;
          case "m":
          case "M":
            f += parseInt(k[1], 10);
            e = Math.min(e, a.datepicker._getDaysInMonth(d, f));
            break;
          case "y":
          case "Y":
            d += parseInt(k[1], 10), e = Math.min(e, a.datepicker._getDaysInMonth(d, f));
        }
        k = g.exec(c);
      }
      return new Date(d, f, e);
    };
    return c = null == c ? d : "string" == typeof c ? f(c) : "number" == typeof c ? isNaN(c) ? d : e(c) : c, c = c && "Invalid Date" == c.toString() ? d : c, c && (c.setHours(0), c.setMinutes(0), c.setSeconds(0), c.setMilliseconds(0)), this._daylightSavingAdjust(c);
  }, _daylightSavingAdjust:function(a) {
    return a ? (a.setHours(12 < a.getHours() ? a.getHours() + 2 : 0), a) : null;
  }, _setDate:function(a, b, c) {
    var e = !b, d = a.selectedMonth, f = a.selectedYear;
    b = this._restrictMinMax(a, this._determineDate(a, b, new Date));
    a.selectedDay = a.currentDay = b.getDate();
    a.drawMonth = a.selectedMonth = a.currentMonth = b.getMonth();
    a.drawYear = a.selectedYear = a.currentYear = b.getFullYear();
    d == a.selectedMonth && f == a.selectedYear || c || this._notifyChange(a);
    this._adjustInstDate(a);
    a.input && a.input.val(e ? "" : this._formatDate(a));
  }, _getDate:function(a) {
    return !a.currentYear || a.input && "" == a.input.val() ? null : this._daylightSavingAdjust(new Date(a.currentYear, a.currentMonth, a.currentDay));
  }, _generateHTML:function(c) {
    var e = new Date;
    e = this._daylightSavingAdjust(new Date(e.getFullYear(), e.getMonth(), e.getDate()));
    var d = this._get(c, "isRTL"), l = this._get(c, "showButtonPanel"), k = this._get(c, "hideIfNoPrevNext"), n = this._get(c, "navigationAsDateFormat"), q = this._getNumberOfMonths(c), u = this._get(c, "showCurrentAtPos"), m = this._get(c, "stepMonths"), p = 1 != q[0] || 1 != q[1], v = this._daylightSavingAdjust(c.currentDay ? new Date(c.currentYear, c.currentMonth, c.currentDay) : new Date(9999, 9, 9)), w = this._getMinMaxDate(c, "min"), A = this._getMinMaxDate(c, "max");
    u = c.drawMonth - u;
    var D = c.drawYear;
    0 > u && (u += 12, D--);
    if (A) {
      var x = this._daylightSavingAdjust(new Date(A.getFullYear(), A.getMonth() - q[0] * q[1] + 1, A.getDate()));
      for (x = w && x < w ? w : x; this._daylightSavingAdjust(new Date(D, u, 1)) > x;) {
        u--, 0 > u && (u = 11, D--);
      }
    }
    c.drawMonth = u;
    c.drawYear = D;
    x = this._get(c, "prevText");
    x = n ? this.formatDate(x, this._daylightSavingAdjust(new Date(D, u - m, 1)), this._getFormatConfig(c)) : x;
    x = this._canAdjustMonth(c, -1, D, u) ? '<a class="ui-datepicker-prev ui-corner-all" onclick="DP_jQuery_' + b + ".datepicker._adjustDate('#" + c.id + "', -" + m + ", 'M');\" title=\"" + x + '"><span class="ui-icon ui-icon-circle-triangle-' + (d ? "e" : "w") + '">' + x + "</span></a>" : k ? "" : '<a class="ui-datepicker-prev ui-corner-all ui-state-disabled" title="' + x + '"><span class="ui-icon ui-icon-circle-triangle-' + (d ? "e" : "w") + '">' + x + "</span></a>";
    var F = this._get(c, "nextText");
    F = n ? this.formatDate(F, this._daylightSavingAdjust(new Date(D, u + m, 1)), this._getFormatConfig(c)) : F;
    k = this._canAdjustMonth(c, 1, D, u) ? '<a class="ui-datepicker-next ui-corner-all" onclick="DP_jQuery_' + b + ".datepicker._adjustDate('#" + c.id + "', +" + m + ", 'M');\" title=\"" + F + '"><span class="ui-icon ui-icon-circle-triangle-' + (d ? "w" : "e") + '">' + F + "</span></a>" : k ? "" : '<a class="ui-datepicker-next ui-corner-all ui-state-disabled" title="' + F + '"><span class="ui-icon ui-icon-circle-triangle-' + (d ? "w" : "e") + '">' + F + "</span></a>";
    m = this._get(c, "currentText");
    F = this._get(c, "gotoCurrent") && c.currentDay ? v : e;
    m = n ? this.formatDate(m, F, this._getFormatConfig(c)) : m;
    n = c.inline ? "" : '<button type="button" class="ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all" onclick="DP_jQuery_' + b + '.datepicker._hideDatepicker();">' + this._get(c, "closeText") + "</button>";
    l = l ? '<div class="ui-datepicker-buttonpane ui-widget-content">' + (d ? n : "") + (this._isInRange(c, F) ? '<button type="button" class="ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all" onclick="DP_jQuery_' + b + ".datepicker._gotoToday('#" + c.id + "');\">" + m + "</button>" : "") + (d ? "" : n) + "</div>" : "";
    n = parseInt(this._get(c, "firstDay"), 10);
    n = isNaN(n) ? 0 : n;
    m = this._get(c, "showWeek");
    F = this._get(c, "dayNames");
    this._get(c, "dayNamesShort");
    var C = this._get(c, "dayNamesMin"), O = this._get(c, "monthNames"), M = this._get(c, "monthNamesShort"), ra = this._get(c, "beforeShowDay"), Q = this._get(c, "showOtherMonths"), za = this._get(c, "selectOtherMonths");
    this._get(c, "calculateWeek");
    for (var xa = this._getDefaultDate(c), z = "", ma = 0; ma < q[0]; ma++) {
      for (var Ba = "", h = 0; h < q[1]; h++) {
        var va = this._daylightSavingAdjust(new Date(D, u, c.selectedDay)), N = " ui-corner-all", T = "";
        if (p) {
          T += '<div class="ui-datepicker-group';
          if (1 < q[1]) {
            switch(h) {
              case 0:
                T += " ui-datepicker-group-first";
                N = " ui-corner-" + (d ? "right" : "left");
                break;
              case q[1] - 1:
                T += " ui-datepicker-group-last";
                N = " ui-corner-" + (d ? "left" : "right");
                break;
              default:
                T += " ui-datepicker-group-middle", N = "";
            }
          }
          T += '">';
        }
        T += '<div class="ui-datepicker-header ui-widget-header ui-helper-clearfix' + N + '">' + (/all|left/.test(N) && 0 == ma ? d ? k : x : "") + (/all|right/.test(N) && 0 == ma ? d ? x : k : "") + this._generateMonthYearHeader(c, u, D, w, A, 0 < ma || 0 < h, O, M) + '</div><table class="ui-datepicker-calendar"><thead><tr>';
        var fa = m ? '<th class="ui-datepicker-week-col">' + this._get(c, "weekHeader") + "</th>" : "";
        for (N = 0; 7 > N; N++) {
          var K = (N + n) % 7;
          fa += "<th" + (5 <= (N + n + 6) % 7 ? ' class="ui-datepicker-week-end"' : "") + '><span title="' + F[K] + '">' + C[K] + "</span></th>";
        }
        T += fa + "</tr></thead><tbody>";
        fa = this._getDaysInMonth(D, u);
        D == c.selectedYear && u == c.selectedMonth && (c.selectedDay = Math.min(c.selectedDay, fa));
        N = (this._getFirstDayOfMonth(D, u) - n + 7) % 7;
        fa = p ? 6 : Math.ceil((N + fa) / 7);
        K = this._daylightSavingAdjust(new Date(D, u, 1 - N));
        for (var ha = 0; ha < fa; ha++) {
          T += "<tr>";
          var Ca = m ? '<td class="ui-datepicker-week-col">' + this._get(c, "calculateWeek")(K) + "</td>" : "";
          for (N = 0; 7 > N; N++) {
            var oa = ra ? ra.apply(c.input ? c.input[0] : null, [K]) : [!0, ""], ja = K.getMonth() != u, sa = ja && !za || !oa[0] || w && K < w || A && K > A;
            Ca += '<td class="' + (5 <= (N + n + 6) % 7 ? " ui-datepicker-week-end" : "") + (ja ? " ui-datepicker-other-month" : "") + (K.getTime() == va.getTime() && u == c.selectedMonth && c._keyEvent || xa.getTime() == K.getTime() && xa.getTime() == va.getTime() ? " " + this._dayOverClass : "") + (sa ? " " + this._unselectableClass + " ui-state-disabled" : "") + (ja && !Q ? "" : " " + oa[1] + (K.getTime() == v.getTime() ? " " + this._currentClass : "") + (K.getTime() == e.getTime() ? " ui-datepicker-today" : 
            "")) + '"' + (ja && !Q || !oa[2] ? "" : ' title="' + oa[2] + '"') + (sa ? "" : ' onclick="DP_jQuery_' + b + ".datepicker._selectDay('#" + c.id + "'," + K.getMonth() + "," + K.getFullYear() + ', this);return false;"') + ">" + (ja && !Q ? "&#xa0;" : sa ? '<span class="ui-state-default">' + K.getDate() + "</span>" : '<a class="ui-state-default' + (K.getTime() == e.getTime() ? " ui-state-highlight" : "") + (K.getTime() == v.getTime() ? " ui-state-active" : "") + (ja ? " ui-priority-secondary" : 
            "") + '" href="#">' + K.getDate() + "</a>") + "</td>";
            K.setDate(K.getDate() + 1);
            K = this._daylightSavingAdjust(K);
          }
          T += Ca + "</tr>";
        }
        u++;
        11 < u && (u = 0, D++);
        T += "</tbody></table>" + (p ? "</div>" + (0 < q[0] && h == q[1] - 1 ? '<div class="ui-datepicker-row-break"></div>' : "") : "");
        Ba += T;
      }
      z += Ba;
    }
    return z += l + (a.browser.msie && 7 > parseInt(a.browser.version, 10) && !c.inline ? '<iframe src="javascript:false;" class="ui-datepicker-cover" frameborder="0"></iframe>' : ""), c._keyEvent = !1, z;
  }, _generateMonthYearHeader:function(a, c, d, l, k, n, q, u) {
    var e = this._get(a, "changeMonth"), f = this._get(a, "changeYear"), g = this._get(a, "showMonthAfterYear"), w = '<div class="ui-datepicker-title">', A = "";
    if (n || !e) {
      A += '<span class="ui-datepicker-month">' + q[c] + "</span>";
    } else {
      q = l && l.getFullYear() == d;
      var D = k && k.getFullYear() == d;
      A += '<select class="ui-datepicker-month" onchange="DP_jQuery_' + b + ".datepicker._selectMonthYear('#" + a.id + "', this, 'M');\" onclick=\"DP_jQuery_" + b + ".datepicker._clickMonthYear('#" + a.id + "');\">";
      for (var x = 0; 12 > x; x++) {
        (!q || x >= l.getMonth()) && (!D || x <= k.getMonth()) && (A += '<option value="' + x + '"' + (x == c ? ' selected="selected"' : "") + ">" + u[x] + "</option>");
      }
      A += "</select>";
    }
    g || (w += A + (!n && e && f ? "" : "&#xa0;"));
    if (n || !f) {
      w += '<span class="ui-datepicker-year">' + d + "</span>";
    } else {
      u = this._get(a, "yearRange").split(":");
      var F = (new Date).getFullYear();
      q = function(a) {
        a = a.match(/c[+-].*/) ? d + parseInt(a.substring(1), 10) : a.match(/[+-].*/) ? F + parseInt(a, 10) : parseInt(a, 10);
        return isNaN(a) ? F : a;
      };
      c = q(u[0]);
      u = Math.max(c, q(u[1] || ""));
      c = l ? Math.max(c, l.getFullYear()) : c;
      u = k ? Math.min(u, k.getFullYear()) : u;
      for (w += '<select class="ui-datepicker-year" onchange="DP_jQuery_' + b + ".datepicker._selectMonthYear('#" + a.id + "', this, 'Y');\" onclick=\"DP_jQuery_" + b + ".datepicker._clickMonthYear('#" + a.id + "');\">"; c <= u; c++) {
        w += '<option value="' + c + '"' + (c == d ? ' selected="selected"' : "") + ">" + c + "</option>";
      }
      w += "</select>";
    }
    return w += this._get(a, "yearSuffix"), g && (w += (!n && e && f ? "" : "&#xa0;") + A), w += "</div>", w;
  }, _adjustInstDate:function(a, b, c) {
    var d = a.drawYear + ("Y" == c ? b : 0), e = a.drawMonth + ("M" == c ? b : 0);
    b = Math.min(a.selectedDay, this._getDaysInMonth(d, e)) + ("D" == c ? b : 0);
    d = this._restrictMinMax(a, this._daylightSavingAdjust(new Date(d, e, b)));
    a.selectedDay = d.getDate();
    a.drawMonth = a.selectedMonth = d.getMonth();
    a.drawYear = a.selectedYear = d.getFullYear();
    "M" != c && "Y" != c || this._notifyChange(a);
  }, _restrictMinMax:function(a, b) {
    var c = this._getMinMaxDate(a, "min");
    a = this._getMinMaxDate(a, "max");
    return b = c && b < c ? c : b, b = a && b > a ? a : b, b;
  }, _notifyChange:function(a) {
    var b = this._get(a, "onChangeMonthYear");
    b && b.apply(a.input ? a.input[0] : null, [a.selectedYear, a.selectedMonth + 1, a]);
  }, _getNumberOfMonths:function(a) {
    a = this._get(a, "numberOfMonths");
    return null == a ? [1, 1] : "number" == typeof a ? [1, a] : a;
  }, _getMinMaxDate:function(a, b) {
    return this._determineDate(a, this._get(a, b + "Date"), null);
  }, _getDaysInMonth:function(a, b) {
    return 32 - (new Date(a, b, 32)).getDate();
  }, _getFirstDayOfMonth:function(a, b) {
    return (new Date(a, b, 1)).getDay();
  }, _canAdjustMonth:function(a, b, c, d) {
    var e = this._getNumberOfMonths(a);
    c = this._daylightSavingAdjust(new Date(c, d + (0 > b ? b : e[0] * e[1]), 1));
    return 0 > b && c.setDate(this._getDaysInMonth(c.getFullYear(), c.getMonth())), this._isInRange(a, c);
  }, _isInRange:function(a, b) {
    var c = this._getMinMaxDate(a, "min");
    a = this._getMinMaxDate(a, "max");
    return (!c || b.getTime() >= c.getTime()) && (!a || b.getTime() <= a.getTime());
  }, _getFormatConfig:function(a) {
    var b = this._get(a, "shortYearCutoff");
    return b = "string" != typeof b ? b : (new Date).getFullYear() % 100 + parseInt(b, 10), {shortYearCutoff:b, dayNamesShort:this._get(a, "dayNamesShort"), dayNames:this._get(a, "dayNames"), monthNamesShort:this._get(a, "monthNamesShort"), monthNames:this._get(a, "monthNames")};
  }, _formatDate:function(a, b, c, d) {
    b || (a.currentDay = a.selectedDay, a.currentMonth = a.selectedMonth, a.currentYear = a.selectedYear);
    b = b ? "object" == typeof b ? b : this._daylightSavingAdjust(new Date(d, c, b)) : this._daylightSavingAdjust(new Date(a.currentYear, a.currentMonth, a.currentDay));
    return this.formatDate(this._get(a, "dateFormat"), b, this._getFormatConfig(a));
  }});
  a.fn.datepicker = function(b) {
    a.datepicker.initialized || (a(document).mousedown(a.datepicker._checkExternalClick).find("body").append(a.datepicker.dpDiv), a.datepicker.initialized = !0);
    var c = Array.prototype.slice.call(arguments, 1);
    return "string" != typeof b || "isDisabled" != b && "getDate" != b && "widget" != b ? "option" == b && 2 == arguments.length && "string" == typeof arguments[1] ? a.datepicker["_" + b + "Datepicker"].apply(a.datepicker, [this[0]].concat(c)) : this.each(function() {
      "string" == typeof b ? a.datepicker["_" + b + "Datepicker"].apply(a.datepicker, [this].concat(c)) : a.datepicker._attachDatepicker(this, b);
    }) : a.datepicker["_" + b + "Datepicker"].apply(a.datepicker, [this[0]].concat(c));
  };
  a.datepicker = new c;
  a.datepicker.initialized = !1;
  a.datepicker.uuid = (new Date).getTime();
  a.datepicker.version = "1.8";
  window["DP_jQuery_" + b] = a;
})(jQuery);
(function(a) {
  a.widget("ui.progressbar", {options:{value:0}, _create:function() {
    this.element.addClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").attr({role:"progressbar", "aria-valuemin":this._valueMin(), "aria-valuemax":this._valueMax(), "aria-valuenow":this._value()});
    this.valueDiv = a("<div class='ui-progressbar-value ui-widget-header ui-corner-left'></div>").appendTo(this.element);
    this._refreshValue();
  }, destroy:function() {
    this.element.removeClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").removeAttr("role").removeAttr("aria-valuemin").removeAttr("aria-valuemax").removeAttr("aria-valuenow");
    this.valueDiv.remove();
    a.Widget.prototype.destroy.apply(this, arguments);
  }, value:function(a) {
    return void 0 === a ? this._value() : (this._setOption("value", a), this);
  }, _setOption:function(c, d) {
    switch(c) {
      case "value":
        this.options.value = d, this._refreshValue(), this._trigger("change");
    }
    a.Widget.prototype._setOption.apply(this, arguments);
  }, _value:function() {
    var a = this.options.value;
    return "number" != typeof a && (a = 0), a < this._valueMin() && (a = this._valueMin()), a > this._valueMax() && (a = this._valueMax()), a;
  }, _valueMin:function() {
    return 0;
  }, _valueMax:function() {
    return 100;
  }, _refreshValue:function() {
    var a = this.value();
    this.valueDiv[a === this._valueMax() ? "addClass" : "removeClass"]("ui-corner-right").width(a + "%");
    this.element.attr("aria-valuenow", a);
  }});
  a.extend(a.ui.progressbar, {version:"1.8"});
})(jQuery);
jQuery.effects || function(a) {
  function c(b) {
    var c;
    return b && b.constructor == Array && 3 == b.length ? b : (c = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(b)) ? [parseInt(c[1], 10), parseInt(c[2], 10), parseInt(c[3], 10)] : (c = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)%\s*,\s*([0-9]+(?:\.[0-9]+)?)%\s*,\s*([0-9]+(?:\.[0-9]+)?)%\s*\)/.exec(b)) ? [2.55 * parseFloat(c[1]), 2.55 * parseFloat(c[2]), 2.55 * parseFloat(c[3])] : (c = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(b)) ? [parseInt(c[1], 16), parseInt(c[2], 
    16), parseInt(c[3], 16)] : (c = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(b)) ? [parseInt(c[1] + c[1], 16), parseInt(c[2] + c[2], 16), parseInt(c[3] + c[3], 16)] : /rgba\(0, 0, 0, 0\)/.exec(b) ? g.transparent : g[a.trim(b).toLowerCase()];
  }
  function d() {
    var a = document.defaultView ? document.defaultView.getComputedStyle(this, null) : this.currentStyle, b = {}, c;
    if (a && a.length && a[0] && a[a[0]]) {
      for (var d = a.length; d--;) {
        var e = a[d];
        "string" == typeof a[e] && (c = e.replace(/\-(\w)/g, function(a, b) {
          return b.toUpperCase();
        }), b[c] = a[e]);
      }
    } else {
      for (e in a) {
        "string" == typeof a[e] && (b[e] = a[e]);
      }
    }
    return b;
  }
  function b(b) {
    var c;
    for (c in b) {
      var d = b[c];
      (null == d || a.isFunction(d) || c in k || /scrollbar/.test(c) || !/color/i.test(c) && isNaN(parseFloat(d))) && delete b[c];
    }
    return b;
  }
  function e(a, b) {
    var c = {_:0}, d;
    for (d in b) {
      a[d] != b[d] && (c[d] = b[d]);
    }
    return c;
  }
  function f(b, c, d, e) {
    "object" == typeof b && (e = c, d = null, c = b, b = c.effect);
    a.isFunction(c) && (e = c, d = null, c = {});
    a.isFunction(d) && (e = d, d = null);
    if ("number" == typeof c || a.fx.speeds[c]) {
      e = d, d = c, c = {};
    }
    return c = c || {}, d = d || c.duration, d = a.fx.off ? 0 : "number" == typeof d ? d : a.fx.speeds[d] || a.fx.speeds._default, e = e || c.complete, [b, c, d, e];
  }
  a.effects = {};
  a.each("backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color outlineColor".split(" "), function(b, d) {
    a.fx.step[d] = function(b) {
      if (!b.colorInit) {
        var e = b.elem;
        var f = d;
        do {
          var g = a.curCSS(e, f);
          if ("" != g && "transparent" != g || a.nodeName(e, "body")) {
            break;
          }
          f = "backgroundColor";
        } while (e = e.parentNode);
        e = c(g);
        b.start = e;
        b.end = c(b.end);
        b.colorInit = !0;
      }
      b.elem.style[d] = "rgb(" + Math.max(Math.min(parseInt(b.pos * (b.end[0] - b.start[0]) + b.start[0], 10), 255), 0) + "," + Math.max(Math.min(parseInt(b.pos * (b.end[1] - b.start[1]) + b.start[1], 10), 255), 0) + "," + Math.max(Math.min(parseInt(b.pos * (b.end[2] - b.start[2]) + b.start[2], 10), 255), 0) + ")";
    };
  });
  var g = {aqua:[0, 255, 255], azure:[240, 255, 255], beige:[245, 245, 220], black:[0, 0, 0], blue:[0, 0, 255], brown:[165, 42, 42], cyan:[0, 255, 255], darkblue:[0, 0, 139], darkcyan:[0, 139, 139], darkgrey:[169, 169, 169], darkgreen:[0, 100, 0], darkkhaki:[189, 183, 107], darkmagenta:[139, 0, 139], darkolivegreen:[85, 107, 47], darkorange:[255, 140, 0], darkorchid:[153, 50, 204], darkred:[139, 0, 0], darksalmon:[233, 150, 122], darkviolet:[148, 0, 211], fuchsia:[255, 0, 255], gold:[255, 215, 0], 
  green:[0, 128, 0], indigo:[75, 0, 130], khaki:[240, 230, 140], lightblue:[173, 216, 230], lightcyan:[224, 255, 255], lightgreen:[144, 238, 144], lightgrey:[211, 211, 211], lightpink:[255, 182, 193], lightyellow:[255, 255, 224], lime:[0, 255, 0], magenta:[255, 0, 255], maroon:[128, 0, 0], navy:[0, 0, 128], olive:[128, 128, 0], orange:[255, 165, 0], pink:[255, 192, 203], purple:[128, 0, 128], violet:[128, 0, 128], red:[255, 0, 0], silver:[192, 192, 192], white:[255, 255, 255], yellow:[255, 255, 0], 
  transparent:[255, 255, 255]}, l = ["add", "remove", "toggle"], k = {border:1, borderBottom:1, borderColor:1, borderLeft:1, borderRight:1, borderTop:1, borderWidth:1, margin:1, padding:1};
  a.effects.animateClass = function(c, f, g, m) {
    return a.isFunction(g) && (m = g, g = null), this.each(function() {
      var k = a(this), q = k.attr("style") || " ", n = b(d.call(this)), u = k.attr("className");
      a.each(l, function(a, b) {
        c[b] && k[b + "Class"](c[b]);
      });
      var D = b(d.call(this));
      k.attr("className", u);
      k.animate(e(n, D), f, g, function() {
        a.each(l, function(a, b) {
          c[b] && k[b + "Class"](c[b]);
        });
        "object" == typeof k.attr("style") ? (k.attr("style").cssText = "", k.attr("style").cssText = q) : k.attr("style", q);
        m && m.apply(this, arguments);
      });
    });
  };
  a.fn.extend({_addClass:a.fn.addClass, addClass:function(b, c, d, e) {
    return c ? a.effects.animateClass.apply(this, [{add:b}, c, d, e]) : this._addClass(b);
  }, _removeClass:a.fn.removeClass, removeClass:function(b, c, d, e) {
    return c ? a.effects.animateClass.apply(this, [{remove:b}, c, d, e]) : this._removeClass(b);
  }, _toggleClass:a.fn.toggleClass, toggleClass:function(b, c, d, e, f) {
    return "boolean" == typeof c || void 0 === c ? d ? a.effects.animateClass.apply(this, [c ? {add:b} : {remove:b}, d, e, f]) : this._toggleClass(b, c) : a.effects.animateClass.apply(this, [{toggle:b}, c, d, e]);
  }, switchClass:function(b, c, d, e, f) {
    return a.effects.animateClass.apply(this, [{add:c, remove:b}, d, e, f]);
  }});
  a.extend(a.effects, {version:"1.8", save:function(a, b) {
    for (var c = 0; c < b.length; c++) {
      null !== b[c] && a.data("ec.storage." + b[c], a[0].style[b[c]]);
    }
  }, restore:function(a, b) {
    for (var c = 0; c < b.length; c++) {
      null !== b[c] && a.css(b[c], a.data("ec.storage." + b[c]));
    }
  }, setMode:function(a, b) {
    return "toggle" == b && (b = a.is(":hidden") ? "show" : "hide"), b;
  }, getBaseline:function(a, b) {
    switch(a[0]) {
      case "top":
        var c = 0;
        break;
      case "middle":
        c = .5;
        break;
      case "bottom":
        c = 1;
        break;
      default:
        c = a[0] / b.height;
    }
    switch(a[1]) {
      case "left":
        a = 0;
        break;
      case "center":
        a = .5;
        break;
      case "right":
        a = 1;
        break;
      default:
        a = a[1] / b.width;
    }
    return {x:a, y:c};
  }, createWrapper:function(b) {
    if (b.parent().is(".ui-effects-wrapper")) {
      return b.parent();
    }
    var c = {width:b.outerWidth(!0), height:b.outerHeight(!0), "float":b.css("float")}, d = a("<div></div>").addClass("ui-effects-wrapper").css({fontSize:"100%", background:"transparent", border:"none", margin:0, padding:0});
    return b.wrap(d), d = b.parent(), "static" == b.css("position") ? (d.css({position:"relative"}), b.css({position:"relative"})) : (a.extend(c, {position:b.css("position"), zIndex:b.css("z-index")}), a.each(["top", "left", "bottom", "right"], function(a, d) {
      c[d] = b.css(d);
      isNaN(parseInt(c[d], 10)) && (c[d] = "auto");
    }), b.css({position:"relative", top:0, left:0})), d.css(c).show();
  }, removeWrapper:function(a) {
    return a.parent().is(".ui-effects-wrapper") ? a.parent().replaceWith(a) : a;
  }, setTransition:function(b, c, d, e) {
    return e = e || {}, a.each(c, function(a, c) {
      unit = b.cssUnit(c);
      0 < unit[0] && (e[c] = unit[0] * d + unit[1]);
    }), e;
  }});
  a.fn.extend({effect:function(b, c, d, e) {
    var g = f.apply(this, arguments);
    g = {options:g[1], duration:g[2], callback:g[3]};
    var m = a.effects[b];
    return m && !a.fx.off ? m.call(this, g) : this;
  }, _show:a.fn.show, show:function(b) {
    if (!b || "number" == typeof b || a.fx.speeds[b]) {
      return this._show.apply(this, arguments);
    }
    var c = f.apply(this, arguments);
    return c[1].mode = "show", this.effect.apply(this, c);
  }, _hide:a.fn.hide, hide:function(b) {
    if (!b || "number" == typeof b || a.fx.speeds[b]) {
      return this._hide.apply(this, arguments);
    }
    var c = f.apply(this, arguments);
    return c[1].mode = "hide", this.effect.apply(this, c);
  }, __toggle:a.fn.toggle, toggle:function(b) {
    if (!b || "number" == typeof b || a.fx.speeds[b] || "boolean" == typeof b || a.isFunction(b)) {
      return this.__toggle.apply(this, arguments);
    }
    var c = f.apply(this, arguments);
    return c[1].mode = "toggle", this.effect.apply(this, c);
  }, cssUnit:function(b) {
    var c = this.css(b), d = [];
    return a.each(["em", "px", "%", "pt"], function(a, b) {
      0 < c.indexOf(b) && (d = [parseFloat(c), b]);
    }), d;
  }});
  a.easing.jswing = a.easing.swing;
  a.extend(a.easing, {def:"easeOutQuad", swing:function(b, c, d, e, f) {
    return a.easing[a.easing.def](b, c, d, e, f);
  }, easeInQuad:function(a, b, c, d, e) {
    return d * (b /= e) * b + c;
  }, easeOutQuad:function(a, b, c, d, e) {
    return -d * (b /= e) * (b - 2) + c;
  }, easeInOutQuad:function(a, b, c, d, e) {
    return 1 > (b /= e / 2) ? d / 2 * b * b + c : -d / 2 * (--b * (b - 2) - 1) + c;
  }, easeInCubic:function(a, b, c, d, e) {
    return d * (b /= e) * b * b + c;
  }, easeOutCubic:function(a, b, c, d, e) {
    return d * ((b = b / e - 1) * b * b + 1) + c;
  }, easeInOutCubic:function(a, b, c, d, e) {
    return 1 > (b /= e / 2) ? d / 2 * b * b * b + c : d / 2 * ((b -= 2) * b * b + 2) + c;
  }, easeInQuart:function(a, b, c, d, e) {
    return d * (b /= e) * b * b * b + c;
  }, easeOutQuart:function(a, b, c, d, e) {
    return -d * ((b = b / e - 1) * b * b * b - 1) + c;
  }, easeInOutQuart:function(a, b, c, d, e) {
    return 1 > (b /= e / 2) ? d / 2 * b * b * b * b + c : -d / 2 * ((b -= 2) * b * b * b - 2) + c;
  }, easeInQuint:function(a, b, c, d, e) {
    return d * (b /= e) * b * b * b * b + c;
  }, easeOutQuint:function(a, b, c, d, e) {
    return d * ((b = b / e - 1) * b * b * b * b + 1) + c;
  }, easeInOutQuint:function(a, b, c, d, e) {
    return 1 > (b /= e / 2) ? d / 2 * b * b * b * b * b + c : d / 2 * ((b -= 2) * b * b * b * b + 2) + c;
  }, easeInSine:function(a, b, c, d, e) {
    return -d * Math.cos(b / e * (Math.PI / 2)) + d + c;
  }, easeOutSine:function(a, b, c, d, e) {
    return d * Math.sin(b / e * (Math.PI / 2)) + c;
  }, easeInOutSine:function(a, b, c, d, e) {
    return -d / 2 * (Math.cos(Math.PI * b / e) - 1) + c;
  }, easeInExpo:function(a, b, c, d, e) {
    return 0 == b ? c : d * Math.pow(2, 10 * (b / e - 1)) + c;
  }, easeOutExpo:function(a, b, c, d, e) {
    return b == e ? c + d : d * (-Math.pow(2, -10 * b / e) + 1) + c;
  }, easeInOutExpo:function(a, b, c, d, e) {
    return 0 == b ? c : b == e ? c + d : 1 > (b /= e / 2) ? d / 2 * Math.pow(2, 10 * (b - 1)) + c : d / 2 * (-Math.pow(2, -10 * --b) + 2) + c;
  }, easeInCirc:function(a, b, c, d, e) {
    return -d * (Math.sqrt(1 - (b /= e) * b) - 1) + c;
  }, easeOutCirc:function(a, b, c, d, e) {
    return d * Math.sqrt(1 - (b = b / e - 1) * b) + c;
  }, easeInOutCirc:function(a, b, c, d, e) {
    return 1 > (b /= e / 2) ? -d / 2 * (Math.sqrt(1 - b * b) - 1) + c : d / 2 * (Math.sqrt(1 - (b -= 2) * b) + 1) + c;
  }, easeInElastic:function(a, b, c, d, e) {
    a = 0;
    var f = d;
    if (0 == b) {
      return c;
    }
    if (1 == (b /= e)) {
      return c + d;
    }
    a || (a = .3 * e);
    f < Math.abs(d) ? (f = d, d = a / 4) : d = a / (2 * Math.PI) * Math.asin(d / f);
    return -(f * Math.pow(2, 10 * --b) * Math.sin(2 * (b * e - d) * Math.PI / a)) + c;
  }, easeOutElastic:function(a, b, c, d, e) {
    var f = 0, g = d;
    if (0 == b) {
      return c;
    }
    if (1 == (b /= e)) {
      return c + d;
    }
    f || (f = .3 * e);
    g < Math.abs(d) ? (g = d, a = f / 4) : a = f / (2 * Math.PI) * Math.asin(d / g);
    return g * Math.pow(2, -10 * b) * Math.sin(2 * (b * e - a) * Math.PI / f) + d + c;
  }, easeInOutElastic:function(a, b, c, d, e) {
    var f = 0, g = d;
    if (0 == b) {
      return c;
    }
    if (2 == (b /= e / 2)) {
      return c + d;
    }
    f || (f = .3 * e * 1.5);
    g < Math.abs(d) ? (g = d, a = f / 4) : a = f / (2 * Math.PI) * Math.asin(d / g);
    return 1 > b ? -.5 * g * Math.pow(2, 10 * --b) * Math.sin(2 * (b * e - a) * Math.PI / f) + c : g * Math.pow(2, -10 * --b) * Math.sin(2 * (b * e - a) * Math.PI / f) * .5 + d + c;
  }, easeInBack:function(a, b, c, d, e, f) {
    return void 0 == f && (f = 1.70158), d * (b /= e) * b * ((f + 1) * b - f) + c;
  }, easeOutBack:function(a, b, c, d, e, f) {
    return void 0 == f && (f = 1.70158), d * ((b = b / e - 1) * b * ((f + 1) * b + f) + 1) + c;
  }, easeInOutBack:function(a, b, c, d, e, f) {
    return void 0 == f && (f = 1.70158), 1 > (b /= e / 2) ? d / 2 * b * b * (((f *= 1.525) + 1) * b - f) + c : d / 2 * ((b -= 2) * b * (((f *= 1.525) + 1) * b + f) + 2) + c;
  }, easeInBounce:function(b, c, d, e, f) {
    return e - a.easing.easeOutBounce(b, f - c, 0, e, f) + d;
  }, easeOutBounce:function(a, b, c, d, e) {
    return (b /= e) < 1 / 2.75 ? 7.5625 * d * b * b + c : b < 2 / 2.75 ? d * (7.5625 * (b -= 1.5 / 2.75) * b + .75) + c : b < 2.5 / 2.75 ? d * (7.5625 * (b -= 2.25 / 2.75) * b + .9375) + c : d * (7.5625 * (b -= 2.625 / 2.75) * b + .984375) + c;
  }, easeInOutBounce:function(b, c, d, e, f) {
    return c < f / 2 ? .5 * a.easing.easeInBounce(b, 2 * c, 0, e, f) + d : .5 * a.easing.easeOutBounce(b, 2 * c - f, 0, e, f) + .5 * e + d;
  }});
}(jQuery);
(function(a) {
  a.effects.blind = function(c) {
    return this.queue(function() {
      var d = a(this), b = ["position", "top", "left"], e = a.effects.setMode(d, c.options.mode || "hide"), f = c.options.direction || "vertical";
      a.effects.save(d, b);
      d.show();
      var g = a.effects.createWrapper(d).css({overflow:"hidden"}), l = "vertical" == f ? "height" : "width";
      f = "vertical" == f ? g.height() : g.width();
      "show" == e && g.css(l, 0);
      var k = {};
      k[l] = "show" == e ? f : 0;
      g.animate(k, c.duration, c.options.easing, function() {
        "hide" == e && d.hide();
        a.effects.restore(d, b);
        a.effects.removeWrapper(d);
        c.callback && c.callback.apply(d[0], arguments);
        d.dequeue();
      });
    });
  };
})(jQuery);
(function(a) {
  a.effects.bounce = function(c) {
    return this.queue(function() {
      var d = a(this), b = ["position", "top", "left"], e = a.effects.setMode(d, c.options.mode || "effect"), f = c.options.direction || "up", g = c.options.distance || 20, l = c.options.times || 5, k = c.duration || 250;
      /show|hide/.test(e) && b.push("opacity");
      a.effects.save(d, b);
      d.show();
      a.effects.createWrapper(d);
      var n = "up" == f || "down" == f ? "top" : "left";
      f = "up" == f || "left" == f ? "pos" : "neg";
      g = c.options.distance || ("top" == n ? d.outerHeight({margin:!0}) / 3 : d.outerWidth({margin:!0}) / 3);
      "show" == e && d.css("opacity", 0).css(n, "pos" == f ? -g : g);
      "hide" == e && (g /= 2 * l);
      "hide" != e && l--;
      if ("show" == e) {
        var q = {opacity:1};
        q[n] = ("pos" == f ? "+=" : "-=") + g;
        d.animate(q, k / 2, c.options.easing);
        g /= 2;
        l--;
      }
      for (q = 0; q < l; q++) {
        var u = {}, m = {};
        u[n] = ("pos" == f ? "-=" : "+=") + g;
        m[n] = ("pos" == f ? "+=" : "-=") + g;
        d.animate(u, k / 2, c.options.easing).animate(m, k / 2, c.options.easing);
        g = "hide" == e ? 2 * g : g / 2;
      }
      "hide" == e ? (q = {opacity:0}, q[n] = ("pos" == f ? "-=" : "+=") + g, d.animate(q, k / 2, c.options.easing, function() {
        d.hide();
        a.effects.restore(d, b);
        a.effects.removeWrapper(d);
        c.callback && c.callback.apply(this, arguments);
      })) : (u = {}, m = {}, u[n] = ("pos" == f ? "-=" : "+=") + g, m[n] = ("pos" == f ? "+=" : "-=") + g, d.animate(u, k / 2, c.options.easing).animate(m, k / 2, c.options.easing, function() {
        a.effects.restore(d, b);
        a.effects.removeWrapper(d);
        c.callback && c.callback.apply(this, arguments);
      }));
      d.queue("fx", function() {
        d.dequeue();
      });
      d.dequeue();
    });
  };
})(jQuery);
(function(a) {
  a.effects.clip = function(c) {
    return this.queue(function() {
      var d = a(this), b = ["position", "top", "left", "height", "width"], e = a.effects.setMode(d, c.options.mode || "hide"), f = c.options.direction || "vertical";
      a.effects.save(d, b);
      d.show();
      var g = a.effects.createWrapper(d).css({overflow:"hidden"});
      g = "IMG" == d[0].tagName ? g : d;
      var l = "vertical" == f ? "height" : "width", k = "vertical" == f ? "top" : "left";
      f = "vertical" == f ? g.height() : g.width();
      "show" == e && (g.css(l, 0), g.css(k, f / 2));
      var n = {};
      n[l] = "show" == e ? f : 0;
      n[k] = "show" == e ? 0 : f / 2;
      g.animate(n, {queue:!1, duration:c.duration, easing:c.options.easing, complete:function() {
        "hide" == e && d.hide();
        a.effects.restore(d, b);
        a.effects.removeWrapper(d);
        c.callback && c.callback.apply(d[0], arguments);
        d.dequeue();
      }});
    });
  };
})(jQuery);
(function(a) {
  a.effects.drop = function(c) {
    return this.queue(function() {
      var d = a(this), b = ["position", "top", "left", "opacity"], e = a.effects.setMode(d, c.options.mode || "hide"), f = c.options.direction || "left";
      a.effects.save(d, b);
      d.show();
      a.effects.createWrapper(d);
      var g = "up" == f || "down" == f ? "top" : "left";
      f = "up" == f || "left" == f ? "pos" : "neg";
      var l = c.options.distance || ("top" == g ? d.outerHeight({margin:!0}) / 2 : d.outerWidth({margin:!0}) / 2);
      "show" == e && d.css("opacity", 0).css(g, "pos" == f ? -l : l);
      var k = {opacity:"show" == e ? 1 : 0};
      k[g] = ("show" == e ? "pos" == f ? "+=" : "-=" : "pos" == f ? "-=" : "+=") + l;
      d.animate(k, {queue:!1, duration:c.duration, easing:c.options.easing, complete:function() {
        "hide" == e && d.hide();
        a.effects.restore(d, b);
        a.effects.removeWrapper(d);
        c.callback && c.callback.apply(this, arguments);
        d.dequeue();
      }});
    });
  };
})(jQuery);
(function(a) {
  a.effects.explode = function(c) {
    return this.queue(function() {
      var d = c.options.pieces ? Math.round(Math.sqrt(c.options.pieces)) : 3, b = c.options.pieces ? Math.round(Math.sqrt(c.options.pieces)) : 3;
      c.options.mode = "toggle" == c.options.mode ? a(this).is(":visible") ? "hide" : "show" : c.options.mode;
      var e = a(this).show().css("visibility", "hidden"), f = e.offset();
      f.top -= parseInt(e.css("marginTop"), 10) || 0;
      f.left -= parseInt(e.css("marginLeft"), 10) || 0;
      for (var g = e.outerWidth(!0), l = e.outerHeight(!0), k = 0; k < d; k++) {
        for (var n = 0; n < b; n++) {
          e.clone().appendTo("body").wrap("<div></div>").css({position:"absolute", visibility:"visible", left:g / b * -n, top:l / d * -k}).parent().addClass("ui-effects-explode").css({position:"absolute", overflow:"hidden", width:g / b, height:l / d, left:f.left + g / b * n + ("show" == c.options.mode ? g / b * (n - Math.floor(b / 2)) : 0), top:f.top + l / d * k + ("show" == c.options.mode ? l / d * (k - Math.floor(d / 2)) : 0), opacity:"show" == c.options.mode ? 0 : 1}).animate({left:f.left + g / 
          b * n + ("show" == c.options.mode ? 0 : g / b * (n - Math.floor(b / 2))), top:f.top + l / d * k + ("show" == c.options.mode ? 0 : l / d * (k - Math.floor(d / 2))), opacity:"show" == c.options.mode ? 1 : 0}, c.duration || 500);
        }
      }
      setTimeout(function() {
        "show" == c.options.mode ? e.css({visibility:"visible"}) : e.css({visibility:"visible"}).hide();
        c.callback && c.callback.apply(e[0]);
        e.dequeue();
        a("div.ui-effects-explode").remove();
      }, c.duration || 500);
    });
  };
})(jQuery);
(function(a) {
  a.effects.fold = function(c) {
    return this.queue(function() {
      var d = a(this), b = ["position", "top", "left"], e = a.effects.setMode(d, c.options.mode || "hide"), f = c.options.size || 15, g = !!c.options.horizFirst, l = c.duration ? c.duration / 2 : a.fx.speeds._default / 2;
      a.effects.save(d, b);
      d.show();
      var k = a.effects.createWrapper(d).css({overflow:"hidden"}), n = "show" == e != g, q = n ? ["width", "height"] : ["height", "width"];
      n = n ? [k.width(), k.height()] : [k.height(), k.width()];
      var u = /([0-9]+)%/.exec(f);
      u && (f = parseInt(u[1], 10) / 100 * n["hide" == e ? 0 : 1]);
      "show" == e && k.css(g ? {height:0, width:f} : {height:f, width:0});
      g = {};
      u = {};
      g[q[0]] = "show" == e ? n[0] : f;
      u[q[1]] = "show" == e ? n[1] : 0;
      k.animate(g, l, c.options.easing).animate(u, l, c.options.easing, function() {
        "hide" == e && d.hide();
        a.effects.restore(d, b);
        a.effects.removeWrapper(d);
        c.callback && c.callback.apply(d[0], arguments);
        d.dequeue();
      });
    });
  };
})(jQuery);
(function(a) {
  a.effects.highlight = function(c) {
    return this.queue(function() {
      var d = a(this), b = ["backgroundImage", "backgroundColor", "opacity"], e = a.effects.setMode(d, c.options.mode || "show"), f = {backgroundColor:d.css("backgroundColor")};
      "hide" == e && (f.opacity = 0);
      a.effects.save(d, b);
      d.show().css({backgroundImage:"none", backgroundColor:c.options.color || "#ffff99"}).animate(f, {queue:!1, duration:c.duration, easing:c.options.easing, complete:function() {
        "hide" == e && d.hide();
        a.effects.restore(d, b);
        "show" == e && !a.support.opacity && this.style.removeAttribute("filter");
        c.callback && c.callback.apply(this, arguments);
        d.dequeue();
      }});
    });
  };
})(jQuery);
(function(a) {
  a.effects.pulsate = function(c) {
    return this.queue(function() {
      var d = a(this), b = a.effects.setMode(d, c.options.mode || "show");
      times = 2 * (c.options.times || 5) - 1;
      duration = c.duration ? c.duration / 2 : a.fx.speeds._default / 2;
      isVisible = d.is(":visible");
      animateTo = 0;
      isVisible || (d.css("opacity", 0).show(), animateTo = 1);
      ("hide" == b && isVisible || "show" == b && !isVisible) && times--;
      for (b = 0; b < times; b++) {
        d.animate({opacity:animateTo}, duration, c.options.easing), animateTo = (animateTo + 1) % 2;
      }
      d.animate({opacity:animateTo}, duration, c.options.easing, function() {
        0 == animateTo && d.hide();
        c.callback && c.callback.apply(this, arguments);
      });
      d.queue("fx", function() {
        d.dequeue();
      }).dequeue();
    });
  };
})(jQuery);
(function(a) {
  a.effects.puff = function(c) {
    return this.queue(function() {
      var d = a(this), b = a.effects.setMode(d, c.options.mode || "hide"), e = parseInt(c.options.percent, 10) || 150, f = e / 100, g = {height:d.height(), width:d.width()};
      a.extend(c.options, {fade:!0, mode:b, percent:"hide" == b ? e : 100, from:"hide" == b ? g : {height:g.height * f, width:g.width * f}});
      d.effect("scale", c.options, c.duration, c.callback);
      d.dequeue();
    });
  };
  a.effects.scale = function(c) {
    return this.queue(function() {
      var d = a(this), b = a.extend(!0, {}, c.options), e = a.effects.setMode(d, c.options.mode || "effect"), f = parseInt(c.options.percent, 10) || (0 == parseInt(c.options.percent, 10) ? 0 : "hide" == e ? 0 : 100), g = c.options.direction || "both", l = c.options.origin;
      "effect" != e && (b.origin = l || ["middle", "center"], b.restore = !0);
      l = {height:d.height(), width:d.width()};
      d.from = c.options.from || ("show" == e ? {height:0, width:0} : l);
      d.to = {height:l.height * ("horizontal" != g ? f / 100 : 1), width:l.width * ("vertical" != g ? f / 100 : 1)};
      c.options.fade && ("show" == e && (d.from.opacity = 0, d.to.opacity = 1), "hide" == e && (d.from.opacity = 1, d.to.opacity = 0));
      b.from = d.from;
      b.to = d.to;
      b.mode = e;
      d.effect("size", b, c.duration, c.callback);
      d.dequeue();
    });
  };
  a.effects.size = function(c) {
    return this.queue(function() {
      var d = a(this), b = "position top left width height overflow opacity".split(" "), e = ["position", "top", "left", "overflow", "opacity"], f = ["width", "height", "overflow"], g = ["fontSize"], l = ["borderTopWidth", "borderBottomWidth", "paddingTop", "paddingBottom"], k = ["borderLeftWidth", "borderRightWidth", "paddingLeft", "paddingRight"], n = a.effects.setMode(d, c.options.mode || "effect"), q = c.options.restore || !1, u = c.options.scale || "both", m = c.options.origin, p = {height:d.height(), 
      width:d.width()};
      d.from = c.options.from || p;
      d.to = c.options.to || p;
      m && (m = a.effects.getBaseline(m, p), d.from.top = (p.height - d.from.height) * m.y, d.from.left = (p.width - d.from.width) * m.x, d.to.top = (p.height - d.to.height) * m.y, d.to.left = (p.width - d.to.width) * m.x);
      var v = d.from.height / p.height, w = d.from.width / p.width, A = d.to.height / p.height, D = d.to.width / p.width;
      if ("box" == u || "both" == u) {
        v != A && (b = b.concat(l), d.from = a.effects.setTransition(d, l, v, d.from), d.to = a.effects.setTransition(d, l, A, d.to)), w != D && (b = b.concat(k), d.from = a.effects.setTransition(d, k, w, d.from), d.to = a.effects.setTransition(d, k, D, d.to));
      }
      ("content" == u || "both" == u) && v != A && (b = b.concat(g), d.from = a.effects.setTransition(d, g, v, d.from), d.to = a.effects.setTransition(d, g, A, d.to));
      a.effects.save(d, q ? b : e);
      d.show();
      a.effects.createWrapper(d);
      d.css("overflow", "hidden").css(d.from);
      if ("content" == u || "both" == u) {
        l = l.concat(["marginTop", "marginBottom"]).concat(g), k = k.concat(["marginLeft", "marginRight"]), f = b.concat(l).concat(k), d.find("*[width]").each(function() {
          child = a(this);
          q && a.effects.save(child, f);
          var b = child.height(), d = child.width();
          child.from = {height:b * v, width:d * w};
          child.to = {height:b * A, width:d * D};
          v != A && (child.from = a.effects.setTransition(child, l, v, child.from), child.to = a.effects.setTransition(child, l, A, child.to));
          w != D && (child.from = a.effects.setTransition(child, k, w, child.from), child.to = a.effects.setTransition(child, k, D, child.to));
          child.css(child.from);
          child.animate(child.to, c.duration, c.options.easing, function() {
            q && a.effects.restore(child, f);
          });
        });
      }
      d.animate(d.to, {queue:!1, duration:c.duration, easing:c.options.easing, complete:function() {
        0 === d.to.opacity && d.css("opacity", d.from.opacity);
        "hide" == n && d.hide();
        a.effects.restore(d, q ? b : e);
        a.effects.removeWrapper(d);
        c.callback && c.callback.apply(this, arguments);
        d.dequeue();
      }});
    });
  };
})(jQuery);
(function(a) {
  a.effects.shake = function(c) {
    return this.queue(function() {
      var d = a(this), b = ["position", "top", "left"];
      a.effects.setMode(d, c.options.mode || "effect");
      var e = c.options.direction || "left", f = c.options.distance || 20, g = c.options.times || 3, l = c.duration || c.options.duration || 140;
      a.effects.save(d, b);
      d.show();
      a.effects.createWrapper(d);
      var k = "up" == e || "down" == e ? "top" : "left", n = "up" == e || "left" == e ? "pos" : "neg";
      e = {};
      var q = {}, u = {};
      e[k] = ("pos" == n ? "-=" : "+=") + f;
      q[k] = ("pos" == n ? "+=" : "-=") + 2 * f;
      u[k] = ("pos" == n ? "-=" : "+=") + 2 * f;
      d.animate(e, l, c.options.easing);
      for (f = 1; f < g; f++) {
        d.animate(q, l, c.options.easing).animate(u, l, c.options.easing);
      }
      d.animate(q, l, c.options.easing).animate(e, l / 2, c.options.easing, function() {
        a.effects.restore(d, b);
        a.effects.removeWrapper(d);
        c.callback && c.callback.apply(this, arguments);
      });
      d.queue("fx", function() {
        d.dequeue();
      });
      d.dequeue();
    });
  };
})(jQuery);
(function(a) {
  a.effects.slide = function(c) {
    return this.queue(function() {
      var d = a(this), b = ["position", "top", "left"], e = a.effects.setMode(d, c.options.mode || "show"), f = c.options.direction || "left";
      a.effects.save(d, b);
      d.show();
      a.effects.createWrapper(d).css({overflow:"hidden"});
      var g = "up" == f || "down" == f ? "top" : "left";
      f = "up" == f || "left" == f ? "pos" : "neg";
      var l = c.options.distance || ("top" == g ? d.outerHeight({margin:!0}) : d.outerWidth({margin:!0}));
      "show" == e && d.css(g, "pos" == f ? -l : l);
      var k = {};
      k[g] = ("show" == e ? "pos" == f ? "+=" : "-=" : "pos" == f ? "-=" : "+=") + l;
      d.animate(k, {queue:!1, duration:c.duration, easing:c.options.easing, complete:function() {
        "hide" == e && d.hide();
        a.effects.restore(d, b);
        a.effects.removeWrapper(d);
        c.callback && c.callback.apply(this, arguments);
        d.dequeue();
      }});
    });
  };
})(jQuery);
(function(a) {
  a.effects.transfer = function(c) {
    return this.queue(function() {
      var d = a(this), b = a(c.options.to), e = b.offset();
      b = {top:e.top, left:e.left, height:b.innerHeight(), width:b.innerWidth()};
      e = d.offset();
      var f = a('<div class="ui-effects-transfer"></div>').appendTo(document.body).addClass(c.options.className).css({top:e.top, left:e.left, height:d.innerHeight(), width:d.innerWidth(), position:"absolute"}).animate(b, c.duration, c.options.easing, function() {
        f.remove();
        c.callback && c.callback.apply(d[0], arguments);
        d.dequeue();
      });
    });
  };
})(jQuery);
jQuery(function(a) {
  var c = a("meta[name=csrf-token]").attr("content"), d = a("meta[name=csrf-param]").attr("content");
  a.fn.extend({triggerAndReturn:function(b, c) {
    b = new a.Event(b);
    return this.trigger(b, c), !1 !== b.result;
  }, callRemote:function() {
    var b = this, c = b.is("form") ? b.serializeArray() : [], d = b.attr("method") || b.attr("data-method") || "GET", g = b.attr("action") || b.attr("href");
    if (void 0 === g) {
      throw "No URL specified for remote call (action or href must be present).";
    }
    b.triggerAndReturn("ajax:before") && a.ajax({url:g, data:c, dataType:"script", type:d.toUpperCase(), beforeSend:function(a) {
      b.trigger("ajax:loading", a);
    }, success:function(a, c, d) {
      b.trigger("ajax:success", [a, c, d]);
    }, complete:function(a) {
      b.trigger("ajax:complete", a);
    }, error:function(a, c, d) {
      b.trigger("ajax:failure", [a, c, d]);
    }});
    b.trigger("ajax:after");
  }});
  a("a[data-confirm],input[data-confirm]").live("click", function() {
    var b = a(this);
    if (b.triggerAndReturn("confirm") && !confirm(b.attr("data-confirm"))) {
      return !1;
    }
  });
  a("form[data-remote]").live("submit", function(b) {
    a(this).callRemote();
    b.preventDefault();
  });
  a("a[data-remote],input[data-remote]").live("click", function(b) {
    a(this).callRemote();
    b.preventDefault();
  });
  a("a[data-method]:not([data-remote])").live("click", function(b) {
    var e = a(this), f = e.attr("href");
    e = e.attr("data-method");
    f = a('<form method="post" action="' + f + '">');
    e = '<input name="_method" value="' + e + '" type="hidden" />';
    null != d && null != c && (e += '<input name="' + d + '" value="' + c + '" type="hidden" />');
    f.hide().append(e).appendTo("body");
    b.preventDefault();
    f.submit();
  });
  a("form[data-remote]:has(input[data-disable-with])").live("ajax:before", function() {
    a(this).find("input[data-disable-with]").each(function() {
      var b = a(this);
      b.data("enable-with", b.val()).attr("value", b.attr("data-disable-with")).attr("disabled", "disabled");
    });
  });
  a("form[data-remote]:has(input[data-disable-with])").live("ajax:after", function() {
    a(this).find("input[data-disable-with]").each(function() {
      var b = a(this);
      b.removeAttr("disabled").val(b.data("enable-with"));
    });
  });
});
Date.prototype.toTimeStr = function(a) {
  a = this.getHours();
  var c = this.getMinutes();
  10 > c && (c = "0" + c);
  var d = 11 < a ? "pm" : "am";
  12 < a && (a -= 12);
  10 > a && (a = "0" + a);
  0 == a && (a = "12");
  return a + ":" + c + " " + d;
};
(function(a) {
  var c = 0, d = "%", b = Object.prototype.toString;
  a.fn.extend({jqote:function(c, f) {
    c = "[object Array]" === b.call(c) ? c : [c];
    var e = "";
    return this.each(function(b) {
      for (var g = (fn = a.jqotecache[this.jqote]) ? fn : a.jqotec(this, f || d), l = 0; l < c.length; l++) {
        e += g.call(c[l], b, l, c, g);
      }
    }), e;
  }, jqoteapp:function(b, c, d) {
    var e = a.jqote(b, c, d);
    return this.each(function() {
      a(this).append(e);
    });
  }, jqotepre:function(b, c, d) {
    var e = a.jqote(b, c, d);
    return this.each(function() {
      a(this).prepend(e);
    });
  }, jqotesub:function(b, c, d) {
    var e = a.jqote(b, c, d);
    return this.each(function() {
      a(this).html(e);
    });
  }});
  a.extend({jqote:function(c, f, g) {
    var e = "", k = [];
    g = g || d;
    var n = b.call(c);
    f = "[object Array]" === b.call(f) ? f : [f];
    "[object Function]" === n ? k = [c] : "[object Array]" === n ? k = "[object Function]" === b.call(c[0]) ? c : a.map(c, function(b) {
      return a.jqotec(b, g);
    }) : "[object String]" === n ? k.push(0 > c.indexOf("<" + g) ? a.jqotec(a(c), g) : a.jqotec(c, g)) : k = a.map(a(c), function(b) {
      return a.jqotec(b, g);
    });
    for (c = 0; c < k.length; c++) {
      for (n = 0; n < f.length; n++) {
        e += k[c].call(f[n], c, n, f, k[c]);
      }
    }
    return e;
  }, jqotec:function(e, f) {
    var g, l = "";
    f = f || d;
    var k = b.call(e);
    f = ("[object String]" === k && 0 <= e.indexOf("<" + f) ? e : (e = "[object String]" === k || e instanceof jQuery ? a(e)[0] : e).innerHTML).replace(/\s*<!\[CDATA\[\s*|\s*\]\]>\s*|[\r\n\t]/g, "").split("<" + f).join(f + ">\u001b").split(f + ">");
    for (k = 0; k < f.length; k++) {
      l += "\u001b" != f[k].charAt(0) ? "out+='" + f[k].replace(/([^\\])(["'])/g, "$1\\$2") + "'" : "=" == f[k].charAt(1) ? "+" + f[k].substr(2) + ";" : ";" + f[k].substr(1);
    }
    return g = new Function("i, j, data, fn", 'var out="";' + l + "; return out;"), "[object String]" === b.call(e) ? g : a.jqotecache[e.jqote = e.jqote || c++] = g;
  }, jqotefn:function(b) {
    return a.jqotecache[a(b)[0].jqote] || !1;
  }, jqotetag:function(a) {
    d = a;
  }, jqotecache:[]});
})(jQuery);
(function(a) {
  a.fn.ellipsis = function(c) {
    var d = document.documentElement.style;
    return "textOverflow" in d || "OTextOverflow" in d ? this : this.each(function() {
      var b = a(this);
      if ("hidden" == b.css("overflow")) {
        var d = b.html();
        b.width();
        var f = a(this.cloneNode(!0)).hide().css({position:"absolute", width:"auto", overflow:"visible", "max-width":"inherit"});
        b.after(f);
        for (var g = d; 0 < g.length && f.width() > b.width();) {
          g = g.substr(0, g.length - 1), f.html(g + "...");
        }
        b.html(f.html());
        f.remove();
        if (1 == c) {
          var l = b.width();
          setInterval(function() {
            b.width() != l && (l = b.width(), b.html(d), b.ellipsis());
          }, 200);
        }
      }
    });
  };
})(jQuery);
(function(a) {
  a.color = {};
  a.color.make = function(c, b, e, f) {
    var d = {};
    return d.r = c || 0, d.g = b || 0, d.b = e || 0, d.a = null != f ? f : 1, d.add = function(a, b) {
      for (var c = 0; c < a.length; ++c) {
        d[a.charAt(c)] += b;
      }
      return d.normalize();
    }, d.scale = function(a, b) {
      for (var c = 0; c < a.length; ++c) {
        d[a.charAt(c)] *= b;
      }
      return d.normalize();
    }, d.toString = function() {
      return 1 <= d.a ? "rgb(" + [d.r, d.g, d.b].join() + ")" : "rgba(" + [d.r, d.g, d.b, d.a].join() + ")";
    }, d.normalize = function() {
      function a(a, b, c) {
        return b < a ? a : b > c ? c : b;
      }
      return d.r = a(0, parseInt(d.r), 255), d.g = a(0, parseInt(d.g), 255), d.b = a(0, parseInt(d.b), 255), d.a = a(0, d.a, 1), d;
    }, d.clone = function() {
      return a.color.make(d.r, d.b, d.g, d.a);
    }, d.normalize();
  };
  a.color.extract = function(c, b) {
    do {
      var d = c.css(b).toLowerCase();
      if ("" != d && "transparent" != d) {
        break;
      }
      c = c.parent();
    } while (!a.nodeName(c.get(0), "body"));
    return "rgba(0, 0, 0, 0)" == d && (d = "transparent"), a.color.parse(d);
  };
  a.color.parse = function(d) {
    var b, e = a.color.make;
    if (b = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(d)) {
      return e(parseInt(b[1], 10), parseInt(b[2], 10), parseInt(b[3], 10));
    }
    if (b = /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(d)) {
      return e(parseInt(b[1], 10), parseInt(b[2], 10), parseInt(b[3], 10), parseFloat(b[4]));
    }
    if (b = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)%\s*,\s*([0-9]+(?:\.[0-9]+)?)%\s*,\s*([0-9]+(?:\.[0-9]+)?)%\s*\)/.exec(d)) {
      return e(2.55 * parseFloat(b[1]), 2.55 * parseFloat(b[2]), 2.55 * parseFloat(b[3]));
    }
    if (b = /rgba\(\s*([0-9]+(?:\.[0-9]+)?)%\s*,\s*([0-9]+(?:\.[0-9]+)?)%\s*,\s*([0-9]+(?:\.[0-9]+)?)%\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(d)) {
      return e(2.55 * parseFloat(b[1]), 2.55 * parseFloat(b[2]), 2.55 * parseFloat(b[3]), parseFloat(b[4]));
    }
    if (b = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(d)) {
      return e(parseInt(b[1], 16), parseInt(b[2], 16), parseInt(b[3], 16));
    }
    if (b = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(d)) {
      return e(parseInt(b[1] + b[1], 16), parseInt(b[2] + b[2], 16), parseInt(b[3] + b[3], 16));
    }
    d = a.trim(d).toLowerCase();
    return "transparent" == d ? e(255, 255, 255, 0) : (b = c[d] || [0, 0, 0], e(b[0], b[1], b[2]));
  };
  var c = {aqua:[0, 255, 255], azure:[240, 255, 255], beige:[245, 245, 220], black:[0, 0, 0], blue:[0, 0, 255], brown:[165, 42, 42], cyan:[0, 255, 255], darkblue:[0, 0, 139], darkcyan:[0, 139, 139], darkgrey:[169, 169, 169], darkgreen:[0, 100, 0], darkkhaki:[189, 183, 107], darkmagenta:[139, 0, 139], darkolivegreen:[85, 107, 47], darkorange:[255, 140, 0], darkorchid:[153, 50, 204], darkred:[139, 0, 0], darksalmon:[233, 150, 122], darkviolet:[148, 0, 211], fuchsia:[255, 0, 255], gold:[255, 215, 0], 
  green:[0, 128, 0], indigo:[75, 0, 130], khaki:[240, 230, 140], lightblue:[173, 216, 230], lightcyan:[224, 255, 255], lightgreen:[144, 238, 144], lightgrey:[211, 211, 211], lightpink:[255, 182, 193], lightyellow:[255, 255, 224], lime:[0, 255, 0], magenta:[255, 0, 255], maroon:[128, 0, 0], navy:[0, 0, 128], olive:[128, 128, 0], orange:[255, 165, 0], pink:[255, 192, 203], purple:[128, 0, 128], violet:[128, 0, 128], red:[255, 0, 0], silver:[192, 192, 192], white:[255, 255, 255], yellow:[255, 255, 0]};
})(jQuery);
(function(a) {
  function c(b, c, f, g) {
    function e(a, b) {
      b = [J].concat(b);
      for (var c = 0; c < a.length; ++c) {
        a[c].apply(this, b);
      }
    }
    function k(b) {
      for (var c = [], d = 0; d < b.length; ++d) {
        var e = a.extend(!0, {}, y.series);
        null != b[d].data ? (e.data = b[d].data, delete b[d].data, a.extend(!0, e, b[d]), b[d].data = e.data) : e.data = b[d];
        c.push(e);
      }
      H = c;
      c = H.length;
      d = [];
      e = [];
      for (b = 0; b < H.length; ++b) {
        var f = H[b].color;
        null != f && (--c, "number" == typeof f ? e.push(f) : d.push(a.color.parse(H[b].color)));
      }
      for (b = 0; b < e.length; ++b) {
        c = Math.max(c, e[b] + 1);
      }
      d = [];
      for (b = e = 0; d.length < c;) {
        var g;
        y.colors.length == b ? g = a.color.make(100, 100, 100) : g = a.color.parse(y.colors[b]);
        g.scale("rgb", 1 + (1 == e % 2 ? -1 : 1) * Math.ceil(e / 2) * .2);
        d.push(g);
        ++b;
        b >= y.colors.length && (b = 0, ++e);
      }
      for (b = g = 0; b < H.length; ++b) {
        c = H[b];
        null == c.color ? (c.color = d[g].toString(), ++g) : "number" == typeof c.color && (c.color = d[c.color].toString());
        if (null == c.lines.show) {
          var h;
          e = !0;
          for (h in c) {
            if (c[h] && c[h].show) {
              e = !1;
              break;
            }
          }
          e && (c.lines.show = !0);
        }
        c.xaxis = m(S, n(c, "x"));
        c.yaxis = m(U, n(c, "y"));
      }
      p();
    }
    function n(a, b) {
      a = a[b + "axis"];
      return "object" == typeof a && (a = a.n), "number" != typeof a && (a = 1), a;
    }
    function q() {
      return a.grep(S.concat(U), function(a) {
        return a;
      });
    }
    function u(a) {
      var b = {}, c, d;
      for (c = 0; c < S.length; ++c) {
        (d = S[c]) && d.used && (b["x" + d.n] = d.c2p(a.left));
      }
      for (c = 0; c < U.length; ++c) {
        (d = U[c]) && d.used && (b["y" + d.n] = d.c2p(a.top));
      }
      return void 0 !== b.x1 && (b.x = b.x1), void 0 !== b.y1 && (b.y = b.y1), b;
    }
    function m(b, c) {
      return b[c - 1] || (b[c - 1] = {n:c, direction:b == S ? "x" : "y", options:a.extend(!0, {}, b == S ? y.xaxis : y.yaxis)}), b[c - 1];
    }
    function p() {
      function b(a, b, c) {
        b < a.datamin && b != -f && (a.datamin = b);
        c > a.datamax && c != f && (a.datamax = c);
      }
      var c = Number.POSITIVE_INFINITY, d = Number.NEGATIVE_INFINITY, f = Number.MAX_VALUE, g, m, h, k, p;
      a.each(q(), function(a, b) {
        b.datamin = c;
        b.datamax = d;
        b.used = !1;
      });
      for (g = 0; g < H.length; ++g) {
        var l = H[g];
        l.datapoints = {points:[]};
        e(Z.processRawData, [l, l.data, l.datapoints]);
      }
      for (g = 0; g < H.length; ++g) {
        l = H[g];
        var n = l.data, v = l.datapoints.format;
        if (!v) {
          v = [];
          v.push({x:!0, number:!0, required:!0});
          v.push({y:!0, number:!0, required:!0});
          if (l.bars.show || l.lines.show && l.lines.fill) {
            v.push({y:!0, number:!0, required:!1, defaultValue:0}), l.bars.horizontal && (delete v[v.length - 1].y, v[v.length - 1].x = !0);
          }
          l.datapoints.format = v;
        }
        if (null == l.datapoints.pointsize) {
          l.datapoints.pointsize = v.length;
          var w = l.datapoints.pointsize;
          var A = l.datapoints.points;
          insertSteps = l.lines.show && l.lines.steps;
          l.xaxis.used = l.yaxis.used = !0;
          for (m = h = 0; m < n.length; ++m, h += w) {
            var D = n[m];
            var u = null == D;
            if (!u) {
              for (k = 0; k < w; ++k) {
                var x = D[k];
                (p = v[k]) && (p.number && null != x && (x = +x, isNaN(x) ? x = null : Infinity == x ? x = f : -Infinity == x && (x = -f)), null == x && (p.required && (u = !0), null != p.defaultValue && (x = p.defaultValue)));
                A[h + k] = x;
              }
            }
            if (u) {
              for (k = 0; k < w; ++k) {
                x = A[h + k], null != x && (p = v[k], p.x && b(l.xaxis, x, x), p.y && b(l.yaxis, x, x)), A[h + k] = null;
              }
            } else {
              if (insertSteps && 0 < h && null != A[h - w] && A[h - w] != A[h] && A[h - w + 1] != A[h + 1]) {
                for (k = 0; k < w; ++k) {
                  A[h + w + k] = A[h + k];
                }
                A[h + 1] = A[h - w + 1];
                h += w;
              }
            }
          }
        }
      }
      for (g = 0; g < H.length; ++g) {
        l = H[g], e(Z.processDatapoints, [l, l.datapoints]);
      }
      for (g = 0; g < H.length; ++g) {
        l = H[g];
        A = l.datapoints.points;
        w = l.datapoints.pointsize;
        D = h = c;
        u = n = d;
        for (m = 0; m < A.length; m += w) {
          if (null != A[m]) {
            for (k = 0; k < w; ++k) {
              x = A[m + k], (p = v[k]) && x != f && x != -f && (p.x && (x < h && (h = x), x > n && (n = x)), p.y && (x < D && (D = x), x > u && (u = x)));
            }
          }
        }
        l.bars.show && (m = "left" == l.bars.align ? 0 : -l.bars.barWidth / 2, l.bars.horizontal ? (D += m, u += m + l.bars.barWidth) : (h += m, n += m + l.bars.barWidth));
        b(l.xaxis, h, n);
        b(l.yaxis, D, u);
      }
      a.each(q(), function(a, b) {
        b.datamin == c && (b.datamin = null);
        b.datamax == d && (b.datamax = null);
      });
    }
    function v(c, d) {
      var e = document.createElement("canvas");
      return e.className = d, e.width = V, e.height = W, c || a(e).css({position:"absolute", left:0, top:0}), a(e).appendTo(b), e.getContext || (e = window.G_vmlCanvasManager.initElement(e)), e.getContext("2d").save(), e;
    }
    function w() {
      V = b.width();
      W = b.height();
      if (0 >= V || 0 >= W) {
        throw "Invalid dimensions for plot, width = " + V + ", height = " + W;
      }
    }
    function A(a) {
      a.width != V && (a.width = V);
      a.height != W && (a.height = W);
      a = a.getContext("2d");
      a.restore();
      a.save();
    }
    function D(a) {
      function b(a) {
        return a;
      }
      var c, d, e = a.options.transform || b, f = a.options.inverseTransform;
      "x" == a.direction ? (c = a.scale = ka / Math.abs(e(a.max) - e(a.min)), d = Math.min(e(a.max), e(a.min))) : (c = a.scale = ca / Math.abs(e(a.max) - e(a.min)), c = -c, d = Math.max(e(a.max), e(a.min)));
      e == b ? a.p2c = function(a) {
        return (a - d) * c;
      } : a.p2c = function(a) {
        return (e(a) - d) * c;
      };
      f ? a.c2p = function(a) {
        return f(d + a / c);
      } : a.c2p = function(a) {
        return d + a / c;
      };
    }
    function x(c) {
      function d(d, e) {
        return a('<div style="position:absolute;top:-10000px;' + e + 'font-size:smaller"><div class="' + c.direction + "Axis " + c.direction + c.n + 'Axis">' + d.join("") + "</div></div>").appendTo(b);
      }
      var e = c.options, f = c.ticks || [], g = [], m, h = e.labelWidth, k = e.labelHeight, p;
      if ("x" == c.direction) {
        if (null == h && (h = Math.floor(V / (0 < f.length ? f.length : 1))), null == k) {
          g = [];
          for (e = 0; e < f.length; ++e) {
            (m = f[e].label) && g.push('<div class="tickLabel" style="float:left;width:' + h + 'px">' + m + "</div>");
          }
          0 < g.length && (g.push('<div style="clear:left"></div>'), p = d(g, "width:10000px;"), k = p.height(), p.remove());
        }
      } else {
        if (null == h || null == k) {
          for (e = 0; e < f.length; ++e) {
            (m = f[e].label) && g.push('<div class="tickLabel">' + m + "</div>");
          }
          0 < g.length && (p = d(g, ""), null == h && (h = p.children().width()), null == k && (k = p.find("div.tickLabel").height()), p.remove());
        }
      }
      null == h && (h = 0);
      null == k && (k = 0);
      c.labelWidth = h;
      c.labelHeight = k;
    }
    function F(b) {
      var c = b.labelWidth, d = b.labelHeight, e = b.options.position, f = b.options.tickLength, g = y.grid.axisMargin, m = y.grid.labelMargin, h = "x" == b.direction ? S : U, k = a.grep(h, function(a) {
        return a && a.options.position == e && a.reserveSpace;
      });
      a.inArray(b, k) == k.length - 1 && (g = 0);
      null == f && (f = "full");
      h = a.grep(h, function(a) {
        return a && a.reserveSpace;
      });
      h = 0 == a.inArray(b, h);
      !h && "full" == f && (f = 5);
      isNaN(+f) || (m += +f);
      "x" == b.direction ? (d += m, "bottom" == e ? (G.bottom += d + g, b.box = {top:W - G.bottom, height:d}) : (b.box = {top:G.top + g, height:d}, G.top += d + g)) : (c += m, "left" == e ? (b.box = {left:G.left + g, width:c}, G.left += c + g) : (G.right += c + g, b.box = {left:V - G.right, width:c}));
      b.position = e;
      b.tickLength = f;
      b.box.padding = m;
      b.innermost = h;
    }
    function C() {
      var b, c = q();
      a.each(c, function(a, b) {
        b.show = b.options.show;
        null == b.show && (b.show = b.used);
        b.reserveSpace = b.show || b.options.reserveSpace;
        a = b.options;
        var c = +(null != a.min ? a.min : b.datamin), d = +(null != a.max ? a.max : b.datamax), e = d - c;
        if (0 == e) {
          if (e = 0 == d ? 1 : .01, null == a.min && (c -= e), null == a.max || null != a.min) {
            d += e;
          }
        } else {
          var f = a.autoscaleMargin;
          null != f && (null == a.min && (c -= e * f, 0 > c && null != b.datamin && 0 <= b.datamin && (c = 0)), null == a.max && (d += e * f, 0 < d && null != b.datamax && 0 >= b.datamax && (d = 0)));
        }
        b.min = c;
        b.max = d;
      });
      allocatedAxes = a.grep(c, function(a) {
        return a.reserveSpace;
      });
      G.left = G.right = G.top = G.bottom = 0;
      if (y.grid.show) {
        a.each(allocatedAxes, function(b, c) {
          O(c);
          var d = c.options.ticks;
          b = [];
          null == d || "number" == typeof d && 0 < d ? b = c.tickGenerator(c) : d && (a.isFunction(d) ? b = d({min:c.min, max:c.max}) : b = d);
          var e;
          c.ticks = [];
          for (d = 0; d < b.length; ++d) {
            var f = null, g = b[d];
            "object" == typeof g ? (e = +g[0], 1 < g.length && (f = g[1])) : e = +g;
            null == f && (f = c.tickFormatter(e, c));
            isNaN(e) || c.ticks.push({v:e, label:f});
          }
          e = c.ticks;
          c.options.autoscaleMargin && 0 < e.length && (null == c.options.min && (c.min = Math.min(c.min, e[0].v)), null == c.options.max && 1 < e.length && (c.max = Math.max(c.max, e[e.length - 1].v)));
          x(c);
        });
        for (b = allocatedAxes.length - 1; 0 <= b; --b) {
          F(allocatedAxes[b]);
        }
        var d = y.grid.minBorderMargin;
        if (null == d) {
          for (b = d = 0; b < H.length; ++b) {
            d = Math.max(d, H[b].points.radius + H[b].points.lineWidth / 2);
          }
        }
        for (var e in G) {
          G[e] += y.grid.borderWidth, G[e] = Math.max(d, G[e]);
        }
      }
      ka = V - G.left - G.right;
      ca = W - G.bottom - G.top;
      a.each(c, function(a, b) {
        D(b);
      });
      y.grid.show && (a.each(allocatedAxes, function(a, b) {
        "x" == b.direction ? (b.box.left = G.left, b.box.width = ka) : (b.box.top = G.top, b.box.height = ca);
      }), za());
      va();
    }
    function O(b) {
      var c = b.options, e;
      "number" == typeof c.ticks && 0 < c.ticks ? e = c.ticks : e = .3 * Math.sqrt("x" == b.direction ? V : W);
      e = (b.max - b.min) / e;
      var f, g, m;
      if ("time" == c.mode) {
        var h = {second:1E3, minute:6E4, hour:36E5, day:864E5, month:2592E6, year:525949.2 * 6E4}, k = [[1, "second"], [2, "second"], [5, "second"], [10, "second"], [30, "second"], [1, "minute"], [2, "minute"], [5, "minute"], [10, "minute"], [30, "minute"], [1, "hour"], [2, "hour"], [4, "hour"], [8, "hour"], [12, "hour"], [1, "day"], [2, "day"], [3, "day"], [.25, "month"], [.5, "month"], [1, "month"], [2, "month"], [3, "month"], [6, "month"], [1, "year"]];
        var p = 0;
        null != c.minTickSize && ("number" == typeof c.tickSize ? p = c.tickSize : p = c.minTickSize[0] * h[c.minTickSize[1]]);
        for (g = 0; g < k.length - 1 && !(e < (k[g][0] * h[k[g][1]] + k[g + 1][0] * h[k[g + 1][1]]) / 2 && k[g][0] * h[k[g][1]] >= p); ++g) {
        }
        p = k[g][0];
        g = k[g][1];
        "year" == g && (m = Math.pow(10, Math.floor(Math.log(e / h.year) / Math.LN10)), f = e / h.year / m, 1.5 > f ? p = 1 : 3 > f ? p = 2 : 7.5 > f ? p = 5 : p = 10, p *= m);
        b.tickSize = c.tickSize || [p, g];
        f = function(a) {
          var b = [], c = a.tickSize[0], e = a.tickSize[1], f = new Date(a.min), g = c * h[e];
          "second" == e && f.setUTCSeconds(d(f.getUTCSeconds(), c));
          "minute" == e && f.setUTCMinutes(d(f.getUTCMinutes(), c));
          "hour" == e && f.setUTCHours(d(f.getUTCHours(), c));
          "month" == e && f.setUTCMonth(d(f.getUTCMonth(), c));
          "year" == e && f.setUTCFullYear(d(f.getUTCFullYear(), c));
          f.setUTCMilliseconds(0);
          g >= h.minute && f.setUTCSeconds(0);
          g >= h.hour && f.setUTCMinutes(0);
          g >= h.day && f.setUTCHours(0);
          g >= 4 * h.day && f.setUTCDate(1);
          g >= h.year && f.setUTCMonth(0);
          var m = 0, k = Number.NaN;
          do {
            var p = k;
            k = f.getTime();
            b.push(k);
            if ("month" == e) {
              if (1 > c) {
                f.setUTCDate(1);
                var l = f.getTime();
                f.setUTCMonth(f.getUTCMonth() + 1);
                var n = f.getTime();
                f.setTime(k + m * h.hour + (n - l) * c);
                m = f.getUTCHours();
                f.setUTCHours(0);
              } else {
                f.setUTCMonth(f.getUTCMonth() + c);
              }
            } else {
              "year" == e ? f.setUTCFullYear(f.getUTCFullYear() + c) : f.setTime(k + g);
            }
          } while (k < a.max && k != p);
          return b;
        };
        m = function(b, d) {
          b = new Date(b);
          if (null != c.timeformat) {
            return a.plot.formatDate(b, c.timeformat, c.monthNames);
          }
          var e = d.tickSize[0] * h[d.tickSize[1]];
          d = d.max - d.min;
          var f = c.twelveHourClock ? " %p" : "";
          return e < h.minute ? fmt = "%h:%M:%S" + f : e < h.day ? d < 2 * h.day ? fmt = "%h:%M" + f : fmt = "%b %d %h:%M" + f : e < h.month ? fmt = "%b %d" : e < h.year ? d < h.year ? fmt = "%b" : fmt = "%b %y" : fmt = "%y", a.plot.formatDate(b, fmt, c.monthNames);
        };
      } else {
        g = c.tickDecimals, k = -Math.floor(Math.log(e) / Math.LN10), null != g && k > g && (k = g), m = Math.pow(10, -k), f = e / m, 1.5 > f ? p = 1 : 3 > f ? (p = 2, 2.25 < f && (null == g || k + 1 <= g) && (p = 2.5, ++k)) : 7.5 > f ? p = 5 : p = 10, p *= m, null != c.minTickSize && p < c.minTickSize && (p = c.minTickSize), b.tickDecimals = Math.max(0, null != g ? g : k), b.tickSize = c.tickSize || p, f = function(a) {
          var b = [], c = d(a.min, a.tickSize), e = 0, f = Number.NaN;
          do {
            var g = f;
            f = c + e * a.tickSize;
            b.push(f);
            ++e;
          } while (f < a.max && f != g);
          return b;
        }, m = function(a, b) {
          return a.toFixed(b.tickDecimals);
        };
      }
      if (null != c.alignTicksWithAxis) {
        var l = ("x" == b.direction ? S : U)[c.alignTicksWithAxis - 1];
        l && l.used && l != b && (f = f(b), 0 < f.length && (null == c.min && (b.min = Math.min(b.min, f[0])), null == c.max && 1 < f.length && (b.max = Math.max(b.max, f[f.length - 1]))), f = function(a) {
          var b = [], c;
          for (c = 0; c < l.ticks.length; ++c) {
            var d = (l.ticks[c].v - l.min) / (l.max - l.min);
            d = a.min + d * (a.max - a.min);
            b.push(d);
          }
          return b;
        }, "time" != b.mode && null == c.tickDecimals && (e = Math.max(0, -Math.floor(Math.log(e) / Math.LN10) + 1), p = f(b), 1 < p.length && /\..*0$/.test((p[1] - p[0]).toFixed(e)) || (b.tickDecimals = e)));
      }
      b.tickGenerator = f;
      a.isFunction(c.tickFormatter) ? b.tickFormatter = function(a, b) {
        return "" + c.tickFormatter(a, b);
      } : b.tickFormatter = m;
    }
    function M() {
      E.clearRect(0, 0, V, W);
      var a = y.grid;
      a.show && a.backgroundColor && (E.save(), E.translate(G.left, G.top), E.fillStyle = La(y.grid.backgroundColor, ca, 0, "rgba(255, 255, 255, 0)"), E.fillRect(0, 0, ka, ca), E.restore());
      a.show && !a.aboveData && Q();
      for (var b = 0; b < H.length; ++b) {
        e(Z.drawSeries, [E, H[b]]);
        var c = H[b];
        c.lines.show && xa(c);
        c.bars.show && Ba(c);
        c.points.show && z(c);
      }
      e(Z.draw, [E]);
      a.show && a.aboveData && Q();
    }
    function ra(a, b) {
      var c = q();
      for (i = 0; i < c.length; ++i) {
        var d = c[i];
        if (d.direction == b) {
          var e = b + d.n + "axis";
          !a[e] && 1 == d.n && (e = b + "axis");
          if (a[e]) {
            var f = a[e].from;
            var g = a[e].to;
            break;
          }
        }
      }
      a[e] || (d = "x" == b ? S[0] : U[0], f = a[b + "1"], g = a[b + "2"]);
      null != f && null != g && f > g && (a = f, f = g, g = a);
      return {from:f, to:g, axis:d};
    }
    function Q() {
      var b;
      E.save();
      E.translate(G.left, G.top);
      var c = y.grid.markings;
      if (c) {
        if (a.isFunction(c)) {
          var d = J.getAxes();
          d.xmin = d.xaxis.min;
          d.xmax = d.xaxis.max;
          d.ymin = d.yaxis.min;
          d.ymax = d.yaxis.max;
          c = c(d);
        }
        for (b = 0; b < c.length; ++b) {
          d = c[b];
          var e = ra(d, "x"), f = ra(d, "y");
          null == e.from && (e.from = e.axis.min);
          null == e.to && (e.to = e.axis.max);
          null == f.from && (f.from = f.axis.min);
          null == f.to && (f.to = f.axis.max);
          e.to < e.axis.min || e.from > e.axis.max || f.to < f.axis.min || f.from > f.axis.max || (e.from = Math.max(e.from, e.axis.min), e.to = Math.min(e.to, e.axis.max), f.from = Math.max(f.from, f.axis.min), f.to = Math.min(f.to, f.axis.max), e.from == e.to && f.from == f.to) || (e.from = e.axis.p2c(e.from), e.to = e.axis.p2c(e.to), f.from = f.axis.p2c(f.from), f.to = f.axis.p2c(f.to), e.from == e.to || f.from == f.to ? (E.beginPath(), E.strokeStyle = d.color || y.grid.markingsColor, E.lineWidth = 
          d.lineWidth || y.grid.markingsLineWidth, E.moveTo(e.from, f.from), E.lineTo(e.to, f.to), E.stroke()) : (E.fillStyle = d.color || y.grid.markingsColor, E.fillRect(e.from, f.to, e.to - e.from, f.from - f.to)));
        }
      }
      d = q();
      c = y.grid.borderWidth;
      for (e = 0; e < d.length; ++e) {
        f = d[e];
        b = f.box;
        var g = f.tickLength, m, h, k, p;
        if (f.show && 0 != f.ticks.length) {
          E.strokeStyle = f.options.tickColor || a.color.parse(f.options.color).scale("a", .22).toString();
          E.lineWidth = 1;
          "x" == f.direction ? (m = 0, "full" == g ? h = "top" == f.position ? 0 : ca : h = b.top - G.top + ("top" == f.position ? b.height : 0)) : (h = 0, "full" == g ? m = "left" == f.position ? 0 : ka : m = b.left - G.left + ("left" == f.position ? b.width : 0));
          f.innermost || (E.beginPath(), k = p = 0, "x" == f.direction ? k = ka : p = ca, 1 == E.lineWidth && (m = Math.floor(m) + .5, h = Math.floor(h) + .5), E.moveTo(m, h), E.lineTo(m + k, h + p), E.stroke());
          E.beginPath();
          for (b = 0; b < f.ticks.length; ++b) {
            var l = f.ticks[b].v;
            k = p = 0;
            l < f.min || l > f.max || "full" == g && 0 < c && (l == f.min || l == f.max) || ("x" == f.direction ? (m = f.p2c(l), p = "full" == g ? -ca : g, "top" == f.position && (p = -p)) : (h = f.p2c(l), k = "full" == g ? -ka : g, "left" == f.position && (k = -k)), 1 == E.lineWidth && ("x" == f.direction ? m = Math.floor(m) + .5 : h = Math.floor(h) + .5), E.moveTo(m, h), E.lineTo(m + k, h + p));
          }
          E.stroke();
        }
      }
      c && (E.lineWidth = c, E.strokeStyle = y.grid.borderColor, E.strokeRect(-c / 2, -c / 2, ka + c, ca + c));
      E.restore();
    }
    function za() {
      b.find(".tickLabels").remove();
      for (var a = ['<div class="tickLabels" style="font-size:smaller">'], c = q(), d = 0; d < c.length; ++d) {
        var e = c[d], f = e.box;
        if (e.show) {
          a.push('<div class="' + e.direction + "Axis " + e.direction + e.n + 'Axis" style="color:' + e.options.color + '">');
          for (var g = 0; g < e.ticks.length; ++g) {
            var m = e.ticks[g];
            if (!(!m.label || m.v < e.min || m.v > e.max)) {
              var h = {}, k;
              "x" == e.direction ? (k = "center", h.left = Math.round(G.left + e.p2c(m.v) - e.labelWidth / 2), "bottom" == e.position ? h.top = f.top + f.padding : h.bottom = W - (f.top + f.height - f.padding)) : (h.top = Math.round(G.top + e.p2c(m.v) - e.labelHeight / 2), "left" == e.position ? (h.right = V - (f.left + f.width - f.padding), k = "right") : (h.left = f.left + f.padding, k = "left"));
              h.width = e.labelWidth;
              var p = ["position:absolute", "text-align:" + k], l;
              for (l in h) {
                p.push(l + ":" + h[l] + "px");
              }
              a.push('<div class="tickLabel" style="' + p.join(";") + '">' + m.label + "</div>");
            }
          }
          a.push("</div>");
        }
      }
      a.push("</div>");
      b.append(a.join(""));
    }
    function xa(a) {
      function b(a, b, c, d, e) {
        var f = a.points;
        a = a.pointsize;
        var g = null, m = null;
        E.beginPath();
        for (var h = a; h < f.length; h += a) {
          var k = f[h - a], p = f[h - a + 1], l = f[h], n = f[h + 1];
          if (null != k && null != l) {
            if (p <= n && p < e.min) {
              if (n < e.min) {
                continue;
              }
              k = (e.min - p) / (n - p) * (l - k) + k;
              p = e.min;
            } else {
              if (n <= p && n < e.min) {
                if (p < e.min) {
                  continue;
                }
                l = (e.min - p) / (n - p) * (l - k) + k;
                n = e.min;
              }
            }
            if (p >= n && p > e.max) {
              if (n > e.max) {
                continue;
              }
              k = (e.max - p) / (n - p) * (l - k) + k;
              p = e.max;
            } else {
              if (n >= p && n > e.max) {
                if (p > e.max) {
                  continue;
                }
                l = (e.max - p) / (n - p) * (l - k) + k;
                n = e.max;
              }
            }
            if (k <= l && k < d.min) {
              if (l < d.min) {
                continue;
              }
              p = (d.min - k) / (l - k) * (n - p) + p;
              k = d.min;
            } else {
              if (l <= k && l < d.min) {
                if (k < d.min) {
                  continue;
                }
                n = (d.min - k) / (l - k) * (n - p) + p;
                l = d.min;
              }
            }
            if (k >= l && k > d.max) {
              if (l > d.max) {
                continue;
              }
              p = (d.max - k) / (l - k) * (n - p) + p;
              k = d.max;
            } else {
              if (l >= k && l > d.max) {
                if (k > d.max) {
                  continue;
                }
                n = (d.max - k) / (l - k) * (n - p) + p;
                l = d.max;
              }
            }
            k == g && p == m || E.moveTo(d.p2c(k) + b, e.p2c(p) + c);
            g = l;
            m = n;
            E.lineTo(d.p2c(l) + b, e.p2c(n) + c);
          }
        }
        E.stroke();
      }
      function c(a, b, c) {
        var d = a.points;
        a = a.pointsize;
        for (var e = Math.min(Math.max(0, c.min), c.max), f = 0, g = !1, m = 1, h = 0, k = 0; !(0 < a && f > d.length + a);) {
          f += a;
          var p = d[f - a], l = d[f - a + m], n = d[f], v = d[f + m];
          if (g) {
            if (0 < a && null != p && null == n) {
              k = f;
              a = -a;
              m = 2;
              continue;
            }
            if (0 > a && f == h + a) {
              E.fill();
              g = !1;
              a = -a;
              m = 1;
              f = h = k + a;
              continue;
            }
          }
          if (null != p && null != n) {
            if (p <= n && p < b.min) {
              if (n < b.min) {
                continue;
              }
              l = (b.min - p) / (n - p) * (v - l) + l;
              p = b.min;
            } else {
              if (n <= p && n < b.min) {
                if (p < b.min) {
                  continue;
                }
                v = (b.min - p) / (n - p) * (v - l) + l;
                n = b.min;
              }
            }
            if (p >= n && p > b.max) {
              if (n > b.max) {
                continue;
              }
              l = (b.max - p) / (n - p) * (v - l) + l;
              p = b.max;
            } else {
              if (n >= p && n > b.max) {
                if (p > b.max) {
                  continue;
                }
                v = (b.max - p) / (n - p) * (v - l) + l;
                n = b.max;
              }
            }
            g || (E.beginPath(), E.moveTo(b.p2c(p), c.p2c(e)), g = !0);
            if (l >= c.max && v >= c.max) {
              E.lineTo(b.p2c(p), c.p2c(c.max)), E.lineTo(b.p2c(n), c.p2c(c.max));
            } else {
              if (l <= c.min && v <= c.min) {
                E.lineTo(b.p2c(p), c.p2c(c.min)), E.lineTo(b.p2c(n), c.p2c(c.min));
              } else {
                var w = p, q = n;
                l <= v && l < c.min && v >= c.min ? (p = (c.min - l) / (v - l) * (n - p) + p, l = c.min) : v <= l && v < c.min && l >= c.min && (n = (c.min - l) / (v - l) * (n - p) + p, v = c.min);
                l >= v && l > c.max && v <= c.max ? (p = (c.max - l) / (v - l) * (n - p) + p, l = c.max) : v >= l && v > c.max && l <= c.max && (n = (c.max - l) / (v - l) * (n - p) + p, v = c.max);
                p != w && E.lineTo(b.p2c(w), c.p2c(l));
                E.lineTo(b.p2c(p), c.p2c(l));
                E.lineTo(b.p2c(n), c.p2c(v));
                n != q && (E.lineTo(b.p2c(n), c.p2c(v)), E.lineTo(b.p2c(q), c.p2c(v)));
              }
            }
          }
        }
      }
      E.save();
      E.translate(G.left, G.top);
      E.lineJoin = "round";
      var d = a.lines.lineWidth, e = a.shadowSize;
      if (0 < d && 0 < e) {
        E.lineWidth = e;
        E.strokeStyle = "rgba(0,0,0,0.1)";
        var f = Math.PI / 18;
        b(a.datapoints, Math.sin(f) * (d / 2 + e / 2), Math.cos(f) * (d / 2 + e / 2), a.xaxis, a.yaxis);
        E.lineWidth = e / 2;
        b(a.datapoints, Math.sin(f) * (d / 2 + e / 4), Math.cos(f) * (d / 2 + e / 4), a.xaxis, a.yaxis);
      }
      E.lineWidth = d;
      E.strokeStyle = a.color;
      (e = h(a.lines, a.color, 0, ca)) && (E.fillStyle = e, c(a.datapoints, a.xaxis, a.yaxis));
      0 < d && b(a.datapoints, 0, 0, a.xaxis, a.yaxis);
      E.restore();
    }
    function z(a) {
      function b(a, b, c, d, e, f, g, m) {
        var h = a.points;
        a = a.pointsize;
        for (var k = 0; k < h.length; k += a) {
          var p = h[k], l = h[k + 1];
          null == p || p < f.min || p > f.max || l < g.min || l > g.max || (E.beginPath(), p = f.p2c(p), l = g.p2c(l) + d, "circle" == m ? E.arc(p, l, b, 0, e ? Math.PI : 2 * Math.PI, !1) : m(E, p, l, b, e), E.closePath(), c && (E.fillStyle = c, E.fill()), E.stroke());
        }
      }
      E.save();
      E.translate(G.left, G.top);
      var c = a.points.lineWidth, d = a.shadowSize, e = a.points.radius, f = a.points.symbol;
      0 < c && 0 < d && (d /= 2, E.lineWidth = d, E.strokeStyle = "rgba(0,0,0,0.1)", b(a.datapoints, e, null, d + d / 2, !0, a.xaxis, a.yaxis, f), E.strokeStyle = "rgba(0,0,0,0.2)", b(a.datapoints, e, null, d / 2, !0, a.xaxis, a.yaxis, f));
      E.lineWidth = c;
      E.strokeStyle = a.color;
      b(a.datapoints, e, h(a.points, a.color), 0, !1, a.xaxis, a.yaxis, f);
      E.restore();
    }
    function ma(a, b, c, d, e, f, g, m, h, k, p, l) {
      var n, v, w, q, A, x, D, u, I;
      p ? (u = x = D = !0, A = !1, n = c, v = a, q = b + d, w = b + e, v < n && (I = v, v = n, n = I, A = !0, x = !1)) : (A = x = D = !0, u = !1, n = a + d, v = a + e, w = c, q = b, q < w && (I = q, q = w, w = I, u = !0, D = !1));
      v < m.min || n > m.max || q < h.min || w > h.max || (n < m.min && (n = m.min, A = !1), v > m.max && (v = m.max, x = !1), w < h.min && (w = h.min, u = !1), q > h.max && (q = h.max, D = !1), n = m.p2c(n), w = h.p2c(w), v = m.p2c(v), q = h.p2c(q), g && (k.beginPath(), k.moveTo(n, w), k.lineTo(n, q), k.lineTo(v, q), k.lineTo(v, w), k.fillStyle = g(w, q), k.fill()), 0 < l && (A || x || D || u) && (k.beginPath(), k.moveTo(n, w + f), A ? k.lineTo(n, q + f) : k.moveTo(n, q + f), D ? k.lineTo(v, q + 
      f) : k.moveTo(v, q + f), x ? k.lineTo(v, w + f) : k.moveTo(v, w + f), u ? k.lineTo(n, w + f) : k.moveTo(n, w + f), k.stroke()));
    }
    function Ba(a) {
      E.save();
      E.translate(G.left, G.top);
      E.lineWidth = a.bars.lineWidth;
      E.strokeStyle = a.color;
      var b = "left" == a.bars.align ? 0 : -a.bars.barWidth / 2;
      (function(b, c, d, e, f, g, m) {
        var h = b.points;
        b = b.pointsize;
        for (var k = 0; k < h.length; k += b) {
          null != h[k] && ma(h[k], h[k + 1], h[k + 2], c, d, e, f, g, m, E, a.bars.horizontal, a.bars.lineWidth);
        }
      })(a.datapoints, b, b + a.bars.barWidth, 0, a.bars.fill ? function(b, c) {
        return h(a.bars, a.color, b, c);
      } : null, a.xaxis, a.yaxis);
      E.restore();
    }
    function h(b, c, d, e) {
      var f = b.fill;
      if (!f) {
        return null;
      }
      if (b.fillColor) {
        return La(b.fillColor, d, e, c);
      }
      b = a.color.parse(c);
      return b.a = "number" == typeof f ? f : .4, b.normalize(), b.toString();
    }
    function va() {
      b.find(".legend").remove();
      if (y.legend.show) {
        for (var c = [], d = !1, e = y.legend.labelFormatter, f, g, m = 0; m < H.length; ++m) {
          if (f = H[m], g = f.label) {
            0 == m % y.legend.noColumns && (d && c.push("</tr>"), c.push("<tr>"), d = !0), e && (g = e(g, f)), c.push('<td class="legendColorBox"><div style="border:1px solid ' + y.legend.labelBoxBorderColor + ';padding:1px"><div style="width:4px;height:0;border:5px solid ' + f.color + ';overflow:hidden"></div></div></td><td class="legendLabel">' + g + "</td>");
          }
        }
        d && c.push("</tr>");
        0 != c.length && (d = '<table style="font-size:smaller;color:' + y.grid.color + '">' + c.join("") + "</table>", null != y.legend.container ? a(y.legend.container).html(d) : (c = "", e = y.legend.position, f = y.legend.margin, null == f[0] && (f = [f, f]), "n" == e.charAt(0) ? c += "top:" + (f[1] + G.top) + "px;" : "s" == e.charAt(0) && (c += "bottom:" + (f[1] + G.bottom) + "px;"), "e" == e.charAt(1) ? c += "right:" + (f[0] + G.right) + "px;" : "w" == e.charAt(1) && (c += "left:" + (f[0] + 
        G.left) + "px;"), d = a('<div class="legend">' + d.replace('style="', 'style="position:absolute;' + c + ";") + "</div>").appendTo(b), 0 != y.legend.backgroundOpacity && (e = y.legend.backgroundColor, null == e && (e = y.grid.backgroundColor, e && "string" == typeof e ? e = a.color.parse(e) : e = a.color.extract(d, "background-color"), e.a = 1, e = e.toString()), f = d.children(), a('<div style="position:absolute;width:' + f.width() + "px;height:" + f.height() + "px;" + c + "background-color:" + 
        e + ';"> </div>').prependTo(d).css("opacity", y.legend.backgroundOpacity))));
      }
    }
    function N(a) {
      y.grid.hoverable && K("plothover", a, function(a) {
        return 0 != a.hoverable;
      });
    }
    function T(a) {
      y.grid.hoverable && K("plothover", a, function(a) {
        return !1;
      });
    }
    function fa(a) {
      K("plotclick", a, function(a) {
        return 0 != a.clickable;
      });
    }
    function K(a, c, d) {
      var e = X.offset(), f = c.pageX - e.left - G.left, g = c.pageY - e.top - G.top, m = u({left:f, top:g});
      m.pageX = c.pageX;
      m.pageY = c.pageY;
      var h = y.grid.mouseActiveRadius, k = h * h + 1, p = null, l;
      for (c = H.length - 1; 0 <= c; --c) {
        if (d(H[c])) {
          var n = H[c], v = n.xaxis, w = n.yaxis, q = n.datapoints.points, A = n.datapoints.pointsize, x = v.c2p(f), D = w.c2p(g), C = h / v.scale, I = h / w.scale;
          v.options.inverseTransform && (C = Number.MAX_VALUE);
          w.options.inverseTransform && (I = Number.MAX_VALUE);
          if (n.lines.show || n.points.show) {
            for (l = 0; l < q.length; l += A) {
              var z = q[l], F = q[l + 1];
              null == z || z - x > C || z - x < -C || F - D > I || F - D < -I || (z = Math.abs(v.p2c(z) - f), F = Math.abs(w.p2c(F) - g), F = z * z + F * F, F < k && (k = F, p = [c, l / A]));
            }
          }
          if (n.bars.show && !p) {
            for (v = "left" == n.bars.align ? 0 : -n.bars.barWidth / 2, n = v + n.bars.barWidth, l = 0; l < q.length; l += A) {
              z = q[l], F = q[l + 1], w = q[l + 2], null != z && (H[c].bars.horizontal ? x <= Math.max(w, z) && x >= Math.min(w, z) && D >= F + v && D <= F + n : x >= z + v && x <= z + n && D >= Math.min(w, F) && D <= Math.max(w, F)) && (p = [c, l / A]);
            }
          }
        }
      }
      (d = p ? (c = p[0], l = p[1], A = H[c].datapoints.pointsize, {datapoint:H[c].datapoints.points.slice(l * A, (l + 1) * A), dataIndex:l, series:H[c], seriesIndex:c}) : null) && (d.pageX = parseInt(d.series.xaxis.p2c(d.datapoint[0]) + e.left + G.left), d.pageY = parseInt(d.series.yaxis.p2c(d.datapoint[1]) + e.top + G.top));
      if (y.grid.autoHighlight) {
        for (e = 0; e < ia.length; ++e) {
          l = ia[e], l.auto != a || d && l.series == d.series && l.point[0] == d.datapoint[0] && l.point[1] == d.datapoint[1] || ja(l.series, l.point);
        }
        d && oa(d.series, d.datapoint, a);
      }
      b.trigger(a, [m, d]);
    }
    function ha() {
      ta || (ta = setTimeout(Ca, 30));
    }
    function Ca() {
      ta = null;
      R.save();
      R.clearRect(0, 0, V, W);
      R.translate(G.left, G.top);
      var b;
      for (b = 0; b < ia.length; ++b) {
        var c = ia[b];
        if (c.series.bars.show) {
          Oa(c.series, c.point);
        } else {
          var d = c.series, f = c.point;
          c = f[0];
          f = f[1];
          var g = d.xaxis, m = d.yaxis;
          if (!(c < g.min || c > g.max || f < m.min || f > m.max)) {
            var h = d.points.radius + d.points.lineWidth / 2;
            R.lineWidth = h;
            R.strokeStyle = a.color.parse(d.color).scale("a", .5).toString();
            h *= 1.5;
            c = g.p2c(c);
            f = m.p2c(f);
            R.beginPath();
            "circle" == d.points.symbol ? R.arc(c, f, h, 0, 2 * Math.PI, !1) : d.points.symbol(R, c, f, h, !1);
            R.closePath();
            R.stroke();
          }
        }
      }
      R.restore();
      e(Z.drawOverlay, [R]);
    }
    function oa(a, b, c) {
      "number" == typeof a && (a = H[a]);
      if ("number" == typeof b) {
        var d = a.datapoints.pointsize;
        b = a.datapoints.points.slice(d * b, d * (b + 1));
      }
      d = sa(a, b);
      -1 == d ? (ia.push({series:a, point:b, auto:c}), ha()) : c || (ia[d].auto = !1);
    }
    function ja(a, b) {
      null == a && null == b && (ia = [], ha());
      "number" == typeof a && (a = H[a]);
      "number" == typeof b && (b = a.data[b]);
      a = sa(a, b);
      -1 != a && (ia.splice(a, 1), ha());
    }
    function sa(a, b) {
      for (var c = 0; c < ia.length; ++c) {
        var d = ia[c];
        if (d.series == a && d.point[0] == b[0] && d.point[1] == b[1]) {
          return c;
        }
      }
      return -1;
    }
    function Oa(b, c) {
      R.lineWidth = b.bars.lineWidth;
      R.strokeStyle = a.color.parse(b.color).scale("a", .5).toString();
      var d = a.color.parse(b.color).scale("a", .5).toString(), e = "left" == b.bars.align ? 0 : -b.bars.barWidth / 2;
      ma(c[0], c[1], c[2] || 0, e, e + b.bars.barWidth, 0, function() {
        return d;
      }, b.xaxis, b.yaxis, R, b.bars.horizontal, b.bars.lineWidth);
    }
    function La(b, c, d, e) {
      if ("string" == typeof b) {
        return b;
      }
      c = E.createLinearGradient(0, d, 0, c);
      d = 0;
      for (var f = b.colors.length; d < f; ++d) {
        var g = b.colors[d];
        if ("string" != typeof g) {
          var m = a.color.parse(e);
          null != g.brightness && (m = m.scale("rgb", g.brightness));
          null != g.opacity && (m.a *= g.opacity);
          g = m.toString();
        }
        c.addColorStop(d / (f - 1), g);
      }
      return c;
    }
    var H = [], y = {colors:["#edc240", "#afd8f8", "#cb4b4b", "#4da74d", "#9440ed"], legend:{show:!0, noColumns:1, labelFormatter:null, labelBoxBorderColor:"#ccc", container:null, position:"ne", margin:5, backgroundColor:null, backgroundOpacity:.85}, xaxis:{show:null, position:"bottom", mode:null, color:null, tickColor:null, transform:null, inverseTransform:null, min:null, max:null, autoscaleMargin:null, ticks:null, tickFormatter:null, labelWidth:null, labelHeight:null, reserveSpace:null, tickLength:null, 
    alignTicksWithAxis:null, tickDecimals:null, tickSize:null, minTickSize:null, monthNames:null, timeformat:null, twelveHourClock:!1}, yaxis:{autoscaleMargin:.02, position:"left"}, xaxes:[], yaxes:[], series:{points:{show:!1, radius:3, lineWidth:2, fill:!0, fillColor:"#ffffff", symbol:"circle"}, lines:{lineWidth:2, fill:!1, fillColor:null, steps:!1}, bars:{show:!1, lineWidth:2, barWidth:1, fill:!0, fillColor:null, align:"left", horizontal:!1}, shadowSize:3}, grid:{show:!0, aboveData:!1, color:"#545454", 
    backgroundColor:null, borderColor:null, tickColor:null, labelMargin:5, axisMargin:8, borderWidth:2, minBorderMargin:null, markings:null, markingsColor:"#f4f4f4", markingsLineWidth:2, clickable:!1, hoverable:!1, autoHighlight:!0, mouseActiveRadius:10}, hooks:{}}, pa = null, na = null, X = null, E = null, R = null, S = [], U = [], G = {left:0, right:0, top:0, bottom:0}, V = 0, W = 0, ka = 0, ca = 0, Z = {processOptions:[], processRawData:[], processDatapoints:[], drawSeries:[], draw:[], bindEvents:[], 
    drawOverlay:[], shutdown:[]}, J = this;
    J.setData = k;
    J.setupGrid = C;
    J.draw = M;
    J.getPlaceholder = function() {
      return b;
    };
    J.getCanvas = function() {
      return pa;
    };
    J.getPlotOffset = function() {
      return G;
    };
    J.width = function() {
      return ka;
    };
    J.height = function() {
      return ca;
    };
    J.offset = function() {
      var a = X.offset();
      return a.left += G.left, a.top += G.top, a;
    };
    J.getData = function() {
      return H;
    };
    J.getAxes = function() {
      var b = {};
      return a.each(S.concat(U), function(a, c) {
        c && (b[c.direction + (1 != c.n ? c.n : "") + "axis"] = c);
      }), b;
    };
    J.getXAxes = function() {
      return S;
    };
    J.getYAxes = function() {
      return U;
    };
    J.c2p = u;
    J.p2c = function(a) {
      var b = {}, c, d;
      for (c = 0; c < S.length; ++c) {
        if ((d = S[c]) && d.used) {
          var e = "x" + d.n;
          null == a[e] && 1 == d.n && (e = "x");
          if (null != a[e]) {
            b.left = d.p2c(a[e]);
            break;
          }
        }
      }
      for (c = 0; c < U.length; ++c) {
        if ((d = U[c]) && d.used && (e = "y" + d.n, null == a[e] && 1 == d.n && (e = "y"), null != a[e])) {
          b.top = d.p2c(a[e]);
          break;
        }
      }
      return b;
    };
    J.getOptions = function() {
      return y;
    };
    J.highlight = oa;
    J.unhighlight = ja;
    J.triggerRedrawOverlay = ha;
    J.pointOffset = function(a) {
      return {left:parseInt(S[n(a, "x") - 1].p2c(+a.x) + G.left), top:parseInt(U[n(a, "y") - 1].p2c(+a.y) + G.top)};
    };
    J.shutdown = function() {
      ta && clearTimeout(ta);
      X.unbind("mousemove", N);
      X.unbind("mouseleave", T);
      X.unbind("click", fa);
      e(Z.shutdown, [X]);
    };
    J.resize = function() {
      w();
      A(pa);
      A(na);
    };
    J.hooks = Z;
    (function() {
      for (var b = 0; b < g.length; ++b) {
        var c = g[b];
        c.init(J);
        c.options && a.extend(!0, y, c.options);
      }
    })(J);
    (function(b) {
      a.extend(!0, y, b);
      null == y.xaxis.color && (y.xaxis.color = y.grid.color);
      null == y.yaxis.color && (y.yaxis.color = y.grid.color);
      null == y.xaxis.tickColor && (y.xaxis.tickColor = y.grid.tickColor);
      null == y.yaxis.tickColor && (y.yaxis.tickColor = y.grid.tickColor);
      null == y.grid.borderColor && (y.grid.borderColor = y.grid.color);
      null == y.grid.tickColor && (y.grid.tickColor = a.color.parse(y.grid.color).scale("a", .22).toString());
      for (b = 0; b < Math.max(1, y.xaxes.length); ++b) {
        y.xaxes[b] = a.extend(!0, {}, y.xaxis, y.xaxes[b]);
      }
      for (b = 0; b < Math.max(1, y.yaxes.length); ++b) {
        y.yaxes[b] = a.extend(!0, {}, y.yaxis, y.yaxes[b]);
      }
      y.xaxis.noTicks && null == y.xaxis.ticks && (y.xaxis.ticks = y.xaxis.noTicks);
      y.yaxis.noTicks && null == y.yaxis.ticks && (y.yaxis.ticks = y.yaxis.noTicks);
      y.x2axis && (y.xaxes[1] = a.extend(!0, {}, y.xaxis, y.x2axis), y.xaxes[1].position = "top");
      y.y2axis && (y.yaxes[1] = a.extend(!0, {}, y.yaxis, y.y2axis), y.yaxes[1].position = "right");
      y.grid.coloredAreas && (y.grid.markings = y.grid.coloredAreas);
      y.grid.coloredAreasColor && (y.grid.markingsColor = y.grid.coloredAreasColor);
      y.lines && a.extend(!0, y.series.lines, y.lines);
      y.points && a.extend(!0, y.series.points, y.points);
      y.bars && a.extend(!0, y.series.bars, y.bars);
      null != y.shadowSize && (y.series.shadowSize = y.shadowSize);
      for (b = 0; b < y.xaxes.length; ++b) {
        m(S, b + 1).options = y.xaxes[b];
      }
      for (b = 0; b < y.yaxes.length; ++b) {
        m(U, b + 1).options = y.yaxes[b];
      }
      for (var c in Z) {
        y.hooks[c] && y.hooks[c].length && (Z[c] = Z[c].concat(y.hooks[c]));
      }
      e(Z.processOptions, [y]);
    })(f);
    (function() {
      var c, d = b.children("canvas.base"), e = b.children("canvas.overlay");
      0 == d.length || 0 == e ? (b.html(""), b.css({padding:0}), "static" == b.css("position") && b.css("position", "relative"), w(), pa = v(!0, "base"), na = v(!1, "overlay"), c = !1) : (pa = d.get(0), na = e.get(0), c = !0);
      E = pa.getContext("2d");
      R = na.getContext("2d");
      X = a([na, pa]);
      c && (b.data("plot").shutdown(), J.resize(), R.clearRect(0, 0, V, W), X.unbind(), b.children().not([pa, na]).remove());
      b.data("plot", J);
    })();
    k(c);
    C();
    M();
    y.grid.hoverable && (X.mousemove(N), X.mouseleave(T));
    y.grid.clickable && X.click(fa);
    e(Z.bindEvents, [X]);
    var ia = [], ta = null;
  }
  function d(a, c) {
    return c * Math.floor(a / c);
  }
  a.plot = function(b, d, f) {
    return new c(a(b), d, f, a.plot.plugins);
  };
  a.plot.version = "0.7";
  a.plot.plugins = [];
  a.plot.formatDate = function(a, c, d) {
    var b = function(a) {
      return a = "" + a, 1 == a.length ? "0" + a : a;
    }, e = [], f = !1, n = !1, q = a.getUTCHours(), u = 12 > q;
    null == d && (d = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "));
    -1 != c.search(/%p|%P/) && (12 < q ? q -= 12 : 0 == q && (q = 12));
    for (var m = 0; m < c.length; ++m) {
      var p = c.charAt(m);
      if (f) {
        switch(p) {
          case "h":
            p = "" + q;
            break;
          case "H":
            p = b(q);
            break;
          case "M":
            p = b(a.getUTCMinutes());
            break;
          case "S":
            p = b(a.getUTCSeconds());
            break;
          case "d":
            p = "" + a.getUTCDate();
            break;
          case "m":
            p = "" + (a.getUTCMonth() + 1);
            break;
          case "y":
            p = "" + a.getUTCFullYear();
            break;
          case "b":
            p = "" + d[a.getUTCMonth()];
            break;
          case "p":
            p = u ? "am" : "pm";
            break;
          case "P":
            p = u ? "AM" : "PM";
            break;
          case "0":
            p = "", n = !0;
        }
        p && n && (p = b(p), n = !1);
        e.push(p);
        n || (f = !1);
      } else {
        "%" == p ? f = !0 : e.push(p);
      }
    }
    return e.join("");
  };
})(jQuery);

goshrine = function() {
  function join_rooms() {
      $.each(rooms, function(room_id, handler) {
        /* Fuck you javascript; the dictionary changes number -> string. */
        room_id = Number(room_id);
        f.stream(room_id).send({
          "method"   : "room_join",
          "arguments": { "room_id": room_id }
        });
        f.stream(room_id).send({
          "method"   : "room_list",
          "arguments": { "room_id": room_id }
        })
      });
  }

  function a(openHandler) {
    console.log("Websocket opened");
    $("#connection_fail").slideUp();
    join_rooms();
    if (openHandler) {
        openHandler();
    }
  }
  function c(closeHandler) {
    console.log("Websocket closed");
    $("#connection_fail").delay(500).slideDown();
    if (closeHandler) {
        closeHandler();
    }
  }
  function d(a) {
    lastMsg = a;
    if (a.game_type) {
      var b = parseISO8601(a.started_at);
      a = '<span class="timestamp">' + b.toTimeStr() + '</span><span class="game_started">' + a.white_player.login + " and " + a.black_player.login + " started a " + a.board_size + "x" + a.board_size + ' <a href="/g/' + a.token + '">game</a>. </span><br />';
    } else {
      b = parseISO8601(a.created_at);
      a = '<span class="timestamp">' + b.toTimeStr() + '</span><span class="speaker">' + a.user + "</span>: " + a.text + "<br />";
    }
    b = $("#chat_output")[0].scrollHeight - $("#chat_output").innerHeight() - $("#chat_output")[0].scrollTop;
    $("#chat_output").append(a);
    5 >= b && ($("#chat_output")[0].scrollTop = $("#chat_output")[0].scrollHeight);
  }
  function b(a) {
    $("#match_" + a).fadeOut("fast", function() {
      $(this).remove();
    });
  }
  function e(a) {
    g.notice_sounds_flag && $("#chimeSound").jPlayer("play");
    $("#notifications").append($(a));
  }
  var f, g, subscriptions;

  return {
  init:function(b) {
      console.log("goshrine.init()");
      g = b.user;

      $("a.login").live("click", function(a) {
        $("#login_dialog").dialog({width:630, height:315, resizable:!1});
        _gaq.push(["_trackPageview", "/users/sign_in"]);
        console.log("gaq.length = " + _gaq.p.length);
        a.preventDefault();
      });

      rooms = {};
      f     = new channels.WebSocketBridge();
  },

  connect:function(openHandler, closeHandler) {
      f.connect("/events");
      f.socket.addEventListener('open',  function() { a(openHandler); });
      f.socket.addEventListener('close', function() { c(closeHandler); });
      f.listen();

      // The private message stream is connected immediately for every user.
      f.demultiplex('user_' + currentUser.id, this.privateMessage);
  },

  send:function(stream, data) {
        f.stream(stream).send(data);
  },

  addSubscription:function(channel, handler) {
      f.demultiplex(channel, handler);
  },

  joinRoom:function(room_id, handler) {
    console.log("[room] joining room " + room_id);
    f.demultiplex(room_id, handler);
    console.log(typeof(room_id));
    rooms[room_id] = handler;
  },

  sendChatMsg:function(room_id, message) {
    console.log("[room] chat in room " + room_id);
    f.stream(room_id).send({
        'method'   : 'room_chat',
        'arguments': { 'room_id': room_id, 'msg': message }
    });
  },

  showTemporaryMessage:function(a) {
    var b = $("<div />").addClass("errorExplanation").html(a);
    $("#temp_messages").prepend(b);
    window.setTimeout(function() {
      b.fadeOut("slow", function() {
        b.remove();
      });
    }, 5e3);
  }, addChatMessage:d,

  privateMessage:function(a) {
    console.log("privateMessage")
    console.log(a)
    if (a.type == "match_requested") {
      if (g.blocked_users.indexOf(a.match_request.proposed_by_id) == -1) {
        e(a.html);
      }
    } else if (a.type == "match_accepted") {
      window.location.href = "/g/" + a.game_token;
    } else if (a.type == "march_rejected") {
      e(a.html);
    }
  },

  replaceChatMessages:function(a) {
    $("#chat_output").html("");
    for (var b = 0; b < a.length; b++) {
      d(a[b]);
    }
  },

  acceptMatch:function(a) {
    window.location.href = "/match/accept/" + a;
  },

  rejectMatch:function(a) {
    $.post("/match/reject/" + a);
    b(a);
  },
  removeMatchNotification:b};
}();

Array.from = function(a) {
  for (var c = [], d = 0; d < a.length; d++) {
    c[d] = a[d];
  }
  return c;
};
Array.indexOf || (Array.prototype.indexOf = function(a) {
  for (var c = 0; c < this.length; c++) {
    if (this[c] == a) {
      return c;
    }
  }
  return -1;
});
Function.prototype.bind = function(a) {
  var c = this, d = Array.from(arguments).slice(1);
  return function() {
    return c.apply(a, d.concat(Array.from(arguments)));
  };
};

goshrine.Room = function() {
  this.init.apply(this, arguments);
};

goshrine.Room.prototype = {
init:function(room) {
  this.name             = room.name;
  this.room_id          = room.id;
  this.subscribed_users = [];

  a = $("#chat_output");
  a[0].scrollTop = a[0].scrollHeight - a.outerHeight();
  $(".online_player div a").live("click", function(a) {
    user_id = $(this).attr("data-id");
    new goshrine.MatchSettings(user_id, room.id);
    a.preventDefault();
  });

  this.refresh = function(callback) {
    this.refreshMemberListViaGET(function() {
      this.refreshChatMessages(callback);
    }.bind(this));
  };

  this.join = function() {
    goshrine.joinRoom(this.room_id, this.receiveRoomMessage.bind(this));
  }
},

receiveRoomMessage:function(a, v) {
  switch(a.action) {
    case "chat":
      goshrine.addChatMessage(a.msg);
      break;
    case "room_list":
      console.log("[message] room_list");
      this.refreshMemberList(a.list);
      console.log("[message/] room_list");
      break;
    case "user_arrive":
      console.log("[message] user_arrive: " + a.login)
      this.userArrived(a);
      break;
    case "user_leave":
      this.userLeft(a);
      break;
    case "game_started":
      this.gameStarted(a.html);
      goshrine.addChatMessage(a.game);
      break;
    case "game_finished":
      this.gameFinished(a.game.token, a.html);
  }
}, gameStarted:function(a) {
  $("#room_game_list").prepend(a);
  $("#room_game_list").children("li:last").remove();
}, gameFinished:function(a, c) {
  $("#game_" + a).replaceWith(c);
},

userArrived:function(a) {
  var c = "guest" != currentUser && 0 <= currentUser.blocked_users.indexOf(a.id),
      d = "guest" != currentUser && 0 <= currentUser.blocked_by_users.indexOf(a.id);

  d = $("#member_template").jqote({user:a, currentUser:currentUser, room:this, blocker:d, blocked:c}, ":");

  /* If the player is already there, remove it from the DOM.  We will reinsert
   * the player after his/her rating has been determined.
   */
  var online_player = $(".online_player[data-player-id='" + a.id + "']");
  if (online_player.length > 0) {
    console.log("    removing " + a.login + " from the players list");
    online_player.remove();
  }

  c = null;
  for (var b = null != a.whr_elo ? a.whr_elo : -9999, e = 0; e < this.subscribed_users.length; e++) {
    var f = this.subscribed_users[e];
    if ((null != f.whr_elo ? f.whr_elo : -9999) <= b) {
      c = e;
      break;
    }
  }
  d = $(d);

//  if (c == null) {
    $(".online_players ul").append(d);
    this.subscribed_users.push(a);
//  } else {
//    ($("#room_member_" + this.subscribed_users[c].id).before(d), this.subscribed_users.splice(c, 0, a))
//  }

  d.hide().slideDown("slow");
},

userLeft:function(a) {
  console.log("userLeft event: " + a.login);
  for (var c = 0, d = 0; d < this.subscribed_users.length; d++) {
    if (this.subscribed_users[d].id == a.id) {
      c = d;
      break;
    }
  }
  null != c && ($("#room_member_" + a.id).hide("slow", function() {
    $(this).remove();
  }), this.subscribed_users.splice(c, 1));
},

sendChatMsg:function() {
  goshrine.sendChatMsg(this.room_id, $("#room_chat_input")[0].value);
  $("#room_chat_input")[0].value = "";
},

  refreshChatMessages:function(callback) {
    $.getJSON("/rooms/messages/" + this.room_id, null, function(a) {
      goshrine.replaceChatMessages(a);
      typeof callback === 'function' && callback();
    }.bind(this));
  },

  refreshMemberList:function(users) {
      let user_ids_cur = this.subscribed_users.map(function (user) { return user.id; });
          user_ids_cur = new Set(user_ids_cur);
      let user_ids_new = users.map(function (user) { return user.id; });
          user_ids_new = new Set(user_ids_new);

      // Users that are already tracked, so we check if any left.
      this.subscribed_users.forEach(function(user) {
        console.log("subscribed: " + user.login);
        if (!user_ids_new.has(user.id))
          this.userLeft(user);
      }.bind(this));

      // Users that aren't tracked, so these are new arrivals.
      users.forEach(function(user) {
        console.log("new: " + user.login);
        if (!user_ids_cur.has(user.id))
          this.userArrived(user);
      }.bind(this));
//      typeof callback === 'function' && callback();
  },

  refreshMemberListViaGET:function(callback) {
    $.getJSON("/rooms/members/" + this.room_id, null, function(users) {
      this.refreshMemberList(users);
      typeof callback === 'function' && callback();
    }.bind(this));
  }
};

goshrine.MatchSettings = function() {
  this.init.apply(this, arguments);
};
goshrine.MatchSettings.prototype = {init:function(a, c) {
  this.user_id = a;
  this.dlg = $("#match_proposal_dialog")[0];
  $("#propose_match_" + this.user_id).css("display", "none");
  $("#match_proposal_dialog").dialog({title:"Game Proposal", buttons:{"Propose Game":this.submit.bind(this)}, autoOpen:!1, close:this.close.bind(this)});
  $("#match_proposal_dialog").load("/match/create", {challenged_player_id:a, room_id:c}, this.afterLoad.bind(this));
}, afterLoad:function() {
  $("#byoYomiHelp", this.dlg).each(function() {
    $(this).qtip({content:$(this).attr("help_text"), position:{corner:{tooltip:"bottomLeft", target:"topRight"}, adjust:{y:-10}}, style:{border:{width:5, radius:10}, padding:10, textAlign:"center", tip:!0, name:"cream"}});
  });
  $(".black_player_id", this.dlg).bind("change", function() {
    $(".white_player_id", this.dlg)[0].selectedIndex = 0 == $(".black_player_id", this.dlg)[0].selectedIndex ? 1 : 0;
  }.bind(this));
  $(".white_player_id", this.dlg).bind("change", function() {
    $(".black_player_id", this.dlg)[0].selectedIndex = 0 == $(".white_player_id", this.dlg)[0].selectedIndex ? 1 : 0;
  }.bind(this));
  $(".timed", this.dlg).bind("click", function() {
    $(".timed", this.dlg)[0].checked ? ($("input.time_param", this.dlg).attr("disabled", !1), $("label.time_param", this.dlg).removeClass("disabled")) : ($("input.time_param", this.dlg).attr("disabled", !0), $("label.time_param", this.dlg).addClass("disabled"));
  }.bind(this));
  $(this.dlg).dialog("open");
}, submit:function() {
  var a = $("form", this.dlg).serialize();
  $.getJSON("/match/propose", a, function(a) {
    if (a.errors) {
      for (var c = 0; c < a.errors.length; c++) {
        goshrine.showTemporaryMessage("" + a.errors[c]);
      }
    } else {
      goshrine.showTemporaryMessage(a.result);
    }
  });
  $(this.dlg).dialog("close");
}, close:function() {
  $("#propose_match_" + this.user_id).css("display", "");
  $(this.dlg).dialog("destroy");
}};
Array.prototype.contains = function(a) {
  if (Array.prototype.indexOf) {
    return -1 != this.indexOf(a);
  }
  for (var c in this) {
    if (this[c] == a) {
      return !0;
    }
  }
  return !1;
};
Array.prototype.setLength = function(a, c) {
  c = "undefined" != typeof c ? c : null;
  for (var d = 0; d < a; d++) {
    this[d] = c;
  }
  return this;
};
Array.prototype.addDimension = function(a, c) {
  c = "undefined" != typeof c ? c : null;
  for (var d = this.length, b = 0; b < d; b++) {
    this[b] = [].setLength(a, c);
  }
  return this;
};
Array.prototype.first = function() {
  return this[0];
};
Array.prototype.last = function() {
  return this[this.length - 1];
};
Array.prototype.copy = function() {
  for (var a = [], c = this.length, d = 0; d < c; d++) {
    this[d] instanceof Array ? a[d] = this[d].copy() : a[d] = this[d];
  }
  return a;
};
Array.prototype.map || (Array.prototype.map = function(a, c) {
  var d = this.length;
  if ("function" != typeof a) {
    throw new TypeError;
  }
  for (var b = Array(d), e = 0; e < d; e++) {
    e in this && (b[e] = a.call(c, this[e], e, this));
  }
  return b;
});
Array.prototype.filter || (Array.prototype.filter = function(a, c) {
  var d = this.length;
  if ("function" != typeof a) {
    throw new TypeError;
  }
  for (var b = [], e = 0; e < d; e++) {
    if (e in this) {
      var f = this[e];
      a.call(c, f, e, this) && b.push(f);
    }
  }
  return b;
});
Array.prototype.forEach || (Array.prototype.forEach = function(a, c) {
  var d = this.length;
  if ("function" != typeof a) {
    throw new TypeError;
  }
  for (var b = 0; b < d; b++) {
    b in this && a.call(c, this[b], b, this);
  }
});
Array.prototype.every || (Array.prototype.every = function(a, c) {
  var d = this.length;
  if ("function" != typeof a) {
    throw new TypeError;
  }
  for (var b = 0; b < d; b++) {
    if (b in this && !a.call(c, this[b], b, this)) {
      return !1;
    }
  }
  return !0;
});
Array.prototype.some || (Array.prototype.some = function(a, c) {
  var d = this.length;
  if ("function" != typeof a) {
    throw new TypeError;
  }
  for (var b = 0; b < d; b++) {
    if (b in this && a.call(c, this[b], b, this)) {
      return !0;
    }
  }
  return !1;
});
Array.from = function(a) {
  for (var c = [], d = 0; d < a.length; d++) {
    c[d] = a[d];
  }
  return c;
};
Function.prototype.bind = function(a) {
  var c = this, d = Array.from(arguments).slice(1);
  return function() {
    return c.apply(a, d.concat(Array.from(arguments)));
  };
};
eidogo = window.eidogo || {};
(function() {
  var a = navigator.userAgent.toLowerCase(), c = (a.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1];
  eidogo.browser = {ua:a, ver:c, ie:/msie/.test(a) && !/opera/.test(a), moz:/mozilla/.test(a) && !/(compatible|webkit)/.test(a), safari3:/webkit/.test(a) && 420 <= parseInt(c, 10)};
  eidogo.util = {byId:function(a) {
    return document.getElementById(a);
  }, makeQueryString:function(a) {
    var b = "";
    if (a && "object" == typeof a) {
      b = [];
      for (var c in a) {
        if (a[c] && a[c].constructor == Array) {
          for (var d = 0; d < a[c].length; d++) {
            b.push(encodeURIComponent(c) + "=" + encodeURIComponent(a[c]));
          }
        } else {
          b.push(encodeURIComponent(c) + "=" + encodeURIComponent(a[c]));
        }
      }
      b = b.join("&").replace(/%20/g, "+");
    }
    return b;
  }, ajax:function(a, b, c, f, g, l, k) {
    function d(a) {
      if (!u && e && (4 == e.readyState || "timeout" == a)) {
        u = !0;
        p && (clearInterval(p), p = null);
        if (!(a = "timeout" == a && "timeout")) {
          a: {
            try {
              var b = !e.status && "file:" == location.protocol || 200 <= e.status && 300 > e.status || 304 == e.status || m && void 0 == e.status;
              break a;
            } catch (A) {
            }
            b = !1;
          }
          a = !b && "error";
        }
        "success" == (a || "success") ? f.call(l, e) : g.call(l);
        e = null;
      }
    }
    a = a.toUpperCase();
    var e = window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest;
    (c = c && "object" == typeof c ? eidogo.util.makeQueryString(c) : null) && "GET" == a && (b += (b.match(/\?/) ? "&" : "?") + c, c = null);
    e.open(a, b, !0);
    c && e.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    var u = !1, m = /webkit/.test(navigator.userAgent.toLowerCase()), p = setInterval(d, 13);
    return k && setTimeout(function() {
      e && (e.abort(), u || d("timeout"));
    }, k), e.send(c), e;
  }, addEventHelper:function(a, b, c) {
    if (a.addEventListener) {
      a.addEventListener(b, c, !1);
    } else {
      eidogo.util.addEventId || (eidogo.util.addEventId = 1);
      c.$$guid || (c.$$guid = eidogo.util.addEventId++);
      a.events || (a.events = {});
      var d = a.events[b];
      d || (d = a.events[b] = {}, a["on" + b] && (d[0] = a["on" + b]));
      d[c.$$guid] = c;
      a["on" + b] = eidogo.util.handleEvent;
    }
  }, handleEvent:function(a) {
    var b = !0;
    a = a || ((this.ownerDocument || this.document || this).parentWindow || window).event;
    var c = this.events[a.type], d;
    for (d in c) {
      this.$$handleEvent = c[d], !1 === this.$$handleEvent(a) && (b = !1);
    }
    return b;
  }, addEvent:function(a, b, c, f, g) {
    if (a) {
      if (g) {
        c = c.bind(f);
      } else {
        if (f) {
          var d = c;
          c = function(a) {
            d(a, f);
          };
        }
      }
      eidogo.util.addEventHelper(a, b, c);
    }
  }, onClick:function(a, b, c) {
    eidogo.util.addEvent(a, "click", b, c, !0);
  }, getElClickXY:function(a, b, c) {
    var d = b.ownerDocument;
    a.pageX || (a.pageX = a.clientX + (d.documentElement.scrollLeft || d.body.scrollLeft), a.pageY = a.clientY + (d.documentElement.scrollTop || d.body.scrollTop));
    b = eidogo.util.getElXY(b, c);
    return [a.pageX - b[0], a.pageY - b[1]];
  }, stopEvent:function(a) {
    a && (a.stopPropagation ? a.stopPropagation() : a.cancelBubble = !0, a.preventDefault ? a.preventDefault() : a.returnValue = !1);
  }, getTarget:function(a) {
    return (a = a.target || a.srcElement) && a.nodeName && "#TEXT" == a.nodeName.toUpperCase() ? a.parentNode : a;
  }, addClass:function(a, b) {
    if (b) {
      b = b.split(/\s+/);
      for (var c = 0; c < b.length; c++) {
        eidogo.util.hasClass(a, b[c]) || (a.className += (a.className ? " " : "") + b[c]);
      }
    }
  }, removeClass:function(a, b) {
    for (var c = a.className.split(/\s+/), d = [], g = 0; g < c.length; g++) {
      c[g] != b && d.push(c[g]);
    }
    a.className = d.join(" ");
  }, hasClass:function(a, b) {
    a = a.className.split(/\s+/);
    for (var c = 0; c < a.length; c++) {
      if (a[c] == b) {
        return !0;
      }
    }
    return !1;
  }, show:function(a, b) {
    b = b || "block";
    "string" == typeof a && (a = eidogo.util.byId(a));
    a && (a.style.display = b);
  }, hide:function(a) {
    "string" == typeof a && (a = eidogo.util.byId(a));
    a && (a.style.display = "none");
  }, getElXY:function(a, b) {
    var c = a, d = 0, g = 0, l = a.parentNode, k = 0, n = 0, q = a.ownerDocument;
    if (a.getBoundingClientRect) {
      a = a.getBoundingClientRect(), d = a.left + Math.max(q.documentElement.scrollLeft, q.body.scrollLeft), g = a.top + Math.max(q.documentElement.scrollTop, q.body.scrollTop);
    } else {
      for (; c;) {
        d += c.offsetLeft, g += c.offsetTop, c = c.offsetParent ? c.offsetParent : null;
      }
      for (; !b && l && l.tagName && !/^body|html$/i.test(l.tagName);) {
        k += l.scrollLeft, n += l.scrollTop, d -= l.scrollLeft, g -= l.scrollTop, l = l.parentNode;
      }
    }
    return [d, g, k, n];
  }, getElX:function(a) {
    return this.getElXY(a)[0];
  }, getElY:function(a) {
    return this.getElXY(a)[1];
  }, addStyleSheet:function(a) {
    if (document.createStyleSheet) {
      document.createStyleSheet(a);
    } else {
      var b = document.createElement("link");
      b.rel = "stylesheet";
      b.type = "text/css";
      b.href = a;
      document.getElementsByTagName("head")[0].appendChild(b);
    }
  }, getPlayerPath:function() {
    for (var a = document.getElementsByTagName("script"), b, c, f = 0; c = a[f]; f++) {
      /(all\.compressed\.js|eidogo\.js)/.test(c.src) && (b = c.src.replace(/\/js\/[^\/]+$/, ""));
    }
    return b;
  }, numProperties:function(a) {
    var b = 0, c;
    for (c in a) {
      b++;
    }
    return b;
  }};
})();
eidogo = window.eidogo || {};
eidogo.i18n = eidogo.i18n || {move:"Move", loading:"Loading", passed:"passed", resigned:"resigned", variations:"Variations", "no variations":"none", tool:"Tool", view:"Jump to Move", play:"Play", region:"Select Region", add_b:"Black Stone", add_w:"White Stone", "edit comment":"Edit Comment", "edit game info":"Edit Game Info", done:"Done", triangle:"Triangle", square:"Square", circle:"Circle", x:"X", letter:"Letter", number:"Number", label:"Custom Label", dim:"Dim", clear:"Clear Marker", score:"Score", 
"score est":"Score Estimate", search:"Search", "search corner":"Corner Search", "search center":"Center Search", "region info":"Click and drag to select a region.", "two stones":"Please select at least two stones to search for.", "two edges":"For corner searches, your selection must touch two adjacent edges of the board.", "no search url":"No search URL provided.", "close search":"close search", "matches found":"matches found.", "show games":"Show pro games with this position", "save to server":"Save to Server", 
"download sgf":"Download SGF", "multi-game sgf":"Multi-game SGF: ", "next game":"Next Game", "previous game":"Previous Game", "end of variation":"End of variation", white:"White", "white rank":"White rank", "white team":"White team", black:"Black", "black rank":"Black rank", "black team":"Black team", captures:"captures", "time left":"time left", you:"You", game:"Game", handicap:"Handicap", komi:"Komi", result:"Result", date:"Date", info:"Info", place:"Place", event:"Event", round:"Round", overtime:"Overtime", 
opening:"Openning", ruleset:"Ruleset", annotator:"Annotator", copyright:"Copyright", source:"Source", "time limit":"Time limit", transcriber:"Transcriber", "created with":"Created with", january:"January", february:"February", march:"March", april:"April", may:"May", june:"June", july:"July", august:"August", september:"September", october:"October", november:"November", december:"December", gw:"Good for White", vgw:"Very good for White", gb:"Good for Black", vgb:"Very good for Black", dm:"Even position", 
dmj:"Even position (joseki)", uc:"Unclear position", te:"Tesuji", bm:"Bad move", vbm:"Very bad move", "do":"Doubtful move", it:"Interesting move", "black to play":"Black to play", "white to play":"White to play", ho:"Hotspot", "confirm delete":"You've removed all properties from this position.\n\nDelete this position and all sub-positions?", "position deleted":"Position deleted", "dom error":"Error finding DOM container", "error retrieving":"There was a problem retrieving the game data.", "invalid data":"Received invalid game data", 
"error board":"Error loading board container", "unsaved changes":"There are unsaved changes in this game. You must save before you can permalink or download.", "bad path":"Don't know how to get to path: ", "gnugo thinking":"GNU Go is thinking..."};
eidogo.gameNodeIdCounter = 1E5;
eidogo.GameNode = function() {
  this.init.apply(this, arguments);
};
eidogo.GameNode.prototype = {init:function(a, c, d) {
  this._id = "undefined" != typeof d ? d : eidogo.gameNodeIdCounter++;
  this._parent = a || null;
  this._children = [];
  this._preferredChild = 0;
  c && this.loadJson(c);
}, pushProperty:function(a, c) {
  this[a] ? (this[a] instanceof Array || (this[a] = [this[a]]), this[a].contains(c) || this[a].push(c)) : this[a] = c;
}, hasPropertyValue:function(a, c) {
  return this[a] ? (this[a] instanceof Array ? this[a] : [this[a]]).contains(c) : !1;
}, deletePropertyValue:function(a, c) {
  for (var d = c instanceof RegExp ? function(a) {
    return c.test(a);
  } : function(a) {
    return c == a;
  }, b = a instanceof Array ? a : [a], e = 0; a = b[e]; e++) {
    this[a] instanceof Array ? (this[a] = this[a].filter(function(a) {
      return !d(a);
    }), this[a].length || delete this[a]) : d(this.prop) && delete this[a];
  }
}, loadJson:function(a) {
  a = [a];
  for (var c = [this], d, b, e, f; a.length;) {
    for (d = a.pop(), b = c.pop(), b.loadJsonNode(d), f = d._children ? d._children.length : 0, e = 0; e < f; e++) {
      a.push(d._children[e]), b._children[e] || (b._children[e] = new eidogo.GameNode(b)), c.push(b._children[e]);
    }
  }
}, loadJsonNode:function(a) {
  for (var c in a) {
    "_id" == c ? (this[c] = a[c].toString(), eidogo.gameNodeIdCounter = Math.max(eidogo.gameNodeIdCounter, parseInt(a[c], 10))) : "_" != c.charAt(0) && (this[c] = a[c]);
  }
}, appendChild:function(a) {
  a._parent = this;
  this._children.push(a);
}, getProperties:function() {
  var a = {}, c;
  for (c in this) {
    isPrivate = "_" == c.charAt(0);
    var d = "string" == typeof this[c];
    var b = this[c] instanceof Array;
    !isPrivate && (d || b) && (a[c] = this[c]);
  }
  return a;
}, walk:function(a, c) {
  for (var d = [this], b, e, f; d.length;) {
    for (b = d.pop(), a.call(c || this, b), f = b._children ? b._children.length : 0, e = 0; e < f; e++) {
      d.push(b._children[e]);
    }
  }
}, getMove:function() {
  return "undefined" != typeof this.W ? this.W : "undefined" != typeof this.B ? this.B : null;
}, isPass:function() {
  var a = this.getMove();
  return "tt" == a || "" == a;
}, emptyPoint:function(a) {
  var c = this.getProperties(), d = null, b;
  for (b in c) {
    "AW" == b || "AB" == b || "AE" == b ? (this[b] instanceof Array || (this[b] = [this[b]]), this[b] = this[b].filter(function(b) {
      return b == a ? (d = b, !1) : !0;
    }), this[b].length || delete this[b]) : ("B" == b || "W" == b) && this[b] == a && (d = this[b], delete this[b]);
  }
  return d;
}, getPosition:function() {
  if (!this._parent) {
    return null;
  }
  for (var a = this._parent._children, c = 0; c < a.length; c++) {
    if (a[c]._id == this._id) {
      return c;
    }
  }
  return null;
}, toSgf:function() {
  function a(a) {
    if (!a) {
      return "";
    }
    var b = ";", c, d;
    for (c in a) {
      a[c] instanceof Array ? d = a[c].map(function(a) {
        return a.toString().replace(/\]/g, "\\]");
      }).join("][") : d = a[c].toString().replace(/\]/g, "\\]"), b += c + "[" + d + "]";
    }
    return b;
  }
  var c = this._parent ? "(" : "", d = this;
  for (c += a(d.getProperties()); 1 == d._children.length;) {
    d = d._children[0], c += a(d.getProperties());
  }
  for (var b = 0; b < d._children.length; b++) {
    c += d._children[b].toSgf();
  }
  return c += this._parent ? ")" : "", c;
}};
eidogo.GameCursor = function() {
  this.init.apply(this, arguments);
};
eidogo.GameCursor.prototype = {init:function(a) {
  this.node = a;
}, next:function(a) {
  return this.hasNext() ? (a = "undefined" == typeof a || null == a ? this.node._preferredChild : a, this.node._preferredChild = a, this.node = this.node._children[a], !0) : !1;
}, previous:function() {
  return this.hasPrevious() ? (this.node = this.node._parent, !0) : !1;
}, hasNext:function() {
  return this.node && this.node._children.length;
}, hasPrevious:function() {
  return this.node && this.node._parent && this.node._parent._parent;
}, getNextMoves:function() {
  if (!this.hasNext()) {
    return null;
  }
  var a = {}, c, d;
  for (c = 0; d = this.node._children[c]; c++) {
    a[d.getMove()] = c;
  }
  return a;
}, getNextColor:function() {
  if (!this.hasNext()) {
    return null;
  }
  var a, c;
  for (a = 0; c = this.node._children[a]; a++) {
    if (c.W || c.B) {
      return c.W ? "W" : "B";
    }
  }
  return null;
}, getNextNodeWithVariations:function() {
  for (var a = this.node; 1 == a._children.length;) {
    a = a._children[0];
  }
  return a;
}, getPath:function() {
  for (var a = this.node, c = [], d = 0; a && a._parent && 1 == a._parent._children.length && a._parent._parent;) {
    d++, a = a._parent;
  }
  for (c.push(d); a;) {
    a._parent && (1 < a._parent._children.length || !a._parent._parent) && c.push(a.getPosition() || 0), a = a._parent;
  }
  return c.reverse();
}, getPathMoves:function() {
  var a = [], c = new eidogo.GameCursor(this.node);
  for (a.push(c.node.getMove()); c.previous();) {
    var d = c.node.getMove();
    d && a.push(d);
  }
  return a.reverse();
}, getMoveNumber:function() {
  for (var a = 0, c = this.node; c;) {
    (c.W || c.B) && a++, c = c._parent;
  }
  return a;
}, getGameRoot:function() {
  if (!this.node) {
    return null;
  }
  var a = new eidogo.GameCursor(this.node);
  if (!this.node._parent && this.node._children.length) {
    return this.node._children[0];
  }
  for (; a.previous();) {
  }
  return a.node;
}};
eidogo.SgfParser = function() {
  this.init.apply(this, arguments);
};
eidogo.SgfParser.prototype = {init:function(a, c) {
  c = "function" == typeof c ? c : null;
  this.sgf = a;
  this.index = 0;
  this.root = {_children:[]};
  this.parseTree(this.root);
  c && c.call(this);
}, parseTree:function(a) {
  for (; this.index < this.sgf.length;) {
    var c = this.curChar();
    this.index++;
    switch(c) {
      case ";":
        a = this.parseNode(a);
        break;
      case "(":
        this.parseTree(a);
        break;
      case ")":
        return;
    }
  }
}, parseNode:function(a) {
  var c = {_children:[]};
  return a ? a._children.push(c) : this.root = c, c = this.parseProperties(c), c;
}, parseProperties:function(a) {
  for (var c = "", d = [], b = 0; this.index < this.sgf.length;) {
    var e = this.curChar();
    if (";" == e || "(" == e || ")" == e) {
      break;
    }
    if ("[" == this.curChar()) {
      for (; "[" == this.curChar();) {
        this.index++;
        for (d[b] = ""; "]" != this.curChar() && this.index < this.sgf.length;) {
          if ("\\" == this.curChar()) {
            for (this.index++; "\r" == this.curChar() || "\n" == this.curChar();) {
              this.index++;
            }
          }
          d[b] += this.curChar();
          this.index++;
        }
        for (b++; "]" == this.curChar() || "\n" == this.curChar() || "\r" == this.curChar();) {
          this.index++;
        }
      }
      a[c] ? (a[c] instanceof Array || (a[c] = [a[c]]), a[c] = a[c].concat(d)) : a[c] = 1 < d.length ? d : d[0];
      c = "";
      d = [];
      b = 0;
    } else {
      " " != e && "\n" != e && "\r" != e && "\t" != e && (c += e), this.index++;
    }
  }
  return a;
}, curChar:function() {
  return this.sgf.charAt(this.index);
}};
eidogo.Board = function() {
  this.init.apply(this, arguments);
};
eidogo.Board.prototype = {WHITE:1, BLACK:-1, EMPTY:0, init:function(a, c) {
  this.boardSize = c || 19;
  this.stones = this.makeBoardArray(this.EMPTY);
  this.markers = this.makeBoardArray(this.EMPTY);
  this.captures = {};
  this.captures.W = 0;
  this.captures.B = 0;
  this.cache = [];
  this.renderer = a || new eidogo.BoardRendererHtml;
  this.lastRender = {stones:this.makeBoardArray(null), markers:this.makeBoardArray(null)};
}, reset:function() {
  this.init(this.renderer, this.boardSize);
}, clear:function() {
  this.clearStones();
  this.clearMarkers();
  this.clearCaptures();
}, clearStones:function() {
  for (var a = 0; a < this.stones.length; a++) {
    this.stones[a] = this.EMPTY;
  }
}, clearMarkers:function() {
  for (var a = 0; a < this.markers.length; a++) {
    this.markers[a] = this.EMPTY;
  }
}, clearCaptures:function() {
  this.captures.W = 0;
  this.captures.B = 0;
}, makeBoardArray:function(a) {
  return [].setLength(this.boardSize * this.boardSize, a);
}, commit:function() {
  this.cache.push({stones:this.stones.concat(), captures:{W:this.captures.W, B:this.captures.B}});
}, rollback:function() {
  this.cache.last() ? (this.stones = this.cache.last().stones.concat(), this.captures.W = this.cache.last().captures.W, this.captures.B = this.cache.last().captures.B) : this.clear();
}, revert:function(a) {
  a = a || 1;
  this.rollback();
  for (var c = 0; c < a; c++) {
    this.cache.pop();
  }
  this.rollback();
}, addStone:function(a, c) {
  this.stones[a.y * this.boardSize + a.x] = c;
}, getStone:function(a) {
  return this.stones[a.y * this.boardSize + a.x];
}, getRegion:function(a, c, d, b) {
  for (var e = [].setLength(d * b, this.EMPTY), f, g = a; g < a + b; g++) {
    for (var l = c; l < c + d; l++) {
      f = (g - a) * d + (l - c), e[f] = this.getStone({x:l, y:g});
    }
  }
  return e;
}, addMarker:function(a, c) {
  this.markers[a.y * this.boardSize + a.x] = c;
}, getMarker:function(a) {
  return this.markers[a.y * this.boardSize + a.x];
}, render:function(a) {
  var c = this.makeBoardArray(null);
  this.makeBoardArray(null);
  var d;
  if (!a && this.cache.last()) {
    var b = this.cache.last();
    a = this.stones.length;
    for (var e = 0; e < a; e++) {
      b.stones[e] != this.lastRender.stones[e] && (c[e] = b.stones[e]);
    }
  } else {
    c = this.stones;
  }
  a = this.markers;
  for (e = 0; e < this.boardSize; e++) {
    for (var f = 0; f < this.boardSize; f++) {
      b = f * this.boardSize + e, null != a[b] && (this.renderer.renderMarker({x:e, y:f}, a[b]), this.lastRender.markers[b] = a[b]), null != c[b] && (c[b] == this.EMPTY ? d = "empty" : d = c[b] == this.WHITE ? "white" : "black", this.renderer.renderStone({x:e, y:f}, d), this.lastRender.stones[b] = c[b]);
    }
  }
}};
eidogo.BoardRendererHtml = function() {
  this.init.apply(this, arguments);
};
eidogo.BoardRendererHtml.prototype = {init:function(a, c, d, b) {
  if (!a) {
    throw "No DOM container";
  }
  this.boardSize = c || 19;
  c = document.createElement("div");
  c.className = "board-gutter" + (19 == this.boardSize ? " with-coords" : "");
  a.appendChild(c);
  var e = document.createElement("div");
  e.className = "board size" + this.boardSize;
  e.style.position = b && eidogo.browser.ie ? "static" : "relative";
  c.appendChild(e);
  this.domNode = e;
  this.domGutter = c;
  this.domContainer = a;
  this.player = d;
  this.uniq = a.id + "-";
  this.renderCache = {stones:[].setLength(this.boardSize, 0).addDimension(this.boardSize, 0), markers:[].setLength(this.boardSize, 0).addDimension(this.boardSize, 0)};
  this.margin = this.pointHeight = this.pointWidth = 0;
  this.pointWidth = this.pointHeight = this.renderStone({x:0, y:0}, "black").offsetWidth;
  this.renderStone({x:0, y:0}, "white");
  this.renderMarker({x:0, y:0}, "current");
  this.clear();
  this.margin = (this.domNode.offsetWidth - this.boardSize * this.pointWidth) / 2;
  this.scrollY = this.scrollX = 0;
  if (b && (this.crop(b), eidogo.browser.ie)) {
    for (a = this.domNode.parentNode; a && a.tagName && !/^body|html$/i.test(a.tagName);) {
      this.scrollX += a.scrollLeft, this.scrollY += a.scrollTop, a = a.parentNode;
    }
  }
  this.dom = {};
  this.dom.searchRegion = document.createElement("div");
  this.dom.searchRegion.id = this.uniq + "search-region";
  this.dom.searchRegion.className = "search-region";
  this.domNode.appendChild(this.dom.searchRegion);
  eidogo.util.addEvent(this.domNode, "mousemove", this.handleHover, this, !0);
  eidogo.util.addEvent(this.domNode, "mousedown", this.handleMouseDown, this, !0);
  eidogo.util.addEvent(this.domNode, "mouseup", this.handleMouseUp, this, !0);
}, showRegion:function(a) {
  this.dom.searchRegion.style.top = this.margin + this.pointHeight * a[0] + "px";
  this.dom.searchRegion.style.left = this.margin + this.pointWidth * a[1] + "px";
  this.dom.searchRegion.style.width = this.pointWidth * a[2] + "px";
  this.dom.searchRegion.style.height = this.pointHeight * a[3] + "px";
  eidogo.util.show(this.dom.searchRegion);
}, hideRegion:function() {
  eidogo.util.hide(this.dom.searchRegion);
}, clear:function() {
  this.domNode.innerHTML = "";
}, renderStone:function(a, c) {
  var d = document.getElementById(this.uniq + "stone-" + a.x + "-" + a.y);
  d && d.parentNode.removeChild(d);
  if ("empty" != c) {
    d = document.createElement("div");
    d.id = this.uniq + "stone-" + a.x + "-" + a.y;
    d.className = "point stone " + c;
    try {
      d.style.left = a.x * this.pointWidth + this.margin - this.scrollX + "px", d.style.top = a.y * this.pointHeight + this.margin - this.scrollY + "px";
    } catch (b) {
    }
    return this.domNode.appendChild(d), d;
  }
  return null;
}, renderMarker:function(a, c) {
  if (this.renderCache.markers[a.x][a.y]) {
    var d = document.getElementById(this.uniq + "marker-" + a.x + "-" + a.y);
    d && d.parentNode.removeChild(d);
  }
  if ("empty" == c || !c) {
    return this.renderCache.markers[a.x][a.y] = 0, null;
  }
  this.renderCache.markers[a.x][a.y] = 1;
  if (c) {
    d = "";
    switch(c) {
      case "triangle":
      case "square":
      case "circle":
      case "ex":
      case "territory-white":
      case "territory-black":
      case "dim":
      case "current":
        break;
      default:
        0 == c.indexOf("var:") ? (d = c.substring(4), c = "variation") : (d = c, c = "label");
    }
    var b = document.createElement("div");
    b.id = this.uniq + "marker-" + a.x + "-" + a.y;
    b.className = "point marker " + c;
    try {
      b.style.left = a.x * this.pointWidth + this.margin - this.scrollX + "px", b.style.top = a.y * this.pointHeight + this.margin - this.scrollY + "px";
    } catch (e) {
    }
    return b.appendChild(document.createTextNode(d)), this.domNode.appendChild(b), b;
  }
  return null;
}, setCursor:function(a) {
  this.domNode.style.cursor = a;
}, handleHover:function(a) {
  var c = this.getXY(a);
  this.player.handleBoardHover(c[0], c[1], c[2], c[3], a);
}, handleMouseDown:function(a) {
  var c = this.getXY(a);
  this.player.handleBoardMouseDown(c[0], c[1], c[2], c[3], a);
}, handleMouseUp:function(a) {
  a = this.getXY(a);
  this.player.handleBoardMouseUp(a[0], a[1]);
}, getXY:function(a) {
  a = eidogo.util.getElClickXY(a, this.domNode);
  var c = this.margin, d = this.pointWidth, b = this.pointHeight;
  return [Math.round((a[0] - c - d / 2) / d), Math.round((a[1] - c - b / 2) / b), a[0], a[1]];
}, crop:function(a) {
  eidogo.util.addClass(this.domContainer, "shrunk");
  this.domGutter.style.overflow = "hidden";
  var c = a.width * this.pointWidth + 2 * this.margin, d = a.height * this.pointHeight + 2 * this.margin;
  this.domGutter.style.width = c + "px";
  this.domGutter.style.height = d + "px";
  this.player.dom.player.style.width = c + "px";
  this.domGutter.scrollLeft = a.left * this.pointWidth;
  this.domGutter.scrollTop = a.top * this.pointHeight;
}};
eidogo.BoardRendererFlash = function() {
  this.init.apply(this, arguments);
};
eidogo.BoardRendererFlash.prototype = {init:function(a, c, d, b) {
  if (!a) {
    throw "No DOM container";
  }
  this.ready = !1;
  this.swf = null;
  this.unrendered = [];
  var e = a.id + "-board";
  b = new SWFObject(eidogo.playerPath + "/swf/board.swf", e, "421", "421", "8", "#665544");
  b.addParam("allowScriptAccess", "sameDomain");
  b.write(a);
  var f = 0;
  (function() {
    if ((swf = eidogo.util.byId(e)) && swf.init) {
      this.swf = swf, this.swf.init(d.uniq, c), this.ready = !0;
    } else {
      if (2E3 < f) {
        throw "Error initializing board";
      }
      setTimeout(arguments.callee.bind(this), 10);
      f += 10;
    }
  }).call(this);
}, showRegion:function(a) {
}, hideRegion:function() {
}, clear:function() {
  this.swf && this.swf.clear();
}, renderStone:function(a, c) {
  if (this.swf) {
    for (var d = 0; d < this.unrendered.length; d++) {
      "stone" == this.unrendered[d][0] && this.swf.renderStone(this.unrendered[d][1], this.unrendered[d][2]);
    }
    this.unrendered = [];
    this.swf.renderStone(a, c);
  } else {
    this.unrendered.push(["stone", a, c]);
  }
}, renderMarker:function(a, c) {
  if (c) {
    if (this.swf) {
      for (var d = 0; d < this.unrendered.length; d++) {
        "marker" == this.unrendered[d][0] && this.swf.renderMarker(this.unrendered[d][1], this.unrendered[d][2]);
      }
      this.unrendered = [];
      this.swf.renderMarker(a, c);
    } else {
      this.unrendered.push(["marker", a, c]);
    }
  }
}, setCursor:function(a) {
}, crop:function() {
}};
eidogo.BoardRendererAscii = function(a, c) {
  this.init(a, c);
};
eidogo.BoardRendererAscii.prototype = {pointWidth:2, pointHeight:1, margin:1, blankBoard:"+-------------------------------------+\n|. . . . . . . . . . . . . . . . . . .|\n|. . . . . . . . . . . . . . . . . . .|\n|. . . . . . . . . . . . . . . . . . .|\n|. . . . . . . . . . . . . . . . . . .|\n|. . . . . . . . . . . . . . . . . . .|\n|. . . . . . . . . . . . . . . . . . .|\n|. . . . . . . . . . . . . . . . . . .|\n|. . . . . . . . . . . . . . . . . . .|\n|. . . . . . . . . . . . . . . . . . .|\n|. . . . . . . . . . . . . . . . . . .|\n|. . . . . . . . . . . . . . . . . . .|\n|. . . . . . . . . . . . . . . . . . .|\n|. . . . . . . . . . . . . . . . . . .|\n|. . . . . . . . . . . . . . . . . . .|\n|. . . . . . . . . . . . . . . . . . .|\n|. . . . . . . . . . . . . . . . . . .|\n|. . . . . . . . . . . . . . . . . . .|\n|. . . . . . . . . . . . . . . . . . .|\n|. . . . . . . . . . . . . . . . . . .|\n+-------------------------------------+", 
init:function(a, c) {
  this.domNode = a || null;
  this.boardSize = c || 19;
  this.content = this.blankBoard;
}, clear:function() {
  this.content = this.blankBoard;
  this.domNode.innerHTML = "<pre>" + this.content + "</pre>";
}, renderStone:function(a, c) {
  a = (this.pointWidth * this.boardSize + 2 * this.margin) * (a.y * this.pointHeight + 1) + a.x * this.pointWidth + 2;
  this.content = this.content.substring(0, a - 1) + "." + this.content.substring(a);
  "empty" != c && (this.content = this.content.substring(0, a - 1) + ("white" == c ? "O" : "#") + this.content.substring(a));
  this.domNode.innerHTML = "<pre>" + this.content + "</pre>";
}, renderMarker:function(a, c) {
}};
eidogo.renderers = {html:eidogo.BoardRendererHtml, flash:eidogo.BoardRendererFlash, ascii:eidogo.BoardRendererAscii};
eidogo.Rules = function(a) {
  this.init(a);
};
eidogo.Rules.prototype = {init:function(a) {
  this.board = a;
  this.pendingCaptures = [];
}, check:function(a, c) {
  return this.board.getStone(a) != this.board.EMPTY ? !1 : !0;
}, apply:function(a, c) {
  this.doCaptures(a, c);
}, doCaptures:function(a, c) {
  var d = 0 + this.doCapture({x:a.x - 1, y:a.y}, c);
  d += this.doCapture({x:a.x + 1, y:a.y}, c);
  d += this.doCapture({x:a.x, y:a.y - 1}, c);
  d += this.doCapture({x:a.x, y:a.y + 1}, c);
  d -= this.doCapture(a, -c);
  0 > d && (c = -c, d = -d);
  c = c == this.board.WHITE ? "W" : "B";
  this.board.captures[c] += d;
}, doCapture:function(a, c) {
  this.pendingCaptures = [];
  if (this.findCaptures(a, c)) {
    return 0;
  }
  for (a = this.pendingCaptures.length; this.pendingCaptures.length;) {
    this.board.addStone(this.pendingCaptures.pop(), this.board.EMPTY);
  }
  return a;
}, findCaptures:function(a, c) {
  if (0 > a.x || 0 > a.y || a.x >= this.board.boardSize || a.y >= this.board.boardSize || this.board.getStone(a) == c) {
    return 0;
  }
  if (this.board.getStone(a) == this.board.EMPTY) {
    return 1;
  }
  for (var d = 0; d < this.pendingCaptures.length; d++) {
    if (this.pendingCaptures[d].x == a.x && this.pendingCaptures[d].y == a.y) {
      return 0;
    }
  }
  return this.pendingCaptures.push(a), this.findCaptures({x:a.x - 1, y:a.y}, c) ? 1 : this.findCaptures({x:a.x + 1, y:a.y}, c) ? 1 : this.findCaptures({x:a.x, y:a.y - 1}, c) ? 1 : this.findCaptures({x:a.x, y:a.y + 1}, c) ? 1 : 0;
}};
(function() {
  var a = eidogo.i18n, c = eidogo.util.byId, d = eidogo.util.ajax, b = eidogo.util.addEvent, e = eidogo.util.onClick, f = eidogo.util.getElClickXY, g = eidogo.util.stopEvent, l = eidogo.util.addClass, k = eidogo.util.removeClass, n = eidogo.util.show, q = eidogo.util.hide, u = eidogo.browser.moz;
  eidogo.util.getPlayerPath();
  eidogo.players = eidogo.players || {};
  eidogo.delegate = function(a, b) {
    var c = eidogo.players[a];
    c[b].apply(c, Array.from(arguments).slice(2));
  };
  eidogo.Player = function() {
    this.init.apply(this, arguments);
  };
  eidogo.Player.prototype = {init:function(d) {
    d = d || {};
    this.gameState = d.gameState;
    this.gameVersion = d.gameVersion;
    this.mode = d.mode ? d.mode : "play";
    this.dom = d.dom || {};
    this.dom.container = "string" == typeof d.container ? c(d.container) : d.container;
    if (this.dom.container) {
      this.playerInfo = d.playerInfo;
      this.playerColor = d.playerColor;
      this.mainTime = d.mainTime;
      this.byoYomi = d.byoYomi;
      this.turnStartedAt = d.turnStartedAt;
      this.serverTimeOffset = d.serverTimeOffset;
      this.blackSecondsLeft = d.blackSecondsLeft;
      this.whiteSecondsLeft = d.whiteSecondsLeft;
      this.playSounds = d.playSounds;
      this.uniq = d.uniq || (new Date).getTime();
      this.game_id = d.game_id;
      eidogo.players[this.uniq] = this;
      this.sgfPath = d.sgfPath;
      this.searchUrl = d.searchUrl;
      this.showingSearch = !1;
      this.saveUrl = d.saveUrl;
      this.downloadUrl = d.downloadUrl;
      this.rules = d.rules;
      this.scoreEstUrl = d.scoreEstUrl;
      this.hooks = d.hooks || {};
      this.permalinkable = !!this.hooks.setPermalink;
      this.propertyHandlers = {W:this.playMove, B:this.playMove, KO:this.playMove, MN:this.setMoveNumber, AW:this.addStone, AB:this.addStone, AE:this.addStone, CR:this.addMarker, LB:this.addMarker, TR:this.addMarker, MA:this.addMarker, SQ:this.addMarker, TW:this.addMarker, TB:this.addMarker, DD:this.addMarker, PL:this.setColor, C:this.showComments, N:this.showAnnotation, GB:this.showAnnotation, GW:this.showAnnotation, DM:this.showAnnotation, HO:this.showAnnotation, UC:this.showAnnotation, V:this.showAnnotation, 
      BM:this.showAnnotation, DO:this.showAnnotation, IT:this.showAnnotation, TE:this.showAnnotation, BL:this.showTime, OB:this.showTime, WL:this.showTime, OW:this.showTime};
      this.infoLabels = {GN:a.game, PW:a.white, WR:a["white rank"], WT:a["white team"], PB:a.black, BR:a["black rank"], BT:a["black team"], HA:a.handicap, KM:a.komi, RE:a.result, DT:a.date, GC:a.info, PC:a.place, EV:a.event, RO:a.round, OT:a.overtime, ON:a.opening, RU:a.ruleset, AN:a.annotator, CP:a.copyright, SO:a.source, TM:a["time limit"], US:a.transcriber, AP:a["created with"]};
      this.months = [a.january, a.february, a.march, a.april, a.may, a.june, a.july, a.august, a.september, a.october, a.november, a.december];
      this.theme = d.theme;
      this.reset(d);
      this.renderer = d.renderer || "html";
      this.cropParams = null;
      if ((this.shrinkToFit = d.shrinkToFit) || d.cropWidth || d.cropHeight) {
        this.cropParams = {}, this.cropParams.width = d.cropWidth, this.cropParams.height = d.cropHeight, this.cropParams.left = d.cropLeft, this.cropParams.top = d.cropTop, this.cropParams.padding = d.cropPadding || 1;
      }
      this.constructDom();
      $("#undo_dialog").dialog({title:"Undo Requested", buttons:{Allow:this.acceptUndo.bind(this), Deny:this.rejectUndo.bind(this)}, autoOpen:!1, close:this.rejectUndo.bind(this)});
      d.enableShortcuts && b(document, u ? "keypress" : "keydown", this.handleKeypress, this, !0);
      b(document, "mouseup", this.handleDocMouseUp, this, !0);
      (d.sgf || d.sgfUrl || d.sgfPath && d.gameName) && this.loadSgf(d);
      this.hook("initDone");
    } else {
      alert(a["dom error"]);
    }
  }, hook:function(a, b) {
    if (a in this.hooks) {
      return this.hooks[a].bind(this)(b);
    }
  }, reset:function(a) {
    this.gameName = "";
    this.collectionRoot = new eidogo.GameNode;
    this.cursor = new eidogo.GameCursor;
    this.progressiveLoad = a.progressiveLoad ? !0 : !1;
    this.progressiveUrl = this.progressiveLoads = null;
    this.progressiveMode = a.progressiveLoad && a.progressiveMode || "id";
    this.board = this.opponentLevel = this.opponentColor = this.opponentUrl = null;
    this.rules = a.rules || null;
    this.variations = this.totalMoves = this.moveNumber = this.currentColor = null;
    this.timeW = this.timeB = "";
    this.timeElapsed = !1;
    this.startGameTimer();
    this.labelLastNumber = this.labelLastLetter = this.mouseDownClickY = this.mouseDownClickX = this.mouseDownY = this.mouseDownX = this.mouseDown = this.regionClickSelect = this.regionBegun = this.regionHeight = this.regionWidth = this.regionLeft = this.regionTop = null;
    this.resetLastLabels();
    this.updatedNavTree = this.unsavedChanges = !1;
    this.navTreeTimeout = null;
    this.goingBack = this.editingText = this.searching = !1;
    this.problemMode = a.problemMode;
    this.problemColor = a.problemColor;
    this.prefs = {};
    this.prefs.observing = a.observing;
    this.prefs.allowUndo = a.allowUndo;
    this.prefs.markCurrent = "undefined" != typeof a.markCurrent ? !!a.markCurrent : !0;
    this.prefs.markNext = "undefined" != typeof a.markNext ? a.markNext : !1;
    this.prefs.markVariations = "undefined" != typeof a.markVariations ? !!a.markVariations : !0;
    this.prefs.showGameInfo = !!a.showGameInfo;
    this.prefs.showPlayerInfo = !!a.showPlayerInfo;
    this.prefs.showTools = !!a.showTools;
    this.prefs.showComments = "undefined" != typeof a.showComments ? !!a.showComments : !0;
    this.prefs.showOptions = !!a.showOptions;
    this.prefs.showNavTree = this.progressiveLoad || "undefined" == typeof a.showNavTree ? !1 : !!a.showNavTree;
  }, loadSgf:function(b, c) {
    b = b || {};
    this.nowLoading();
    this.reset(b);
    this.sgfPath = b.sgfPath || this.sgfPath;
    this.loadPath = b.loadPath && 1 < b.loadPath.length ? b.loadPath : [0, 0];
    this.gameName = b.gameName || "";
    var d = !1;
    if ("string" == typeof b.sgf) {
      var e = new eidogo.SgfParser(b.sgf);
      this.load(e.root);
    } else {
      if ("object" == typeof b.sgf) {
        this.load(b.sgf);
      } else {
        if (b.progressiveLoad && b.progressiveUrl) {
          this.progressiveLoads = 0, this.progressiveUrl = b.progressiveUrl, this.fetchProgressiveData(c), d = !0;
        } else {
          if ("string" == typeof b.sgfUrl || this.gameName) {
            b.sgfUrl || (b.sgfUrl = this.sgfPath + this.gameName + ".sgf"), this.remoteLoad(b.sgfUrl, null, !1, null, c), d = !0, b.progressiveLoad && (this.progressiveLoads = 0, this.progressiveUrl = b.progressiveUrl || b.sgfUrl.replace(/\?.+$/, ""));
          } else {
            e = b.boardSize || "19";
            var f = {19:6.5, 13:4.5, 9:3.5, 7:2.5};
            f = {_children:[{SZ:e, KM:b.komi || f[e] || 6.5, _children:[]}]};
            if (b.opponentUrl) {
              this.gameName = "gnugo";
              this.opponentUrl = b.opponentUrl;
              this.opponentColor = "B" == b.opponentColor ? b.opponentColor : "W";
              this.opponentLevel = b.opponentLevel || 7;
              var g = f._children[0];
              g.PW = "B" == this.opponentColor ? a.you : "GNU Go";
              g.PB = "B" == this.opponentColor ? "GNU Go" : a.you;
              g.HA = parseInt(b.handicap, 10) || 0;
              g.HA && (b = {19:[["pd", "dp"], ["pd", "dp", "pp"], ["pd", "dp", "pp", "dd"], ["pd", "dp", "pp", "dd", "jj"], "pd dp pp dd dj pj".split(" "), "pd dp pp dd dj pj jj".split(" "), "pd dp pp dd dj pj jd jp".split(" "), "pd dp pp dd dj pj jd jp jj".split(" ")], 13:[["jd", "dj"], ["jd", "dj", "jj"], ["jd", "dj", "jj", "dd"], ["jd", "dj", "jj", "dd", "gg"], "jd dj jj dd dg jg".split(" "), "jd dj jj dd dg jg gg".split(" "), "jd dj jj dd dg jg gd gj".split(" "), "jd dj jj dd dg jg gd gj gg".split(" ")], 
              9:[["cg", "gc"], ["cg", "gc", "gg"], ["cg", "gc", "gg", "cc"], ["cg", "gc", "gg", "cc", "ee"], "cg gc gg cc ce ge".split(" "), "cg gc gg cc ce ge ee".split(" "), "cg gc gg cc ce ge ec eg".split(" "), "cg gc gg cc ce ge ec eg ee".split(" ")]}, g.KM = .5, 1 < g.HA && (g.AB = b[e][g.HA - 2]));
            }
            this.load(f);
          }
        }
      }
    }
    !d && "function" == typeof c && c();
  }, load:function(a, b) {
    var c = !1;
    b || (b = new eidogo.GameNode, this.collectionRoot = b);
    b.loadJson(a);
    b._cached = !0;
    this.doneLoading();
    this.progressiveLoads--;
    b._parent || (a = this.loadPath.length ? parseInt(this.loadPath[0], 10) : 0, this.initGame(b._children[a || 0]), c = !0);
    this.loadPath.length ? (this.goTo(this.loadPath, c), this.progressiveLoad || (this.loadPath = [0, 0])) : this.refresh();
    c && this.problemMode && (this.problemColor ? this.currentColor = this.problemColor : this.currentColor = this.problemColor = this.cursor.getNextColor() || "B");
  }, remoteLoad:function(b, c, e, f, g) {
    g = "function" == typeof g ? g : null;
    ("undefined" == e || e) && (c || (this.gameName = b), b = this.sgfPath + b + ".sgf");
    f && (this.loadPath = f);
    d("get", b, null, function(b) {
      b = b.responseText.replace(/^( |\t|\r|\n)*/, "");
      if ("(" == b.charAt(0)) {
        var d = this;
        new eidogo.SgfParser(b, function() {
          d.load(this.root, c);
          g && g();
        });
      } else {
        "{" == b.charAt(0) ? (b = eval("(" + b + ")"), this.load(b, c), g && g()) : this.croak(a["invalid data"]);
      }
    }, function(b) {
      this.croak(a["error retrieving"]);
    }, this, 3E4);
  }, initGame:function(a) {
    a = a || {};
    this.handleDisplayPrefs();
    var b = a.SZ || 19;
    7 != b && 9 != b && 13 != b && 19 != b && (b = 19);
    this.shrinkToFit ? this.calcShrinkToFit(a, b) : this.problemMode && !this.cropParams && (this.cropParams = {width:b, height:b, top:0, left:0, padding:1});
    this.board || this.createBoard(b);
    this.refreshChatMessages();
    this.rules ? this.rules.board = this.board : this.rules = new eidogo.Rules(this.board);
    this.unsavedChanges = !1;
    this.resetCursor(!0);
    this.totalMoves = 0;
    for (b = new eidogo.GameCursor(this.cursor.node); b.next();) {
      this.totalMoves++;
    }
    this.totalMoves--;
    this.showGameInfo(a);
    this.enableNavSlider();
    this.hook("initGame");
  }, handleDisplayPrefs:function() {
    (this.prefs.allowUndo ? n : q)(this.dom.controlUndo);
    ("finished" == this.gameState ? n : q)(this.dom.replay);
    (this.prefs.observing || "play" != this.mode ? q : n)(this.dom.gameActions);
    (this.prefs.showGameInfo || this.prefs.showPlayerInfo ? n : q)(this.dom.info);
    (this.prefs.showPlayerInfo ? n : q)(this.dom.t);
    (this.prefs.showTools ? n : q)(this.dom.toolsContainer);
    this.showingSearch || (this.prefs.showComments ? n : q)(this.dom.comments);
    (this.prefs.showOptions ? n : q)(this.dom.options);
    (this.prefs.showNavTree ? n : q)(this.dom.navTreeContainer);
  }, createBoard:function(b) {
    b = b || 19;
    if (!this.board || !this.board.renderer || this.board.boardSize != b) {
      try {
        this.dom.boardContainer.innerHTML = "";
        var c = new eidogo.renderers[this.renderer](this.dom.boardContainer, b, this, this.cropParams);
        this.board = new eidogo.Board(c, b);
      } catch (v) {
        "No DOM container" == v && this.croak(a["error board"]);
      }
    }
  }, calcShrinkToFit:function(a, b) {
    var c = null, d = null, e = null, f = null, g = {}, m = this;
    a.walk(function(a) {
      var b, c;
      for (b in a) {
        if (/^(W|B|AW|AB|LB)$/.test(b)) {
          var d = a[b];
          d instanceof Array || (d = [d]);
          "LB" != b ? d = m.expandCompressedPoints(d) : d = [d[0].split(/:/)[0]];
          for (c = 0; c < d.length; c++) {
            g[d[c]] = "";
          }
        }
      }
    });
    for (var k in g) {
      a = this.sgfCoordToPoint(k);
      if (null == c || a.x < c) {
        c = a.x;
      }
      if (null == e || a.x > e) {
        e = a.x;
      }
      if (null == d || a.y < d) {
        d = a.y;
      }
      if (null == f || a.y > f) {
        f = a.y;
      }
    }
    this.cropParams.width = e - c + 1;
    this.cropParams.height = f - d + 1;
    this.cropParams.left = c;
    this.cropParams.top = d;
    for (a = k = this.cropParams.padding; 0 > c - a; a--) {
    }
    a && (this.cropParams.width += a, this.cropParams.left -= a);
    for (c = k; 0 > d - c; c--) {
    }
    c && (this.cropParams.height += c, this.cropParams.top -= c);
    for (d = k; e + d > b; d--) {
    }
    d && (this.cropParams.width += d);
    for (e = k; f + e > b; e--) {
    }
    e && (this.cropParams.height += e);
  }, fetchOpponentMove:function() {
    this.nowLoading(a["gnugo thinking"]);
    var b = this.cursor.getGameRoot();
    b = {sgf:b.toSgf(), move:this.currentColor, size:b.SZ, level:this.opponentLevel};
    d("post", this.opponentUrl, b, function(a) {
      this.doneLoading();
      this.createMove(a.responseText);
    }, function(b) {
      this.croak(a["error retrieving"]);
    }, this, 45E3);
  }, fetchScoreEstimate:function() {
    this.nowLoading(a["gnugo thinking"]);
    var b = this.cursor.getGameRoot();
    b = {sgf:b.toSgf(), move:"est", size:b.SZ || 19, komi:b.KM || 0, mn:this.moveNumber + 1};
    d("post", this.scoreEstUrl, b, function(a) {
      this.doneLoading();
      a = a.responseText.split("\n");
      for (var b, c = a[1].split(" "), d = 0; d < c.length; d++) {
        b = c[d].split(":"), b[1] && this.addMarker(b[1], b[0]);
      }
      this.board.render();
      this.prependComment(a[0]);
    }, function(b) {
      this.croak(a["error retrieving"]);
    }, this, 45E3);
  }, playProblemResponse:function(b) {
    setTimeout(function() {
      this.variation(null, b);
      this.hooks.playProblemResponse ? this.hook("playProblemResponse") : this.cursor.hasNext() || this.prependComment(a["end of variation"]);
    }.bind(this), 200);
  }, goTo:function(b, c) {
    (c = "undefined" != typeof c ? c : !0) && 1 < b.length && b[0] != this.cursor.getGameRoot().getPosition() && (this.updatedNavTree = !1);
    c && this.resetCursor(!0);
    var d = parseInt(b, 10);
    if (b instanceof Array || isNaN(d)) {
      if (b instanceof Array && b.length) {
        if (isNaN(parseInt(b[0], 10))) {
          for (this.cursor.node._parent || this.variation(0, !0); b.length;) {
            if (0 < this.progressiveLoads) {
              this.loadPath.push(e);
              return;
            }
            var e = b.shift();
            c = this.getVariations();
            for (f = 0; f < c.length; f++) {
              if (c[f].move == e) {
                this.variation(c[f].varNum, !0);
                break;
              }
            }
          }
        } else {
          for (f = !0; b.length;) {
            e = parseInt(b.shift(), 10);
            if (!b.length) {
              for (f = 0; f < e; f++) {
                this.variation(0, !0);
              }
            } else {
              if (b.length) {
                if (!f && c) {
                  for (; 1 == this.cursor.node._children.length;) {
                    this.variation(0, !0);
                  }
                }
                this.variation(e, !0);
              }
            }
            f = !1;
          }
        }
        this.refresh();
      } else {
        alert(a["bad path"] + " " + b);
      }
    } else {
      c && d++;
      for (var f = 0; f < d; f++) {
        this.variation(null, !0);
      }
      this.refresh();
    }
  }, resetCursor:function(a, b) {
    this.board.reset();
    this.resetCurrentColor();
    b ? this.cursor.node = this.cursor.getGameRoot() : this.cursor.node = this.collectionRoot;
    this.refresh(a);
  }, resetCurrentColor:function() {
    this.currentColor = this.problemMode ? this.problemColor : "B";
    var a = this.cursor.getGameRoot();
    a && 1 < a.HA && (this.currentColor = "W");
  }, refresh:function(a) {
    if (0 < this.progressiveLoads) {
      var b = this;
      setTimeout(function() {
        b.refresh.call(b);
      }, 10);
    } else {
      this.board.revert(1), this.execNode(a), this.displayCurrentTurn();
    }
  }, variation:function(a, b) {
    return this.cursor.next(a) ? (this.execNode(b), this.resetLastLabels(), 0 < this.progressiveLoads ? !1 : !0) : !1;
  }, execNode:function(a, b) {
    if (!b && 0 < this.progressiveLoads) {
      var c = this;
      setTimeout(function() {
        c.execNode.call(c, a);
      }, 10);
    } else {
      if (this.cursor.node) {
        a || (this.dom.comments.innerHTML = "", this.board.clearMarkers(), this.moveNumber = this.cursor.getMoveNumber());
        1 > this.moveNumber && this.resetCurrentColor();
        var d = this.cursor.node.getProperties(), e;
        for (e in d) {
          this.propertyHandlers[e] && this.propertyHandlers[e].apply(this, [this.cursor.node[e], e, a]);
        }
        a ? this.board.commit() : (this.opponentUrl && this.opponentColor == this.currentColor && this.moveNumber == this.totalMoves && this.fetchOpponentMove(), this.findVariations(), this.updateControls(), this.board.commit(), this.board.render());
        !b && this.progressiveUrl && this.fetchProgressiveData();
        this.problemMode && this.currentColor && this.currentColor != this.problemColor && !this.goingBack && this.playProblemResponse(a);
        this.goingBack = !1;
      }
    }
  }, refreshChatMessages:function() {
    $.getJSON("/game/" + this.uniq + "/messages", null, function(a) {
      goshrine.replaceChatMessages(a);
    }.bind(this));
  }, undoRequested:function(a, b, c) {
    this.undo_request_id = b;
    $("#undo_dialog").html("<p>" + c + " has requested an undo for their last move.</p>");
    $("#undo_dialog").dialog("open");
  }, acceptUndo:function() {
    if (this.undo_request_id) {
      var a = this.undo_request_id;
      this.undo_request_id = null;
      $("#undo_dialog").dialog("close");
      $.post("/undo_requests/accept/" + a, "");
    }
  }, rejectUndo:function() {
    if (this.undo_request_id) {
      var a = this.undo_request_id;
      this.undo_request_id = null;
      $("#undo_dialog").dialog("close");
      $.post("/undo_requests/reject/" + a, "");
    }
  }, undoAccepted:function(a) {
    this.clearWait();
    goshrine.showTemporaryMessage("Undo accepted.");
  }, undoRejected:function(a) {
    this.clearWait();
    goshrine.showTemporaryMessage("Sorry, your undo request was rejected by your opponent.");
  }, whoseTurn:function() {
    return "W" == this.currentColor ? this.playerInfo.whitePlayer : this.playerInfo.blackPlayer;
  }, displayCurrentTurn:function() {
    if ("in-play" == this.gameState) {
      if (this.cursor.hasNext()) {
        $("#current_turn").html("Reviewing past moves...");
      } else {
        var a = "";
        if (this.currentColor == this.playerColor) {
          var b = "your";
          var c = "W" == this.currentColor ? "B" : "W";
          this.cursor.hasPrevious() && this.cursor.node.isPass() && (a = " (" + ("W" == c ? this.playerInfo.whitePlayer : this.playerInfo.blackPlayer) + " passed)");
        } else {
          b = this.whoseTurn() + "'s";
        }
        $("#current_turn").html("It is " + b + " move" + a + ".");
      }
    } else {
      $("#current_turn").html("");
    }
  }, receivePrivateGameEvent:function(a) {
    switch(a.type) {
      case "undo_requested":
        this.undoRequested(a.move_id, a.request_id, a.requested_by);
        break;
      case "undo_rejected":
        this.undoRejected(a.request_id);
        break;
      case "undo_accepted":
        this.undoAccepted(a.request_id);
    }
  }, renderGroupsOfMarks:function(a, b) {
    for (var c = a.length, d = 0; d < c; d++) {
      group = a[d];
      for (var e = group.length, f = 0; f < e; f++) {
        var g = this.sgfCoordToPoint(group[f]);
        this.board.addMarker(g, b);
      }
    }
  }, formatSecs:function(a) {
    var b = "" + Math.floor(a / 60);
    1 == b.length && (b = "0" + b);
    a = "" + (a - 60 * b);
    return 1 == a.length && (a = "0" + a), b + ":" + a;
  }, formatByoYomiTime:function(a, b) {
    return rval = "", 0 == a ? 1 == b ? rval = this.formatSecs(30) + " (SD)" : 0 == b ? rval = this.formatSecs(30) + " (SD)" : rval = this.formatSecs(30) + " (" + (b - 1) + ")" : 0 == b ? rval = this.formatSecs(a) + " (SD)" : rval = this.formatSecs(a) + " (" + b + ")", rval;
  }, displayRemainingSeconds:function(a, b) {
    if (this.dom.whiteTime && this.dom.blackTime) {
      var c = "";
      if (this.byoYomi) {
        var d = a - 150;
        0 < d ? c = this.formatSecs(d) + " (5)" : 0 < a ? (c = Math.floor(a / 30), c = this.formatByoYomiTime(a - 30 * c, c)) : (c = '<span class="elapsed_time">Elapsed!<span>', this.timeElapsed = !0);
      } else {
        0 < a ? c = this.formatSecs(a) : (c = '<span class="elapsed_time">Elapsed!<span>', this.timeElapsed = !0);
      }
      var e = this.dom.whiteTime;
      "B" == b && (e = this.dom.blackTime);
      e.innerHTML = c;
      0 >= d && 0 < a && 0 == a % 10 && b == this.currentColor && $(e).effect("highlight", {color:"#ff8888"}, 3E3);
    }
  }, updateClocks:function() {
    if (!(0 >= this.mainTime)) {
      this.turnStartedAt ? elapsed = (new Date - this.turnStartedAt) / 1E3 : elapsed = 0;
      var a = this.blackSecondsLeft, b = this.whiteSecondsLeft;
      "in-play" == this.gameState && ("W" == this.currentColor ? b -= elapsed : a -= elapsed);
      this.displayRemainingSeconds(Math.floor(b), "W");
      this.displayRemainingSeconds(Math.floor(a), "B");
      this.timeElapsed && (this.clearGameTimer(), $.post("/game/" + this.uniq + "/time_elapsed", ""));
    }
  }, showScore:function() {
    this.dom.score && (this.dom.score.style.display = "", this.dom.territory.style.display = "");
    this.scoringInfo.score && this.dom.whiteTerritory && (this.dom.whiteTerritory.innerHTML = this.scoringInfo.score.white_territory_count, this.dom.blackTerritory.innerHTML = this.scoringInfo.score.black_territory_count, this.dom.whiteScore.innerHTML = this.scoringInfo.score.white, this.dom.blackScore.innerHTML = this.scoringInfo.score.black);
  }, showScoringInfo:function(a) {
    console.log(a);
    this.scoringInfo = a;
    this.board.clearMarkers();
    this.renderGroupsOfMarks(this.scoringInfo.white, "territory-white");
    this.renderGroupsOfMarks(this.scoringInfo.black, "territory-black");
    this.renderGroupsOfMarks(this.scoringInfo.dame, "dame");
    this.renderGroupsOfMarks([this.scoringInfo.dead_stones_by_color.black], "capture-black");
    this.renderGroupsOfMarks([this.scoringInfo.dead_stones_by_color.white], "capture-white");
    this.showScore();
    this.board.render();
    this.clearWait();
    "scoring" == this.gameState && (this.prefs.observing && (this.dom.scoringDialog.innerHTML = "Players are selecting dead stones."), n(this.dom.scoringDialog));
  }, enterViewMode:function() {
    this.mode = "view";
    this.handleDisplayPrefs();
    this.displayCurrentTurn();
    this.updateNavSlider();
  }, showFinalResult:function(a, b) {
    a && (this.scoringInfo = a);
    this.dom.result && (this.dom.result.innerHTML = b, this.dom.result.style.display = "");
    "+R" != b.substring(1, 3) && this.showScore();
    this.clearWait();
    q(this.dom.scoringDialog);
    this.enterViewMode();
  }, resignedBy:function(a) {
    this.gameState = "finished";
    this.showFinalResult(null, a.result);
    this.enterViewMode();
  }, acceptScore:function() {
    $.post("/game/" + this.uniq + "/done_scoring", "");
    this.pleaseWait("Waiting for other player to accept.");
    q(this.dom.scoringDialog);
  }, startGameTimer:function() {
    this.updateClocks();
    0 < this.mainTime && "in-play" == this.gameState && (this.dom.container.gameTimer && this.clearGameTimer(), this.dom.container.gameTimer = setInterval(this.updateClocks.bind(this), 1E3));
  }, clearGameTimer:function() {
    this.dom.container.gameTimer && (clearInterval(this.dom.container.gameTimer), this.dom.container.gameTimer = null);
  }, setGameTimeFromServer:function(a) {
    this.blackSecondsLeft = a.black_seconds_left;
    this.whiteSecondsLeft = a.white_seconds_left;
    a.turn_started_at && (this.turnStartedAt = parseISO8601(a.turn_started_at) - this.serverTimeOffset);
  }, receivePublicGameEvent:function(a) {
    var b = a.data;
    switch(a.action) {
      case "estimatingScore":
        this.clearGameTimer();
        this.gameState = "estimating-score";
        this.pleaseWait("Estimating score.");
        this.displayCurrentTurn();
        this.handleDisplayPrefs();
        break;
      case "setScoring":
        this.mode = "scoring";
        this.gameState = "scoring";
        this.showScoringInfo(b);
        break;
      case "gameFinished":
        this.gameState = "finished";
        this.whiteSecondsLeft = b.white_seconds_left;
        this.blackSecondsLeft = b.black_seconds_left;
        this.showFinalResult(b.scoring_info, b.result);
        b.scoring_info && this.showScoringInfo(b.scoring_info);
        break;
      case "userDoneScoring":
        this.userDoneScoring(b);
        break;
      case "updateBoard":
        b.version > this.gameVersion && ("pass" == b.move ? b.move = "tt" : this.playSounds && $("#clickSound").jPlayer("play"), this.setGameTimeFromServer(b), this.cursor.hasNext() && this.last(), this.createMove(b.move), this.gameVersion = b.version, this.board.render(), this.displayCurrentTurn());
        break;
      case "pleaseWait":
        this.pleaseWait(b);
        break;
      case "fullGameUpdate":
        for (; this.cursor.getMoveNumber() > b.move_number;) {
          this.back();
        }
        this.setGameTimeFromServer(b);
        this.cursor.node._children = [];
        this.findVariations();
        this.displayCurrentTurn();
        break;
      case "resignedBy":
        this.resignedBy(b);
        break;
      case "closed":
        this.closed(b);
        break;
      case "game_started":
        this.clearWait(), this.timeElapsed = !1, this.gameState = "in-play", this.startGameTimer(), this.displayCurrentTurn();
    }
  }, fetchProgressiveData:function(d) {
    var e = this.cursor.node || null;
    if (!e || !e._cached) {
      if ("pattern" == this.progressiveMode) {
        e && !e._parent._parent || this.fetchProgressiveContinuations(d);
      } else {
        var f = e && e._id || 0;
        this.nowLoading();
        this.progressiveLoads++;
        var k = function() {
          1 < this.cursor.getMoveNumber() && (this.cursor.node.C = "<a id='cont-search' href='#'>" + a["show games"] + "</a>" + (this.cursor.node.C || ""));
          this.refresh();
          d && "function" == typeof d && d();
          b(c("cont-search"), "click", function(a) {
            var b = this.board.getRegion(0, 11, 8, 8);
            b = this.convertRegionPattern(b);
            this.loadSearch("ne", "8x8", this.compressPattern(b));
            g(a);
          }.bind(this));
        }.bind(this);
        f = this.progressiveUrl + "?" + eidogo.util.makeQueryString({id:f, pid:this.uniq});
        this.remoteLoad(f, e, !1, null, k);
      }
    }
  }, fetchProgressiveContinuations:function(e) {
    this.nowLoading();
    this.progressiveLoads++;
    var f = this.cursor.getMoveNumber(), k = 1 < f ? 11 : 7, m = 19 - k - 1, l = this.board ? this.convertRegionPattern(this.board.getRegion(0, m + 1, k, k)) : ".................................................", n = {q:"ne", w:k, h:k, p:l, a:"continuations", t:(new Date).getTime()}, q = function(d) {
      if (d.responseText && "NONE" != d.responseText) {
        var p = {LB:[], _children:[]};
        p.C = 1 < f ? "<a id='cont-search' href='#'>" + a["show games"] + "</a>" : "";
        var n, v = eval("(" + d.responseText + ")");
        if (v.length) {
          v.sort(function(a, b) {
            return parseInt(b.count, 10) - parseInt(a.count, 10);
          });
          var q = parseInt(v[0].count, 10);
          p.C += "<div class='continuations'>";
          for (var w = 0; n = v[w]; w++) {
            var x = parseInt(n.count / q * 150);
            if (!(20 < q && 10 > parseInt(n.count, 10))) {
              d = {};
              var u = m + parseInt(n.x, 10) + 1;
              var A = parseInt(n.y, 10);
              u = this.pointToSgfCoord({x:u, y:A});
              d[this.currentColor || "B"] = u;
              p.LB.push(u + ":" + n.label);
              x && (p.C += "<div class='continuation'><div class='cont-label'>" + n.label + "</div><div class='cont-bar' style='width: " + x + "px'></div><div class='cont-count'>" + n.count + "</div></div>");
              p._children.push(d);
            }
          }
          p.C += "</div>";
          this.cursor.node || (p = {_children:[p]});
        }
        this.load(p, this.cursor.node);
        b(c("cont-search"), "click", function(a) {
          this.loadSearch("ne", k + "x" + k, this.compressPattern(l));
          g(a);
        }.bind(this));
        e && "function" == typeof e && e();
      } else {
        this.progressiveLoads--, this.doneLoading(), this.cursor.node._cached = !0, this.refresh();
      }
    }.bind(this);
    d("get", this.progressiveUrl, n, q, function(b) {
      this.croak(a["error retrieving"]);
    }, this, 45E3);
  }, findVariations:function() {
    this.variations = this.getVariations();
  }, getVariations:function() {
    for (var a = [], b = this.cursor.node._children, c = 0; c < b.length; c++) {
      a.push({move:b[c].getMove(), varNum:c});
    }
    return a;
  }, back:function(a, b, c) {
    this.cursor.previous() && (this.board.revert(1), this.goingBack = !0, this.refresh(c), this.resetLastLabels());
  }, forward:function(a, b, c) {
    this.variation(null, c);
    this.refresh();
  }, first:function() {
    this.cursor.hasPrevious() && this.resetCursor(!1, !0);
  }, last:function() {
    if (this.cursor.hasNext()) {
      for (; this.variation(null, !0);) {
      }
      this.refresh();
    }
  }, pass:function() {
    if (this.variations) {
      for (var a = 0; a < this.variations.length; a++) {
        if (!this.variations[a].move || "tt" == this.variations[a].move) {
          this.variation(this.variations[a].varNum);
          return;
        }
      }
      $.post("/game/" + this.uniq + "/move/pass", null, function(a, b) {
        a.error && goshrine.showTemporaryMessage(a.error);
      }.bind(this), "json");
    }
  }, pleaseWait:function(a) {
    this.dom.pleaseWait.innerHTML = a + ' Please wait...<img align="center" src="/static/spinner.gif" />';
  }, clearWait:function() {
    $("#please_wait").empty();
  }, askForUndo:function() {
    $.post("/undo_requests/propose", {go_game_id:this.game_id}, function(a, b) {
      a.error && (goshrine.showTemporaryMessage(a.error), this.clearWait());
    }.bind(this), "json");
    this.pleaseWait("Request submitted to opponent.");
  }, resign:function() {
    confirm("Are you sure you want to resign this game?") && $.post("/game/" + this.uniq + "/resign", "");
  }, handleBoardMouseDown:function(a, b, c, d, e) {
    !this.domLoading && this.boundsCheck(a, b, [0, this.board.boardSize - 1]) && (this.mouseDown = !0, this.mouseDownX = a, this.mouseDownY = b, this.mouseDownClickX = c, this.mouseDownClickY = d, "region" == this.mode && 0 <= a && 0 <= b && !this.regionBegun && (this.regionTop = b, this.regionLeft = a, this.regionBegun = !0));
  }, handleBoardHover:function(a, b, c, d, e) {
    if (!this.domLoading && (this.mouseDown || this.regionBegun) && this.boundsCheck(a, b, [0, this.board.boardSize - 1])) {
      var f = a != this.mouseDownX || b != this.mouseDownY;
      c = 19 <= Math.abs(this.mouseDownClickX - c) || 19 <= Math.abs(this.mouseDownClickY - d);
      this.searchUrl && !this.regionBegun && f && c && (this.selectTool("region"), this.regionBegun = !0, this.regionTop = this.mouseDownY, this.regionLeft = this.mouseDownX);
      this.regionBegun && (this.regionRight = a + (a >= this.regionLeft ? 1 : 0), this.regionBottom = b + (b >= this.regionTop ? 1 : 0), this.showRegion());
      g(e);
    }
  }, handleBoardMouseUp:function(b, c, d) {
    if (!this.domLoading) {
      this.mouseDown = !1;
      var e = this.pointToSgfCoord({x:b, y:c});
      if ("view" == this.mode || "play" == this.mode) {
        for (var f = 0; f < this.variations.length; f++) {
          var k = this.sgfCoordToPoint(this.variations[f].move);
          if (k.x == b && k.y == c) {
            this.variation(this.variations[f].varNum);
            g(d);
            return;
          }
        }
      }
      if ("view" == this.mode) {
        var m = this.cursor.getGameRoot();
        b = [0, m.getPosition()];
        c = 0;
        for (m = m._children[0]; m;) {
          if (m.getMove() == e) {
            b.push(c);
            this.goTo(b);
            break;
          }
          c++;
          m = m._children[0];
        }
      } else {
        if ("scoring" == this.mode) {
          this.prefs.observing || (e = {x:b, y:c}, this.board.getStone(e) != this.board.EMPTY && (b = this.board.getMarker(e), $.post("/game/" + this.uniq + "/mark_group_" + ("capture-white" == b || "capture-black" == b ? "alive" : "dead") + "/" + this.pointToSgfCoord(e), "")));
        } else {
          if ("play" == this.mode && "new" != this.gameState) {
            this.rules.check({x:b, y:c}, this.currentColor) && e && ((b = this.cursor.getNextMoves()) && e in b ? this.variation(b[e]) : this.createMove(e));
          } else {
            if ("region" == this.mode && -1 <= b && -1 <= c && this.regionBegun) {
              this.regionTop != c || this.regionLeft != b || this.regionClickSelect ? (this.regionBegun = !1, this.regionClickSelect = !1, this.regionBottom = 0 > c ? 0 : c >= this.board.boardSize ? c : c + (c > this.regionTop ? 1 : 0), this.regionRight = 0 > b ? 0 : b >= this.board.boardSize ? b : b + (b > this.regionLeft ? 1 : 0), this.showRegion(), n(this.dom.searchButton, "inline"), g(d)) : (this.regionClickSelect = !0, this.regionRight = b + 1, this.regionBottom = c + 1, this.showRegion());
            } else {
              d = this.board.getStone({x:b, y:c});
              if ("add_b" == this.mode || "add_w" == this.mode) {
                f = this.cursor.node.emptyPoint(this.pointToSgfCoord({x:b, y:c})), d != this.board.BLACK && "add_b" == this.mode ? m = "AB" : d != this.board.WHITE && "add_w" == this.mode ? m = "AW" : this.board.getStone({x:b, y:c}) != this.board.EMPTY && !f && (m = "AE");
              } else {
                switch(this.mode) {
                  case "tr":
                    m = "TR";
                    break;
                  case "sq":
                    m = "SQ";
                    break;
                  case "cr":
                    m = "CR";
                    break;
                  case "x":
                    m = "MA";
                    break;
                  case "dim":
                    m = "DD";
                    break;
                  case "number":
                    m = "LB";
                    e = e + ":" + this.labelLastNumber;
                    this.labelLastNumber++;
                    break;
                  case "letter":
                    m = "LB";
                    e = e + ":" + this.labelLastLetter;
                    this.labelLastLetter = String.fromCharCode(this.labelLastLetter.charCodeAt(0) + 1);
                    break;
                  case "label":
                    m = "LB";
                    e = e + ":" + this.dom.labelInput.value;
                    break;
                  case "clear":
                    this.cursor.node.deletePropertyValue("TR SQ CR MA DD LB".split(" "), new RegExp("^" + e));
                }
                this.cursor.node.hasPropertyValue(m, e) && (this.cursor.node.deletePropertyValue(m, e), m = null);
              }
              m && this.cursor.node.pushProperty(m, e);
              this.unsavedChanges = !0;
              f = this.checkForEmptyNode();
              this.refresh();
              f && this.prependComment(a["position deleted"]);
            }
          }
        }
      }
    }
  }, checkForEmptyNode:function() {
    if (!eidogo.util.numProperties(this.cursor.node.getProperties()) && window.confirm(a["confirm delete"])) {
      var b = this.cursor.node._id, c = 0;
      return this.back(), this.cursor.node._children = this.cursor.node._children.filter(function(a, d) {
        return a._id == b ? (c = d, !1) : !0;
      }), c && this.cursor.node._preferredChild == c && this.cursor.node._preferredChild--, !0;
    }
    return !1;
  }, handleDocMouseUp:function(a) {
    return this.domLoading ? !0 : ("region" == this.mode && this.regionBegun && !this.regionClickSelect && (this.mouseDown = !1, this.regionBegun = !1, n(this.dom.searchButton, "inline")), !0);
  }, boundsCheck:function(a, b, c) {
    return 2 == c.length && (c[3] = c[2] = c[1], c[1] = c[0]), a >= c[0] && b >= c[1] && a <= c[2] && b <= c[3];
  }, getRegionBounds:function() {
    var a = this.regionLeft, b = this.regionRight - this.regionLeft;
    0 > b && (a = this.regionRight, b = -b + 1);
    var c = this.regionTop, d = this.regionBottom - this.regionTop;
    return 0 > d && (c = this.regionBottom, d = -d + 1), [c, a, b, d];
  }, showRegion:function() {
    var a = this.getRegionBounds();
    this.board.renderer.showRegion(a);
  }, hideRegion:function() {
    this.board.renderer.hideRegion();
  }, convertRegionPattern:function(a) {
    return a.join("").replace(new RegExp(this.board.EMPTY, "g"), ".").replace(new RegExp(this.board.BLACK, "g"), "x").replace(new RegExp(this.board.WHITE, "g"), "o");
  }, loadSearch:function(a, b, c, d, e) {
    this.load({_children:[{SZ:this.board.boardSize, _children:[]}]});
    this.dom.searchAlgo.value = d || "corner";
    c = this.uncompressPattern(c);
    b = b.split("x");
    d = b[0];
    b = b[1];
    var f = this.board.boardSize, g;
    switch(a) {
      case "nw":
        var k = g = 0;
        break;
      case "ne":
        g = f - d;
        k = 0;
        break;
      case "se":
        g = f - d;
        k = f - b;
        break;
      case "sw":
        g = 0, k = f - b;
    }
    var m;
    for (a = 0; a < b; a++) {
      for (m = 0; m < d; m++) {
        f = c.charAt(a * d + m), "o" == f ? f = "AW" : "x" == f ? f = "AB" : f = "", this.cursor.node.pushProperty(f, this.pointToSgfCoord({x:g + m, y:k + a}));
      }
    }
    this.refresh();
    this.regionLeft = g;
    this.regionTop = k;
    this.regionRight = g + m;
    this.regionBottom = k + a;
    m = this.getRegionBounds();
    c = [m[1], m[0], m[1] + m[2], m[0] + m[3] - 1];
    for (a = 0; a < this.board.boardSize; a++) {
      for (m = 0; m < this.board.boardSize; m++) {
        this.boundsCheck(m, a, c) || this.board.renderer.renderMarker({x:m, y:a}, "dim");
      }
    }
    this.searchRegion(e);
  }, searchRegion:function(e) {
    if (!this.searching) {
      if (this.searching = !0, this.searchUrl) {
        e = parseInt(e, 10) || 0;
        var f = this.dom.searchAlgo.value, k = this.getRegionBounds(), m = this.board.getRegion(k[0], k[1], k[2], k[3]), l = this.convertRegionPattern(m);
        m = /^\.*$/.test(l);
        var u = /^\.*o\.*$/.test(l), x = /^\.*x\.*$/.test(l);
        if (m || u || x) {
          this.searching = !1, n(this.dom.comments), q(this.dom.searchContainer), this.prependComment(a["two stones"]);
        } else {
          if (m = [], 0 == k[0] && m.push("n"), 0 == k[1] && m.push("w"), k[0] + k[3] == this.board.boardSize && m.push("s"), k[1] + k[2] == this.board.boardSize && m.push("e"), "corner" != f || 2 == m.length && (m.contains("n") && m.contains("e") || m.contains("n") && m.contains("w") || m.contains("s") && m.contains("e") || m.contains("s") && m.contains("w"))) {
            var F = m.contains("n") ? "n" : "s";
            F += m.contains("w") ? "w" : "e";
            this.showComments("");
            this.gameName = "search";
            e = {q:F, w:k[2], h:k[3], p:l, a:f, o:e, t:(new Date).getTime()};
            this.progressiveLoad = !1;
            this.progressiveUrl = null;
            this.prefs.markNext = !1;
            this.prefs.showPlayerInfo = !0;
            this.hook("searchRegion", e);
            this.nowLoading();
            d("get", this.searchUrl, e, function(d) {
              this.searching = !1;
              this.doneLoading();
              q(this.dom.comments);
              n(this.dom.searchContainer);
              this.showingSearch = !0;
              if ("ERROR" == d.responseText) {
                this.croak(a["error retrieving"]);
              } else {
                if ("NONE" == d.responseText) {
                  q(this.dom.searchResultsContainer), this.dom.searchCount.innerHTML = "No";
                } else {
                  var e = eval("(" + d.responseText + ")");
                  d = e.results;
                  for (var f, m = "", p, v = parseInt(e.total, 10), w = parseInt(e.offset, 10) + 1, u = parseInt(e.offset, 10) + 50, x = 0; f = d[x]; x++) {
                    p = p ? !1 : !0, m += "<a class='search-result" + (p ? " odd" : "") + "' href='#'>                    <span class='id'>" + f.id + "</span>                    <span class='mv'>" + f.mv + "</span>                    <span class='pw'>" + f.pw + " " + f.wr + "</span>                    <span class='pb'>" + f.pb + " " + f.br + "</span>                    <span class='re'>" + f.re + "</span>                    <span class='dt'>" + f.dt + "</span>                    <div class='clear'>&nbsp;</div>                    </a>";
                  }
                  v > u && (m += "<div class='search-more'><a href='#' id='search-more'>Show more...</a></div>");
                  n(this.dom.searchResultsContainer);
                  this.dom.searchResults.innerHTML = m + "<br>";
                  this.dom.searchCount.innerHTML = v;
                  this.dom.searchOffsetStart.innerHTML = w;
                  this.dom.searchOffsetEnd.innerHTML = v < u ? v : u;
                  this.dom.searchContainer.scrollTop = 0;
                  v > u && setTimeout(function() {
                    b(c("search-more"), "click", function(a) {
                      this.loadSearch(F, k[2] + "x" + k[3], l, "corner", e.offset + 51);
                      g(a);
                    }.bind(this));
                  }.bind(this), 0);
                }
              }
            }, function(b) {
              this.croak(a["error retrieving"]);
            }, this, 45e3);
          } else {
            this.searching = !1, n(this.dom.comments), q(this.dom.searchContainer), this.prependComment(a["two edges"]);
          }
        }
      } else {
        n(this.dom.comments), q(this.dom.searchContainer), this.prependComment(a["no search url"]);
      }
    }
  }, loadSearchResult:function(a) {
    this.nowLoading();
    var b = a.target || a.srcElement;
    "SPAN" == b.nodeName && (b = b.parentNode);
    if ("A" == b.nodeName) {
      for (var c, d, e, f = 0; c = b.childNodes[f]; f++) {
        "id" == c.className && (d = c.innerHTML), "mv" == c.className && (e = parseInt(c.innerHTML, 10));
      }
    }
    this.remoteLoad(d, null, !0, [0, e], function() {
      this.doneLoading();
      this.setPermalink();
      this.prefs.showOptions = !0;
      this.handleDisplayPrefs();
    }.bind(this));
    g(a);
  }, closeSearch:function() {
    this.showingSearch = !1;
    q(this.dom.searchContainer);
    n(this.dom.comments);
  }, compressPattern:function(a) {
    for (var b, c = "", d = 1, e = "", f = 0; f < a.length; f++) {
      b = a.charAt(f), b == c ? d++ : (e = e + c + (1 < d ? d : ""), d = 1, c = b);
    }
    return e = e + c + (1 < d ? d : ""), e;
  }, uncompressPattern:function(a) {
    for (var b, c = null, d = "", e = "", f = 0; f < a.length; f++) {
      if (b = a.charAt(f), "." == b || "x" == b || "o" == b) {
        if (null != c) {
          d = parseInt(d, 10);
          d = isNaN(d) ? 1 : d;
          for (var g = 0; g < d; g++) {
            e += c;
          }
          d = "";
        }
        c = b;
      } else {
        d += b;
      }
    }
    d = parseInt(d, 10);
    d = isNaN(d) ? 1 : d;
    for (g = 0; g < d; g++) {
      e += c;
    }
    return e;
  }, createMove:function(a) {
    var b = {};
    b[this.currentColor] = a;
    a = new eidogo.GameNode(null, b);
    a._cached = !0;
    this.totalMoves++;
    this.cursor.node.appendChild(a);
    this.unsavedChanges = [this.cursor.node._children.last(), this.cursor.node];
    this.updatedNavTree = !1;
    this.variation(this.cursor.node._children.length - 1);
  }, handleKeypress:function(a) {
    if (this.editingText) {
      return !0;
    }
    var b = a.keyCode || a.charCode;
    if (!b || a.ctrlKey || a.altKey || a.metaKey) {
      return !0;
    }
    for (var c = String.fromCharCode(b).toLowerCase(), d = [], e = 0; e < this.variations.length; e++) {
      var f = this.variations[e].move, k = this.sgfCoordToPoint(f), m = "" + (e + 1), l = this.board.getMarker(k);
      null != k.x && l != this.board.EMPTY && "string" == typeof l && !d.contains(f) && (m = l.toLowerCase());
      m = m.replace(/^var:/, "");
      if (c == m.charAt(0)) {
        this.variation(this.variations[e].varNum);
        g(a);
        return;
      }
      d.push(f);
    }
    112 != b && 27 != b || this.selectTool("play");
    c = !0;
    switch(b) {
      case 39:
        if (a.shiftKey) {
          for (e = this.totalMoves - this.moveNumber, b = 9 < e ? 9 : e - 1, e = 0; e < b; e++) {
            this.forward(null, null, !0);
          }
        }
        this.forward();
        break;
      case 37:
        if (a.shiftKey) {
          for (b = 9 < this.moveNumber ? 9 : this.moveNumber - 1, e = 0; e < b; e++) {
            this.back(null, null, !0);
          }
        }
        this.back();
        break;
      case 40:
        this.last();
        break;
      case 38:
        this.first();
        break;
      case 192:
        this.pass();
        break;
      default:
        c = !1;
    }
    c && g(a);
  }, showGameInfo:function(a) {
    this.hook("showGameInfo", a);
    a && (this.dom.whiteName && (this.dom.whiteRank.innerHTML = a.WR, this.dom.whiteName.innerHTML = a.PW), this.dom.blackName && (this.dom.blackName.innerHTML = a.PB, this.dom.blackRank.innerHTML = a.BR));
  }, selectTool:function(a) {
    var b;
    q(this.dom.scoreEst);
    q(this.dom.labelInput);
    "region" == a ? b = "crosshair" : "comment" == a ? this.startEditComment() : "gameinfo" == a ? this.startEditGameInfo() : "label" == a ? (n(this.dom.labelInput, "inline"), this.dom.labelInput.focus()) : (b = "default", this.regionBegun = !1, this.hideRegion(), q(this.dom.searchButton), q(this.dom.searchAlgo), this.searchUrl && n(this.dom.scoreEst, "inline"));
    this.board.renderer.setCursor(b);
    this.mode = a;
    this.dom.toolsSelect.value = a;
  }, startEditComment:function() {
    this.closeSearch();
    var a = this.dom.commentsEdit;
    a.style.position = "absolute";
    a.style.top = this.dom.comments.offsetTop + "px";
    a.style.left = this.dom.comments.offsetLeft + "px";
    n(this.dom.shade);
    this.dom.comments.innerHTML = "";
    n(a);
    n(this.dom.commentsEditDone);
    this.dom.commentsEditTa.value = this.cursor.node.C || "";
    this.dom.commentsEditTa.focus();
    this.editingText = !0;
  }, finishEditComment:function() {
    this.editingText = !1;
    var b = this.dom.commentsEditTa.value;
    this.cursor.node.C != b && (this.unsavedChanges = !0, this.cursor.node.C = b);
    this.cursor.node.C || delete this.cursor.node.C;
    q(this.dom.shade);
    q(this.dom.commentsEdit);
    n(this.dom.comments);
    this.selectTool("play");
    b = this.checkForEmptyNode();
    this.refresh();
    b && this.prependComment(a["position deleted"]);
  }, startEditGameInfo:function() {
    this.closeSearch();
    var a = this.dom.gameInfoEdit;
    a.style.position = "absolute";
    a.style.top = this.dom.comments.offsetTop + "px";
    a.style.left = this.dom.comments.offsetLeft + "px";
    n(this.dom.shade);
    this.dom.comments.innerHTML = "";
    n(a);
    n(this.dom.gameInfoEditDone);
    a = this.cursor.getGameRoot();
    var b = ["<table>"], d;
    for (d in this.infoLabels) {
      b.push("<tr><td>" + this.infoLabels[d] + ':</td><td><input type="text" id="game-info-edit-field-' + d + '" value="' + (a[d] || "") + '"></td></tr>');
    }
    b.push("</table>");
    this.dom.gameInfoEditForm.innerHTML = b.join("");
    setTimeout(function() {
      c("game-info-edit-field-GN").focus();
    }, 0);
    this.editingText = !0;
  }, finishEditGameInfo:function() {
    this.editingText = !1;
    q(this.dom.shade);
    q(this.dom.gameInfoEdit);
    n(this.dom.comments);
    var a = this.cursor.getGameRoot(), b;
    for (b in this.infoLabels) {
      var d = c("game-info-edit-field-" + b).value;
      (a[b] || "") != d && (a[b] = d, this.unsavedChanges = !0);
    }
    this.showGameInfo(a);
    this.dom.gameInfoEditForm.innerHTML = "";
    this.selectTool("play");
    this.refresh();
  }, updateControls:function() {
    this.dom.moveNumber.innerHTML = this.moveNumber ? a.move + " " + this.moveNumber : this.permalinkable ? "permalink" : "";
    this.dom.whiteCaptures && (this.dom.whiteCaptures.innerHTML = this.board.captures.W);
    this.dom.blackCaptures && (this.dom.blackCaptures.innerHTML = this.board.captures.B);
    this.dom.whiteTime && this.dom.blacktime && (this.dom.whiteTime.innerHTML = this.timeW ? this.timeW : "--", this.dom.blackTime.innerHTML = this.timeB ? this.timeB : "--");
    k(this.dom.controlPass, "pass-on");
    this.dom.variations.innerHTML = "";
    for (var c = 0; c < this.variations.length; c++) {
      var d = c + 1, e = !1;
      if (!this.variations[c].move || "tt" == this.variations[c].move) {
        l(this.dom.controlPass, "pass-on");
      } else {
        if (this.prefs.markNext || 1 < this.variations.length) {
          var f = this.sgfCoordToPoint(this.variations[c].move);
          if (this.board.getMarker(f) != this.board.EMPTY) {
            var g = this.board.getMarker(f);
            0 !== g.indexOf("var:") ? d = g : e = !0;
          }
          this.prefs.markVariations && !e && this.board.addMarker(f, "var:" + d);
        }
      }
      e = document.createElement("div");
      e.className = "variation-nav";
      e.innerHTML = d;
      b(e, "click", function(a, b) {
        b.me.variation(b.varNum);
      }, {me:this, varNum:this.variations[c].varNum});
      this.dom.variations.appendChild(e);
    }
    2 > this.variations.length && (this.dom.variations.innerHTML = "<div class='variation-nav none'>" + a["no variations"] + "</div>");
    this.cursor.hasNext() ? (l(this.dom.controlForward, "forward-on"), l(this.dom.controlLast, "last-on")) : (k(this.dom.controlForward, "forward-on"), k(this.dom.controlLast, "last-on"));
    this.cursor.hasPrevious() ? (l(this.dom.controlBack, "back-on"), l(this.dom.controlFirst, "first-on")) : (k(this.dom.controlBack, "back-on"), k(this.dom.controlFirst, "first-on"), c = "", this.prefs.showPlayerInfo || (c += this.getGameDescription(!0)), c.length && "problem" != this.theme && this.prependComment(c, "comment-info"));
    this.progressiveLoad || this.updateNavSlider();
    this.prefs.showNavTree && this.updateNavTree();
    c = this.cursor.node;
    var n, q, u;
    c._parent && !c._parent._parent && 1 < c._parent._children.length && (n = c.getPosition(), q = a["multi-game sgf"], u = "javascript:eidogo.delegate(" + this.uniq + ', "goTo", [', n && (q += "<a href='" + u + (n - 1) + ",0])'>" + a["previous game"] + "</a>"), c._parent._children[n + 1] && (q += (n ? " | " : "") + "<a href='" + u + (n + 1) + ",0])'>" + a["next game"] + "</a>"), this.prependComment(q, "comment-info"));
  }, setColor:function(b) {
    this.prependComment("B" == b ? a["black to play"] : a["white to play"]);
    this.currentColor = this.problemColor = b;
  }, setMoveNumber:function(a) {
    this.moveNumber = a;
  }, playMove:function(b, c, d) {
    c = c || this.currentColor;
    this.currentColor = "B" == c ? "W" : "B";
    c = "W" == c ? this.board.WHITE : this.board.BLACK;
    var e = this.sgfCoordToPoint(b);
    b && "tt" != b && "" != b || d ? "resign" == b ? this.prependComment((c == this.board.WHITE ? a.white : a.black) + " " + a.resigned, "comment-resign") : b && "tt" != b && (this.board.addStone(e, c), this.rules.apply(e, c), this.prefs.markCurrent && !d && this.addMarker(b, "current")) : this.prependComment((c == this.board.WHITE ? a.white : a.black) + " " + a.passed, "comment-pass");
  }, addStone:function(a, b) {
    a instanceof Array || (a = [a]);
    a = this.expandCompressedPoints(a);
    for (var c = 0; c < a.length; c++) {
      this.board.addStone(this.sgfCoordToPoint(a[c]), "AW" == b ? this.board.WHITE : "AB" == b ? this.board.BLACK : this.board.EMPTY);
    }
  }, addMarker:function(a, b) {
    a instanceof Array || (a = [a]);
    a = this.expandCompressedPoints(a);
    for (var c, d = 0; d < a.length; d++) {
      switch(b) {
        case "TR":
          c = "triangle";
          break;
        case "SQ":
          c = "square";
          break;
        case "CR":
          c = "circle";
          break;
        case "MA":
          c = "ex";
          break;
        case "TW":
          c = "territory-white";
          break;
        case "TB":
          c = "territory-black";
          break;
        case "DD":
          c = "dim";
          break;
        case "LB":
          c = a[d].split(":")[1];
          break;
        default:
          c = b;
      }
      this.board.addMarker(this.sgfCoordToPoint(a[d].split(":")[0]), c);
    }
  }, showTime:function(a, b) {
    var c = "BL" == b || "OB" == b ? "timeB" : "timeW";
    "BL" == b || "WL" == b ? (b = Math.floor(a / 60), a = (a % 60).toFixed(0), this[c] = b + ":" + ((10 > a ? "0" : "") + a)) : this[c] += " (" + a + ")";
  }, showAnnotation:function(b, c) {
    switch(c) {
      case "N":
        var d = b;
        break;
      case "GB":
        d = 1 < b ? a.vgb : a.gb;
        break;
      case "GW":
        d = 1 < b ? a.vgw : a.gw;
        break;
      case "DM":
        d = 1 < b ? a.dmj : a.dm;
        break;
      case "UC":
        d = a.uc;
        break;
      case "TE":
        d = a.te;
        break;
      case "BM":
        d = 1 < b ? a.vbm : a.bm;
        break;
      case "DO":
        d = a["do"];
        break;
      case "IT":
        d = a.it;
        break;
      case "HO":
        d = a.ho;
    }
    this.prependComment(d);
  }, showComments:function(a, b, c) {
    a && !c && (this.dom.comments.innerHTML += a.replace(/^(\n|\r|\t|\s)+/, "").replace(/\n/g, "<br />"));
  }, prependComment:function(a, b) {
    this.dom.comments.innerHTML = "<div class='" + (b || "comment-status") + "'>" + a + "</div>" + this.dom.comments.innerHTML;
  }, downloadSgf:function(b) {
    g(b);
    this.downloadUrl ? this.unsavedChanges ? alert(a["unsaved changes"]) : location.href = this.downloadUrl + this.gameName : u && (location.href = "data:text/plain," + encodeURIComponent(this.cursor.getGameRoot().toSgf()));
  }, save:function(b) {
    g(b);
    b = this.cursor.getGameRoot().toSgf();
    d("POST", this.saveUrl, {sgf:b}, function(a) {
      this.hook("saved", [a.responseText]);
    }, function(b) {
      this.croak(a["error retrieving"]);
    }, this, 3E4);
  }, constructDom:function() {
    this.dom.player = document.createElement("div");
    this.dom.player.className = "eidogo-player" + (this.theme ? " theme-" + this.theme : "");
    this.dom.player.id = "player-" + this.uniq;
    this.dom.container.innerHTML = "";
    eidogo.util.show(this.dom.container);
    this.dom.container.appendChild(this.dom.player);
    var d = "            <div id='board-container' class='board-container'></div>            <div id='controls-container' class='controls-container'>                <ul id='game-actions' class='game-actions'>\t\t                <li id='control-resign' class='button blue resign'>Resign</li>\t\t                <li id='control-pass' class='button blue pass'>Pass</li>\t\t                <li id='control-undo' class='button blue undo'>Undo</li>                </ul>                <div class='clear-fix'></div>                <div id='replay' class='replay'>                  <ul class='controls'>\t\t                <li id='control-first' class='nav-button first'>First</li>\t\t                <li id='control-back' class='nav-button back'>Back</li>\t\t                <li id='move-number' class='move-number" + 
    (this.permalinkable ? " permalink" : "") + "'></li>\t\t                <li id='control-forward' class='nav-button forward'>Forward</li>\t\t                <li id='control-last' class='nav-button last'>Last</li>\t\t              </ul>\t                <div id='nav-slider' class='nav-slider'>\t                    <div id='nav-slider-thumb' class='nav-slider-thumb'></div>\t                </div>\t                <a href='/g/" + this.uniq + ".sgf' id='control-download' class='export'>Export SGF</a>\t\t            </div>                <div id='variations-container' class='variations-container'>                    <div id='variations-label' class='variations-label'>" + 
    a.variations + ":</div>                    <div id='variations' class='variations'></div>                </div>                <div class='controls-stop'></div>            </div>            <div id='comments' class='comments'></div>            <div id='comments-edit' class='comments-edit'>                <textarea id='comments-edit-ta' class='comments-edit-ta'></textarea>                <div id='comments-edit-done' class='comments-edit-done'>" + a.done + "</div>            </div>            <div id='game-info-edit' class='game-info-edit'>                <div id='game-info-edit-form' class='game-info-edit-form'></div>                <div id='game-info-edit-done' class='game-info-edit-done'>" + 
    a.done + "</div>            </div>            <div id='search-container' class='search-container'>                <div id='search-close' class='search-close'>" + a["close search"] + "</div>                <p class='search-count'><span id='search-count'></span>&nbsp;" + a["matches found"] + "                    Showing <span id='search-offset-start'></span>-<span id='search-offset-end'></span></p>                <div id='search-results-container' class='search-results-container'>                    <div class='search-result'>                        <span class='pw'><b>" + 
    a.white + "</b></span>                        <span class='pb'><b>" + a.black + "</b></span>                        <span class='re'><b>" + a.result + "</b></span>                        <span class='dt'><b>" + a.date + "</b></span>                        <div class='clear'></div>                    </div>                    <div id='search-results' class='search-results'></div>                </div>            </div>            <div id='nav-tree-container' class='nav-tree-container'>                <div id='nav-tree' class='nav-tree'></div>            </div>            <div id='options' class='options'>                " + 
    (this.saveUrl ? "<a id='option-save' class='option-save' href='#'>" + a["save to server"] + "</a>" : "") + "                " + (this.downloadUrl || u ? "<a id='option-download' class='option-download' href='#'>" + a["download sgf"] + "</a>" : "") + "                <div class='options-stop'></div>            </div>            <div id='preferences' class='preferences'>                <div><input type='checkbox'> Show variations on board</div>                <div><input type='checkbox'> Mark current move</div>            </div>            <div id='footer' class='footer'></div>            <div id='shade' class='shade'></div>        ";
    d = d.replace(/ id='([^']+)'/g, " id='$1-" + this.uniq + "'");
    this.dom.player.innerHTML = d;
    for (var f = new RegExp(" id='([^']+)-" + this.uniq + "'", "g"), g, k, l; g = f.exec(d);) {
      k = g[0].replace(/'/g, "").replace(/ id=/, ""), l = "", g[1].split("-").forEach(function(a, b) {
        a = b ? a.charAt(0).toUpperCase() + a.substring(1) : a;
        l += a;
      }), this.dom[l] || (this.dom[l] = c(k));
    }
    [["moveNumber", "setPermalink"], ["controlFirst", "first"], ["controlBack", "back"], ["controlForward", "forward"], ["controlLast", "last"], ["controlPass", "pass"], ["controlUndo", "askForUndo"], ["controlResign", "resign"], ["acceptScore", "acceptScore"], ["scoreEst", "fetchScoreEstimate"], ["searchButton", "searchRegion"], ["searchResults", "loadSearchResult"], ["searchClose", "closeSearch"], ["optionDownload", "downloadSgf"], ["optionSave", "save"], ["commentsEditDone", "finishEditComment"], 
    ["gameInfoEditDone", "finishEditGameInfo"], ["navTree", "navTreeClick"]].forEach(function(a) {
      this.dom[a[0]] && e(this.dom[a[0]], this[a[1]], this);
    }.bind(this));
    b(this.dom.toolsSelect, "change", function(a) {
      this.selectTool.apply(this, [(a.target || a.srcElement).value]);
    }, this, !0);
  }, enableNavSlider:function() {
    if (this.progressiveLoad) {
      q(this.dom.navSliderThumb);
    } else {
      this.dom.navSlider.style.cursor = "pointer";
      var a = !1, c = null;
      b(this.dom.navSlider, "mousedown", function(b) {
        a = !0;
        g(b);
      }, this, !0);
      b(document, "mousemove", function(b) {
        if (a) {
          var d = f(b, this.dom.navSlider);
          clearTimeout(c);
          c = setTimeout(function() {
            this.updateNavSlider(d[0]);
          }.bind(this), 10);
          g(b);
        }
      }, this, !0);
      b(document, "mouseup", function(b) {
        if (!a) {
          return !0;
        }
        a = !1;
        b = f(b, this.dom.navSlider);
        return this.updateNavSlider(b[0]), !0;
      }, this, !0);
    }
  }, updateNavSlider:function(a) {
    var b = this.dom.navSlider.offsetWidth - this.dom.navSliderThumb.offsetHeight, c = this.totalMoves, d = !!a;
    a = a || this.moveNumber / c * b;
    a = a > b ? b : a;
    a = parseInt((0 > a ? 0 : a) / b * c, 10);
    if (d) {
      this.nowLoading();
      d = a - this.cursor.getMoveNumber();
      for (var e = 0; e < Math.abs(d); e++) {
        0 < d ? this.variation(null, !0) : 0 > d && this.cursor.previous();
      }
      0 > d && this.board.revert(Math.abs(d));
      this.doneLoading();
      this.refresh();
    }
    a = parseInt(a / c * b, 10) || 0;
    this.dom.navSliderThumb.style.left = a + "px";
  }, updateNavTree:function(a) {
    if (this.prefs.showNavTree) {
      if (this.updatedNavTree) {
        this.showNavTreeCurrent();
      } else {
        if (a) {
          this.updatedNavTree = !0;
          var b = [];
          a = this.cursor.getGameRoot();
          path = [a.getPosition()];
          e = new eidogo.GameCursor;
          maxx = 0;
          var c = function(a, d, f) {
            for (var g = d, k = a, l = 1; k && 1 == k._children.length;) {
              l++, k = k._children[0];
            }
            for (; b[f] && b[f].slice(g, g + l + 1).some(function(a) {
              return "undefined" != typeof a;
            });) {
              f++;
            }
            do {
              b[f] || (b[f] = []);
              e.node = a;
              a._pathStr = path.join("-") + "-" + (g - d);
              b[f][g] = a;
              g > maxx && (maxx = g);
              g++;
              if (1 != a._children.length) {
                break;
              }
              a = a._children[0];
            } while (a);
            for (d = 0; d < a._children.length; d++) {
              path.push(d), c(a._children[d], g, f), path.pop();
            }
          };
          c(a, 0, 0);
          a = ["<table class='nav-tree'>"];
          var d, e = new eidogo.GameCursor, f, g;
          for (f = 0; f < maxx; f++) {
            var k = !1;
            for (g = b.length - 1; 0 < g; g--) {
              b[g][f] ? k = !1 : "object" == typeof b[g][f + 1] ? (b[g][f] = 1, k = !0) : k && (b[g][f] = 2);
            }
          }
          for (g = 0; g < b.length; g++) {
            a.push("<tr>");
            for (f = 0; f < b[g].length; f++) {
              var l = "";
              k = b[g][f];
              1 == k ? d = "<div class='elbow'></div>" : 2 == k ? d = "<div class='line'></div>" : k ? (l = "horizontal-line", d = ["<a href='#' id='navtree-node-", k._pathStr, "' class='", "undefined" != typeof k.W ? "w" : "undefined" != typeof k.B ? "b" : "x", "'>", f, "</a>"].join("")) : d = "<div class='empty'></div>";
              a.push("<td class='" + l + "'>");
              a.push(d);
              a.push("</td>");
            }
            a.push("</tr>");
          }
          a.push("</table>");
          this.dom.navTree.innerHTML = a.join("");
          setTimeout(function() {
            this.showNavTreeCurrent();
          }.bind(this), 0);
        } else {
          this.navTreeTimeout && clearTimeout(this.navTreeTimeout), this.navTreeTimeout = setTimeout(function() {
            this.updateNavTree(!0);
          }.bind(this), eidogo.browser.ie ? 1E3 : 500);
        }
      }
    }
  }, showNavTreeCurrent:function() {
    var a = "navtree-node-" + this.cursor.getPath().join("-"), b = c(a);
    if (b) {
      this.prevNavTreeCurrent && (this.prevNavTreeCurrent.className = this.prevNavTreeCurrentClass);
      this.prevNavTreeCurrent = b;
      this.prevNavTreeCurrentClass = b.className;
      b.className = "current";
      a = b.offsetWidth;
      var d = b.offsetHeight, e = eidogo.util.getElXY(b), f = eidogo.util.getElXY(this.dom.navTree);
      b = e[0] - f[0];
      e = e[1] - f[1];
      f = this.dom.navTreeContainer;
      var g = f.scrollLeft, k = g + f.offsetWidth - 100;
      maxt = f.scrollTop;
      maxb = maxt + f.offsetHeight - 30;
      b < g && (f.scrollLeft -= g - b);
      b + a > k && (f.scrollLeft += b + a - k);
      e < maxt && (f.scrollTop -= maxt - e);
      e + d > maxb && (f.scrollTop += e + d - maxb);
    }
  }, navTreeClick:function(a) {
    var b = a.target || a.srcElement;
    b && b.id && (b = b.id.replace(/^navtree-node-/, "").split("-"), this.goTo(b, !0), g(a));
  }, resetLastLabels:function() {
    this.labelLastNumber = 1;
    this.labelLastLetter = "A";
  }, getGameDescription:function(a) {
    var b = this.cursor.getGameRoot();
    if (b) {
      return a = a ? "" : b.GN || this.gameName, b.PW && b.PB && (a += (a.length ? " - " : "") + b.PW + (b.WR ? " " + b.WR : "") + " vs " + b.PB + (b.BR ? " " + b.BR : "")), a;
    }
  }, sgfCoordToPoint:function(a) {
    if (!a || "tt" == a) {
      return {x:null, y:null};
    }
    var b = {a:0, b:1, c:2, d:3, e:4, f:5, g:6, h:7, i:8, j:9, k:10, l:11, m:12, n:13, o:14, p:15, q:16, r:17, s:18};
    return {x:b[a.charAt(0)], y:b[a.charAt(1)]};
  }, pointToSgfCoord:function(a) {
    if (!a || this.board && !this.boundsCheck(a.x, a.y, [0, this.board.boardSize - 1])) {
      return null;
    }
    var b = {0:"a", 1:"b", 2:"c", 3:"d", 4:"e", 5:"f", 6:"g", 7:"h", 8:"i", 9:"j", 10:"k", 11:"l", 12:"m", 13:"n", 14:"o", 15:"p", 16:"q", 17:"r", 18:"s"};
    return b[a.x] + b[a.y];
  }, expandCompressedPoints:function(a) {
    for (var b, c, d, e, f = [], g = [], k = 0; k < a.length; k++) {
      if (b = a[k].split(/:/), 1 < b.length) {
        c = this.sgfCoordToPoint(b[0]);
        b = this.sgfCoordToPoint(b[1]);
        for (d = c.x; d <= b.x; d++) {
          for (e = c.y; e <= b.y; e++) {
            f.push(this.pointToSgfCoord({x:d, y:e}));
          }
        }
        g.push(k);
      }
    }
    return a = a.concat(f), a;
  }, setPermalink:function() {
    if (!this.permalinkable) {
      return !0;
    }
    this.unsavedChanges ? alert(a["unsaved changes"]) : this.hook("setPermalink");
  }, nowLoading:function(b) {
    this.croaked || this.problemMode || (b = b || a.loading + "...", c("eidogo-loading-" + this.uniq) || (this.domLoading = document.createElement("div"), this.domLoading.id = "eidogo-loading-" + this.uniq, this.domLoading.className = "eidogo-loading" + (this.theme ? " theme-" + this.theme : ""), this.domLoading.innerHTML = b, this.dom.player.appendChild(this.domLoading)));
  }, doneLoading:function() {
    this.domLoading && null != this.domLoading && this.domLoading.parentNode && (this.domLoading.parentNode.removeChild(this.domLoading), this.domLoading = null);
  }, croak:function(a) {
    this.doneLoading();
    this.board ? alert(a) : this.problemMode ? this.prependComment(a) : (this.dom.player.innerHTML += "<div class='eidogo-error " + (this.theme ? " theme-" + this.theme : "") + "'>" + a.replace(/\n/g, "<br />") + "</div>", this.croaked = !0);
  }};
})();
(function() {
  var a = window.eidogoConfig || {}, c = {theme:"problem", problemMode:!0, markVariations:!1, markNext:!1, shrinkToFit:!0}, d = eidogo.util.getPlayerPath();
  eidogo.playerPath = (a.playerPath || d || "player").replace(/\/$/, "");
  eidogo.util.addEvent(window, "load", function() {
    eidogo.autoPlayers = [];
    for (var b = [], d = document.getElementsByTagName("div"), f = d.length, g = 0; g < f; g++) {
      (eidogo.util.hasClass(d[g], "eidogo-player-auto") || eidogo.util.hasClass(d[g], "eidogo-player-problem")) && b.push(d[g]);
    }
    for (g = 0; d = b[g]; g++) {
      f = {container:d, enableShortcuts:!1, theme:"compact"};
      if (eidogo.util.hasClass(d, "eidogo-player-problem")) {
        for (var l in c) {
          f[l] = c[l];
        }
      }
      for (l in a) {
        f[l] = a[l];
      }
      var k = d.getAttribute("sgf");
      k ? f.sgfUrl = k : d.innerHTML && (f.sgf = d.innerHTML);
      (k = d.getAttribute("shrink")) && (f.shrinkToFit = "no" == k ? !1 : !0);
      d.innerHTML = "";
      eidogo.util.show(d);
      d = new eidogo.Player(f);
      eidogo.autoPlayers.push(d);
    }
  });
})();
goshrine.PlayerRules = function(a, c) {
  this.init(a, c);
};
goshrine.PlayerRules.prototype = {init:function(a, c) {
  this.board = null;
  this.gameToken = c;
  this.pendingCaptures = [];
  this.playerColor = a;
},
	
coordToPos:function(a) {
  return String.fromCharCode(97 + a.x) + String.fromCharCode(97 + a.y);
},
	
check:function(a, c) {
  return 0 > a.x || 0 > a.y || a.x >= this.board.boardSize || a.y >= this.board.boardSize ? !1 : this.board.getStone(a) != this.board.EMPTY ? !1 : c != this.playerColor ? (goshrine.showTemporaryMessage("It's not your turn!"), !1) : ($.post("/game/" + this.gameToken + "/move/" + this.coordToPos(a), null, function(a, b) {
    a.error && goshrine.showTemporaryMessage(a.error);
  }.bind(this), "json"), !1);
},

apply:function(a, c, d) {
  this.doCaptures(a, c);
},
	
doCaptures:function(a, c) {
  var d = 0 + this.doCapture({x:a.x - 1, y:a.y}, c);
  d += this.doCapture({x:a.x + 1, y:a.y}, c);
  d += this.doCapture({x:a.x, y:a.y - 1}, c);
  d += this.doCapture({x:a.x, y:a.y + 1}, c);
  d -= this.doCapture(a, -c);
  0 > d && (c = -c, d = -d);
  c = c == this.board.WHITE ? "W" : "B";
  this.board.captures[c] += d;
},
	
doCapture:function(a, c) {
  this.pendingCaptures = [];
  if (this.findCaptures(a, c)) {
    return 0;
  }
  for (a = this.pendingCaptures.length; this.pendingCaptures.length;) {
    this.board.addStone(this.pendingCaptures.pop(), this.board.EMPTY);
  }
  return a;
},
	
findCaptures:function(a, c) {
  if (0 > a.x || 0 > a.y || a.x >= this.board.boardSize || a.y >= this.board.boardSize || this.board.getStone(a) == c) {
    return 0;
  }
  if (this.board.getStone(a) == this.board.EMPTY) {
    return 1;
  }
  for (var d = 0; d < this.pendingCaptures.length; d++) {
    if (this.pendingCaptures[d].x == a.x && this.pendingCaptures[d].y == a.y) {
      return 0;
    }
  }
  return this.pendingCaptures.push(a), this.findCaptures({x:a.x - 1, y:a.y}, c) ? 1 : this.findCaptures({x:a.x + 1, y:a.y}, c) ? 1 : this.findCaptures({x:a.x, y:a.y - 1}, c) ? 1 : this.findCaptures({x:a.x, y:a.y + 1}, c) ? 1 : 0;
}

};
goshrine.ObserverRules = function() {
  this.init();
};
goshrine.ObserverRules.prototype = new goshrine.PlayerRules;
goshrine.ObserverRules.prototype.check = function(a, c) {
  return !1;
};
GoShrineBoardRenderer = function() {
  this.init.apply(this, arguments);
};
GoShrineBoardRenderer.prototype = {init:function(a, c, d, b) {
  if (!a) {
    throw "No DOM container";
  }
  a.className = "kaya";
  this.boardSize = parseInt(c || 19);
  c = document.createElement("div");
  c.className = "board size-" + this.boardSize;
  c.style.position = b && eidogo.browser.ie ? "static" : "relative";
  a.appendChild(c);
  this.domNode = c;
  this.domContainer = a;
  this.player = d;
  this.uniq = a.id + "-";
  this.renderCache = {stones:[].setLength(this.boardSize, 0).addDimension(this.boardSize, 0), markers:[].setLength(this.boardSize, 0).addDimension(this.boardSize, 0)};
  this.margin = this.pointHeight = this.pointWidth = 0;
  switch(this.boardSize) {
    case 19:
      this.margin = 36;
      break;
    case 13:
      this.margin = 45;
      break;
    case 9:
      this.margin = 57;
  }
  this.pointWidth = this.pointHeight = this._grid_spacing = (this.domNode.offsetWidth - 2 * this.margin) / (this.boardSize - 1);
  this.renderStone({x:0, y:0}, "black");
  this.renderStone({x:0, y:0}, "white");
  this.renderMarker({x:0, y:0}, "current");
  this.clear();
  this.margin = (this.domNode.offsetWidth - this.boardSize * this.pointWidth) / 2;
  this.scrollY = this.scrollX = 0;
  if (b && (this.crop(b), eidogo.browser.ie)) {
    for (a = this.domNode.parentNode; a && a.tagName && !/^body|html$/i.test(a.tagName);) {
      this.scrollX += a.scrollLeft, this.scrollY += a.scrollTop, a = a.parentNode;
    }
  }
  this.dom = {};
  this.dom.searchRegion = document.createElement("div");
  this.dom.searchRegion.id = this.uniq + "search-region";
  this.dom.searchRegion.className = "search-region";
  this.domNode.appendChild(this.dom.searchRegion);
  eidogo.util.addEvent(this.domNode, "mousemove", this.handleHover, this, !0);
  eidogo.util.addEvent(this.domNode, "mousedown", this.handleMouseDown, this, !0);
  eidogo.util.addEvent(this.domNode, "mouseup", this.handleMouseUp, this, !0);
}, showRegion:function(a) {
  this.dom.searchRegion.style.top = this.margin + this.pointHeight * a[0] + "px";
  this.dom.searchRegion.style.left = this.margin + this.pointWidth * a[1] + "px";
  this.dom.searchRegion.style.width = this.pointWidth * a[2] + "px";
  this.dom.searchRegion.style.height = this.pointHeight * a[3] + "px";
  eidogo.util.show(this.dom.searchRegion);
}, hideRegion:function() {
  eidogo.util.hide(this.dom.searchRegion);
}, clear:function() {
  this.domNode.innerHTML = "";
}, renderStone:function(a, c) {
  var d = document.getElementById(this.uniq + "stone-" + a.x + "-" + a.y);
  d && d.parentNode.removeChild(d);
  if ("empty" != c) {
    d = document.createElement("div");
    d.id = this.uniq + "stone-" + a.x + "-" + a.y;
    d.className = "stone size" + this.boardSize + " " + ("black" == c ? "b" : "w");
    try {
      d.style.left = a.x * this.pointWidth + this.margin - this.scrollX + "px", d.style.top = a.y * this.pointHeight + this.margin - this.scrollY + "px";
    } catch (b) {
    }
    return this.domNode.appendChild(d), d;
  }
  return null;
}, renderMarker:function(a, c) {
  if (this.renderCache.markers[a.x][a.y]) {
    var d = document.getElementById(this.uniq + "marker-" + a.x + "-" + a.y);
    d && d.parentNode.removeChild(d);
  }
  if ("empty" == c || !c) {
    return this.renderCache.markers[a.x][a.y] = 0, null;
  }
  this.renderCache.markers[a.x][a.y] = 1;
  if (c) {
    d = "";
    switch(c) {
      case "triangle":
      case "square":
      case "circle":
      case "ex":
      case "territory-white":
      case "territory-black":
      case "dim":
      case "dame":
      case "capture-white":
      case "capture-black":
      case "current":
        break;
      default:
        0 == c.indexOf("var:") ? (d = c.substring(4), c = "variation") : (d = c, c = "label");
    }
    var b = document.createElement("div");
    b.id = this.uniq + "marker-" + a.x + "-" + a.y;
    b.className = "mark size" + this.boardSize + " " + c;
    try {
      b.style.left = a.x * this.pointWidth + this.margin - this.scrollX + "px", b.style.top = a.y * this.pointHeight + this.margin - this.scrollY + "px";
    } catch (e) {
    }
    return b.appendChild(document.createTextNode(d)), this.domNode.appendChild(b), b;
  }
  return null;
}, setCursor:function(a) {
  this.domNode.style.cursor = a;
}, handleHover:function(a) {
  var c = this.getXY(a);
  this.player.handleBoardHover(c[0], c[1], c[2], c[3], a);
}, handleMouseDown:function(a) {
  var c = this.getXY(a);
  this.player.handleBoardMouseDown(c[0], c[1], c[2], c[3], a);
}, handleMouseUp:function(a) {
  a = this.getXY(a);
  this.player.handleBoardMouseUp(a[0], a[1]);
}, getXY:function(a) {
  a = eidogo.util.getElClickXY(a, this.domNode);
  var c = this.margin, d = this.pointWidth, b = this.pointHeight;
  return [Math.round((a[0] - c - d / 2) / d), Math.round((a[1] - c - b / 2) / b), a[0], a[1]];
}, crop:function(a) {
  eidogo.util.addClass(this.domContainer, "shrunk");
  this.domGutter.style.overflow = "hidden";
  var c = a.width * this.pointWidth + 2 * this.margin, d = a.height * this.pointHeight + 2 * this.margin;
  this.domGutter.style.width = c + "px";
  this.domGutter.style.height = d + "px";
  this.player.dom.player.style.width = c + "px";
  this.domGutter.scrollLeft = a.left * this.pointWidth;
  this.domGutter.scrollTop = a.top * this.pointHeight;
}};
eidogo.renderers.goshrine = GoShrineBoardRenderer;

