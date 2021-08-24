interface ObjectWithID {
    id: string;
    [key: string]: number | string;
}
declare type SortSetting = {
    dim: string;
    order: 'asc' | 'desc';
};
declare type Options<T> = {
    labelByDim?: string | null;
    displayImageByDim?: string | null;
    colorByDim?: string | null;
    sizeByDim?: string | null;
    clusterByDim?: string | null;
    sortSetting?: SortSetting | null;
    filters?: Filters | null;
    onClick?: (event: Event, data: T) => void;
    onMouseover?: (event: Event, data: T) => void;
    onCanvasClick?: (event: Event) => {};
};
declare type Filters = {
    [key: string]: Array<string | number>;
};
declare type CommonProperty = {
    x: number;
    y: number;
};
declare type CircleProperty<T> = {
    r: number;
    color: string;
    imgURL: string | null;
    label: string | null;
    display: boolean;
    _data: T;
} & CommonProperty;
declare type ClusterProperty = {
    r: number;
} & CommonProperty;
declare type SortLabelProperty = {
    width: number;
    label: string;
} & CommonProperty;
declare class Jello<T extends ObjectWithID> {
    width: number;
    height: number;
    data: Array<T>;
    options: Options<T>;
    container: HTMLDivElement;
    circleDiv: HTMLDivElement;
    clusterDiv: HTMLDivElement;
    sortLabelDiv: HTMLDivElement;
    circles: {
        [key: string]: HTMLDivElement;
    };
    cirlcesProperty: {
        [key: string]: CircleProperty<T>;
    };
    clustersProperty: {
        [key: string]: ClusterProperty;
    };
    sortLabelProperty: {
        [key: string]: SortLabelProperty;
    };
    /**
     *
     * @param {*} container the containing div
     * @param {*} data the list of entities to visualize in the format of {id, attribute_A, attribute_B, ...}
     * @param {*} options available settings {clusterByDim, colorByDim, sortSetting...}
     */
    constructor(container: HTMLDivElement, data: Array<T>, options: Options<T>);
    render(): this;
    updateWidthHeight(): this;
    labelBy(dim: string | null): this;
    colorBy(dim: string | null): this;
    sizeBy(dim: string | null): this;
    clusterBy(dim: string | null): this;
    /**
     *
     * @param {*} filters  {dim: 'xxx', values: ['xxx', ...]}
     * @returns
     */
    filterBy(filters: Filters): this;
    /**
     *
     * @param {*} setting {dim: 'valuation', order: 'asc' | 'desc'}
     * @returns
     */
    sortBy(setting: SortSetting | null): this;
    /**
     *
     * @param {*} dim
     * When a displayImageBy dimension is set, colorBy is not going to work
     * @returns
     */
    displayImageBy(dim: string | null): this;
    /**
     * when render the cluster layout, we need to render the cluster circle and label
     */
    _renderCluster(): void;
    /**
     * when render the sort view, we need to render the label for each circle
     */
    _renderSortLabels(): void;
    /**
     * to render all the circles with animation
     */
    _renderCirles(): void;
    _sanitizeDimension(dim: string | null): string | null;
    _createCircle(data: any, x: number, y: number, r: number, color?: string | null, imgURL?: string | null, label?: string | null): HTMLDivElement;
    _createText(x: number, y: number, width: number, height: number, txt: string, z?: number): HTMLDivElement;
    /**
     * This method calculate the x, y, r, color etc properties for the circles/clusters/labels based on the settings
     * @returns
     */
    _calculateProperties(): void;
}
export default Jello;
