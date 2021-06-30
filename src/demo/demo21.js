import * as React from 'react';

function Name(props) {
  return (
    <div>我是姓名组件 name:{props.value}</div>
  )
}

function Age(props) {
  return (
    <div>我是年龄组件 age:{props.value}</div>
  )
}

function Height(props) {
  return (
    <div>我是身高组件 heigth:{props.value}</div>
  )
}


export default function App(props) {
  
  const [user, setUser] = React.useState({
    name: 'yufeiong',
    height: 175,
    age: 100,
  });

  function onChange() {
    setUser({
      name: 'langgan',
      height: 178,
      age: 100,
    });
  }

  const ageMemo = React.useMemo(() => {
    console.log('我的年龄渲染了');
    return <Age value={user.age}/>
  }, [user.age]);

  return (
    <div>
      <button onClick={onChange}>点击修改信息</button>
      <Name value={user.name} />
      <Age value={user.age}/>
      <Height value={user.height}/>
      {ageMemo}
    </div>
  );
}