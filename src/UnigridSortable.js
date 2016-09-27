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
import Unigrid from 'src/Unigrid';
import {applyFormatter} from 'src/helpers';

export default class UnigridSortable extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.props.hasOwnProperty('box') ? this.props.box : undefined;
  }

  static compareString(a, b) {
    const la = a.toLowerCase();
    const lb = b.toLowerCase();

    if (la < lb) return -1;
    if (la > lb) return 1;
    return 0;
  }

  static compareAttributes(oAttrA, oAttrB) {
    const attrA = (typeof oAttrA === 'object') ? oAttrA.valueOf() : oAttrA;
    const attrB = (typeof oAttrB === 'object') ? oAttrB.valueOf() : oAttrB;

    const aType = typeof attrA;
    const bType = typeof attrB;

    if (aType !== bType) return 0;

    if (aType === 'string') {
      const retVal = this.compareString(attrA, attrB);
      if(retVal !== 0) return retVal;
    } else if (aType === 'number') {
      const retVal = attrA - attrB;
      if (retVal !== 0) return retVal;
    }
    return 0;
  }

  static compareObjects(a, b, attrs, isAsc) {
    for (let i = 0; i < attrs.length; i++) {
      const aVal = applyFormatter({show: attrs[i], item: a});
      const bVal = applyFormatter({show: attrs[i], item: b});
      const retVal = this.compareAttributes(aVal, bVal);
      if (retVal === 0) {
        continue;
      } else {
        return isAsc ? retVal : -retVal;
      }
    }
    return 0;
  }

  // fields - The list of fields in the 'item' by which the input 'data'
  //   should be sorted. If it's a function then it will be called, with the
  //   selected column as its argument, to obtain the list of fields.
  // defOrder - default order if 'box.order' isn't defined.
  static sorter(data, box, fields = (col) => [col], defOrder = 'asc') {
    const nColumns = typeof fields === 'function' ?
          fields(box.column) || [] : fields;
    const isAsc = (box.order || defOrder) === 'asc';
    const comparer = (a, b) => this.compareObjects(a, b, nColumns, isAsc);
    return data.slice().sort(comparer);
  }

  static getSorter(colToFields, defOrder) {
    return (data, box) =>
      this.sorter(data, box, colToFields, defOrder);
  }

  getBox() {
    return this.state || this.props.box || {};
  }

  setBox(box) {
    this.setState(box);
  }

  // 'column' is used to track a change in sorting order. This name is supplied
  //   to the sorter function, so if it's a name of a field in the data item
  //   the default columnToFields mapper function can be used.
  // 'order' is the order to be used when sorting. Its behaviour depends on
  //     values supplied to this function in previous calls (if there were any).
  //   Valid values are: undefined, 'alter', 'old:alter',
  //     'asc', 'desc', 'new:asc' and 'new:desc'.
  //   If undefined is supplied then 'new:asc' is used as default.
  //   Value 'alter' means that subsequnt calls will alternate the order
  //     ('asc' to 'desc' and 'desc' to 'asc').
  //   Value 'old:alter' is similar to 'alter' but it will alternate only if the
  //     supplied 'column' value is the same as supplied in the previous call.
  //     If a new 'column' is supplied then it will leave the order unchanged.
  //   Value 'asc' or 'desc' will unconditionally sort in ascending or
  //     descending order.
  //   Values 'new:asc' and 'new:desc' mean that the order (ascending or
  //     descending) is to be used only if a new 'column' is supplied,
  //     i.e. if 'box.column' != 'column. Otherwise the order will alternate.
  // The first argument can be a function to override this with a new behaviour.
  sort(column, order) {
    const alternate = (o) => o === 'asc' ? 'desc' : 'asc';
    let box = this.getBox();
    if (typeof(column) === 'function') {
      box = column(box, order);
    } else {
      const nOrder = order || 'new:asc';
      let {column: bColumn, order: bOrder} = box;
      const isNew = !bColumn || bColumn !== column;
      bColumn = isNew ? column : bColumn;

      switch(nOrder) {
      case 'alter':
        bOrder = alternate(bOrder);
        break;
      case 'old:alter':
        bOrder = isNew ? bOrder : alternate(bOrder);
        break;
      case 'asc':
        bOrder = 'asc';
        break;
      case 'desc':
        bOrder = 'desc';
        break;
      case 'new:asc':
        bOrder = isNew ? 'asc' : alternate(bOrder);
        break;
      case 'new:desc':
        bOrder = isNew ? 'desc' : alternate(bOrder);
        break;
      }

      box = Object.assign({}, box, {column: bColumn, order: bOrder});
    }
    this.setBox(box);
  }

  render() {
    return (<Unigrid {...this.props} box={this.getBox()} />);
  }
}
