
import { Node } from './Node';

export default class LinkedList {
  constructor() {
    // 链表长度
    this.count = 0;
    // 链表起点
    this.headed = undefined;
  }

  /**
   * 往链表最后插入一个元素
   * @param {Any} element 
   */
  push(element) {
    // 创建一个节点
    const node = new Node(element);
    // 如果当前链表是空的
    if (this.head === undefined) {
      this.head = node;
    } else {
      let current = this.head;
      // 获取最后一个链表元素
      while(current.next !== undefined) {
        // 将current指向next
        current = current.next;
      }
      // 设置最后一个元素的next
      current.next = node;
      // 链表元素数量加1
      this.count++;
    }
  }

  /**
   * 查找指定索引的节点
   * @param {Number} index 索引
   */
  getElementAt(index) {
    // 索引必须是范围内的
    if (index >= 0 && index <= this.count) {
      let node = this.head;
      let num = 0;

      while(num++ !== index) {
        node = node.next;
      }
      return node;
      
    }
    return;
  }

  /**
   * 在指定位置插入链表
   * @param {Any} element 元素值
   * @param {Number} index 索引 
   */
  insert(element, index) {
    if (index > 0 && index <= this.count) {
      const node = new Node(element);
      // 在头部插入
      if (index === 0) {
        // 当前头部元素
        const current = this.head;
        // 将头部元素设置为当前元素next指向的元素
        node.next = current;
        // 将当前元素设置为头部元素
        this.head = node;
      } else { // 在特定位置插入
        // 找到特定位置的上一个元素
        const previous = this.getElementAt(index - 1);
        // 在中间断开插入
        node.next = previous.next;
        previous.next = node;
      }

      this.count++;

      return node;
    }

    return;
  }

  /**
   * 在指定位置移除节点
   * @param {Number} index 
   */
  removeAt(index) {
    if (index >= 0 && index < this.count) {
      let current = this.head;
      // 如果是删除的是头元素
      if (index === 0) {
        // 将头元素设置为原来头元素的，next
        this.head = current.next;
      } else {
        // 当前位置的上一个节点
        const previous = this.getElementAt(index - 1);
        // 在中间断开移除
        current = previous.next;
        previous.next = current.next;
      }

      return current.element;
    }

    return;
  }

  /**
   * 删除某个元素
   * @param {Any} element 
   */
  remove(element) {
    const index = this.indexOf(element);
    // 移除
    return this.removeAt(index);
  }

  /**
   * 查询索引位置
   * @param {Any} element 
   */
  indexOf(element) {
    let current = this.head;
    let num = 0;

    while(num++ <= this.count && current.value !== element) {
      current = current.next;
    }
    return num;
  }

  forEach(callback) {
    let current = this.head;
    while(current) {
      // 执行回调
      callback(current.value);
      // 设置当前
      current = current.next;
    }
  }

  size() {
    return this.count;
  }

  isEmpty() {
    return this.count === 0;
  }

  getHead() {
    return this.head;
  }

  clear() {
    this.head = undefined;
    this.count = 0;
  }

}