import * as React from 'react';

const dataUseRefList = [];
const dataCreateRefList = [];


export default function App() {
  const [count, setCount] = React.useState(0);

  const dataUseRef = React.useRef();
  const dataCreateRef = React.createRef();

  dataUseRefList.push(dataUseRef);
  dataCreateRefList.push(dataCreateRef);
  
  if (!dataUseRef.current) {
    dataUseRef.current = Math.random().toString(32).slice(2);
  }

  if (!dataCreateRef.current) {
    dataCreateRef.current = Math.random().toString(32).slice(2);
  }

  console.log(dataUseRef);
  console.log(dataCreateRef);

  function onCompare() {
    const [a, b] = dataUseRefList;
    const [x, y] = dataCreateRefList;
    console.log(a, b, a === b);
    console.log(x, y, x === y);
  }

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>点击我一下就+1 {count}</button>
      <button onClick={onCompare}>点击我比对数据</button>
    </div>
  );
}

