/*
Copyright (c) 2016, Grzegorz Junka
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

import React from 'react';
import ReactDOM from 'react-dom';
import {Unigrid} from 'src/Unigrid';
import {UnigridTextCell} from 'src/UnigridCells';
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

var counter = ( () => {var counter = 0; return () => counter += 1;} )()

var addIds = function(data, property) {
  for(let i=0; i<data.length; i++) {
    data[i].id = counter();
    if(data[i].hasOwnProperty(property)) {
      addIds(data[i][property], property);
    }
  }
}

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
                {property: "hAgent", using: UnigridTextCell},
                "hDate",
                "hStreet",
                {property: "hName", as: "text"},
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
  cellTypes: {
    text: UnigridTextCell
  },
  renderer: null
};

let container = document.getElementById('container');

function callback() {
  addIds(props.data, "list");
  ReactDOM.render(React.createElement(Unigrid, props), container);
};

props.renderer = callback;

callback();
