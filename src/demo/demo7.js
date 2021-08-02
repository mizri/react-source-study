
// React.StrictMode
import * as React from 'react';
// 生命周期检测以及副作用
class Test1 extends React.Component {
  componentWillMount() {
    // fetch('https://www.baidu.com');
  }

  render() {
    return 'test1';
  }
}

// ref 检测
class Test2 extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }

  componentDidMount() {
    console.log(this.inputRef);
  }

  render() {
    return (
      <React.Fragment>
        <div ref="test2">test2</div>
        <input type="text" ref={this.inputRef} />
      </React.Fragment>
    );
  }
}

export default class App extends React.Component {


  render() {
    return (
      <React.StrictMode>
        <div>严格模式检测</div>
        <Test1 />
        <Test2 />
      </React.StrictMode>
    );
  } 
}