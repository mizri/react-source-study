import * as React from 'react';


function Main(params) {
  const data = new Array(1000).fill(1);
  return (
    <div>
      {data.map((num, index) => {
        return <div key={index}>{index + num}</div>;
      })}
    </div>
  );
}

function Child1() {
  const data = new Array(500).fill(1);
  return (
    <div>
      {data.map((num, index) => {
        return <div key={index}>{index + num}</div>;
      })}
    </div>
  );
}

function Child2() {
  const data = new Array(300).fill(1);
  return (
    <div>
      {data.map((num, index) => {
        return <div key={index}>{index + num}</div>;
      })}
    </div>
  );
}

function App() {
  const [count, setCount] = React.useState(0);

  function onRender(id, pahse, actualDuration, baseDuration, startTime, commitTime) {
    const table = [{
      id: `${id}组件`,
      pashe: pahse === 'mount' ? '第一加载' : 'update更新',
      time: `花费时间${actualDuration.toFixed(2)}ms`,
      estimateTime: `估计不使用memoization的时间${baseDuration.toFixed(2)}ms`,
      startTime: `开始时间渲染时间${startTime.toFixed(2)}ms`,
      commitTime: `React提交时间${commitTime.toFixed(2)}ms`,
    }];
    console.table(table);
  }

  return (
    // <div onClick={() => setCount(1)}>
    <div>
      <div>=====================</div>
      <React.Profiler id="child1" onRender={onRender}>
        <Child1 />
      </React.Profiler>
      <div>=====================</div>
      <React.Profiler id="main" onRender={onRender}>
        <Main />
      </React.Profiler>
      <div>=====================</div>
      <React.Profiler id="child2" onRender={onRender}>
        <Child2 />
      </React.Profiler>
    </div>
  )
}

export default App;
