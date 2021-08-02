import * as React from 'react';
import { Space } from 'antd';
import Block from './Block';
import UnlimitedTree from './UnlimitedTree';
import './index.scss';

class LoopGrid extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: []
    }
  }

  /**
   * 初始化
   * @param {Array<Object>} data 
   */
  init(data) {
    // 处理数据
    data = data.map((item, i) => {
      return {
        ...item,
        root: i === 0, // 第一个参数设置为根节点
        leaf: i === data.length - 1, // 最后一设置为叶子节点
        index: i, // 索引
        children: [], // 子集
        keys: [], // 勾选中的key值
      };
    });
    // 生成双向链表
    data = data.map((item, i) => {
      item.prev = data[i - 1]; // 上一个商品属性值
      item.next = data[i + 1]; // 下一个商品属性值
      return item;
    });
    // 设置
    this.setState({ data });
    // 创建无限极树
    this.mutableTree = new UnlimitedTree((result) => {
      const extendData = [...this.state.data];
      // 找到对应的属性
      const record = extendData.find(item => item.id === result.id);
      // 设置子集
      record.children = result.children;
      // 设置显示
      this.setState({ data: extendData });
    });
  }

  /**
   * 创建属性
   * @param {Object} record 商品属性
   * @param {Array<Object>} propList 商品属性属性值列表
   */
  onInsertProps = (record, propList) => {
    // 如果是根节点
    if (record.root) {
      this.mutableTree.insertRootNode(record, propList);
    } else { // 不是根节点
      // 找到它的前面一个商品属性,选择了哪些属性值
      const parentPropLlist = record.prev.children.filter((item) => item.checked);
      // 在当前这些propKeys所对应的节点中插入children
      this.mutableTree.insertNormalNode(record, parentPropLlist, propList);
      // 找到选属性值的第一个值
      const [prop] = parentPropLlist;
      // 切换为选中
      this.onPropSelected(record.prev, prop);
    }
  }

  /**
   * 创建属性
   * @param {Object} record 商品属性
   * @param {Object} prop 商品属性属性值
   * @param {Boolean} checked 是否选中
   */
  onPropChecked = (record, prop, checked) => {
    // 找到属性节点
    const extendData = [...this.state.data];
    // 将当前节点下childen对应的属性修改为checked
    // 这里用了反模式直接将prop的checked属性修改了
    prop.checked = checked;
    // 设置目前已经全部选中的keys
    record.keys = record.children.filter(item => item.checked).map(item => item.id);
    // 更新数据
    this.setState({ data: extendData });
  }

  /**
   * 选择切换商品属性显示
   * @param {Object} record 商品属性
   * @param {Object} prop 当前被点击的商品属性值
   */
  onPropSelected = (record, prop) => {
    const data = [...this.state.data];
    // 当前这一级别商品属性值要选中其他的都清空
    // 反模式
    record.children.forEach((item) => {
      item.selected = item.id === prop.id;
    });
    // 找到当前被点击的商品属性下一级
    const nextRecord = record.next;
    // 如果下一级存在
    if (nextRecord) {
      nextRecord.children = prop.children;
    }
    // 设置商品属性
    this.setState({ data });
  }

  /**
   * 删除商品属性值
   * @param {Object} record 商品属性
   * @param {Object} prop 当前被点击的商品属性值
   */
  onPropDelete = (record, prop) => {
    const data = [...this.state.data];
    // 先删除tree中的数据
    this.mutableTree.deleteNode(prop);
    // 删除当前商品属性值
    record.children = record.children.filter(item => item.id !== prop.id);
    // 删除选中的keys
    record.keys = record.keys.filter(key => key !== prop.id);
    // 如果当前是选中的商品属性值，那么删除显示的数据
    while (record.next && prop.selected) {
      // 设置下一个商品属性
      record = record.next;
      // 清空商品属性
      record.children = [];
      // 清空选中的keys
      record.keys = [];
    }
    // 设置商品属性
    this.setState({ data });
  }

  /**
   * 获取数据
   */
  fetchData() {
    const data = this.mutableTree.recursionNode((node, children) => {
      const result = {
        propPropId: node.pid,
        propChoiId: node.id,
      };
      if (children) {
        result.propList = children;
      }

      return result;
    });

    return data;
  }

  render() {
    const { data } = this.state;

    if (!data.length) return null;

    return (
      <div className="LoopGridContainer">
        <Space size={8} align="start">
          {data.map((item) => {
            return (
              <Block
                key={item.id}
                record={item}
                onInsertProps={this.onInsertProps}
                onPropChecked={this.onPropChecked}
                onPropSelected={this.onPropSelected}
                onPropDelete={this.onPropDelete}
              />
            )  
          })}
        </Space>
      </div>
    );
  }
}

function uid() {
  return Math.random().toString(32).slice(2);
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.loopGridRef = React.createRef();
  }
  
  componentDidMount() {
    this.loopGridRef.current.init(this.mockRootNode());
  }

  mockRootNode() {
    return [{
      id: uid(),
      name: '规格'
    }, {
      id: uid(),
      name: '颜色'
    }, {
      id: uid(),
      name: '型号'
    }];
  }

  onClick = () => {
    console.log(this.loopGridRef.current.fetchData())
  }

  render() {
    return (
      <div style={{ padding: '24px' }}>
        <LoopGrid
          ref={this.loopGridRef}
        />
        <button onClick={this.onClick}>获取数据</button>
      </div>
    );
  }
}