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
    const {condition, fromProperty, process, select, section, cells, rowAs,
           mixIn, $do, ...other} = props;
    return other;
  }

  constructor(props) {
    super(props);
    this.state = this.props.hasOwnProperty('box') ? this.props.box : undefined;
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
    let it = {[Symbol.iterator]: () => this.makeIterator(data, select)};
    for (let i of it) {
      this.addRows(acc, cfg, data, i);
    }
  }

  makeIterator(data, select) {
    switch (typeof(select)) {
    case 'number': return this.makeNumberIterator(data, select);
    case 'string': return this.makeStringIterator(data, select);
    }
  }

  makeNumberIterator(data, select) {
    var delivered = false;
    return {
      next: function() {
        if (!delivered && select >=0 && select < data.length) {
          delivered = true;
          return {value: data[select], done: false};
        }
        return {done: true};
      }
    }
  }

  makeStringIterator(data, select) {
    if (select === 'all') {
      return this.makeAllIterator(data);
    }
  }

  makeAllIterator(data) {
    var nextIndex = 0;
    return {
      next: function() {
        return nextIndex < data.length ?
          {value: data[nextIndex++], done: false} : {done: true};
      }
    }
  }

  addRows(acc, cfg, data, item) {
    if (cfg.hasOwnProperty('condition')) {
      if (this.shouldSkip(cfg.condition, item)) return;
    }

    if (cfg.hasOwnProperty('fromProperty')) {
      const {condition, fromProperty, ...nCfg} = cfg;
      this.addChildren(acc, nCfg, item[cfg.fromProperty], undefined);
      return;
    }

    if (cfg.hasOwnProperty('process')) {
      const {condition, fromProperty, process, ...nCfg} = cfg;
      this.addChildren(acc, nCfg, cfg.process(data, this.state), undefined);
      return;
    }

    if (cfg.hasOwnProperty('select')) {
      const {condition, fromProperty, process, select, ...nCfg} = cfg;
      this.executeSelect(acc, cfg.select, nCfg, data);
      return;
    }

    if (cfg.hasOwnProperty('section')) {
      const {condition, fromProperty, process, select, section, ...nCfg} = cfg;
      acc.push(this.createSection(cfg.section, nCfg, data, item));
      return;
    }

    if (cfg.hasOwnProperty('cells')) {
      const {condition, fromProperty, process, select, section, ...nCfg} = cfg;
      const cTypes = this.props.cellTypes
      acc.push(<UnigridRow {...nCfg} item={item} cellTypes={cTypes} />);
    }

    if (cfg.hasOwnProperty('$do')) {
      for (let i = 0; i < cfg.$do.length; i++) {
        this.addChildren(acc, cfg.$do[i], data, item);
      }
    }
  }

  shouldSkip(condition, item) {
    if (condition.hasOwnProperty('ifDoes')) {
      if (condition.ifDoes === 'exist') {
        if (condition.hasOwnProperty('property')) {
          if (!item.hasOwnProperty(condition.property)) {
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
    const {cells, $do, rowAs, mixIn, ...other} = cfg;
    Object.assign(other, {children: children});
    return React.createElement(getComponent(section), other);
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
