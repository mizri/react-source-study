
// requestIdleCallback polyfill
window.requestIdleCallback = window.requestIdleCallback || function(handler) {
  let startTime = Date.now();
  return setTimeout(function() {
    handler({
      didTimeout: false,
      timeRemaining: function() {
        return Math.max(0, 50.0 - (Date.now() - startTime));
      }
    });
  }, 1);
};

window.cancelIdleCallback = window.cancelIdleCallback || function(id) {
  clearTimeout(id);
};

// let i = 0;

export default class TaskRunner {
  constructor(taskList, callback) {
    this.taskList = taskList;
    // 回调列表
    this.callback = callback || (result => result);
  }

  // 执行id
  taskHandle = 0

  start() {
    window.requestIdleCallback(this.runTaskQueue);
  }

  /**
   * 清除执行
   */
  clearTaskHandle = () => {
    window.cancelIdleCallback(this.taskHandle);
  }

  // 运行任务方法
  // deadline 为requestIdleCallback 内部回传对象
  runTaskQueue = (deadline) => {
    // console.log(++i);
    // 如果deadline.timeRemaining()剩余的可执行空闲时间 > 0 || 任务并没有超时 && 任务列表中存在任务
    while ((deadline.timeRemaining() > 0 || deadline.didTimeout) && this.taskList.length) {
      // 符合先进先出规律，把第一个出队列
      const task = this.taskList.shift();
      // 已经执行的任务总数+1
      // 执行任务
      this.callback(task.handler(task.data));
    }

    // 当时间用完任务列中还有任务
    if (this.taskList.length) {
      // 继续执行任务
      this.taskHandle = window.requestIdleCallback(this.runTaskQueue, { timeout: 1000} );
    } else {
      // 否则将当前执行的任务id设置为0
      this.taskHandle = 0;
    }
  }
}