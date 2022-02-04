import React from 'react';
import { tableData } from './data/resp1';
import {
  Unigrid,
  getSorter,
  sort,
  isDefined
} from '../unigrid';

export class UnigridExample4 extends React.Component {
  clickHandler(field) {
    return () => sort(this.unigrid, field);
  }

  render() {
    const ucFormatter = (attr) =>
      (props) => props.item[attr].toUpperCase();

    const columnToFields = (column) => {
      if (column === 'name') {
        return [ucFormatter('name')];
      }
      return column === 'number' ? [column] : ['name'];
    }

    const props = {
      data: tableData,
      box: { column: 'agent', order: 'asc' },
      table: {
        className: 'unigrid-main-class',
        $do: [
          {
            section: 'header',
            className: 'unigrid-header',
            cells: [
              { show: 'hAgent', onClick: this.clickHandler('agent') },
              { show: 'hDate', onClick: this.clickHandler('date') },
              { show: 'hStreet', onClick: this.clickHandler('street') },
              { show: 'hName', onClick: this.clickHandler('name') },
              { show: 'hNumber', onClick: this.clickHandler('number') }
            ],
            rowAs: 'header'
          },
          {
            process: getSorter(),
            select: 'all',
            $do: [
              {
                section: 'body',
                className: 'unigrid-segment',
                $do: [
                  {
                    condition: { ifDoes: 'exist', property: 'list' },
                    fromProperty: 'list',
                    cells: [
                      'hCategory',
                      { as: 'empty', colSpan: 3 },
                      'hNumber'
                    ],
                    rowAs: 'header'
                  },
                  {
                    className: 'some-row-class',
                    cells: ['agent', 'date', 'street', ucFormatter('name'),
                      {
                        show: 'number',
                        as: 'string',
                        className: 'number-cell'
                      }]
                  },
                  {
                    condition: { ifDoes: 'exist', property: 'list' },
                    fromProperty: 'list',
                    process: getSorter(columnToFields),
                    select: 'all',
                    cells: [{ as: 'empty', colSpan: 3 }, 'name', 'number']
                  }
                ]
              }
            ]
          },
          {
            section: 'footer',
            className: 'unigrid-footer',
            $do: [
              { cells: [null, null, null, 'fSum', 'fTotal'] },
              { cells: [null, null, null, 'sum', 'total'] }
            ]
          }
        ]
      }
    };

    return (
      <div>
        <p>Example 4 : Sortable Multitable (no JSX)</p>
        <Unigrid {...props} ref={(ref) => { this.unigrid = ref; }} />
      </div>
    );
  }
}
