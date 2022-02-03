import React from 'react';
import { cleanProps, createChildren } from 'src/helpers';

export class UnigridSection extends React.Component {
    static _getSectionComponent(section) {
        switch (section) {
            case 'header': return UnigridHeader;
            case 'body': return UnigridSegment;
            case 'footer': return UnigridFooter;
        }
    }

    static create(cfg, box, props, counter, section, data, item) {
        let children = createChildren(cfg, box, props, counter, data, item);
        const cleaned = cleanProps(cfg);
        Object.assign(cleaned, {
            children: children, unfolded: true, key: counter.next().value
        });
        return React.createElement(this._getSectionComponent(section), cleaned);
    }

    makeElement(name) {
        const { unfolded, box, sectionCounter, data, item, ...cfg } = this.props;
        let children = this.props.children;
        if (!unfolded) {
            children = createChildren(
                cfg, box, cfg, sectionCounter, data, item);
        }
        const cleaned = cleanProps(cfg);
        return React.createElement(name, cleaned, children);
    }
}

export class UnigridHeader extends UnigridSection {
    render() { return this.makeElement(this.props.renderAs || 'thead'); }
}

export class UnigridSegment extends UnigridSection {
    render() { return this.makeElement(this.props.renderAs || 'tbody'); }
}

export class UnigridFooter extends UnigridSection {
    render() { return this.makeElement(this.props.renderAs || 'tfoot'); }
}
