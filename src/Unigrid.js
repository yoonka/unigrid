import React from 'react';

export class UnigridTextCell extends React.Component {
  render() {
    return (<td>{this.props.text}</td>);
  }
}

export class UnigridRow extends React.Component {
  addCell(arr, cell, item, key) {
    let text = JSON.stringify(item[cell]);
    arr.push(<UnigridTextCell key={key} text={text} />);
  }

  render() {
    let cells = this.props.cells || [];
    let arr = [];
    for (let i=0; i<cells.length; i++) {
      this.addCell(arr, cells[i], this.props.item, i);
    }
    return (<tr>{arr}</tr>);
  }
}

export class Unigrid extends React.Component {

  constructor() {
    super();
    this._index = 0;
  }

  newKey() {
    return this._index++;
  }

  makeNumberIterator(data, select) {
    var delivered = false;
    return {
      next: function() {
        if (!delivered && select >=0 && select < data.length) {
          delivered = true;
          return {value: data[select], done: false};
        }
        return {done: true};
      }
    }
  }

  makeAllIterator(data) {
    var nextIndex = 0;
    return {
      next: function() {
        return nextIndex < data.length ?
          {value: data[nextIndex++], done: false} : {done: true};
      }
    }
  }

  makeStringIterator(data, select) {
    if (select === "all") {
      return this.makeAllIterator(data);
    }
  }

  makeIterator(data, select) {
    switch (typeof(select)) {
    case "number": return this.makeNumberIterator(data, select);
    case "string": return this.makeStringIterator(data, select);
    }
  }

  executeSelect(select, cfg, ctx, acc) {
    let it = {[Symbol.iterator]: () => this.makeIterator(ctx.list, select)};
    for (let i of it) {
      let newCtx = {list: ctx.list, item: i};
      this.addRows(acc, cfg, newCtx)
    }
  }

  shouldSkip(condition, item) {
    if (condition.hasOwnProperty("ifDoes")) {
      if (condition.ifDoes === "exist") {
        if (condition.hasOwnProperty("property")) {
          if (!item.hasOwnProperty(condition.property)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  toElem(section) {
    switch (section) {
    case "header": return "thead";
    case "body":   return "tbody";
    case "footer": return "tfoot";
    }
  }

  addRow(acc, cells, as, item) {
    let key = this._index++;
    acc.push(<UnigridRow key={key} cells={cells} as={as} item={item} />);
  }

  addRows(acc, cfg, ctx) {
    for(let i=0; i<cfg.length; i++) {
      let c=cfg[i];

      if (c.hasOwnProperty("condition")) {
        if (this.shouldSkip(c.condition, ctx.item)) continue;
      }

      if (c.hasOwnProperty("section")) {
        let elem = this.toElem(c.section);
        let children = this.createTable(c.show, ctx);
        let key = this.newKey();
        acc.push(React.createElement(elem, {key: key}, children));
      } else if (c.hasOwnProperty("select")) {
        let newCtx = c.hasOwnProperty("from") ?
            {list: ctx.item[c.from], item: ctx.item} : ctx;
        this.executeSelect(c.select, c.show, newCtx, acc);
      } else if (c.hasOwnProperty("cells")) {
        this.addRow(acc, c.cells, c.as, ctx.item);
      }
    }
  }

  createTable(cfg, ctx) {
    let acc = [];
    this.addRows(acc, cfg, ctx);
    return acc;
  }

  render() {
    console.log(this.props);

    var ctx = {list: this.props.data, item: null};
    return (<table>{this.createTable(this.props.table, ctx)}</table>);
  }
}
