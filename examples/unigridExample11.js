import React from 'react';
import { tableData } from './data/resp7';
import {
  Unigrid,
  UnigridHeader,
  UnigridSegment,
  UnigridRow,
  UnigridTextCell,
  getSorter,
  sort
} from '../unigrid';

export class UnigridExample11 extends React.Component {
  clickHandler(field) {
    return () => sort(this.unigrid, field);
  }

  render() {
    return (
      <div>
        <p>Example 11 : Sorting with nested objects</p>
        <Unigrid
          box={{ column: 'x1.x2.x3', order: 'asc' }}
          data={tableData}
          ref={ref => { this.unigrid = ref; }}
        >
          <UnigridHeader>
            <UnigridRow rowAs={'header'}>
              <UnigridTextCell cell="X" onClick={this.clickHandler('x1.x2.x3')} />
              <UnigridTextCell cell="Y" onClick={this.clickHandler('y1.y2.y3')} />
            </UnigridRow>
          </UnigridHeader>
          <UnigridSegment
            process={getSorter()}
            select={'all'}
          >
            <UnigridRow>
              <UnigridTextCell show="x1.x2.x3" />
              <UnigridTextCell show="y1.y2.y3" />
            </UnigridRow>
          </UnigridSegment>
        </Unigrid>
      </div>
    );
  }
}
