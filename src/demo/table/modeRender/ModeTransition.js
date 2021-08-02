import TaskRunner from '../TaskRuner';

export default class ModeTransition {
  static init(data, callback) {

    const {
      xAxis,
      yAxis,
      batchNum
    } = data;
    // 创建过度模式实例
    const instance = new this();
    // 添加回调
    instance.callback = callback;
    // 创建过渡模式任务列表
    instance.createTaskList(xAxis, yAxis, batchNum);
  }

  constructor() {
    // 任务列表
    this.taskList = [];
    // 任务运行回调
    this.callback = () => {};
  }

  /**
   * 过渡模式运行任务
   * @param {Array} xAxis x轴坐标数据
   * @param {Array} yAxis y轴坐标数据
   * @param {Nmber} batchNum 每批次加载多少
   */
   createTaskList(xAxis, yAxis, batchNum) {
    // 生成任务
    // let i = 0;
    while(xAxis.length || yAxis.length) {
      // i++;
      // 生成任务数据
      const record = {
        yAxis: [],
        xAxis: [],
      };
      // 如果x轴有数据
      if (xAxis.length) record.xAxis = xAxis.splice(0, batchNum);
      // 如果y轴有数据
      if (yAxis.length) record.yAxis = yAxis.splice(0, batchNum);
      // 加入队列
      this.taskList.push({
        data: record, // 设置任务数据
        handler: (taskData) => { // 任务回调
          // 回调
          this.callback(record);
        }
      });
    }
    
    // 开始运行任务
    this.runner = new TaskRunner(this.taskList);
    // 开始
    this.runner.start();
  }
}