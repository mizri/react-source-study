
export default class UnlimitedTree {
  constructor(callback) {
    // 数据值
    this.data = [];
    // 当前正在插入数据的节点
    this.record = {};
    // 当前回调
    this.callback = callback;
  }

  /**
   * 根节点插入数据
   * @param {Object} record 当前添加的节点
   * @param {Array<Object>} list 子集列表
   */
  insertRootNode(record, list) {
    // 比较过滤数据
    list = this.compareAndFilter(this.data, list);
    // 插入并返回所有的子节点
    const children = this.insertNode(this.data, list, record);
    // 执行回调
    this.callback({
      ...record,
      children,
    });
  }

  /**
   * 非根节点插入数据
   * @param {Object} record 商品属性
   * @param {Array<Object>} parentList 前面一级选择的属性 
   * @param {Array<Object>} childList 要插入到前面一级的子属性
   */
  insertNormalNode(record, parentList, childList) {
    parentList.forEach((parent) => {
      // 如果已经有子属性值那么需要对比
      if (parent.children.length) {
        // 比较过滤
        childList = this.compareAndFilter(parent.children, childList);
      }
      // 插入
      this.insertNode(parent.children, childList, record);
    });

    console.log(this.data);
  }

  /**
   * 插入子节点并且返回当前节点
   * @param {Array<Object>} currList 当前已经存在的属性
   * @param {Array<Object>} nextList 本次选择将要更新的属性
   * @param {Object} record 商品属性
   */
  insertNode(currList, nextList, record) {
    // 插入节点
    currList.push(...nextList.map((item) => {
      return {
        ...item,
        pid: record.id,
        children: [], // 子列表
      };
    }));
    return currList;
  }

  /**
   * 递归所有节点
   * @param {Function} callback
   */
  recursionNode(callback) {
    const recursion = (nodes) => {
      return nodes.map((node) => {
        if (node.children.length) {
          return callback(node, recursion(node.children));
        }
        
        return callback(node);
      });
    };
    return recursion(this.data);
  }

  /**
   * 比较并且过滤已经选择的属性去nextList除去currList
   * @param {Array<Object>} currList 当前已经存在的属性
   * @param {Array<Object>} nextList 本次选择将要更新的属性
   */
  compareAndFilter(currList, nextList) {
    // 过滤
    return nextList.filter((next) => {
      // 排除已经选择过的属性
      return !currList.some(curr => curr.id === next.id);
    });
  }

  /**
   * 删除商品属性值
   * @param {Object} prop 商品属性值
   */
  deleteNode(prop) {
    prop.children = [];
  }

  findNode() {

  }
}