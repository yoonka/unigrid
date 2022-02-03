import React from 'react';
import { tableData } from './data/Resp1';
import {
  Unigrid,
  UnigridEmptyCell,
  UnigridTextCell,
  isDefined,
  idMaker
} from '../unigrid';

export class UnigridExample1 extends React.Component {
  handleClick() {
    console.log(this.props.item);
  }

  showFun(props) {
    return props.item.hCategory;
  }

  showFun2() {
    return 'testValue';
  }

  render() {

    const idCounter = idMaker();
    const mkKey = () => idCounter.next().value;

    const props = {
      data: tableData,
      table: {
        className: 'unigrid-main-class',
        $do: [
          {
            section: 'header',
            className: 'unigrid-header',
            $do: [
              {
                cells: [
                  { show: 'hAgent', as: UnigridTextCell },
                  'hDate',
                  'hStreet',
                  { show: 'hName', as: 'string', className: 'name-header-cell' },
                  'hNumber'
                ],
                rowAs: 'header'
              }
            ]
          },
          {
            select: 'all',
            $do: [
              {
                section: 'body',
                className: 'unigrid-segment',
                $do: [
                  {
                    condition: { ifDoes: 'exist', property: 'list' },
                    fromProperty: 'list',
                    select: 0,
                    $do: [
                      {
                        cells: [
                          'hCategory',
                          { as: 'empty', colSpan: 1 },
                          { show: this.showFun },
                          this.showFun2,
                          'hNumber'],
                        rowAs: 'header'
                      }
                    ]
                  },
                  {
                    condition: { ifDoes: 'exist', property: 'list' },
                    fromProperty: 'list',
                    $do: [
                      {
                        cells: [
                          { cell: 'category2' },
                          { as: 'empty', colSpan: 3 },
                          'hNumber'],
                        rowAs: 'header'
                      }
                    ]
                  },
                  {
                    className: 'some-row-class',
                    cells: [
                      'agent', 'date', 'street', 'name',
                      {
                        show: 'number',
                        as: 'string',
                        className: 'number-cell',
                        onClick: this.handleClick,
                        bindToCell: 'onClick'
                      }]
                  },
                  {
                    condition: { ifDoes: 'exist', property: 'list' },
                    fromProperty: 'list',
                    select: 'all',
                    $do: [
                      {
                        cells: [{ as: 'empty', colSpan: 3 }, 'name', 'number'],
                        mixIn: {
                          onClick: this.handleClick,
                          bindToCell: 'onClick'
                        }
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            section: 'footer',
            className: 'unigrid-footer',
            $do: [
              {
                select: 0,
                $do: [
                  { cells: [null, null, null, 'fSum', 'fTotal'] },
                  { cells: [null, null, null, 'sum', 'total'] }
                ]
              }
            ]
          }
        ]
      },
      cellTypes: {
        empty: UnigridEmptyCell,
        string: UnigridTextCell
      }
    };

    return (
      <div>
        <p>Example 1 : Multitable (no JSX)</p>
        <Unigrid {...props} />
      </div>
    );
  }
}
