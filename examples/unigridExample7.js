import React from 'react';
import { tableData } from './data/Resp3';
import {
  Unigrid,
  getSorter,
  sort
} from '../unigrid';

export class UnigridExample7 extends React.Component {
  constructor(props) {
    super(props);
    this.state = { row: false, col: false };
  }

  clickHandler(field) {
    return () => sort(this.unigrid, field);
  }

  render() {
    const chStyleY = (cfg, item, box) => {
      this.isColorB = !this.isColorB;
      return { style: { backgroundColor: '#cce6cc' } }
    };

    const chStyleG = (cfg, item, box) => {
      this.isColorB = !this.isColorB;
      return { style: { backgroundColor: '#b8b8b8' } }
    };

    const chStyleR = (cfg, item, box) => {
      const isColorR = this.isColorR ? false : true;
      this.isColorR = isColorR;
      return isColorR ? { style: { backgroundColor: '#cccccc' } } : undefined;
    };

    const chStyleB = (cfg, item, box) => {
      const isColorB = this.isColorB ? false : true;
      this.isColorB = isColorB;
      return isColorB ? { style: { backgroundColor: '#ffb3b3' } } : undefined;
    };

    const table = {
      className: 'unigrid',
      treeAmend: { cells: chStyleR, cell: chStyleB },
      $do: [
        {
          section: 'header', className: 'unigrid-header',
          cells: [
            { cell: 'AAA', onClick: this.clickHandler('a') },
            { cell: 'BBB', onClick: this.clickHandler('b') },
            { cell: 'CCC', onClick: this.clickHandler('c') },
            { cell: 'DDD', onClick: this.clickHandler('d') },
            { cell: 'EEE', onClick: this.clickHandler('e') }
          ],
          rowAs: 'header'
        },
        {
          section: 'body',
          className: 'unigrid-body',
          $do: [
            {
              process: getSorter(),
              select: 'all',
              amend: chStyleY,
              cells: ['a', 'b', 'c', 'd', 'e'],
              $do: [
                {
                  fromProperty: 'l2',
                  process: getSorter(),
                  select: 'all',
                  cells: ['a', { amend: chStyleY, show: 'b' }, 'c', 'd', 'e'],
                  $do: [
                    {
                      fromProperty: 'l3',
                      process: getSorter(),
                      select: 'all',
                      cells: ['a', 'b', 'c', { show: 'd', amend: { cell: chStyleG } }, 'e'],
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };

    const box = { column: 'A' };

    return (
      <div>
        <p>Example 7 : Stripped grid (no JSX)</p>
        <Unigrid data={tableData} table={table} box={box} ref={(ref) => { this.unigrid = ref; }} />
      </div>
    );
  }
}
