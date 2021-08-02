import * as React from 'react';
import classnames from 'classnames';

export default class Range extends React.Component {
  static defaultProps = {
    uid: '', // 元素id
  }

  constructor(props) {
    super(props);
    const { uid } = props;
    // 四条边框id
    this.topId = `top@${uid}`;
    this.rightId = `right${uid}`;
    this.buttomId = `bottom${uid}`;
    this.leftId = `left${uid}`;

    this.state = {
      // 左边界提示与上边界提示
      leftBounds: {
        height: 0, // 高度
        values: [], // 显示值
      },
      topBounds: {
        width: 0, // 宽度
        values: [], // 显示值
      },
      // 四条边框是否显示
      sideVisible: true,
      // 左、上边界是否显示
      boundVisible: true,
    };
  }

  /**
   * 设置左右边界值
   * @param {Object} bounds 左右边界值 
   */
  setBounds(bounds) {
    const { leftBounds, topBounds } = bounds;

    this.setState({
      leftBounds,
      topBounds,
    });
  }

  /**
   * 设置边界显示与否
   * @param {Boolean} visible 
   */
  setBoundVisible(visible = false) {
    // 避免性能浪费
    if (visible !== this.state.visible) {
      this.setState({ boundVisible: visible });
    }
  }

  render() {
    const { leftBounds, topBounds, boundVisible } = this.state;

    return (
      <>
        {/* 左边与上边界显示提示值 */}
        <div 
          className={classnames({ ExcelTableRangeBoundLeft: true, visible: boundVisible })}
          style={leftBounds.style}
        >
          {leftBounds.values.map((value) => {
            return (
              <div key={value}>{value}</div>
            );
          })}
        </div>
        <div
          className={classnames({ ExcelTableRangeBoundTop: true, visible: boundVisible })}
          style={topBounds.style}
        >
          {topBounds.values.map((value) => {
            return (
              <div key={value}>{value}</div>
            );
          })}
        </div>
      </>
    );
  }
}
