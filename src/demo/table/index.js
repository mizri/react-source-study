
import * as React from 'react';
import classnames from 'classnames';
import Operation from './Operation';
import Table from './Table';
import Colgroup from './Colgroup';
import Thead from './Thead';
import Tbody from './Tbody';
import Selection from './Selection';
import refs from './refs';
import { ModeTransition, ModeViewport, ModeScroll } from './modeRender';
import './index.scss';

class ExcelTable extends React.Component {
  static defaultProps = {
    scrollY: '600', // 纵向滚动容器的最大高度
    subTexts: ['球镜', '柱镜'], // 表格左上角角标文字
    fixedColumnWidth: 80, // 第一行固定列宽
    columnWidth: 64, // 其他列宽
    title: '商品属性批量添加', // 显示的文字
    initNum: [45, 25], // 首次默认加载多少行，横向、纵向
    scrollNum: 10, // 分批加载的每次加载数量
    isInput: false, // 是否支持输入
    // transition: 过渡模式加载  viewport: 视口模式 scroll: 滚动模式
    // 初始化使用的模式由whichModeDecision决定
    mode: null,
  }

  constructor(props) {
    super(props);
    // 容器实例引用
    this.tableContainerDOMRef = React.createRef();
    // 表格头组件实例
    this.theadRef = React.createRef();
    // 表体实例组件
    this.tbodyRef = React.createRef();
    // 滚动框实例引用
    this.scrollDOMRef = React.createRef();
    // loading框实例
    this.spinDOMRef = React.createRef();
    // 定时器
    this.timer = null
    // 原始数据
    this.sourceData = {}
    // 滚动位置
    this.scrollPostion = [0, 1] 
    // 状态
    this.state = {
      isScroll: false, // 是否滚动中
      data: { xAxis: [], yAxis: [] }, // 坐标系数据
      needUpdate: Math.random(), // 表格的表头与表体是否需要更新
      ranges: [], // 范围选区列表组件
      unselect: false, // 禁止选择选择
      count: 0, // 已选择总数
      maxWidth: 'initial', // 横向最大宽度
      maxHeight: `${props.scrollY}px`, //  纵向最大宽度
    }
  }

  componentWillUnmount() {
    // 销毁清空所有实例，清空整个选区
    Selection.destory();
  }

  /**
   * 初始化数据
   * @param {Object} data 数据 
   */
  init(data) {
    // 原始数据
    this.sourceData = data;
    // x轴数据,y轴数据
    const { xAxis, yAxis } = data;
    // 渲染首屏数据
    this.renderAboveFold(xAxis, yAxis).then(([restXAxis, restYAxis]) => {
      // 初始化选区范围
      Selection.init(this.scrollDOMRef.current, (ranges) => {
        return new Promise((resolve) => {
          // 设置选区
          this.setState({ ranges }, resolve);
        });
      }, this.props.isInput);
      // 首屏是否把所有的数据加载完毕，是否需要继续使用模式加载
      if (restXAxis.length || restYAxis.length) {
        // 决策该使用那种模式
        const mode = this.whichModeDecision(xAxis.length, yAxis.length);
        // 过渡模式
        if (mode === 'transition') {
          this.initRunTaskTransition(restXAxis, restYAxis);
        } else if (mode === 'viewport') { // 视口模式
          this.initRunTaskViewport(xAxis, yAxis);
        } else if (mode === 'scroll') { // 滚动加载模式
          this.initRunTaskScroll(xAxis, yAxis);
        }
      }
    }).then(() => {
      // 计算宽度
      this.computerWidth(xAxis.length);
    })
  }

  /**
   * 计算表格宽度
   * @param {Number}} length 
   */
  computerWidth(length) {
    let maxWidth = 'initial';
    // 滚动容器宽度
    const { offsetWidth } = this.scrollDOMRef.current;
    // 表格实际跨度
    const tableWidth = 64 * length + 80 + 2;
    if (tableWidth < offsetWidth) {
      maxWidth = `${tableWidth}px`;
    }
    // 设置宽度
    this.setState({ maxWidth });
    // 重新创建横线
    this.theadRef.current.createSlash();
  }

