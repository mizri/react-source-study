import * as React from 'react';



class Test1 extends React.Component {
  
  render() {
    return (
      <div>test1</div>
    );
  }
}

function Test2(props) {
  return (
    <span>test2</span>
  );
}


class TestByCreate1 extends React.Component {

  render() {
    return React.createElement('div', null, this.props.title)
  }
}

function TestByCreate2(props) {
  return React.createElement('div', null, `我是：${props.title}`);
}

export default class App extends React.Component {

  render() {
    return (
      <React.Fragment>
        {React.createElement(TestByCreate1, { title: 'TestByCreate1' }, null)}
        {React.createElement(TestByCreate2, { title: 'TestByCreate2' }, null)}
        <Test1 />
        <Test2 />
      </React.Fragment>
    );
  }
}
