import * as React from "react";
import * as ReactDOM from "react-dom";

export default class App extends React.Component {

  state = {
    value: 0,
  }

  onClick = (event) => {
    
    setTimeout(() => {
      this.setState({ value: 'setTimeout' });
    }, 0);
    
    // 如果不加flushSync，就会被后面的setState合并掉一起更新
    ReactDOM.flushSync(() => {
      this.setState({ value: "flushAsync" });
    });
    
    this.setState({ value: 'normal'});

  }

  render() {
    console.log(this.state.value);
    return (
      <div>
        <div>
          <button onClick={this.onClick}>点击测试优先级</button>
        </div>
      </div>
    );
  }
}