  /**
   * 获取选区数据
   */
  fetchData() {
    return refs.data;
  }

  /**
   * 首屏加载数据
   * @param {Array<Object>} xAxis x轴代理数据
   * @param {Array<Object>} yAxis y轴代理数据
   */
  renderAboveFold(xAxis, yAxis) {
    return new Promise((resolve) => {
      // 首屏需要加载的数据
      const { initNum } = this.props;
      // x,y分别加载多少
      const [xn, yn] = initNum;
      // clone一份数据
      const restXAxis = [...xAxis];
      const restYAxis = [...yAxis];
      // 首屏渲染数据
      const initXData = restXAxis.splice(0, xn);
      // 行数据按队列加载
      const initYData = restYAxis.splice(0, yn);
      // 设置首次加载
      this.setState({
        data: {
          xAxis: initXData,
          yAxis: initYData
        }
      }, resolve([restXAxis, restYAxis]));
    });
  }

  /**
   * 判断该使用那种模式
   * @param {Number} x x轴长度
   * @param {Number} y x轴长度
   */
  whichModeDecision(x, y) {
    let { mode } = this.props;
    // 如果使用方决定了使用那种模式
    if (mode) return mode;
    // 如果没有指定任何模式，自动决策使用那种模式
    // 总数量
    const count = x * y;

    // 8000以内的数量自动使用过渡模式
    if (count < 8000) {
      mode = 'transition';
    } else {
      mode = 'scroll';
    }
    return mode;
  }

  /**
   * 执行过渡模式
   * @param {Array<Object>} cloneXAxis 
   * @param {Array<Object>} cloneYAxis 
   */
  initRunTaskTransition(cloneXAxis, cloneYAxis) {
    const { scrollNum } = this.props;
    ModeTransition.init({
      xAxis: cloneXAxis,
      yAxis: cloneYAxis,
      batchNum: scrollNum
    }, (result) => {
      const data = { ...this.state.data };
      // 扩展数据
      data.yAxis = [...data.yAxis, ...result.yAxis];
      data.xAxis = [...data.xAxis, ...result.xAxis];
      this.setState({
        data,
        needUpdate: Math.random(),
      });
    });
  }

  /**
   * 滚动模式任务加载初始化
   * @param {Array} xAxis x轴坐标数据
   * @param {Array} yAxis y轴坐标数据
   */
  initRunTaskScroll(xAxis, yAxis) {
    const { scrollNum, initNum } = this.props;
    const [xn, yn] = initNum;

    // 引用实例
    this.modeScrollInstance = ModeScroll.init({
      xn,
      yn,
      batchNum: scrollNum,
      xAxis,
      yAxis,
      $container: this.scrollDOMRef.current,
      $spin: this.spinDOMRef.current,
    }, (result) => {
      const data = { ...this.state.data };
      // 存在某个才修改
      if (result.xAxis) data.xAxis = result.xAxis;
      if (result.yAxis) data.yAxis = result.yAxis;

      return new Promise((resolve) => {
        this.setState({
          data,
          needUpdate: Math.random(),
        }, resolve);
      });
    });
  }

  /**
   * 视口模式任务加载初始化
   * @param {Array} xAxis x轴坐标数据
   * @param {Array} yAxis y轴坐标数据
   */
  initRunTaskViewport(xAxis, yAxis) {
    const { scrollNum, initNum } = this.props;
    const [xn, yn] = initNum;
    // 引用实例
    this.modeViewportInstance = ModeViewport.init({
      xn,
      yn,
      batchNum: scrollNum,
      xAxis,
      yAxis,
      $container: this.scrollDOMRef.current,
      $spin: this.spinDOMRef.current,
    }, (result) => {
      const data = { ...this.state.data };
      // 存在某个才修改
      if (result.xAxis) data.xAxis = result.xAxis;
      if (result.yAxis) data.yAxis = result.yAxis;

      return new Promise((resolve) => {
        this.setState({
          data,
          needUpdate: Math.random(),
        }, resolve);
      });
    });
  }

