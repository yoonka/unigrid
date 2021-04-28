import _ from 'lodash';
import general from '../components/general';



function component() {
    const element = document.createElement('div');

    //Lodash, now imported by this script
    element.innerHTML = _.join([<general]);

    return element;
}

document.body.appendChild(component());