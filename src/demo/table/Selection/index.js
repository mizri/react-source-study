import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from 'lodash';
import Range from './Range';
import refs from '../refs';

export default class Selection {

  // 当前正在使用的实例
  static current = null
  // 实例列表队列
  static instances = []
  // 选区组件集合
  static ranges = []
  // 当前次mouseDown与up是创建还是取消选区,是否介于mousedown与up之间
  static mouseEventCancelOrCreateRange = false
  // 当前次创建选区是否按下了shiftkey
  // shiftkey逻辑说明 
  // 0: 表示没按下shfit
  // 1: 表示按下了shfit
  // 2: 表示执行了一次mousedown
  // 3: 表示执行了两次mousedown
  static shiftKey = 0
  // 解绑师表移动事件
  static unbindMouseMoveEvent = () => {}
  // 回调方法用于更新表格选区状态
  static callback = () => {}
  // 是否是输入框模式
  static isInput = false

  /**
   * 开始创建寻你去实例
   * @param {Object} $container 当前容器
   * @param {Function} callback 回调方法用于更新表格选区状态
   * @param {Boolean} isInput 是否书入框模式
   */
  static init($container, callback, isInput) {
    this.$container = $container;
    this.callback = callback;
    this.isInput = isInput;
    // 绑定各种事件
    this.unbindEvent = this.bindEvent();
  }

  /**
   * 绑定鼠标移动事件
   */
   static bindMouseMoveEvent(func) {
    // 绑定
    document.body.addEventListener('mousemove', func);
    // 解绑
    return () => document.body.removeEventListener('mousemove', func);
  }

  /**
   * 绑定键盘keydown事件
   * @returns 
   */
  static bindKeydownEvent() {
    const onKeydown = (event) => {
      // 如果是按下了shfit键
      if (event.which === 16) {
        // 将状态设置为按下了shiftkey
        this.shiftKey += 1;
      }
    }
    document.body.addEventListener('keydown', onKeydown);
    return () => document.body.removeEventListener('keydown', onKeydown);
  }

  /**
   * 绑定键盘keyup事件
   * @returns 
   */
   static bindKeyupEvent() {
    const onKeyup = (event) => {
      // 如果是按下了shfit键
      if (event.which === 16) {
        // 将状态设置为按下了shiftkey
        this.shiftKey = 0;
      }
    }
    document.body.addEventListener('keyup', onKeyup);
    return () => document.body.removeEventListener('keyup', onKeyup);
  }

  /**
   * 一次性绑定所有事件
   * @returns 
   */
  static bindEvent() {
    this.unbindKeydownEvent = this.bindKeydownEvent();
    this.unbindKeyupEvent = this.bindKeyupEvent();

    return () => {
      this.unbindKeydownEvent();
      this.unbindKeyupEvent();
    }
  }
  
  /**
   * 开始创建实例
   * @param {Object} $container 当前容器
   */
  static start() {
    // 创建实例
    this.current = new Selection(this.$container);
    // 插入队列中
    this.instances.push(this.current);
    // 如果是shift创建,不绑定move事件
    if (!this.shiftKey) {
      // 绑定事件
      this.unbindMouseMoveEvent = this.bindMouseMoveEvent(this.current.onMove);
    }
    return this.current;
  }

  /**
   * 判断当前点击元素是否是否cell组件
   * @param {Object} $element 
   */
  static isCurrentElemetCell($element) {
    return $element.getAttribute('data-tag') === 'cell';
  }

  /**
   * 确定dom元素是否是cell组件
   * @param {Object} $element 
   */
  static confirm$element($element) {
    if (this.isCurrentElemetCell($element)) {
      return $element;
    } else if (this.isCurrentElemetCell($element.parentElement)) {
      return $element.parentElement
    }
    return null;
  }

  /**
   * 查询选区
   * @param {Object} $element 
   */
  static findCellExistRange($element) {
    // 查询出当前cell组件实例 范围id
    const { rangeRefsId } = refs.find($element.id);
    if (rangeRefsId.length) {
      // 找出选区的id
      return rangeRefsId;
    }
    
    return false;
  }