  /**
   * 表体横向滚动
   * @param {*} event 
   */
  onScroll = (event) => {
    const { mode } = this.props;
    const [x, y] = this.scrollPostion;
    const { scrollLeft, scrollTop } = event.target;
    // 是否横向滚动
    const isScrollX = scrollLeft !== x;
    // 是否纵向滚动
    const isScrollY = scrollTop !== y;

    if (this.timer) {
      clearTimeout(this.timer);
    }
    // 如果是横向滚动
    if (isScrollX) {
      // 横向滚动节省性能
      requestAnimationFrame(() => {
        this.theadRef.current.DOMRef.current.scrollLeft = scrollLeft;
      });
       
      this.timer = setTimeout(() => {
        // 判断样式是否需要移除，同样是节省性能
        this.setState({ isScroll: scrollLeft > 0 });
        // 如果当前是视口模式
        if (mode === 'viewport') {
          this.modeViewportInstance.onScroll('x', scrollLeft);
        } else if (mode === 'scroll') {
          this.modeScrollInstance.onScroll('x', scrollLeft);
        }
      }, 100);
    }

    // 如果是纵向滚动
    if (isScrollY) {
      this.timer = setTimeout(() => {
        // 如果当前是视口模式
        if (mode === 'viewport') {
          this.modeViewportInstance.onScroll('y', scrollTop);
        } else if (mode === 'scroll') {
          this.modeScrollInstance.onScroll('y', scrollTop);
        }
      }, 100);
    }
    // 赋值
    this.scrollPostion = [scrollLeft, scrollTop];
  }

  /**
   * 鼠标按下开始选择
   * @param {Object} event 
   */
  onMouseDown = (event) => {
    const $element = Selection.confirm$element(event.target);
    // 如果不存在直接return
    if (!$element) return;
    // 如果当前点击的cell组件已经是选区范围内的元素，那么不做任何操作
    const rangeRefsId = Selection.findCellExistRange($element);
    // 如果已经是选区中的元素
    if (rangeRefsId) {
      Selection.mouseEventCancelOrCreateRange = false;
      // 如果按下了shift键只取消当前被点击的cell选中
      if (Selection.shiftKey) {
        // 取消单元格
        Selection.shiftCancelClickCell(rangeRefsId, $element.id);
        // shift计数重置为1
        Selection.shiftKey = 1;
      } else {
        // 取消当前cell所在的所有选区
        Selection.cancelExistCellRange(rangeRefsId);
      }
    } else {
      Selection.mouseEventCancelOrCreateRange = true;
      // 如果是shift状态下
      if (Selection.shiftKey) ++Selection.shiftKey;
      // shifkey第一次mousedown
      if (Selection.shiftKey < 3) {
        // 禁止选择
        this.setState({ unselect: true });
        // 初始化选区类
        Selection.start();
      }
      // 创建选区组件
      Selection.current.createRange($element);
      // 如果shifkey >= 3说明是按shift进行选区，创建完毕后重置
      if (Selection.shiftKey >= 3) {
        // 创建完毕后重置为1
        Selection.shiftKey = 1;
      }
    }
  }

  /**
   * 鼠标抬起结束选择
   * @param {Object} event 
   */
  onMouseUp = (event) => {
    let $element = Selection.confirm$element(event.target);
    // 如果当前正好概率落在非Cell区域，那么将最后一move过的cell元素传入
    if ($element) {
      $element = Selection.current.$lastMoveElement;
    };
    // 是否是输入状态
    const { isInput } = this.props;
    // 如果是创建选区
    if (Selection.mouseEventCancelOrCreateRange) {
      // 解绑事件
      Selection.unbindMouseMoveEvent();
      // 如果是输入状态应该删除当前选区
      if (isInput) {
        Selection.current.clearRange();
      } else {
        // 隐藏选区组件
        Selection.current.hiddenRange();
      }
      // 重置为false
      Selection.mouseEventCancelOrCreateRange = false;
    }

    // 允许选择,且计算数量
    this.setState({ unselect: true, count: isInput ? refs.total : refs.count });
  }

