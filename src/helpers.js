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
import {getIterator} from 'src/iterators';
import {UnigridRow} from 'src/UnigridRow';
import {UnigridSection} from 'src/UnigridSection';

let NODE_ENV = typeof process !== 'undefined' ? process.env.NODE_ENV : 'development';

// *** Utility functions ***

export const isDefined = (obj, prop) => {
  var undefined; // really undefined
  return !!obj && typeof obj === 'object' && obj.hasOwnProperty(prop) && obj[prop] !== undefined;
};

export const cleanProps = (props) => {
  const {table, data, item, box, sectionCounter, cellTypes, amend, treeAmend,
         condition, fromProperty, process, select, section, cells,
         renderAs, rowAs, mixIn, $do, children, bindToElement, ...other} = props;
  return other;
}

export const cleanCellProps = (props) => {
  const {cell, show, item, box, renderAs, rowAs, amend, bindToCell, treeAmend, Tx,
         ...other} = props;
  return other;
};

export const idMaker = function* () {
  let index = 0;
  while (true) yield index++;
}

// *** Processing expression objects ***

function _applyAmend(cfg, item, box, fun) {
  return Object.assign({}, cfg, fun(cfg, item, box));
}

function _amend(cfg, expr, item, box, how, def) {
  if (typeof(how) === 'function') {
    if (expr === def || !expr) {
      return _applyAmend(cfg, item, box, how);
    }
  } else if (expr && isDefined(how, expr)) {
    return _applyAmend(cfg, item, box, how[expr]);
  }
  return cfg;
}

export const tryAmend = (pCfg, pItem, pBox, pExpr, pDef) => {
  if (isDefined(pCfg, 'amend')) {
    return _amend(pCfg, pExpr, pItem, pBox, pCfg.amend, pDef);
  } else if (isDefined(pCfg, 'treeAmend')) {
    return _amend(pCfg, pExpr, pItem, pBox, pCfg.treeAmend, pDef);
  }
  return pCfg;
}

// *** Unigrid rendering functions ***

export const prepAmend = (iCfg, iItem, iBox, expr) => {
  if (isDefined(iCfg, expr)) {
    const aCfg = tryAmend(iCfg, iItem, iBox, expr);
    if (isDefined(aCfg, expr)) {
      return aCfg;
    }
  }
  return false;
}

function _isSupported(elem) {
  const isUnigrid = elem.type && elem.type.isUnigrid && elem.type.isUnigrid();
  /*
  // Maybe once react supports returning multiple children from a render function
  acc.push(<Unigrid table={nCfg} data={data} item={item} box={this.props.box}
  cellTypes={this.props.cellTypes} isChildUnigrid={true} />);
  */
  return !isUnigrid;
}

function _processChild(child, props) {
  // Pass null and undefined to React
  if (!child) {
    return child;
  }

  let binds = child.props.bindToElement || [];
  binds = typeof(binds) === 'string' ? [binds] : binds;
  let toAdd = [];
  for (let i = 0; i < binds.length; i++) {
    let funName = binds[i];
    let oldFun = child.props[funName];
    if (oldFun !== undefined) {
      let newFun = function() {
        return oldFun.apply(this.unigridElement, arguments);
      }
      toAdd.push(newFun);
      props[funName] = newFun.bind(newFun);
    }
  }
  let component = React.cloneElement(child, props);
  for (let i = 0; i < toAdd.length; i++) {
    toAdd[i].unigridElement = component;
  }
  return component;
}

function _getChildren(cfg, box, counter, data, item, cTypes) {
  let props = {
    box: box, data: data, item: item, cellTypes: cTypes,
    sectionCounter: counter, key: counter.next().value
  };
  if (isDefined(cfg, 'treeAmend')) {
    Object.assign(props, {treeAmend: cfg.treeAmend});
  }
  if (isDefined(cfg, 'renderAs')) {
    Object.assign(props, {renderAs: cfg.renderAs});
  }
  return React.Children.map(cfg.children, function(child) {
    return _processChild(child, props);
  });
}

