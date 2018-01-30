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
  UnigridEmptyCell,
  UnigridTextCell,
  isDefined,
  idMaker
} from 'src/index';

export class UnigridExample1 extends React.Component {
  handleClick() {
    console.log(this.props.item);
  }

  showFun(props) {
    return props.item.hCategory;
  }

  showFun2() {
    return 'testValue';
  }

  render() {
    const idCounter = idMaker();
    const mkKey = () => idCounter.next().value;

    const props = {
      data: tableData,
      table: {
        className: 'unigrid-main-class',
        $do: [
          {
            section: 'header',
            className: 'unigrid-header',
            $do: [
              {
                cells: [
                  {show: 'hAgent', as: UnigridTextCell},
                  'hDate',
                  'hStreet',
                  {show: 'hName', as: 'string', className: 'name-header-cell'},
                  'hNumber'
                ],
                rowAs: 'header'
              }
            ]
          },
          {
            select: 'all',
            $do: [
              {
                section: 'body',
                className: 'unigrid-segment',
                $do: [
                  {
                    condition: {ifDoes: 'exist', property: 'list'},
                    fromProperty: 'list',
                    select: 0,
                    $do: [
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
                    $do: [
                      {
                        cells: [
                          {cell: 'category2'},
                          {as: 'empty', colSpan: 3},
                          'hNumber'],
                        rowAs: 'header'
                      }
                    ]
                  },
                  {
                    className: 'some-row-class',
                    cells: [
                      'agent', 'date', 'street', 'name',
                      {show: 'number',
                       as: 'string',
                       className: 'number-cell',
                       onClick: this.handleClick,
                       bindToCell: 'onClick'
                      }]
                  },
                  {
                    condition: {ifDoes: 'exist', property: 'list'},
                    fromProperty: 'list',
                    select: 'all',
                    $do: [
                      {
                        cells: [{as: 'empty', colSpan: 3}, 'name', 'number'],
                        mixIn: {
                          onClick: this.handleClick,
                          bindToCell: 'onClick'
                        }
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
            $do: [
              {
                select: 0,
                $do: [
                  {cells: [null, null, null, 'fSum', 'fTotal']},
                  {cells: [null, null, null, 'sum', 'total']}
                ]
              }
            ]
          }
        ]
      },
      cellTypes: {
        empty: UnigridEmptyCell,
        string: UnigridTextCell
      }
    };

    return (
      <div>
        <p>Example 1 : Multitable (no JSX)</p>
        <Unigrid {...props} />
      </div>
    );
  }
}
