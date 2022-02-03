import React from 'react';
import { tableData } from './data/Resp2';
import { Unigrid } from '../unigrid';

export class UnigridExample2 extends React.Component {
  render() {
    const table = {
      className: 'unigrid-main-class',
      condition: { ifDoes: 'exist', property: 'nList' },
      fromProperty: 'nList',
      select: 'all',
      section: 'body',
      cells: ['key1', 'key2']
    };

    return (
      <div>
        <p>Example 2 : Compact definition (no JSX)</p>
        <Unigrid data={tableData} table={table} />
      </div>
    );
  }
}
