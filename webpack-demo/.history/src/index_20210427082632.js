import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import general from '../components/general';

ReactDOM.render(
    <React.StrictMode>
      <general />
    </React.StrictMode>,
    document.getElementById('root')
  );

function component() {
    const element = document.createElement('div');

    //Lodash, now imported by this script
    element.innerHTML = _.join(<general />);

    return element;
}

document.body.appendChild(component());