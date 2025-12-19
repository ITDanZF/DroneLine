/**
 * 双向链表节点
 */
export class ListNode<T> {
  readonly id: number;
  data: T;
  prev: ListNode<T> | null = null;
  next: ListNode<T> | null = null;

  constructor(id: number, data: T) {
    this.id = id;
    this.data = data;
  }
}

/**
 * 通用双向链表类
 */
export default class LinkedList<T> {
  private head: ListNode<T> | null = null;
  private tail: ListNode<T> | null = null;
  private _size: number = 0;
  private _nextId: number = 1;
  private _nodeMap: Map<number, ListNode<T>> = new Map();

  constructor() {}

  /**
   * 生成下一个唯一 ID
   */
  private generateId(): number {
    return this._nextId++;
  }

  /**
   * 获取链表长度
   */
  get size(): number {
    return this._size;
  }

  /**
   * 检查链表是否为空
   */
  isEmpty(): boolean {
    return this._size === 0;
  }

  /**
   * 在链表头部插入节点
   */
  insertFirst(data: T): ListNode<T> {
    const newNode = new ListNode(this.generateId(), data);
    this._nodeMap.set(newNode.id, newNode);

    if (this.isEmpty()) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head!.prev = newNode;
      this.head = newNode;
    }

    this._size++;
    return newNode;
  }

  /**
   * 在链表尾部插入节点
   */
  insertLast(data: T): ListNode<T> {
    const newNode = new ListNode(this.generateId(), data);
    this._nodeMap.set(newNode.id, newNode);

    if (this.isEmpty()) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.prev = this.tail;
      this.tail!.next = newNode;
      this.tail = newNode;
    }

    this._size++;
    return newNode;
  }

  /**
   * 在指定节点之后插入新节点
   */
  insertAfter(node: ListNode<T>, data: T): ListNode<T> {
    const newNode = new ListNode(this.generateId(), data);
    this._nodeMap.set(newNode.id, newNode);

    newNode.prev = node;
    newNode.next = node.next;

    if (node.next) {
      node.next.prev = newNode;
    } else {
      this.tail = newNode;
    }

    node.next = newNode;
    this._size++;
    return newNode;
  }

  /**
   * 在指定节点之前插入新节点
   */
  insertBefore(node: ListNode<T>, data: T): ListNode<T> {
    const newNode = new ListNode(this.generateId(), data);
    this._nodeMap.set(newNode.id, newNode);

    newNode.next = node;
    newNode.prev = node.prev;

    if (node.prev) {
      node.prev.next = newNode;
    } else {
      this.head = newNode;
    }

    node.prev = newNode;
    this._size++;
    return newNode;
  }

  /**
   * 在指定索引位置插入节点
   */
  insertAt(index: number, data: T): ListNode<T> | null {
    if (index < 0 || index > this._size) {
      return null;
    }

    if (index === 0) {
      return this.insertFirst(data);
    }

    if (index === this._size) {
      return this.insertLast(data);
    }

    const current = this.getNodeAt(index);
    if (current) {
      return this.insertBefore(current, data);
    }
    return null;
  }

  /**
   * 删除头部节点
   */
  removeFirst(): T | null {
    if (this.isEmpty()) {
      return null;
    }

    const removedNode = this.head!;
    const data = removedNode.data;
    this._nodeMap.delete(removedNode.id);

    if (this._size === 1) {
      this.head = null;
      this.tail = null;
    } else {
      this.head = this.head!.next;
      this.head!.prev = null;
    }

    this._size--;
    return data;
  }

  /**
   * 删除尾部节点
   */
  removeLast(): T | null {
    if (this.isEmpty()) {
      return null;
    }

    const removedNode = this.tail!;
    const data = removedNode.data;
    this._nodeMap.delete(removedNode.id);

    if (this._size === 1) {
      this.head = null;
      this.tail = null;
    } else {
      this.tail = this.tail!.prev;
      this.tail!.next = null;
    }

    this._size--;
    return data;
  }

  /**
   * 删除指定节点
   */
  remove(node: ListNode<T>): T {
    this._nodeMap.delete(node.id);

    if (node.prev) {
      node.prev.next = node.next;
    } else {
      this.head = node.next;
    }

    if (node.next) {
      node.next.prev = node.prev;
    } else {
      this.tail = node.prev;
    }

    this._size--;
    return node.data;
  }

  /**
   * 删除指定索引位置的节点
   */
  removeAt(index: number): T | null {
    if (index < 0 || index >= this._size) {
      return null;
    }

    if (index === 0) {
      return this.removeFirst();
    }

    if (index === this._size - 1) {
      return this.removeLast();
    }

    const node = this.getNodeAt(index);
    if (node) {
      return this.remove(node);
    }
    return null;
  }

  /**
   * 获取指定索引位置的节点
   */
  getNodeAt(index: number): ListNode<T> | null {
    if (index < 0 || index >= this._size) {
      return null;
    }

    let current: ListNode<T> | null;

    // 优化：从较近的一端开始遍历
    if (index < this._size / 2) {
      current = this.head;
      for (let i = 0; i < index; i++) {
        current = current!.next;
      }
    } else {
      current = this.tail;
      for (let i = this._size - 1; i > index; i--) {
        current = current!.prev;
      }
    }

    return current;
  }

  /**
   * 获取指定索引位置的数据
   */
  getAt(index: number): T | null {
    const node = this.getNodeAt(index);
    return node ? node.data : null;
  }

  /**
   * 获取头部数据
   */
  getFirst(): T | null {
    return this.head ? this.head.data : null;
  }

  /**
   * 获取尾部数据
   */
  getLast(): T | null {
    return this.tail ? this.tail.data : null;
  }

  /**
   * 获取头部节点
   */
  getHead(): ListNode<T> | null {
    return this.head;
  }

  /**
   * 获取尾部节点
   */
  getTail(): ListNode<T> | null {
    return this.tail;
  }

  /**
   * 通过 ID 获取节点 (O(1) 时间复杂度)
   */
  getNodeById(id: number): ListNode<T> | null {
    return this._nodeMap.get(id) || null;
  }

  /**
   * 通过 ID 获取数据 (O(1) 时间复杂度)
   */
  getById(id: number): T | null {
    const node = this.getNodeById(id);
    return node ? node.data : null;
  }

  /**
   * 通过 ID 删除节点 (O(1) 时间复杂度)
   */
  removeById(id: number): T | null {
    const node = this.getNodeById(id);
    if (node) {
      return this.remove(node);
    }
    return null;
  }

  /**
   * 删除指定 ID 节点的前一个节点 (O(1) 时间复杂度)
   */
  removePrevById(id: number): T | null {
    const node = this.getNodeById(id);
    if (node && node.prev) {
      return this.remove(node.prev);
    }
    return null;
  }

  /**
   * 删除指定 ID 节点的后一个节点 (O(1) 时间复杂度)
   */
  removeNextById(id: number): T | null {
    const node = this.getNodeById(id);
    if (node && node.next) {
      return this.remove(node.next);
    }
    return null;
  }

  /**
   * 检查是否存在指定 ID 的节点
   */
  hasId(id: number): boolean {
    return this._nodeMap.has(id);
  }

  /**
   * 在指定 ID 的节点之后插入新节点 (O(1) 时间复杂度)
   */
  insertAfterId(id: number, data: T): ListNode<T> | null {
    const node = this.getNodeById(id);
    if (node) {
      return this.insertAfter(node, data);
    }
    return null;
  }

  /**
   * 在指定 ID 的节点之前插入新节点 (O(1) 时间复杂度)
   */
  insertBeforeId(id: number, data: T): ListNode<T> | null {
    const node = this.getNodeById(id);
    if (node) {
      return this.insertBefore(node, data);
    }
    return null;
  }

  /**
   * 查找包含指定数据的节点
   */
  find(predicate: (data: T) => boolean): ListNode<T> | null {
    let current = this.head;
    while (current) {
      if (predicate(current.data)) {
        return current;
      }
      current = current.next;
    }
    return null;
  }

  /**
   * 查找数据的索引
   */
  indexOf(predicate: (data: T) => boolean): number {
    let current = this.head;
    let index = 0;
    while (current) {
      if (predicate(current.data)) {
        return index;
      }
      current = current.next;
      index++;
    }
    return -1;
  }

  /**
   * 检查是否包含满足条件的数据
   */
  contains(predicate: (data: T) => boolean): boolean {
    return this.find(predicate) !== null;
  }

  /**
   * 清空链表
   */
  clear(): void {
    this.head = null;
    this.tail = null;
    this._size = 0;
    this._nodeMap.clear();
  }

  /**
   * 正向遍历链表
   */
  forEach(callback: (data: T, index: number, node: ListNode<T>) => void): void {
    let current = this.head;
    let index = 0;
    while (current) {
      callback(current.data, index, current);
      current = current.next;
      index++;
    }
  }

  /**
   * 反向遍历链表
   */
  forEachReverse(
    callback: (data: T, index: number, node: ListNode<T>) => void
  ): void {
    let current = this.tail;
    let index = this._size - 1;
    while (current) {
      callback(current.data, index, current);
      current = current.prev;
      index--;
    }
  }

  /**
   * 映射链表数据到新数组
   */
  map<U>(callback: (data: T, index: number) => U): U[] {
    const result: U[] = [];
    this.forEach((data, index) => {
      result.push(callback(data, index));
    });
    return result;
  }

  /**
   * 过滤链表数据
   */
  filter(predicate: (data: T, index: number) => boolean): T[] {
    const result: T[] = [];
    this.forEach((data, index) => {
      if (predicate(data, index)) {
        result.push(data);
      }
    });
    return result;
  }

  /**
   * 将链表转换为数组
   */
  toArray(): T[] {
    return this.map((data) => data);
  }

  /**
   * 从数组创建链表
   */
  static fromArray<T>(array: T[]): LinkedList<T> {
    const list = new LinkedList<T>();
    for (const item of array) {
      list.insertLast(item);
    }
    return list;
  }

  /**
   * 实现迭代器接口，支持 for...of 循环
   */
  *[Symbol.iterator](): Iterator<T> {
    let current = this.head;
    while (current) {
      yield current.data;
      current = current.next;
    }
  }

  /**
   * 反向迭代器
   */
  *reverseIterator(): Iterator<T> {
    let current = this.tail;
    while (current) {
      yield current.data;
      current = current.prev;
    }
  }
}
