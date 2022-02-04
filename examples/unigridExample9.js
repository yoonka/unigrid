import React from 'react';
import { tableData } from './data/resp5';
import {
  Unigrid,
  UnigridHeader,
  UnigridSegment,
  UnigridRow,
  UnigridTextCell
} from '../unigrid';

export class UnigridExample9 extends React.Component {
  render() {
    const formatA = (cfg, item) => item.a === "apple" ? { style: { backgroundColor: '#b8b8b8' } } : undefined;

    const handleClick = function () {
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
