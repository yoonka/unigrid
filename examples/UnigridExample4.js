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
import UnigridSortable from 'src/UnigridSortable';
import tableData from '/json/tableResp1.json!';

export class UnigridExample4 extends React.Component {
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

  compareObjects(a, b, attrs, isAsc) {
    for (let i = 0; i < attrs.length; i++) {
      const retVal = this.compareAttributes(a[attrs[i]], b[attrs[i]]);
      if (retVal === 0) {
        continue;
      } else {
        return isAsc ? retVal : -retVal;
      }
    }
    return 0;
  }

  topSorter(data, {field, type}) {
    const isAsc = type === 'asc';
    const sorter = (a, b) => this.compareObjects(a, b, [field], isAsc);
    return data.slice().sort(sorter);
  }

  subSorter(data, {field, type}) {
    let nField = field;
    let nType = type;
    if (field !== 'name' && field !== 'number') {
      nField = 'name';
      nType = 'asc';
    }
    const isAsc = nType === 'asc';
    const sorter = (a, b) => this.compareObjects(a, b, [nField], isAsc);
    return data.slice().sort(sorter);
  }

  addIds(data, property) {
    for (let i = 0; i < data.length; i++) {
      data[i].id = this.idCounter();
      if (data[i].hasOwnProperty(property)) {
        this.addIds(data[i][property], property);
      }
    }
  }

  clickHandler(nField) {
    return () => {
      const box = this.unigrid.state;
      let {field, type} = box;
      if (field === nField) {
        type = type === 'asc' ? 'desc' : 'asc';
      } else {
        field = nField;
        type = 'asc';
      }
      box.field = field;
      box.type = type;
      this.unigrid.setState(box);
    }
  }

  render() {
    const props = {
      data: tableData,
      box: {field: 'agent', type: 'asc'},
      table: {
        className: 'unigrid-main-class',
        $do: [
          {
            section: 'header',
            className: 'unigrid-header',
            cells: [
              {show: 'hAgent', onClick: this.clickHandler('agent')},
              {show: 'hDate', onClick: this.clickHandler('date')},
              {show: 'hStreet', onClick: this.clickHandler('street')},
              {show: 'hName', onClick: this.clickHandler('name')},
              {show: 'hNumber', onClick: this.clickHandler('number')}
            ],
            rowAs: 'header'
          },
          {
            process: this.topSorter.bind(this),
            select: 'all',
            $do: [
              {
                section: 'body',
                className: 'unigrid-segment',
                $do: [
                  {
                    condition: {ifDoes: 'exist', property: 'list'},
                    fromProperty: 'list',
                    cells: [
                      'hCategory',
                      {as: 'empty', colSpan: 3},
                      'hNumber'
                    ],
                    rowAs: 'header'
                  },
                  {
                    className: 'some-row-class',
                    cells: ['agent', 'date', 'street', 'name',
                            {show: 'number',
                             as: 'string',
                             className: 'number-cell'}]
                  },
                  {
                    condition: {ifDoes: 'exist', property: 'list'},
                    fromProperty: 'list',
                    process: this.subSorter.bind(this),
                    select: 'all',
                    cells: [{as: 'empty', colSpan: 3}, 'name', 'number']
                  }
                ]
              }
            ]
          },
          {
            section: 'footer',
            className: 'unigrid-footer',
            $do: [
              {cells: [null, null, null, 'fSum', 'fTotal']},
              {cells: [null, null, null, 'sum', 'total']}
            ]
          }
        ]
      }
    };

    this.addIds(props.data, 'list');

    return (
      <div>
      <p>Sortable Multitable</p>
      <UnigridSortable {...props} ref={(ref) => {this.unigrid = ref;}} />
      </div>
    );
  }
}
