import _ from 'lodash';
// import General from '../components/General';
import React from 'react';
import ReactDOM from 'react-dom';

const title = 'React with Webpack and Babel';

ReactDOM.render(
  <div>{title}</div>,
  document.getElementById('app')
);

// function component() {
//     const element = document.createElement('div');

//     //Lodash, now imported by this script
//     element.innerHTML = _.join(<general />);

//     return element;
// }

// document.body.appendChild(component());