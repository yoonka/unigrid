import React from 'react';
import { tableData } from './data/resp1';
import {
  Unigrid,
  UnigridEmptyCell,
  UnigridTextCell
} from '../unigrid';

export class UnigridExample6 extends React.Component {
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
      <div>
        <p>Example 6 : Multitable (JSX - generic components)</p>
        <Unigrid data={tableData} cellTypes={cellTypes}>
          <Unigrid className={'unigrid-main-class'}>
            <Unigrid section={'header'} className={'unigrid-header'}>
              <Unigrid rowAs={'header'} cells={[
                { show: 'hAgent', as: UnigridTextCell },
                'hDate',
                'hStreet',
                { show: 'hName', as: 'string', className: 'name-header-cell' },
                'hNumber'
              ]}
              />
            </Unigrid>
          </Unigrid>
          <Unigrid select={'all'}>
            <Unigrid section={'body'} className={'unigrid-segment'}>
              <Unigrid condition={{ ifDoes: 'exist', property: 'list' }}
                fromProperty={'list'}
                rowAs={'header'}
                cells={[
                  'hCategory',
                  { as: 'empty', colSpan: 3 },
                  'hNumber'
                ]}
              />
              <Unigrid condition={{ ifDoes: 'exist', property: 'list' }}
                fromProperty={'list'}
                rowAs={'header'}
                cells={[
                  { cell: 'category2' },
                  { as: 'empty', colSpan: 3 },
                  'hNumber'
                ]}
              />
              <Unigrid className={'some-row-class'}
                cells={['agent', 'date', 'street', 'name',
                  {
                    show: 'number',
                    as: 'string',
                    className: 'number-cell',
                    onClick: this.handleClick,
                    bindToCell: ['onClick']
                  }
                ]}
              />
              <Unigrid condition={{ ifDoes: 'exist', property: 'list' }}
                fromProperty={'list'}
                select={'all'}
              >
                <Unigrid
                  cells={[{ as: 'empty', colSpan: 3 }, 'name', 'number']}
                  mixIn={{ onClick: this.handleClick, bindToCell: 'onClick' }}
                />
              </Unigrid>
            </Unigrid>
          </Unigrid>
          <Unigrid section={'footer'} className={'unigrid-footer'}>
            <Unigrid cells={[null, null, null, 'fSum', 'fTotal']} />
            <Unigrid cells={[null, null, null, 'sum', 'total']} />
          </Unigrid>
        </Unigrid>
      </div>
    );
  }
}
