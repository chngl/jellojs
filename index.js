import { hierarchy, pack, scaleOrdinal, schemeSet3 } from 'd3';

import anime from 'animejs/lib/anime.es.js';
import { nest } from 'd3-collection';

const DEFAULT_COLOR = '#eee';
const FONT_FAMILY = 'Lucida Grande, Tahoma, Verdana, Ar';
const FONT_SIZE = 14;
const FONT_COLOR = '#4B4F56';

class Jello {
  /**
   *
   * @param {*} container the containing div
   * @param {*} data the list of entities to visualize in the format of {id, attribute_A, attribute_B, ...}
   * @param {*} options available settings {clusterBy, colorBy, sortBy...}
   */
  constructor(container, data, options) {
    // make sure to clear the container first
    container.innerHTML = '';
    this.circleDiv = document.createElement('div');
    this.clusterDiv = document.createElement('div');
    this.sortLabelDiv = document.createElement('div');
    container.appendChild(this.circleDiv);
    container.appendChild(this.clusterDiv);
    container.appendChild(this.sortLabelDiv);
    this.container = container;

    this.width = container.offsetWidth;
    this.height = container.offsetHeight;
    this.data = data;

    // these vars stores the x, y, r, color etc properties for the circles/clusters/sortLabels
    this.cirlcesProperty = {};
    this.clustersProperty = null;
    this.sortLabelProperty = null;
    this.data.forEach(entry => {
      this.cirlcesProperty[entry.id] = {
        x: 0,
        y: 0,
        r: 0,
        color: DEFAULT_COLOR,
        imgURL: null,
        display: true,
      }
    });

    // this stores the reference to the circles in circleDiv
    this.circles = null;

    const { clusterBy, colorBy, sizeBy, filterBy, sortBy, displayImageBy } = options;
    this.setClusterBy(clusterBy);
    this.setColorBy(colorBy);
    this.setSizeBy(sizeBy);
    this.setFilterBy(filterBy);
    this.setSortBy(sortBy);
    this.setDisplayImageBy(displayImageBy);
  }

  render() {
    this._calculateProperties();
    this._renderCluster();
    this._renderSortLabels();
    this._renderCirles();
  }

  setColorBy(dim) {
    this.colorBy = this._sanitizeDimension(dim, this._getWarnningMsg(dim));
    return this;
  }

  setSizeBy(dim) {
    this.sizeBy = this._sanitizeDimension(dim, this._getWarnningMsg(dim));
    return this;
  }

  setClusterBy(dim) {
    this.clusterBy = this._sanitizeDimension(dim, this._getWarnningMsg(dim));
    this.sortBy = null;
    return this;
  }

  /**
   *
   * @param {*} dimValues  {dim: 'xxx', values: ['xxx', ...]}
   * @returns
   */
  setFilterBy(dimValues) {
    const sanitized = {};
    for (let dim in dimValues) {
      const sanitizedDim = this._sanitizeDimension(dim, this._getWarnningMsg(dim));
      if (sanitizedDim !== null) {
        sanitized[dim] = dimValues[dim];
      }
    }
    this.filterBy = Object.keys(sanitized).length > 0 ? sanitized : null;
    return this;
  }

  /**
   *
   * @param {*} setting {dim: 'xxx', order: 'asc' | 'desc'}
   * @returns
   */
  setSortBy(setting) {
    const {dim} = setting != null ? setting : {};
    const sanitized = this._sanitizeDimension(dim, this._getWarnningMsg(dim));
    this.sortBy = sanitized !== null ? setting : null;
    this.clusterBy = null;
    return this;
  }

  /**
   *
   * @param {*} dim
   * When a displayImageBy dimension is set, colorBy is not going to work
   * @returns
   */
  setDisplayImageBy(dim) {
    this.displayImageBy = this._sanitizeDimension(dim, this._getWarnningMsg(dim));
    if (this.displayImageBy !== null) {
      this.colorBy = null;
    }
    return this;
  }