  /**
   * 取消选区中所有的选中的cell组件
   * @param {Array} rangeRefsId
   */
  static cancelExistCellRange(rangeRefsId) {
    // 找出所有的选区实例
    const instances = this.instances.filter((ins) => {
      return rangeRefsId.indexOf(ins.uid) > -1;
    });
    // 删除选区选中状态
    instances.forEach((ins) => {
      // 清空
      ins.clearRange();
    });
    // 从实例队列中清空
    this.instances = this.instances.filter((ins) => {
      return rangeRefsId.indexOf(ins.uid) === -1;
    });
  }

  /**
   * 按下shift键取消当前
   * @param {Array<String>} rangeRefsId
   * @param {String} index 当前cel组件实例 id
   */
  static shiftCancelClickCell(rangeRefsId, index) {
    // 找出选区所对应的实例
    const instances = this.instances.filter(item => rangeRefsId.indexOf(item.uid) > -1);
    // 查询出当前被点击的cell组件实例
    const cellRef = refs.find(index);
    // 设置为不选中
    cellRef.clear();
    // 待删除的选区id
    const uids = [];
    // 从所在选区中将其移出
    instances.forEach((item) => {
      // 如果是单cell选区那么删除整个选区与实例
      if (item.cellRefs.length === 1) {
        uids.push(item.uid);
      } else {
        // 从选区中删除当前cell组件
        item.cellRefs = item.cellRefs.filter(cell => cell !== cellRef);
        // 重新计算边界
        const [startxy, endxy, $startElement, $endElement] = item.computeRangeVertex();
        // 计算四边框位置
        const rect = item.computeRangeBorderPoistion($startElement, $endElement);
        // 设置
        item.setCellBounds(startxy, endxy, rect);
      }
    });
    // 如果存在uids
    if (uids.length) {
      this.cancelExistCellRange(uids);
    }
  }

  /**
   * 显示选区边界值
   * @param {Array<string>} rangeRefsId 
   */
  static showRangeBounds = (rangeRefsId) => {
    // 如果当前非创建选区状态
    if (!this.mouseEventCancelOrCreateRange) {
      // 查询出当前选区
      this.instances.forEach((item) => {
        let visible = false;
        // 是当前选区
        if (rangeRefsId.indexOf(item.uid) > -1) {
          visible = true;
        }
        // 控制显示与否
        item.rangeRef.current && item.rangeRef.current.setBoundVisible(visible);
      });
    }
  }

  /**
   * 销毁整个静态属性中的实例引用与选区组件引用
   */
  static destory() {
    // 清空实例应用
    this.instances = [];
    // 清空选区
    this.ranges = [];
    // 清空整个cell实例引用
    refs.clear();
    // 解绑各种事件
    this.unbindEvent();
  }

  //=======================以上是静态方法=====================
  //=======================以上是实例方法=====================
  /**
   * 构造函数
   * @param {Object} $container 滚动容器
   * @param {Object} callback 每点击一次实例回调 
   */

  constructor($container) {
    this.$container = $container;
    // 生成选区唯一id
    this.uid = Math.random().toString(32).slice(2);
    // 选区组件实例
    this.rangeRef = null
    // 当前选区所包含的cell组件实例
    this.cellRefs = []
    // 最后一个移动的cell组件dom
    this.$lastMoveElement = null;
    // 鼠标按下起始的触发元素
    this.$startMoveElement = null;
    // 起始未知的索引以及cell组件dom
    this.startIndex = [];
  }

  /**
   * 计算获取dom元素的实际位置
   * @param {Object} $element 
   */
   computeActualRect($element) {
    // 确定选区真实位置
    const elementRect = $element.getBoundingClientRect();
    // 容器的位置
    const containerRect = this.$container.getBoundingClientRect();
    // 容器滚动条位置
    const { scrollLeft, scrollTop } = this.$container;

    return {
      left: elementRect.left - containerRect.left + scrollLeft, // 真实所在位置
      top: elementRect.top - containerRect.top + scrollTop,
      width: elementRect.width,
      height: elementRect.height,
      originLeft: elementRect.left, // 原始相对位置
      originTop: elementRect.top,
    };
  }

