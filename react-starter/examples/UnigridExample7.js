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
// import tableData from './json/tableResp3.json';
import {
  Unigrid,
  getSorter,
  sort
} from '../unigrid';

const tableData = [{ a: "A.1", b: "B.1", c: "C.1", d: "D.1", e: "E.1", "l2": [{ a: "A.1.1", b: "B.1.1", c: "C.1.1", d: "D.1.1", e: "E.1.1", "l3": [{ a: "A.1.1.1", b: "B.1.1.1", c: "C.1.1.1", d: "D.1.1.1", e: "E.1.1.1" }, { a: "A.1.1.2", b: "B.1.1.2", c: "C.1.1.2", d: "D.1.1.2", e: "E.1.1.2" }, { a: "A.1.1.3", b: "B.1.1.3", c: "C.1.1.3", d: "D.1.1.3", e: "E.1.1.3" }] }, { a: "A.1.2", b: "B.1.2", c: "C.1.2", d: "D.1.2", e: "E.1.2", "l3": [{ a: "A.1.2.1", b: "B.1.2.1", c: "C.1.2.1", d: "D.1.2.1", e: "E.1.2.1" }, { a: "A.1.2.2", b: "B.1.2.2", c: "C.1.2.2", d: "D.1.2.2", e: "E.1.2.2" }, { a: "A.1.2.3", b: "B.1.2.3", c: "C.1.2.3", d: "D.1.2.3", e: "E.1.2.3" }] }, { a: "A.1.3", b: "B.1.3", c: "C.1.3", d: "D.1.3", e: "E.1.3", "l3": [{ a: "A.1.3.1", b: "B.1.3.1", c: "C.1.3.1", d: "D.1.3.1", e: "E.1.3.1" }, { a: "A.1.3.2", b: "B.1.3.2", c: "C.1.3.2", d: "D.1.3.2", e: "E.1.3.2" }, { a: "A.1.3.3", b: "B.1.3.3", c: "C.1.3.3", d: "D.1.3.3", e: "E.1.3.3" }] }] }, { a: "A.2", b: "B.2", c: "C.2", d: "D.2", e: "E.2", "l2": [{ a: "A.2.1", b: "B.2.1", c: "C.2.1", d: "D.2.1", e: "E.2.1", "l3": [{ a: "A.2.1.1", b: "B.2.1.1", c: "C.2.1.1", d: "D.2.1.1", e: "E.2.1.1" }, { a: "A.2.1.2", b: "B.2.1.2", c: "C.2.1.2", d: "D.2.1.2", e: "E.2.1.2" }, { a: "A.2.1.3", b: "B.2.1.3", c: "C.2.1.3", d: "D.2.1.3", e: "E.2.1.3" }] }, { a: "A.2.2", b: "B.2.2", c: "C.2.2", d: "D.2.2", e: "E.2.2", "l3": [{ a: "A.2.2.1", b: "B.2.2.1", c: "C.2.2.1", d: "D.2.2.1", e: "E.2.2.1" }, { a: "A.2.2.2", b: "B.2.2.2", c: "C.2.2.2", d: "D.2.2.2", e: "E.2.2.2" }, { a: "A.2.2.3", b: "B.2.2.3", c: "C.2.2.3", d: "D.2.2.3", e: "E.2.2.3" }] }, { a: "A.2.3", b: "B.2.3", c: "C.2.3", d: "D.2.3", e: "E.2.3", "l3": [{ a: "A.2.3.1", b: "B.2.3.1", c: "C.2.3.1", d: "D.2.3.1", e: "E.2.3.1" }, { a: "A.2.3.2", b: "B.2.3.2", c: "C.2.3.2", d: "D.2.3.2", e: "E.2.3.2" }, { a: "A.2.3.3", b: "B.2.3.3", c: "C.2.3.3", d: "D.2.3.3", e: "E.2.3.3" }] }] }, { a: "A.3", b: "B.3", c: "C.3", d: "D.3", e: "E.3", "l2": [{ a: "A.3.1", b: "B.3.1", c: "C.3.1", d: "D.3.1", e: "E.3.1", "l3": [{ a: "A.3.1.1", b: "B.3.1.1", c: "C.3.1.1", d: "D.3.1.1", e: "E.3.1.1" }, { a: "A.3.1.2", b: "B.3.1.2", c: "C.3.1.2", d: "D.3.1.2", e: "E.3.1.2" }, { a: "A.3.1.3", b: "B.3.1.3", c: "C.3.1.3", d: "D.3.1.3", e: "E.3.1.3" }] }, { a: "A.3.2", b: "B.3.2", c: "C.3.2", d: "D.3.2", e: "E.3.2", "l3": [{ a: "A.3.2.1", b: "B.3.2.1", c: "C.3.2.1", d: "D.3.2.1", e: "E.3.2.1" }, { a: "A.3.2.2", b: "B.3.2.2", c: "C.3.2.2", d: "D.3.2.2", e: "E.3.2.2" }, { a: "A.3.2.3", b: "B.3.2.3", c: "C.3.2.3", d: "D.3.2.3", e: "E.3.2.3" }] }, { a: "A.3.3", b: "B.3.3", c: "C.3.3", d: "D.3.3", e: "E.3.3", "l3": [{ a: "A.3.3.1", b: "B.3.3.1", c: "C.3.3.1", d: "D.3.3.1", e: "E.3.3.1" }, { a: "A.3.3.2", b: "B.3.3.2", c: "C.3.3.2", d: "D.3.3.2", e: "E.3.3.2" }, { a: "A.3.3.3", b: "B.3.3.3", c: "C.3.3.3", d: "D.3.3.3", e: "E.3.3.3" }] }] }]

