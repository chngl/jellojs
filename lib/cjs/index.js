"use strict";
var __assign = (this && this.__assign) || function () {
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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var d3_1 = require("d3");
var animejs_1 = __importDefault(require("animejs"));
var d3_collection_1 = require("d3-collection");
var DEFAULT_COLOR = '#eee';
var FONT_FAMILY = 'Lucida Grande, Tahoma, Verdana, Ar';
var FONT_SIZE = 14;
var FONT_COLOR = '#4B4F56';
var Jello = /** @class */ (function () {
    /**
     *
     * @param {*} container the containing div
     * @param {*} data the list of entities to visualize in the format of {id, attribute_A, attribute_B, ...}
     * @param {*} options available settings {clusterByDim, colorByDim, sortSetting...}
     */
    function Jello(container, data, options) {
        var _this = this;
        container.innerHTML = '';
        this.container = container;
        this.circleDiv = document.createElement('div');
        this.clusterDiv = document.createElement('div');
        this.sortLabelDiv = document.createElement('div');
        this.container.appendChild(this.circleDiv);
        this.container.appendChild(this.clusterDiv);
        this.container.appendChild(this.sortLabelDiv);
        this.width = container.offsetWidth;
        this.height = container.offsetHeight;
        this.data = data;
        this.options = options;
        this.circles = {};
        this.cirlcesProperty = {};
        this.clustersProperty = {};
        this.sortLabelProperty = {};
        this.data.forEach(function (entry) {
            _this.cirlcesProperty[entry.id] = {
                x: 0,
                y: 0,
                r: 0,
                color: DEFAULT_COLOR,
                imgURL: null,
                label: null,
                display: true,
                _data: entry,
            };
        });
        this.container.addEventListener("click", function (event) {
            _this.options.onCanvasClick && _this.options.onCanvasClick(event);
        });
    }
    Jello.prototype.render = function () {
        this._calculateProperties();
        this._renderCluster();
        this._renderSortLabels();
        this._renderCirles();
        return this;
    };
    Jello.prototype.updateWidthHeight = function () {
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        return this;
    };
    Jello.prototype.labelBy = function (dim) {
        this.options.labelByDim = this._sanitizeDimension(dim);
        if (this.options.labelByDim !== null) {
            this.circleDiv.innerHTML = '';
            this.circles = {};
            this.options.displayImageByDim = null;
        }
        else {
            this.circleDiv.innerHTML = '';
            this.circles = {};
        }
        return this;
    };
    Jello.prototype.colorBy = function (dim) {
        this.options.colorByDim = this._sanitizeDimension(dim);
        return this;
    };
    Jello.prototype.sizeBy = function (dim) {
        this.options.sizeByDim = this._sanitizeDimension(dim);
        return this;
    };
    Jello.prototype.clusterBy = function (dim) {
        this.options.clusterByDim = this._sanitizeDimension(dim);
        this.options.sortSetting = null;
        return this;
    };
    /**
     *
     * @param {*} filters  {dim: 'xxx', values: ['xxx', ...]}
     * @returns
     */
    Jello.prototype.filterBy = function (filters) {
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
    /**
     *
     * @param {*} setting {dim: 'valuation', order: 'asc' | 'desc'}
     * @returns
     */
    Jello.prototype.sortBy = function (setting) {
        var dim = (setting != null ? setting : { dim: null }).dim;
        var sanitized = this._sanitizeDimension(dim);
        this.options.sortSetting = sanitized !== null ? setting : null;
        this.options.clusterByDim = null;
        return this;
    };
    /**
     *
     * @param {*} dim
     * When a displayImageBy dimension is set, colorBy is not going to work
     * @returns
     */
    Jello.prototype.displayImageBy = function (dim) {
        this.options.displayImageByDim = this._sanitizeDimension(dim);
        if (this.options.displayImageByDim !== null) {
            this.circleDiv.innerHTML = '';
            this.circles = {};
            this.options.colorByDim = null;
            this.options.labelByDim = null;
        }
        return this;
    };
    /**
     * when render the cluster layout, we need to render the cluster circle and label
     */
    Jello.prototype._renderCluster = function () {
        // the cluster/label divs are already being re-created everytime render is called
        this.clusterDiv.innerHTML = "";
        if (Object.keys(this.clustersProperty).length) {
            // render cluster circle before cluster label to make sure labels are on top
            for (var id in this.clustersProperty) {
                var _a = this.clustersProperty[id], x = _a.x, y = _a.y, r = _a.r;
                var circle = this._createCircle(null, x, y, r);
                this.clusterDiv.appendChild(circle);
                animejs_1.default({
                    targets: [circle],
                    easing: 'easeInOutSine',
                    border: '1px solid #BBB',
                    opacity: 0.5,
                });
            }
            for (var id in this.clustersProperty) {
                var _b = this.clustersProperty[id], x = _b.x, y = _b.y, r = _b.r;
                var text = this._createText(x, y - r - 10, r * 2, 20, id, 1000);
                this.clusterDiv.appendChild(text);
                animejs_1.default({
                    targets: [text],
                    easing: 'easeInOutSine',
                    opacity: 1,
                });
            }
        }
    };
    /**
     * when render the sort view, we need to render the label for each circle
     */
    Jello.prototype._renderSortLabels = function () {
        this.sortLabelDiv.innerHTML = "";
        if (this.sortLabelProperty && Object.keys(this.sortLabelProperty).length) {
            for (var id in this.sortLabelProperty) {
                var _a = this.sortLabelProperty[id], x = _a.x, y = _a.y, width = _a.width, label = _a.label;
                var text = this._createText(x, y, width, 10, label, 1);
                this.sortLabelDiv.appendChild(text);
                animejs_1.default({
                    targets: [text],
                    opacity: 1,
                    easing: 'easeInOutSine',
                });
            }
        }
    };
    /**
     * to render all the circles with animation
     */
    Jello.prototype._renderCirles = function () {
        var _this = this;
        // the circle group only gets created first time render gets called
        // it only does the animation afterwards
        if (!Object.keys(this.circles).length) {
            this.circles = {};
            this.data.forEach(function (entry) {
                var _a = _this.cirlcesProperty[entry.id], _data = _a._data, x = _a.x, y = _a.y, r = _a.r, color = _a.color, imgURL = _a.imgURL, label = _a.label, display = _a.display;
                var radius = display ? r : 0;
                var circle = _this._createCircle(_data, x, y, radius, color, imgURL, label);
                _this.circleDiv.appendChild(circle);
                _this.circles[entry.id] = circle;
            });
        }
        else {
            for (var id in this.circles) {
                var _a = this.cirlcesProperty[id], x = _a.x, y = _a.y, r = _a.r, color = _a.color, display = _a.display;
                var size = display ? r * 2 : 0;
                animejs_1.default({
                    targets: [this.circles[id]],
                    easing: 'easeInOutSine',
                    left: x - r,
                    top: y - r,
                    width: size,
                    height: size,
                    background: color,
                    duration: 700,
                });
            }
        }
    };
    Jello.prototype._sanitizeDimension = function (dim) {
        if (dim != null && this.data && this.data.length) {
            if (dim in this.data[0]) {
                return dim;
            }
            else {
                console.log(dim + " is not valid property. It will not take any effect.");
                return null;
            }
        }
        return null;
    };
    Jello.prototype._createCircle = function (data, x, y, r, color, imgURL, label) {
        var _this = this;
        var circle = document.createElement('div');
        var opacity = color != null ? 0.7 : 0;
        circle.setAttribute('style', "\n      position: absolute;\n      left: " + (x - r) + "px;\n      top: " + (y - r) + "px;\n      background: " + color + ";\n      border-radius: 50%;\n      width: " + r * 2 + "px;\n      height: " + r * 2 + "px;\n      opacity: " + opacity + ";\n      padding: 0px;\n      box-sizing: border-box;\n      display: flex;\n      justify-content: center;\n      align-items: center;\n      overflow: hidden;\n      text-overflow: ellipsis;\n    ");
        if (imgURL != null) {
            var img = document.createElement('img');
            img.src = imgURL;
            img.setAttribute('style', "\n        height: 100%;\n        width: 100%;\n        object-fit: contain;\n        border-radius: 50%;\n      ");
            circle.innerHTML = '';
            circle.appendChild(img);
        }
        else if (label != null) {
            circle.innerHTML += label;
        }
        circle.addEventListener("click", function (event) {
            _this.options.onClick && _this.options.onClick(event, data);
        });
        circle.addEventListener("mouseover", function (event) {
            _this.options.onMouseover && _this.options.onMouseover(event, data);
        });
        return circle;
    };
    Jello.prototype._createText = function (x, y, width, height, txt, z) {
        var text = document.createElement('div');
        var zIndex = z != null ? z : 1;
        text.setAttribute('style', "\n      position: absolute;\n      display: flex;\n      justify-content: center;\n      align-items: center;\n      left: " + (x - width / 2) + "px;\n      top: " + (y - height / 2) + "px;\n      color: " + FONT_COLOR + ";\n      font-family: " + FONT_FAMILY + ";\n      font-size: " + FONT_SIZE + ";\n      width: " + width + "px;\n      height: " + height + "px;\n      zIndex: " + zIndex + ";\n      opacity: 0;\n      white-space: nowrap;\n    ");
        text.innerHTML += txt;
        return text;
    };
    /**
     * This method calculate the x, y, r, color etc properties for the circles/clusters/labels based on the settings
     * @returns
     */
    Jello.prototype._calculateProperties = function () {
        var _this = this;
        this.clustersProperty = {};
        this.sortLabelProperty = {};
        var packLayout = d3_1.pack()
            .size([this.width, this.height])
            .padding(20);
        var sizeByDim = this.options.sizeByDim;
        var entries = this.data.map(function (entry) {
            _this.cirlcesProperty[entry.id].display = true;
            return __assign({ name: entry.id, value: sizeByDim != null ? entry[sizeByDim] : 1 }, entry);
        });
        // handle filterBy. When some entry is filtered out, we need to
        // 1) get rid of them from entries
        // 2) mark display to be false in the circlesProperty
        if (this.options.filters != null) {
            entries = entries.filter(function (entry) {
                for (var dim in _this.options.filters) {
                    var values = _this.options.filters[dim];
                    if (values.indexOf(entry[dim]) < 0) {
                        _this.cirlcesProperty[entry.id].display = false;
                        return false;
                    }
                }
                return true;
            });
        }
        var rootNode = d3_1.hierarchy({ 'name': 'ALL', children: entries });
        // cluster view
        if (this.options.clusterByDim != null) {
            var clusterByDim_1 = this.options.clusterByDim;
            var nested = d3_collection_1.nest()
                .key(function (d) { return d[clusterByDim_1]; })
                .entries(entries);
            var converted = nested.map(function (item) {
                var value = item.values.reduce(function (total, child) {
                    return total + child.value;
                }, 0);
                return {
                    id: item.key,
                    value: value,
                    children: item.values,
                };
            });
            rootNode = d3_1.hierarchy({ 'name': 'ALL', children: converted });
        }
        // @ts-ignore
        rootNode.sum(function (d) { return d.value; });
        packLayout(rootNode);
        if (rootNode.height === 1) {
            // @ts-ignore
            rootNode.children.forEach(function (entry) {
                // @ts-ignore
                _this.cirlcesProperty[entry.data.id].x = entry.x;
                // @ts-ignore
                _this.cirlcesProperty[entry.data.id].y = entry.y;
                // @ts-ignore
                _this.cirlcesProperty[entry.data.id].r = entry.r;
            });
        }
        else if (rootNode.height === 2) {
            this.clustersProperty = {};
            // @ts-ignore
            rootNode.children.forEach(function (cluster) {
                // @ts-ignore
                _this.clustersProperty[cluster.data.id] = {
                    // @ts-ignore
                    text: cluster.data.id,
                    // @ts-ignore
                    x: cluster.x,
                    // @ts-ignore
                    y: cluster.y,
                    // @ts-ignore
                    r: cluster.r,
                };
                // @ts-ignore
                cluster.children.forEach(function (entry) {
                    // @ts-ignore
                    _this.cirlcesProperty[entry.data.id].x = entry.x;
                    // @ts-ignore
                    _this.cirlcesProperty[entry.data.id].y = entry.y;
                    // @ts-ignore
                    _this.cirlcesProperty[entry.data.id].r = entry.r;
                });
            });
        }
        if (this.options.colorByDim == null) {
            this.data.forEach(function (entry) {
                _this.cirlcesProperty[entry.id].color = DEFAULT_COLOR;
            });
        }
        else {
            var colorByDim_1 = this.options.colorByDim;
            // @ts-ignore
            var distinctValues = __spreadArray([], new Set(this.data.map(function (entry) { return entry[colorByDim_1]; })));
            this.data.map(function (entry) { return entry[colorByDim_1]; });
            var colorPicker_1 = d3_1.scaleOrdinal()
                .domain(distinctValues)
                .range(d3_1.schemeSet3);
            this.data.forEach(function (entry) {
                // @ts-ignore
                _this.cirlcesProperty[entry.id].color = colorPicker_1(entry[colorByDim_1]);
            });
        }
        // set images
        if (this.options.displayImageByDim != null) {
            var dim_1 = this.options.displayImageByDim;
            this.data.forEach(function (entry) {
                // @ts-ignore
                _this.cirlcesProperty[entry.id].imgURL = entry[dim_1];
                _this.cirlcesProperty[entry.id].color = DEFAULT_COLOR;
            });
        }
        else {
            this.data.forEach(function (entry) {
                _this.cirlcesProperty[entry.id].imgURL = null;
            });
        }
        // set labels
        if (this.options.labelByDim != null) {
            var dim_2 = this.options.labelByDim;
            this.data.forEach(function (entry) {
                // @ts-ignore
                _this.cirlcesProperty[entry.id].label = entry[dim_2];
            });
        }
        else {
            this.data.forEach(function (entry) {
                _this.cirlcesProperty[entry.id].label = null;
            });
        }
        if (this.options.sortSetting != null) {
            var setting_1 = this.options.sortSetting;
            this.sortLabelProperty = {};
            var flag_1 = setting_1.order === 'asc' ? 1 : -1;
            entries.sort(function (a, b) {
                if (a[setting_1.dim] > b[setting_1.dim]) {
                    return flag_1;
                }
                else {
                    return flag_1 * -1;
                }
            });
            var offset = 10;
            for (var i = 0; i < entries.length; i++) {
                var props = this.cirlcesProperty[entries[i].id];
                this.sortLabelProperty[entries[i].id] = {
                    x: offset + props.r,
                    y: this.height / 2 + props.r + 20,
                    width: props.r * 2,
                    label: entries[i][setting_1.dim],
                };
                props.x = offset + props.r;
                props.y = this.height / 2;
                offset += 2 * props.r + 10;
            }
        }
    };
    return Jello;
}());
exports.default = Jello;
