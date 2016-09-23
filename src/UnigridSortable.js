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
      const retVal = this.compareAttributes(a[attrs[i]], b[attrs[i]]);
      if (retVal === 0) {
        continue;
      } else {
        return isAsc ? retVal : -retVal;
      }
    }
    return 0;
  }

  static fieldSorter(data, {field, type}) {
    const isAsc = type === 'asc';
    const sorter = (a, b) => this.compareObjects(a, b, [field], isAsc);
    return data.slice().sort(sorter);
  }

  static allowedFieldSorter(data, {field, type}, allowed, defField, defType) {
    let nField = field;
    let nType = type;
    if (allowed.indexOf(field) < 0) {
      nField = defField;
      nType = defType;
    }
    return this.fieldSorter(data, {field: nField, type: nType});
  }

  static getFieldSorter() {
    return this.fieldSorter.bind(this);
  }

  static getAllowedFieldSorter(allowed, defField, defType) {
    return (data, box) =>
      this.allowedFieldSorter(data, box, allowed, defField, defType);
  }

  sortByField(nField) {
    const box = this.state;
    let {field, type} = box;
    if (field === nField) {
      type = type === 'asc' ? 'desc' : 'asc';
    } else {
      field = nField;
      type = 'asc';
    }
    box.field = field;
    box.type = type;
    this.setState(box);
  }

  render() {
    return (<Unigrid {...this.props} box={this.state} />);
  }
}
