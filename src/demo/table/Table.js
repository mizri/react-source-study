import * as React from 'react';

export default class Table extends React.Component {
  shouldComponentUpdate(nextProps) {
    return this.props.needUpdate !== nextProps.needUpdate;
  }

  render() {
    return (
      <table>
        {this.props.children}
      </table>
    );
  }
}