  /**
   * 计算当前选区范围现有包含的cellRef顶点
   */
  computeRangeVertex() {
    const xs = [];
    const ys = [];
    this.cellRefs.forEach(({x, y}) => {
      xs.push(x);
      ys.push(y);
    });
    // x,y坐标最大与最小集合,即左上角与右下角顶点
    const startxy = [Math.min(...xs), Math.min(...ys)];
    const endxy = [Math.max(...xs), Math.max(...ys)];
    // 找到元素
    const $startElement = refs.findCellDomByRef(startxy.join('@'));
    const $endElement = refs.findCellDomByRef(endxy.join('@'));

    return [
      startxy,
      endxy,
      $startElement,
      $endElement
    ];
  }

  /**
   * 计算范围选区四条边框位置
   */
   computeRangeBorderPoistion($startElement, $endElement) {
    // 计算起始点位置
    const { left, top, originLeft, originTop } = this.computeActualRect($startElement);
    // 获取终点的位置
    const { right, bottom } = $endElement.getBoundingClientRect();
    // 计算宽度高度
    const width = right - originLeft;
    const height = bottom - originTop;

    return {
      width, // 上下边界实际宽度
      height, // 左右边界实际宽度
      left, // 起点的实际位置x
      top, // 起点的实际位置y
      originLeft, // 原始相对浏览器左上角位置x
      originTop, // 原始相对浏览器左上角位置y
    }
  }

  /**
   * 鼠标点击的位置元素
   * @param {Object} $element 当前点击的元素
   */
  createRange($element) {
    if (!$element.id) return;

    // 如果当前是shift创建
    if (Selection.shiftKey >= 3) {
      this.onMove({ target:$element });
    } else {
      // 起点位置的索引
      this.startIndex = [...$element.id.split('@'), $element];
      // 终点位置的索引
      const endIndex = this.startIndex;
      // 初始化选区的位置
      const rect = this.computeRangeBorderPoistion($element, $element);
      // 创建选区组件
      this.rangeRef = React.createRef();
      // 渲染选区
      const range = ReactDOM.createPortal(
        <Range
          ref={this.rangeRef}
          uid={this.uid}
          rect={rect}
          key={this.uid}
        />,
        this.$container,
      );
      // 将选区放入管理
      Selection.ranges.push({
        uid: this.uid,
        range: range,
        ref: this.rangeRef,
      });
      // 调用回调
      Selection.callback([...Selection.ranges], this).then(() => {
        // 设置cell组件选中状态
        this.setCellSelelcted(this.startIndex, endIndex);
        // 查询左右边界数据并且设置
        this.setCellBounds(this.startIndex, endIndex, rect);
      });
    }
    // 记住最后一个触发元素
    this.$lastMoveElement = $element;
    // 记住起始触发元素
    this.$startMoveElement = $element;
  }

  /**
   * 设置cell组件的选中状态
   * @param {Array} startIndex 起点位置索引
   * @param {Array} endIndex 终点位置索引
   */
   setCellSelelcted(startIndex, endIndex) {
    // 查询范围内所用的cell实例
    const currentCellRefs = refs.findRangeRefs(startIndex, endIndex);
    // 计算上一次与这一次两个选区范围的差值，也就是当前选中的选区要选中，本次未选中的要设置为未选中
    const diifCellRefs = this.cellRefs.filter((a) => {
      return !currentCellRefs.some((b) => a.index === b.index);
    });
    // 将本次选区存储
    this.cellRefs = currentCellRefs;
    // 设置选区是否选中
    this.switchCellSelected(currentCellRefs, true);
    // 设置选区不选中
    this.switchCellSelected(diifCellRefs, false);
    // 如果当前是input输入状态,将起始元素的值复制到每一个输入框中
    this.setBatchCellInputValue(currentCellRefs);
  }
  
