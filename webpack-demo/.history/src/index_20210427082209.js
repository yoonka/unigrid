import _ from 'lodash';
import


function component() {
    const element = document.createElement('div');

    //Lodash, now imported by this script
    element.innerHTML = _.join(['Hello', 'websdasdpack']);

    return element;
}

document.body.appendChild(component());