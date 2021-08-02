import * as React from 'react';
import classnames from 'classnames';
import Table from './Table';
import Colgroup from './Colgroup';
import Cell from './Cell';
import Subscript from './Subscript';

export default class Thead extends React.Component {
  constructor(props) {
    super(props);
    // 真实dom引用
    this.DOMRef = React.createRef();
    // 标签引用
    this.subscriptRef = React.createRef();
  }

  /**
   * 创建对角线
   */
   createSlash() {
    this.subscriptRef.current.createSlash();
  }
  
  render() {
    const {
      data, subTexts, isScroll,
      fixedColumnWidth, columnWidth,
      needUpdate
    } = this.props;
    
    return (
      <div
        className={classnames({ ExcelTableHeader: true, isScroll })}
        ref={this.DOMRef}
      >
        <Table needUpdate={needUpdate}>
          {/* 列控制 */}
          <Colgroup
            data={data}
            fixedColumnWidth={fixedColumnWidth}
            columnWidth={columnWidth}
          />
          {/* 表头 */}
          <thead>
            <tr>
              <Subscript subTexts={subTexts} ref={this.subscriptRef} />
              <th colSpan={data.xAxis.length}>
                <Cell isCorn>
                  <>&nbsp;</>
                </Cell>
              </th>
            </tr>
            <tr>
              {data.xAxis.map((item) => {
                return (
                  <th style={{ position: 'relative' }} key={item.value}>
                    <Cell isCorn>
                      <>{item.value}</>
                    </Cell>
                  </th>
                );
              })}
            </tr>
          </thead>
        </Table>
      </div>
    );
  }
}