  /**
   * 批量复制选区中所有的input的值
   * @param {Array<Object>} cell组件实例列表
   */
  setBatchCellInputValue(cellRefs) {
    if (Selection.isInput) {
      const startCellRef = refs.fundCellRefByDOM(this.$startMoveElement);
      // 获取数量
      const num = startCellRef.num;
      // 如果是值是空
      if (num === '') return;
      // 批量设置其他数量
      cellRefs.forEach((cellRef) => {
        cellRef.num = +num;
      });
    }
  }

  /**
   * 设置cell组件的选中状态
   * @param {Array} startIndex 起点位置索引
   * @param {Array} endIndex 终点位置索引
   * @param {Object} rect 四边框信息
   */
  setCellBounds(startIndex, endIndex, rect) {
    // 查询出左右边界
    const bounds = refs.findRangeRefsBounds(startIndex, endIndex);
    // 左边界，上边界
    const [leftBounds, topBounds] = bounds;
    // 获取他们显示的值
    const leftBoundValues = leftBounds.map((cellRef) => {
      return cellRef.xyValues[1];
    });
    const topBoundsValues = topBounds.map((cellRef) => {
      return cellRef.xyValues[0];
    });
    // 计算左边界宽度
    const { width, height, left, top } = rect; 
    // 设置显示边界
    this.rangeRef.current.setBounds({
      leftBounds: {
        values: leftBoundValues,
        style: { height, left: left - 48, top },
      },
      topBounds: {
        values: topBoundsValues,
        style: { width, left, top: top - 24 },
      },
    });
  }

  /**
   * 切换cell组件的选中状态
   * @param {Array} cellRefs 
   * @param {Array} selected 是否选中
   */
  switchCellSelected(cellRefs, selected) {
    cellRefs.forEach((item) => {
      item.onToggleSelected(selected, this.uid);
    });
  }

  /**
   * 清除当前选区
   */
  clearRange() {
    // 清除选中状态
    this.switchCellSelected(this.cellRefs, false);
    // 删除选区
    this.deleteRange();
  }

  /*
   * 删除当前选区
   */
  deleteRange = () => {
    // 清空选区cell集合
    this.cellRefs = [];
    // 这里这段说明，React.creatProtal创建的组件如果是数组返回，那么他的key是以索引为key值的
    // 如果改变了组件索引的位置，react会认为应该重新实例化组件，如果你期望不重新创建，那么应该保证位置索引值不变
    const idIndex = Selection.ranges.findIndex(item => item && (item.uid === this.uid));
    // 以下注释的代码会导致一个问题就是会重新创数组中的组件
    // Selection.ranges = Selection.ranges.filter(item => item.uid !== this.uid);
    Selection.ranges.splice(idIndex, 1, null);
    // 调用外部设置
    Selection.callback([...Selection.ranges], this);
  }

  /**
   * 找到当前选区隐藏四条边线与边界
   */
  hiddenRange = () => {
    this.rangeRef.current.setBoundVisible(false);
  }

  /**
   * 鼠标移动事件
   */
  onMove = _.throttle((event) => {
    const $element = Selection.confirm$element(event.target);
    // 如果是cell元素 && 当前范围组件还未被销毁
    if ($element && this.rangeRef.current) {
      const [x1, y1,] = this.startIndex;
      // 计算出选区起点位置已经终点位置
      const [x2, y2] = $element.id.split('@');
      // 确定坐标起点与终点
      const startxy = [Math.min(x1, x2), Math.min(y1, y2)];
      const endxy = [Math.max(x1, x2), Math.max(y1, y2)];
      // 确定起点与终点索引id
      const startIndex = startxy.join('@');
      const endIndx = endxy.join('@');
      // 找到元素
      const $startElement = refs.findCellDomByRef(startIndex);
      const $endElement = refs.findCellDomByRef(endIndx);
      // 计算选区范围
      const rect = this.computeRangeBorderPoistion($startElement, $endElement);
      // 设置cell组件选中状态
      this.setCellSelelcted(startxy, endxy);
      // 设置边界
      this.setCellBounds(startxy, endxy, rect);
      // 记住最后一个触发元素
      this.$lastMoveElement = $element;
    }
  }, 80)
}