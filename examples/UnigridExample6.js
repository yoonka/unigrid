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
import {UnigridPart, UnigridSection, UnigridCells} from 'src/UnigridParts';
import {UnigridEmptyCell, UnigridTextCell} from 'src/UnigridCells';
import tableData from './json/tableResp1.json!';

export class UnigridExample6 extends React.Component {
  constructor() {
    super();
    this.idCounter = () => {var counter = 0; return () => counter += 1;}
  }

  handleClick() {
    console.log(this.props.item);
  }

  render() {

    const cellTypes = {
      empty: UnigridEmptyCell,
      string: UnigridTextCell
    };

    return (
      <div>
        <p>Multitable defined with JSX - version 2 (WIP)</p>
        <Unigrid data={tableData} cellTypes={cellTypes}>
          <UnigridPart className={'unigrid-main-class'}>
            <UnigridSection section={'header'} className={'unigrid-header'}>
              <UnigridCells rowAs={'header'} cells={[
                  {show: 'hAgent', as: UnigridTextCell},
                  'hDate',
                  'hStreet',
                  {show: 'hName', as: 'string', className: 'name-header-cell'},
                  'hNumber'
                ]}
              />
            </UnigridSection>
          </UnigridPart>
          <UnigridPart select={'all'}>
            <UnigridSection section={'body'} className={'unigrid-segment'}>
              <UnigridCells condition={{ifDoes: 'exist', property: 'list'}}
                fromProperty={'list'}
                rowAs={'header'}
                cells={[
                  'hCategory',
                  {as: 'empty', colSpan: 3},
                  'hNumber'
                ]}
              />
              <UnigridCells condition={{ifDoes: 'exist', property: 'list'}}
                fromProperty={'list'}
                rowAs={'header'}
                cells={[
                  {cell: 'category2'},
                  {as: 'empty', colSpan: 3},
                  'hNumber'
                ]}
              />
              <UnigridCells className={'some-row-class'}
                cells={['agent', 'date', 'street', 'name',
                  {show: 'number',
                  as: 'string',
                  className: 'number-cell',
                  onClick: this.handleClick,
                  bindToCell: ['onClick']}
                ]}
              />
              <UnigridPart condition={{ifDoes: 'exist', property: 'list'}}
                fromProperty={'list'}
                select={'all'}
              >
                <UnigridCells
                  cells={[{as: 'empty', colSpan: 3}, 'name', 'number']}
                  mixIn={{onClick: this.handleClick, bindToCell: 'onClick'}}
                />
              </UnigridPart>
            </UnigridSection>
          </UnigridPart>
          <UnigridSection section={'footer'} className={'unigrid-footer'}>
            <UnigridCells cells={[null, null, null, 'fSum', 'fTotal']} />
            <UnigridCells cells={[null, null, null, 'sum', 'total']} />
          </UnigridSection>
        </Unigrid>
      </div>
    );
  }
}
