import * as React from 'react';


export default class Colgroup extends React.Component {
  
  render() {
    const { data, fixedColumnWidth, columnWidth } = this.props;

    return (
      <colgroup>
        <col style={{ minWidth: `${fixedColumnWidth}px` }} />
        {data.xAxis.map((item) => {
          return (
            <col key={item.value} style={{ minWidth: `${columnWidth}px` }} />
          );
        })}
      </colgroup>
    );
  }
}