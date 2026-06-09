import { hierarchy, pack, scaleLinear, scaleBand } from 'd3';

import LayoutBase from './LayoutBase';
import type { LayoutProperty } from '../types';
import type { ObjectWithID } from '../types';
import type { Options } from '../types';
import { createCircle, createText } from '../utils';
import { DEFAULT_COLOR, FONT_FAMILY, FONT_COLOR, FONT_SIZE, AXIS_COLOR } from '../constants';
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
    const renderAs = setting.renderAs || 'circles';

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

    if (renderAs === 'bars') {
      return this._renderBars(groupEntries, property);
    }

    return this._renderCircles(groupEntries, property);
  }

  _renderCircles(
    groupEntries: Array<{key: string, value: number}>,
    property: {[key: string]: LayoutProperty},
  ): {
    layoutProperties: {[key: string]: LayoutProperty},
    additionalVisual: HTMLDivElement | null,
  } {
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

  _renderBars(
    groupEntries: Array<{key: string, value: number}>,
    property: {[key: string]: LayoutProperty},
  ): {
    layoutProperties: {[key: string]: LayoutProperty},
    additionalVisual: HTMLDivElement | null,
  } {
    const padding = { top: 20, right: 40, bottom: 40, left: 80 };
    const chartWidth = this.width - padding.left - padding.right;
    const chartHeight = this.height - padding.top - padding.bottom;

    const maxValue = Math.max(...groupEntries.map(g => g.value), 0.001);

    const xScale = scaleLinear()
      .domain([0, maxValue])
      .range([0, chartWidth]);

    const yScale = scaleBand<string>()
      .domain(groupEntries.map(g => g.key))
      .range([0, chartHeight])
      .padding(0.2);

    const barHeight = yScale.bandwidth();

    // Compute circle pack positions for transition start
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

    const circlePositions: {[key: string]: {x: number, y: number, r: number}} = {};
    if (rootNode.children) {
      rootNode.children.forEach((node: any) => {
        circlePositions[node.data.id] = { x: node.x, y: node.y, r: node.r };
      });
    }

    const container = document.createElement('div');
    container.style.position = 'relative';
    container.style.width = this.width + 'px';
    container.style.height = this.height + 'px';

    groupEntries.forEach(g => {
      const barWidth = xScale(g.value);
      const barX = padding.left;
      const barY = padding.top + (yScale(g.key) || 0);
      const cp = circlePositions[g.key];

      // Transitioning circle: starts at pack position, moves to bar row, fades out
      if (cp) {
        const circle = createCircle(null, cp.x, cp.y, cp.r);
        circle.style.background = DEFAULT_COLOR;
        circle.style.opacity = '0.7';
        container.appendChild(circle);

        anime({
          targets: [circle],
          easing: 'easeInOutSine',
          left: barX,
          top: barY,
          width: barHeight,
          height: barHeight,
          borderRadius: '50%',
          opacity: 0,
          duration: 700,
        });
      }

      // Bar element: starts at zero width, grows to full width
      const bar = document.createElement('div');
      bar.setAttribute('style', [
        'position: absolute',
        'left: ' + barX + 'px',
        'top: ' + barY + 'px',
        'width: 0px',
        'height: ' + barHeight + 'px',
        'background: ' + DEFAULT_COLOR,
        'opacity: 0',
        'box-sizing: border-box',
      ].join('; '));
      container.appendChild(bar);

      anime({
        targets: [bar],
        easing: 'easeInOutSine',
        width: barWidth,
        opacity: 0.7,
        duration: 700,
        delay: 300,
      });

      const label = document.createElement('div');
      label.setAttribute('style', [
        'position: absolute',
        'left: 0px',
        'top: ' + barY + 'px',
        'width: ' + (padding.left - 8) + 'px',
        'height: ' + barHeight + 'px',
        'display: flex',
        'align-items: center',
        'justify-content: flex-end',
        'color: ' + FONT_COLOR,
        'font-family: ' + FONT_FAMILY,
        'font-size: ' + FONT_SIZE + 'px',
        'opacity: 0',
        'white-space: nowrap',
        'overflow: hidden',
        'text-overflow: ellipsis',
      ].join('; '));
      label.textContent = g.key;
      container.appendChild(label);

      anime({
        targets: [label],
        easing: 'easeInOutSine',
        opacity: 1,
        duration: 700,
        delay: 300,
      });

      const valueLabel = document.createElement('div');
      valueLabel.setAttribute('style', [
        'position: absolute',
        'left: ' + (barX + barWidth + 4) + 'px',
        'top: ' + barY + 'px',
        'height: ' + barHeight + 'px',
        'display: flex',
        'align-items: center',
        'color: ' + FONT_COLOR,
        'font-family: ' + FONT_FAMILY,
        'font-size: ' + FONT_SIZE + 'px',
        'opacity: 0',
      ].join('; '));
      valueLabel.textContent = String(Math.round(g.value * 100) / 100);
      container.appendChild(valueLabel);

      anime({
        targets: [valueLabel],
        easing: 'easeInOutSine',
        opacity: 1,
        duration: 700,
        delay: 300,
      });
    });

    const axisLine = document.createElement('div');
    axisLine.setAttribute('style', [
      'position: absolute',
      'left: ' + padding.left + 'px',
      'top: ' + (padding.top + chartHeight) + 'px',
      'width: ' + chartWidth + 'px',
      'height: 1px',
      'background: ' + AXIS_COLOR,
    ].join('; '));
    container.appendChild(axisLine);

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
