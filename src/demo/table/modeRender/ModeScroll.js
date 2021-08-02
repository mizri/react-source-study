import createLoading from './createLoading';

export default class ModeVeiwport {
  static init(params, callback) {
    // 实例化
    const instance = new this(params);
    // 设置回调
    instance.callback = callback;

    return instance;
  }

  constructor(params) {
    // 出事首屏渲染索引范围，每批次加载数量
    const { xn, yn, batchNum, xAxis, yAxis, $container, $spin } = params;
    // x轴当前渲染的索引范围
    this.lenX = xn;
    // y轴当前渲染的索引范围
    this.lenY = yn;
    // 每次批次加载数量
    this.batchNum = batchNum;
    // x轴、y轴数据
    this.xAxis = xAxis;
    this.yAxis = yAxis;
    // 滚动的容器
    this.$container = $container;
    // loading加载框
    this.$spin = $spin;
  }
  
  /**
   * 滚动回调事件
   * @param {String} xOry 滚动的方向 x or y
   * @param {String} distance 滚动的距离
   */
  onScroll(xOry, distance) {
    // 判断滚动方向
    if (xOry === 'x') {
      this.scrollX(distance);
    } else if (xOry === 'y') {
      this.scrollY(distance);
    }
  }

  /**
   * x轴滚动
   * @param {Number} distance 滚动距离
   * @returns 
   */
  scrollX(distance) {
    const data = {};
    // 滚动容器信息
    const { offsetWidth, scrollWidth } = this.$container;
    // 滚动方向左还是右
    let direction;
    // 判断滚动方向
    // 滚动距离 + 宽度 === 滚动宽度 : 滚动到最右边了
    if (distance + offsetWidth === scrollWidth) {
      // 如果结束位置已经大于总长度了数据已经加载到最后，不执行
      if (this.lenX >= this.xAxis.length) return;
      // 设置滚动方向
      direction = 'right';
      // 递增
      this.lenX += this.batchNum;
      // 截取显示此时应该显示的数据
      data.xAxis = this.xAxis.slice(0, this.lenX);
      // 创建loading框
      const cancelLoading = createLoading(direction, this.$spin);
      // 更新数据
      this.update(data).then(() => {
        cancelLoading();
      });
    }
  }

  /**
   * y轴滚动
   * @param {Number} distance 
   */
  scrollY(distance) {
    const data = {};
    // 滚动容器信息
    const { offsetHeight, scrollHeight } = this.$container;
    // 滚动方向上还是下
    let direction;
    // 判断滚动方向
    // 滚动距离 + 高度 === 滚动高度 : 滚动到最下边了
    if (distance + offsetHeight === scrollHeight) {
      // 如果结束位置已经大于总长度了数据已经加载到最后，不执行
      if (this.lenY >= this.yAxis.length) return;
      // 设置滚动方向
      direction = 'bottom';
      // 在原有的位置上在加上batchNum数量，相当于整张视图向下移动了batchNum数量
      this.lenY += this.batchNum;
      // 截取显示此时应该显示的数据
      data.yAxis = this.yAxis.slice(0, this.lenY);
      // 创建loading框
      const cancelLoading = createLoading(direction, this.$spin);
      // 更新数据
      this.update(data).then(() => {
        cancelLoading();
      });
    }
  }

  /**
   * 更新数据
   * @param {Array<Object>} data 
   */
  update(data) {
    return this.callback(data);
  }
}