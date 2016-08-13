import React from 'react';

export class UnigridTextCell extends React.Component {
  render() {
    return (<td>{this.props.text}</td>);
  }
}

export class UnigridRow extends React.Component {
  render() {
    return (
      <tr>
      <UnigridTextCell text="dummy text" />
      </tr>
    );
  }
}

export class UnigridHeader extends React.Component {
  render() {
    return (
      <thead>
      <UnigridRow />
      </thead>
    );
  }
}

export class UnigridSection extends React.Component {
  render() {
    return (
      <tbody>
      <UnigridRow />
      </tbody>
    );
  }
}

export class UnigridFooter extends React.Component {
  render() {
    return (
      <tfoot>
      <UnigridRow />
      </tfoot>
    );
  }
}

export class Unigrid extends React.Component {
  render() {
    console.log(this.props);

    var blocks = [];
    for(let i=0, t=this.props.table; i < t.length; i++) {
      switch (t[i].as) {
      case "header": blocks.push(<UnigridHeader key={i} />);
        break;
      case "section": blocks.push(<UnigridSection key={i} />);
        break;
      case "footer": blocks.push(<UnigridFooter key={i} />);
        break;
      }
    }

    return (
      <table>{blocks}</table>
    );
  }
}
