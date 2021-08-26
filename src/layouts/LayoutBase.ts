import type {LayoutProperty} from '../types';
import type {ObjectWithID} from '../types';
import type {Options} from '../types';

export default class LayoutBase<T extends ObjectWithID> {

  data: Array<T>;
  options: Options<T>;
  width: number;
  height: number;

  constructor(data: Array<T>, options: Options<T>, width: number, height: number) {
    this.data = data;
    this.options = options;
    this.width = width;
    this.height = height;
  }

  calculateCirclesLayout():{[key: string]: LayoutProperty} {
    return {};
  }
  renderAdditionalVisual(): HTMLDivElement | null {
    return null;
  }
}
