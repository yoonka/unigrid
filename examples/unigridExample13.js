import React from 'react';
import { tableData } from './data/resp1';
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
    const cellTypes = {
      empty: UnigridEmptyCell,
      string: UnigridTextCell
    };

    return (
      <div className="example13-container">
        <p>Example 13 : Div Multitable (JSX - specialized components rendered as divs)</p>
        <Unigrid renderAs="div" className="example13-container-box" data={tableData} cellTypes={cellTypes}>
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
