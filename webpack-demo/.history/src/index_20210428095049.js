
import _ from 'lodash';

function component() {
  const element = document.createElement('div');

  //Lodash, now imported by this script
  element.innerHTML = "<div></div>";

  return element;
}

document.body.appendChild(component());

// import React from "react"
// import ReactDom from "react-dom"
// import App from "./App"


// ReactDom.render(<App />, document.getElementById('app'))