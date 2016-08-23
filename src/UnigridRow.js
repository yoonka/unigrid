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

  createErrorCell(nProps, msg) {
    return (<UnigridTextCell {...nProps} cell={"Error: " + msg} />);
  }

  createCellForType(type, oProps, rowAs) {
    let {show, using, as, ...nProps} = oProps;
    Object.assign(nProps, {rowAs: rowAs});

    if (typeof(type) !== 'string') {
      return React.createElement(type, nProps);
    }

    if (this.props.hasOwnProperty('cellTypes')
        && this.props.cellTypes.hasOwnProperty(type)) {
      return React.createElement(this.props.cellTypes[type], nProps);
    }

    switch (type) {
    case 'string': return (<UnigridTextCell   {...nProps} />);
    case 'number': return (<UnigridNumberCell {...nProps} />);
    case 'empty':  return (<UnigridEmptyCell  {...nProps} />);
    }

    return this.createErrorCell(nProps, JSON.stringify(type));
  }

  getItemValue(item, property) {
    return property && item.hasOwnProperty(property) ?
      item[property] : undefined;
  }

  createCell(item, cell, rowAs) {
    if (typeof(cell) === 'string') {
      const value = this.getItemValue(item, cell);
      return value !== undefined ?
        this.createCellForType(typeof(value), {cell: value}, rowAs)
      : this.createErrorCell({rowAs: rowAs}, cell);
    }
    if (cell === null) {
      return this.createCellForType('empty', {}, rowAs);
    }
    if (typeof(cell) !== 'object') {
      return this.createErrorCell({rowAs: rowAs}, cell.toString());
    }

    const value = this.getItemValue(item, cell.show);
    if (value !== undefined) {
      Object.assign(cell, {cell: value});
    }

    if (cell.hasOwnProperty('using')) {
      return this.createCellForType(cell.using, cell, rowAs)
    }
    if (cell.hasOwnProperty('as')) {
      return this.createCellForType(cell.as, cell, rowAs);
    }

    Object.assign(cell, {rowAs: rowAs});
    return this.createErrorCell(cell, JSON.stringify(cell));
  }

  render() {
    let cfg = this.props;
    let elems = cfg.cells || [];
    let arr = [];
    for (let i = 0; i < elems.length; i++) {
      arr.push(this.createCell(cfg.item, elems[i], cfg.as));
    }

    let {cells, as, item, cellTypes, ...nProps} = cfg;
    return React.createElement('tr', nProps, arr);
  }
}
