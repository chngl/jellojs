import { hierarchy, pack } from 'd3';

import LayoutBase from './LayoutBase';
import type { LayoutProperty } from '../types';
import type { ObjectWithID } from '../types';
import type { Options } from '../types';
import { createCircle, createText } from '../utils';
import { DEFAULT_COLOR } from '../constants';
import anime from 'animejs';

export default class GroupByLayout<T extends ObjectWithID> extends LayoutBase<T> {

  constructor(data: Array<T>, options: Options<T>, width: number, height: number) {
    super(data, options, width, height);
  }

  calculateCirclesLayout(): {
    layoutProperties: {[key: string]: LayoutProperty},
    additionalVisual: HTMLDivElement | null,
  } {
    const property: {[key: string]: LayoutProperty} = {};

    // Hide all individual circles when using groupBy layout
    this.data.forEach(entry => {
      property[entry.id] = { x: 0, y: 0, r: 0, display: false };
    });

    const setting = this.options.groupBySetting;
    if (!setting) {
      return { layoutProperties: property, additionalVisual: null };
    }

    let entries: Array<T> = [...this.data];
    if (this.options.filters != null) {
      entries = entries.filter(entry => {
        for (let dim in this.options.filters) {
          // @ts-ignore
          const values = this.options.filters[dim];
          // @ts-ignore
          if (values.indexOf(entry[dim]) < 0) {
            return false;
          }
        }
        return true;
      });
    }

    if (entries.length === 0) {
      return { layoutProperties: property, additionalVisual: null };
    }

    const dim = setting.dim;
    const agg = setting.agg;
    const sortBy = setting.sortBy;
    const sortOrder = setting.sortOrder;

    const groups: {[key: string]: Array<T>} = {};
    entries.forEach(entry => {
      // @ts-ignore
      const key = String(entry[dim]);
      if (!groups[key]) groups[key] = [];
      groups[key].push(entry);
    });

    const groupEntries: Array<{key: string, value: number}> = [];
    for (const key in groups) {
      const items = groups[key];
      const value = this._calculateAggregation(items, agg, dim);
      groupEntries.push({ key, value });
    }

    groupEntries.sort((a, b) => {
      let cmp: number;
      if (sortBy === 'dim') {
        if (a.key < b.key) cmp = -1;
        else if (a.key > b.key) cmp = 1;
        else cmp = 0;
      } else {
        cmp = a.value - b.value;
      }
      return sortOrder === 'desc' ? -cmp : cmp;
    });

    const packLayout = pack()
      .size([this.width, this.height])
      .padding(20);

    const rootData = {
      children: groupEntries.map(g => ({
        id: g.key,
        value: Math.max(g.value, 0.001),
      }))
    };

    // @ts-ignore
    const rootNode = hierarchy(rootData);
    rootNode.sum((d: any) => d.value);
    packLayout(rootNode);

    const nodeMap: {[key: string]: any} = {};
    if (rootNode.children) {
      rootNode.children.forEach((node: any) => {
        nodeMap[node.data.id] = node;
      });
    }

    groupEntries.forEach(g => {
      const node = nodeMap[g.key];
      if (node) {
        property[g.key] = {
          x: node.x,
          y: node.y,
          r: node.r,
          display: true,
        };
      }
    });

    const container = document.createElement('div');
    if (rootNode.children) {
      rootNode.children.forEach((node: any) => {
        const circle = createCircle(null, node.x, node.y, node.r);
        circle.style.background = DEFAULT_COLOR;
        container.appendChild(circle);
        anime({
          targets: [circle],
          easing: 'easeInOutSine',
          opacity: 0.7,
        });

        const text = createText(node.x, node.y, node.r * 2, 20, node.data.id, 1000);
        container.appendChild(text);
        anime({
          targets: [text],
          easing: 'easeInOutSine',
          opacity: 1,
        });
      });
    }

    return {
      layoutProperties: property,
      additionalVisual: container,
    };
  }

  _calculateAggregation(items: Array<T>, agg: string, groupDim: string): number {
    if (agg === 'count') {
      return items.length;
    }

    const valueDim = this.options.sizeByDim || groupDim;
    const values: number[] = [];
    items.forEach(item => {
      // @ts-ignore
      const v = item[valueDim];
      if (typeof v === 'number') {
        values.push(v);
      }
    });

    if (values.length === 0) return 0;

    if (agg === 'sum') {
      return values.reduce((a, b) => a + b, 0);
    }

    if (agg === 'avg') {
      return values.reduce((a, b) => a + b, 0) / values.length;
    }

    if (agg === 'median') {
      const sorted = [...values].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      if (sorted.length % 2 === 1) {
        return sorted[mid];
      }
      return (sorted[mid - 1] + sorted[mid]) / 2;
    }

    return 0;
  }
}
