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
import tableData from './json/tableResp5.json!';
import {
  Unigrid,
  UnigridHeader,
  UnigridSegment,
  UnigridRow,
  UnigridTextCell
} from 'src/index';

export class UnigridExample9 extends React.Component {
  render() {

    const formatA = (cfg, item) => item.a === "apple" ? {style: {backgroundColor: '#55ff55'}} : undefined;

    const handleClick = function() {
      console.log('handleClick', this.props.item);
    };

    return (
      <div>
        <p>Example 9 : Mixed definition table (JSX/noJSX - mixed components)</p>
        <Unigrid data={tableData}>
          <UnigridHeader cells={['a', 'b']}>
            <Unigrid cells={['c', 'd']} />
          </UnigridHeader>
          <UnigridSegment>
            <Unigrid cells={['e', 'f']} />
          </UnigridSegment>
          <UnigridSegment select={'all'}>
            <UnigridRow amend={formatA} onClick={handleClick} bindToElement={'onClick'}>
              <UnigridTextCell show="a" />
              <UnigridTextCell show="b" />
            </UnigridRow>
          </UnigridSegment>
          <Unigrid section={'footer'}>
            <Unigrid cells={['g', 'h']} />
          </Unigrid>
        </Unigrid>
      </div>
    );
  }
}
