

class Refs {
  
  // 实例引用集合
  refs = []

  /**
   * 插入一个实例
   * @param {Object} ref 
   */
  push(ref) {
    // 切割索引
    this.refs.push(ref);
  }

  /**
   * 查询一个实例
   * @param {Object} ref 
   */
  find(index) {
    return this.refs.find(item => item.index === index);
  }

  /**
   * 通过Cell组件实例查询DOM
   * @param {Object} index 
   */
  findCellDomByRef(index) {
    const record = this.refs.find(item => item.index === index) || {};
    return document.getElementById(record.index);
  }

  /**
   * 通过dom查询cell组件实例
   * @param {Object} $element 
   */
  fundCellRefByDOM($element) {
    return this.refs.find(item => item.index === $element.id);
  }

  /**
   * 查询索引范围内的所有实例
   * @param {Array} start 起始位置索引
   * @param {Array} end 终点位置索引
   */
  findRangeRefs(start, end) {
    const [x1, y1] = start;
    const [x2, y2] = end;
    // this.refs
    const result = this.refs.filter((item) => {
      return (item.x >= +x1 && item.x <= +x2) && (item.y >= +y1 && item.y <= +y2);
    });
    return result;
  }

  /**
   * 查询索引范围内上边线与左边线元素
   * @param {Array} start 起始位置索引
   * @param {Array} end 终点位置索引
   */
  findRangeRefsBounds(start, end) {
    const [x1, y1] = start;
    const [x2, y2] = end;
    const leftBound = this.refs.filter(item => item.x === +x1 && (item.y >= +y1 && item.y <= +y2));
    const topBound = this.refs.filter(item => item.y === +y1 && (item.x >= +x1 && item.x <= +x2));

    return [leftBound, topBound];
  }

  // 计算input输入的总数量
  get total() {
    return this.refs
               .filter(item => !!item.num)
               .map(item => +item.num)
               .reduce((a, b) => a + b, 0);
  }

  set total(value) {
    throw new Error('can not set `refs` total');
  }

  // 计算有多少个被选中
  get count() {
    return this.refs.filter(item => item.selected).length;
  }

  set count(value) {
    throw new Error('can not set `refs` count');
  }

  // 获取当前所选中的区域
  get data() {
    return this.refs.filter(item => item.num).map(item => item.data)
  }

  set data(value) {
    throw new Error('can not set `refs` data');
  }

  /**
   * 清空整个实例
   */
  clear() {
    this.refs = [];
  }
}

export default new Refs();