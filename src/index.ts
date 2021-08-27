import { scaleOrdinal, schemeSet3 } from 'd3';

import type {CircleProperty} from './types';
import ClusterLayout from './layouts/ClusterLayout';
import {DEFAULT_COLOR} from './constants';
import DefaultLayout from './layouts/DefaultLayout';
import type {Filters} from './types';
import LayoutBase from './layouts/LayoutBase';
import type {ObjectWithID} from './types';
import type {Options} from './types';
import PlotLayout from './layouts/PlotLayout';
import type {PlotSetting} from './types';
import SortLayout from './layouts/SortLayout';
import type {SortSetting} from './types';
import anime from 'animejs';
import {createCircle} from './utils';

class Jello<T extends ObjectWithID> {
  width: number;
  height: number;
  data: Array<T>;
  options: Options<T>;
  originalOptions: Options<T>;
  container: HTMLDivElement;
  circleDiv: HTMLDivElement;
  additionalVisualDiv: HTMLDivElement;

  layoutManager: {[key: string]: LayoutBase<T>};
  circles: {[key: string]: HTMLDivElement};
  cirlcesProperty: {[key: string]: CircleProperty<T>};

  /**
   *
   * @param {*} container the containing div
   * @param {*} data the list of entities to visualize in the format of {id, attribute_A, attribute_B, ...}
   * @param {*} options available settings {clusterByDim, colorByDim, sortSetting...}
   */
  constructor(container: HTMLDivElement, data: Array<T>, options: Options<T>) {
    container.innerHTML = '';
    this.container = container;
    this.additionalVisualDiv = document.createElement('div');
    this.circleDiv = document.createElement('div');
    this.container.appendChild(this.additionalVisualDiv);
    this.container.appendChild(this.circleDiv);

    this.width = container.offsetWidth;
    this.height = container.offsetHeight;
    this.data = data;
    this.options = options;
    this.options.layout = this.options.layout || 'default';
    this.originalOptions = {...this.options};
    this._initLayoutManager();

    this.circles = {};
    this.cirlcesProperty = {};
    this.data.forEach(entry => {
      this.cirlcesProperty[entry.id] = {
        x: 0,
        y: 0,
        r: 0,
        color: DEFAULT_COLOR,
        imgURL: null,
        label: null,
        display: true,
        _data: entry,
      }
    });

    this.container.addEventListener("click", (event) => {
      this.options.onCanvasClick && this.options.onCanvasClick(event);
    });
  }

  render() {
    // additional visuals(specific to each layout) are going to be recreated everytime render gets called
    // they get recreated from calling _updateCircleLayout
    this.additionalVisualDiv.innerHTML = "";
    this._updateCircleLayout();

    // all the circles are only created first time render func gets called
    // later we don't do the animation based on the change of circlesProperty
    this._updateCircleColor();
    this._updateCircleImage();
    this._updateCircleLabel();
    this._renderCirles();
    return this;
  }

