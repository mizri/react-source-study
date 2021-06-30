import * as React from 'react';

function Child(text) {
  return (
    <div>子节点2</div>
  );
}

function Father(props) {

  return (
    <div>
      {React.Children.only(props.children)}
    </div>
  );
}

function App() {

  return (
    <Father>
      {/* 两个节点会报错，单个非react节点也会报错 */}
      <Child /> 
      11111
    </Father>
  );
}

export default App;