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
    {
      section: "header",
      show: [
        {
          select: 0,
          show: [
            {
              cells: [
                {property: "hAgent", as: "text"},
                "hDate",
                "hStreet",
                "hName",
                "hNumber"
              ], as: "header"}
          ]
        }
      ],
    },
    {
      select: "all",
      show: [
        {
          section: "body",
          show: [
            {
              condition: {ifDoes: "exist", property: "list"},
              from: "list",
              select: 0,
              show: [
                {
                  cells: ["hCategory", {colspan: 4}],
                  as: "header"
                }
              ]
            },
            {
              cells: ["agent", "date", "street", "name", "number"]
            },
            {
              condition: {ifDoes: "exist", property: "list"},
              from: "list",
              select: "all",
              show: [
                {cells: [{colspan: 3}, "name", "number"]}
              ]
            }
          ]
        }
      ]
    },
    {
      section: "footer",
      show: [
        {
          select: 0,
          show: [
            {cells: [null, null, null, "fSum", "fTotal"]},
            {cells: [null, null, null, "sum", "total"]}
          ]
        }
      ]
    }
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
