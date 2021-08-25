import { hierarchy, pack, scaleOrdinal, schemeSet3 } from 'd3';

import anime from 'animejs';
import { nest } from 'd3-collection';

const DEFAULT_COLOR = '#eee';
const FONT_FAMILY = 'Lucida Grande, Tahoma, Verdana, Ar';
const FONT_SIZE = 14;
const FONT_COLOR = '#4B4F56';

interface ObjectWithID {
  id: string;
  [key: string]: number | string,
}

type SortSetting = {
  dim: string,
  order: 'asc' | 'desc',
}

type Options<T> = {
  labelByDim?: string | null,
  displayImageByDim?: string | null,
  colorByDim?: string | null,
  sizeByDim?: string | null,
  clusterByDim?: string | null,
  sortSetting?: SortSetting | null,
  filters?: Filters | null,
  onClick?: (event: MouseEvent, data: T) => void,
  onMouseover?: (event: MouseEvent, data: T) => void,
  onMouseout?: (event: MouseEvent, data: T) => void,
  onCanvasClick?: (event: MouseEvent) => void,
};

type Filters = {
  [key: string]: Array<string | number>,
};

type CommonProperty = {
  x: number,
  y: number,
};

type CircleProperty<T> = {
  r: number,
  color: string,
  imgURL: string | null,
  label: string | null,
  display: boolean,
  _data: T,
} & CommonProperty;

type ClusterProperty = {
  r: number;
} & CommonProperty;

type SortLabelProperty = {
  width: number;
  label: string;
} & CommonProperty;

class Jello<T extends ObjectWithID> {
  width: number;
  height: number;
  data: Array<T>;
  options: Options<T>;

  container: HTMLDivElement;
  circleDiv: HTMLDivElement;
  clusterDiv: HTMLDivElement;
  sortLabelDiv: HTMLDivElement;

  circles: {[key: string]: HTMLDivElement};
  cirlcesProperty: {[key: string]: CircleProperty<T>};
  clustersProperty: {[key: string]: ClusterProperty};
  sortLabelProperty: {[key: string]: SortLabelProperty};

  /**
   *
   * @param {*} container the containing div
   * @param {*} data the list of entities to visualize in the format of {id, attribute_A, attribute_B, ...}
   * @param {*} options available settings {clusterByDim, colorByDim, sortSetting...}
   */
  constructor(container: HTMLDivElement, data: Array<T>, options: Options<T>) {
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
    this._calculateProperties();
    this._renderCluster();
    this._renderSortLabels();
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
    if (this.options.labelByDim !== null) {
      this.circleDiv.innerHTML = '';
      this.circles = {};
      this.options.displayImageByDim = null;
    } else {
      this.circleDiv.innerHTML = '';
      this.circles = {};
    }
    return this;
  }

  colorBy(dim: string | null) {
    this.options.colorByDim = this._sanitizeDimension(dim);
    return this;
  }

  sizeBy(dim: string | null) {
    this.options.sizeByDim = this._sanitizeDimension(dim);
    return this;
  }

  clusterBy(dim: string | null) {
    this.options.clusterByDim = this._sanitizeDimension(dim);
    this.options.sortSetting = null;
    return this;
  }

  /**
   *
   * @param {*} filters  {dim: 'xxx', values: ['xxx', ...]}
   * @returns
   */
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

  /**
   *
   * @param {*} setting {dim: 'valuation', order: 'asc' | 'desc'}
   * @returns
   */
  sortBy(setting: SortSetting | null) {
    const { dim } = setting != null ? setting : { dim: null };
    const sanitized = this._sanitizeDimension(dim);
    this.options.sortSetting = sanitized !== null ? setting : null;
    this.options.clusterByDim = null;
    return this;
  }

  /**
   *
   * @param {*} dim
   * When a displayImageBy dimension is set, colorBy is not going to work
   * @returns
   */
  displayImageBy(dim: string | null) {
    this.options.displayImageByDim = this._sanitizeDimension(dim);
    if (this.options.displayImageByDim !== null) {
      this.circleDiv.innerHTML = '';
      this.circles = {};
      this.options.colorByDim = null;
      this.options.labelByDim = null;
    }
    return this;
  }

