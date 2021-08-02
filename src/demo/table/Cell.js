import * as React from 'react';
import classnames from 'classnames';
import refs from './refs';
import Selection from './Selection';
// import { Tooltip } from 'antd';

export default class Cell extends React.Component {
  static defaultProps = {
    isCorn: false, // 是否有角标 
    recordY: {}, // y坐标对象
    recordX: {}, // x轴坐标对象
    style: {}, // 额外的样式
    tag: 'corn', // 是否tbody中的正式元素
    xy: [0, 0],  // 坐标索引
  }

  constructor(props) {
    super(props);
    const { recordX, recordY } = props;
    // 创建DOM实例引用
    this.cellDOMRef = React.createRef();
    // 创建输入框实例引用
    this.inputDOMRef = React.createRef()
    // 将x，y坐标值设置为属性
    this.xyValues = [recordX.value, recordY.value];
    // 设置索引位置
    const [x, y] = props.xy;
    this.x = x;
    this.y = y;
    // 设置id
    this.index = props.xy.join('@'); // 当前节点索引x,y轴@符号拼接 比如 1@2

  }

  state = {
    // active: false, // 是否激活状态
    selected: false, // 是否选中
  }

  // 输入框input值
  get num() {
    return this.inputDOMRef.current.value;
  }

  set num(value) {
    this.inputDOMRef.current.value = value;
  }

  // 是否选中存取属性
  get selected() {
    return this.state.selected;
  }

  set selected(value) {
    throw new Error('can not set `cell selected`');
  }

  // 获取是否被选中返回数据存取属性器
  get data() {
    const { recordX, recordY } = this.props;
    return {
      xExtra: recordX.extra, // 额外的数据
      yExtra: recordY.extra, // 额外的数据
      x: { value: recordX.value }, // x轴所对应的值
      y: { value: recordY.value }, // y轴所对应的值
      num: this.num, // 数量
    };
  }

  set data(value) {
    throw new Error('can not set `cell data`');
  }

  // 当前cell所隶属的选区
  rangeRefsId = []

  componentDidMount() {
    const { tag } = this.props;
    // 将node节点实例已经cell
    if (tag === 'cell') {
      refs.push(this);
    }
  }

  /**
   * 获取焦点增加样式
   * 失去焦点移除样式
   * @param {Boolean} active 
   */
  onToggleActive(active) {
    this.setState({ active });
  }

  /**
   * 获取焦点增加样式
   * 失去焦点移除样式
   * @param {Boolean} selected
   * @param {String} rangeId
   */
  onToggleSelected(selected, rangeId) {
    const pos = this.rangeRefsId.indexOf(rangeId);
    // 是选中
    if (selected) {
      // 如果已经存在那么不需要添加
      pos === -1 && this.rangeRefsId.push(rangeId);
    } else {
      this.rangeRefsId.splice(pos, 1);
      // 删除一个以后，如果还存在选区id,那么应该认为是选中
      selected = !!this.rangeRefsId.length;
    }
    // 设置cell是否选中
    this.setState({ selected });
  }
  
  /**
   * 清空所有rangeRefsis并且设为不选中
   */
  clear() {
    this.rangeRefsId = [];
    this.setState({ selected: false });
  }

  /**
   * 值修改
   * @param {Object} event 
   */
  onChange(event) {
    event.target.value = event.target.value.replace(/\D/, '');
  }

  /**
   * 失去焦点移除样式
   */
  onBlur = () => {
    this.onToggleActive(false);
  }

  /**
   * input获取焦点
   * @param {Object} event 
   */
  onFocus = (event) => {
    // 全选
    event.target.select && event.target.select();
    // 激活选中状态
    this.onToggleActive(true);
  }

  /**
   * 当前cell元素被点击如果是isInput状态下
   * 让input获取焦点
   */
  onClick = () => {
    this.inputDOMRef.current.focus();
  }

  /**
   * 鼠标移入如果当前是被选中的cell那么显示坐标
   * @param {Boolean} selected
   * @param {String} rangeId
   */
  onMouseOver = (event) => {
    // 查询出选区，然后显示选区的边界
    Selection.showRangeBounds(this.rangeRefsId);
  }

  render() {
    const { isCorn, style = {}, tag, isInput } = this.props;
    const { active, selected } = this.state;
    const [xValue, yValue] = this.xyValues;

    return (
      // <Tooltip title={`${xValue}/${yValue}`}>
      <div
        title={`${xValue}/${yValue}`}
        onMouseOver={this.onMouseOver}
        onClick={this.onClick}
        data-tag={tag}
        ref={this.cellDOMRef}
        id={this.index}
        style={style}
        className={classnames({
          ExcelTableCell: true,
          isCorn,
          active,
          selected,
        })}
      >
        {
            isInput
          ?
            <input
              className={classnames({ 'ExcelTableNode': true, selected })}
              ref={this.inputDOMRef}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              onChange={this.onChange}
            />
          :
            this.props.children
        }
      </div>
      // </Tooltip>
    )
  }
}