import * as React from 'react';
import { Space, Button } from 'antd';
import * as Icon from '@ant-design/icons';


export default class Operation extends React.Component {
  static defaultProps = {
    count: 0, // 已选的总数量
    maxScreen: false, // 是否全屏
    onToggleScreen: () => {}, // 全屏切换
  }

  /**
   * 是否全屏
   * @param {Boolean} maxScreen 
   */
  onToggleScreen(maxScreen) {
    // 调用外部全屏
    this.props.onToggleScreen(maxScreen);
  }
  
  render() {
    const { title, count, maxScreen } = this.props;

    return (
      <div className="ExcelTableTitle">
        <div className="text">{title} <span> 总数：{count}</span></div>
        <div className="action">
          <Space size={8}>
            <Button onClick={() => this.onToggleScreen(!maxScreen)} type="link">
              {
                maxScreen
                ?
                  <>还原<Icon.FullscreenExitOutlined /></>
                :
                  <>全屏<Icon.FullscreenOutlined /></>
              }    
            </Button>
          </Space>
        </div>
      </div>
    )
  }
}