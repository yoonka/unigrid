// import _ from 'lodash';

// function component() {
//   const element = document.createElement('div');

//   //Lodash, now imported by this script
//   element.innerHTML = "<div></div>";

//   return element;
// }

// document.body.appendChild(component());

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import "./scss/main.scss"

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);