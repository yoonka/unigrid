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

  addIds(data, property) {
    for (let i = 0; i < data.length; i++) {
      data[i].id = this.idCounter();
      if (data[i].hasOwnProperty(property)) {
        this.addIds(data[i][property], property);
      }
    }
  }

  clickHandler(nField) {
    return () => this.unigrid.sortByField(nField);
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
            process: UnigridSortable.getFieldSorter(),
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
                    process: UnigridSortable.getAllowedFieldSorter(['name', 'number'], 'name', 'asc'),
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