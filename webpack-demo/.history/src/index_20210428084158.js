import _ from 'lodash';




function component() {
  const element = document.createElement('div');

  //Lodash, now imported by this script
  element.innerHTML = "<div>cos </div>";

  return element;
}

document.body.appendChild(component());

// import React from 'react'
// // import General from '../components/General'

// function Welcome(props) {
//     return <h1>Cześć, {props.name}</h1>;
//   }

//   const element = <Welcome name="Sara" />;
//   ReactDOM.render(
//     element,
//     document.getElementById('root')
//   );