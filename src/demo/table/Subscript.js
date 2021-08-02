import * as React from 'react';
import Cell from './Cell';

export default class Subscript extends React.Component {
  constructor(props) {
    super(props);
    this.slashDOMRef = React.createRef();
  }

  /**
   * 创建斜线
   */
  createSlash() {
    // 获取th的dom元素
    const element = this.slashDOMRef.current;
    // 计算宽高
    const width = element.offsetWidth;
    const height = element.offsetHeight;
    // 创建canvas
    const canvas = document.createElement('canvas');
    canvas.setAttribute('style', 'position: absolute; left: 0; top: 0; z-index: -1');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    // 创建连线
    ctx.moveTo(0, 0);
    ctx.lineTo(width, height);
    ctx.strokeStyle = '#ccc';
    ctx.stroke();
    // 插入
    element.appendChild(canvas);
  }

  render() {
    const { subTexts } = this.props;
    const [leftText, rightText] = subTexts;

    return (
      <th className="FixedColumn slash" ref={this.slashDOMRef} rowSpan={2}>
        <Cell isCorn>
          <div className="subscript">
            <span className="left">{leftText}</span>
            <span className="right">{rightText}</span>
          </div>
        </Cell>
      </th>
    );
  }
}