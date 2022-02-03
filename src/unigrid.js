import React from 'react';
import { isDefined, cleanProps, newChildren } from 'src/helpers';
import { getIterator } from 'src/iterators';

export default class Unigrid extends React.Component {
    constructor(props) {
        super(props);
        this.state = isDefined(this.props, 'box') ? this.props.box : undefined;
    }

    static isUnigrid() {
        return true;
    }

    static create(oProps, oBox) {
        const nProps = Object.assign({}, oProps.table || {}, oProps);
        const { table, data, item, box, cellTypes, ...cfg } = nProps;
        const children = newChildren(cfg, oBox, oProps, data, item);
        const cleaned = cleanProps(nProps);
        return React.createElement(cfg.renderAs || 'table', cleaned, children);
    }

    getBox() {
        return this.box || this.props.box || {};
    }

    setBox(box) {
        this.box = box;
        this.setState(box);
    }

    render() {
        return Unigrid.create(this.props, this.getBox());
    }
}
