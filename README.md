# jellojs
> Create engaging and interactive data stories with jellojs!

- Each circle in the visualization represents a data point. See a [live demo](https://www.liuchang.dev/cloud50).

# How to Use
```
   /**
   * @param {*} dom: the containing div
   * @param {*} data: the list of entities to visualize in the format of {id, attribute_A, attribute_B, ...}
   * @param {*} options: available settings {clusterBy, colorBy, sortBy...}
   */
  const jello = new Jello(dom, data, {});
  jello.setDisplayImageBy('logo')
    .setClusterBy('industry')
    .render();
```
# Available Operations
use setDisplayImageBy to display an image on each circle
```
  jello.setDisplayImageBy('logo').render();
```
use setClusterBy to display the circles in clusters
```
  jello.setClusterBy('industry').render();
```
use setSizeBy to change the size for each circle
```
  jello.setSizeBy('rank').render();
```
use setSortBy to sort the circles based on the dimension
```
  jello.setSortBy('valuation').render();
```

# Example Story Built with Jellojs
- [Forbes Top 50 Private Companies](https://www.liuchang.dev/cloud50)
- [repo for the above example](https://github.com/chngl/me/blob/main/pages/cloud50.js)

![example](https://dl.airtable.com/.attachmentThumbnails/ed67b7e9d0bfb40f6365e13ad46f34c4/8a02ef07)
