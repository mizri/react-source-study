import * as React from 'react';

export default class Col extends React.Component  {
  static defaultProps = {
    className: '',
    style: {},
  }

  componentDidMount() {
    // console.log('aaaa');
  }
  
  shouldComponentUpdate(nextProps) {
    return this.props.value !== nextProps.value;
  }

  render() {
    const { className, style } = this.props;

    return (
      <td className={className} style={style}>
        {this.props.children}
      </td>
    );
  }
}