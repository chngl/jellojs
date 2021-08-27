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

  /**
   * @returns this function returns the layout properties for each cricle,
   *          as well as an optional div that contains the additional visuals to complement the layout
   */
  calculateCirclesLayout(): {
    layoutProperties: {[key: string]: LayoutProperty},
    additionalVisual: HTMLDivElement | null,
  } {
    return {
      layoutProperties: {},
      additionalVisual: null,
    };
  }
}
