var JelloModule = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // lib/esm/index.js
  var index_exports = {};
  __export(index_exports, {
    default: () => index_default
  });

  // node_modules/d3-array/src/ascending.js
  function ascending(a, b) {
    return a == null || b == null ? NaN : a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
  }

  // node_modules/d3-array/src/bisector.js
  function bisector(f) {
    let delta = f;
    let compare1 = f;
    let compare2 = f;
    if (f.length === 1) {
      delta = (d, x) => f(d) - x;
      compare1 = ascending;
      compare2 = (d, x) => ascending(f(d), x);
    }
    function left2(a, x, lo = 0, hi = a.length) {
      if (lo < hi) {
        if (compare1(x, x) !== 0) return hi;
        do {
          const mid = lo + hi >>> 1;
          if (compare2(a[mid], x) < 0) lo = mid + 1;
          else hi = mid;
        } while (lo < hi);
      }
      return lo;
    }
    function right2(a, x, lo = 0, hi = a.length) {
      if (lo < hi) {
        if (compare1(x, x) !== 0) return hi;
        do {
          const mid = lo + hi >>> 1;
          if (compare2(a[mid], x) <= 0) lo = mid + 1;
          else hi = mid;
        } while (lo < hi);
      }
      return lo;
    }
    function center2(a, x, lo = 0, hi = a.length) {
      const i = left2(a, x, lo, hi - 1);
      return i > lo && delta(a[i - 1], x) > -delta(a[i], x) ? i - 1 : i;
    }
    return { left: left2, center: center2, right: right2 };
  }

  // node_modules/d3-array/src/number.js
  function number(x) {
    return x === null ? NaN : +x;
  }

  // node_modules/d3-array/src/bisect.js
  var ascendingBisect = bisector(ascending);
  var bisectRight = ascendingBisect.right;
  var bisectLeft = ascendingBisect.left;
  var bisectCenter = bisector(number).center;
  var bisect_default = bisectRight;

  // node_modules/internmap/src/index.js
  var InternMap = class extends Map {
    constructor(entries, key = keyof) {
      super();
      Object.defineProperties(this, { _intern: { value: /* @__PURE__ */ new Map() }, _key: { value: key } });
      if (entries != null) for (const [key2, value] of entries) this.set(key2, value);
    }
    get(key) {
      return super.get(intern_get(this, key));
    }
    has(key) {
      return super.has(intern_get(this, key));
    }
    set(key, value) {
      return super.set(intern_set(this, key), value);
    }
    delete(key) {
      return super.delete(intern_delete(this, key));
    }
  };
  function intern_get({ _intern, _key }, value) {
    const key = _key(value);
    return _intern.has(key) ? _intern.get(key) : value;
  }
  function intern_set({ _intern, _key }, value) {
    const key = _key(value);
    if (_intern.has(key)) return _intern.get(key);
    _intern.set(key, value);
    return value;
  }
  function intern_delete({ _intern, _key }, value) {
    const key = _key(value);
    if (_intern.has(key)) {
      value = _intern.get(value);
      _intern.delete(key);
    }
    return value;
  }
  function keyof(value) {
    return value !== null && typeof value === "object" ? value.valueOf() : value;
  }

  // node_modules/d3-array/src/ticks.js
  var e10 = Math.sqrt(50);
  var e5 = Math.sqrt(10);
  var e2 = Math.sqrt(2);
  function ticks(start2, stop, count2) {
    var reverse, i = -1, n, ticks2, step;
    stop = +stop, start2 = +start2, count2 = +count2;
    if (start2 === stop && count2 > 0) return [start2];
    if (reverse = stop < start2) n = start2, start2 = stop, stop = n;
    if ((step = tickIncrement(start2, stop, count2)) === 0 || !isFinite(step)) return [];
    if (step > 0) {
      let r0 = Math.round(start2 / step), r1 = Math.round(stop / step);
      if (r0 * step < start2) ++r0;
      if (r1 * step > stop) --r1;
      ticks2 = new Array(n = r1 - r0 + 1);
      while (++i < n) ticks2[i] = (r0 + i) * step;
    } else {
      step = -step;
      let r0 = Math.round(start2 * step), r1 = Math.round(stop * step);
      if (r0 / step < start2) ++r0;
      if (r1 / step > stop) --r1;
      ticks2 = new Array(n = r1 - r0 + 1);
      while (++i < n) ticks2[i] = (r0 + i) / step;
    }
    if (reverse) ticks2.reverse();
    return ticks2;
  }
  function tickIncrement(start2, stop, count2) {
    var step = (stop - start2) / Math.max(0, count2), power = Math.floor(Math.log(step) / Math.LN10), error = step / Math.pow(10, power);
    return power >= 0 ? (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1) * Math.pow(10, power) : -Math.pow(10, -power) / (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1);
  }
  function tickStep(start2, stop, count2) {
    var step0 = Math.abs(stop - start2) / Math.max(0, count2), step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)), error = step0 / step1;
    if (error >= e10) step1 *= 10;
    else if (error >= e5) step1 *= 5;
    else if (error >= e2) step1 *= 2;
    return stop < start2 ? -step1 : step1;
  }

  // node_modules/d3-array/src/range.js
  function range(start2, stop, step) {
    start2 = +start2, stop = +stop, step = (n = arguments.length) < 2 ? (stop = start2, start2 = 0, 1) : n < 3 ? 1 : +step;
    var i = -1, n = Math.max(0, Math.ceil((stop - start2) / step)) | 0, range2 = new Array(n);
    while (++i < n) {
      range2[i] = start2 + i * step;
    }
    return range2;
  }

  // node_modules/d3-axis/src/identity.js
  function identity_default(x) {
    return x;
  }

  // node_modules/d3-axis/src/axis.js
  var top = 1;
  var right = 2;
  var bottom = 3;
  var left = 4;
  var epsilon = 1e-6;
  function translateX(x) {
    return "translate(" + x + ",0)";
  }
  function translateY(y) {
    return "translate(0," + y + ")";
  }
  function number2(scale) {
    return (d) => +scale(d);
  }
  function center(scale, offset) {
    offset = Math.max(0, scale.bandwidth() - offset * 2) / 2;
    if (scale.round()) offset = Math.round(offset);
    return (d) => +scale(d) + offset;
  }
  function entering() {
    return !this.__axis;
  }
  function axis(orient, scale) {
    var tickArguments = [], tickValues = null, tickFormat2 = null, tickSizeInner = 6, tickSizeOuter = 6, tickPadding = 3, offset = typeof window !== "undefined" && window.devicePixelRatio > 1 ? 0 : 0.5, k = orient === top || orient === left ? -1 : 1, x = orient === left || orient === right ? "x" : "y", transform2 = orient === top || orient === bottom ? translateX : translateY;
    function axis2(context) {
      var values = tickValues == null ? scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain() : tickValues, format2 = tickFormat2 == null ? scale.tickFormat ? scale.tickFormat.apply(scale, tickArguments) : identity_default : tickFormat2, spacing = Math.max(tickSizeInner, 0) + tickPadding, range2 = scale.range(), range0 = +range2[0] + offset, range1 = +range2[range2.length - 1] + offset, position = (scale.bandwidth ? center : number2)(scale.copy(), offset), selection2 = context.selection ? context.selection() : context, path = selection2.selectAll(".domain").data([null]), tick = selection2.selectAll(".tick").data(values, scale).order(), tickExit = tick.exit(), tickEnter = tick.enter().append("g").attr("class", "tick"), line = tick.select("line"), text = tick.select("text");
      path = path.merge(path.enter().insert("path", ".tick").attr("class", "domain").attr("stroke", "currentColor"));
      tick = tick.merge(tickEnter);
      line = line.merge(tickEnter.append("line").attr("stroke", "currentColor").attr(x + "2", k * tickSizeInner));
      text = text.merge(tickEnter.append("text").attr("fill", "currentColor").attr(x, k * spacing).attr("dy", orient === top ? "0em" : orient === bottom ? "0.71em" : "0.32em"));
      if (context !== selection2) {
        path = path.transition(context);
        tick = tick.transition(context);
        line = line.transition(context);
        text = text.transition(context);
        tickExit = tickExit.transition(context).attr("opacity", epsilon).attr("transform", function(d) {
          return isFinite(d = position(d)) ? transform2(d + offset) : this.getAttribute("transform");
        });
        tickEnter.attr("opacity", epsilon).attr("transform", function(d) {
          var p = this.parentNode.__axis;
          return transform2((p && isFinite(p = p(d)) ? p : position(d)) + offset);
        });
      }
      tickExit.remove();
      path.attr("d", orient === left || orient === right ? tickSizeOuter ? "M" + k * tickSizeOuter + "," + range0 + "H" + offset + "V" + range1 + "H" + k * tickSizeOuter : "M" + offset + "," + range0 + "V" + range1 : tickSizeOuter ? "M" + range0 + "," + k * tickSizeOuter + "V" + offset + "H" + range1 + "V" + k * tickSizeOuter : "M" + range0 + "," + offset + "H" + range1);
      tick.attr("opacity", 1).attr("transform", function(d) {
        return transform2(position(d) + offset);
      });
      line.attr(x + "2", k * tickSizeInner);
      text.attr(x, k * spacing).text(format2);
      selection2.filter(entering).attr("fill", "none").attr("font-size", 10).attr("font-family", "sans-serif").attr("text-anchor", orient === right ? "start" : orient === left ? "end" : "middle");
      selection2.each(function() {
        this.__axis = position;
      });
    }
    axis2.scale = function(_) {
      return arguments.length ? (scale = _, axis2) : scale;
    };
    axis2.ticks = function() {
      return tickArguments = Array.from(arguments), axis2;
    };
    axis2.tickArguments = function(_) {
      return arguments.length ? (tickArguments = _ == null ? [] : Array.from(_), axis2) : tickArguments.slice();
    };
    axis2.tickValues = function(_) {
      return arguments.length ? (tickValues = _ == null ? null : Array.from(_), axis2) : tickValues && tickValues.slice();
    };
    axis2.tickFormat = function(_) {
      return arguments.length ? (tickFormat2 = _, axis2) : tickFormat2;
    };
    axis2.tickSize = function(_) {
      return arguments.length ? (tickSizeInner = tickSizeOuter = +_, axis2) : tickSizeInner;
    };
    axis2.tickSizeInner = function(_) {
      return arguments.length ? (tickSizeInner = +_, axis2) : tickSizeInner;
    };
    axis2.tickSizeOuter = function(_) {
      return arguments.length ? (tickSizeOuter = +_, axis2) : tickSizeOuter;
    };
    axis2.tickPadding = function(_) {
      return arguments.length ? (tickPadding = +_, axis2) : tickPadding;
    };
    axis2.offset = function(_) {
      return arguments.length ? (offset = +_, axis2) : offset;
    };
    return axis2;
  }
  function axisBottom(scale) {
    return axis(bottom, scale);
  }
  function axisLeft(scale) {
    return axis(left, scale);
  }

  // node_modules/d3-dispatch/src/dispatch.js
  var noop = { value: () => {
  } };
  function dispatch() {
    for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
      if (!(t = arguments[i] + "") || t in _ || /[\s.]/.test(t)) throw new Error("illegal type: " + t);
      _[t] = [];
    }
    return new Dispatch(_);
  }
  function Dispatch(_) {
    this._ = _;
  }
  function parseTypenames(typenames, types) {
    return typenames.trim().split(/^|\s+/).map(function(t) {
      var name = "", i = t.indexOf(".");
      if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
      if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
      return { type: t, name };
    });
  }
  Dispatch.prototype = dispatch.prototype = {
    constructor: Dispatch,
    on: function(typename, callback) {
      var _ = this._, T = parseTypenames(typename + "", _), t, i = -1, n = T.length;
      if (arguments.length < 2) {
        while (++i < n) if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name))) return t;
        return;
      }
      if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
      while (++i < n) {
        if (t = (typename = T[i]).type) _[t] = set(_[t], typename.name, callback);
        else if (callback == null) for (t in _) _[t] = set(_[t], typename.name, null);
      }
      return this;
    },
    copy: function() {
      var copy2 = {}, _ = this._;
      for (var t in _) copy2[t] = _[t].slice();
      return new Dispatch(copy2);
    },
    call: function(type2, that) {
      if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
      if (!this._.hasOwnProperty(type2)) throw new Error("unknown type: " + type2);
      for (t = this._[type2], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
    },
    apply: function(type2, that, args) {
      if (!this._.hasOwnProperty(type2)) throw new Error("unknown type: " + type2);
      for (var t = this._[type2], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
    }
  };
  function get(type2, name) {
    for (var i = 0, n = type2.length, c; i < n; ++i) {
      if ((c = type2[i]).name === name) {
        return c.value;
      }
    }
  }
  function set(type2, name, callback) {
    for (var i = 0, n = type2.length; i < n; ++i) {
      if (type2[i].name === name) {
        type2[i] = noop, type2 = type2.slice(0, i).concat(type2.slice(i + 1));
        break;
      }
    }
    if (callback != null) type2.push({ name, value: callback });
    return type2;
  }
  var dispatch_default = dispatch;

  // node_modules/d3-selection/src/namespaces.js
  var xhtml = "http://www.w3.org/1999/xhtml";
  var namespaces_default = {
    svg: "http://www.w3.org/2000/svg",
    xhtml,
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/"
  };

  // node_modules/d3-selection/src/namespace.js
  function namespace_default(name) {
    var prefix2 = name += "", i = prefix2.indexOf(":");
    if (i >= 0 && (prefix2 = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
    return namespaces_default.hasOwnProperty(prefix2) ? { space: namespaces_default[prefix2], local: name } : name;
  }

  // node_modules/d3-selection/src/creator.js
  function creatorInherit(name) {
    return function() {
      var document2 = this.ownerDocument, uri = this.namespaceURI;
      return uri === xhtml && document2.documentElement.namespaceURI === xhtml ? document2.createElement(name) : document2.createElementNS(uri, name);
    };
  }
  function creatorFixed(fullname) {
    return function() {
      return this.ownerDocument.createElementNS(fullname.space, fullname.local);
    };
  }
  function creator_default(name) {
    var fullname = namespace_default(name);
    return (fullname.local ? creatorFixed : creatorInherit)(fullname);
  }

  // node_modules/d3-selection/src/selector.js
  function none() {
  }
  function selector_default(selector) {
    return selector == null ? none : function() {
      return this.querySelector(selector);
    };
  }

  // node_modules/d3-selection/src/selection/select.js
  function select_default(select) {
    if (typeof select !== "function") select = selector_default(select);
    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
        if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
          if ("__data__" in node) subnode.__data__ = node.__data__;
          subgroup[i] = subnode;
        }
      }
    }
    return new Selection(subgroups, this._parents);
  }

  // node_modules/d3-selection/src/array.js
  function array(x) {
    return x == null ? [] : Array.isArray(x) ? x : Array.from(x);
  }

  // node_modules/d3-selection/src/selectorAll.js
  function empty() {
    return [];
  }
  function selectorAll_default(selector) {
    return selector == null ? empty : function() {
      return this.querySelectorAll(selector);
    };
  }

  // node_modules/d3-selection/src/selection/selectAll.js
  function arrayAll(select) {
    return function() {
      return array(select.apply(this, arguments));
    };
  }
  function selectAll_default(select) {
    if (typeof select === "function") select = arrayAll(select);
    else select = selectorAll_default(select);
    for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          subgroups.push(select.call(node, node.__data__, i, group));
          parents.push(node);
        }
      }
    }
    return new Selection(subgroups, parents);
  }

  // node_modules/d3-selection/src/matcher.js
  function matcher_default(selector) {
    return function() {
      return this.matches(selector);
    };
  }
  function childMatcher(selector) {
    return function(node) {
      return node.matches(selector);
    };
  }

  // node_modules/d3-selection/src/selection/selectChild.js
  var find = Array.prototype.find;
  function childFind(match) {
    return function() {
      return find.call(this.children, match);
    };
  }
  function childFirst() {
    return this.firstElementChild;
  }
  function selectChild_default(match) {
    return this.select(match == null ? childFirst : childFind(typeof match === "function" ? match : childMatcher(match)));
  }

  // node_modules/d3-selection/src/selection/selectChildren.js
  var filter = Array.prototype.filter;
  function children() {
    return Array.from(this.children);
  }
  function childrenFilter(match) {
    return function() {
      return filter.call(this.children, match);
    };
  }
  function selectChildren_default(match) {
    return this.selectAll(match == null ? children : childrenFilter(typeof match === "function" ? match : childMatcher(match)));
  }

  // node_modules/d3-selection/src/selection/filter.js
  function filter_default(match) {
    if (typeof match !== "function") match = matcher_default(match);
    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
        if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
          subgroup.push(node);
        }
      }
    }
    return new Selection(subgroups, this._parents);
  }

  // node_modules/d3-selection/src/selection/sparse.js
  function sparse_default(update) {
    return new Array(update.length);
  }

  // node_modules/d3-selection/src/selection/enter.js
  function enter_default() {
    return new Selection(this._enter || this._groups.map(sparse_default), this._parents);
  }
  function EnterNode(parent, datum2) {
    this.ownerDocument = parent.ownerDocument;
    this.namespaceURI = parent.namespaceURI;
    this._next = null;
    this._parent = parent;
    this.__data__ = datum2;
  }
  EnterNode.prototype = {
    constructor: EnterNode,
    appendChild: function(child) {
      return this._parent.insertBefore(child, this._next);
    },
    insertBefore: function(child, next) {
      return this._parent.insertBefore(child, next);
    },
    querySelector: function(selector) {
      return this._parent.querySelector(selector);
    },
    querySelectorAll: function(selector) {
      return this._parent.querySelectorAll(selector);
    }
  };

  // node_modules/d3-selection/src/constant.js
  function constant_default(x) {
    return function() {
      return x;
    };
  }

  // node_modules/d3-selection/src/selection/data.js
  function bindIndex(parent, group, enter, update, exit, data) {
    var i = 0, node, groupLength = group.length, dataLength = data.length;
    for (; i < dataLength; ++i) {
      if (node = group[i]) {
        node.__data__ = data[i];
        update[i] = node;
      } else {
        enter[i] = new EnterNode(parent, data[i]);
      }
    }
    for (; i < groupLength; ++i) {
      if (node = group[i]) {
        exit[i] = node;
      }
    }
  }
  function bindKey(parent, group, enter, update, exit, data, key) {
    var i, node, nodeByKeyValue = /* @__PURE__ */ new Map(), groupLength = group.length, dataLength = data.length, keyValues = new Array(groupLength), keyValue;
    for (i = 0; i < groupLength; ++i) {
      if (node = group[i]) {
        keyValues[i] = keyValue = key.call(node, node.__data__, i, group) + "";
        if (nodeByKeyValue.has(keyValue)) {
          exit[i] = node;
        } else {
          nodeByKeyValue.set(keyValue, node);
        }
      }
    }
    for (i = 0; i < dataLength; ++i) {
      keyValue = key.call(parent, data[i], i, data) + "";
      if (node = nodeByKeyValue.get(keyValue)) {
        update[i] = node;
        node.__data__ = data[i];
        nodeByKeyValue.delete(keyValue);
      } else {
        enter[i] = new EnterNode(parent, data[i]);
      }
    }
    for (i = 0; i < groupLength; ++i) {
      if ((node = group[i]) && nodeByKeyValue.get(keyValues[i]) === node) {
        exit[i] = node;
      }
    }
  }
  function datum(node) {
    return node.__data__;
  }
  function data_default(value, key) {
    if (!arguments.length) return Array.from(this, datum);
    var bind = key ? bindKey : bindIndex, parents = this._parents, groups = this._groups;
    if (typeof value !== "function") value = constant_default(value);
    for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
      var parent = parents[j], group = groups[j], groupLength = group.length, data = arraylike(value.call(parent, parent && parent.__data__, j, parents)), dataLength = data.length, enterGroup = enter[j] = new Array(dataLength), updateGroup = update[j] = new Array(dataLength), exitGroup = exit[j] = new Array(groupLength);
      bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);
      for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
        if (previous = enterGroup[i0]) {
          if (i0 >= i1) i1 = i0 + 1;
          while (!(next = updateGroup[i1]) && ++i1 < dataLength) ;
          previous._next = next || null;
        }
      }
    }
    update = new Selection(update, parents);
    update._enter = enter;
    update._exit = exit;
    return update;
  }
  function arraylike(data) {
    return typeof data === "object" && "length" in data ? data : Array.from(data);
  }

  // node_modules/d3-selection/src/selection/exit.js
  function exit_default() {
    return new Selection(this._exit || this._groups.map(sparse_default), this._parents);
  }

  // node_modules/d3-selection/src/selection/join.js
  function join_default(onenter, onupdate, onexit) {
    var enter = this.enter(), update = this, exit = this.exit();
    if (typeof onenter === "function") {
      enter = onenter(enter);
      if (enter) enter = enter.selection();
    } else {
      enter = enter.append(onenter + "");
    }
    if (onupdate != null) {
      update = onupdate(update);
      if (update) update = update.selection();
    }
    if (onexit == null) exit.remove();
    else onexit(exit);
    return enter && update ? enter.merge(update).order() : update;
  }

  // node_modules/d3-selection/src/selection/merge.js
  function merge_default(context) {
    var selection2 = context.selection ? context.selection() : context;
    for (var groups0 = this._groups, groups1 = selection2._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
      for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
        if (node = group0[i] || group1[i]) {
          merge[i] = node;
        }
      }
    }
    for (; j < m0; ++j) {
      merges[j] = groups0[j];
    }
    return new Selection(merges, this._parents);
  }

  // node_modules/d3-selection/src/selection/order.js
  function order_default() {
    for (var groups = this._groups, j = -1, m = groups.length; ++j < m; ) {
      for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0; ) {
        if (node = group[i]) {
          if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
          next = node;
        }
      }
    }
    return this;
  }

  // node_modules/d3-selection/src/selection/sort.js
  function sort_default(compare) {
    if (!compare) compare = ascending2;
    function compareNode(a, b) {
      return a && b ? compare(a.__data__, b.__data__) : !a - !b;
    }
    for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          sortgroup[i] = node;
        }
      }
      sortgroup.sort(compareNode);
    }
    return new Selection(sortgroups, this._parents).order();
  }
  function ascending2(a, b) {
    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
  }

  // node_modules/d3-selection/src/selection/call.js
  function call_default() {
    var callback = arguments[0];
    arguments[0] = this;
    callback.apply(null, arguments);
    return this;
  }

  // node_modules/d3-selection/src/selection/nodes.js
  function nodes_default() {
    return Array.from(this);
  }

  // node_modules/d3-selection/src/selection/node.js
  function node_default() {
    for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
      for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
        var node = group[i];
        if (node) return node;
      }
    }
    return null;
  }

  // node_modules/d3-selection/src/selection/size.js
  function size_default() {
    let size = 0;
    for (const node of this) ++size;
    return size;
  }

  // node_modules/d3-selection/src/selection/empty.js
  function empty_default() {
    return !this.node();
  }

  // node_modules/d3-selection/src/selection/each.js
  function each_default(callback) {
    for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
      for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
        if (node = group[i]) callback.call(node, node.__data__, i, group);
      }
    }
    return this;
  }

  // node_modules/d3-selection/src/selection/attr.js
  function attrRemove(name) {
    return function() {
      this.removeAttribute(name);
    };
  }
  function attrRemoveNS(fullname) {
    return function() {
      this.removeAttributeNS(fullname.space, fullname.local);
    };
  }
  function attrConstant(name, value) {
    return function() {
      this.setAttribute(name, value);
    };
  }
  function attrConstantNS(fullname, value) {
    return function() {
      this.setAttributeNS(fullname.space, fullname.local, value);
    };
  }
  function attrFunction(name, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) this.removeAttribute(name);
      else this.setAttribute(name, v);
    };
  }
  function attrFunctionNS(fullname, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
      else this.setAttributeNS(fullname.space, fullname.local, v);
    };
  }
  function attr_default(name, value) {
    var fullname = namespace_default(name);
    if (arguments.length < 2) {
      var node = this.node();
      return fullname.local ? node.getAttributeNS(fullname.space, fullname.local) : node.getAttribute(fullname);
    }
    return this.each((value == null ? fullname.local ? attrRemoveNS : attrRemove : typeof value === "function" ? fullname.local ? attrFunctionNS : attrFunction : fullname.local ? attrConstantNS : attrConstant)(fullname, value));
  }

  // node_modules/d3-selection/src/window.js
  function window_default(node) {
    return node.ownerDocument && node.ownerDocument.defaultView || node.document && node || node.defaultView;
  }

  // node_modules/d3-selection/src/selection/style.js
  function styleRemove(name) {
    return function() {
      this.style.removeProperty(name);
    };
  }
  function styleConstant(name, value, priority) {
    return function() {
      this.style.setProperty(name, value, priority);
    };
  }
  function styleFunction(name, value, priority) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) this.style.removeProperty(name);
      else this.style.setProperty(name, v, priority);
    };
  }
  function style_default(name, value, priority) {
    return arguments.length > 1 ? this.each((value == null ? styleRemove : typeof value === "function" ? styleFunction : styleConstant)(name, value, priority == null ? "" : priority)) : styleValue(this.node(), name);
  }
  function styleValue(node, name) {
    return node.style.getPropertyValue(name) || window_default(node).getComputedStyle(node, null).getPropertyValue(name);
  }

  // node_modules/d3-selection/src/selection/property.js
  function propertyRemove(name) {
    return function() {
      delete this[name];
    };
  }
  function propertyConstant(name, value) {
    return function() {
      this[name] = value;
    };
  }
  function propertyFunction(name, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) delete this[name];
      else this[name] = v;
    };
  }
  function property_default(name, value) {
    return arguments.length > 1 ? this.each((value == null ? propertyRemove : typeof value === "function" ? propertyFunction : propertyConstant)(name, value)) : this.node()[name];
  }

  // node_modules/d3-selection/src/selection/classed.js
  function classArray(string) {
    return string.trim().split(/^|\s+/);
  }
  function classList(node) {
    return node.classList || new ClassList(node);
  }
  function ClassList(node) {
    this._node = node;
    this._names = classArray(node.getAttribute("class") || "");
  }
  ClassList.prototype = {
    add: function(name) {
      var i = this._names.indexOf(name);
      if (i < 0) {
        this._names.push(name);
        this._node.setAttribute("class", this._names.join(" "));
      }
    },
    remove: function(name) {
      var i = this._names.indexOf(name);
      if (i >= 0) {
        this._names.splice(i, 1);
        this._node.setAttribute("class", this._names.join(" "));
      }
    },
    contains: function(name) {
      return this._names.indexOf(name) >= 0;
    }
  };
  function classedAdd(node, names) {
    var list = classList(node), i = -1, n = names.length;
    while (++i < n) list.add(names[i]);
  }
  function classedRemove(node, names) {
    var list = classList(node), i = -1, n = names.length;
    while (++i < n) list.remove(names[i]);
  }
  function classedTrue(names) {
    return function() {
      classedAdd(this, names);
    };
  }
  function classedFalse(names) {
    return function() {
      classedRemove(this, names);
    };
  }
  function classedFunction(names, value) {
    return function() {
      (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
    };
  }
  function classed_default(name, value) {
    var names = classArray(name + "");
    if (arguments.length < 2) {
      var list = classList(this.node()), i = -1, n = names.length;
      while (++i < n) if (!list.contains(names[i])) return false;
      return true;
    }
    return this.each((typeof value === "function" ? classedFunction : value ? classedTrue : classedFalse)(names, value));
  }

  // node_modules/d3-selection/src/selection/text.js
  function textRemove() {
    this.textContent = "";
  }
  function textConstant(value) {
    return function() {
      this.textContent = value;
    };
  }
  function textFunction(value) {
    return function() {
      var v = value.apply(this, arguments);
      this.textContent = v == null ? "" : v;
    };
  }
  function text_default(value) {
    return arguments.length ? this.each(value == null ? textRemove : (typeof value === "function" ? textFunction : textConstant)(value)) : this.node().textContent;
  }

  // node_modules/d3-selection/src/selection/html.js
  function htmlRemove() {
    this.innerHTML = "";
  }
  function htmlConstant(value) {
    return function() {
      this.innerHTML = value;
    };
  }
  function htmlFunction(value) {
    return function() {
      var v = value.apply(this, arguments);
      this.innerHTML = v == null ? "" : v;
    };
  }
  function html_default(value) {
    return arguments.length ? this.each(value == null ? htmlRemove : (typeof value === "function" ? htmlFunction : htmlConstant)(value)) : this.node().innerHTML;
  }

  // node_modules/d3-selection/src/selection/raise.js
  function raise() {
    if (this.nextSibling) this.parentNode.appendChild(this);
  }
  function raise_default() {
    return this.each(raise);
  }

  // node_modules/d3-selection/src/selection/lower.js
  function lower() {
    if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
  }
  function lower_default() {
    return this.each(lower);
  }

  // node_modules/d3-selection/src/selection/append.js
  function append_default(name) {
    var create2 = typeof name === "function" ? name : creator_default(name);
    return this.select(function() {
      return this.appendChild(create2.apply(this, arguments));
    });
  }

  // node_modules/d3-selection/src/selection/insert.js
  function constantNull() {
    return null;
  }
  function insert_default(name, before) {
    var create2 = typeof name === "function" ? name : creator_default(name), select = before == null ? constantNull : typeof before === "function" ? before : selector_default(before);
    return this.select(function() {
      return this.insertBefore(create2.apply(this, arguments), select.apply(this, arguments) || null);
    });
  }

  // node_modules/d3-selection/src/selection/remove.js
  function remove() {
    var parent = this.parentNode;
    if (parent) parent.removeChild(this);
  }
  function remove_default() {
    return this.each(remove);
  }

  // node_modules/d3-selection/src/selection/clone.js
  function selection_cloneShallow() {
    var clone = this.cloneNode(false), parent = this.parentNode;
    return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
  }
  function selection_cloneDeep() {
    var clone = this.cloneNode(true), parent = this.parentNode;
    return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
  }
  function clone_default(deep) {
    return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
  }

  // node_modules/d3-selection/src/selection/datum.js
  function datum_default(value) {
    return arguments.length ? this.property("__data__", value) : this.node().__data__;
  }

  // node_modules/d3-selection/src/selection/on.js
  function contextListener(listener) {
    return function(event) {
      listener.call(this, event, this.__data__);
    };
  }
  function parseTypenames2(typenames) {
    return typenames.trim().split(/^|\s+/).map(function(t) {
      var name = "", i = t.indexOf(".");
      if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
      return { type: t, name };
    });
  }
  function onRemove(typename) {
    return function() {
      var on = this.__on;
      if (!on) return;
      for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
        if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
          this.removeEventListener(o.type, o.listener, o.options);
        } else {
          on[++i] = o;
        }
      }
      if (++i) on.length = i;
      else delete this.__on;
    };
  }
  function onAdd(typename, value, options) {
    return function() {
      var on = this.__on, o, listener = contextListener(value);
      if (on) for (var j = 0, m = on.length; j < m; ++j) {
        if ((o = on[j]).type === typename.type && o.name === typename.name) {
          this.removeEventListener(o.type, o.listener, o.options);
          this.addEventListener(o.type, o.listener = listener, o.options = options);
          o.value = value;
          return;
        }
      }
      this.addEventListener(typename.type, listener, options);
      o = { type: typename.type, name: typename.name, value, listener, options };
      if (!on) this.__on = [o];
      else on.push(o);
    };
  }
  function on_default(typename, value, options) {
    var typenames = parseTypenames2(typename + ""), i, n = typenames.length, t;
    if (arguments.length < 2) {
      var on = this.node().__on;
      if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
        for (i = 0, o = on[j]; i < n; ++i) {
          if ((t = typenames[i]).type === o.type && t.name === o.name) {
            return o.value;
          }
        }
      }
      return;
    }
    on = value ? onAdd : onRemove;
    for (i = 0; i < n; ++i) this.each(on(typenames[i], value, options));
    return this;
  }

  // node_modules/d3-selection/src/selection/dispatch.js
  function dispatchEvent(node, type2, params) {
    var window2 = window_default(node), event = window2.CustomEvent;
    if (typeof event === "function") {
      event = new event(type2, params);
    } else {
      event = window2.document.createEvent("Event");
      if (params) event.initEvent(type2, params.bubbles, params.cancelable), event.detail = params.detail;
      else event.initEvent(type2, false, false);
    }
    node.dispatchEvent(event);
  }
  function dispatchConstant(type2, params) {
    return function() {
      return dispatchEvent(this, type2, params);
    };
  }
  function dispatchFunction(type2, params) {
    return function() {
      return dispatchEvent(this, type2, params.apply(this, arguments));
    };
  }
  function dispatch_default2(type2, params) {
    return this.each((typeof params === "function" ? dispatchFunction : dispatchConstant)(type2, params));
  }

  // node_modules/d3-selection/src/selection/iterator.js
  function* iterator_default() {
    for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
      for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
        if (node = group[i]) yield node;
      }
    }
  }

  // node_modules/d3-selection/src/selection/index.js
  var root = [null];
  function Selection(groups, parents) {
    this._groups = groups;
    this._parents = parents;
  }
  function selection() {
    return new Selection([[document.documentElement]], root);
  }
  function selection_selection() {
    return this;
  }
  Selection.prototype = selection.prototype = {
    constructor: Selection,
    select: select_default,
    selectAll: selectAll_default,
    selectChild: selectChild_default,
    selectChildren: selectChildren_default,
    filter: filter_default,
    data: data_default,
    enter: enter_default,
    exit: exit_default,
    join: join_default,
    merge: merge_default,
    selection: selection_selection,
    order: order_default,
    sort: sort_default,
    call: call_default,
    nodes: nodes_default,
    node: node_default,
    size: size_default,
    empty: empty_default,
    each: each_default,
    attr: attr_default,
    style: style_default,
    property: property_default,
    classed: classed_default,
    text: text_default,
    html: html_default,
    raise: raise_default,
    lower: lower_default,
    append: append_default,
    insert: insert_default,
    remove: remove_default,
    clone: clone_default,
    datum: datum_default,
    on: on_default,
    dispatch: dispatch_default2,
    [Symbol.iterator]: iterator_default
  };
  var selection_default = selection;

  // node_modules/d3-selection/src/select.js
  function select_default2(selector) {
    return typeof selector === "string" ? new Selection([[document.querySelector(selector)]], [document.documentElement]) : new Selection([[selector]], root);
  }

  // node_modules/d3-color/src/define.js
  function define_default(constructor, factory, prototype) {
    constructor.prototype = factory.prototype = prototype;
    prototype.constructor = constructor;
  }
  function extend(parent, definition) {
    var prototype = Object.create(parent.prototype);
    for (var key in definition) prototype[key] = definition[key];
    return prototype;
  }

  // node_modules/d3-color/src/color.js
  function Color() {
  }
  var darker = 0.7;
  var brighter = 1 / darker;
  var reI = "\\s*([+-]?\\d+)\\s*";
  var reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*";
  var reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*";
  var reHex = /^#([0-9a-f]{3,8})$/;
  var reRgbInteger = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$");
  var reRgbPercent = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$");
  var reRgbaInteger = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$");
  var reRgbaPercent = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$");
  var reHslPercent = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$");
  var reHslaPercent = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$");
  var named = {
    aliceblue: 15792383,
    antiquewhite: 16444375,
    aqua: 65535,
    aquamarine: 8388564,
    azure: 15794175,
    beige: 16119260,
    bisque: 16770244,
    black: 0,
    blanchedalmond: 16772045,
    blue: 255,
    blueviolet: 9055202,
    brown: 10824234,
    burlywood: 14596231,
    cadetblue: 6266528,
    chartreuse: 8388352,
    chocolate: 13789470,
    coral: 16744272,
    cornflowerblue: 6591981,
    cornsilk: 16775388,
    crimson: 14423100,
    cyan: 65535,
    darkblue: 139,
    darkcyan: 35723,
    darkgoldenrod: 12092939,
    darkgray: 11119017,
    darkgreen: 25600,
    darkgrey: 11119017,
    darkkhaki: 12433259,
    darkmagenta: 9109643,
    darkolivegreen: 5597999,
    darkorange: 16747520,
    darkorchid: 10040012,
    darkred: 9109504,
    darksalmon: 15308410,
    darkseagreen: 9419919,
    darkslateblue: 4734347,
    darkslategray: 3100495,
    darkslategrey: 3100495,
    darkturquoise: 52945,
    darkviolet: 9699539,
    deeppink: 16716947,
    deepskyblue: 49151,
    dimgray: 6908265,
    dimgrey: 6908265,
    dodgerblue: 2003199,
    firebrick: 11674146,
    floralwhite: 16775920,
    forestgreen: 2263842,
    fuchsia: 16711935,
    gainsboro: 14474460,
    ghostwhite: 16316671,
    gold: 16766720,
    goldenrod: 14329120,
    gray: 8421504,
    green: 32768,
    greenyellow: 11403055,
    grey: 8421504,
    honeydew: 15794160,
    hotpink: 16738740,
    indianred: 13458524,
    indigo: 4915330,
    ivory: 16777200,
    khaki: 15787660,
    lavender: 15132410,
    lavenderblush: 16773365,
    lawngreen: 8190976,
    lemonchiffon: 16775885,
    lightblue: 11393254,
    lightcoral: 15761536,
    lightcyan: 14745599,
    lightgoldenrodyellow: 16448210,
    lightgray: 13882323,
    lightgreen: 9498256,
    lightgrey: 13882323,
    lightpink: 16758465,
    lightsalmon: 16752762,
    lightseagreen: 2142890,
    lightskyblue: 8900346,
    lightslategray: 7833753,
    lightslategrey: 7833753,
    lightsteelblue: 11584734,
    lightyellow: 16777184,
    lime: 65280,
    limegreen: 3329330,
    linen: 16445670,
    magenta: 16711935,
    maroon: 8388608,
    mediumaquamarine: 6737322,
    mediumblue: 205,
    mediumorchid: 12211667,
    mediumpurple: 9662683,
    mediumseagreen: 3978097,
    mediumslateblue: 8087790,
    mediumspringgreen: 64154,
    mediumturquoise: 4772300,
    mediumvioletred: 13047173,
    midnightblue: 1644912,
    mintcream: 16121850,
    mistyrose: 16770273,
    moccasin: 16770229,
    navajowhite: 16768685,
    navy: 128,
    oldlace: 16643558,
    olive: 8421376,
    olivedrab: 7048739,
    orange: 16753920,
    orangered: 16729344,
    orchid: 14315734,
    palegoldenrod: 15657130,
    palegreen: 10025880,
    paleturquoise: 11529966,
    palevioletred: 14381203,
    papayawhip: 16773077,
    peachpuff: 16767673,
    peru: 13468991,
    pink: 16761035,
    plum: 14524637,
    powderblue: 11591910,
    purple: 8388736,
    rebeccapurple: 6697881,
    red: 16711680,
    rosybrown: 12357519,
    royalblue: 4286945,
    saddlebrown: 9127187,
    salmon: 16416882,
    sandybrown: 16032864,
    seagreen: 3050327,
    seashell: 16774638,
    sienna: 10506797,
    silver: 12632256,
    skyblue: 8900331,
    slateblue: 6970061,
    slategray: 7372944,
    slategrey: 7372944,
    snow: 16775930,
    springgreen: 65407,
    steelblue: 4620980,
    tan: 13808780,
    teal: 32896,
    thistle: 14204888,
    tomato: 16737095,
    turquoise: 4251856,
    violet: 15631086,
    wheat: 16113331,
    white: 16777215,
    whitesmoke: 16119285,
    yellow: 16776960,
    yellowgreen: 10145074
  };
  define_default(Color, color, {
    copy: function(channels) {
      return Object.assign(new this.constructor(), this, channels);
    },
    displayable: function() {
      return this.rgb().displayable();
    },
    hex: color_formatHex,
    // Deprecated! Use color.formatHex.
    formatHex: color_formatHex,
    formatHsl: color_formatHsl,
    formatRgb: color_formatRgb,
    toString: color_formatRgb
  });
  function color_formatHex() {
    return this.rgb().formatHex();
  }
  function color_formatHsl() {
    return hslConvert(this).formatHsl();
  }
  function color_formatRgb() {
    return this.rgb().formatRgb();
  }
  function color(format2) {
    var m, l;
    format2 = (format2 + "").trim().toLowerCase();
    return (m = reHex.exec(format2)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) : l === 3 ? new Rgb(m >> 8 & 15 | m >> 4 & 240, m >> 4 & 15 | m & 240, (m & 15) << 4 | m & 15, 1) : l === 8 ? rgba(m >> 24 & 255, m >> 16 & 255, m >> 8 & 255, (m & 255) / 255) : l === 4 ? rgba(m >> 12 & 15 | m >> 8 & 240, m >> 8 & 15 | m >> 4 & 240, m >> 4 & 15 | m & 240, ((m & 15) << 4 | m & 15) / 255) : null) : (m = reRgbInteger.exec(format2)) ? new Rgb(m[1], m[2], m[3], 1) : (m = reRgbPercent.exec(format2)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) : (m = reRgbaInteger.exec(format2)) ? rgba(m[1], m[2], m[3], m[4]) : (m = reRgbaPercent.exec(format2)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) : (m = reHslPercent.exec(format2)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) : (m = reHslaPercent.exec(format2)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) : named.hasOwnProperty(format2) ? rgbn(named[format2]) : format2 === "transparent" ? new Rgb(NaN, NaN, NaN, 0) : null;
  }
  function rgbn(n) {
    return new Rgb(n >> 16 & 255, n >> 8 & 255, n & 255, 1);
  }
  function rgba(r, g, b, a) {
    if (a <= 0) r = g = b = NaN;
    return new Rgb(r, g, b, a);
  }
  function rgbConvert(o) {
    if (!(o instanceof Color)) o = color(o);
    if (!o) return new Rgb();
    o = o.rgb();
    return new Rgb(o.r, o.g, o.b, o.opacity);
  }
  function rgb(r, g, b, opacity) {
    return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
  }
  function Rgb(r, g, b, opacity) {
    this.r = +r;
    this.g = +g;
    this.b = +b;
    this.opacity = +opacity;
  }
  define_default(Rgb, rgb, extend(Color, {
    brighter: function(k) {
      k = k == null ? brighter : Math.pow(brighter, k);
      return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
    },
    darker: function(k) {
      k = k == null ? darker : Math.pow(darker, k);
      return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
    },
    rgb: function() {
      return this;
    },
    displayable: function() {
      return -0.5 <= this.r && this.r < 255.5 && (-0.5 <= this.g && this.g < 255.5) && (-0.5 <= this.b && this.b < 255.5) && (0 <= this.opacity && this.opacity <= 1);
    },
    hex: rgb_formatHex,
    // Deprecated! Use color.formatHex.
    formatHex: rgb_formatHex,
    formatRgb: rgb_formatRgb,
    toString: rgb_formatRgb
  }));
  function rgb_formatHex() {
    return "#" + hex(this.r) + hex(this.g) + hex(this.b);
  }
  function rgb_formatRgb() {
    var a = this.opacity;
    a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
    return (a === 1 ? "rgb(" : "rgba(") + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", " + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", " + Math.max(0, Math.min(255, Math.round(this.b) || 0)) + (a === 1 ? ")" : ", " + a + ")");
  }
  function hex(value) {
    value = Math.max(0, Math.min(255, Math.round(value) || 0));
    return (value < 16 ? "0" : "") + value.toString(16);
  }
  function hsla(h, s, l, a) {
    if (a <= 0) h = s = l = NaN;
    else if (l <= 0 || l >= 1) h = s = NaN;
    else if (s <= 0) h = NaN;
    return new Hsl(h, s, l, a);
  }
  function hslConvert(o) {
    if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
    if (!(o instanceof Color)) o = color(o);
    if (!o) return new Hsl();
    if (o instanceof Hsl) return o;
    o = o.rgb();
    var r = o.r / 255, g = o.g / 255, b = o.b / 255, min2 = Math.min(r, g, b), max2 = Math.max(r, g, b), h = NaN, s = max2 - min2, l = (max2 + min2) / 2;
    if (s) {
      if (r === max2) h = (g - b) / s + (g < b) * 6;
      else if (g === max2) h = (b - r) / s + 2;
      else h = (r - g) / s + 4;
      s /= l < 0.5 ? max2 + min2 : 2 - max2 - min2;
      h *= 60;
    } else {
      s = l > 0 && l < 1 ? 0 : h;
    }
    return new Hsl(h, s, l, o.opacity);
  }
  function hsl(h, s, l, opacity) {
    return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
  }
  function Hsl(h, s, l, opacity) {
    this.h = +h;
    this.s = +s;
    this.l = +l;
    this.opacity = +opacity;
  }
  define_default(Hsl, hsl, extend(Color, {
    brighter: function(k) {
      k = k == null ? brighter : Math.pow(brighter, k);
      return new Hsl(this.h, this.s, this.l * k, this.opacity);
    },
    darker: function(k) {
      k = k == null ? darker : Math.pow(darker, k);
      return new Hsl(this.h, this.s, this.l * k, this.opacity);
    },
    rgb: function() {
      var h = this.h % 360 + (this.h < 0) * 360, s = isNaN(h) || isNaN(this.s) ? 0 : this.s, l = this.l, m2 = l + (l < 0.5 ? l : 1 - l) * s, m1 = 2 * l - m2;
      return new Rgb(
        hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
        hsl2rgb(h, m1, m2),
        hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
        this.opacity
      );
    },
    displayable: function() {
      return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && (0 <= this.l && this.l <= 1) && (0 <= this.opacity && this.opacity <= 1);
    },
    formatHsl: function() {
      var a = this.opacity;
      a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
      return (a === 1 ? "hsl(" : "hsla(") + (this.h || 0) + ", " + (this.s || 0) * 100 + "%, " + (this.l || 0) * 100 + "%" + (a === 1 ? ")" : ", " + a + ")");
    }
  }));
  function hsl2rgb(h, m1, m2) {
    return (h < 60 ? m1 + (m2 - m1) * h / 60 : h < 180 ? m2 : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60 : m1) * 255;
  }

  // node_modules/d3-interpolate/src/basis.js
  function basis(t1, v0, v1, v2, v3) {
    var t2 = t1 * t1, t3 = t2 * t1;
    return ((1 - 3 * t1 + 3 * t2 - t3) * v0 + (4 - 6 * t2 + 3 * t3) * v1 + (1 + 3 * t1 + 3 * t2 - 3 * t3) * v2 + t3 * v3) / 6;
  }
  function basis_default(values) {
    var n = values.length - 1;
    return function(t) {
      var i = t <= 0 ? t = 0 : t >= 1 ? (t = 1, n - 1) : Math.floor(t * n), v1 = values[i], v2 = values[i + 1], v0 = i > 0 ? values[i - 1] : 2 * v1 - v2, v3 = i < n - 1 ? values[i + 2] : 2 * v2 - v1;
      return basis((t - i / n) * n, v0, v1, v2, v3);
    };
  }

  // node_modules/d3-interpolate/src/basisClosed.js
  function basisClosed_default(values) {
    var n = values.length;
    return function(t) {
      var i = Math.floor(((t %= 1) < 0 ? ++t : t) * n), v0 = values[(i + n - 1) % n], v1 = values[i % n], v2 = values[(i + 1) % n], v3 = values[(i + 2) % n];
      return basis((t - i / n) * n, v0, v1, v2, v3);
    };
  }

  // node_modules/d3-interpolate/src/constant.js
  var constant_default2 = (x) => () => x;

  // node_modules/d3-interpolate/src/color.js
  function linear(a, d) {
    return function(t) {
      return a + t * d;
    };
  }
  function exponential(a, b, y) {
    return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
      return Math.pow(a + t * b, y);
    };
  }
  function gamma(y) {
    return (y = +y) === 1 ? nogamma : function(a, b) {
      return b - a ? exponential(a, b, y) : constant_default2(isNaN(a) ? b : a);
    };
  }
  function nogamma(a, b) {
    var d = b - a;
    return d ? linear(a, d) : constant_default2(isNaN(a) ? b : a);
  }

  // node_modules/d3-interpolate/src/rgb.js
  var rgb_default = function rgbGamma(y) {
    var color2 = gamma(y);
    function rgb2(start2, end) {
      var r = color2((start2 = rgb(start2)).r, (end = rgb(end)).r), g = color2(start2.g, end.g), b = color2(start2.b, end.b), opacity = nogamma(start2.opacity, end.opacity);
      return function(t) {
        start2.r = r(t);
        start2.g = g(t);
        start2.b = b(t);
        start2.opacity = opacity(t);
        return start2 + "";
      };
    }
    rgb2.gamma = rgbGamma;
    return rgb2;
  }(1);
  function rgbSpline(spline) {
    return function(colors) {
      var n = colors.length, r = new Array(n), g = new Array(n), b = new Array(n), i, color2;
      for (i = 0; i < n; ++i) {
        color2 = rgb(colors[i]);
        r[i] = color2.r || 0;
        g[i] = color2.g || 0;
        b[i] = color2.b || 0;
      }
      r = spline(r);
      g = spline(g);
      b = spline(b);
      color2.opacity = 1;
      return function(t) {
        color2.r = r(t);
        color2.g = g(t);
        color2.b = b(t);
        return color2 + "";
      };
    };
  }
  var rgbBasis = rgbSpline(basis_default);
  var rgbBasisClosed = rgbSpline(basisClosed_default);

  // node_modules/d3-interpolate/src/numberArray.js
  function numberArray_default(a, b) {
    if (!b) b = [];
    var n = a ? Math.min(b.length, a.length) : 0, c = b.slice(), i;
    return function(t) {
      for (i = 0; i < n; ++i) c[i] = a[i] * (1 - t) + b[i] * t;
      return c;
    };
  }
  function isNumberArray(x) {
    return ArrayBuffer.isView(x) && !(x instanceof DataView);
  }

  // node_modules/d3-interpolate/src/array.js
  function genericArray(a, b) {
    var nb = b ? b.length : 0, na = a ? Math.min(nb, a.length) : 0, x = new Array(na), c = new Array(nb), i;
    for (i = 0; i < na; ++i) x[i] = value_default(a[i], b[i]);
    for (; i < nb; ++i) c[i] = b[i];
    return function(t) {
      for (i = 0; i < na; ++i) c[i] = x[i](t);
      return c;
    };
  }

  // node_modules/d3-interpolate/src/date.js
  function date_default(a, b) {
    var d = /* @__PURE__ */ new Date();
    return a = +a, b = +b, function(t) {
      return d.setTime(a * (1 - t) + b * t), d;
    };
  }

  // node_modules/d3-interpolate/src/number.js
  function number_default(a, b) {
    return a = +a, b = +b, function(t) {
      return a * (1 - t) + b * t;
    };
  }

  // node_modules/d3-interpolate/src/object.js
  function object_default(a, b) {
    var i = {}, c = {}, k;
    if (a === null || typeof a !== "object") a = {};
    if (b === null || typeof b !== "object") b = {};
    for (k in b) {
      if (k in a) {
        i[k] = value_default(a[k], b[k]);
      } else {
        c[k] = b[k];
      }
    }
    return function(t) {
      for (k in i) c[k] = i[k](t);
      return c;
    };
  }

  // node_modules/d3-interpolate/src/string.js
  var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g;
  var reB = new RegExp(reA.source, "g");
  function zero(b) {
    return function() {
      return b;
    };
  }
  function one(b) {
    return function(t) {
      return b(t) + "";
    };
  }
  function string_default(a, b) {
    var bi = reA.lastIndex = reB.lastIndex = 0, am, bm, bs, i = -1, s = [], q = [];
    a = a + "", b = b + "";
    while ((am = reA.exec(a)) && (bm = reB.exec(b))) {
      if ((bs = bm.index) > bi) {
        bs = b.slice(bi, bs);
        if (s[i]) s[i] += bs;
        else s[++i] = bs;
      }
      if ((am = am[0]) === (bm = bm[0])) {
        if (s[i]) s[i] += bm;
        else s[++i] = bm;
      } else {
        s[++i] = null;
        q.push({ i, x: number_default(am, bm) });
      }
      bi = reB.lastIndex;
    }
    if (bi < b.length) {
      bs = b.slice(bi);
      if (s[i]) s[i] += bs;
      else s[++i] = bs;
    }
    return s.length < 2 ? q[0] ? one(q[0].x) : zero(b) : (b = q.length, function(t) {
      for (var i2 = 0, o; i2 < b; ++i2) s[(o = q[i2]).i] = o.x(t);
      return s.join("");
    });
  }

  // node_modules/d3-interpolate/src/value.js
  function value_default(a, b) {
    var t = typeof b, c;
    return b == null || t === "boolean" ? constant_default2(b) : (t === "number" ? number_default : t === "string" ? (c = color(b)) ? (b = c, rgb_default) : string_default : b instanceof color ? rgb_default : b instanceof Date ? date_default : isNumberArray(b) ? numberArray_default : Array.isArray(b) ? genericArray : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? object_default : number_default)(a, b);
  }

  // node_modules/d3-interpolate/src/round.js
  function round_default(a, b) {
    return a = +a, b = +b, function(t) {
      return Math.round(a * (1 - t) + b * t);
    };
  }

  // node_modules/d3-interpolate/src/transform/decompose.js
  var degrees = 180 / Math.PI;
  var identity = {
    translateX: 0,
    translateY: 0,
    rotate: 0,
    skewX: 0,
    scaleX: 1,
    scaleY: 1
  };
  function decompose_default(a, b, c, d, e, f) {
    var scaleX, scaleY, skewX;
    if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
    if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
    if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
    if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
    return {
      translateX: e,
      translateY: f,
      rotate: Math.atan2(b, a) * degrees,
      skewX: Math.atan(skewX) * degrees,
      scaleX,
      scaleY
    };
  }

  // node_modules/d3-interpolate/src/transform/parse.js
  var svgNode;
  function parseCss(value) {
    const m = new (typeof DOMMatrix === "function" ? DOMMatrix : WebKitCSSMatrix)(value + "");
    return m.isIdentity ? identity : decompose_default(m.a, m.b, m.c, m.d, m.e, m.f);
  }
  function parseSvg(value) {
    if (value == null) return identity;
    if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svgNode.setAttribute("transform", value);
    if (!(value = svgNode.transform.baseVal.consolidate())) return identity;
    value = value.matrix;
    return decompose_default(value.a, value.b, value.c, value.d, value.e, value.f);
  }

  // node_modules/d3-interpolate/src/transform/index.js
  function interpolateTransform(parse, pxComma, pxParen, degParen) {
    function pop(s) {
      return s.length ? s.pop() + " " : "";
    }
    function translate(xa, ya, xb, yb, s, q) {
      if (xa !== xb || ya !== yb) {
        var i = s.push("translate(", null, pxComma, null, pxParen);
        q.push({ i: i - 4, x: number_default(xa, xb) }, { i: i - 2, x: number_default(ya, yb) });
      } else if (xb || yb) {
        s.push("translate(" + xb + pxComma + yb + pxParen);
      }
    }
    function rotate(a, b, s, q) {
      if (a !== b) {
        if (a - b > 180) b += 360;
        else if (b - a > 180) a += 360;
        q.push({ i: s.push(pop(s) + "rotate(", null, degParen) - 2, x: number_default(a, b) });
      } else if (b) {
        s.push(pop(s) + "rotate(" + b + degParen);
      }
    }
    function skewX(a, b, s, q) {
      if (a !== b) {
        q.push({ i: s.push(pop(s) + "skewX(", null, degParen) - 2, x: number_default(a, b) });
      } else if (b) {
        s.push(pop(s) + "skewX(" + b + degParen);
      }
    }
    function scale(xa, ya, xb, yb, s, q) {
      if (xa !== xb || ya !== yb) {
        var i = s.push(pop(s) + "scale(", null, ",", null, ")");
        q.push({ i: i - 4, x: number_default(xa, xb) }, { i: i - 2, x: number_default(ya, yb) });
      } else if (xb !== 1 || yb !== 1) {
        s.push(pop(s) + "scale(" + xb + "," + yb + ")");
      }
    }
    return function(a, b) {
      var s = [], q = [];
      a = parse(a), b = parse(b);
      translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
      rotate(a.rotate, b.rotate, s, q);
      skewX(a.skewX, b.skewX, s, q);
      scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
      a = b = null;
      return function(t) {
        var i = -1, n = q.length, o;
        while (++i < n) s[(o = q[i]).i] = o.x(t);
        return s.join("");
      };
    };
  }
  var interpolateTransformCss = interpolateTransform(parseCss, "px, ", "px)", "deg)");
  var interpolateTransformSvg = interpolateTransform(parseSvg, ", ", ")", ")");

  // node_modules/d3-timer/src/timer.js
  var frame = 0;
  var timeout = 0;
  var interval = 0;
  var pokeDelay = 1e3;
  var taskHead;
  var taskTail;
  var clockLast = 0;
  var clockNow = 0;
  var clockSkew = 0;
  var clock = typeof performance === "object" && performance.now ? performance : Date;
  var setFrame = typeof window === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(f) {
    setTimeout(f, 17);
  };
  function now() {
    return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
  }
  function clearNow() {
    clockNow = 0;
  }
  function Timer() {
    this._call = this._time = this._next = null;
  }
  Timer.prototype = timer.prototype = {
    constructor: Timer,
    restart: function(callback, delay, time) {
      if (typeof callback !== "function") throw new TypeError("callback is not a function");
      time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
      if (!this._next && taskTail !== this) {
        if (taskTail) taskTail._next = this;
        else taskHead = this;
        taskTail = this;
      }
      this._call = callback;
      this._time = time;
      sleep();
    },
    stop: function() {
      if (this._call) {
        this._call = null;
        this._time = Infinity;
        sleep();
      }
    }
  };
  function timer(callback, delay, time) {
    var t = new Timer();
    t.restart(callback, delay, time);
    return t;
  }
  function timerFlush() {
    now();
    ++frame;
    var t = taskHead, e;
    while (t) {
      if ((e = clockNow - t._time) >= 0) t._call.call(void 0, e);
      t = t._next;
    }
    --frame;
  }
  function wake() {
    clockNow = (clockLast = clock.now()) + clockSkew;
    frame = timeout = 0;
    try {
      timerFlush();
    } finally {
      frame = 0;
      nap();
      clockNow = 0;
    }
  }
  function poke() {
    var now2 = clock.now(), delay = now2 - clockLast;
    if (delay > pokeDelay) clockSkew -= delay, clockLast = now2;
  }
  function nap() {
    var t0, t1 = taskHead, t2, time = Infinity;
    while (t1) {
      if (t1._call) {
        if (time > t1._time) time = t1._time;
        t0 = t1, t1 = t1._next;
      } else {
        t2 = t1._next, t1._next = null;
        t1 = t0 ? t0._next = t2 : taskHead = t2;
      }
    }
    taskTail = t0;
    sleep(time);
  }
  function sleep(time) {
    if (frame) return;
    if (timeout) timeout = clearTimeout(timeout);
    var delay = time - clockNow;
    if (delay > 24) {
      if (time < Infinity) timeout = setTimeout(wake, time - clock.now() - clockSkew);
      if (interval) interval = clearInterval(interval);
    } else {
      if (!interval) clockLast = clock.now(), interval = setInterval(poke, pokeDelay);
      frame = 1, setFrame(wake);
    }
  }

  // node_modules/d3-timer/src/timeout.js
  function timeout_default(callback, delay, time) {
    var t = new Timer();
    delay = delay == null ? 0 : +delay;
    t.restart((elapsed) => {
      t.stop();
      callback(elapsed + delay);
    }, delay, time);
    return t;
  }

  // node_modules/d3-transition/src/transition/schedule.js
  var emptyOn = dispatch_default("start", "end", "cancel", "interrupt");
  var emptyTween = [];
  var CREATED = 0;
  var SCHEDULED = 1;
  var STARTING = 2;
  var STARTED = 3;
  var RUNNING = 4;
  var ENDING = 5;
  var ENDED = 6;
  function schedule_default(node, name, id2, index, group, timing) {
    var schedules = node.__transition;
    if (!schedules) node.__transition = {};
    else if (id2 in schedules) return;
    create(node, id2, {
      name,
      index,
      // For context during callback.
      group,
      // For context during callback.
      on: emptyOn,
      tween: emptyTween,
      time: timing.time,
      delay: timing.delay,
      duration: timing.duration,
      ease: timing.ease,
      timer: null,
      state: CREATED
    });
  }
  function init(node, id2) {
    var schedule = get2(node, id2);
    if (schedule.state > CREATED) throw new Error("too late; already scheduled");
    return schedule;
  }
  function set2(node, id2) {
    var schedule = get2(node, id2);
    if (schedule.state > STARTED) throw new Error("too late; already running");
    return schedule;
  }
  function get2(node, id2) {
    var schedule = node.__transition;
    if (!schedule || !(schedule = schedule[id2])) throw new Error("transition not found");
    return schedule;
  }
  function create(node, id2, self) {
    var schedules = node.__transition, tween;
    schedules[id2] = self;
    self.timer = timer(schedule, 0, self.time);
    function schedule(elapsed) {
      self.state = SCHEDULED;
      self.timer.restart(start2, self.delay, self.time);
      if (self.delay <= elapsed) start2(elapsed - self.delay);
    }
    function start2(elapsed) {
      var i, j, n, o;
      if (self.state !== SCHEDULED) return stop();
      for (i in schedules) {
        o = schedules[i];
        if (o.name !== self.name) continue;
        if (o.state === STARTED) return timeout_default(start2);
        if (o.state === RUNNING) {
          o.state = ENDED;
          o.timer.stop();
          o.on.call("interrupt", node, node.__data__, o.index, o.group);
          delete schedules[i];
        } else if (+i < id2) {
          o.state = ENDED;
          o.timer.stop();
          o.on.call("cancel", node, node.__data__, o.index, o.group);
          delete schedules[i];
        }
      }
      timeout_default(function() {
        if (self.state === STARTED) {
          self.state = RUNNING;
          self.timer.restart(tick, self.delay, self.time);
          tick(elapsed);
        }
      });
      self.state = STARTING;
      self.on.call("start", node, node.__data__, self.index, self.group);
      if (self.state !== STARTING) return;
      self.state = STARTED;
      tween = new Array(n = self.tween.length);
      for (i = 0, j = -1; i < n; ++i) {
        if (o = self.tween[i].value.call(node, node.__data__, self.index, self.group)) {
          tween[++j] = o;
        }
      }
      tween.length = j + 1;
    }
    function tick(elapsed) {
      var t = elapsed < self.duration ? self.ease.call(null, elapsed / self.duration) : (self.timer.restart(stop), self.state = ENDING, 1), i = -1, n = tween.length;
      while (++i < n) {
        tween[i].call(node, t);
      }
      if (self.state === ENDING) {
        self.on.call("end", node, node.__data__, self.index, self.group);
        stop();
      }
    }
    function stop() {
      self.state = ENDED;
      self.timer.stop();
      delete schedules[id2];
      for (var i in schedules) return;
      delete node.__transition;
    }
  }

  // node_modules/d3-transition/src/interrupt.js
  function interrupt_default(node, name) {
    var schedules = node.__transition, schedule, active, empty2 = true, i;
    if (!schedules) return;
    name = name == null ? null : name + "";
    for (i in schedules) {
      if ((schedule = schedules[i]).name !== name) {
        empty2 = false;
        continue;
      }
      active = schedule.state > STARTING && schedule.state < ENDING;
      schedule.state = ENDED;
      schedule.timer.stop();
      schedule.on.call(active ? "interrupt" : "cancel", node, node.__data__, schedule.index, schedule.group);
      delete schedules[i];
    }
    if (empty2) delete node.__transition;
  }

  // node_modules/d3-transition/src/selection/interrupt.js
  function interrupt_default2(name) {
    return this.each(function() {
      interrupt_default(this, name);
    });
  }

  // node_modules/d3-transition/src/transition/tween.js
  function tweenRemove(id2, name) {
    var tween0, tween1;
    return function() {
      var schedule = set2(this, id2), tween = schedule.tween;
      if (tween !== tween0) {
        tween1 = tween0 = tween;
        for (var i = 0, n = tween1.length; i < n; ++i) {
          if (tween1[i].name === name) {
            tween1 = tween1.slice();
            tween1.splice(i, 1);
            break;
          }
        }
      }
      schedule.tween = tween1;
    };
  }
  function tweenFunction(id2, name, value) {
    var tween0, tween1;
    if (typeof value !== "function") throw new Error();
    return function() {
      var schedule = set2(this, id2), tween = schedule.tween;
      if (tween !== tween0) {
        tween1 = (tween0 = tween).slice();
        for (var t = { name, value }, i = 0, n = tween1.length; i < n; ++i) {
          if (tween1[i].name === name) {
            tween1[i] = t;
            break;
          }
        }
        if (i === n) tween1.push(t);
      }
      schedule.tween = tween1;
    };
  }
  function tween_default(name, value) {
    var id2 = this._id;
    name += "";
    if (arguments.length < 2) {
      var tween = get2(this.node(), id2).tween;
      for (var i = 0, n = tween.length, t; i < n; ++i) {
        if ((t = tween[i]).name === name) {
          return t.value;
        }
      }
      return null;
    }
    return this.each((value == null ? tweenRemove : tweenFunction)(id2, name, value));
  }
  function tweenValue(transition2, name, value) {
    var id2 = transition2._id;
    transition2.each(function() {
      var schedule = set2(this, id2);
      (schedule.value || (schedule.value = {}))[name] = value.apply(this, arguments);
    });
    return function(node) {
      return get2(node, id2).value[name];
    };
  }

  // node_modules/d3-transition/src/transition/interpolate.js
  function interpolate_default(a, b) {
    var c;
    return (typeof b === "number" ? number_default : b instanceof color ? rgb_default : (c = color(b)) ? (b = c, rgb_default) : string_default)(a, b);
  }

  // node_modules/d3-transition/src/transition/attr.js
  function attrRemove2(name) {
    return function() {
      this.removeAttribute(name);
    };
  }
  function attrRemoveNS2(fullname) {
    return function() {
      this.removeAttributeNS(fullname.space, fullname.local);
    };
  }
  function attrConstant2(name, interpolate, value1) {
    var string00, string1 = value1 + "", interpolate0;
    return function() {
      var string0 = this.getAttribute(name);
      return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
    };
  }
  function attrConstantNS2(fullname, interpolate, value1) {
    var string00, string1 = value1 + "", interpolate0;
    return function() {
      var string0 = this.getAttributeNS(fullname.space, fullname.local);
      return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
    };
  }
  function attrFunction2(name, interpolate, value) {
    var string00, string10, interpolate0;
    return function() {
      var string0, value1 = value(this), string1;
      if (value1 == null) return void this.removeAttribute(name);
      string0 = this.getAttribute(name);
      string1 = value1 + "";
      return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
    };
  }
  function attrFunctionNS2(fullname, interpolate, value) {
    var string00, string10, interpolate0;
    return function() {
      var string0, value1 = value(this), string1;
      if (value1 == null) return void this.removeAttributeNS(fullname.space, fullname.local);
      string0 = this.getAttributeNS(fullname.space, fullname.local);
      string1 = value1 + "";
      return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
    };
  }
  function attr_default2(name, value) {
    var fullname = namespace_default(name), i = fullname === "transform" ? interpolateTransformSvg : interpolate_default;
    return this.attrTween(name, typeof value === "function" ? (fullname.local ? attrFunctionNS2 : attrFunction2)(fullname, i, tweenValue(this, "attr." + name, value)) : value == null ? (fullname.local ? attrRemoveNS2 : attrRemove2)(fullname) : (fullname.local ? attrConstantNS2 : attrConstant2)(fullname, i, value));
  }

  // node_modules/d3-transition/src/transition/attrTween.js
  function attrInterpolate(name, i) {
    return function(t) {
      this.setAttribute(name, i.call(this, t));
    };
  }
  function attrInterpolateNS(fullname, i) {
    return function(t) {
      this.setAttributeNS(fullname.space, fullname.local, i.call(this, t));
    };
  }
  function attrTweenNS(fullname, value) {
    var t0, i0;
    function tween() {
      var i = value.apply(this, arguments);
      if (i !== i0) t0 = (i0 = i) && attrInterpolateNS(fullname, i);
      return t0;
    }
    tween._value = value;
    return tween;
  }
  function attrTween(name, value) {
    var t0, i0;
    function tween() {
      var i = value.apply(this, arguments);
      if (i !== i0) t0 = (i0 = i) && attrInterpolate(name, i);
      return t0;
    }
    tween._value = value;
    return tween;
  }
  function attrTween_default(name, value) {
    var key = "attr." + name;
    if (arguments.length < 2) return (key = this.tween(key)) && key._value;
    if (value == null) return this.tween(key, null);
    if (typeof value !== "function") throw new Error();
    var fullname = namespace_default(name);
    return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
  }

  // node_modules/d3-transition/src/transition/delay.js
  function delayFunction(id2, value) {
    return function() {
      init(this, id2).delay = +value.apply(this, arguments);
    };
  }
  function delayConstant(id2, value) {
    return value = +value, function() {
      init(this, id2).delay = value;
    };
  }
  function delay_default(value) {
    var id2 = this._id;
    return arguments.length ? this.each((typeof value === "function" ? delayFunction : delayConstant)(id2, value)) : get2(this.node(), id2).delay;
  }

  // node_modules/d3-transition/src/transition/duration.js
  function durationFunction(id2, value) {
    return function() {
      set2(this, id2).duration = +value.apply(this, arguments);
    };
  }
  function durationConstant(id2, value) {
    return value = +value, function() {
      set2(this, id2).duration = value;
    };
  }
  function duration_default(value) {
    var id2 = this._id;
    return arguments.length ? this.each((typeof value === "function" ? durationFunction : durationConstant)(id2, value)) : get2(this.node(), id2).duration;
  }

  // node_modules/d3-transition/src/transition/ease.js
  function easeConstant(id2, value) {
    if (typeof value !== "function") throw new Error();
    return function() {
      set2(this, id2).ease = value;
    };
  }
  function ease_default(value) {
    var id2 = this._id;
    return arguments.length ? this.each(easeConstant(id2, value)) : get2(this.node(), id2).ease;
  }

  // node_modules/d3-transition/src/transition/easeVarying.js
  function easeVarying(id2, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (typeof v !== "function") throw new Error();
      set2(this, id2).ease = v;
    };
  }
  function easeVarying_default(value) {
    if (typeof value !== "function") throw new Error();
    return this.each(easeVarying(this._id, value));
  }

  // node_modules/d3-transition/src/transition/filter.js
  function filter_default2(match) {
    if (typeof match !== "function") match = matcher_default(match);
    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
        if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
          subgroup.push(node);
        }
      }
    }
    return new Transition(subgroups, this._parents, this._name, this._id);
  }

  // node_modules/d3-transition/src/transition/merge.js
  function merge_default2(transition2) {
    if (transition2._id !== this._id) throw new Error();
    for (var groups0 = this._groups, groups1 = transition2._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
      for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
        if (node = group0[i] || group1[i]) {
          merge[i] = node;
        }
      }
    }
    for (; j < m0; ++j) {
      merges[j] = groups0[j];
    }
    return new Transition(merges, this._parents, this._name, this._id);
  }

  // node_modules/d3-transition/src/transition/on.js
  function start(name) {
    return (name + "").trim().split(/^|\s+/).every(function(t) {
      var i = t.indexOf(".");
      if (i >= 0) t = t.slice(0, i);
      return !t || t === "start";
    });
  }
  function onFunction(id2, name, listener) {
    var on0, on1, sit = start(name) ? init : set2;
    return function() {
      var schedule = sit(this, id2), on = schedule.on;
      if (on !== on0) (on1 = (on0 = on).copy()).on(name, listener);
      schedule.on = on1;
    };
  }
  function on_default2(name, listener) {
    var id2 = this._id;
    return arguments.length < 2 ? get2(this.node(), id2).on.on(name) : this.each(onFunction(id2, name, listener));
  }

  // node_modules/d3-transition/src/transition/remove.js
  function removeFunction(id2) {
    return function() {
      var parent = this.parentNode;
      for (var i in this.__transition) if (+i !== id2) return;
      if (parent) parent.removeChild(this);
    };
  }
  function remove_default2() {
    return this.on("end.remove", removeFunction(this._id));
  }

  // node_modules/d3-transition/src/transition/select.js
  function select_default3(select) {
    var name = this._name, id2 = this._id;
    if (typeof select !== "function") select = selector_default(select);
    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
        if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
          if ("__data__" in node) subnode.__data__ = node.__data__;
          subgroup[i] = subnode;
          schedule_default(subgroup[i], name, id2, i, subgroup, get2(node, id2));
        }
      }
    }
    return new Transition(subgroups, this._parents, name, id2);
  }

  // node_modules/d3-transition/src/transition/selectAll.js
  function selectAll_default2(select) {
    var name = this._name, id2 = this._id;
    if (typeof select !== "function") select = selectorAll_default(select);
    for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          for (var children2 = select.call(node, node.__data__, i, group), child, inherit2 = get2(node, id2), k = 0, l = children2.length; k < l; ++k) {
            if (child = children2[k]) {
              schedule_default(child, name, id2, k, children2, inherit2);
            }
          }
          subgroups.push(children2);
          parents.push(node);
        }
      }
    }
    return new Transition(subgroups, parents, name, id2);
  }

  // node_modules/d3-transition/src/transition/selection.js
  var Selection2 = selection_default.prototype.constructor;
  function selection_default2() {
    return new Selection2(this._groups, this._parents);
  }

  // node_modules/d3-transition/src/transition/style.js
  function styleNull(name, interpolate) {
    var string00, string10, interpolate0;
    return function() {
      var string0 = styleValue(this, name), string1 = (this.style.removeProperty(name), styleValue(this, name));
      return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : interpolate0 = interpolate(string00 = string0, string10 = string1);
    };
  }
  function styleRemove2(name) {
    return function() {
      this.style.removeProperty(name);
    };
  }
  function styleConstant2(name, interpolate, value1) {
    var string00, string1 = value1 + "", interpolate0;
    return function() {
      var string0 = styleValue(this, name);
      return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
    };
  }
  function styleFunction2(name, interpolate, value) {
    var string00, string10, interpolate0;
    return function() {
      var string0 = styleValue(this, name), value1 = value(this), string1 = value1 + "";
      if (value1 == null) string1 = value1 = (this.style.removeProperty(name), styleValue(this, name));
      return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
    };
  }
  function styleMaybeRemove(id2, name) {
    var on0, on1, listener0, key = "style." + name, event = "end." + key, remove2;
    return function() {
      var schedule = set2(this, id2), on = schedule.on, listener = schedule.value[key] == null ? remove2 || (remove2 = styleRemove2(name)) : void 0;
      if (on !== on0 || listener0 !== listener) (on1 = (on0 = on).copy()).on(event, listener0 = listener);
      schedule.on = on1;
    };
  }
  function style_default2(name, value, priority) {
    var i = (name += "") === "transform" ? interpolateTransformCss : interpolate_default;
    return value == null ? this.styleTween(name, styleNull(name, i)).on("end.style." + name, styleRemove2(name)) : typeof value === "function" ? this.styleTween(name, styleFunction2(name, i, tweenValue(this, "style." + name, value))).each(styleMaybeRemove(this._id, name)) : this.styleTween(name, styleConstant2(name, i, value), priority).on("end.style." + name, null);
  }

  // node_modules/d3-transition/src/transition/styleTween.js
  function styleInterpolate(name, i, priority) {
    return function(t) {
      this.style.setProperty(name, i.call(this, t), priority);
    };
  }
  function styleTween(name, value, priority) {
    var t, i0;
    function tween() {
      var i = value.apply(this, arguments);
      if (i !== i0) t = (i0 = i) && styleInterpolate(name, i, priority);
      return t;
    }
    tween._value = value;
    return tween;
  }
  function styleTween_default(name, value, priority) {
    var key = "style." + (name += "");
    if (arguments.length < 2) return (key = this.tween(key)) && key._value;
    if (value == null) return this.tween(key, null);
    if (typeof value !== "function") throw new Error();
    return this.tween(key, styleTween(name, value, priority == null ? "" : priority));
  }

  // node_modules/d3-transition/src/transition/text.js
  function textConstant2(value) {
    return function() {
      this.textContent = value;
    };
  }
  function textFunction2(value) {
    return function() {
      var value1 = value(this);
      this.textContent = value1 == null ? "" : value1;
    };
  }
  function text_default2(value) {
    return this.tween("text", typeof value === "function" ? textFunction2(tweenValue(this, "text", value)) : textConstant2(value == null ? "" : value + ""));
  }

  // node_modules/d3-transition/src/transition/textTween.js
  function textInterpolate(i) {
    return function(t) {
      this.textContent = i.call(this, t);
    };
  }
  function textTween(value) {
    var t0, i0;
    function tween() {
      var i = value.apply(this, arguments);
      if (i !== i0) t0 = (i0 = i) && textInterpolate(i);
      return t0;
    }
    tween._value = value;
    return tween;
  }
  function textTween_default(value) {
    var key = "text";
    if (arguments.length < 1) return (key = this.tween(key)) && key._value;
    if (value == null) return this.tween(key, null);
    if (typeof value !== "function") throw new Error();
    return this.tween(key, textTween(value));
  }

  // node_modules/d3-transition/src/transition/transition.js
  function transition_default() {
    var name = this._name, id0 = this._id, id1 = newId();
    for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          var inherit2 = get2(node, id0);
          schedule_default(node, name, id1, i, group, {
            time: inherit2.time + inherit2.delay + inherit2.duration,
            delay: 0,
            duration: inherit2.duration,
            ease: inherit2.ease
          });
        }
      }
    }
    return new Transition(groups, this._parents, name, id1);
  }

  // node_modules/d3-transition/src/transition/end.js
  function end_default() {
    var on0, on1, that = this, id2 = that._id, size = that.size();
    return new Promise(function(resolve, reject) {
      var cancel = { value: reject }, end = { value: function() {
        if (--size === 0) resolve();
      } };
      that.each(function() {
        var schedule = set2(this, id2), on = schedule.on;
        if (on !== on0) {
          on1 = (on0 = on).copy();
          on1._.cancel.push(cancel);
          on1._.interrupt.push(cancel);
          on1._.end.push(end);
        }
        schedule.on = on1;
      });
      if (size === 0) resolve();
    });
  }

  // node_modules/d3-transition/src/transition/index.js
  var id = 0;
  function Transition(groups, parents, name, id2) {
    this._groups = groups;
    this._parents = parents;
    this._name = name;
    this._id = id2;
  }
  function transition(name) {
    return selection_default().transition(name);
  }
  function newId() {
    return ++id;
  }
  var selection_prototype = selection_default.prototype;
  Transition.prototype = transition.prototype = {
    constructor: Transition,
    select: select_default3,
    selectAll: selectAll_default2,
    selectChild: selection_prototype.selectChild,
    selectChildren: selection_prototype.selectChildren,
    filter: filter_default2,
    merge: merge_default2,
    selection: selection_default2,
    transition: transition_default,
    call: selection_prototype.call,
    nodes: selection_prototype.nodes,
    node: selection_prototype.node,
    size: selection_prototype.size,
    empty: selection_prototype.empty,
    each: selection_prototype.each,
    on: on_default2,
    attr: attr_default2,
    attrTween: attrTween_default,
    style: style_default2,
    styleTween: styleTween_default,
    text: text_default2,
    textTween: textTween_default,
    remove: remove_default2,
    tween: tween_default,
    delay: delay_default,
    duration: duration_default,
    ease: ease_default,
    easeVarying: easeVarying_default,
    end: end_default,
    [Symbol.iterator]: selection_prototype[Symbol.iterator]
  };

  // node_modules/d3-ease/src/cubic.js
  function cubicInOut(t) {
    return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
  }

  // node_modules/d3-transition/src/selection/transition.js
  var defaultTiming = {
    time: null,
    // Set on use.
    delay: 0,
    duration: 250,
    ease: cubicInOut
  };
  function inherit(node, id2) {
    var timing;
    while (!(timing = node.__transition) || !(timing = timing[id2])) {
      if (!(node = node.parentNode)) {
        throw new Error(`transition ${id2} not found`);
      }
    }
    return timing;
  }
  function transition_default2(name) {
    var id2, timing;
    if (name instanceof Transition) {
      id2 = name._id, name = name._name;
    } else {
      id2 = newId(), (timing = defaultTiming).time = now(), name = name == null ? null : name + "";
    }
    for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          schedule_default(node, name, id2, i, group, timing || inherit(node, id2));
        }
      }
    }
    return new Transition(groups, this._parents, name, id2);
  }

  // node_modules/d3-transition/src/selection/index.js
  selection_default.prototype.interrupt = interrupt_default2;
  selection_default.prototype.transition = transition_default2;

  // node_modules/d3-brush/src/brush.js
  var { abs, max, min } = Math;
  function number1(e) {
    return [+e[0], +e[1]];
  }
  function number22(e) {
    return [number1(e[0]), number1(e[1])];
  }
  var X = {
    name: "x",
    handles: ["w", "e"].map(type),
    input: function(x, e) {
      return x == null ? null : [[+x[0], e[0][1]], [+x[1], e[1][1]]];
    },
    output: function(xy) {
      return xy && [xy[0][0], xy[1][0]];
    }
  };
  var Y = {
    name: "y",
    handles: ["n", "s"].map(type),
    input: function(y, e) {
      return y == null ? null : [[e[0][0], +y[0]], [e[1][0], +y[1]]];
    },
    output: function(xy) {
      return xy && [xy[0][1], xy[1][1]];
    }
  };
  var XY = {
    name: "xy",
    handles: ["n", "w", "e", "s", "nw", "ne", "sw", "se"].map(type),
    input: function(xy) {
      return xy == null ? null : number22(xy);
    },
    output: function(xy) {
      return xy;
    }
  };
  function type(t) {
    return { type: t };
  }

  // node_modules/d3-format/src/formatDecimal.js
  function formatDecimal_default(x) {
    return Math.abs(x = Math.round(x)) >= 1e21 ? x.toLocaleString("en").replace(/,/g, "") : x.toString(10);
  }
  function formatDecimalParts(x, p) {
    if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null;
    var i, coefficient = x.slice(0, i);
    return [
      coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
      +x.slice(i + 1)
    ];
  }

  // node_modules/d3-format/src/exponent.js
  function exponent_default(x) {
    return x = formatDecimalParts(Math.abs(x)), x ? x[1] : NaN;
  }

  // node_modules/d3-format/src/formatGroup.js
  function formatGroup_default(grouping, thousands) {
    return function(value, width) {
      var i = value.length, t = [], j = 0, g = grouping[0], length = 0;
      while (i > 0 && g > 0) {
        if (length + g + 1 > width) g = Math.max(1, width - length);
        t.push(value.substring(i -= g, i + g));
        if ((length += g + 1) > width) break;
        g = grouping[j = (j + 1) % grouping.length];
      }
      return t.reverse().join(thousands);
    };
  }

  // node_modules/d3-format/src/formatNumerals.js
  function formatNumerals_default(numerals) {
    return function(value) {
      return value.replace(/[0-9]/g, function(i) {
        return numerals[+i];
      });
    };
  }

  // node_modules/d3-format/src/formatSpecifier.js
  var re = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
  function formatSpecifier(specifier) {
    if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);
    var match;
    return new FormatSpecifier({
      fill: match[1],
      align: match[2],
      sign: match[3],
      symbol: match[4],
      zero: match[5],
      width: match[6],
      comma: match[7],
      precision: match[8] && match[8].slice(1),
      trim: match[9],
      type: match[10]
    });
  }
  formatSpecifier.prototype = FormatSpecifier.prototype;
  function FormatSpecifier(specifier) {
    this.fill = specifier.fill === void 0 ? " " : specifier.fill + "";
    this.align = specifier.align === void 0 ? ">" : specifier.align + "";
    this.sign = specifier.sign === void 0 ? "-" : specifier.sign + "";
    this.symbol = specifier.symbol === void 0 ? "" : specifier.symbol + "";
    this.zero = !!specifier.zero;
    this.width = specifier.width === void 0 ? void 0 : +specifier.width;
    this.comma = !!specifier.comma;
    this.precision = specifier.precision === void 0 ? void 0 : +specifier.precision;
    this.trim = !!specifier.trim;
    this.type = specifier.type === void 0 ? "" : specifier.type + "";
  }
  FormatSpecifier.prototype.toString = function() {
    return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (this.width === void 0 ? "" : Math.max(1, this.width | 0)) + (this.comma ? "," : "") + (this.precision === void 0 ? "" : "." + Math.max(0, this.precision | 0)) + (this.trim ? "~" : "") + this.type;
  };

  // node_modules/d3-format/src/formatTrim.js
  function formatTrim_default(s) {
    out: for (var n = s.length, i = 1, i0 = -1, i1; i < n; ++i) {
      switch (s[i]) {
        case ".":
          i0 = i1 = i;
          break;
        case "0":
          if (i0 === 0) i0 = i;
          i1 = i;
          break;
        default:
          if (!+s[i]) break out;
          if (i0 > 0) i0 = 0;
          break;
      }
    }
    return i0 > 0 ? s.slice(0, i0) + s.slice(i1 + 1) : s;
  }

  // node_modules/d3-format/src/formatPrefixAuto.js
  var prefixExponent;
  function formatPrefixAuto_default(x, p) {
    var d = formatDecimalParts(x, p);
    if (!d) return x + "";
    var coefficient = d[0], exponent = d[1], i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1, n = coefficient.length;
    return i === n ? coefficient : i > n ? coefficient + new Array(i - n + 1).join("0") : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i) : "0." + new Array(1 - i).join("0") + formatDecimalParts(x, Math.max(0, p + i - 1))[0];
  }

  // node_modules/d3-format/src/formatRounded.js
  function formatRounded_default(x, p) {
    var d = formatDecimalParts(x, p);
    if (!d) return x + "";
    var coefficient = d[0], exponent = d[1];
    return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1) : coefficient + new Array(exponent - coefficient.length + 2).join("0");
  }

  // node_modules/d3-format/src/formatTypes.js
  var formatTypes_default = {
    "%": (x, p) => (x * 100).toFixed(p),
    "b": (x) => Math.round(x).toString(2),
    "c": (x) => x + "",
    "d": formatDecimal_default,
    "e": (x, p) => x.toExponential(p),
    "f": (x, p) => x.toFixed(p),
    "g": (x, p) => x.toPrecision(p),
    "o": (x) => Math.round(x).toString(8),
    "p": (x, p) => formatRounded_default(x * 100, p),
    "r": formatRounded_default,
    "s": formatPrefixAuto_default,
    "X": (x) => Math.round(x).toString(16).toUpperCase(),
    "x": (x) => Math.round(x).toString(16)
  };

  // node_modules/d3-format/src/identity.js
  function identity_default2(x) {
    return x;
  }

  // node_modules/d3-format/src/locale.js
  var map = Array.prototype.map;
  var prefixes = ["y", "z", "a", "f", "p", "n", "\xB5", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"];
  function locale_default(locale2) {
    var group = locale2.grouping === void 0 || locale2.thousands === void 0 ? identity_default2 : formatGroup_default(map.call(locale2.grouping, Number), locale2.thousands + ""), currencyPrefix = locale2.currency === void 0 ? "" : locale2.currency[0] + "", currencySuffix = locale2.currency === void 0 ? "" : locale2.currency[1] + "", decimal = locale2.decimal === void 0 ? "." : locale2.decimal + "", numerals = locale2.numerals === void 0 ? identity_default2 : formatNumerals_default(map.call(locale2.numerals, String)), percent = locale2.percent === void 0 ? "%" : locale2.percent + "", minus = locale2.minus === void 0 ? "\u2212" : locale2.minus + "", nan = locale2.nan === void 0 ? "NaN" : locale2.nan + "";
    function newFormat(specifier) {
      specifier = formatSpecifier(specifier);
      var fill = specifier.fill, align = specifier.align, sign = specifier.sign, symbol = specifier.symbol, zero2 = specifier.zero, width = specifier.width, comma = specifier.comma, precision = specifier.precision, trim = specifier.trim, type2 = specifier.type;
      if (type2 === "n") comma = true, type2 = "g";
      else if (!formatTypes_default[type2]) precision === void 0 && (precision = 12), trim = true, type2 = "g";
      if (zero2 || fill === "0" && align === "=") zero2 = true, fill = "0", align = "=";
      var prefix2 = symbol === "$" ? currencyPrefix : symbol === "#" && /[boxX]/.test(type2) ? "0" + type2.toLowerCase() : "", suffix = symbol === "$" ? currencySuffix : /[%p]/.test(type2) ? percent : "";
      var formatType = formatTypes_default[type2], maybeSuffix = /[defgprs%]/.test(type2);
      precision = precision === void 0 ? 6 : /[gprs]/.test(type2) ? Math.max(1, Math.min(21, precision)) : Math.max(0, Math.min(20, precision));
      function format2(value) {
        var valuePrefix = prefix2, valueSuffix = suffix, i, n, c;
        if (type2 === "c") {
          valueSuffix = formatType(value) + valueSuffix;
          value = "";
        } else {
          value = +value;
          var valueNegative = value < 0 || 1 / value < 0;
          value = isNaN(value) ? nan : formatType(Math.abs(value), precision);
          if (trim) value = formatTrim_default(value);
          if (valueNegative && +value === 0 && sign !== "+") valueNegative = false;
          valuePrefix = (valueNegative ? sign === "(" ? sign : minus : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
          valueSuffix = (type2 === "s" ? prefixes[8 + prefixExponent / 3] : "") + valueSuffix + (valueNegative && sign === "(" ? ")" : "");
          if (maybeSuffix) {
            i = -1, n = value.length;
            while (++i < n) {
              if (c = value.charCodeAt(i), 48 > c || c > 57) {
                valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
                value = value.slice(0, i);
                break;
              }
            }
          }
        }
        if (comma && !zero2) value = group(value, Infinity);
        var length = valuePrefix.length + value.length + valueSuffix.length, padding = length < width ? new Array(width - length + 1).join(fill) : "";
        if (comma && zero2) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";
        switch (align) {
          case "<":
            value = valuePrefix + value + valueSuffix + padding;
            break;
          case "=":
            value = valuePrefix + padding + value + valueSuffix;
            break;
          case "^":
            value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length);
            break;
          default:
            value = padding + valuePrefix + value + valueSuffix;
            break;
        }
        return numerals(value);
      }
      format2.toString = function() {
        return specifier + "";
      };
      return format2;
    }
    function formatPrefix2(specifier, value) {
      var f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)), e = Math.max(-8, Math.min(8, Math.floor(exponent_default(value) / 3))) * 3, k = Math.pow(10, -e), prefix2 = prefixes[8 + e / 3];
      return function(value2) {
        return f(k * value2) + prefix2;
      };
    }
    return {
      format: newFormat,
      formatPrefix: formatPrefix2
    };
  }

  // node_modules/d3-format/src/defaultLocale.js
  var locale;
  var format;
  var formatPrefix;
  defaultLocale({
    thousands: ",",
    grouping: [3],
    currency: ["$", ""]
  });
  function defaultLocale(definition) {
    locale = locale_default(definition);
    format = locale.format;
    formatPrefix = locale.formatPrefix;
    return locale;
  }

  // node_modules/d3-format/src/precisionFixed.js
  function precisionFixed_default(step) {
    return Math.max(0, -exponent_default(Math.abs(step)));
  }

  // node_modules/d3-format/src/precisionPrefix.js
  function precisionPrefix_default(step, value) {
    return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent_default(value) / 3))) * 3 - exponent_default(Math.abs(step)));
  }

  // node_modules/d3-format/src/precisionRound.js
  function precisionRound_default(step, max2) {
    step = Math.abs(step), max2 = Math.abs(max2) - step;
    return Math.max(0, exponent_default(max2) - exponent_default(step)) + 1;
  }

  // node_modules/d3-hierarchy/src/hierarchy/count.js
  function count(node) {
    var sum = 0, children2 = node.children, i = children2 && children2.length;
    if (!i) sum = 1;
    else while (--i >= 0) sum += children2[i].value;
    node.value = sum;
  }
  function count_default() {
    return this.eachAfter(count);
  }

  // node_modules/d3-hierarchy/src/hierarchy/each.js
  function each_default2(callback, that) {
    let index = -1;
    for (const node of this) {
      callback.call(that, node, ++index, this);
    }
    return this;
  }

  // node_modules/d3-hierarchy/src/hierarchy/eachBefore.js
  function eachBefore_default(callback, that) {
    var node = this, nodes = [node], children2, i, index = -1;
    while (node = nodes.pop()) {
      callback.call(that, node, ++index, this);
      if (children2 = node.children) {
        for (i = children2.length - 1; i >= 0; --i) {
          nodes.push(children2[i]);
        }
      }
    }
    return this;
  }

  // node_modules/d3-hierarchy/src/hierarchy/eachAfter.js
  function eachAfter_default(callback, that) {
    var node = this, nodes = [node], next = [], children2, i, n, index = -1;
    while (node = nodes.pop()) {
      next.push(node);
      if (children2 = node.children) {
        for (i = 0, n = children2.length; i < n; ++i) {
          nodes.push(children2[i]);
        }
      }
    }
    while (node = next.pop()) {
      callback.call(that, node, ++index, this);
    }
    return this;
  }

  // node_modules/d3-hierarchy/src/hierarchy/find.js
  function find_default(callback, that) {
    let index = -1;
    for (const node of this) {
      if (callback.call(that, node, ++index, this)) {
        return node;
      }
    }
  }

  // node_modules/d3-hierarchy/src/hierarchy/sum.js
  function sum_default(value) {
    return this.eachAfter(function(node) {
      var sum = +value(node.data) || 0, children2 = node.children, i = children2 && children2.length;
      while (--i >= 0) sum += children2[i].value;
      node.value = sum;
    });
  }

  // node_modules/d3-hierarchy/src/hierarchy/sort.js
  function sort_default2(compare) {
    return this.eachBefore(function(node) {
      if (node.children) {
        node.children.sort(compare);
      }
    });
  }

  // node_modules/d3-hierarchy/src/hierarchy/path.js
  function path_default(end) {
    var start2 = this, ancestor = leastCommonAncestor(start2, end), nodes = [start2];
    while (start2 !== ancestor) {
      start2 = start2.parent;
      nodes.push(start2);
    }
    var k = nodes.length;
    while (end !== ancestor) {
      nodes.splice(k, 0, end);
      end = end.parent;
    }
    return nodes;
  }
  function leastCommonAncestor(a, b) {
    if (a === b) return a;
    var aNodes = a.ancestors(), bNodes = b.ancestors(), c = null;
    a = aNodes.pop();
    b = bNodes.pop();
    while (a === b) {
      c = a;
      a = aNodes.pop();
      b = bNodes.pop();
    }
    return c;
  }

  // node_modules/d3-hierarchy/src/hierarchy/ancestors.js
  function ancestors_default() {
    var node = this, nodes = [node];
    while (node = node.parent) {
      nodes.push(node);
    }
    return nodes;
  }

  // node_modules/d3-hierarchy/src/hierarchy/descendants.js
  function descendants_default() {
    return Array.from(this);
  }

  // node_modules/d3-hierarchy/src/hierarchy/leaves.js
  function leaves_default() {
    var leaves = [];
    this.eachBefore(function(node) {
      if (!node.children) {
        leaves.push(node);
      }
    });
    return leaves;
  }

  // node_modules/d3-hierarchy/src/hierarchy/links.js
  function links_default() {
    var root2 = this, links = [];
    root2.each(function(node) {
      if (node !== root2) {
        links.push({ source: node.parent, target: node });
      }
    });
    return links;
  }

  // node_modules/d3-hierarchy/src/hierarchy/iterator.js
  function* iterator_default2() {
    var node = this, current, next = [node], children2, i, n;
    do {
      current = next.reverse(), next = [];
      while (node = current.pop()) {
        yield node;
        if (children2 = node.children) {
          for (i = 0, n = children2.length; i < n; ++i) {
            next.push(children2[i]);
          }
        }
      }
    } while (next.length);
  }

  // node_modules/d3-hierarchy/src/hierarchy/index.js
  function hierarchy(data, children2) {
    if (data instanceof Map) {
      data = [void 0, data];
      if (children2 === void 0) children2 = mapChildren;
    } else if (children2 === void 0) {
      children2 = objectChildren;
    }
    var root2 = new Node(data), node, nodes = [root2], child, childs, i, n;
    while (node = nodes.pop()) {
      if ((childs = children2(node.data)) && (n = (childs = Array.from(childs)).length)) {
        node.children = childs;
        for (i = n - 1; i >= 0; --i) {
          nodes.push(child = childs[i] = new Node(childs[i]));
          child.parent = node;
          child.depth = node.depth + 1;
        }
      }
    }
    return root2.eachBefore(computeHeight);
  }
  function node_copy() {
    return hierarchy(this).eachBefore(copyData);
  }
  function objectChildren(d) {
    return d.children;
  }
  function mapChildren(d) {
    return Array.isArray(d) ? d[1] : null;
  }
  function copyData(node) {
    if (node.data.value !== void 0) node.value = node.data.value;
    node.data = node.data.data;
  }
  function computeHeight(node) {
    var height = 0;
    do
      node.height = height;
    while ((node = node.parent) && node.height < ++height);
  }
  function Node(data) {
    this.data = data;
    this.depth = this.height = 0;
    this.parent = null;
  }
  Node.prototype = hierarchy.prototype = {
    constructor: Node,
    count: count_default,
    each: each_default2,
    eachAfter: eachAfter_default,
    eachBefore: eachBefore_default,
    find: find_default,
    sum: sum_default,
    sort: sort_default2,
    path: path_default,
    ancestors: ancestors_default,
    descendants: descendants_default,
    leaves: leaves_default,
    links: links_default,
    copy: node_copy,
    [Symbol.iterator]: iterator_default2
  };

  // node_modules/d3-hierarchy/src/array.js
  function array_default(x) {
    return typeof x === "object" && "length" in x ? x : Array.from(x);
  }
  function shuffle(array2) {
    var m = array2.length, t, i;
    while (m) {
      i = Math.random() * m-- | 0;
      t = array2[m];
      array2[m] = array2[i];
      array2[i] = t;
    }
    return array2;
  }

  // node_modules/d3-hierarchy/src/pack/enclose.js
  function enclose_default(circles) {
    var i = 0, n = (circles = shuffle(Array.from(circles))).length, B = [], p, e;
    while (i < n) {
      p = circles[i];
      if (e && enclosesWeak(e, p)) ++i;
      else e = encloseBasis(B = extendBasis(B, p)), i = 0;
    }
    return e;
  }
  function extendBasis(B, p) {
    var i, j;
    if (enclosesWeakAll(p, B)) return [p];
    for (i = 0; i < B.length; ++i) {
      if (enclosesNot(p, B[i]) && enclosesWeakAll(encloseBasis2(B[i], p), B)) {
        return [B[i], p];
      }
    }
    for (i = 0; i < B.length - 1; ++i) {
      for (j = i + 1; j < B.length; ++j) {
        if (enclosesNot(encloseBasis2(B[i], B[j]), p) && enclosesNot(encloseBasis2(B[i], p), B[j]) && enclosesNot(encloseBasis2(B[j], p), B[i]) && enclosesWeakAll(encloseBasis3(B[i], B[j], p), B)) {
          return [B[i], B[j], p];
        }
      }
    }
    throw new Error();
  }
  function enclosesNot(a, b) {
    var dr = a.r - b.r, dx = b.x - a.x, dy = b.y - a.y;
    return dr < 0 || dr * dr < dx * dx + dy * dy;
  }
  function enclosesWeak(a, b) {
    var dr = a.r - b.r + Math.max(a.r, b.r, 1) * 1e-9, dx = b.x - a.x, dy = b.y - a.y;
    return dr > 0 && dr * dr > dx * dx + dy * dy;
  }
  function enclosesWeakAll(a, B) {
    for (var i = 0; i < B.length; ++i) {
      if (!enclosesWeak(a, B[i])) {
        return false;
      }
    }
    return true;
  }
  function encloseBasis(B) {
    switch (B.length) {
      case 1:
        return encloseBasis1(B[0]);
      case 2:
        return encloseBasis2(B[0], B[1]);
      case 3:
        return encloseBasis3(B[0], B[1], B[2]);
    }
  }
  function encloseBasis1(a) {
    return {
      x: a.x,
      y: a.y,
      r: a.r
    };
  }
  function encloseBasis2(a, b) {
    var x1 = a.x, y1 = a.y, r1 = a.r, x2 = b.x, y2 = b.y, r2 = b.r, x21 = x2 - x1, y21 = y2 - y1, r21 = r2 - r1, l = Math.sqrt(x21 * x21 + y21 * y21);
    return {
      x: (x1 + x2 + x21 / l * r21) / 2,
      y: (y1 + y2 + y21 / l * r21) / 2,
      r: (l + r1 + r2) / 2
    };
  }
  function encloseBasis3(a, b, c) {
    var x1 = a.x, y1 = a.y, r1 = a.r, x2 = b.x, y2 = b.y, r2 = b.r, x3 = c.x, y3 = c.y, r3 = c.r, a2 = x1 - x2, a3 = x1 - x3, b2 = y1 - y2, b3 = y1 - y3, c2 = r2 - r1, c3 = r3 - r1, d1 = x1 * x1 + y1 * y1 - r1 * r1, d2 = d1 - x2 * x2 - y2 * y2 + r2 * r2, d3 = d1 - x3 * x3 - y3 * y3 + r3 * r3, ab = a3 * b2 - a2 * b3, xa = (b2 * d3 - b3 * d2) / (ab * 2) - x1, xb = (b3 * c2 - b2 * c3) / ab, ya = (a3 * d2 - a2 * d3) / (ab * 2) - y1, yb = (a2 * c3 - a3 * c2) / ab, A = xb * xb + yb * yb - 1, B = 2 * (r1 + xa * xb + ya * yb), C = xa * xa + ya * ya - r1 * r1, r = -(A ? (B + Math.sqrt(B * B - 4 * A * C)) / (2 * A) : C / B);
    return {
      x: x1 + xa + xb * r,
      y: y1 + ya + yb * r,
      r
    };
  }

  // node_modules/d3-hierarchy/src/pack/siblings.js
  function place(b, a, c) {
    var dx = b.x - a.x, x, a2, dy = b.y - a.y, y, b2, d2 = dx * dx + dy * dy;
    if (d2) {
      a2 = a.r + c.r, a2 *= a2;
      b2 = b.r + c.r, b2 *= b2;
      if (a2 > b2) {
        x = (d2 + b2 - a2) / (2 * d2);
        y = Math.sqrt(Math.max(0, b2 / d2 - x * x));
        c.x = b.x - x * dx - y * dy;
        c.y = b.y - x * dy + y * dx;
      } else {
        x = (d2 + a2 - b2) / (2 * d2);
        y = Math.sqrt(Math.max(0, a2 / d2 - x * x));
        c.x = a.x + x * dx - y * dy;
        c.y = a.y + x * dy + y * dx;
      }
    } else {
      c.x = a.x + c.r;
      c.y = a.y;
    }
  }
  function intersects(a, b) {
    var dr = a.r + b.r - 1e-6, dx = b.x - a.x, dy = b.y - a.y;
    return dr > 0 && dr * dr > dx * dx + dy * dy;
  }
  function score(node) {
    var a = node._, b = node.next._, ab = a.r + b.r, dx = (a.x * b.r + b.x * a.r) / ab, dy = (a.y * b.r + b.y * a.r) / ab;
    return dx * dx + dy * dy;
  }
  function Node2(circle) {
    this._ = circle;
    this.next = null;
    this.previous = null;
  }
  function packEnclose(circles) {
    if (!(n = (circles = array_default(circles)).length)) return 0;
    var a, b, c, n, aa, ca, i, j, k, sj, sk;
    a = circles[0], a.x = 0, a.y = 0;
    if (!(n > 1)) return a.r;
    b = circles[1], a.x = -b.r, b.x = a.r, b.y = 0;
    if (!(n > 2)) return a.r + b.r;
    place(b, a, c = circles[2]);
    a = new Node2(a), b = new Node2(b), c = new Node2(c);
    a.next = c.previous = b;
    b.next = a.previous = c;
    c.next = b.previous = a;
    pack: for (i = 3; i < n; ++i) {
      place(a._, b._, c = circles[i]), c = new Node2(c);
      j = b.next, k = a.previous, sj = b._.r, sk = a._.r;
      do {
        if (sj <= sk) {
          if (intersects(j._, c._)) {
            b = j, a.next = b, b.previous = a, --i;
            continue pack;
          }
          sj += j._.r, j = j.next;
        } else {
          if (intersects(k._, c._)) {
            a = k, a.next = b, b.previous = a, --i;
            continue pack;
          }
          sk += k._.r, k = k.previous;
        }
      } while (j !== k.next);
      c.previous = a, c.next = b, a.next = b.previous = b = c;
      aa = score(a);
      while ((c = c.next) !== b) {
        if ((ca = score(c)) < aa) {
          a = c, aa = ca;
        }
      }
      b = a.next;
    }
    a = [b._], c = b;
    while ((c = c.next) !== b) a.push(c._);
    c = enclose_default(a);
    for (i = 0; i < n; ++i) a = circles[i], a.x -= c.x, a.y -= c.y;
    return c.r;
  }

  // node_modules/d3-hierarchy/src/accessors.js
  function optional(f) {
    return f == null ? null : required(f);
  }
  function required(f) {
    if (typeof f !== "function") throw new Error();
    return f;
  }

  // node_modules/d3-hierarchy/src/constant.js
  function constantZero() {
    return 0;
  }
  function constant_default4(x) {
    return function() {
      return x;
    };
  }

  // node_modules/d3-hierarchy/src/pack/index.js
  function defaultRadius(d) {
    return Math.sqrt(d.value);
  }
  function pack_default() {
    var radius = null, dx = 1, dy = 1, padding = constantZero;
    function pack(root2) {
      root2.x = dx / 2, root2.y = dy / 2;
      if (radius) {
        root2.eachBefore(radiusLeaf(radius)).eachAfter(packChildren(padding, 0.5)).eachBefore(translateChild(1));
      } else {
        root2.eachBefore(radiusLeaf(defaultRadius)).eachAfter(packChildren(constantZero, 1)).eachAfter(packChildren(padding, root2.r / Math.min(dx, dy))).eachBefore(translateChild(Math.min(dx, dy) / (2 * root2.r)));
      }
      return root2;
    }
    pack.radius = function(x) {
      return arguments.length ? (radius = optional(x), pack) : radius;
    };
    pack.size = function(x) {
      return arguments.length ? (dx = +x[0], dy = +x[1], pack) : [dx, dy];
    };
    pack.padding = function(x) {
      return arguments.length ? (padding = typeof x === "function" ? x : constant_default4(+x), pack) : padding;
    };
    return pack;
  }
  function radiusLeaf(radius) {
    return function(node) {
      if (!node.children) {
        node.r = Math.max(0, +radius(node) || 0);
      }
    };
  }
  function packChildren(padding, k) {
    return function(node) {
      if (children2 = node.children) {
        var children2, i, n = children2.length, r = padding(node) * k || 0, e;
        if (r) for (i = 0; i < n; ++i) children2[i].r += r;
        e = packEnclose(children2);
        if (r) for (i = 0; i < n; ++i) children2[i].r -= r;
        node.r = e + r;
      }
    };
  }
  function translateChild(k) {
    return function(node) {
      var parent = node.parent;
      node.r *= k;
      if (parent) {
        node.x = parent.x + k * node.x;
        node.y = parent.y + k * node.y;
      }
    };
  }

  // node_modules/d3-scale/src/init.js
  function initRange(domain, range2) {
    switch (arguments.length) {
      case 0:
        break;
      case 1:
        this.range(domain);
        break;
      default:
        this.range(range2).domain(domain);
        break;
    }
    return this;
  }

  // node_modules/d3-scale/src/ordinal.js
  var implicit = Symbol("implicit");
  function ordinal() {
    var index = new InternMap(), domain = [], range2 = [], unknown = implicit;
    function scale(d) {
      let i = index.get(d);
      if (i === void 0) {
        if (unknown !== implicit) return unknown;
        index.set(d, i = domain.push(d) - 1);
      }
      return range2[i % range2.length];
    }
    scale.domain = function(_) {
      if (!arguments.length) return domain.slice();
      domain = [], index = new InternMap();
      for (const value of _) {
        if (index.has(value)) continue;
        index.set(value, domain.push(value) - 1);
      }
      return scale;
    };
    scale.range = function(_) {
      return arguments.length ? (range2 = Array.from(_), scale) : range2.slice();
    };
    scale.unknown = function(_) {
      return arguments.length ? (unknown = _, scale) : unknown;
    };
    scale.copy = function() {
      return ordinal(domain, range2).unknown(unknown);
    };
    initRange.apply(scale, arguments);
    return scale;
  }

  // node_modules/d3-scale/src/band.js
  function band() {
    var scale = ordinal().unknown(void 0), domain = scale.domain, ordinalRange = scale.range, r0 = 0, r1 = 1, step, bandwidth, round = false, paddingInner = 0, paddingOuter = 0, align = 0.5;
    delete scale.unknown;
    function rescale() {
      var n = domain().length, reverse = r1 < r0, start2 = reverse ? r1 : r0, stop = reverse ? r0 : r1;
      step = (stop - start2) / Math.max(1, n - paddingInner + paddingOuter * 2);
      if (round) step = Math.floor(step);
      start2 += (stop - start2 - step * (n - paddingInner)) * align;
      bandwidth = step * (1 - paddingInner);
      if (round) start2 = Math.round(start2), bandwidth = Math.round(bandwidth);
      var values = range(n).map(function(i) {
        return start2 + step * i;
      });
      return ordinalRange(reverse ? values.reverse() : values);
    }
    scale.domain = function(_) {
      return arguments.length ? (domain(_), rescale()) : domain();
    };
    scale.range = function(_) {
      return arguments.length ? ([r0, r1] = _, r0 = +r0, r1 = +r1, rescale()) : [r0, r1];
    };
    scale.rangeRound = function(_) {
      return [r0, r1] = _, r0 = +r0, r1 = +r1, round = true, rescale();
    };
    scale.bandwidth = function() {
      return bandwidth;
    };
    scale.step = function() {
      return step;
    };
    scale.round = function(_) {
      return arguments.length ? (round = !!_, rescale()) : round;
    };
    scale.padding = function(_) {
      return arguments.length ? (paddingInner = Math.min(1, paddingOuter = +_), rescale()) : paddingInner;
    };
    scale.paddingInner = function(_) {
      return arguments.length ? (paddingInner = Math.min(1, _), rescale()) : paddingInner;
    };
    scale.paddingOuter = function(_) {
      return arguments.length ? (paddingOuter = +_, rescale()) : paddingOuter;
    };
    scale.align = function(_) {
      return arguments.length ? (align = Math.max(0, Math.min(1, _)), rescale()) : align;
    };
    scale.copy = function() {
      return band(domain(), [r0, r1]).round(round).paddingInner(paddingInner).paddingOuter(paddingOuter).align(align);
    };
    return initRange.apply(rescale(), arguments);
  }

  // node_modules/d3-scale/src/constant.js
  function constants(x) {
    return function() {
      return x;
    };
  }

  // node_modules/d3-scale/src/number.js
  function number3(x) {
    return +x;
  }

  // node_modules/d3-scale/src/continuous.js
  var unit = [0, 1];
  function identity2(x) {
    return x;
  }
  function normalize(a, b) {
    return (b -= a = +a) ? function(x) {
      return (x - a) / b;
    } : constants(isNaN(b) ? NaN : 0.5);
  }
  function clamper(a, b) {
    var t;
    if (a > b) t = a, a = b, b = t;
    return function(x) {
      return Math.max(a, Math.min(b, x));
    };
  }
  function bimap(domain, range2, interpolate) {
    var d0 = domain[0], d1 = domain[1], r0 = range2[0], r1 = range2[1];
    if (d1 < d0) d0 = normalize(d1, d0), r0 = interpolate(r1, r0);
    else d0 = normalize(d0, d1), r0 = interpolate(r0, r1);
    return function(x) {
      return r0(d0(x));
    };
  }
  function polymap(domain, range2, interpolate) {
    var j = Math.min(domain.length, range2.length) - 1, d = new Array(j), r = new Array(j), i = -1;
    if (domain[j] < domain[0]) {
      domain = domain.slice().reverse();
      range2 = range2.slice().reverse();
    }
    while (++i < j) {
      d[i] = normalize(domain[i], domain[i + 1]);
      r[i] = interpolate(range2[i], range2[i + 1]);
    }
    return function(x) {
      var i2 = bisect_default(domain, x, 1, j) - 1;
      return r[i2](d[i2](x));
    };
  }
  function copy(source, target) {
    return target.domain(source.domain()).range(source.range()).interpolate(source.interpolate()).clamp(source.clamp()).unknown(source.unknown());
  }
  function transformer() {
    var domain = unit, range2 = unit, interpolate = value_default, transform2, untransform, unknown, clamp = identity2, piecewise, output, input;
    function rescale() {
      var n = Math.min(domain.length, range2.length);
      if (clamp !== identity2) clamp = clamper(domain[0], domain[n - 1]);
      piecewise = n > 2 ? polymap : bimap;
      output = input = null;
      return scale;
    }
    function scale(x) {
      return x == null || isNaN(x = +x) ? unknown : (output || (output = piecewise(domain.map(transform2), range2, interpolate)))(transform2(clamp(x)));
    }
    scale.invert = function(y) {
      return clamp(untransform((input || (input = piecewise(range2, domain.map(transform2), number_default)))(y)));
    };
    scale.domain = function(_) {
      return arguments.length ? (domain = Array.from(_, number3), rescale()) : domain.slice();
    };
    scale.range = function(_) {
      return arguments.length ? (range2 = Array.from(_), rescale()) : range2.slice();
    };
    scale.rangeRound = function(_) {
      return range2 = Array.from(_), interpolate = round_default, rescale();
    };
    scale.clamp = function(_) {
      return arguments.length ? (clamp = _ ? true : identity2, rescale()) : clamp !== identity2;
    };
    scale.interpolate = function(_) {
      return arguments.length ? (interpolate = _, rescale()) : interpolate;
    };
    scale.unknown = function(_) {
      return arguments.length ? (unknown = _, scale) : unknown;
    };
    return function(t, u) {
      transform2 = t, untransform = u;
      return rescale();
    };
  }
  function continuous() {
    return transformer()(identity2, identity2);
  }

  // node_modules/d3-scale/src/tickFormat.js
  function tickFormat(start2, stop, count2, specifier) {
    var step = tickStep(start2, stop, count2), precision;
    specifier = formatSpecifier(specifier == null ? ",f" : specifier);
    switch (specifier.type) {
      case "s": {
        var value = Math.max(Math.abs(start2), Math.abs(stop));
        if (specifier.precision == null && !isNaN(precision = precisionPrefix_default(step, value))) specifier.precision = precision;
        return formatPrefix(specifier, value);
      }
      case "":
      case "e":
      case "g":
      case "p":
      case "r": {
        if (specifier.precision == null && !isNaN(precision = precisionRound_default(step, Math.max(Math.abs(start2), Math.abs(stop))))) specifier.precision = precision - (specifier.type === "e");
        break;
      }
      case "f":
      case "%": {
        if (specifier.precision == null && !isNaN(precision = precisionFixed_default(step))) specifier.precision = precision - (specifier.type === "%") * 2;
        break;
      }
    }
    return format(specifier);
  }

  // node_modules/d3-scale/src/linear.js
  function linearish(scale) {
    var domain = scale.domain;
    scale.ticks = function(count2) {
      var d = domain();
      return ticks(d[0], d[d.length - 1], count2 == null ? 10 : count2);
    };
    scale.tickFormat = function(count2, specifier) {
      var d = domain();
      return tickFormat(d[0], d[d.length - 1], count2 == null ? 10 : count2, specifier);
    };
    scale.nice = function(count2) {
      if (count2 == null) count2 = 10;
      var d = domain();
      var i0 = 0;
      var i1 = d.length - 1;
      var start2 = d[i0];
      var stop = d[i1];
      var prestep;
      var step;
      var maxIter = 10;
      if (stop < start2) {
        step = start2, start2 = stop, stop = step;
        step = i0, i0 = i1, i1 = step;
      }
      while (maxIter-- > 0) {
        step = tickIncrement(start2, stop, count2);
        if (step === prestep) {
          d[i0] = start2;
          d[i1] = stop;
          return domain(d);
        } else if (step > 0) {
          start2 = Math.floor(start2 / step) * step;
          stop = Math.ceil(stop / step) * step;
        } else if (step < 0) {
          start2 = Math.ceil(start2 * step) / step;
          stop = Math.floor(stop * step) / step;
        } else {
          break;
        }
        prestep = step;
      }
      return scale;
    };
    return scale;
  }
  function linear2() {
    var scale = continuous();
    scale.copy = function() {
      return copy(scale, linear2());
    };
    initRange.apply(scale, arguments);
    return linearish(scale);
  }

  // node_modules/d3-scale-chromatic/src/colors.js
  function colors_default(specifier) {
    var n = specifier.length / 6 | 0, colors = new Array(n), i = 0;
    while (i < n) colors[i] = "#" + specifier.slice(i * 6, ++i * 6);
    return colors;
  }

  // node_modules/d3-scale-chromatic/src/categorical/Set3.js
  var Set3_default = colors_default("8dd3c7ffffb3bebadafb807280b1d3fdb462b3de69fccde5d9d9d9bc80bdccebc5ffed6f");

  // node_modules/d3-zoom/src/transform.js
  function Transform(k, x, y) {
    this.k = k;
    this.x = x;
    this.y = y;
  }
  Transform.prototype = {
    constructor: Transform,
    scale: function(k) {
      return k === 1 ? this : new Transform(this.k * k, this.x, this.y);
    },
    translate: function(x, y) {
      return x === 0 & y === 0 ? this : new Transform(this.k, this.x + this.k * x, this.y + this.k * y);
    },
    apply: function(point2) {
      return [point2[0] * this.k + this.x, point2[1] * this.k + this.y];
    },
    applyX: function(x) {
      return x * this.k + this.x;
    },
    applyY: function(y) {
      return y * this.k + this.y;
    },
    invert: function(location) {
      return [(location[0] - this.x) / this.k, (location[1] - this.y) / this.k];
    },
    invertX: function(x) {
      return (x - this.x) / this.k;
    },
    invertY: function(y) {
      return (y - this.y) / this.k;
    },
    rescaleX: function(x) {
      return x.copy().domain(x.range().map(this.invertX, this).map(x.invert, x));
    },
    rescaleY: function(y) {
      return y.copy().domain(y.range().map(this.invertY, this).map(y.invert, y));
    },
    toString: function() {
      return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
    }
  };
  var identity3 = new Transform(1, 0, 0);
  transform.prototype = Transform.prototype;
  function transform(node) {
    while (!node.__zoom) if (!(node = node.parentNode)) return identity3;
    return node.__zoom;
  }

  // lib/esm/constants.js
  var DEFAULT_COLOR = "#EEE";
  var FONT_FAMILY = "Lucida Grande, Tahoma, Verdana, Ar";
  var FONT_SIZE = 12;
  var FONT_COLOR = "#4B4F56";
  var AXIS_COLOR = "#DDD";

  // lib/esm/utils.js
  function createCircle(data, x, y, r, onClick, onMouseover, onMouseout) {
    var circle = document.createElement("div");
    circle.setAttribute("style", "\n    position: absolute;\n    left: " + (x - r) + "px;\n    top: " + (y - r) + "px;\n    border-radius: 50%;\n    width: " + r * 2 + "px;\n    height: " + r * 2 + "px;\n    padding: 0px;\n    background-size: cover;\n    box-sizing: border-box;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    overflow: visable;\n    text-overflow: ellipsis;\n    color: " + FONT_COLOR + ";\n    font-size: " + FONT_SIZE + "px;\n    font-family: " + FONT_FAMILY + ";\n  ");
    var events = {
      "click": onClick,
      "mouseover": onMouseover,
      "mouseout": onMouseout
    };
    var _loop_1 = function(e3) {
      circle.addEventListener(e3, function(event) {
        events[e3] && events[e3](event, data);
      });
    };
    for (var e in events) {
      _loop_1(e);
    }
    return circle;
  }
  function createText(x, y, width, height, txt, z) {
    var text = document.createElement("div");
    var zIndex = z != null ? z : 1;
    text.setAttribute("style", "\n    position: absolute;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    left: " + (x - width / 2) + "px;\n    top: " + (y - height / 2) + "px;\n    color: " + FONT_COLOR + ";\n    font-family: " + FONT_FAMILY + ";\n    font-size: " + FONT_SIZE + ";\n    width: " + width + "px;\n    height: " + height + "px;\n    zIndex: " + zIndex + ";\n    opacity: 0;\n    white-space: nowrap;\n  ");
    text.innerHTML += txt;
    return text;
  }

  // lib/esm/layouts/LayoutBase.js
  var LayoutBase = (
    /** @class */
    function() {
      function LayoutBase2(data, options, width, height) {
        this.data = data;
        this.options = options;
        this.width = width;
        this.height = height;
      }
      LayoutBase2.prototype.calculateCirclesLayout = function() {
        return {
          layoutProperties: {},
          additionalVisual: null
        };
      };
      return LayoutBase2;
    }()
  );
  var LayoutBase_default = LayoutBase;

  // node_modules/animejs/lib/anime.es.js
  var defaultInstanceSettings = {
    update: null,
    begin: null,
    loopBegin: null,
    changeBegin: null,
    change: null,
    changeComplete: null,
    loopComplete: null,
    complete: null,
    loop: 1,
    direction: "normal",
    autoplay: true,
    timelineOffset: 0
  };
  var defaultTweenSettings = {
    duration: 1e3,
    delay: 0,
    endDelay: 0,
    easing: "easeOutElastic(1, .5)",
    round: 0
  };
  var validTransforms = ["translateX", "translateY", "translateZ", "rotate", "rotateX", "rotateY", "rotateZ", "scale", "scaleX", "scaleY", "scaleZ", "skew", "skewX", "skewY", "perspective", "matrix", "matrix3d"];
  var cache = {
    CSS: {},
    springs: {}
  };
  function minMax(val, min2, max2) {
    return Math.min(Math.max(val, min2), max2);
  }
  function stringContains(str, text) {
    return str.indexOf(text) > -1;
  }
  function applyArguments(func, args) {
    return func.apply(null, args);
  }
  var is = {
    arr: function(a) {
      return Array.isArray(a);
    },
    obj: function(a) {
      return stringContains(Object.prototype.toString.call(a), "Object");
    },
    pth: function(a) {
      return is.obj(a) && a.hasOwnProperty("totalLength");
    },
    svg: function(a) {
      return a instanceof SVGElement;
    },
    inp: function(a) {
      return a instanceof HTMLInputElement;
    },
    dom: function(a) {
      return a.nodeType || is.svg(a);
    },
    str: function(a) {
      return typeof a === "string";
    },
    fnc: function(a) {
      return typeof a === "function";
    },
    und: function(a) {
      return typeof a === "undefined";
    },
    nil: function(a) {
      return is.und(a) || a === null;
    },
    hex: function(a) {
      return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(a);
    },
    rgb: function(a) {
      return /^rgb/.test(a);
    },
    hsl: function(a) {
      return /^hsl/.test(a);
    },
    col: function(a) {
      return is.hex(a) || is.rgb(a) || is.hsl(a);
    },
    key: function(a) {
      return !defaultInstanceSettings.hasOwnProperty(a) && !defaultTweenSettings.hasOwnProperty(a) && a !== "targets" && a !== "keyframes";
    }
  };
  function parseEasingParameters(string) {
    var match = /\(([^)]+)\)/.exec(string);
    return match ? match[1].split(",").map(function(p) {
      return parseFloat(p);
    }) : [];
  }
  function spring(string, duration) {
    var params = parseEasingParameters(string);
    var mass = minMax(is.und(params[0]) ? 1 : params[0], 0.1, 100);
    var stiffness = minMax(is.und(params[1]) ? 100 : params[1], 0.1, 100);
    var damping = minMax(is.und(params[2]) ? 10 : params[2], 0.1, 100);
    var velocity = minMax(is.und(params[3]) ? 0 : params[3], 0.1, 100);
    var w0 = Math.sqrt(stiffness / mass);
    var zeta = damping / (2 * Math.sqrt(stiffness * mass));
    var wd = zeta < 1 ? w0 * Math.sqrt(1 - zeta * zeta) : 0;
    var a = 1;
    var b = zeta < 1 ? (zeta * w0 + -velocity) / wd : -velocity + w0;
    function solver(t) {
      var progress = duration ? duration * t / 1e3 : t;
      if (zeta < 1) {
        progress = Math.exp(-progress * zeta * w0) * (a * Math.cos(wd * progress) + b * Math.sin(wd * progress));
      } else {
        progress = (a + b * progress) * Math.exp(-progress * w0);
      }
      if (t === 0 || t === 1) {
        return t;
      }
      return 1 - progress;
    }
    function getDuration() {
      var cached = cache.springs[string];
      if (cached) {
        return cached;
      }
      var frame2 = 1 / 6;
      var elapsed = 0;
      var rest = 0;
      while (true) {
        elapsed += frame2;
        if (solver(elapsed) === 1) {
          rest++;
          if (rest >= 16) {
            break;
          }
        } else {
          rest = 0;
        }
      }
      var duration2 = elapsed * frame2 * 1e3;
      cache.springs[string] = duration2;
      return duration2;
    }
    return duration ? solver : getDuration;
  }
  function steps(steps2) {
    if (steps2 === void 0) steps2 = 10;
    return function(t) {
      return Math.ceil(minMax(t, 1e-6, 1) * steps2) * (1 / steps2);
    };
  }
  var bezier = function() {
    var kSplineTableSize = 11;
    var kSampleStepSize = 1 / (kSplineTableSize - 1);
    function A(aA1, aA2) {
      return 1 - 3 * aA2 + 3 * aA1;
    }
    function B(aA1, aA2) {
      return 3 * aA2 - 6 * aA1;
    }
    function C(aA1) {
      return 3 * aA1;
    }
    function calcBezier(aT, aA1, aA2) {
      return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
    }
    function getSlope(aT, aA1, aA2) {
      return 3 * A(aA1, aA2) * aT * aT + 2 * B(aA1, aA2) * aT + C(aA1);
    }
    function binarySubdivide(aX, aA, aB, mX1, mX2) {
      var currentX, currentT, i = 0;
      do {
        currentT = aA + (aB - aA) / 2;
        currentX = calcBezier(currentT, mX1, mX2) - aX;
        if (currentX > 0) {
          aB = currentT;
        } else {
          aA = currentT;
        }
      } while (Math.abs(currentX) > 1e-7 && ++i < 10);
      return currentT;
    }
    function newtonRaphsonIterate(aX, aGuessT, mX1, mX2) {
      for (var i = 0; i < 4; ++i) {
        var currentSlope = getSlope(aGuessT, mX1, mX2);
        if (currentSlope === 0) {
          return aGuessT;
        }
        var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
        aGuessT -= currentX / currentSlope;
      }
      return aGuessT;
    }
    function bezier2(mX1, mY1, mX2, mY2) {
      if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
        return;
      }
      var sampleValues = new Float32Array(kSplineTableSize);
      if (mX1 !== mY1 || mX2 !== mY2) {
        for (var i = 0; i < kSplineTableSize; ++i) {
          sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
        }
      }
      function getTForX(aX) {
        var intervalStart = 0;
        var currentSample = 1;
        var lastSample = kSplineTableSize - 1;
        for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
          intervalStart += kSampleStepSize;
        }
        --currentSample;
        var dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
        var guessForT = intervalStart + dist * kSampleStepSize;
        var initialSlope = getSlope(guessForT, mX1, mX2);
        if (initialSlope >= 1e-3) {
          return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
        } else if (initialSlope === 0) {
          return guessForT;
        } else {
          return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
        }
      }
      return function(x) {
        if (mX1 === mY1 && mX2 === mY2) {
          return x;
        }
        if (x === 0 || x === 1) {
          return x;
        }
        return calcBezier(getTForX(x), mY1, mY2);
      };
    }
    return bezier2;
  }();
  var penner = function() {
    var eases = { linear: function() {
      return function(t) {
        return t;
      };
    } };
    var functionEasings = {
      Sine: function() {
        return function(t) {
          return 1 - Math.cos(t * Math.PI / 2);
        };
      },
      Circ: function() {
        return function(t) {
          return 1 - Math.sqrt(1 - t * t);
        };
      },
      Back: function() {
        return function(t) {
          return t * t * (3 * t - 2);
        };
      },
      Bounce: function() {
        return function(t) {
          var pow2, b = 4;
          while (t < ((pow2 = Math.pow(2, --b)) - 1) / 11) {
          }
          return 1 / Math.pow(4, 3 - b) - 7.5625 * Math.pow((pow2 * 3 - 2) / 22 - t, 2);
        };
      },
      Elastic: function(amplitude, period) {
        if (amplitude === void 0) amplitude = 1;
        if (period === void 0) period = 0.5;
        var a = minMax(amplitude, 1, 10);
        var p = minMax(period, 0.1, 2);
        return function(t) {
          return t === 0 || t === 1 ? t : -a * Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1 - p / (Math.PI * 2) * Math.asin(1 / a)) * (Math.PI * 2) / p);
        };
      }
    };
    var baseEasings = ["Quad", "Cubic", "Quart", "Quint", "Expo"];
    baseEasings.forEach(function(name, i) {
      functionEasings[name] = function() {
        return function(t) {
          return Math.pow(t, i + 2);
        };
      };
    });
    Object.keys(functionEasings).forEach(function(name) {
      var easeIn = functionEasings[name];
      eases["easeIn" + name] = easeIn;
      eases["easeOut" + name] = function(a, b) {
        return function(t) {
          return 1 - easeIn(a, b)(1 - t);
        };
      };
      eases["easeInOut" + name] = function(a, b) {
        return function(t) {
          return t < 0.5 ? easeIn(a, b)(t * 2) / 2 : 1 - easeIn(a, b)(t * -2 + 2) / 2;
        };
      };
      eases["easeOutIn" + name] = function(a, b) {
        return function(t) {
          return t < 0.5 ? (1 - easeIn(a, b)(1 - t * 2)) / 2 : (easeIn(a, b)(t * 2 - 1) + 1) / 2;
        };
      };
    });
    return eases;
  }();
  function parseEasings(easing, duration) {
    if (is.fnc(easing)) {
      return easing;
    }
    var name = easing.split("(")[0];
    var ease = penner[name];
    var args = parseEasingParameters(easing);
    switch (name) {
      case "spring":
        return spring(easing, duration);
      case "cubicBezier":
        return applyArguments(bezier, args);
      case "steps":
        return applyArguments(steps, args);
      default:
        return applyArguments(ease, args);
    }
  }
  function selectString(str) {
    try {
      var nodes = document.querySelectorAll(str);
      return nodes;
    } catch (e) {
      return;
    }
  }
  function filterArray(arr, callback) {
    var len = arr.length;
    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    var result = [];
    for (var i = 0; i < len; i++) {
      if (i in arr) {
        var val = arr[i];
        if (callback.call(thisArg, val, i, arr)) {
          result.push(val);
        }
      }
    }
    return result;
  }
  function flattenArray(arr) {
    return arr.reduce(function(a, b) {
      return a.concat(is.arr(b) ? flattenArray(b) : b);
    }, []);
  }
  function toArray(o) {
    if (is.arr(o)) {
      return o;
    }
    if (is.str(o)) {
      o = selectString(o) || o;
    }
    if (o instanceof NodeList || o instanceof HTMLCollection) {
      return [].slice.call(o);
    }
    return [o];
  }
  function arrayContains(arr, val) {
    return arr.some(function(a) {
      return a === val;
    });
  }
  function cloneObject(o) {
    var clone = {};
    for (var p in o) {
      clone[p] = o[p];
    }
    return clone;
  }
  function replaceObjectProps(o1, o2) {
    var o = cloneObject(o1);
    for (var p in o1) {
      o[p] = o2.hasOwnProperty(p) ? o2[p] : o1[p];
    }
    return o;
  }
  function mergeObjects(o1, o2) {
    var o = cloneObject(o1);
    for (var p in o2) {
      o[p] = is.und(o1[p]) ? o2[p] : o1[p];
    }
    return o;
  }
  function rgbToRgba(rgbValue) {
    var rgb2 = /rgb\((\d+,\s*[\d]+,\s*[\d]+)\)/g.exec(rgbValue);
    return rgb2 ? "rgba(" + rgb2[1] + ",1)" : rgbValue;
  }
  function hexToRgba(hexValue) {
    var rgx = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    var hex2 = hexValue.replace(rgx, function(m, r2, g2, b2) {
      return r2 + r2 + g2 + g2 + b2 + b2;
    });
    var rgb2 = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex2);
    var r = parseInt(rgb2[1], 16);
    var g = parseInt(rgb2[2], 16);
    var b = parseInt(rgb2[3], 16);
    return "rgba(" + r + "," + g + "," + b + ",1)";
  }
  function hslToRgba(hslValue) {
    var hsl2 = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(hslValue) || /hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(hslValue);
    var h = parseInt(hsl2[1], 10) / 360;
    var s = parseInt(hsl2[2], 10) / 100;
    var l = parseInt(hsl2[3], 10) / 100;
    var a = hsl2[4] || 1;
    function hue2rgb(p2, q2, t) {
      if (t < 0) {
        t += 1;
      }
      if (t > 1) {
        t -= 1;
      }
      if (t < 1 / 6) {
        return p2 + (q2 - p2) * 6 * t;
      }
      if (t < 1 / 2) {
        return q2;
      }
      if (t < 2 / 3) {
        return p2 + (q2 - p2) * (2 / 3 - t) * 6;
      }
      return p2;
    }
    var r, g, b;
    if (s == 0) {
      r = g = b = l;
    } else {
      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    return "rgba(" + r * 255 + "," + g * 255 + "," + b * 255 + "," + a + ")";
  }
  function colorToRgb(val) {
    if (is.rgb(val)) {
      return rgbToRgba(val);
    }
    if (is.hex(val)) {
      return hexToRgba(val);
    }
    if (is.hsl(val)) {
      return hslToRgba(val);
    }
  }
  function getUnit(val) {
    var split = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(val);
    if (split) {
      return split[1];
    }
  }
  function getTransformUnit(propName) {
    if (stringContains(propName, "translate") || propName === "perspective") {
      return "px";
    }
    if (stringContains(propName, "rotate") || stringContains(propName, "skew")) {
      return "deg";
    }
  }
  function getFunctionValue(val, animatable) {
    if (!is.fnc(val)) {
      return val;
    }
    return val(animatable.target, animatable.id, animatable.total);
  }
  function getAttribute(el, prop) {
    return el.getAttribute(prop);
  }
  function convertPxToUnit(el, value, unit2) {
    var valueUnit = getUnit(value);
    if (arrayContains([unit2, "deg", "rad", "turn"], valueUnit)) {
      return value;
    }
    var cached = cache.CSS[value + unit2];
    if (!is.und(cached)) {
      return cached;
    }
    var baseline = 100;
    var tempEl = document.createElement(el.tagName);
    var parentEl = el.parentNode && el.parentNode !== document ? el.parentNode : document.body;
    parentEl.appendChild(tempEl);
    tempEl.style.position = "absolute";
    tempEl.style.width = baseline + unit2;
    var factor = baseline / tempEl.offsetWidth;
    parentEl.removeChild(tempEl);
    var convertedUnit = factor * parseFloat(value);
    cache.CSS[value + unit2] = convertedUnit;
    return convertedUnit;
  }
  function getCSSValue(el, prop, unit2) {
    if (prop in el.style) {
      var uppercasePropName = prop.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
      var value = el.style[prop] || getComputedStyle(el).getPropertyValue(uppercasePropName) || "0";
      return unit2 ? convertPxToUnit(el, value, unit2) : value;
    }
  }
  function getAnimationType(el, prop) {
    if (is.dom(el) && !is.inp(el) && (!is.nil(getAttribute(el, prop)) || is.svg(el) && el[prop])) {
      return "attribute";
    }
    if (is.dom(el) && arrayContains(validTransforms, prop)) {
      return "transform";
    }
    if (is.dom(el) && (prop !== "transform" && getCSSValue(el, prop))) {
      return "css";
    }
    if (el[prop] != null) {
      return "object";
    }
  }
  function getElementTransforms(el) {
    if (!is.dom(el)) {
      return;
    }
    var str = el.style.transform || "";
    var reg = /(\w+)\(([^)]*)\)/g;
    var transforms = /* @__PURE__ */ new Map();
    var m;
    while (m = reg.exec(str)) {
      transforms.set(m[1], m[2]);
    }
    return transforms;
  }
  function getTransformValue(el, propName, animatable, unit2) {
    var defaultVal = stringContains(propName, "scale") ? 1 : 0 + getTransformUnit(propName);
    var value = getElementTransforms(el).get(propName) || defaultVal;
    if (animatable) {
      animatable.transforms.list.set(propName, value);
      animatable.transforms["last"] = propName;
    }
    return unit2 ? convertPxToUnit(el, value, unit2) : value;
  }
  function getOriginalTargetValue(target, propName, unit2, animatable) {
    switch (getAnimationType(target, propName)) {
      case "transform":
        return getTransformValue(target, propName, animatable, unit2);
      case "css":
        return getCSSValue(target, propName, unit2);
      case "attribute":
        return getAttribute(target, propName);
      default:
        return target[propName] || 0;
    }
  }
  function getRelativeValue(to, from) {
    var operator = /^(\*=|\+=|-=)/.exec(to);
    if (!operator) {
      return to;
    }
    var u = getUnit(to) || 0;
    var x = parseFloat(from);
    var y = parseFloat(to.replace(operator[0], ""));
    switch (operator[0][0]) {
      case "+":
        return x + y + u;
      case "-":
        return x - y + u;
      case "*":
        return x * y + u;
    }
  }
  function validateValue(val, unit2) {
    if (is.col(val)) {
      return colorToRgb(val);
    }
    if (/\s/g.test(val)) {
      return val;
    }
    var originalUnit = getUnit(val);
    var unitLess = originalUnit ? val.substr(0, val.length - originalUnit.length) : val;
    if (unit2) {
      return unitLess + unit2;
    }
    return unitLess;
  }
  function getDistance(p1, p2) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }
  function getCircleLength(el) {
    return Math.PI * 2 * getAttribute(el, "r");
  }
  function getRectLength(el) {
    return getAttribute(el, "width") * 2 + getAttribute(el, "height") * 2;
  }
  function getLineLength(el) {
    return getDistance(
      { x: getAttribute(el, "x1"), y: getAttribute(el, "y1") },
      { x: getAttribute(el, "x2"), y: getAttribute(el, "y2") }
    );
  }
  function getPolylineLength(el) {
    var points = el.points;
    var totalLength = 0;
    var previousPos;
    for (var i = 0; i < points.numberOfItems; i++) {
      var currentPos = points.getItem(i);
      if (i > 0) {
        totalLength += getDistance(previousPos, currentPos);
      }
      previousPos = currentPos;
    }
    return totalLength;
  }
  function getPolygonLength(el) {
    var points = el.points;
    return getPolylineLength(el) + getDistance(points.getItem(points.numberOfItems - 1), points.getItem(0));
  }
  function getTotalLength(el) {
    if (el.getTotalLength) {
      return el.getTotalLength();
    }
    switch (el.tagName.toLowerCase()) {
      case "circle":
        return getCircleLength(el);
      case "rect":
        return getRectLength(el);
      case "line":
        return getLineLength(el);
      case "polyline":
        return getPolylineLength(el);
      case "polygon":
        return getPolygonLength(el);
    }
  }
  function setDashoffset(el) {
    var pathLength = getTotalLength(el);
    el.setAttribute("stroke-dasharray", pathLength);
    return pathLength;
  }
  function getParentSvgEl(el) {
    var parentEl = el.parentNode;
    while (is.svg(parentEl)) {
      if (!is.svg(parentEl.parentNode)) {
        break;
      }
      parentEl = parentEl.parentNode;
    }
    return parentEl;
  }
  function getParentSvg(pathEl, svgData) {
    var svg = svgData || {};
    var parentSvgEl = svg.el || getParentSvgEl(pathEl);
    var rect = parentSvgEl.getBoundingClientRect();
    var viewBoxAttr = getAttribute(parentSvgEl, "viewBox");
    var width = rect.width;
    var height = rect.height;
    var viewBox = svg.viewBox || (viewBoxAttr ? viewBoxAttr.split(" ") : [0, 0, width, height]);
    return {
      el: parentSvgEl,
      viewBox,
      x: viewBox[0] / 1,
      y: viewBox[1] / 1,
      w: width,
      h: height,
      vW: viewBox[2],
      vH: viewBox[3]
    };
  }
  function getPath(path, percent) {
    var pathEl = is.str(path) ? selectString(path)[0] : path;
    var p = percent || 100;
    return function(property) {
      return {
        property,
        el: pathEl,
        svg: getParentSvg(pathEl),
        totalLength: getTotalLength(pathEl) * (p / 100)
      };
    };
  }
  function getPathProgress(path, progress, isPathTargetInsideSVG) {
    function point2(offset) {
      if (offset === void 0) offset = 0;
      var l = progress + offset >= 1 ? progress + offset : 0;
      return path.el.getPointAtLength(l);
    }
    var svg = getParentSvg(path.el, path.svg);
    var p = point2();
    var p0 = point2(-1);
    var p1 = point2(1);
    var scaleX = isPathTargetInsideSVG ? 1 : svg.w / svg.vW;
    var scaleY = isPathTargetInsideSVG ? 1 : svg.h / svg.vH;
    switch (path.property) {
      case "x":
        return (p.x - svg.x) * scaleX;
      case "y":
        return (p.y - svg.y) * scaleY;
      case "angle":
        return Math.atan2(p1.y - p0.y, p1.x - p0.x) * 180 / Math.PI;
    }
  }
  function decomposeValue(val, unit2) {
    var rgx = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g;
    var value = validateValue(is.pth(val) ? val.totalLength : val, unit2) + "";
    return {
      original: value,
      numbers: value.match(rgx) ? value.match(rgx).map(Number) : [0],
      strings: is.str(val) || unit2 ? value.split(rgx) : []
    };
  }
  function parseTargets(targets) {
    var targetsArray = targets ? flattenArray(is.arr(targets) ? targets.map(toArray) : toArray(targets)) : [];
    return filterArray(targetsArray, function(item, pos, self) {
      return self.indexOf(item) === pos;
    });
  }
  function getAnimatables(targets) {
    var parsed = parseTargets(targets);
    return parsed.map(function(t, i) {
      return { target: t, id: i, total: parsed.length, transforms: { list: getElementTransforms(t) } };
    });
  }
  function normalizePropertyTweens(prop, tweenSettings) {
    var settings = cloneObject(tweenSettings);
    if (/^spring/.test(settings.easing)) {
      settings.duration = spring(settings.easing);
    }
    if (is.arr(prop)) {
      var l = prop.length;
      var isFromTo = l === 2 && !is.obj(prop[0]);
      if (!isFromTo) {
        if (!is.fnc(tweenSettings.duration)) {
          settings.duration = tweenSettings.duration / l;
        }
      } else {
        prop = { value: prop };
      }
    }
    var propArray = is.arr(prop) ? prop : [prop];
    return propArray.map(function(v, i) {
      var obj = is.obj(v) && !is.pth(v) ? v : { value: v };
      if (is.und(obj.delay)) {
        obj.delay = !i ? tweenSettings.delay : 0;
      }
      if (is.und(obj.endDelay)) {
        obj.endDelay = i === propArray.length - 1 ? tweenSettings.endDelay : 0;
      }
      return obj;
    }).map(function(k) {
      return mergeObjects(k, settings);
    });
  }
  function flattenKeyframes(keyframes) {
    var propertyNames = filterArray(flattenArray(keyframes.map(function(key) {
      return Object.keys(key);
    })), function(p) {
      return is.key(p);
    }).reduce(function(a, b) {
      if (a.indexOf(b) < 0) {
        a.push(b);
      }
      return a;
    }, []);
    var properties = {};
    var loop = function(i2) {
      var propName = propertyNames[i2];
      properties[propName] = keyframes.map(function(key) {
        var newKey = {};
        for (var p in key) {
          if (is.key(p)) {
            if (p == propName) {
              newKey.value = key[p];
            }
          } else {
            newKey[p] = key[p];
          }
        }
        return newKey;
      });
    };
    for (var i = 0; i < propertyNames.length; i++) loop(i);
    return properties;
  }
  function getProperties(tweenSettings, params) {
    var properties = [];
    var keyframes = params.keyframes;
    if (keyframes) {
      params = mergeObjects(flattenKeyframes(keyframes), params);
    }
    for (var p in params) {
      if (is.key(p)) {
        properties.push({
          name: p,
          tweens: normalizePropertyTweens(params[p], tweenSettings)
        });
      }
    }
    return properties;
  }
  function normalizeTweenValues(tween, animatable) {
    var t = {};
    for (var p in tween) {
      var value = getFunctionValue(tween[p], animatable);
      if (is.arr(value)) {
        value = value.map(function(v) {
          return getFunctionValue(v, animatable);
        });
        if (value.length === 1) {
          value = value[0];
        }
      }
      t[p] = value;
    }
    t.duration = parseFloat(t.duration);
    t.delay = parseFloat(t.delay);
    return t;
  }
  function normalizeTweens(prop, animatable) {
    var previousTween;
    return prop.tweens.map(function(t) {
      var tween = normalizeTweenValues(t, animatable);
      var tweenValue2 = tween.value;
      var to = is.arr(tweenValue2) ? tweenValue2[1] : tweenValue2;
      var toUnit = getUnit(to);
      var originalValue = getOriginalTargetValue(animatable.target, prop.name, toUnit, animatable);
      var previousValue = previousTween ? previousTween.to.original : originalValue;
      var from = is.arr(tweenValue2) ? tweenValue2[0] : previousValue;
      var fromUnit = getUnit(from) || getUnit(originalValue);
      var unit2 = toUnit || fromUnit;
      if (is.und(to)) {
        to = previousValue;
      }
      tween.from = decomposeValue(from, unit2);
      tween.to = decomposeValue(getRelativeValue(to, from), unit2);
      tween.start = previousTween ? previousTween.end : 0;
      tween.end = tween.start + tween.delay + tween.duration + tween.endDelay;
      tween.easing = parseEasings(tween.easing, tween.duration);
      tween.isPath = is.pth(tweenValue2);
      tween.isPathTargetInsideSVG = tween.isPath && is.svg(animatable.target);
      tween.isColor = is.col(tween.from.original);
      if (tween.isColor) {
        tween.round = 1;
      }
      previousTween = tween;
      return tween;
    });
  }
  var setProgressValue = {
    css: function(t, p, v) {
      return t.style[p] = v;
    },
    attribute: function(t, p, v) {
      return t.setAttribute(p, v);
    },
    object: function(t, p, v) {
      return t[p] = v;
    },
    transform: function(t, p, v, transforms, manual) {
      transforms.list.set(p, v);
      if (p === transforms.last || manual) {
        var str = "";
        transforms.list.forEach(function(value, prop) {
          str += prop + "(" + value + ") ";
        });
        t.style.transform = str;
      }
    }
  };
  function setTargetsValue(targets, properties) {
    var animatables = getAnimatables(targets);
    animatables.forEach(function(animatable) {
      for (var property in properties) {
        var value = getFunctionValue(properties[property], animatable);
        var target = animatable.target;
        var valueUnit = getUnit(value);
        var originalValue = getOriginalTargetValue(target, property, valueUnit, animatable);
        var unit2 = valueUnit || getUnit(originalValue);
        var to = getRelativeValue(validateValue(value, unit2), originalValue);
        var animType = getAnimationType(target, property);
        setProgressValue[animType](target, property, to, animatable.transforms, true);
      }
    });
  }
  function createAnimation(animatable, prop) {
    var animType = getAnimationType(animatable.target, prop.name);
    if (animType) {
      var tweens = normalizeTweens(prop, animatable);
      var lastTween = tweens[tweens.length - 1];
      return {
        type: animType,
        property: prop.name,
        animatable,
        tweens,
        duration: lastTween.end,
        delay: tweens[0].delay,
        endDelay: lastTween.endDelay
      };
    }
  }
  function getAnimations(animatables, properties) {
    return filterArray(flattenArray(animatables.map(function(animatable) {
      return properties.map(function(prop) {
        return createAnimation(animatable, prop);
      });
    })), function(a) {
      return !is.und(a);
    });
  }
  function getInstanceTimings(animations, tweenSettings) {
    var animLength = animations.length;
    var getTlOffset = function(anim) {
      return anim.timelineOffset ? anim.timelineOffset : 0;
    };
    var timings = {};
    timings.duration = animLength ? Math.max.apply(Math, animations.map(function(anim) {
      return getTlOffset(anim) + anim.duration;
    })) : tweenSettings.duration;
    timings.delay = animLength ? Math.min.apply(Math, animations.map(function(anim) {
      return getTlOffset(anim) + anim.delay;
    })) : tweenSettings.delay;
    timings.endDelay = animLength ? timings.duration - Math.max.apply(Math, animations.map(function(anim) {
      return getTlOffset(anim) + anim.duration - anim.endDelay;
    })) : tweenSettings.endDelay;
    return timings;
  }
  var instanceID = 0;
  function createNewInstance(params) {
    var instanceSettings = replaceObjectProps(defaultInstanceSettings, params);
    var tweenSettings = replaceObjectProps(defaultTweenSettings, params);
    var properties = getProperties(tweenSettings, params);
    var animatables = getAnimatables(params.targets);
    var animations = getAnimations(animatables, properties);
    var timings = getInstanceTimings(animations, tweenSettings);
    var id2 = instanceID;
    instanceID++;
    return mergeObjects(instanceSettings, {
      id: id2,
      children: [],
      animatables,
      animations,
      duration: timings.duration,
      delay: timings.delay,
      endDelay: timings.endDelay
    });
  }
  var activeInstances = [];
  var engine = function() {
    var raf;
    function play() {
      if (!raf && (!isDocumentHidden() || !anime.suspendWhenDocumentHidden) && activeInstances.length > 0) {
        raf = requestAnimationFrame(step);
      }
    }
    function step(t) {
      var activeInstancesLength = activeInstances.length;
      var i = 0;
      while (i < activeInstancesLength) {
        var activeInstance = activeInstances[i];
        if (!activeInstance.paused) {
          activeInstance.tick(t);
          i++;
        } else {
          activeInstances.splice(i, 1);
          activeInstancesLength--;
        }
      }
      raf = i > 0 ? requestAnimationFrame(step) : void 0;
    }
    function handleVisibilityChange() {
      if (!anime.suspendWhenDocumentHidden) {
        return;
      }
      if (isDocumentHidden()) {
        raf = cancelAnimationFrame(raf);
      } else {
        activeInstances.forEach(
          function(instance) {
            return instance._onDocumentVisibility();
          }
        );
        engine();
      }
    }
    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }
    return play;
  }();
  function isDocumentHidden() {
    return !!document && document.hidden;
  }
  function anime(params) {
    if (params === void 0) params = {};
    var startTime = 0, lastTime = 0, now2 = 0;
    var children2, childrenLength = 0;
    var resolve = null;
    function makePromise(instance2) {
      var promise2 = window.Promise && new Promise(function(_resolve) {
        return resolve = _resolve;
      });
      instance2.finished = promise2;
      return promise2;
    }
    var instance = createNewInstance(params);
    var promise = makePromise(instance);
    function toggleInstanceDirection() {
      var direction = instance.direction;
      if (direction !== "alternate") {
        instance.direction = direction !== "normal" ? "normal" : "reverse";
      }
      instance.reversed = !instance.reversed;
      children2.forEach(function(child) {
        return child.reversed = instance.reversed;
      });
    }
    function adjustTime(time) {
      return instance.reversed ? instance.duration - time : time;
    }
    function resetTime() {
      startTime = 0;
      lastTime = adjustTime(instance.currentTime) * (1 / anime.speed);
    }
    function seekChild(time, child) {
      if (child) {
        child.seek(time - child.timelineOffset);
      }
    }
    function syncInstanceChildren(time) {
      if (!instance.reversePlayback) {
        for (var i = 0; i < childrenLength; i++) {
          seekChild(time, children2[i]);
        }
      } else {
        for (var i$1 = childrenLength; i$1--; ) {
          seekChild(time, children2[i$1]);
        }
      }
    }
    function setAnimationsProgress(insTime) {
      var i = 0;
      var animations = instance.animations;
      var animationsLength = animations.length;
      while (i < animationsLength) {
        var anim = animations[i];
        var animatable = anim.animatable;
        var tweens = anim.tweens;
        var tweenLength = tweens.length - 1;
        var tween = tweens[tweenLength];
        if (tweenLength) {
          tween = filterArray(tweens, function(t) {
            return insTime < t.end;
          })[0] || tween;
        }
        var elapsed = minMax(insTime - tween.start - tween.delay, 0, tween.duration) / tween.duration;
        var eased = isNaN(elapsed) ? 1 : tween.easing(elapsed);
        var strings = tween.to.strings;
        var round = tween.round;
        var numbers = [];
        var toNumbersLength = tween.to.numbers.length;
        var progress = void 0;
        for (var n = 0; n < toNumbersLength; n++) {
          var value = void 0;
          var toNumber = tween.to.numbers[n];
          var fromNumber = tween.from.numbers[n] || 0;
          if (!tween.isPath) {
            value = fromNumber + eased * (toNumber - fromNumber);
          } else {
            value = getPathProgress(tween.value, eased * toNumber, tween.isPathTargetInsideSVG);
          }
          if (round) {
            if (!(tween.isColor && n > 2)) {
              value = Math.round(value * round) / round;
            }
          }
          numbers.push(value);
        }
        var stringsLength = strings.length;
        if (!stringsLength) {
          progress = numbers[0];
        } else {
          progress = strings[0];
          for (var s = 0; s < stringsLength; s++) {
            var a = strings[s];
            var b = strings[s + 1];
            var n$1 = numbers[s];
            if (!isNaN(n$1)) {
              if (!b) {
                progress += n$1 + " ";
              } else {
                progress += n$1 + b;
              }
            }
          }
        }
        setProgressValue[anim.type](animatable.target, anim.property, progress, animatable.transforms);
        anim.currentValue = progress;
        i++;
      }
    }
    function setCallback(cb) {
      if (instance[cb] && !instance.passThrough) {
        instance[cb](instance);
      }
    }
    function countIteration() {
      if (instance.remaining && instance.remaining !== true) {
        instance.remaining--;
      }
    }
    function setInstanceProgress(engineTime) {
      var insDuration = instance.duration;
      var insDelay = instance.delay;
      var insEndDelay = insDuration - instance.endDelay;
      var insTime = adjustTime(engineTime);
      instance.progress = minMax(insTime / insDuration * 100, 0, 100);
      instance.reversePlayback = insTime < instance.currentTime;
      if (children2) {
        syncInstanceChildren(insTime);
      }
      if (!instance.began && instance.currentTime > 0) {
        instance.began = true;
        setCallback("begin");
      }
      if (!instance.loopBegan && instance.currentTime > 0) {
        instance.loopBegan = true;
        setCallback("loopBegin");
      }
      if (insTime <= insDelay && instance.currentTime !== 0) {
        setAnimationsProgress(0);
      }
      if (insTime >= insEndDelay && instance.currentTime !== insDuration || !insDuration) {
        setAnimationsProgress(insDuration);
      }
      if (insTime > insDelay && insTime < insEndDelay) {
        if (!instance.changeBegan) {
          instance.changeBegan = true;
          instance.changeCompleted = false;
          setCallback("changeBegin");
        }
        setCallback("change");
        setAnimationsProgress(insTime);
      } else {
        if (instance.changeBegan) {
          instance.changeCompleted = true;
          instance.changeBegan = false;
          setCallback("changeComplete");
        }
      }
      instance.currentTime = minMax(insTime, 0, insDuration);
      if (instance.began) {
        setCallback("update");
      }
      if (engineTime >= insDuration) {
        lastTime = 0;
        countIteration();
        if (!instance.remaining) {
          instance.paused = true;
          if (!instance.completed) {
            instance.completed = true;
            setCallback("loopComplete");
            setCallback("complete");
            if (!instance.passThrough && "Promise" in window) {
              resolve();
              promise = makePromise(instance);
            }
          }
        } else {
          startTime = now2;
          setCallback("loopComplete");
          instance.loopBegan = false;
          if (instance.direction === "alternate") {
            toggleInstanceDirection();
          }
        }
      }
    }
    instance.reset = function() {
      var direction = instance.direction;
      instance.passThrough = false;
      instance.currentTime = 0;
      instance.progress = 0;
      instance.paused = true;
      instance.began = false;
      instance.loopBegan = false;
      instance.changeBegan = false;
      instance.completed = false;
      instance.changeCompleted = false;
      instance.reversePlayback = false;
      instance.reversed = direction === "reverse";
      instance.remaining = instance.loop;
      children2 = instance.children;
      childrenLength = children2.length;
      for (var i = childrenLength; i--; ) {
        instance.children[i].reset();
      }
      if (instance.reversed && instance.loop !== true || direction === "alternate" && instance.loop === 1) {
        instance.remaining++;
      }
      setAnimationsProgress(instance.reversed ? instance.duration : 0);
    };
    instance._onDocumentVisibility = resetTime;
    instance.set = function(targets, properties) {
      setTargetsValue(targets, properties);
      return instance;
    };
    instance.tick = function(t) {
      now2 = t;
      if (!startTime) {
        startTime = now2;
      }
      setInstanceProgress((now2 + (lastTime - startTime)) * anime.speed);
    };
    instance.seek = function(time) {
      setInstanceProgress(adjustTime(time));
    };
    instance.pause = function() {
      instance.paused = true;
      resetTime();
    };
    instance.play = function() {
      if (!instance.paused) {
        return;
      }
      if (instance.completed) {
        instance.reset();
      }
      instance.paused = false;
      activeInstances.push(instance);
      resetTime();
      engine();
    };
    instance.reverse = function() {
      toggleInstanceDirection();
      instance.completed = instance.reversed ? false : true;
      resetTime();
    };
    instance.restart = function() {
      instance.reset();
      instance.play();
    };
    instance.remove = function(targets) {
      var targetsArray = parseTargets(targets);
      removeTargetsFromInstance(targetsArray, instance);
    };
    instance.reset();
    if (instance.autoplay) {
      instance.play();
    }
    return instance;
  }
  function removeTargetsFromAnimations(targetsArray, animations) {
    for (var a = animations.length; a--; ) {
      if (arrayContains(targetsArray, animations[a].animatable.target)) {
        animations.splice(a, 1);
      }
    }
  }
  function removeTargetsFromInstance(targetsArray, instance) {
    var animations = instance.animations;
    var children2 = instance.children;
    removeTargetsFromAnimations(targetsArray, animations);
    for (var c = children2.length; c--; ) {
      var child = children2[c];
      var childAnimations = child.animations;
      removeTargetsFromAnimations(targetsArray, childAnimations);
      if (!childAnimations.length && !child.children.length) {
        children2.splice(c, 1);
      }
    }
    if (!animations.length && !children2.length) {
      instance.pause();
    }
  }
  function removeTargetsFromActiveInstances(targets) {
    var targetsArray = parseTargets(targets);
    for (var i = activeInstances.length; i--; ) {
      var instance = activeInstances[i];
      removeTargetsFromInstance(targetsArray, instance);
    }
  }
  function stagger(val, params) {
    if (params === void 0) params = {};
    var direction = params.direction || "normal";
    var easing = params.easing ? parseEasings(params.easing) : null;
    var grid = params.grid;
    var axis2 = params.axis;
    var fromIndex = params.from || 0;
    var fromFirst = fromIndex === "first";
    var fromCenter = fromIndex === "center";
    var fromLast = fromIndex === "last";
    var isRange = is.arr(val);
    var val1 = isRange ? parseFloat(val[0]) : parseFloat(val);
    var val2 = isRange ? parseFloat(val[1]) : 0;
    var unit2 = getUnit(isRange ? val[1] : val) || 0;
    var start2 = params.start || 0 + (isRange ? val1 : 0);
    var values = [];
    var maxValue = 0;
    return function(el, i, t) {
      if (fromFirst) {
        fromIndex = 0;
      }
      if (fromCenter) {
        fromIndex = (t - 1) / 2;
      }
      if (fromLast) {
        fromIndex = t - 1;
      }
      if (!values.length) {
        for (var index = 0; index < t; index++) {
          if (!grid) {
            values.push(Math.abs(fromIndex - index));
          } else {
            var fromX = !fromCenter ? fromIndex % grid[0] : (grid[0] - 1) / 2;
            var fromY = !fromCenter ? Math.floor(fromIndex / grid[0]) : (grid[1] - 1) / 2;
            var toX = index % grid[0];
            var toY = Math.floor(index / grid[0]);
            var distanceX = fromX - toX;
            var distanceY = fromY - toY;
            var value = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
            if (axis2 === "x") {
              value = -distanceX;
            }
            if (axis2 === "y") {
              value = -distanceY;
            }
            values.push(value);
          }
          maxValue = Math.max.apply(Math, values);
        }
        if (easing) {
          values = values.map(function(val3) {
            return easing(val3 / maxValue) * maxValue;
          });
        }
        if (direction === "reverse") {
          values = values.map(function(val3) {
            return axis2 ? val3 < 0 ? val3 * -1 : -val3 : Math.abs(maxValue - val3);
          });
        }
      }
      var spacing = isRange ? (val2 - val1) / maxValue : val1;
      return start2 + spacing * (Math.round(values[i] * 100) / 100) + unit2;
    };
  }
  function timeline(params) {
    if (params === void 0) params = {};
    var tl = anime(params);
    tl.duration = 0;
    tl.add = function(instanceParams, timelineOffset) {
      var tlIndex = activeInstances.indexOf(tl);
      var children2 = tl.children;
      if (tlIndex > -1) {
        activeInstances.splice(tlIndex, 1);
      }
      function passThrough(ins2) {
        ins2.passThrough = true;
      }
      for (var i = 0; i < children2.length; i++) {
        passThrough(children2[i]);
      }
      var insParams = mergeObjects(instanceParams, replaceObjectProps(defaultTweenSettings, params));
      insParams.targets = insParams.targets || params.targets;
      var tlDuration = tl.duration;
      insParams.autoplay = false;
      insParams.direction = tl.direction;
      insParams.timelineOffset = is.und(timelineOffset) ? tlDuration : getRelativeValue(timelineOffset, tlDuration);
      passThrough(tl);
      tl.seek(insParams.timelineOffset);
      var ins = anime(insParams);
      passThrough(ins);
      children2.push(ins);
      var timings = getInstanceTimings(children2, params);
      tl.delay = timings.delay;
      tl.endDelay = timings.endDelay;
      tl.duration = timings.duration;
      tl.seek(0);
      tl.reset();
      if (tl.autoplay) {
        tl.play();
      }
      return tl;
    };
    return tl;
  }
  anime.version = "3.2.1";
  anime.speed = 1;
  anime.suspendWhenDocumentHidden = true;
  anime.running = activeInstances;
  anime.remove = removeTargetsFromActiveInstances;
  anime.get = getOriginalTargetValue;
  anime.set = setTargetsValue;
  anime.convertPx = convertPxToUnit;
  anime.path = getPath;
  anime.setDashoffset = setDashoffset;
  anime.stagger = stagger;
  anime.timeline = timeline;
  anime.easing = parseEasings;
  anime.penner = penner;
  anime.random = function(min2, max2) {
    return Math.floor(Math.random() * (max2 - min2 + 1)) + min2;
  };
  var anime_es_default = anime;

  // node_modules/d3-collection/src/map.js
  var prefix = "$";
  function Map2() {
  }
  Map2.prototype = map2.prototype = {
    constructor: Map2,
    has: function(key) {
      return prefix + key in this;
    },
    get: function(key) {
      return this[prefix + key];
    },
    set: function(key, value) {
      this[prefix + key] = value;
      return this;
    },
    remove: function(key) {
      var property = prefix + key;
      return property in this && delete this[property];
    },
    clear: function() {
      for (var property in this) if (property[0] === prefix) delete this[property];
    },
    keys: function() {
      var keys = [];
      for (var property in this) if (property[0] === prefix) keys.push(property.slice(1));
      return keys;
    },
    values: function() {
      var values = [];
      for (var property in this) if (property[0] === prefix) values.push(this[property]);
      return values;
    },
    entries: function() {
      var entries = [];
      for (var property in this) if (property[0] === prefix) entries.push({ key: property.slice(1), value: this[property] });
      return entries;
    },
    size: function() {
      var size = 0;
      for (var property in this) if (property[0] === prefix) ++size;
      return size;
    },
    empty: function() {
      for (var property in this) if (property[0] === prefix) return false;
      return true;
    },
    each: function(f) {
      for (var property in this) if (property[0] === prefix) f(this[property], property.slice(1), this);
    }
  };
  function map2(object, f) {
    var map3 = new Map2();
    if (object instanceof Map2) object.each(function(value, key2) {
      map3.set(key2, value);
    });
    else if (Array.isArray(object)) {
      var i = -1, n = object.length, o;
      if (f == null) while (++i < n) map3.set(i, object[i]);
      else while (++i < n) map3.set(f(o = object[i], i, object), o);
    } else if (object) for (var key in object) map3.set(key, object[key]);
    return map3;
  }
  var map_default = map2;

  // node_modules/d3-collection/src/nest.js
  function nest_default() {
    var keys = [], sortKeys = [], sortValues, rollup, nest;
    function apply(array2, depth, createResult, setResult) {
      if (depth >= keys.length) {
        if (sortValues != null) array2.sort(sortValues);
        return rollup != null ? rollup(array2) : array2;
      }
      var i = -1, n = array2.length, key = keys[depth++], keyValue, value, valuesByKey = map_default(), values, result = createResult();
      while (++i < n) {
        if (values = valuesByKey.get(keyValue = key(value = array2[i]) + "")) {
          values.push(value);
        } else {
          valuesByKey.set(keyValue, [value]);
        }
      }
      valuesByKey.each(function(values2, key2) {
        setResult(result, key2, apply(values2, depth, createResult, setResult));
      });
      return result;
    }
    function entries(map3, depth) {
      if (++depth > keys.length) return map3;
      var array2, sortKey = sortKeys[depth - 1];
      if (rollup != null && depth >= keys.length) array2 = map3.entries();
      else array2 = [], map3.each(function(v, k) {
        array2.push({ key: k, values: entries(v, depth) });
      });
      return sortKey != null ? array2.sort(function(a, b) {
        return sortKey(a.key, b.key);
      }) : array2;
    }
    return nest = {
      object: function(array2) {
        return apply(array2, 0, createObject, setObject);
      },
      map: function(array2) {
        return apply(array2, 0, createMap, setMap);
      },
      entries: function(array2) {
        return entries(apply(array2, 0, createMap, setMap), 0);
      },
      key: function(d) {
        keys.push(d);
        return nest;
      },
      sortKeys: function(order) {
        sortKeys[keys.length - 1] = order;
        return nest;
      },
      sortValues: function(order) {
        sortValues = order;
        return nest;
      },
      rollup: function(f) {
        rollup = f;
        return nest;
      }
    };
  }
  function createObject() {
    return {};
  }
  function setObject(object, key, value) {
    object[key] = value;
  }
  function createMap() {
    return map_default();
  }
  function setMap(map3, key, value) {
    map3.set(key, value);
  }

  // node_modules/d3-collection/src/set.js
  function Set2() {
  }
  var proto = map_default.prototype;
  Set2.prototype = set3.prototype = {
    constructor: Set2,
    has: proto.has,
    add: function(value) {
      value += "";
      this[prefix + value] = value;
      return this;
    },
    remove: proto.remove,
    clear: proto.clear,
    values: proto.keys,
    size: proto.size,
    empty: proto.empty,
    each: proto.each
  };
  function set3(object, f) {
    var set4 = new Set2();
    if (object instanceof Set2) object.each(function(value) {
      set4.add(value);
    });
    else if (object) {
      var i = -1, n = object.length;
      if (f == null) while (++i < n) set4.add(object[i]);
      else while (++i < n) set4.add(f(object[i], i, object));
    }
    return set4;
  }

  // lib/esm/layouts/ClusterLayout.js
  var __extends = /* @__PURE__ */ function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  var __assign = function() {
    __assign = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
          t[p] = s[p];
      }
      return t;
    };
    return __assign.apply(this, arguments);
  };
  var ClusterLayout = (
    /** @class */
    function(_super) {
      __extends(ClusterLayout2, _super);
      function ClusterLayout2(data, options, width, height) {
        return _super.call(this, data, options, width, height) || this;
      }
      ClusterLayout2.prototype.calculateCirclesLayout = function() {
        var _this = this;
        var property = {};
        var packLayout = pack_default().size([this.width, this.height]).padding(20);
        var sizeByDim = this.options.sizeByDim;
        var entries = this.data.map(function(entry) {
          property[entry.id] = {
            x: _this.width / 2,
            y: _this.height / 2,
            r: 0,
            display: true
          };
          return __assign({ name: entry.id, value: sizeByDim != null ? entry[sizeByDim] : 1 }, entry);
        });
        if (this.options.filters != null) {
          entries = entries.filter(function(entry) {
            for (var dim in _this.options.filters) {
              var values = _this.options.filters[dim];
              if (values.indexOf(entry[dim]) < 0) {
                property[entry.id].display = false;
                return false;
              }
            }
            return true;
          });
        }
        var rootNode = hierarchy({ "name": "ALL", children: entries });
        if (this.options.clusterByDim != null) {
          var clusterByDim_1 = this.options.clusterByDim;
          var nested = nest_default().key(function(d) {
            return d[clusterByDim_1];
          }).entries(entries);
          var converted = nested.map(function(item) {
            var value = item.values.reduce(function(total, child) {
              return total + child.value;
            }, 0);
            return {
              id: item.key,
              value,
              children: item.values
            };
          });
          rootNode = hierarchy({ "name": "ALL", children: converted });
        }
        rootNode.sum(function(d) {
          return d.value;
        });
        packLayout(rootNode);
        var clustersProperty = {};
        rootNode.children.forEach(function(cluster) {
          clustersProperty[cluster.data.id] = {
            // @ts-ignore
            text: cluster.data.id,
            // @ts-ignore
            x: cluster.x,
            // @ts-ignore
            y: cluster.y,
            // @ts-ignore
            r: cluster.r
          };
          cluster.children.forEach(function(entry) {
            property[entry.data.id].x = entry.x;
            property[entry.data.id].y = entry.y;
            property[entry.data.id].r = entry.r;
          });
        });
        var clusters = document.createElement("div");
        clusters.innerHTML = "";
        if (Object.keys(clustersProperty).length) {
          for (var id2 in clustersProperty) {
            var _a = clustersProperty[id2], x = _a.x, y = _a.y, r = _a.r;
            var circle = createCircle(null, x, y, r);
            clusters.appendChild(circle);
            anime_es_default({
              targets: [circle],
              easing: "easeInOutSine",
              border: "1px solid #BBB",
              opacity: 0.5
            });
          }
          for (var id2 in clustersProperty) {
            var _b = clustersProperty[id2], x = _b.x, y = _b.y, r = _b.r;
            var text = createText(x, y - r - 10, r * 2, 20, id2, 1e3);
            clusters.appendChild(text);
            anime_es_default({
              targets: [text],
              easing: "easeInOutSine",
              opacity: 1
            });
          }
        }
        return {
          layoutProperties: property,
          additionalVisual: clusters
        };
      };
      return ClusterLayout2;
    }(LayoutBase_default)
  );
  var ClusterLayout_default = ClusterLayout;

  // lib/esm/layouts/DefaultLayout.js
  var __extends2 = /* @__PURE__ */ function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  var __assign2 = function() {
    __assign2 = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
          t[p] = s[p];
      }
      return t;
    };
    return __assign2.apply(this, arguments);
  };
  var DefaultLayout = (
    /** @class */
    function(_super) {
      __extends2(DefaultLayout2, _super);
      function DefaultLayout2(data, options, width, height) {
        return _super.call(this, data, options, width, height) || this;
      }
      DefaultLayout2.prototype.calculateCirclesLayout = function() {
        var _this = this;
        var _a;
        var layoutProperties = {};
        var packLayout = pack_default().size([this.width, this.height]).padding(20);
        var sizeByDim = this.options.sizeByDim;
        var entries = this.data.map(function(entry) {
          layoutProperties[entry.id] = {
            x: _this.width / 2,
            y: _this.height / 2,
            r: 0,
            display: true
          };
          return __assign2({ name: entry.id, value: sizeByDim != null ? entry[sizeByDim] : 1 }, entry);
        });
        if (this.options.filters != null) {
          entries = entries.filter(function(entry) {
            for (var dim in _this.options.filters) {
              var values = _this.options.filters[dim];
              if (values.indexOf(entry[dim]) < 0) {
                layoutProperties[entry.id].display = false;
                return false;
              }
            }
            return true;
          });
        }
        var rootNode = hierarchy({ "name": "ALL", children: entries });
        rootNode.sum(function(d) {
          return d.value;
        });
        packLayout(rootNode);
        (_a = rootNode === null || rootNode === void 0 ? void 0 : rootNode.children) === null || _a === void 0 ? void 0 : _a.forEach(function(entry) {
          layoutProperties[entry.data.id].x = entry.x;
          layoutProperties[entry.data.id].y = entry.y;
          layoutProperties[entry.data.id].r = entry.r;
        });
        return {
          layoutProperties,
          additionalVisual: null
        };
      };
      return DefaultLayout2;
    }(LayoutBase_default)
  );
  var DefaultLayout_default = DefaultLayout;

  // lib/esm/layouts/GroupByLayout.js
  var __extends3 = /* @__PURE__ */ function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  var __spreadArray = function(to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
      to[j] = from[i];
    return to;
  };
  var GroupByLayout = (
    /** @class */
    function(_super) {
      __extends3(GroupByLayout2, _super);
      function GroupByLayout2(data, options, width, height) {
        return _super.call(this, data, options, width, height) || this;
      }
      GroupByLayout2.prototype.calculateCirclesLayout = function() {
        var _this = this;
        var property = {};
        this.data.forEach(function(entry) {
          property[entry.id] = { x: 0, y: 0, r: 0, display: false };
        });
        var setting = this.options.groupBySetting;
        if (!setting) {
          return { layoutProperties: property, additionalVisual: null };
        }
        var entries = __spreadArray([], this.data);
        if (this.options.filters != null) {
          entries = entries.filter(function(entry) {
            for (var dim_1 in _this.options.filters) {
              var values = _this.options.filters[dim_1];
              if (values.indexOf(entry[dim_1]) < 0) {
                return false;
              }
            }
            return true;
          });
        }
        if (entries.length === 0) {
          return { layoutProperties: property, additionalVisual: null };
        }
        var dim = setting.dim;
        var agg = setting.agg;
        var sortBy = setting.sortBy;
        var sortOrder = setting.sortOrder;
        var renderAs = setting.renderAs || "circles";
        var groups = {};
        entries.forEach(function(entry) {
          var key2 = String(entry[dim]);
          if (!groups[key2])
            groups[key2] = [];
          groups[key2].push(entry);
        });
        var groupEntries = [];
        for (var key in groups) {
          var items = groups[key];
          var value = this._calculateAggregation(items, agg, dim);
          groupEntries.push({ key, value });
        }
        groupEntries.sort(function(a, b) {
          var cmp;
          if (sortBy === "dim") {
            if (a.key < b.key)
              cmp = -1;
            else if (a.key > b.key)
              cmp = 1;
            else
              cmp = 0;
          } else {
            cmp = a.value - b.value;
          }
          return sortOrder === "desc" ? -cmp : cmp;
        });
        if (renderAs === "bars") {
          return this._renderBars(groupEntries, property);
        }
        return this._renderCircles(groupEntries, property);
      };
      GroupByLayout2.prototype._renderCircles = function(groupEntries, property) {
        var packLayout = pack_default().size([this.width, this.height]).padding(20);
        var rootData = {
          children: groupEntries.map(function(g) {
            return {
              id: g.key,
              value: Math.max(g.value, 1e-3)
            };
          })
        };
        var rootNode = hierarchy(rootData);
        rootNode.sum(function(d) {
          return d.value;
        });
        packLayout(rootNode);
        var nodeMap = {};
        if (rootNode.children) {
          rootNode.children.forEach(function(node) {
            nodeMap[node.data.id] = node;
          });
        }
        groupEntries.forEach(function(g) {
          var node = nodeMap[g.key];
          if (node) {
            property[g.key] = {
              x: node.x,
              y: node.y,
              r: node.r,
              display: true
            };
          }
        });
        var container = document.createElement("div");
        if (rootNode.children) {
          rootNode.children.forEach(function(node) {
            var circle = createCircle(null, node.x, node.y, node.r);
            circle.style.background = DEFAULT_COLOR;
            container.appendChild(circle);
            anime_es_default({
              targets: [circle],
              easing: "easeInOutSine",
              opacity: 0.7
            });
            var text = createText(node.x, node.y, node.r * 2, 20, node.data.id, 1e3);
            container.appendChild(text);
            anime_es_default({
              targets: [text],
              easing: "easeInOutSine",
              opacity: 1
            });
          });
        }
        return {
          layoutProperties: property,
          additionalVisual: container
        };
      };
      GroupByLayout2.prototype._renderBars = function(groupEntries, property) {
        var padding = { top: 20, right: 40, bottom: 40, left: 80 };
        var chartWidth = this.width - padding.left - padding.right;
        var chartHeight = this.height - padding.top - padding.bottom;
        var maxValue = Math.max.apply(Math, __spreadArray(__spreadArray([], groupEntries.map(function(g) {
          return g.value;
        })), [1e-3]));
        var xScale = linear2().domain([0, maxValue]).range([0, chartWidth]);
        var yScale = band().domain(groupEntries.map(function(g) {
          return g.key;
        })).range([0, chartHeight]).padding(0.2);
        var barHeight = yScale.bandwidth();
        var packLayout = pack_default().size([this.width, this.height]).padding(20);
        var rootData = {
          children: groupEntries.map(function(g) {
            return {
              id: g.key,
              value: Math.max(g.value, 1e-3)
            };
          })
        };
        var rootNode = hierarchy(rootData);
        rootNode.sum(function(d) {
          return d.value;
        });
        packLayout(rootNode);
        var circlePositions = {};
        if (rootNode.children) {
          rootNode.children.forEach(function(node) {
            circlePositions[node.data.id] = { x: node.x, y: node.y, r: node.r };
          });
        }
        var container = document.createElement("div");
        container.style.position = "relative";
        container.style.width = this.width + "px";
        container.style.height = this.height + "px";
        groupEntries.forEach(function(g) {
          var barWidth = xScale(g.value);
          var barX = padding.left;
          var barY = padding.top + (yScale(g.key) || 0);
          var cp = circlePositions[g.key];
          if (cp) {
            var circle = createCircle(null, cp.x, cp.y, cp.r);
            circle.style.background = DEFAULT_COLOR;
            circle.style.opacity = "0.7";
            container.appendChild(circle);
            anime_es_default({
              targets: [circle],
              easing: "easeInOutSine",
              left: barX,
              top: barY,
              width: barHeight,
              height: barHeight,
              borderRadius: "50%",
              opacity: 0,
              duration: 700
            });
          }
          var bar = document.createElement("div");
          bar.setAttribute("style", [
            "position: absolute",
            "left: " + barX + "px",
            "top: " + barY + "px",
            "width: 0px",
            "height: " + barHeight + "px",
            "background: " + DEFAULT_COLOR,
            "opacity: 0",
            "box-sizing: border-box"
          ].join("; "));
          container.appendChild(bar);
          anime_es_default({
            targets: [bar],
            easing: "easeInOutSine",
            width: barWidth,
            opacity: 0.7,
            duration: 700,
            delay: 300
          });
          var label = document.createElement("div");
          label.setAttribute("style", [
            "position: absolute",
            "left: 0px",
            "top: " + barY + "px",
            "width: " + (padding.left - 8) + "px",
            "height: " + barHeight + "px",
            "display: flex",
            "align-items: center",
            "justify-content: flex-end",
            "color: " + FONT_COLOR,
            "font-family: " + FONT_FAMILY,
            "font-size: " + FONT_SIZE + "px",
            "opacity: 0",
            "white-space: nowrap",
            "overflow: hidden",
            "text-overflow: ellipsis"
          ].join("; "));
          label.textContent = g.key;
          container.appendChild(label);
          anime_es_default({
            targets: [label],
            easing: "easeInOutSine",
            opacity: 1,
            duration: 700,
            delay: 300
          });
          var valueLabel = document.createElement("div");
          valueLabel.setAttribute("style", [
            "position: absolute",
            "left: " + (barX + barWidth + 4) + "px",
            "top: " + barY + "px",
            "height: " + barHeight + "px",
            "display: flex",
            "align-items: center",
            "color: " + FONT_COLOR,
            "font-family: " + FONT_FAMILY,
            "font-size: " + FONT_SIZE + "px",
            "opacity: 0"
          ].join("; "));
          valueLabel.textContent = String(Math.round(g.value * 100) / 100);
          container.appendChild(valueLabel);
          anime_es_default({
            targets: [valueLabel],
            easing: "easeInOutSine",
            opacity: 1,
            duration: 700,
            delay: 300
          });
        });
        var axisLine = document.createElement("div");
        axisLine.setAttribute("style", [
          "position: absolute",
          "left: " + padding.left + "px",
          "top: " + (padding.top + chartHeight) + "px",
          "width: " + chartWidth + "px",
          "height: 1px",
          "background: " + AXIS_COLOR
        ].join("; "));
        container.appendChild(axisLine);
        return {
          layoutProperties: property,
          additionalVisual: container
        };
      };
      GroupByLayout2.prototype._calculateAggregation = function(items, agg, groupDim) {
        if (agg === "count") {
          return items.length;
        }
        var valueDim = this.options.sizeByDim || groupDim;
        var values = [];
        items.forEach(function(item) {
          var v = item[valueDim];
          if (typeof v === "number") {
            values.push(v);
          }
        });
        if (values.length === 0)
          return 0;
        if (agg === "sum") {
          return values.reduce(function(a, b) {
            return a + b;
          }, 0);
        }
        if (agg === "avg") {
          return values.reduce(function(a, b) {
            return a + b;
          }, 0) / values.length;
        }
        if (agg === "median") {
          var sorted = __spreadArray([], values).sort(function(a, b) {
            return a - b;
          });
          var mid = Math.floor(sorted.length / 2);
          if (sorted.length % 2 === 1) {
            return sorted[mid];
          }
          return (sorted[mid - 1] + sorted[mid]) / 2;
        }
        return 0;
      };
      return GroupByLayout2;
    }(LayoutBase_default)
  );
  var GroupByLayout_default = GroupByLayout;

  // lib/esm/layouts/PlotLayout.js
  var __extends4 = /* @__PURE__ */ function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  var PlotLayout = (
    /** @class */
    function(_super) {
      __extends4(PlotLayout2, _super);
      function PlotLayout2(data, options, width, height) {
        return _super.call(this, data, options, width, height) || this;
      }
      PlotLayout2.prototype.calculateCirclesLayout = function() {
        var padding = 40;
        var defaultLayout = new DefaultLayout_default(this.data, this.options, this.width, this.height);
        var layoutProperties = defaultLayout.calculateCirclesLayout().layoutProperties;
        var additionalVisual = null;
        if (this.options.plotSetting != null) {
          var setting_1 = this.options.plotSetting;
          var data = this.data.filter(function(entry) {
            return layoutProperties[entry.id].display;
          });
          var xScale_1 = this._getScale(data, setting_1.x, [padding, this.width - padding]);
          var yScale_1 = this._getScale(data, setting_1.y, [this.height - padding, padding]);
          this.data.forEach(function(entry) {
            var props = layoutProperties[entry.id];
            var xVal = entry[setting_1.x.dim];
            var yVal = entry[setting_1.y.dim];
            if (props.display && typeof xVal === "number" && typeof yVal === "number") {
              props.x = xScale_1(xVal);
              props.y = yScale_1(yVal);
              if (setting_1.getCircleSize) {
                props.r = setting_1.getCircleSize(entry);
              }
            }
          });
          var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          select_default2(svg).attr("width", this.width).attr("height", this.height);
          select_default2(svg).append("g").style("color", AXIS_COLOR).attr("transform", "translate(0, " + (this.height - padding) + ")").call(axisBottom(xScale_1)).selectAll("text").attr("transform", "translate(-10,0)rotate(-45)").style("text-anchor", "end").style("font-family", FONT_FAMILY).style("color", FONT_COLOR);
          select_default2(svg).append("g").style("color", AXIS_COLOR).attr("transform", "translate(" + padding + ", 0)").call(axisLeft(yScale_1)).selectAll("text").style("font-family", FONT_FAMILY).style("color", FONT_COLOR);
          additionalVisual = document.createElement("div");
          additionalVisual.appendChild(svg);
        }
        return {
          layoutProperties,
          additionalVisual
        };
      };
      PlotLayout2.prototype._getScale = function(data, setting, range2) {
        var vals = data.reduce(function(acc, entry) {
          var val = entry[setting.dim];
          if (typeof val == "number") {
            acc.push(val);
          }
          return acc;
        }, []);
        var _a = [this._min(vals), this._max(vals)], min2 = _a[0], max2 = _a[1];
        var domain = setting.order === "asc" ? [min2, max2] : [max2, min2];
        return linear2().domain(domain).range(range2);
      };
      PlotLayout2.prototype._min = function(vals) {
        if (!vals.length) {
          throw Error("vals can not be empty");
        }
        var min2 = vals[0];
        for (var _i = 0, vals_1 = vals; _i < vals_1.length; _i++) {
          var v = vals_1[_i];
          if (v < min2) {
            min2 = v;
          }
        }
        return min2;
      };
      PlotLayout2.prototype._max = function(vals) {
        if (!vals.length) {
          throw Error("vals can not be empty");
        }
        var max2 = vals[0];
        for (var _i = 0, vals_2 = vals; _i < vals_2.length; _i++) {
          var v = vals_2[_i];
          if (v > max2) {
            max2 = v;
          }
        }
        return max2;
      };
      return PlotLayout2;
    }(LayoutBase_default)
  );
  var PlotLayout_default = PlotLayout;

  // lib/esm/layouts/SortLayout.js
  var __extends5 = /* @__PURE__ */ function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  var SortLayout = (
    /** @class */
    function(_super) {
      __extends5(SortLayout2, _super);
      function SortLayout2(data, options, width, height) {
        return _super.call(this, data, options, width, height) || this;
      }
      SortLayout2.prototype.calculateCirclesLayout = function() {
        var sortLabelProperty = {};
        var labels = document.createElement("div");
        labels.innerHTML = "";
        var defaultLayout = new DefaultLayout_default(this.data, this.options, this.width, this.height);
        var layoutProperties = defaultLayout.calculateCirclesLayout().layoutProperties;
        if (this.options.sortSetting != null) {
          var setting_1 = this.options.sortSetting;
          var flag_1 = setting_1.order === "asc" ? 1 : -1;
          var entries_1 = [];
          this.data.forEach(function(entry) {
            if (entry.id in layoutProperties && layoutProperties[entry.id].display) {
              entries_1.push({
                id: entry.id,
                value: entry[setting_1.dim]
              });
            }
          });
          entries_1.sort(function(a, b) {
            if (a.value > b.value) {
              return flag_1;
            } else {
              return flag_1 * -1;
            }
          });
          var offset = 10;
          for (var i = 0; i < entries_1.length; i++) {
            var props = layoutProperties[entries_1[i].id];
            sortLabelProperty[entries_1[i].id] = {
              x: offset + props.r,
              y: this.height / 2 + props.r + 20,
              width: props.r * 2,
              label: entries_1[i].value
            };
            props.x = offset + props.r;
            props.y = this.height / 2;
            offset += 2 * props.r + 10;
          }
        }
        if (sortLabelProperty && Object.keys(sortLabelProperty).length) {
          for (var id2 in sortLabelProperty) {
            var _a = sortLabelProperty[id2], x = _a.x, y = _a.y, width = _a.width, label = _a.label;
            var text = createText(x, y, width, 10, label, 1);
            labels.appendChild(text);
            anime_es_default({
              targets: [text],
              opacity: 1,
              easing: "easeInOutSine"
            });
          }
        }
        ;
        return {
          layoutProperties,
          additionalVisual: labels
        };
      };
      return SortLayout2;
    }(LayoutBase_default)
  );
  var SortLayout_default = SortLayout;

  // lib/esm/index.js
  var __assign3 = function() {
    __assign3 = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
          t[p] = s[p];
      }
      return t;
    };
    return __assign3.apply(this, arguments);
  };
  var __spreadArray2 = function(to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
      to[j] = from[i];
    return to;
  };
  var Jello = (
    /** @class */
    function() {
      function Jello2(container, data, options) {
        var _this = this;
        container.innerHTML = "";
        this.container = container;
        this.additionalVisualDiv = document.createElement("div");
        this.circleDiv = document.createElement("div");
        this.container.appendChild(this.additionalVisualDiv);
        this.container.appendChild(this.circleDiv);
        this.width = container.offsetWidth;
        this.height = container.offsetHeight;
        this.data = data;
        this.options = options;
        this.options.layout = this.options.layout || "default";
        this.originalOptions = __assign3({}, this.options);
        this._initLayoutManager();
        this.circles = {};
        this.cirlcesProperty = {};
        this.data.forEach(function(entry) {
          _this.cirlcesProperty[entry.id] = {
            x: 0,
            y: 0,
            r: 0,
            color: DEFAULT_COLOR,
            imgURL: null,
            label: null,
            display: true,
            _data: entry
          };
        });
        this.container.addEventListener("click", function(event) {
          _this.options.onCanvasClick && _this.options.onCanvasClick(event);
        });
      }
      Jello2.prototype.render = function() {
        this.additionalVisualDiv.innerHTML = "";
        this._updateCircleLayout();
        this._updateCircleColor();
        this._updateCircleImage();
        this._updateCircleLabel();
        this._renderCirles();
        return this;
      };
      Jello2.prototype.updateWidthHeight = function() {
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this._initLayoutManager();
        return this;
      };
      Jello2.prototype.labelBy = function(dim) {
        this.options.labelByDim = this._sanitizeDimension(dim);
        return this;
      };
      Jello2.prototype.colorBy = function(dim) {
        this.options.colorByDim = this._sanitizeDimension(dim);
        if (this.options.colorByDim != null) {
          this.options.displayImageByDim = null;
        }
        return this;
      };
      Jello2.prototype.sizeBy = function(dim) {
        this.options.sizeByDim = this._sanitizeDimension(dim);
        return this;
      };
      Jello2.prototype.clusterBy = function(dim) {
        this.options.clusterByDim = this._sanitizeDimension(dim);
        if (dim === null) {
          return this;
        }
        this.options.layout = "cluster";
        return this;
      };
      Jello2.prototype.filterBy = function(filters) {
        var sanitized = {};
        for (var dim in filters) {
          var sanitizedDim = this._sanitizeDimension(dim);
          if (sanitizedDim !== null) {
            sanitized[dim] = filters[dim];
          }
        }
        this.options.filters = Object.keys(sanitized).length > 0 ? sanitized : null;
        return this;
      };
      Jello2.prototype.sortBy = function(setting) {
        var dim = (setting != null ? setting : { dim: null }).dim;
        var sanitized = this._sanitizeDimension(dim);
        if (sanitized != null) {
          this.options.sortSetting = sanitized !== null ? setting : null;
          this.options.layout = "sort";
        }
        return this;
      };
      Jello2.prototype.plotBy = function(setting) {
        var _a, _b, _c, _d;
        var xDim = (_b = (_a = setting === null || setting === void 0 ? void 0 : setting.x) === null || _a === void 0 ? void 0 : _a.dim) !== null && _b !== void 0 ? _b : null;
        var yDim = (_d = (_c = setting === null || setting === void 0 ? void 0 : setting.y) === null || _c === void 0 ? void 0 : _c.dim) !== null && _d !== void 0 ? _d : null;
        var xSanitized = this._sanitizeDimension(xDim);
        var ySanitized = this._sanitizeDimension(yDim);
        if (xSanitized != null && ySanitized != null && typeof this.data[0][xSanitized] === "number" && typeof this.data[0][ySanitized] === "number") {
          this.options.plotSetting = setting;
          this.options.layout = "plot";
        } else {
          console.log("plotBy will no take effect because some of the dimensions are not available or the values for the dimension are not numbers.");
        }
        return this;
      };
      Jello2.prototype.groupBy = function(setting) {
        if (setting === null) {
          this.options.groupBySetting = null;
          this.options.layout = "default";
          return this;
        }
        var sanitized = this._sanitizeDimension(setting.dim);
        if (sanitized != null) {
          this.options.groupBySetting = setting;
          this.options.layout = "group by";
        }
        return this;
      };
      Jello2.prototype.displayImageBy = function(dim) {
        this.options.displayImageByDim = this._sanitizeDimension(dim);
        if (this.options.displayImageByDim != null) {
          this.options.colorByDim = null;
        }
        return this;
      };
      Jello2.prototype.reset = function() {
        this.options = __assign3({}, this.originalOptions);
        this._initLayoutManager();
        return this;
      };
      Jello2.prototype._initLayoutManager = function() {
        this.layoutManager = {
          "default": new DefaultLayout_default(this.data, this.options, this.width, this.height),
          "cluster": new ClusterLayout_default(this.data, this.options, this.width, this.height),
          "sort": new SortLayout_default(this.data, this.options, this.width, this.height),
          "plot": new PlotLayout_default(this.data, this.options, this.width, this.height),
          "group by": new GroupByLayout_default(this.data, this.options, this.width, this.height)
        };
      };
      Jello2.prototype._renderCirles = function() {
        var _this = this;
        if (!Object.keys(this.circles).length) {
          this.data.forEach(function(entry) {
            var _a2 = _this.cirlcesProperty[entry.id], _data = _a2._data, x2 = _a2.x, y2 = _a2.y, r2 = _a2.r, display2 = _a2.display;
            var radius = display2 ? r2 : 0;
            var circle = createCircle(_data, x2, y2, radius, _this.options.onClick, _this.options.onMouseover, _this.options.onMouseout);
            _this.circleDiv.appendChild(circle);
            _this.circles[entry.id] = circle;
          });
        }
        for (var id2 in this.circles) {
          var _a = this.cirlcesProperty[id2], x = _a.x, y = _a.y, r = _a.r, color2 = _a.color, display = _a.display, imgURL = _a.imgURL, label = _a.label;
          var size = display ? r * 2 : 0;
          var opacity = color2 != null ? 0.7 : 0;
          var bg = this.options.displayImageByDim != null ? " url(" + imgURL + ") no-repeat" : color2;
          this.circles[id2].style.background = bg;
          this.circles[id2].style.backgroundSize = "cover";
          this.circles[id2].innerHTML = display && label != null ? label : "";
          anime_es_default({
            targets: [this.circles[id2]],
            easing: "easeInOutSine",
            left: x - r,
            top: y - r,
            width: size,
            height: size,
            duration: 700,
            opacity
          });
        }
      };
      Jello2.prototype._sanitizeDimension = function(dim) {
        if (dim != null && this.data && this.data.length) {
          if (dim in this.data[0]) {
            return dim;
          } else {
            console.log(dim + " is not valid property. It will not take any effect.");
            return null;
          }
        }
        return null;
      };
      Jello2.prototype._updateCircleLayout = function() {
        var layout = this.options.layout || "default";
        var _a = this.layoutManager[layout].calculateCirclesLayout(), layoutProperties = _a.layoutProperties, additionalVisual = _a.additionalVisual;
        for (var id2 in layoutProperties) {
          if (id2 in this.cirlcesProperty) {
            this.cirlcesProperty[id2].x = layoutProperties[id2].x;
            this.cirlcesProperty[id2].y = layoutProperties[id2].y;
            this.cirlcesProperty[id2].r = layoutProperties[id2].r;
            this.cirlcesProperty[id2].display = layoutProperties[id2].display;
          }
        }
        if (additionalVisual !== null) {
          this.additionalVisualDiv.appendChild(additionalVisual);
        }
      };
      Jello2.prototype._updateCircleColor = function() {
        var _this = this;
        if (this.options.colorByDim == null) {
          this.data.forEach(function(entry) {
            _this.cirlcesProperty[entry.id].color = DEFAULT_COLOR;
          });
        } else {
          var colorByDim_1 = this.options.colorByDim;
          var distinctValues = __spreadArray2([], new Set(this.data.map(function(entry) {
            return entry[colorByDim_1];
          })));
          this.data.map(function(entry) {
            return entry[colorByDim_1];
          });
          var colorPicker_1 = ordinal().domain(distinctValues).range(Set3_default);
          this.data.forEach(function(entry) {
            _this.cirlcesProperty[entry.id].color = colorPicker_1(entry[colorByDim_1]);
          });
        }
      };
      Jello2.prototype._updateCircleImage = function() {
        var _this = this;
        if (this.options.displayImageByDim != null) {
          var dim_1 = this.options.displayImageByDim;
          this.data.forEach(function(entry) {
            _this.cirlcesProperty[entry.id].imgURL = entry[dim_1];
          });
        } else {
          this.data.forEach(function(entry) {
            _this.cirlcesProperty[entry.id].imgURL = null;
          });
        }
      };
      Jello2.prototype._updateCircleLabel = function() {
        var _this = this;
        if (this.options.labelByDim != null) {
          var dim_2 = this.options.labelByDim;
          this.data.forEach(function(entry) {
            _this.cirlcesProperty[entry.id].label = entry[dim_2];
          });
        } else {
          this.data.forEach(function(entry) {
            _this.cirlcesProperty[entry.id].label = null;
          });
        }
      };
      return Jello2;
    }()
  );
  var index_default = Jello;
  return __toCommonJS(index_exports);
})();
