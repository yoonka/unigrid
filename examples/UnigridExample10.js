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
import tableData from './json/tableResp6.json!';
import {
  Unigrid,
  UnigridHeader,
  UnigridSegment,
  UnigridRow,
  UnigridTextCell,
  getSorter,
  sort
} from 'src/index';

export class UnigridExample10 extends React.Component {
  clickHandler(field) {
    return () => sort(this.unigrid, field);
  }

  render() {
    return (
      <div>
      <p>Example 10 : Sorting with null, undefined and empty values</p>
      <Unigrid
        box={{column: 'a', order: 'asc'}}
        data={tableData}
        ref={ref => {this.unigrid = ref;}}
      >
        <UnigridHeader>
          <UnigridRow rowAs={'header'}>
            <UnigridTextCell cell="A" onClick={this.clickHandler('a')} />
            <UnigridTextCell cell="B" onClick={this.clickHandler('b')} />
            <UnigridTextCell cell="C" onClick={this.clickHandler('c')} />
            <UnigridTextCell cell="D" onClick={this.clickHandler('d')} />
          </UnigridRow>
        </UnigridHeader>
        <UnigridSegment
          process={getSorter()}
          select={'all'}
        >
          <UnigridRow>
            <UnigridTextCell show="a" />
            <UnigridTextCell show="b" />
            <UnigridTextCell show="c" />
            <UnigridTextCell show="d" />
          </UnigridRow>
        </UnigridSegment>
      </Unigrid>
      </div>
    );
  }
}
