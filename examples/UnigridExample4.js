/*
Copyright (c) 2018, Grzegorz Junka
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
import tableData from './json/tableResp1.json!';
import {
  Unigrid,
  getSorter,
  sort,
  isDefined
} from 'src/index';

export class UnigridExample4 extends React.Component {
  clickHandler(field) {
    return () => sort(this.unigrid, field);
  }

  render() {
    const ucFormatter = (attr) =>
          (props) => props.item[attr].toUpperCase();

    const columnToFields = (column) => {
      if (column === 'name') {
        return [ucFormatter('name')];
      }
      return column === 'number' ? [column] : ['name'];
    }

    const props = {
      data: tableData,
      box: {column: 'agent', order: 'asc'},
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
            process: getSorter(),
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
                    cells: ['agent', 'date', 'street', ucFormatter('name'),
                            {show: 'number',
                             as: 'string',
                             className: 'number-cell'}]
                  },
                  {
                    condition: {ifDoes: 'exist', property: 'list'},
                    fromProperty: 'list',
                    process: getSorter(columnToFields),
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

    return (
      <div>
        <p>Example 4 : Sortable Multitable (no JSX)</p>
        <Unigrid {...props} ref={(ref) => {this.unigrid = ref;}} />
      </div>
    );
  }
}
