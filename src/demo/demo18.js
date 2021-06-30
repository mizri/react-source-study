import * as React from 'react';


export default function App() {

  const [count, setCount] = React.useState(0);
  const [user, setUser] = React.useState(() => {
    return {
      name: 'yufeilong',
      high: '175',
    }
  });

  function onChange() {
    setUser((prev) => {
      return { ...prev, ...{ name: 'langgan', high: '176' } }
    });
  }
  return (
    <React.Fragment>
      <div>
        <button onClick={() => setCount(count + 1)}>测试按钮{count}</button>
      </div>
      <div>
        <button onClick={onChange}>改变姓名:姓名{user.name}</button>
      </div>
    </React.Fragment>
  )
}