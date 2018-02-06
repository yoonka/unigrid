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
import {UnigridEmptyCell,
        UnigridTextCell,
        UnigridNumberCell} from 'src/UnigridCells';
import {isDefined, tryAmend, idMaker, cleanProps} from 'src/helpers';
import {applyFormatter} from 'src/sorting';

export class UnigridRow extends React.Component {
  static mkProps(oCell, item, box, renderAs, rowAs, mixIn, addProp) {
    let cell = undefined;
    let props = Object.assign({}, addProp, mixIn);

    // Special case for deep merging 'cell'
    const cellMixIn = isDefined(props, 'cell') &&
          typeof(props.cell === 'object') ? props.cell : false;

    // create a shallow copy to avoid mutating props
    if (typeof(oCell) === 'object') {
      Object.assign(props, oCell);
      // Re-merge the 'cell' objects from oCell and mixIn
      if (cellMixIn && isDefined(oCell, 'cell')
          && typeof(oCell.cell) === 'object') {
        props.cell = Object.assign({}, cellMixIn, oCell.cell);
      }
    } else {
      cell = oCell;
    }

    if (cell !== undefined) {
      Object.assign(props, {show: cell});
    }
    if (!isDefined(props, 'item') && item !== undefined) {
      Object.assign(props, {item: item});
    }
    if (!isDefined(props, 'box') && box !== undefined) {
      Object.assign(props, {box: box});
    }
    if (!isDefined(props, 'renderAs') && renderAs !== undefined) {
      Object.assign(props, {renderAs: renderAs});
    }
    if (!isDefined(props, 'rowAs') && rowAs !== undefined) {
      Object.assign(props, {rowAs: rowAs});
    }

    return props;
  }

  static cellTypeAndProps(cell, item, box, renderAs, rowAs, mixIn, addProp) {
    if (cell === null) {
      let props = this.mkProps(undefined, item, box, renderAs, rowAs, mixIn, addProp);
      return ['empty', tryAmend(props, item, box, 'cell', 'cell')];
    }

    let cellProps = this.mkProps(cell, item, box, renderAs, rowAs, mixIn, addProp);

    if (!isDefined(cellProps, 'cell') && isDefined(cellProps, 'show')) {
      Object.assign(cellProps, {cell: applyFormatter(cellProps)});
    }

    cellProps = tryAmend(cellProps, item, box, 'cell', 'cell');

    if (isDefined(cellProps, 'as')) {
      return [cellProps.as, cellProps];
    }

    return [typeof(cellProps.cell), cellProps];
  }

  static createCellForType(cellTypes, type, oProps) {
    let {show, using, as, bindToCell, ...nProps} = oProps;

    const Tx = nProps.renderAs || (nProps.rowAs === 'header' ? 'th' : 'td');
    Object.assign(nProps, {Tx: Tx});

    if (typeof(type) !== 'string') {
      if (isDefined(type, 'type')) {
        return React.cloneElement(type, nProps);
      }
      return React.createElement(type, nProps);
    }

    if (cellTypes && isDefined(cellTypes, type)) {
      return React.createElement(cellTypes[type], nProps);
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

  static createAndProcessCell(cell, item, box, renderAs, rowAs, mixIn, cellTypes, oAddProp, idCounter) {
    const addProp = Object.assign({}, oAddProp, {key: idCounter.next().value});
    let [type, props] = this.cellTypeAndProps(cell, item, box, renderAs, rowAs, mixIn, addProp);
    let binds = props.bindToCell || [];
    binds = typeof(binds) === 'string' ? [binds] : binds;
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
    let component = this.createCellForType(cellTypes, type, props);
    for (let i = 0; i < toAdd.length; i++) {
      toAdd[i].unigridCell = component;
    }
    return component;
  }

  static create(oCfg) {
    const elems = oCfg.cells || [];
    const arr = [];
    const idCounter = idMaker();
    let addProp = isDefined(oCfg, 'treeAmend') ?
        {treeAmend: oCfg.treeAmend} : undefined;

    let cfg = tryAmend(oCfg, oCfg.item, oCfg.box);

    for (let i of elems) {
      arr.push(UnigridRow.createAndProcessCell(
        i, cfg.item, cfg.box, cfg.renderAs, cfg.rowAs, cfg.mixIn, cfg.cellTypes, addProp, idCounter
      ));
    }

    const children = React.Children.map(cfg.children, (child) => {
      const chCfg = Object.assign({}, child.props, {as: child});
      arr.push(UnigridRow.createAndProcessCell(
        chCfg, cfg.item, cfg.box, cfg.renderAs, cfg.rowAs, cfg.mixIn, cfg.cellTypes, addProp, idCounter
      ));
    });

    const cleaned = cleanProps(cfg);
    return React.createElement(cfg.renderAs || 'tr', cleaned, arr);
  }

  render() {
    return UnigridRow.create(this.props);
  }
}

export const UnigridHeaderRow = props => <UnigridRow rowAs='header' {...props} />;
