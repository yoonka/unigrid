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
// import tableData from './json/tableResp1.json';
import {
  Unigrid,
  UnigridHeader,
  UnigridSegment,
  UnigridFooter,
  UnigridRow,
  UnigridHeaderRow,
  UnigridEmptyCell,
  UnigridTextCell
} from '../unigrid';

export class UnigridExample13 extends React.Component {
  constructor() {
    super();
    this.idCounter = () => { var counter = 0; return () => counter += 1; }
  }

  handleClick() {
    console.log(this.props.item);
  }

  render() {
    const tableData = [{ hAgent: "Agent", hDate: "Date", hStreet: "Street", hName: "Name", hNumber: "Number", agent: "Anna", date: "01.03.2012", street: "Long Street", name: "Merquat", number: 2, fSum: "Sum", fTotal: "Total", sum: "20", total: "120" }, { agent: "Charlie", date: "05.05.2013", street: "Red Street", name: "Teddy", number: 1, list: [{ hCategory: "cat1", hNumber: "No", name: "Berta", number: 7 }, { name: "Tobias", number: 5 }] }, { agent: "Eve", date: "10.12.2014", street: "Closed Circle", name: "Berry", number: 4 }]

    const cellTypes = {
      empty: UnigridEmptyCell,
      string: UnigridTextCell
    };

    return (
      <div>
        <p>Example 13 : Div Multitable (JSX - specialized components rendered as divs)</p>
        <Unigrid renderAs="div" data={tableData} cellTypes={cellTypes}>
          <Unigrid className={'unigrid-main-class'}>
            <UnigridHeader className={'unigrid-header'}>
              <UnigridHeaderRow>
                <UnigridTextCell show="hAgent" />
                <UnigridTextCell show="hDate" />
                <UnigridTextCell show="hStreet" />
                <UnigridTextCell show="hName" className={'name-header-cell'} />
                <UnigridTextCell show="hNumber" />
              </UnigridHeaderRow>
            </UnigridHeader>
          </Unigrid>
          <Unigrid select={'all'}>
            <UnigridSegment className={'unigrid-segment'}>
              <Unigrid condition={{ ifDoes: 'exist', property: 'list' }}
                fromProperty={'list'}
                select={0}>
                <UnigridRow rowAs={'header'}>
                  <UnigridTextCell show={'hCategory'} />
                  <UnigridEmptyCell colSpan={3} />
                  <UnigridTextCell show={'hNumber'} />
                </UnigridRow>
              </Unigrid>
              <Unigrid condition={{ ifDoes: 'exist', property: 'list' }}
                fromProperty={'list'}>
                <UnigridHeaderRow>
                  <UnigridTextCell cell={'category2'} />
                  <UnigridEmptyCell colSpan={3} />
                  <UnigridTextCell show={'hNumber'} />
                </UnigridHeaderRow>
              </Unigrid>
              <UnigridRow className={'some-row-class'}>
                <UnigridTextCell show="agent" />
                <UnigridTextCell show="date" />
                <UnigridTextCell show="street" />
                <UnigridTextCell show="name" />
                <UnigridTextCell
                  show={'number'}
                  className={'number-cell'}
                  onClick={this.handleClick}
                  bindToCell={['onClick']}
                />
              </UnigridRow>
              <Unigrid condition={{ ifDoes: 'exist', property: 'list' }}
                fromProperty={'list'}
                select={'all'}
              >
                <UnigridRow mixIn={{ onClick: this.handleClick, bindToCell: 'onClick' }}>
                  <UnigridEmptyCell colSpan={3} />
                  <UnigridTextCell show={'name'} />
                  <UnigridTextCell show={'number'} />
                </UnigridRow>
              </Unigrid>
            </UnigridSegment>
          </Unigrid>
          <UnigridFooter className={'unigrid-footer'}>
            <Unigrid select={0}>
              <Unigrid cells={[null, null, null, 'fSum', 'fTotal']} />
              <Unigrid cells={[null, null, null, 'sum', 'total']} />
            </Unigrid>
          </UnigridFooter>
        </Unigrid>
      </div>
    );
  }
}
