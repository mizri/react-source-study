import * as React from "react";
import * as ReactDOM from 'react-dom';


function Child(props) {
  return (
    <div>我是子节点：{props.text}</div>
  );
}

function Modal() {
  return ReactDOM.createPortal(
    <Child text="我是createPortl Modal方式创建" />,
    document.getElementById('portal')
  );
}


export default class App extends React.Component {

  state = {
    portalChild: <div />
  }

  componentDidMount() {
    // 这个返回Test已经是创建好的react 节点
    const portalChild = ReactDOM.createPortal(
      <Child text="我是用createPortal渲染的 渲染到挂载点1"/>,
      document.getElementById('mountNode')
    )

    this.setState({ portalChild });

    // 它啥也不是返回null,直接渲染
    const Test2 = ReactDOM.render(
      <Child text="我是用render渲染的 渲染到挂载点2"/>,
      document.getElementById('mountNode2')
    )
    console.log(Test2);

  }

  render() {
    return (
      <div>
        {/* 无论你放什么位置都会渲染到 mountNode 下面，且不会覆盖mountNode */}
        {this.state.portalChild}
        <div>
          <Child text="我是正常渲染的"/>
        </div>
        <div id="mountNode">
          <span>挂载点1</span>
        </div>
        {/* 渲染到mountNode2 且会覆盖所有子节点 */}
        <div id="mountNode2">
          <span>挂载点2</span>
        </div>
        <div>
          <Modal>
            <Child />
          </Modal>
        </div>
      </div>
    )
  }
}