  /**
   * when render the cluster layout, we need to render the cluster circle and label
   */
  _renderCluster() {
    // the cluster/label divs are already being re-created everytime render is called
    this.clusterDiv.innerHTML = "";
    if (Object.keys(this.clustersProperty).length) {
      // render cluster circle before cluster label to make sure labels are on top
      for (let id in this.clustersProperty) {
        const { x, y, r } = this.clustersProperty[id];
        const circle: HTMLDivElement = this._createCircle(null, x, y, r);
        this.clusterDiv.appendChild(circle);
        anime({
          targets: [circle],
          easing: 'easeInOutSine',
          border: '1px solid #BBB',
          opacity: 0.5,
        });
      }
      for (let id in this.clustersProperty) {
        const { x, y, r } = this.clustersProperty[id];
        const text = this._createText(x, y - r - 10, r * 2, 20, id, 1000);
        this.clusterDiv.appendChild(text);
        anime({
          targets: [text],
          easing: 'easeInOutSine',
          opacity: 1,
        });
      }
    }
  }

  /**
   * when render the sort view, we need to render the label for each circle
   */
  _renderSortLabels() {
    this.sortLabelDiv.innerHTML = "";
    if (this.sortLabelProperty && Object.keys(this.sortLabelProperty).length) {
      for (let id in this.sortLabelProperty) {
        const { x, y, width, label } = this.sortLabelProperty[id];
        const text = this._createText(x, y, width, 10, label, 1);
        this.sortLabelDiv.appendChild(text);
        anime({
          targets: [text],
          opacity: 1,
          easing: 'easeInOutSine',
        });
      }
    }
  }

