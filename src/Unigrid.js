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
import { isDefined, cleanProps, newChildren } from 'src/helpers';
import { getIterator } from 'src/iterators';

export default class Unigrid extends React.Component {
    constructor(props) {
        super(props);
        this.state = isDefined(this.props, 'box') ? this.props.box : undefined;
    }

    static isUnigrid() {
        return true;
    }

    static create(oProps, oBox) {
        const nProps = Object.assign({}, oProps.table || {}, oProps);
        const { table, data, item, box, cellTypes, ...cfg } = nProps;
        const children = newChildren(cfg, oBox, oProps, data, item);
        const cleaned = cleanProps(nProps);
        return React.createElement(cfg.renderAs || 'table', cleaned, children);
    }

    getBox() {
        return this.box || this.props.box || {};
    }

    setBox(box) {
        this.box = box;
        this.setState(box);
    }

    render() {
        return Unigrid.create(this.props, this.getBox());
    }
}