  /**
   * 如果师表移动时候超出了范围如果已经超出了范围
   * @param {Object} event 
   */
  onMouseLeave = (event) => {
    // 强制终止选区
    if (Selection.mouseEventCancelOrCreateRange) {
      // 模拟触发鼠标up事件，将最后一个ove过的cell元素传入
      this.onMouseUp({ target: Selection.current.$lastMoveElement });
    }
  }

  /**
   * 是否全屏
   * @param {Boolean} maxScreen 
   */
  onToggleScreen = (maxScreen) => {
    this.setState({ maxScreen });
    // 设置高度
    const { scrollY } = this.props;
    this.setState({ maxHeight: maxScreen ? 'calc(100vh - 100px)' : `${scrollY}px` });
  }

  render() {
    const {
      subTexts, fixedColumnWidth, columnWidth,
      title, isInput
    } = this.props;
    const {
      isScroll, data, maxScreen, needUpdate,
      ranges, unselect, count, maxWidth, maxHeight,
    } = this.state;
    // 如果没有坐标数据返回空
    if (!(data.xAxis.length && data.yAxis.length)) {
      return null;
    }

    return (
      <>
        {/* 全屏遮罩层 */}
        <div className={classnames({ 'ExcelTableFixedMask': true, max: maxScreen })}></div>
        <div
          className={classnames({ 'ExcelTableContainer': true, max: maxScreen })}
          ref={this.tableContainerDOMRef}
          style={{ maxWidth }}
        >
          <div ref={this.spinDOMRef} className="ExcelTableSpin" />
          {/* 操作列 */}
          <Operation
            title={title}
            count={count}
            maxScreen={maxScreen}
            onToggleScreen={this.onToggleScreen}
          />
          {/* 表头容器 */}
          <Thead
            ref={this.theadRef}
            data={data}
            subTexts={subTexts}
            isScroll={isScroll}
            fixedColumnWidth={fixedColumnWidth}
            columnWidth={columnWidth}
            needUpdate={needUpdate}
          />
          {/* 表体容器 */}
          <div
            className={classnames({ ExcelTableBody: true, isScroll, unselect })}
            onScroll={this.onScroll}
            onMouseDown={this.onMouseDown}
            onMouseUp={this.onMouseUp}
            onMouseLeave={this.onMouseLeave}
            ref={this.scrollDOMRef}
            style={{ maxHeight }}
          >
            {/* 渲染选区 */}
            {ranges.map(item => item ? item.range : item )}
            {/* <TableContext.Provider value={{ isInput, isText }}> */}
              <Table needUpdate={needUpdate}>
                {/* 列控制 */}
                <Colgroup
                  data={data}
                  fixedColumnWidth={fixedColumnWidth}
                  columnWidth={columnWidth}
                />
                {/* 表体 */}
                <Tbody
                  data={data}
                  isInput={isInput}
                />
              </Table>
            {/* </TableContext.Provider> */}
          </div>
        </div>
      </>
    );
  }
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
  
    this.state = {
      data: {
        xAxis: [],
        yAxis: [],
      }
    }

    this.excelTableRef = React.createRef();
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    const [min, max] = [-5, 5];
    const xAxis = [];
    const yAxis = [];
    
    for (let i = min; i <= max; i+=0.25) {
      const value = `${i > 0 ? '+' : ''}${i.toFixed(2)}`;
      xAxis.push({
        extra: {
          propPropId: i,
          propChoiId: i,
        },
        value,
      });
      yAxis.push({
        extra: {
          propPropId: i,
          propChoiId: i,
        },
        value,
      });
    };

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 500);
    }).then((res) => {
      this.excelTableRef.current.init({
        xAxis,
        yAxis,
      });
    });
  }

  onClick = () => {
    const data = this.excelTableRef.current.fetchData();
    console.log(data);
  }

  render() {
    // const { data } = this.state;
    // const visible = !!(data.xAxis.length && data.yAxis.length);

    return (
      <div style={{ padding: '24px' }}>
        <ExcelTable
          ref={this.excelTableRef}
          scrollNum={5}
          title="商品属性批量添加"
          isInput
          initNum={[40, 30]}
          // mode="scroll"
        />
        <button onClick={this.onClick}>获取数据</button>
      </div>
    );
  }
}
