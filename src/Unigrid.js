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
import UnigridRow from 'src/UnigridRow';
import {isDefined, makeIterator, tryAmend} from 'src/helpers';

class UnigridSection extends React.Component {
  makeElement(name) {
    const {children, ...other} = this.props;
    return React.createElement(name, other, children);
  }
}

export class UnigridHeader extends UnigridSection {
  render() {return this.makeElement('thead');}
}

export class UnigridSegment extends UnigridSection {
  render() {return this.makeElement('tbody');}
}

export class UnigridFooter extends UnigridSection {
  render() {return this.makeElement('tfoot');}
}

export default class Unigrid extends React.Component {
  static cleanProps(props) {
    const {amend, treeAmend, makeKey, condition, fromProperty, process, select,
           section, cells, rowAs, mixIn, $do, ...other} = props;
    return other;
  }

  constructor(props) {
    super(props);
    this.state = isDefined(this.props, 'box') ? this.props.box : undefined;
  }

  createChildren(cfg, data, item) {
    let acc = [];
    this.addChildren(acc, cfg, data, item);
    return acc;
  }

  addChildren(acc, cfg, data, item) {
    if (item === undefined) {
      this.executeSelect(acc, 0, cfg, data);
    } else {
      this.addRows(acc, cfg, data, item);
    }
  }

  executeSelect(acc, select, cfg, data) {
    let it = {[Symbol.iterator]: () => makeIterator(data, select)};
    for (let i of it) {
      this.addRows(acc, cfg, data, i);
    }
  }

  addRows(acc, cfg, data, item) {
    function prepAmend(iCfg, iItem, expr) {
      if (isDefined(iCfg, expr)) {
        const aCfg = tryAmend(iCfg, iItem, expr);
        if (isDefined(aCfg, expr)) {
          return aCfg;
        }
      }
      return false;
    }

    let aCfg = prepAmend(cfg, item, 'condition');
    if (aCfg) {
      if (this.shouldSkip(aCfg.condition, item)) return;
    }

    aCfg = prepAmend(cfg, item, 'fromProperty');
    if (aCfg) {
      const {condition, fromProperty, ...nCfg} = aCfg;
      this.addChildren(acc, nCfg, item[aCfg.fromProperty], undefined);
      return;
    }

    aCfg = prepAmend(cfg, item, 'process');
    if (aCfg) {
      const {condition, fromProperty, process, ...nCfg} = aCfg;
      this.addChildren(acc, nCfg, aCfg.process(data, this.state), undefined);
      return;
    }

    aCfg = prepAmend(cfg, item, 'select');
    if (aCfg) {
      const {condition, fromProperty, process, select, ...nCfg} = aCfg;
      this.executeSelect(acc, aCfg.select, nCfg, data);
      return;
    }

    aCfg = prepAmend(cfg, item, 'section');
    if (aCfg) {
      const {condition, fromProperty, process, select, section, ...nCfg} = aCfg;
      acc.push(this.createSection(aCfg.section, nCfg, data, item));
      return;
    }

    aCfg = prepAmend(cfg, item, 'cells');
    if (aCfg) {
      const {condition, fromProperty, process, select, section, ...nCfg} = aCfg;
      const cTypes = this.props.cellTypes
      acc.push(<UnigridRow {...nCfg} item={item} cellTypes={cTypes} />);
    }

    aCfg = prepAmend(cfg, item, '$do');
    if (aCfg) {
      const addProp = isDefined(aCfg, 'treeAmend') ?
            {treeAmend: aCfg.treeAmend} : undefined;
      for (let i of aCfg.$do) {
        let nCfg = addProp ? Object.assign({}, addProp, i) : i;
        this.addChildren(acc, nCfg, data, item);
      }
    }
  }

  shouldSkip(condition, item) {
    if (isDefined(condition, 'ifDoes')) {
      if (condition.ifDoes === 'exist') {
        if (isDefined(condition, 'property')) {
          if (!isDefined(item, condition.property)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  createSection(section, cfg, data, item) {

    function getComponent(section) {
      switch (section) {
      case 'header': return UnigridHeader;
      case 'body':   return UnigridSegment;
      case 'footer': return UnigridFooter;
      }
    }

    let children = this.createChildren(cfg, data, item);
    const props = Unigrid.cleanProps(cfg);
    Object.assign(props, {children: children});
    return React.createElement(getComponent(section), props);
  }

  getBox() {
    return this.state || this.props.box || {};
  }

  setBox(box) {
    this.setState(box);
  }

  render() {
    const table = this.props.table;
    const children = table ?
      this.createChildren(table, this.props.data, undefined)
      : this.props.children;
    const props = table ? Unigrid.cleanProps(table) : {};
    return React.createElement('table', props, children);
  }
}
