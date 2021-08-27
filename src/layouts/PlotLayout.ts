import {AXIS_COLOR, FONT_COLOR, FONT_FAMILY} from '../constants';
import { axisBottom, axisLeft, scaleLinear, select } from 'd3';

import DefaultLayout from './DefaultLayout';
import LayoutBase from './LayoutBase'
import type { LayoutProperty } from '../types'
import type { ObjectWithID } from '../types'
import type { Options } from '../types'
import type { SortSetting } from '../types'

export default class PlotLayout<T extends ObjectWithID> extends LayoutBase<T> {

  constructor(data: Array<T>, options: Options<T>, width: number, height: number) {
    super(data, options, width, height);
  }

  calculateCirclesLayout(): {
    layoutProperties: {[key: string]: LayoutProperty},
    additionalVisual: HTMLDivElement | null,
  } {
    const padding = 40;
    const defaultLayout = new DefaultLayout(this.data, this.options, this.width, this.height);
    const layoutProperties = defaultLayout.calculateCirclesLayout().layoutProperties;
    let additionalVisual = null;
    if (this.options.plotSetting != null) {
      const setting = this.options.plotSetting;
      const data = this.data.filter(entry => layoutProperties[entry.id].display);
      const xScale = this._getScale(data, setting.x, [padding, this.width - padding]);
      const yScale = this._getScale(data, setting.y, [this.height - padding, padding]);
      this.data.forEach(entry => {
        const props = layoutProperties[entry.id];
        const xVal = entry[setting.x.dim];
        const yVal = entry[setting.y.dim];
        if (props.display && typeof xVal === 'number' && typeof yVal === 'number') {
          props.x = xScale(xVal);
          props.y = yScale(yVal);
          if (setting.getCircleSize) {
            props.r = setting.getCircleSize(entry);
          }
        }
      });
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      select(svg)
        .attr("width", this.width)
        .attr("height",this.height);
      select(svg)
        .append("g")
        .style("color", AXIS_COLOR)
        .attr("transform", `translate(0, ${this.height - padding})`)
        .call(axisBottom(xScale))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end")
        .style("font-family", FONT_FAMILY)
        .style("color", FONT_COLOR);

      select(svg)
        .append("g")
        .style("color", AXIS_COLOR)
        .attr("transform", `translate(${padding}, 0)`)
        .call(axisLeft(yScale))
        .selectAll("text")
        .style("font-family", FONT_FAMILY)
        .style("color", FONT_COLOR);
      additionalVisual = document.createElement('div');
      additionalVisual.appendChild(svg);
    }
    return {
      layoutProperties,
      additionalVisual,
    };
  }

  _getScale(data: Array<T>, setting: SortSetting, range: Array<number>) {
    const vals: Array<number> = data.reduce((acc: Array<number>, entry: T) => {
      const val = entry[setting.dim];
      if (typeof val == 'number') {
        acc.push(val);
      }
      return acc;
    }, []);
    const [min, max] = [this._min(vals), this._max(vals)];
    const domain = setting.order === 'asc' ? [min, max] : [max, min];
    return scaleLinear()
      .domain(domain)
      .range(range);
  }

  _min(vals: Array<number>): number {
    if (!vals.length) {
      throw Error('vals can not be empty');
    }
    let min = vals[0];
    for (let v of vals) {
      if (v < min) {
        min = v;
      }
    }
    return min;
  }

  _max(vals: Array<number>): number {
    if (!vals.length) {
      throw Error('vals can not be empty');
    }
    let max = vals[0];
    for (let v of vals) {
      if (v > max) {
        max = v;
      }
    }
    return max;
  }
}
