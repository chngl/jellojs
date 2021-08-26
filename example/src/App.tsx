import './App.css';

import { useEffect, useRef } from 'react'

import type { CompanyData } from './data'
import Jello from '@chngl/jellojs'
import data from './data'

function App() {
  const canvasRef = useRef<HTMLDivElement>(null);
  let jelloRef = useRef<Jello<CompanyData> | null>(null);
  useEffect(() => {
    if (canvasRef.current !== null) {
      const jello = new Jello<CompanyData>(
        canvasRef.current,
        data,
        {
          labelByDim: 'company',
          onClick: (event: any, data: CompanyData) => {},
          onMouseover: (event: any, data: CompanyData) => {},
          onMouseout: (event: any, data: CompanyData) => {}
        }
      );
      jello.render();
      jelloRef.current = jello;
    }
  }, []);
  return (
    <div className="App">
      <div ref={canvasRef} style={{ width: 900, height: 700 }} />
      <button onClick={() => {
        jelloRef.current && jelloRef.current.displayImageBy('logo').render();
      }}>
        display by logo
      </button>
      <button onClick={() => {
        jelloRef.current && jelloRef.current.labelBy('company').render();
      }}>
        display label by company
      </button>
      <button onClick={() => {
        jelloRef.current && jelloRef.current.labelBy(null).render();
      }}>
        hide label
      </button>
      <button onClick={() => {
        jelloRef.current && jelloRef.current.sizeBy('employees').render();
      }}>
        size by employees
      </button>
      <button onClick={() => {
        jelloRef.current && jelloRef.current.colorBy('funding').render();
      }}>
        color by funding
      </button>
      <button onClick={() => {
        jelloRef.current && jelloRef.current.clusterBy('headquarter').render();
      }}>
        cluster by location
      </button>
      <button onClick={() => {
        jelloRef.current && jelloRef.current.clusterBy('years_since_founded_category').render();
      }}>
        cluster by years since founded
      </button>
      <button onClick={() => {
        jelloRef.current && jelloRef.current.filterBy({ 'headquarter': ['San Francisco Bay Area, California'] }).render();
      }}>
        filter by headquarter
      </button>
      <button onClick={() => {
        jelloRef.current && jelloRef.current.filterBy({}).render();
      }}>
        clear filter
      </button>
      <button onClick={() => {
        jelloRef.current && jelloRef.current.sortBy({ dim: 'employees', order: 'asc' }).render();
      }}>
        sort by employee count
      </button>
    </div>
  );
}

export default App;
