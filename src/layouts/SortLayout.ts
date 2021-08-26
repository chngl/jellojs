import DefaultLayout from './DefaultLayout';
import LayoutBase from './LayoutBase'
import type { LayoutProperty } from '../types'
import type { ObjectWithID } from '../types'
import type { Options } from '../types'
import anime from 'animejs';
import { createText } from '../utils';

export default class SortLayout<T extends ObjectWithID> extends LayoutBase<T> {

  sortLabelProperty: {};
  constructor(data: Array<T>, options: Options<T>, width: number, height: number) {
    super(data, options, width, height);
  }

  calculateCirclesLayout(): { [key: string]: LayoutProperty } {
    const defaultLayout = new DefaultLayout(this.data, this.options, this.width, this.height);
    const layoutProperty = defaultLayout.calculateCirclesLayout();
    if (this.options.sortSetting != null) {
      const setting = this.options.sortSetting;
      this.sortLabelProperty = {};
      const flag = setting.order === 'asc' ? 1 : -1;
      const entries: Array<{id: string, value: string | number}> = [];
      this.data.forEach(entry => {
        if (entry.id in layoutProperty && layoutProperty[entry.id].display) {
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
        const props = layoutProperty[entries[i].id];
        this.sortLabelProperty[entries[i].id] = {
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
    return layoutProperty;
  }

  renderAdditionalVisual(): HTMLDivElement | null {
    const labels = document.createElement('div');
    labels.innerHTML = "";
    if (this.sortLabelProperty && Object.keys(this.sortLabelProperty).length) {
      for (let id in this.sortLabelProperty) {
        const { x, y, width, label } = this.sortLabelProperty[id];
        const text = createText(x, y, width, 10, label, 1);
        labels.appendChild(text);
        anime({
          targets: [text],
          opacity: 1,
          easing: 'easeInOutSine',
        });
      }
      return labels;
    };
    return null;
  }
}
