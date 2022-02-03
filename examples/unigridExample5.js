import React from 'react';
import { tableData } from './data/Resp1';
import {
  Unigrid,
  UnigridHeader,
  UnigridSegment,
  UnigridFooter,
  UnigridRow,
  UnigridEmptyCell,
  UnigridTextCell
} from '../unigrid';

export class UnigridExample5 extends React.Component {
  constructor() {
    super();
    this.idCounter = () => { var counter = 0; return () => counter += 1; }
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
        <p>Example 5 : Multitable (JSX - specialized components)</p>
        <Unigrid data={tableData} cellTypes={cellTypes}>
          <Unigrid className={'unigrid-main-class'}>
            <UnigridHeader className={'unigrid-header'}>
              <UnigridRow rowAs={'header'}>
                <UnigridTextCell show="hAgent" />
                <UnigridTextCell show="hDate" />
                <UnigridTextCell show="hStreet" />
                <UnigridTextCell show="hName" className={'name-header-cell'} />
                <UnigridTextCell show="hNumber" />
              </UnigridRow>
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
                <UnigridRow rowAs={'header'}>
                  <UnigridTextCell cell={'category2'} />
                  <UnigridEmptyCell colSpan={3} />
                  <UnigridTextCell show={'hNumber'} />
                </UnigridRow>
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
