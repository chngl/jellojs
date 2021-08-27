export interface ObjectWithID {
  id: string;
  [key: string]: number | string,
}

export type SortSetting = {
  dim: string,
  order: 'asc' | 'desc',
}

export type PlotSetting<T> = {
  x: SortSetting,
  y: SortSetting,
  getCircleSize?: (data: T) => number,
}

export type GroupBySetting = {
  dim: string,
  agg: 'avg' | 'count' | 'sum' | 'median',
  sortBy: 'dim' | 'agg',
  sortOrder: 'asc' | 'desc',
};

export type Filters = {
  [key: string]: Array<string | number>,
};

export type LayoutType = 'default' | 'cluster' | 'sort' | 'group by' | 'plot';

export type Options<T> = {
  layout?: LayoutType | null,
  labelByDim?: string | null,
  displayImageByDim?: string | null,
  colorByDim?: string | null,
  sizeByDim?: string | null,
  clusterByDim?: string | null,
  sortSetting?: SortSetting | null,
  plotSetting?: PlotSetting<T> | null,
  filters?: Filters | null,
  groupBySetting?: GroupBySetting | null,
  onClick?: (event: MouseEvent, data: T) => void,
  onMouseover?: (event: MouseEvent, data: T) => void,
  onMouseout?: (event: MouseEvent, data: T) => void,
  onCanvasClick?: (event: MouseEvent) => void,
};

export type LayoutProperty = {
  x: number,
  y: number,
  r: number,
  display: boolean,
};

export type CircleProperty<T> = {
  color: string,
  imgURL: string | null,
  label: string | null,
  _data: T,
} & LayoutProperty;
