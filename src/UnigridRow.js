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

  mkProps(cell, item, value, rowAs, mixIn) {
    if (item !== undefined) {
      Object.assign(cell, {item: item});
    }
    if (value !== undefined) {
      Object.assign(cell, {cell: value});
    }
    if (rowAs !== undefined) {
      Object.assign(cell, {rowAs: rowAs});
    }
    Object.assign(cell, mixIn);
    return cell;
  }

  createCellForType(type, oProps) {
    let {show, using, as, bindToCell, ...nProps} = oProps;

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

    // 'error' type
    return (<UnigridTextCell {...nProps} cell={"Error: " + nProps.cell} />);
  }

  getItemValue(item, property) {
    return property && item.hasOwnProperty(property) ?
      item[property] : undefined;
  }

  getCell(item, cell, rowAs, mixIn) {
    if (typeof(cell) === 'string') {
      const value = this.getItemValue(item, cell);
      if (value !== undefined) {
        return [typeof(value), this.mkProps({}, item, value, rowAs, mixIn)];
      } else {
        return ['error', this.mkProps({}, item, cell, rowAs, mixIn)];
      }
    }
    if (cell === null) {
      return ['empty', this.mkProps({}, item, undefined, rowAs, mixIn)];
    }
    if (typeof(cell) !== 'object') {
      return ['error', this.mkProps({}, item, cell.toString(), rowAs, mixIn)];
    }

    const value = this.getItemValue(item, cell.show);

    // create a shallow copy to avoid modifying the cell config (which props is based on)
    let nProps = Object.assign({}, cell);
    nProps = this.mkProps(nProps, item, value, rowAs, mixIn);

    if (cell.hasOwnProperty('using')) {
      return [cell.using, nProps];
    }
    if (cell.hasOwnProperty('as')) {
      return [cell.as, nProps];
    }

    Object.assign(nProps, {cell: JSON.stringify(cell)});
    return ['error', nProps];
  }

  createAndProcessCell(item, cell, rowAs, mixIn) {
    let [type, props] = this.getCell(item, cell, rowAs, mixIn);
    let binds = props.bindToCell || [];
    if (typeof(binds) === 'string') {
      binds = [binds];
    }
    let toAdd = [];
    for (let i = 0; i < binds.length; i++) {
      let funName = binds[i];
      let oldFun = props[funName];
      if (oldFun !== undefined) {
        let newFun = function() {
          return oldFun.apply(this.unigridCell, arguments);
        }
        toAdd.push(newFun);
        props[funName] = newFun.bind(newFun);
      }
    }
    let component = this.createCellForType(type, props);
    for (let i = 0; i < toAdd.length; i++) {
      toAdd[i].unigridCell = component;
    }
    return component;
  }

  render() {
    let cfg = this.props;
    let elems = cfg.cells || [];
    let cfgMixIn = cfg.mixIn;
    let arr = [];
    for (let i = 0; i < elems.length; i++) {
      arr.push(this.createAndProcessCell(cfg.item, elems[i], cfg.rowAs, cfgMixIn));
    }

    let {cells, as, mixIn, item, cellTypes, ...nProps} = cfg;
    return React.createElement('tr', nProps, arr);
  }
}
