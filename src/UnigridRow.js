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
import {UnigridEmptyCell,
        UnigridTextCell,
        UnigridNumberCell} from 'src/UnigridCells';

export class UnigridRow extends React.Component {
  createCellForType(value, as) {
    switch (typeof(value)) {
    case "string": return (<UnigridTextCell value={value} as={as} />);
    case "number": return (<UnigridNumberCell value={value} as={as} />);
    }
    let err = "Error: " + JSON.stringify(value);
    return (<UnigridTextCell value={err} as={as} />);
  }

  createCell(cell, item, as) {
    if (typeof(cell) === "string") {
      if (item.hasOwnProperty(cell)) {
        return this.createCellForType(item[cell], as);
      }
      return (<UnigridTextCell value={"Error: " + cell} as={as} />);
    }
    if (cell === null) {
      return (<UnigridEmptyCell as={as} />);
    }
    if (typeof(cell) !== "object") {
      return (<UnigridTextCell value={"Error: " + cell.toString()} as={as} />);
    }
    if (cell.hasOwnProperty("colspan")) {
      return (<UnigridEmptyCell colspan={cell.colspan} as={as} />);
    }
    if (!cell.hasOwnProperty("property")) {
      let err = "Error: " + JSON.stringify(cell);
      return (<UnigridTextCell value={err} as={as} />);
    }
    if (cell.hasOwnProperty("using")) {
      let props = {value: item[cell.property], as: as};
      return React.createElement(cell.using, props);
    }
    if (cell.hasOwnProperty("as")) {
      let elem = this.props.cellTypes[cell.as];
      let props = {value: item[cell.property], as: as};
      return React.createElement(elem, props);
    }
    let err = "Error: " + JSON.stringify(cell);
    return (<UnigridTextCell value={err} as={as} />);
  }

  render() {
    let cfg = this.props.definition;
    let cells = cfg.cells || [];
    let arr = [];
    for (let i=0; i<cells.length; i++) {
      arr.push(this.createCell(cells[i], this.props.item, cfg.as));
    }
    return (<tr>{arr}</tr>);
  }
}
