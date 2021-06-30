import * as React from 'react';

// 以下方法变成了只接受props与children的方法，利用闭包的方式持久化了type参数

// 利用工厂方法创建一个固定创建ul的方法
const createElementUl = React.createFactory('ul');

// 利用工厂方式创建一个固定创建li的方法
const createElementLi = React.createFactory('li');

function Test(props) {
  return (
    <div>{props.text}</div>
  );
}

const createElementTest = React.createFactory(Test);

export default class App extends React.Component {

  render() {
    return (
      <div>
        {
          createElementUl(
            null,
            createElementLi(null, '我是第一个li'),
            createElementLi(null, '我是第二个li'))
        }
        {createElementTest({ text: '我是test工厂方法创建出来的' })}
      </div>
    );
  }
}