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
import {isDefined, tryAmend, idMaker} from 'src/helpers';
import {getIterator} from 'src/iterators';

export {UnigridRow};

class UnigridSection extends React.Component {
  static _getSectionComponent(section) {
    switch (section) {
    case 'header': return UnigridHeader;
    case 'body':   return UnigridSegment;
    case 'footer': return UnigridFooter;
    }
  }

  static createSection(cfg, box, props, counter, section, data, item) {
    let children = Unigrid.createChildren(cfg, box, props, counter, data, item);
    const cleaned = Unigrid.cleanProps(cfg);
    Object.assign(cleaned, {
      children: children, unfolded: true, key: counter.next().value
    });
    return React.createElement(this._getSectionComponent(section), cleaned);
  }

  makeElement(name) {
    const {unfolded, box, sectionCounter, data, item, ...cfg} = this.props;
    let children = this.props.children;
    if (!unfolded) {
      children = Unigrid.createChildren(
        cfg, box, cfg, sectionCounter, data, item);
    }
    const cleaned = Unigrid.cleanProps(cfg);
    return React.createElement(name, cleaned, children);
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
  constructor(props) {
    super(props);
    this.state = isDefined(this.props, 'box') ? this.props.box : undefined;
  }

  static isUnigrid() {
    return true;
  }

  static cleanProps(props) {
    const {data, table, box, sectionCounter, cellTypes, amend, treeAmend,
           condition, fromProperty, process, select, section, cells,
           rowAs, mixIn, $do, children, ...other} = props;
    return other;
  }

  static createChildren(cfg, box, props, counter, data, item) {
    const acc = [];
    this.addChildren(cfg, box, props, counter, acc, data, item);
    return acc;
  }

  static addChildren(cfg, box, props, counter, acc, data, item) {
    if (item === undefined) {
      this.executeSelect(cfg, box, props, counter, acc, 'first', data);
    } else {
      this.addRows(cfg, box, props, counter, acc, data, item);
    }
  }

  static executeSelect(cfg, box, props, counter, acc, select, data) {
    for (let i of getIterator(data, select)) {
      this.addRows(cfg, box, props, counter, acc, data, i);
    }
  }

  static _prepAmend(iCfg, iItem, expr) {
    if (isDefined(iCfg, expr)) {
      const aCfg = tryAmend(iCfg, iItem, expr);
      if (isDefined(aCfg, expr)) {
        return aCfg;
      }
    }
    return false;
  }

  static addRows(cfg, box, props, counter, acc, data, item) {
    let aCfg = this._prepAmend(cfg, item, 'condition');
    if (aCfg) {
      if (this.shouldSkip(aCfg.condition, item)) return;
    }

    aCfg = this._prepAmend(cfg, item, 'fromProperty');
    if (aCfg) {
      const {condition, fromProperty, ...nCfg} = aCfg;
      this.addChildren(nCfg, box, props, counter, acc, item[aCfg.fromProperty], undefined);
      return;
    }

    aCfg = this._prepAmend(cfg, item, 'process');
    if (aCfg) {
      const {condition, fromProperty, process, ...nCfg} = aCfg;
      this.addChildren(nCfg, box, props, counter, acc, aCfg.process(data, box), undefined);
      return;
    }

    aCfg = this._prepAmend(cfg, item, 'select');
    if (aCfg) {
      const {condition, fromProperty, process, select, ...nCfg} = aCfg;
      this.executeSelect(nCfg, box, props, counter, acc, aCfg.select, data);
      return;
    }

    aCfg = this._prepAmend(cfg, item, 'section');
    if (aCfg) {
      const {condition, fromProperty, process, select, section, ...nCfg} = aCfg;
      acc.push(UnigridSection.createSection(nCfg, box, props, counter, aCfg.section, data, item));
      return;
    }

    const cTypes = props.cellTypes;
    aCfg = this._prepAmend(cfg, item, 'cells');
    if (aCfg) {
      const {condition, fromProperty, process, select, section,
             children, box, ...nCfg} = aCfg;
      const nId = counter.next().value;
      const key = isDefined(item, '_unigridId') ? `${item._unigridId}-${nId}` : nId;
      acc.push(<UnigridRow {...nCfg} item={item} cellTypes={cTypes} key={key} />);
    }

    aCfg = this._prepAmend(cfg, item, '$do');
    if (aCfg) {
      const addProp = isDefined(aCfg, 'treeAmend') ?
            {treeAmend: aCfg.treeAmend} : undefined;
      for (let i of aCfg.$do) {
        let nCfg = addProp ? Object.assign({}, addProp, i) : i;
        this.addChildren(nCfg, box, props, counter, acc, data, item);
      }
    }

    const children = this._getChildren(cfg, box, counter, data, item, cTypes) || [];
    for (const i of children) {
      if (this._isSupported(i)) {
        acc.push(i);
      } else {
        this.addChildren(i.props, box, props, counter, acc, data, item);
      }
    }
  }

  static _getChildren(cfg, box, counter, data, item, cTypes) {
    let props = {
      box: box, data: data, item: item, cellTypes: cTypes,
      sectionCounter: counter, key: counter.next().value
    };
    if (isDefined(cfg, 'treeAmend')) {
      Object.assign(props, {treeAmend: cfg.treeAmend});
    }
    return React.Children.map(cfg.children, function(child) {
      return React.cloneElement(child, props);
    });
  }

  static _isSupported(elem) {
    const isUnigrid = elem.type && elem.type.isUnigrid && elem.type.isUnigrid();
    /*
    // Maybe once react supports returning multiple children from a render function
    acc.push(<Unigrid table={nCfg} data={data} item={item} box={this.props.box}
    cellTypes={this.props.cellTypes} isChildUnigrid={true} />);
    */
    return !isUnigrid;
  }

  static shouldSkip(condition, item) {
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
    const sectionCounter = idMaker();
    const children = Unigrid.createChildren(
      cfg, this.state, this.props, sectionCounter,
      this.props.data, this.props.item);
    const cleaned = Unigrid.cleanProps(props);
    return React.createElement('table', cleaned, children);
  }
}
