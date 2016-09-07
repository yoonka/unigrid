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
import {UnigridRow} from 'src/UnigridRow';

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

export class Unigrid extends React.Component {

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

  makeAllIterator(data) {
    var nextIndex = 0;
    return {
      next: function() {
        return nextIndex < data.length ?
          {value: data[nextIndex++], done: false} : {done: true};
      }
    }
  }

  makeStringIterator(data, select) {
    if (select === 'all') {
      return this.makeAllIterator(data);
    }
  }

  makeIterator(data, select) {
    switch (typeof(select)) {
    case 'number': return this.makeNumberIterator(data, select);
    case 'string': return this.makeStringIterator(data, select);
    }
  }

  executeSelect(select, cfg, data, acc) {
    let it = {[Symbol.iterator]: () => this.makeIterator(data, select)};
    for (let i of it) {
      this.addRows(acc, cfg, data, i);
    }
  }

  createSection(cfg, data, item) {

    function getComponent(section) {
      switch (section) {
      case 'header': return UnigridHeader;
      case 'body':   return UnigridSegment;
      case 'footer': return UnigridFooter;
      }
    }

    let {section, show, ...other} = cfg;
    let children = this.createChildren(cfg, data, item);
    Object.assign(other, {children: children});
    return React.createElement(getComponent(section), other);
  }

  addRows(acc, cfg, oData, oItem) {
    for (let i = 0; i < cfg.show.length; i++) {
      let data = oData;
      let item = oItem;
      let c = cfg.show[i];

      if (c.hasOwnProperty('condition')) {
        if (this.shouldSkip(c.condition, item)) continue;
      }

      if (c.hasOwnProperty('fromProperty')) {
        data = item[c.fromProperty];
        item = undefined;
      }

      if (c.hasOwnProperty('section')) {
        acc.push(this.createSection(c, data, item));
      } else if (c.hasOwnProperty('select')) {
        this.executeSelect(c.select, c, data, acc);
      } else if (c.hasOwnProperty('cells')) {
        const cTypes = this.props.cellTypes;
        acc.push(<UnigridRow {...c} item={item} cellTypes={cTypes} />);
      }
    }
  }

  createChildren(cfg, data, item) {
    let acc = [];
    if (item === undefined) {
      this.executeSelect(0, cfg, data, acc);
    } else {
      this.addRows(acc, cfg, data, item);
    }
    return acc;
  }

  render() {
    let table = this.props.table;
    const {show, ...other} = table;
    const children = this.createChildren(table, this.props.data, undefined);
    return React.createElement('table', other, children);
  }
}

export {UnigridRow} from 'src/UnigridRow';
export {UnigridEmptyCell,
        UnigridTextCell,
        UnigridNumberCell} from 'src/UnigridCells';
