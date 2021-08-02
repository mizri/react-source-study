
import * as React from 'react';
import * as ReactDOM from 'react-dom';

class Child extends React.Component {
  render() {
    return (
      <div id="child">我是child节点</div>
    )
  }
}

class Father extends React.Component {
  render() {
    return (
      <div id="father">我是father</div>
    )
  }
}

export default class App extends React.Component {
  componentDidMount() {
    console.log(ReactDOM.findDOMNode(this.refs.child));
    console.log(ReactDOM.findDOMNode(this.fatherRef));
  }

  render() {
    return (
      <div>
        <Child ref="child" />
        <Father ref={ins => this.fatherRef = ins} />
      </div>
    );
  }
}