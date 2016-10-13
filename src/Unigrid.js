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
import {isDefined, tryAmend} from 'src/helpers';
import {getIterator} from 'src/iterators';

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
    const {data, table, box, cellTypes, amend, treeAmend, makeKey, condition,
           fromProperty, process, select, section, cells, rowAs, mixIn, $do,
           children, ...other} = props;
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
      this.executeSelect(acc, 'first', cfg, data);
    } else {
      this.addRows(acc, cfg, data, item);
    }
  }

  executeSelect(acc, select, cfg, data) {
    for (let i of getIterator(data, select)) {
      this.addRows(acc, cfg, data, i);
    }
  }

  _prepAmend(iCfg, iItem, expr) {
    if (isDefined(iCfg, expr)) {
      const aCfg = tryAmend(iCfg, iItem, expr);
      if (isDefined(aCfg, expr)) {
        return aCfg;
      }
    }
    return false;
  }

  _appendChildren(cfg) {
    let childs = cfg.children || [];
    if (childs.constructor !== Array) {
      childs = [childs];
    }
    if (childs.length > 0) {
      let dos = cfg.$do || [];
      dos = dos.concat(childs.map((c) => c.props));
      const {children, ...nCfg} = cfg;
      return Object.assign({}, nCfg, {$do: dos});
    }
    return cfg;
  }

  addRows(acc, cfg, data, item) {
    let aCfg = this._prepAmend(cfg, item, 'condition');
    if (aCfg) {
      if (this.shouldSkip(aCfg.condition, item)) return;
    }

    aCfg = this._prepAmend(cfg, item, 'fromProperty');
    if (aCfg) {
      const {condition, fromProperty, ...nCfg} = aCfg;
      this.addChildren(acc, nCfg, item[aCfg.fromProperty], undefined);
      return;
    }

    aCfg = this._prepAmend(cfg, item, 'process');
    if (aCfg) {
      const {condition, fromProperty, process, ...nCfg} = aCfg;
      this.addChildren(acc, nCfg, aCfg.process(data, this.state), undefined);
      return;
    }

    aCfg = this._prepAmend(cfg, item, 'select');
    if (aCfg) {
      const {condition, fromProperty, process, select, ...nCfg} = aCfg;
      this.executeSelect(acc, aCfg.select, nCfg, data);
      return;
    }

    aCfg = this._prepAmend(cfg, item, 'section');
    if (aCfg) {
      const {condition, fromProperty, process, select, section, ...nCfg} = aCfg;
      acc.push(this.createSection(aCfg.section, nCfg, data, item));
      return;
    }

    aCfg = this._prepAmend(cfg, item, 'cells');
    if (aCfg) {
      const {condition, fromProperty, process, select, section, ...nCfg} = aCfg;
      const cTypes = this.props.cellTypes
      acc.push(<UnigridRow {...nCfg} item={item} cellTypes={cTypes} />);
    }

    aCfg = this._prepAmend(this._appendChildren(cfg), item, '$do');
    if (aCfg) {
      const addProp = isDefined(aCfg, 'treeAmend') ?
            {treeAmend: aCfg.treeAmend} : undefined;
      for (let i of aCfg.$do) {
        let nCfg = addProp ? Object.assign({}, addProp, i) : i;
        /*
          // Maybe once react supports returning multiple children from a render function
          acc.push(<Unigrid table={nCfg} data={data} item={item} box={this.props.box}
          cellTypes={this.props.cellTypes} isChildUnigrid={true} />);
        */
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

  _getSectionComponent(section) {
    switch (section) {
    case 'header': return UnigridHeader;
    case 'body':   return UnigridSegment;
    case 'footer': return UnigridFooter;
    }
  }

  createSection(section, cfg, data, item) {
    let children = this.createChildren(cfg, data, item);
    const props = Unigrid.cleanProps(cfg);
    Object.assign(props, {children: children});
    return React.createElement(this._getSectionComponent(section), props);
  }

  getBox() {
    return this.state || this.props.box || {};
  }

  setBox(box) {
    this.setState(box);
  }

  render() {
    const pTable = this.props.table || {};
    const props = Object.assign({}, pTable, this.props);
    const {table, data, box, cellTypes, ...cfg} = props;
    const children = this.createChildren(cfg, this.props.data, this.props.item);
    const cleaned = Unigrid.cleanProps(props);
    return React.createElement('table', cleaned, children);
  }
}
