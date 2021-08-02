
// React.Children.map
import * as React from 'react';

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

function Father(props) {
  // 同样的map方式，看起似乎是没有区别的
  console.log(React.Children.map(props.children, item => item));
  console.log(props.children.map((item) => item));

  // 再看渲染的时候，实行同样的方式
  return (
    <div>
      {
        React.Children.map(props.children, (item) => {

          if (React.isValidElement(item)) {
            return React.cloneElement(item, {
              ...item.props,
              text: "children",
            })
          }

          return item;
        })
      }
       {/* 这样回报错 */}
       {/* {
        React.Children.map(props.children, (item) => {
          if (React.isValidElement(item)) {
            item.props.text = 'yufeiong'; 
            return item;
          }

          return item;
        })
      } */}
      {/* 表面上应该达到一样的效果，但实际上是会报错的 */}
      {
        props.children.map((item) => {
          // item.props = { ...item.props, text: 'children' }
          return item;
        })
      }
    </div>
  );
}

function App() {

  return (
    <Father>
      <Child1 />
      <Child2 />
      text
    </Father>
  );
}

export default App;