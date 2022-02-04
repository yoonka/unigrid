import React from 'react';
import { tableData } from './data/resp4';
import { Unigrid } from '../unigrid';

export class UnigridExample8 extends React.Component {
  render() {
    return (
      <div>
        <p>Example 8 : Tree rendering a flat section (JSX - generic components)</p>
        <Unigrid cells={['a', 'b']} data={tableData} section={'body'}>
          <Unigrid cells={['c', 'd']} >
            <Unigrid cells={['e', 'f']} />
            <Unigrid cells={['g', 'h']} />
          </Unigrid>
        </Unigrid>
      </div>
    );
  }
}
