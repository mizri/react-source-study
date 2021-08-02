import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Checkbox, Button, message } from 'antd';
import * as Icon from '@ant-design/icons';
import classnames from 'classnames';
import PropListModal from './PropListModal';

const noop = () => {};

export default class LoopGrid extends React.Component {
  static defaultProps = {
    // 创建节点方法
    onInsertProps: noop,
    // 勾选商品属性值
    onPropChecked: noop,
    // 选中商品属性值
    onPropSelected: noop,
    // 删除商品属性值
    onPropDelete: noop,
    // 商品属性
    record: {},
  }

  constructor(props) {
    super(props);
    // 创建弹窗组件容器实例引用
    this.propListModalDOMRef = React.createRef();
    // 属性值
    this.state = {
      loading: false, // 添加参数loading
    }
  }

  /**
   * 创建显示属性弹窗
   * @param {Object} record 商品属性对象
   */
  onPropListModalShow = (record) => {
    // 如果当时是不是根节点,需要判断前面商品商品属性值的checkbox是否勾选
    if (!record.root) {
      // 获取它的左边商品属性勾选的值
      const { keys, name } = record.prev;
      // 如果未勾选提示
      if (!keys.length) {
        return message.error(`请勾选【${name}】属性`);
      }
    }
    // loading true
    this.setState({ loading: true });
    // 获取属性值
    this.fetchPropList().then((data) => {
      ReactDOM.render(
        <PropListModal
          label={record.name}
          data={data}
          onCancel={this.onPropListModalHidden}
          onConfirm={this.onPropListModalConfirm}
        />,
        this.propListModalDOMRef.current
      )
    }).finally(() => this.setState({ loading: false }));
  }

  /**
   * 销毁显示属性弹窗
   */
  onPropListModalHidden = () => {
    ReactDOM.unmountComponentAtNode(this.propListModalDOMRef.current);
  }

  /**
   * 确认选择的属性
   * @param {object} recrod 商品属性
   * @param {Array<Object>} propList 商品属性值列表
   */
   onPropListModalConfirm = (propList) => {
    const { record } = this.props;
    // 调用父组件增加属性节点
    this.props.onInsertProps(record, propList);
    // 关闭弹窗
    this.onPropListModalHidden();
  }

  /**
   * 勾选全部商品属性值
   * @param {object} record 商品属性
   * @param {Boolean} checked 是否勾选
   */
  onPropCheckedAll(record, checked) {
    record.children.forEach((prop) => {
      this.props.onPropChecked(record, prop, checked);
    });
  }

  /**
   * 勾选商品属性下的属性
   * @param {object} record 商品属性
   * @param {object} prop 商品属性属性值
   * @param {Boolean} checked 是否勾选
   */
  onPropChecked(record, prop, checked) {
    this.props.onPropChecked(record, prop, checked);
  }

  /**
   * 商品属性商品属性值
   * @param {Object} record 
   * @param {Object} prop 
   */
  onPropSelected(record, prop) {
    this.props.onPropSelected(record, prop);
  }

  /**
   * 商品属性商品属性值删除
   * @param {Object} record 
   * @param {Object} prop 
   */
  onPropDelete(record, prop) {
    this.props.onPropDelete(record, prop);
  }

  /**
   * 根据属性id获取属性值列表
   * @param {Object} record 
   */
  fetchPropList(record) {
    return new Promise((resolve) => {
      function uid() {
        return Math.random().toString(32).slice(2);
      }

      setTimeout(() => {
        resolve([{
          id: uid(),
          value: uid(),
        }, {
          id: uid(),
          value: uid(),
        }, {
          id: uid(),
          value: uid(),
        }]);
      }, 1000);
    });
  }

  render() {
    const { record } = this.props;
    const { loading } = this.state;
    // 是否有下一级
    const isNext = !!record.next;

    return (
      <React.Fragment>
        {/* 弹窗组件挂载 */}
        <div ref={this.propListModalDOMRef} />
        <div className="LoopGridBlock">
          <dt className="header">
            <span className="check">
              {
                isNext
                  &&
                <Checkbox
                  checked={record.keys.length && record.keys.length === record.children.length}
                  onChange={(event) => this.onPropCheckedAll(record, event.target.checked)}
                />
              }
            </span>
            <span className="text">{record.name}</span>
            <span className="action">
              <Button
                loading={loading}
                size="small"
                type="link"
                onClick={() => this.onPropListModalShow(record)}
              >
                <Icon.PlusOutlined />参数
              </Button>
            </span>
          </dt>
          {record.children.map((item) => {
            return (
              <dd
                key={item.id}
                className={classnames({ row: true, selected: item.selected  })}
                onClick={() => this.onPropSelected(record, item)}
              >
                <span className="check">
                  {
                    isNext
                      &&
                    <Checkbox
                      checked={item.checked}
                      onChange={(event) => this.onPropChecked(record, item, event.target.checked)}
                      onClick={event => event.stopPropagation()}
                    />
                  }
                </span>
                <span className="text">{item.value}</span>
                <span className="action">
                  <Button
                    onClick={(event) => {
                      event.stopPropagation();
                      this.onPropDelete(record, item);
                    }}
                    size="small"
                    type="link"
                  >
                    <Icon.DeleteOutlined />
                  </Button>
                </span>
              </dd>
            );
          })}
        </div>
      </React.Fragment>
    );
  }
}