import React from 'react';
import ReactDOM from 'react-dom';
import {Unigrid} from 'src/Unigrid.js';

let container = document.getElementById('container');

setInterval(function() {
  ReactDOM.render(React.createElement(Unigrid, {date: new Date()}), container);
}, 500);
