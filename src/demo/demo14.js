import * as React from 'react';


class Test1 extends React.Component {

  render() {
    return (
      <div>我是test1</div>
    );
  }
}

class Test2 extends React.Component {
  render() {
    return (
      <div>我是test2</div>
    );
  }
}

class Test3 extends React.Component {
  render() {
    return (
      <div>我是test3</div>
    );
  }
}

class Test4 extends React.Component {
  render() {
    return (
      <div>我是test4</div>
    );
  }
}

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.button3Ref = { current: null };
    this.button4Ref = React.createRef();

    this.test3Ref = { current: null };
    this.test4Ref = React.createRef();
  }

  componentDidMount() {
    // 以下四种方式都会输出组件实例，其中refs的方式已经废弃
    console.log(this.refs.button1Ref);
    console.log(this.button2Ref);
    console.log(this.button3Ref);
    console.log(this.button4Ref);
    console.log('==================================');
    console.log(this.refs.test1Ref);
    console.log(this.test2Ref);
    console.log(this.test3Ref);
    console.log(this.test4Ref);
    // 判断是否是同一个实例
  }

  render() {
    return (
      <React.Fragment>
        <Test1 ref="test1Ref"/>
        <Test2 ref={ins => this.test2Ref = ins} />
        <Test3 ref={this.test3Ref} />
        <Test4 ref={this.test4Ref} />
        <div><button ref="button1Ref">我是button1</button></div>
        <div><button ref={ins => this.button2Ref = ins}>我是button2</button></div>
        <div><button ref={this.button3Ref}>我是button3</button></div>
        <div><button ref={this.button4Ref}>我是button4</button></div>
      </React.Fragment>
    );
  }
}