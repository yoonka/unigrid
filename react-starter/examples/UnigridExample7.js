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
import tableData from './json/tableResp3.json!';
import {
  Unigrid,
  getSorter,
  sort
} from 'src/index';

export class UnigridExample7 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {row: false, col: false};
  }

  clickHandler(field) {
    return () => sort(this.unigrid, field);
  }

  render() {
    const chStyleY = (cfg, item, box) => {
      this.isColorB = !this.isColorB;
      return {style: {backgroundColor: '#ffcc00'}}
    };

    const chStyleG = (cfg, item, box) => {
      this.isColorB = !this.isColorB;
      return {style: {backgroundColor: '#55ff55'}}
    };

    const chStyleR = (cfg, item, box) => {
      const isColorR = this.isColorR ? false : true;
      this.isColorR = isColorR;
      return isColorR ? {style: {backgroundColor: '#ff5555'}} : undefined;
    };

    const chStyleB = (cfg, item, box) => {
      const isColorB = this.isColorB ? false : true;
      this.isColorB = isColorB;
      return isColorB ? {style: {backgroundColor: '#4455ff'}} : undefined;
    };

    const table = {
      className: 'unigrid',
      treeAmend: {cells: chStyleR, cell: chStyleB},
      $do: [
        {
          section: 'header', className: 'unigrid-header',
          cells: [
            {cell: 'AAA', onClick: this.clickHandler('a')},
            {cell: 'BBB', onClick: this.clickHandler('b')},
            {cell: 'CCC', onClick: this.clickHandler('c')},
            {cell: 'DDD', onClick: this.clickHandler('d')},
            {cell: 'EEE', onClick: this.clickHandler('e')}
          ],
          rowAs: 'header'
        },
        {
          section: 'body',
          className: 'unigrid-body',
          $do: [
            {
              process: getSorter(),
              select: 'all',
              amend: chStyleY,
              cells: ['a', 'b', 'c', 'd', 'e'],
              $do: [
                {
                  fromProperty: 'l2',
                  process: getSorter(),
                  select: 'all',
                  cells: ['a', {amend: chStyleY, show: 'b'}, 'c', 'd', 'e'],
                  $do: [
                    {
                      fromProperty: 'l3',
                      process: getSorter(),
                      select: 'all',
                      cells: ['a', 'b', 'c', {show: 'd', amend: {cell: chStyleG}}, 'e'],
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };

    const box = {column: 'A'};

    return (
      <div>
        <p>Example 7 : Stripped grid (no JSX)</p>
        <Unigrid data={tableData} table={table} box={box} ref={(ref) => {this.unigrid = ref;}} />
      </div>
    );
  }
}
