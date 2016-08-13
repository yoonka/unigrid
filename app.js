import React from 'react';
import ReactDOM from 'react-dom';
import {Unigrid} from 'src/Unigrid.js';
import tableData from './json/tableResp1.json!';

function compareString(a, b) {
  let la = a.toLowerCase();
  let lb = b.toLowerCase();

  if(la < lb) return -1;
  if(la > lb) return 1;
  return 0;
};

function compareAttributes(attrA, attrB) {
  if(typeof attrA === "object") attrA = attrA.valueOf();
  if(typeof attrB === "object") attrB = attrB.valueOf();

  let aType = typeof attrA;
  let bType = typeof attrB;

  if(aType !== bType) return 0;

  if(aType === "string") {
    if((retVal = compareString(attrA, attrB)) !== 0) return retVal;
  } else if(aType === "number") {
    if((retVal = attrA - attrB) !== 0) return retVal;
  }
  return 0;
};

function compareObjects(a, b, attrs) {
  for(let i=0, retVal=null; i<attrs.length; i++) {
    if((retVal = compareAttributes(a[attrs[i]], b[attrs[i]])) === 0)
      continue;
    else
      return retVal;
  }
  return 0;
};

var topSorter = function(a, b) {
  return compareObjects(a, b, ["agent", "date", "street", "name", "number"]);
};

var subSorter = function(a, b) {
  return compareObjects(a, b, ["name", "number"]);
};

var props = {
  data: tableData,
  table: [
    {select: 0,
     show: [{cell: "text", property: "hAgent"}, "hDate", "hStreet", "hName", "hNumber"],
     as: "header"},
    {
      select: "all",
      rows: [
        {from: "list", select: 0, show: ["hCategory", {colspan: 4}]},
        {show: ["agent", "date", "street", "name", "number"]},
        {from: "list", select: "all", show: [{colspan: 3}, "name", "number"]}
      ],
      as: "section"
    },
    {select: 0,
     rows: [
       {show: [null, null, null, "fSum", "fTotal"]},
       {show: [null, null, null, "sum", "total"]}
     ],
     as: "footer"}
  ],
  sorters: [topSorter, {from: "list", use: subSorter}],
  renderer: null
};

let container = document.getElementById('container');

function callback() {
  ReactDOM.render(React.createElement(Unigrid, props), container);
};

props.renderer = callback;

callback();
