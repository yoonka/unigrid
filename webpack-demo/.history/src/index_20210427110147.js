import _ from 'lodash';
// import General from '../components/General';
import React from 'react';
import ReactDOM from 'react-dom';


function component() {
    const element = document.createElement('div');

    //Lodash, now imported by this script
    element.innerHTML = _.join(['sadasdasd']);

    return element;
}

document.body.appendChild(component());