export class UnigridExample7 extends React.Component {
  constructor(props) {
    super(props);
    this.state = { row: false, col: false };
  }

  clickHandler(field) {
    return () => sort(this.unigrid, field);
  }

  render() {
    const tableData = [{ a: "A.1", b: "B.1", c: "C.1", d: "D.1", e: "E.1", "l2": [{ a: "A.1.1", b: "B.1.1", c: "C.1.1", d: "D.1.1", e: "E.1.1", "l3": [{ a: "A.1.1.1", b: "B.1.1.1", c: "C.1.1.1", d: "D.1.1.1", e: "E.1.1.1" }, { a: "A.1.1.2", b: "B.1.1.2", c: "C.1.1.2", d: "D.1.1.2", e: "E.1.1.2" }, { a: "A.1.1.3", b: "B.1.1.3", c: "C.1.1.3", d: "D.1.1.3", e: "E.1.1.3" }] }, { a: "A.1.2", b: "B.1.2", c: "C.1.2", d: "D.1.2", e: "E.1.2", "l3": [{ a: "A.1.2.1", b: "B.1.2.1", c: "C.1.2.1", d: "D.1.2.1", e: "E.1.2.1" }, { a: "A.1.2.2", b: "B.1.2.2", c: "C.1.2.2", d: "D.1.2.2", e: "E.1.2.2" }, { a: "A.1.2.3", b: "B.1.2.3", c: "C.1.2.3", d: "D.1.2.3", e: "E.1.2.3" }] }, { a: "A.1.3", b: "B.1.3", c: "C.1.3", d: "D.1.3", e: "E.1.3", "l3": [{ a: "A.1.3.1", b: "B.1.3.1", c: "C.1.3.1", d: "D.1.3.1", e: "E.1.3.1" }, { a: "A.1.3.2", b: "B.1.3.2", c: "C.1.3.2", d: "D.1.3.2", e: "E.1.3.2" }, { a: "A.1.3.3", b: "B.1.3.3", c: "C.1.3.3", d: "D.1.3.3", e: "E.1.3.3" }] }] }, { a: "A.2", b: "B.2", c: "C.2", d: "D.2", e: "E.2", "l2": [{ a: "A.2.1", b: "B.2.1", c: "C.2.1", d: "D.2.1", e: "E.2.1", "l3": [{ a: "A.2.1.1", b: "B.2.1.1", c: "C.2.1.1", d: "D.2.1.1", e: "E.2.1.1" }, { a: "A.2.1.2", b: "B.2.1.2", c: "C.2.1.2", d: "D.2.1.2", e: "E.2.1.2" }, { a: "A.2.1.3", b: "B.2.1.3", c: "C.2.1.3", d: "D.2.1.3", e: "E.2.1.3" }] }, { a: "A.2.2", b: "B.2.2", c: "C.2.2", d: "D.2.2", e: "E.2.2", "l3": [{ a: "A.2.2.1", b: "B.2.2.1", c: "C.2.2.1", d: "D.2.2.1", e: "E.2.2.1" }, { a: "A.2.2.2", b: "B.2.2.2", c: "C.2.2.2", d: "D.2.2.2", e: "E.2.2.2" }, { a: "A.2.2.3", b: "B.2.2.3", c: "C.2.2.3", d: "D.2.2.3", e: "E.2.2.3" }] }, { a: "A.2.3", b: "B.2.3", c: "C.2.3", d: "D.2.3", e: "E.2.3", "l3": [{ a: "A.2.3.1", b: "B.2.3.1", c: "C.2.3.1", d: "D.2.3.1", e: "E.2.3.1" }, { a: "A.2.3.2", b: "B.2.3.2", c: "C.2.3.2", d: "D.2.3.2", e: "E.2.3.2" }, { a: "A.2.3.3", b: "B.2.3.3", c: "C.2.3.3", d: "D.2.3.3", e: "E.2.3.3" }] }] }, { a: "A.3", b: "B.3", c: "C.3", d: "D.3", e: "E.3", "l2": [{ a: "A.3.1", b: "B.3.1", c: "C.3.1", d: "D.3.1", e: "E.3.1", "l3": [{ a: "A.3.1.1", b: "B.3.1.1", c: "C.3.1.1", d: "D.3.1.1", e: "E.3.1.1" }, { a: "A.3.1.2", b: "B.3.1.2", c: "C.3.1.2", d: "D.3.1.2", e: "E.3.1.2" }, { a: "A.3.1.3", b: "B.3.1.3", c: "C.3.1.3", d: "D.3.1.3", e: "E.3.1.3" }] }, { a: "A.3.2", b: "B.3.2", c: "C.3.2", d: "D.3.2", e: "E.3.2", "l3": [{ a: "A.3.2.1", b: "B.3.2.1", c: "C.3.2.1", d: "D.3.2.1", e: "E.3.2.1" }, { a: "A.3.2.2", b: "B.3.2.2", c: "C.3.2.2", d: "D.3.2.2", e: "E.3.2.2" }, { a: "A.3.2.3", b: "B.3.2.3", c: "C.3.2.3", d: "D.3.2.3", e: "E.3.2.3" }] }, { a: "A.3.3", b: "B.3.3", c: "C.3.3", d: "D.3.3", e: "E.3.3", "l3": [{ a: "A.3.3.1", b: "B.3.3.1", c: "C.3.3.1", d: "D.3.3.1", e: "E.3.3.1" }, { a: "A.3.3.2", b: "B.3.3.2", c: "C.3.3.2", d: "D.3.3.2", e: "E.3.3.2" }, { a: "A.3.3.3", b: "B.3.3.3", c: "C.3.3.3", d: "D.3.3.3", e: "E.3.3.3" }] }] }];

    const chStyleY = (cfg, item, box) => {
      this.isColorB = !this.isColorB;
      return { style: { backgroundColor: '#ffcc00' } }
    };

    const chStyleG = (cfg, item, box) => {
      this.isColorB = !this.isColorB;
      return { style: { backgroundColor: '#55ff55' } }
    };

    const chStyleR = (cfg, item, box) => {
      const isColorR = this.isColorR ? false : true;
      this.isColorR = isColorR;
      return isColorR ? { style: { backgroundColor: '#ff5555' } } : undefined;
    };

    const chStyleB = (cfg, item, box) => {
      const isColorB = this.isColorB ? false : true;
      this.isColorB = isColorB;
      return isColorB ? { style: { backgroundColor: '#4455ff' } } : undefined;
    };

    const table = {
      className: 'unigrid',
      treeAmend: { cells: chStyleR, cell: chStyleB },
      $do: [
        {
          section: 'header', className: 'unigrid-header',
          cells: [
            { cell: 'AAA', onClick: this.clickHandler('a') },
            { cell: 'BBB', onClick: this.clickHandler('b') },
            { cell: 'CCC', onClick: this.clickHandler('c') },
            { cell: 'DDD', onClick: this.clickHandler('d') },
            { cell: 'EEE', onClick: this.clickHandler('e') }
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
                  cells: ['a', { amend: chStyleY, show: 'b' }, 'c', 'd', 'e'],
                  $do: [
                    {
                      fromProperty: 'l3',
                      process: getSorter(),
                      select: 'all',
                      cells: ['a', 'b', 'c', { show: 'd', amend: { cell: chStyleG } }, 'e'],
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };

    const box = { column: 'A' };

    return (
      <div>
        <p>Example 7 : Stripped grid (no JSX)</p>
        <Unigrid data={tableData} table={table} box={box} ref={(ref) => { this.unigrid = ref; }} />
      </div>
    );
  }
}
