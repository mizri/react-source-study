

export class Node {
  /**
   * 节点类构造函数
   * @param {Ojbect} element 要放入节点的值
   * @param {Object} next 指针，指向下个节点
   */
  constructor(element, next) {
    this.value = element;
    this.next = next;
  }
}

export class DoublyNode extends Node {
  constructor(element, next, prev) {
    super(element, next);
    this.prev = prev;
  }
}