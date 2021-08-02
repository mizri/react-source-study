import * as React from 'react';
import Cell from './Cell';
import Col from './Col';

export default class Row extends React.Component {
  static defaultProps = {
    data: { xAxis: [], yAxis: [] }, // x,y轴数据列表
    isInput: false, // 是否是输入模式
    iy: 0, // y轴坐标索引
    recordY: {}, // y轴坐标数据
  }

  shouldComponentUpdate(nextProps) {
    const thisPropsData = this.props.data;
    const nextPropsData = nextProps.data;
    return thisPropsData.xAxis.length !== nextPropsData.xAxis.length;
  }

  render() {
    const { data, isInput, iy, recordY } = this.props;

    return (
      <tr>
        <Col value={recordY.value} className="FixedColumn">
          <Cell isCorn><>{recordY.value}</></Cell>
        </Col>
        {data.xAxis.map((item, ix) => {
          // 索引
          const xy = [ix, iy];

          return (
            <Col value={item.value} key={ix}>
              <Cell
                tag="cell"
                recordY={recordY}
                recordX={item}
                xy={xy}
                isInput={isInput}
              >
                <>&nbsp;</>
              </Cell>
            </Col>
          );
        })}
      </tr>
    );
  }
}