  /**
   * when render the cluster layout, we need to render the cluster circle and label
   */
  _renderCluster() {
    // the cluster/label divs are already being re-created everytime render is called
    this.clusterDiv.innerHTML = "";
    if (this.clustersProperty && Object.keys(this.clustersProperty).length) {
      // render cluster circle before cluster label to make sure labels are on top
      for (let id in this.clustersProperty) {
        const {x, y, r} = this.clustersProperty[id];
        const circle = this._createCircle(x, y, r);
        this.clusterDiv.appendChild(circle);
        anime({
          targets: [circle],
          easing: 'easeInOutSine',
          border: '1px solid #BBB',
          opacity: 0.5,
        });
      }
      for (let id in this.clustersProperty) {
        const {x, y, r} = this.clustersProperty[id];
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
        const {x, y, width, txt} = this.sortLabelProperty[id];
        console.log(txt);
        const text = this._createText(x, y, width, 10, txt, 1);
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
    if (this.circles === null) {
      this.circles = {};
      this.data.forEach(entry => {
        const {x, y, r, color, imgURL} = this.cirlcesProperty[entry.id];
        const circle = this._createCircle(x, y, r, color, imgURL);
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

  _sanitizeDimension(dim, msg) {
    if (dim != null && this.data && this.data.length) {
      if (dim in this.data[0]) {
        return dim;
      } else {
        console.log(msg);
      }
    }
    return null;
  }

  _getWarnningMsg(dim) {
    return `${dim} is not valid property. It will not take any effect.`;
  }

  _createCircle(x, y, r, color, imgURL, z) {
    const circle = document.createElement('div');
    const zIndex = z != null ? z : 1;
    const opacity = color != null ? 0.7  : 0;
    circle.style = `
      position: absolute;
      left: ${x - r}px;
      top: ${y - r}px;
      background: ${color};
      border-radius: 50%;
      width: ${r * 2}px;
      height: ${r * 2}px;
      zIndex: ${zIndex};
      opacity: ${opacity};
      padding: 0px;
      box-sizing: border-box;
    `;
    if (imgURL != null) {
      const img = document.createElement('img');
      img.src = imgURL;
      img.style = `
        height: 100%;
        width: 100%;
        object-fit: contain;
        border-radius: 50%;
      `;
      circle.appendChild(img);
    }
    return circle;
  }

  _createText(x, y, width, height, txt, z) {
    const text = document.createElement('div');
    const zIndex = z != null ? z : 1;
    text.style = `
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
    `;
    text.innerHTML += txt;
    return text;
  }

  /**
   * This method calculate the x, y, r, color etc properties for the circles/clusters/labels based on the settings
   * @returns
   */
  _calculateProperties() {
    this.clustersProperty = null;
    this.sortLabelProperty = null;

    const packLayout = pack()
      .size([this.width, this.height])
      .padding(20);
    let entries = this.data.map(entry => {
      this.cirlcesProperty[entry.id].display = true;
      return {
        id: entry.id,
        name: entry.name,
        value: this.sizeBy != null ? entry[this.sizeBy] : 1,
        ...entry,
        };
    });
    // handle filterBy. When some entry is filtered out, we need to
    // 1) get rid of them from entries
    // 2) mark display to be false in the circlesProperty
    if (this.filterBy !== null) {
      entries = entries.filter(entry => {
        for (let dim in this.filterBy) {
          const values = this.filterBy[dim];
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
    if (this.clusterBy !== null) {
      const nested = nest()
        .key(d => d[this.clusterBy])
        .entries(entries);
      const converted = nested.map(item => {
        const value = item.values.reduce((total, child) => {
          return total + child.value;
        }, 0);
        return {
          id: item.key,
          value,
          children: item.values,
        };
      });
      rootNode = hierarchy({ 'name': 'ALL', children: converted});
    }

    rootNode.sum(d => d.value);
    packLayout(rootNode);

    if (rootNode.height === 1) {
      rootNode.children.forEach(entry => {
        this.cirlcesProperty[entry.data.id].x = entry.x;
        this.cirlcesProperty[entry.data.id].y = entry.y;
        this.cirlcesProperty[entry.data.id].r = entry.r;
      });
    } else if (rootNode.height === 2) {
      this.clustersProperty = {};
      rootNode.children.forEach(cluster => {
        this.clustersProperty[cluster.data.id] = {
          text: cluster.data.id,
          x: cluster.x,
          y: cluster.y,
          r: cluster.r,
        };
        cluster.children.forEach(entry => {
          this.cirlcesProperty[entry.data.id].x = entry.x;
          this.cirlcesProperty[entry.data.id].y = entry.y;
          this.cirlcesProperty[entry.data.id].r = entry.r;
        });
      });
    }
    if (this.colorBy === null) {
      this.data.forEach(entry => {
        this.cirlcesProperty[entry.id].color = DEFAULT_COLOR;
      });
    } else {
      const distinctValues = [...new Set(this.data.map(entry => entry[this.colorByDim]))];
      this.data.map(entry => entry[this.colorBy])
      const colorPicker = scaleOrdinal()
        .domain(distinctValues)
        .range(schemeSet3);

      this.data.forEach(entry => {
        this.cirlcesProperty[entry.id].color = colorPicker(entry[this.colorBy])
      });
    }
    if (this.displayImageBy !== null) {
      this.data.forEach(entry => {
        this.cirlcesProperty[entry.id].imgURL = entry[this.displayImageBy];
        this.cirlcesProperty[entry.id].color = DEFAULT_COLOR;
      });
    }
    if (this.sortBy !== null) {
      this.sortLabelProperty = {};
      const flag = this.sortBy.order === 'asc' ? 1 : -1;
      entries.sort((a, b) => {
        if (a[this.sortBy.dim] > b[this.sortBy.dim]) {
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
          txt: entries[i][this.sortBy.dim],
        };
        props.x = offset + props.r;
        props.y = this.height / 2;
        offset += 2 * props.r + 10;
      }
    }
  }
}

export default Jello;
