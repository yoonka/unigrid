import React from 'react';
import { tableData } from './data/Resp8';
import {
  Unigrid,
  UnigridHeader,
  UnigridSegment,
  UnigridRow,
  UnigridTextCell
} from '../unigrid';

export class UnigridExample12 extends React.Component {
  render() {
    return (
      <div>
        <p>Example 12 : Conditional rendering</p>
        <Unigrid data={tableData}>
          <UnigridHeader rowAs={'header'}>
            <UnigridRow>
              <UnigridTextCell cell="a" />
              <UnigridTextCell cell="b" />
              <UnigridTextCell cell="c" />
            </UnigridRow>
          </UnigridHeader>
          <UnigridSegment>
            <Unigrid
              condition={{ ifDoes: 'exist', property: 'w' }}
              fromProperty={'w'}
            >
              <UnigridRow>
                <UnigridTextCell show="d" />
                <UnigridTextCell show="e" />
                <UnigridTextCell show="f" />
              </UnigridRow>
            </Unigrid>
            <Unigrid
              condition={{ ifDoes: 'exist', property: 'abc' }}
              fromProperty={'w'}
            >
              <UnigridRow>
                <UnigridTextCell show="d" />
                <UnigridTextCell show="e" />
                <UnigridTextCell show="f" />
              </UnigridRow>
            </Unigrid>
            <Unigrid
              condition={{ ifDoes: 'equal', property: 't', value: 'test' }}
              fromProperty={'x'}
            >
              <UnigridRow>
                <UnigridTextCell show="d" />
                <UnigridTextCell show="e" />
                <UnigridTextCell show="f" />
              </UnigridRow>
            </Unigrid>
            <Unigrid
              condition={{ ifDoes: 'equal', property: 't', value: 'testabc' }}
              fromProperty={'x'}
            >
              <UnigridRow>
                <UnigridTextCell show="d" />
                <UnigridTextCell show="e" />
                <UnigridTextCell show="f" />
              </UnigridRow>
            </Unigrid>
            <Unigrid
              condition={{ ifDoes: 'notExist', property: 'not' }}
              fromProperty={'y'}
            >
              <UnigridRow>
                <UnigridTextCell show="d" />
                <UnigridTextCell show="e" />
                <UnigridTextCell show="f" />
              </UnigridRow>
            </Unigrid>
            <Unigrid
              condition={{ ifDoes: 'notExist', property: 'w' }}
              fromProperty={'y'}
            >
              <UnigridRow>
                <UnigridTextCell show="d" />
                <UnigridTextCell show="e" />
                <UnigridTextCell show="f" />
              </UnigridRow>
            </Unigrid>
            <Unigrid
              condition={{ ifDoes: 'notEqual', property: 't', value: 'abc' }}
              fromProperty={'z'}
            >
              <UnigridRow>
                <UnigridTextCell show="d" />
                <UnigridTextCell show="e" />
                <UnigridTextCell show="f" />
              </UnigridRow>
            </Unigrid>
            <Unigrid
              condition={{ ifDoes: 'notEqual', property: 't', value: 'test' }}
              fromProperty={'z'}
            >
              <UnigridRow>
                <UnigridTextCell show="d" />
                <UnigridTextCell show="e" />
                <UnigridTextCell show="f" />
              </UnigridRow>
            </Unigrid>
          </UnigridSegment>
        </Unigrid>
      </div>
    );
  }
}
