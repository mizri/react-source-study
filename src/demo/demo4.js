import * as React from 'react';

function Child1() {
	return <div>111</div>;
}

function Child2() {
	return <div>222</div>;
}

// 这种写法会报错
// function App() {
//   return (
//     <Child1 />
//     <Child2 />
//   );
// }

function App() {
  return (
    <React.Fragment>
      <Child1 />
      <Child2 />
    </React.Fragment>
  );
};

// 第二种写法
function App2() {
  return (
    <>
      <Child1 />
      <Child2 />
    </>
  );
};

// 第三种写法
function App3() {
  return [
    <Child1 key="1" />,
    <Child1 key="2" />
  ]
};

export const App22 = App2;

export const App33 = App3;


export default App;
