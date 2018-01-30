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
import tableData from './json/tableResp8.json!';
import {
  Unigrid,
  UnigridHeader,
  UnigridSegment,
  UnigridRow,
  UnigridTextCell
} from 'src/index';

export class UnigridExample12 extends React.Component {
  render() {
    return (
      <div>
        <p>Example 12 : Conditional rendering</p>
        <Unigrid data={tableData}>
          <UnigridHeader rowAs={'header'}>
            <UnigridRow>
              <UnigridTextCell cell="a" />
              <UnigridTextCell cell="b" />
              <UnigridTextCell cell="c" />
            </UnigridRow>
          </UnigridHeader>
          <UnigridSegment>
            <Unigrid
              condition={{ifDoes: 'exist', property: 'w'}}
              fromProperty={'w'}
            >
              <UnigridRow>
                <UnigridTextCell show="d" />
                <UnigridTextCell show="e" />
                <UnigridTextCell show="f" />
              </UnigridRow>
            </Unigrid>
            <Unigrid
              condition={{ifDoes: 'exist', property: 'abc'}}
              fromProperty={'w'}
            >
              <UnigridRow>
                <UnigridTextCell show="d" />
                <UnigridTextCell show="e" />
                <UnigridTextCell show="f" />
              </UnigridRow>
            </Unigrid>
            <Unigrid
              condition={{ifDoes: 'equal', property: 't', value: 'test'}}
              fromProperty={'x'}
            >
              <UnigridRow>
                <UnigridTextCell show="d" />
                <UnigridTextCell show="e" />
                <UnigridTextCell show="f" />
              </UnigridRow>
            </Unigrid>
            <Unigrid
              condition={{ifDoes: 'equal', property: 't', value: 'testabc'}}
              fromProperty={'x'}
            >
              <UnigridRow>
                <UnigridTextCell show="d" />
                <UnigridTextCell show="e" />
                <UnigridTextCell show="f" />
              </UnigridRow>
            </Unigrid>
            <Unigrid
              condition={{ifDoes: 'notExist', property: 'not'}}
              fromProperty={'y'}
            >
              <UnigridRow>
                <UnigridTextCell show="d" />
                <UnigridTextCell show="e" />
                <UnigridTextCell show="f" />
              </UnigridRow>
            </Unigrid>
            <Unigrid
              condition={{ifDoes: 'notExist', property: 'w'}}
              fromProperty={'y'}
            >
              <UnigridRow>
                <UnigridTextCell show="d" />
                <UnigridTextCell show="e" />
                <UnigridTextCell show="f" />
              </UnigridRow>
            </Unigrid>
            <Unigrid
              condition={{ifDoes: 'notEqual', property: 't', value: 'abc'}}
              fromProperty={'z'}
            >
              <UnigridRow>
                <UnigridTextCell show="d" />
                <UnigridTextCell show="e" />
                <UnigridTextCell show="f" />
              </UnigridRow>
            </Unigrid>
            <Unigrid
              condition={{ifDoes: 'notEqual', property: 't', value: 'test'}}
              fromProperty={'z'}
            >
              <UnigridRow>
                <UnigridTextCell show="d" />
                <UnigridTextCell show="e" />
                <UnigridTextCell show="f" />
              </UnigridRow>
            </Unigrid>
          </UnigridSegment>
        </Unigrid>
      </div>
    );
  }
}
