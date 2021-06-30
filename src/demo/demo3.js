import * as React from 'react';

function Child(text) {
  return (
    <div>子节点</div>
  );
}

function Child1(text) {
  return (
    <div>子节点1</div>
  );
}

function Child2(text) {
  return (
    <div>子节点2</div>
  );
}

function Child3(text) {
  return (
    <div>子节点3</div>
  );
}


function Father(props) {
  return (
    <div>
      {React.Children.toArray(props.children).sort((a, b) => {
        console.log(a); // 每个react节点都会加上key
        return b.key - a.key;
      })}
    </div>
  );
}

function App() {

  return (
    <Father>
     <Child />
     <Child1 />
     <Child2 />
     <Child3 />
     12312
    </Father>
  );
}

export default App;