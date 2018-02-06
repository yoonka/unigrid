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
import {cleanProps, createChildren} from 'src/helpers';

export class UnigridSection extends React.Component {
  static _getSectionComponent(section) {
    switch (section) {
    case 'header': return UnigridHeader;
    case 'body':   return UnigridSegment;
    case 'footer': return UnigridFooter;
    }
  }

  static create(cfg, box, props, counter, section, data, item) {
    let children = createChildren(cfg, box, props, counter, data, item);
    const cleaned = cleanProps(cfg);
    Object.assign(cleaned, {
      children: children, unfolded: true, key: counter.next().value
    });
    return React.createElement(this._getSectionComponent(section), cleaned);
  }

  makeElement(name) {
    const {unfolded, box, sectionCounter, data, item, ...cfg} = this.props;
    let children = this.props.children;
    if (!unfolded) {
      children = createChildren(
        cfg, box, cfg, sectionCounter, data, item);
    }
    const cleaned = cleanProps(cfg);
    return React.createElement(name, cleaned, children);
  }
}

export class UnigridHeader extends UnigridSection {
  render() {return this.makeElement(this.props.renderAs || 'thead');}
}

export class UnigridSegment extends UnigridSection {
  render() {return this.makeElement(this.props.renderAs || 'tbody');}
}

export class UnigridFooter extends UnigridSection {
  render() {return this.makeElement(this.props.renderAs || 'tfoot');}
}