function _shouldRender(condition, item) {
  const exists = isDefined(condition, 'property')
        && isDefined(item, condition.property);

  switch (condition.ifDoes) {
  case 'exist':
    return exists;
  case 'notExist':
    return !exists;
  case 'equal':
    return exists
      && isDefined(condition, 'value')
      && item[condition.property] === condition.value;
  case 'notEqual':
    return !exists
      || !isDefined(condition, 'value')
      || item[condition.property] !== condition.value;
  }
  return true;
}

function addRows(cfg, box, props, counter, acc, data, item) {
  let aCfg = prepAmend(cfg, item, box, 'condition');
  if (aCfg) {
    if (!_shouldRender(aCfg.condition, item)) return;
  }

  aCfg = prepAmend(cfg, item, box, 'fromProperty');
  if (aCfg) {
    const {condition, fromProperty, ...nCfg} = aCfg;
    const nData = item[aCfg.fromProperty];

    if (NODE_ENV !== 'production') {
      if (!nData || typeof(nData) !== 'object') {
        throw new Error(`Invalid value supplied to "fromProperty": ${aCfg.fromProperty}. ` +
                        'The property could not be found in the data supplied to Unigrid. ' +
                        'Consider adding the "ifDoes" exist condition.');
      }
    }

    addChildren(nCfg, box, props, counter, acc, nData, undefined);
    return;
  }

  aCfg = prepAmend(cfg, item, box, 'process');
  if (aCfg) {
    const {condition, fromProperty, process, ...nCfg} = aCfg;
    const nData = aCfg.process(data, box);

    if (NODE_ENV !== 'production') {
      if (!nData || typeof(nData) !== 'object') {
        throw new Error('Invalid data returned from the "process" function.');
      }
    }

    addChildren(nCfg, box, props, counter, acc, nData, undefined);
    return;
  }

  aCfg = prepAmend(cfg, item, box, 'select');
  if (aCfg) {
    const {condition, fromProperty, process, select, ...nCfg} = aCfg;
    executeSelect(nCfg, box, props, counter, acc, aCfg.select, data);
    return;
  }

  aCfg = prepAmend(cfg, item, box, 'section');
  if (aCfg) {
    const {condition, fromProperty, process, select, section, ...nCfg} = aCfg;
    acc.push(UnigridSection.create(nCfg, box, props, counter, aCfg.section, data, item));
    return;
  }

  const cTypes = props.cellTypes;
  aCfg = prepAmend(cfg, item, box, 'cells');
  if (aCfg) {
    const {condition, fromProperty, process, select, section, children, ...nCfg} = aCfg;
    const nId = counter.next().value;
    const key = isDefined(item, '_unigridId') ? `${item._unigridId}-${nId}` : nId;
    acc.push(UnigridRow.create(Object.assign(nCfg, {box, item, cellTypes: cTypes, key})));
  }

  aCfg = prepAmend(cfg, item, box, '$do');
  if (aCfg) {
    const addProp = isDefined(aCfg, 'treeAmend') ?
          {treeAmend: aCfg.treeAmend} : undefined;
    for (let i of aCfg.$do) {
      let nCfg = addProp ? Object.assign({}, addProp, i) : i;
      addChildren(nCfg, box, props, counter, acc, data, item);
    }
  }

  const children = _getChildren(cfg, box, counter, data, item, cTypes) || [];
  for (const i of children) {
    if (_isSupported(i)) {
      acc.push(i);
    } else {
      addChildren(i.props, box, props, counter, acc, data, item);
    }
  }
}

function executeSelect(cfg, box, props, counter, acc, select, data) {
  for (let i of getIterator(data, select)) {
    addRows(cfg, box, props, counter, acc, data, i);
  }
}

function addChildren(cfg, box, props, counter, acc, data, item) {
  if (item === undefined) {
    executeSelect(cfg, box, props, counter, acc, 'first', data);
  } else {
    addRows(cfg, box, props, counter, acc, data, item);
  }
}

export const createChildren = (cfg, box, props, counter, data, item) => {
  const acc = [];
  addChildren(cfg, box, props, counter, acc, data, item);
  return acc;
}

export const newChildren = (cfg, box, props, data, item) => {
  const counter = idMaker();
  return createChildren(cfg, box, props, counter, data, item);
}
