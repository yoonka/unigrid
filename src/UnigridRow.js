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
import {isDefined, applyFormatter, tryAmend} from 'src/helpers';

export default class UnigridRow extends React.Component {

  mkProps(oCell, item, rowAs, mixIn, addProp) {
    let cell = undefined;
    let props = Object.assign({}, addProp, mixIn);

    // create a shallow copy to avoid mutating props
    if (typeof(oCell) === 'object') {
      Object.assign(props, oCell);
    } else {
      cell = oCell;
    }

    if (cell !== undefined) {
      Object.assign(props, {show: cell});
    }
    if (!isDefined(props, 'item') && item !== undefined) {
      Object.assign(props, {item: item});
    }
    if (!isDefined(props, 'rowAs') && rowAs !== undefined) {
      Object.assign(props, {rowAs: rowAs});
    }
    return props;
  }

  createCellForType(type, oProps) {
    let {show, using, as, bindToCell, ...nProps} = oProps;

    if (typeof(type) !== 'string') {
      return React.createElement(type, nProps);
    }

    if (isDefined(this.props, 'cellTypes')
      && isDefined(this.props.cellTypes, type)) {
      return React.createElement(this.props.cellTypes[type], nProps);
    }

    switch (type) {
    case 'string': return (<UnigridTextCell   {...nProps} />);
    case 'number': return (<UnigridNumberCell {...nProps} />);
    case 'empty':  return (<UnigridEmptyCell  {...nProps} />);
    }

    // 'undefined' type
    return (
      <UnigridTextCell {...nProps} cell={"Error: " + JSON.stringify(oProps)} />
    );
  }

  getCell(cell, item, rowAs, mixIn, addProp) {
    if (cell === null) {
      let props = this.mkProps(undefined, item, rowAs, mixIn, addProp);
      return ['empty', tryAmend(props, item, 'cell', 'cell')];
    }

    let cellProps = this.mkProps(cell, item, rowAs, mixIn, addProp);

    if (!isDefined(cellProps, 'cell') && isDefined(cellProps, 'show')) {
      Object.assign(cellProps, {cell: applyFormatter(cellProps)});
    }

    cellProps = tryAmend(cellProps, item, 'cell', 'cell');

    if (isDefined(cellProps, 'as')) {
      return [cellProps.as, cellProps];
    }

    return [typeof(cellProps.cell), cellProps];
  }

  createAndProcessCell(cell, item, rowAs, mixIn, addProp) {
    let [type, props] = this.getCell(cell, item, rowAs, mixIn, addProp);
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
    const addProp = isDefined(cfg, 'treeAmend') ?
          {treeAmend: cfg.treeAmend} : undefined;
    for (let i of elems) {
      arr.push(this.createAndProcessCell(i, cfg.item, cfg.rowAs, cfgMixIn, addProp));
    }

    let {amend, treeAmend, cells, rowAs, mixIn, item, cellTypes, $do,
         ...nProps} = cfg;
    return React.createElement('tr', nProps, arr);
  }
}
