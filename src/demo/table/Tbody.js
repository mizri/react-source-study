import * as React from 'react';
import Row from './Row';

export default class Tbody extends React.Component {
  
  render() {
    const { data, isInput } = this.props;

    return (
      <tbody>
        {data.yAxis.map((item, iy) => {
          return (
            <Row
              data={data}
              recordY={item}
              value={item.value}
              key={item.value}
              isInput={isInput}
              iy={iy}
            />
          )
        })}
      </tbody>
    );
  }
}


