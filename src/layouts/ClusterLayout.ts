import {createCircle, createText} from '../utils';
import { hierarchy, pack } from 'd3'

import LayoutBase from './LayoutBase'
import type { LayoutProperty } from '../types'
import type { ObjectWithID } from '../types'
import type { Options } from '../types'
import anime from 'animejs';
import { nest } from 'd3-collection'

export default class ClusterLayout<T extends ObjectWithID> extends LayoutBase<T> {

  constructor(data: Array<T>, options: Options<T>, width: number, height: number) {
    super(data, options, width, height);
  }

  calculateCirclesLayout(): {
    layoutProperties: {[key: string]: LayoutProperty},
    additionalVisual: HTMLDivElement | null,
  } {
    const property = {};
    const packLayout = pack()
      .size([this.width, this.height])
      .padding(20);
    const sizeByDim = this.options.sizeByDim;
    let entries: Array<{ [key: string]: string | number }> = this.data.map(entry => {
      property[entry.id] = {
        x: this.width / 2,
        y: this.height / 2,
        r: 0,
        display: true,
      };
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
            property[entry.id].display = false;
            return false;
          }
        }
        return true;
      });
    }

    let rootNode = hierarchy({ 'name': 'ALL', children: entries });
    if (this.options.clusterByDim != null) {
      let clusterByDim = this.options.clusterByDim;
      const nested = nest()
        .key((d: any) => d[clusterByDim])
        .entries(entries);
      const converted = nested.map(item => {
        const value = item.values.reduce((total: number, child: { value: number }) => {
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

    const clustersProperty = {};
    // @ts-ignore
    rootNode.children.forEach(cluster => {
      // @ts-ignore
      clustersProperty[cluster.data.id] = {
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
        property[entry.data.id].x = entry.x;
        // @ts-ignore
        property[entry.data.id].y = entry.y;
        // @ts-ignore
        property[entry.data.id].r = entry.r;
      });
    });
    const clusters = document.createElement('div');
    clusters.innerHTML = "";

    if (Object.keys(clustersProperty).length) {
      // render cluster circle before cluster label to make sure labels are on top
      for (let id in clustersProperty) {
        const { x, y, r } = clustersProperty[id];
        const circle: HTMLDivElement = createCircle(null, x, y, r);
        clusters.appendChild(circle);
        anime({
          targets: [circle],
          easing: 'easeInOutSine',
          border: '1px solid #BBB',
          opacity: 0.5,
        });
      }
      for (let id in clustersProperty) {
        const { x, y, r } = clustersProperty[id];
        const text = createText(x, y - r - 10, r * 2, 20, id, 1000);
        clusters.appendChild(text);
        anime({
          targets: [text],
          easing: 'easeInOutSine',
          opacity: 1,
        });
      }
    }
    return {
      layoutProperties: property,
      additionalVisual: clusters,
    };
  }
}
