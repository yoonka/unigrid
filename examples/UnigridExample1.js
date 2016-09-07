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
import {Unigrid} from 'src/Unigrid';
import {UnigridEmptyCell, UnigridTextCell} from 'src/UnigridCells';
import tableData from '/json/tableResp1.json!';

export class UnigridExample1 extends React.Component {
  constructor() {
    super();
    this.idCounter = () => {var counter = 0; return () => counter += 1;}
  }

  compareString(a, b) {
    const la = a.toLowerCase();
    const lb = b.toLowerCase();

    if (la < lb) return -1;
    if (la > lb) return 1;
    return 0;
  }

  compareAttributes(oAttrA, oAttrB) {
    const attrA = (typeof oAttrA === 'object') ? oAttrA.valueOf() : oAttrA;
    const attrB = (typeof oAttrB === 'object') ? oAttrB.valueOf() : oAttrB;

    const aType = typeof attrA;
    const bType = typeof attrB;

    if (aType !== bType) return 0;

    if (aType === 'string') {
      const retVal = this.compareString(attrA, attrB);
      if(retVal !== 0) return retVal;
    } else if (aType === 'number') {
      const retVal = attrA - attrB;
      if (retVal !== 0) return retVal;
    }
    return 0;
  }

  compareObjects(a, b, attrs) {
    for (let i = 0; i < attrs.length; i++) {
      const retVal = this.compareAttributes(a[attrs[i]], b[attrs[i]]);
      if (retVal === 0) {
        continue;
      } else {
        return retVal;
      }
    }
    return 0;
  }

  topSorter(a, b) {
    return this.compareObjects(a, b, ['agent', 'date', 'street', 'name', 'number']);
  }

  subSorter(a, b) {
    return this.compareObjects(a, b, ['name', 'number']);
  }

  addIds(data, property) {
    for (let i = 0; i < data.length; i++) {
      data[i].id = this.idCounter();
      if (data[i].hasOwnProperty(property)) {
        this.addIds(data[i][property], property);
      }
    }
  }

  handleClick() {
    console.log(this.props.item);
  }

  showFun() {
    return this.item.hCategory;
  }

  showFun2() {
    return 'testValue';
  }

  render() {
    const props = {
      data: tableData,
      table: {
        className: 'unigrid-main-class',
        show: [
          {
            section: 'header',
            className: 'unigrid-header',
            show: [
              {
                cells: [
                  {show: 'hAgent', using: UnigridTextCell},
                  'hDate',
                  'hStreet',
                  {show: 'hName', as: 'string', className: 'name-header-cell'},
                  'hNumber'
                ], rowAs: 'header'}
            ]
          },
          {
            select: 'all',
            show: [
              {
                section: 'body',
                className: 'unigrid-segment',
                show: [
                  {
                    condition: {ifDoes: 'exist', property: 'list'},
                    fromProperty: 'list',
                    select: 0,
                    show: [
                      {
                        cells: [
                          'hCategory',
                          {as: 'empty', colSpan: 1},
                          {show: this.showFun},
                          this.showFun2,
                          'hNumber'],
                        rowAs: 'header'
                      }
                    ]
                  },
                  {
                    condition: {ifDoes: 'exist', property: 'list'},
                    fromProperty: 'list',
                    show: [
                      {
                        cells: [
                          'hCategory',
                          {as: 'empty', colSpan: 1},
                          {show: this.showFun},
                          this.showFun2,
                          'hNumber'],
                        rowAs: 'header'
                      }
                    ]
                  },
                  {
                    className: 'some-row-class',
                    cells: ['agent', 'date', 'street', 'name',
                            {show: 'number',
                             as: 'string',
                             className: 'number-cell',
                             onClick: this.handleClick,
                             bindToCell: ['onClick']}]
                  },
                  {
                    condition: {ifDoes: 'exist', property: 'list'},
                    fromProperty: 'list',
                    select: 'all',
                    show: [
                      {
                        cells: [{as: 'empty', colSpan: 3}, 'name', 'number'],
                        mixIn: {onClick: this.handleClick, bindToCell: 'onClick'}
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            section: 'footer',
            className: 'unigrid-footer',
            show: [
              {
                select: 0,
                show: [
                  {cells: [null, null, null, 'fSum', 'fTotal']},
                  {cells: [null, null, null, 'sum', 'total']}
                ]
              }
            ]
          }
        ]
      },
      preprocess: {
        sort: this.topSorter
      },
      sorters: [this.topSorter, {fromProperty: 'list', use: this.subSorter}],
      cellTypes: {
        empty: UnigridEmptyCell,
        string: UnigridTextCell
      }
    };

    this.addIds(props.data, 'list');

    return (<Unigrid {...props} />);
  }
}
