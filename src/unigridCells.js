import React from 'react';
import { cleanCellProps } from 'src/helpers';

export const UnigridEmptyCell = (p) => {
  const cleaned = cleanCellProps(p);
  const Tx = p.Tx;
  return (<Tx {...cleaned} />);
}

export const UnigridTextCell = (p) => {
  const cleaned = cleanCellProps(p);
  const Tx = p.Tx;
  return (<Tx {...cleaned} >{p.cell}</Tx>);
}

export const UnigridNumberCell = (p) => {
  const cleaned = cleanCellProps(p);
  const Tx = p.Tx;
  return (<Tx {...cleaned} >{p.cell.toString()}</Tx>);
}