  /**
   * to render all the circles with animation
   */
  _renderCirles() {
    // the circle group only gets created first time render gets called
    // it only does the animation afterwards
    if (!Object.keys(this.circles).length) {
      this.circles = {};
      this.data.forEach(entry => {
        const { _data, x, y, r, color, imgURL, label, display } = this.cirlcesProperty[entry.id];
        const radius = display ? r : 0;
        const circle = this._createCircle(_data, x, y, radius, color, imgURL, label);
        this.circleDiv.appendChild(circle);
        this.circles[entry.id] = circle;
      });
    } else {
      for (let id in this.circles) {
        const { x, y, r, color, display } = this.cirlcesProperty[id];
        const size = display ? r * 2 : 0;
        anime({
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

  _createCircle(
    data: any,
    x: number,
    y: number,
    r: number,
    color?: string | null,
    imgURL?: string | null,
    label?: string | null,
  ): HTMLDivElement {
    const circle: HTMLDivElement = document.createElement('div');
    const opacity = color != null ? 0.7 : 0;
    circle.setAttribute('style', `
      position: absolute;
      left: ${x - r}px;
      top: ${y - r}px;
      background: ${color};
      border-radius: 50%;
      width: ${r * 2}px;
      height: ${r * 2}px;
      opacity: ${opacity};
      padding: 0px;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      text-overflow: ellipsis;
    `);
    if (imgURL != null) {
      const img = document.createElement('img');
      img.src = imgURL;
      img.setAttribute('style', `
        height: 100%;
        width: 100%;
        object-fit: contain;
        border-radius: 50%;
      `);
      circle.innerHTML = '';
      circle.appendChild(img);
    } else if (label != null) {
      circle.innerHTML += label;
    }
    const events = {
      'click': this.options.onClick,
      'mouseover': this.options.onMouseover,
      'mouseout': this.options.onMouseout,
    };
    for (let e in events) {
      circle.addEventListener(e, (event) => {
        events[e] && events[e](event, data);
      });
    }
    return circle;
  }

  _createText(
    x: number,
    y: number,
    width: number,
    height: number,
    txt: string,
    z?: number,
  ): HTMLDivElement {
    const text = document.createElement('div');
    const zIndex = z != null ? z : 1;
    text.setAttribute('style', `
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      left: ${x - width / 2}px;
      top: ${y - height / 2}px;
      color: ${FONT_COLOR};
      font-family: ${FONT_FAMILY};
      font-size: ${FONT_SIZE};
      width: ${width}px;
      height: ${height}px;
      zIndex: ${zIndex};
      opacity: 0;
      white-space: nowrap;
    `);
    text.innerHTML += txt;
    return text;
  }

  /**
   * This method calculate the x, y, r, color etc properties for the circles/clusters/labels based on the settings
   * @returns
   */
  _calculateProperties() {
    this.clustersProperty = {};
    this.sortLabelProperty = {};

    const packLayout = pack()
      .size([this.width, this.height])
      .padding(20);
    const sizeByDim = this.options.sizeByDim;
    let entries: Array<{[key: string]: string | number}> = this.data.map(entry => {
      this.cirlcesProperty[entry.id].display = true;
      return {
        name: entry.id,
        value: sizeByDim != null ? entry[sizeByDim] : 1,
        ...entry,
      };
    });
    // handle filterBy. When some entry is filtered out, we need to
    // 1) get rid of them from entries
    // 2) mark display to be false in the circlesProperty
    if (this.options.filters != null) {
      entries = entries.filter(entry => {
        for (let dim in this.options.filters) {
          const values = this.options.filters[dim];
          if (values.indexOf(entry[dim]) < 0) {
            this.cirlcesProperty[entry.id].display = false;
            return false;
          }
        }
        return true;
      });
    }

    let rootNode = hierarchy({ 'name': 'ALL', children: entries });

    // cluster view
    if (this.options.clusterByDim != null) {
      let clusterByDim = this.options.clusterByDim;
      const nested = nest()
        .key((d: any) => d[clusterByDim])
        .entries(entries);
      const converted = nested.map(item => {
        const value = item.values.reduce((total: number, child: {value: number}) => {
          return total + child.value;
        }, 0);
        return {
          id: item.key,
          value,
          children: item.values,
        };
      });
      rootNode = hierarchy({ 'name': 'ALL', children: converted });
    }
    // @ts-ignore
    rootNode.sum(d => d.value);
    packLayout(rootNode);

    if (rootNode.height === 1) {
      // @ts-ignore
      rootNode.children.forEach(entry => {
      // @ts-ignore
        this.cirlcesProperty[entry.data.id].x = entry.x;
      // @ts-ignore
        this.cirlcesProperty[entry.data.id].y = entry.y;
      // @ts-ignore
        this.cirlcesProperty[entry.data.id].r = entry.r;
      });
    } else if (rootNode.height === 2) {
      this.clustersProperty = {};
      // @ts-ignore
      rootNode.children.forEach(cluster => {
        // @ts-ignore
        this.clustersProperty[cluster.data.id] = {
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
        cluster.children.forEach(entry => {
          // @ts-ignore
          this.cirlcesProperty[entry.data.id].x = entry.x;
          // @ts-ignore
          this.cirlcesProperty[entry.data.id].y = entry.y;
          // @ts-ignore
          this.cirlcesProperty[entry.data.id].r = entry.r;
        });
      });
    }
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

    // set images
    if (this.options.displayImageByDim != null) {
      const dim = this.options.displayImageByDim;
      this.data.forEach(entry => {
        // @ts-ignore
        this.cirlcesProperty[entry.id].imgURL = entry[dim];
        this.cirlcesProperty[entry.id].color = DEFAULT_COLOR;
      });
    } else {
      this.data.forEach(entry => {
        this.cirlcesProperty[entry.id].imgURL = null;
      });
    }

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

    if (this.options.sortSetting != null) {
      const setting = this.options.sortSetting;
      this.sortLabelProperty = {};
      const flag = setting.order === 'asc' ? 1 : -1;
      entries.sort((a, b) => {
        if (a[setting.dim] > b[setting.dim]) {
          return flag;
        } else {
          return flag * -1;
        }
      });

      let offset = 10;
      for (let i = 0; i < entries.length; i++) {
        const props = this.cirlcesProperty[entries[i].id];
        this.sortLabelProperty[entries[i].id] = {
          x: offset + props.r,
          y: this.height / 2 + props.r + 20,
          width: props.r * 2,
          label: entries[i][setting.dim] as string,
        };
        props.x = offset + props.r;
        props.y = this.height / 2;
        offset += 2 * props.r + 10;
      }
    }
  }
}

export default Jello;
