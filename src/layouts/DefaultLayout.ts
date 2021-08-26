import { hierarchy, pack } from 'd3';

import LayoutBase from './LayoutBase'
import type {LayoutProperty} from '../types';
import type {ObjectWithID} from '../types';
import type {Options} from '../types';

export default class DefaultLayout<T extends ObjectWithID> extends LayoutBase<T> {

  constructor(data: Array<T>, options: Options<T>, width: number, height: number) {
    super(data, options, width, height);
  }

  calculateCirclesLayout():{[key: string]: LayoutProperty} {
    const property = {};
    const packLayout = pack()
      .size([this.width, this.height])
      .padding(20);
    const sizeByDim = this.options.sizeByDim;
    let entries: Array<{[key: string]: string | number}> = this.data.map(entry => {
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
    // @ts-ignore
    rootNode.sum(d => d.value);
    packLayout(rootNode);

    rootNode?.children?.forEach(entry => {
      // @ts-ignore
      property[entry.data.id].x = entry.x;
      // @ts-ignore
      property[entry.data.id].y = entry.y;
      // @ts-ignore
      property[entry.data.id].r = entry.r;
    });
    return property;
  }

  renderAdditionalVisual(): HTMLDivElement | null {
    return null;
  }
}
