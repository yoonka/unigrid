import React from 'react';
import { tableData } from './data/resp6';
import {
  Unigrid,
  UnigridHeader,
  UnigridSegment,
  UnigridRow,
  UnigridTextCell,
  getSorter,
  sort
} from '../unigrid';

export class UnigridExample10 extends React.Component {
  clickHandler(field) {
    return () => sort(this.unigrid, field);
  }

  render() {
    return (
      <div>
        <p>Example 10 : Sorting with null, undefined and empty values</p>
        <Unigrid
          box={{ column: 'a', order: 'asc' }}
          data={tableData}
          ref={ref => { this.unigrid = ref; }}
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
