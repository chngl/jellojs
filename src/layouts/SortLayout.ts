import DefaultLayout from './DefaultLayout';
import LayoutBase from './LayoutBase'
import type { LayoutProperty } from '../types'
import type { ObjectWithID } from '../types'
import type { Options } from '../types'
import anime from 'animejs';
import { createText } from '../utils';

export default class SortLayout<T extends ObjectWithID> extends LayoutBase<T> {

  constructor(data: Array<T>, options: Options<T>, width: number, height: number) {
    super(data, options, width, height);
  }

  calculateCirclesLayout(): {
    layoutProperties: {[key: string]: LayoutProperty},
    additionalVisual: HTMLDivElement | null,
  } {
    const sortLabelProperty = {};
    const labels = document.createElement('div');
    labels.innerHTML = "";
    const defaultLayout = new DefaultLayout(this.data, this.options, this.width, this.height);
    const layoutProperties = defaultLayout.calculateCirclesLayout().layoutProperties;
    if (this.options.sortSetting != null) {
      const setting = this.options.sortSetting;
      const flag = setting.order === 'asc' ? 1 : -1;
      const entries: Array<{id: string, value: string | number}> = [];
      this.data.forEach(entry => {
        if (entry.id in layoutProperties && layoutProperties[entry.id].display) {
          entries.push({
            id: entry.id,
            value: entry[setting.dim],
          });
        }
      });
      entries.sort((a, b) => {
        if (a.value > b.value) {
          return flag;
        } else {
          return flag * -1;
        }
      });

      let offset = 10;
      for (let i = 0; i < entries.length; i++) {
        const props = layoutProperties[entries[i].id];
        sortLabelProperty[entries[i].id] = {
          x: offset + props.r,
          y: this.height / 2 + props.r + 20,
          width: props.r * 2,
          label: entries[i].value as string,
        };
        props.x = offset + props.r;
        props.y = this.height / 2;
        offset += 2 * props.r + 10;
      }
    }
    if (sortLabelProperty && Object.keys(sortLabelProperty).length) {
      for (let id in sortLabelProperty) {
        const { x, y, width, label } = sortLabelProperty[id];
        const text = createText(x, y, width, 10, label, 1);
        labels.appendChild(text);
        anime({
          targets: [text],
          opacity: 1,
          easing: 'easeInOutSine',
        });
      }
    };
    return {
      layoutProperties,
      additionalVisual: labels,
    };
  }
}
