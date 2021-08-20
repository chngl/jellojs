# jellojs
> Create engaging and interactive data stories with jellojs!

![example](https://dl.airtable.com/.attachmentThumbnails/ed67b7e9d0bfb40f6365e13ad46f34c4/8a02ef07)


Each circle in the visualization represents a data point. See a [live demo](https://www.liuchang.dev/cloud50).

# How to Use
install jellojs
```
npm install @chngl/jellojs
# or
yarn add @chngl/jellojs
```
use it in your application
```
import { useEffect, useRef, useState } from 'react';
import Jello from '@chngl/jellojs

function App({data}) {
  const canvasRef = useRef(null);
  let jelloRef = useRef(null);

  useEffect(() => {
    // initialize a Jello object
    const jello = new Jello(canvasRef.current, data, {});
    // and render
    jello.setDisplayImageBy('logo').render();
    jelloRef.current = jello;
  }, []);

  return (
    <div>
      <div ref={canvasRef} style={{width: 900, height: 700}} />
      </div>
      <button onClick={() => {
        jelloRef.current.setClusterBy('industry').render();
      }}>
        cluster by industry
      </button>
    </div>
  );
}

export default App;
```
# Data Format
```
// data passed to Jello is a list of objects with a required id field and some other properties 
// see the example:
[
  {
    id: 'recsvS4fzgihwjxw5',
    funding: 1099,
    company: 'ServiceTitan',
    headquarter: 'South California',
    employees: 1600,
    year_founded: 2012,
    years_since_founded: 9,
    years_since_founded_category: '5 to 10 years',
    valuation: 9.5,
    industry: 'Internet software & services',
    sub_industry: 'Contractor software',
    logo: 'https://dl.airtable.com/.attachments/733b263af4e572f9515cdf024e1dcec6/820b1151/pngkey.com-titans-logo-png-1943963.png'
  },
  {
    id: 'rectPxkKSTdvRS6Sc',
    funding: 379,
    company: 'Guild Education',
    headquarter: 'Other',
    employees: 1000,
    year_founded: 2015,
    years_since_founded: 6,
    years_since_founded_category: '5 to 10 years',
    valuation: 3.75,
    industry: 'Internet software & services',
    sub_industry: 'Education platform',
    logo: 'https://dl.airtable.com/.attachments/fe6df6c4925cea7e3256a8693322dc8e/eb2ec9cf/Gbi5ki-_.jpeg'
  },
  {
    id: 'recu8xRYrRjVehsPR',
    funding: 1,
    company: 'Zapier',
    headquarter: 'San Francisco Bay Area, California',
    employees: 500,
    year_founded: 2011,
    years_since_founded: 10,
    years_since_founded_category: '5 to 10 years',
    valuation: 4,
    industry: 'Internet software & services',
    sub_industry: 'Workflow automation',
    logo: 'https://dl.airtable.com/.attachments/21fd529d7106a88c34acc6e38a11ea0f/02b50013/zapier-logo-png-transparent.png'
  },
  ...
]
```

# Available Operations

use setColorBy to display the circles in different colors based on the dimension
```
jello.setColorBy('industry').render();
```
etDisplayImageBy('logo').render();
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
use setDisplayImageBy to display an image on each circle, when this is set, setColorBy will be no effect
```
  jello.s

# Example Story Built with Jellojs
- [Forbes Top 50 Private Companies](https://www.liuchang.dev/cloud50)
- [repo for the above example](https://github.com/chngl/me/blob/main/pages/cloud50.js)

![example](https://dl.airtable.com/.attachmentThumbnails/ed67b7e9d0bfb40f6365e13ad46f34c4/8a02ef07)
