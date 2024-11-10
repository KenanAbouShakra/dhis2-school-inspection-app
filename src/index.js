import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';
import { D2Shim } from '@dhis2/app-runtime-adapter-d2';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <D2Shim
      d2Config={{
        baseUrl: "https://research.im.dhis2.org/in5320g19",
        headers: { Authorization: "Basic " + btoa("in5320:P1@tform") },
      }}
    >
      {({ d2 }) => (
        <Router>
          <App d2={d2} />
        </Router>
      )}
    </D2Shim>
  </React.StrictMode>
);

reportWebVitals();
