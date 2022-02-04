import React from 'react';
import { tableData } from './data/resp2';
import { Unigrid } from '../unigrid';

export class UnigridExample3 extends React.Component {
  render() {
    const table = {
      fromProperty: 'nList',
      select: 'all',
      section: 'body',
      cells: [
        { myData: 'key1' },
        { myData: 'key2' }
      ],
      mixIn: { as: 'myCell' }
    };

    const cellTypes = {
      myCell: ({ myData, item }) => <td>{item[myData]}</td>
    }

    return (
      <div>
        <p>Example 3 : Custom cell (no JSX)</p>
        <Unigrid data={tableData} table={table} cellTypes={cellTypes} />
      </div>
    );
  }
}