  updateWidthHeight() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    return this;
  }

  labelBy(dim: string | null) {
    this.options.labelByDim = this._sanitizeDimension(dim);
    return this;
  }

  colorBy(dim: string | null) {
    this.options.colorByDim = this._sanitizeDimension(dim);
    if (this.options.colorByDim != null) {
      this.options.displayImageByDim = null;
    }
    return this;
  }

  sizeBy(dim: string | null) {
    this.options.sizeByDim = this._sanitizeDimension(dim);
    return this;
  }

  clusterBy(dim: string | null) {
    this.options.clusterByDim = this._sanitizeDimension(dim);
    if (dim === null) {
      return this;
    }
    this.options.layout = 'cluster';
    return this;
  }

  filterBy(filters: Filters) {
    const sanitized: Filters = {};
    for (let dim in filters) {
      const sanitizedDim = this._sanitizeDimension(dim);
      if (sanitizedDim !== null) {
        sanitized[dim] = filters[dim];
      }
    }
    this.options.filters = Object.keys(sanitized).length > 0 ? sanitized : null;
    return this;
  }

  sortBy(setting: SortSetting | null) {
    const { dim } = setting != null ? setting : { dim: null };
    const sanitized = this._sanitizeDimension(dim);
    if (sanitized != null) {
      this.options.sortSetting = sanitized !== null ? setting : null;
      this.options.layout = 'sort';
    }
    return this;
  }

  plotBy(setting: PlotSetting<T> | null) {
    const xDim = setting?.x?.dim ?? null;
    const yDim = setting?.y?.dim ?? null;
    const xSanitized = this._sanitizeDimension(xDim);
    const ySanitized = this._sanitizeDimension(yDim);
    if (
      xSanitized != null &&
      ySanitized != null &&
      typeof this.data[0][xSanitized] === 'number' &&
      typeof this.data[0][ySanitized] === 'number'
    ) {
      this.options.plotSetting = setting;
      this.options.layout = 'plot';
    } else {
      console.log('plotBy will no take effect because some of the dimensions are not available or the values for the dimension are not numbers.');
    }
    return this;
  }

  displayImageBy(dim: string | null) {
    this.options.displayImageByDim = this._sanitizeDimension(dim);
    if (this.options.displayImageByDim != null) {
      this.options.colorByDim = null;
    }
    return this;
  }

  reset() {
    this.options = {...this.originalOptions};
    this._initLayoutManager();
    return this;
  }

  _initLayoutManager() {
    this.layoutManager = {
      'default': new DefaultLayout<T>(this.data, this.options, this.width, this.height),
      'cluster': new ClusterLayout<T>(this.data, this.options, this.width, this.height),
      'sort': new SortLayout<T>(this.data, this.options, this.width, this.height),
      'plot': new PlotLayout<T>(this.data, this.options, this.width, this.height),
    };
  }

  _renderCirles() {
    if (!Object.keys(this.circles).length) {
      this.data.forEach(entry => {
        const { _data, x, y, r, display } = this.cirlcesProperty[entry.id];
        const radius = display ? r : 0;
        const circle = createCircle(_data, x, y, radius, this.options.onClick, this.options.onMouseover, this.options.onMouseout);
        this.circleDiv.appendChild(circle);
        this.circles[entry.id] = circle;
      });
    }
    for (let id in this.circles) {
      const { x, y, r, color, display, imgURL, label } = this.cirlcesProperty[id];
      const size = display ? r * 2 : 0;
      const opacity = color != null ? 0.7 : 0;
      const bg = this.options.displayImageByDim != null ? ` url(${imgURL}) no-repeat` : color;
      this.circles[id].style.background = bg;
      this.circles[id].style.backgroundSize = 'cover';
      this.circles[id].innerHTML = display && label != null ? label : '';
      anime({
        targets: [this.circles[id]],
        easing: 'easeInOutSine',
        left: x - r,
        top: y - r,
        width: size,
        height: size,
        duration: 700,
        opacity
      });
    }
  }

  _sanitizeDimension(dim: string | null): string | null {
    if (dim != null && this.data && this.data.length) {
      if (dim in this.data[0]) {
        return dim;
      } else {
        console.log(`${dim} is not valid property. It will not take any effect.`);
        return null;
      }
    }
    return null;
  }

  _updateCircleLayout() {
    const layout = this.options.layout || 'default';
    const {layoutProperties, additionalVisual} = this.layoutManager[layout].calculateCirclesLayout();
    for (let id in layoutProperties) {
      if (id in this.cirlcesProperty) {
        this.cirlcesProperty[id].x = layoutProperties[id].x;
        this.cirlcesProperty[id].y = layoutProperties[id].y;
        this.cirlcesProperty[id].r = layoutProperties[id].r;
        this.cirlcesProperty[id].display = layoutProperties[id].display;
      }
    }
    if (additionalVisual !== null) {
      this.additionalVisualDiv.appendChild(additionalVisual);
    }
  }

  _updateCircleColor() {
    if (this.options.colorByDim == null) {
      this.data.forEach(entry => {
        this.cirlcesProperty[entry.id].color = DEFAULT_COLOR;
      });
    } else {
      const colorByDim = this.options.colorByDim;
      // @ts-ignore
      const distinctValues = [...new Set(this.data.map(entry => entry[colorByDim]))];
      this.data.map(entry => entry[colorByDim])
      const colorPicker = scaleOrdinal()
        .domain(distinctValues)
        .range(schemeSet3);

      this.data.forEach(entry => {
        // @ts-ignore
        this.cirlcesProperty[entry.id].color = colorPicker(entry[colorByDim])
      });
    }
  }

  _updateCircleImage() {
    if (this.options.displayImageByDim != null) {
      const dim = this.options.displayImageByDim;
      this.data.forEach(entry => {
        // @ts-ignore
        this.cirlcesProperty[entry.id].imgURL = entry[dim];
      });
    } else {
      this.data.forEach(entry => {
        this.cirlcesProperty[entry.id].imgURL = null;
      });
    }
  }

  _updateCircleLabel() {
    // set labels
    if (this.options.labelByDim != null) {
      const dim = this.options.labelByDim;
      this.data.forEach(entry => {
        // @ts-ignore
        this.cirlcesProperty[entry.id].label = entry[dim];
      });
    } else {
      this.data.forEach(entry => {
        this.cirlcesProperty[entry.id].label = null;
      });
    }
  }
}

export default Jello;
