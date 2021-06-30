import * as React from 'react';

function Name(props) {
  console.log('name 渲染');
  return (
    <div>我是姓名组件 name:{props.value}</div>
  )
}

const NameMemo = React.memo(Name);

function Age(props) {
  console.log('age 渲染')
  return (
    <div>我是年龄组件 age:{props.value}</div>
  )
}

const AgeMemo = React.memo(Age);

function Height(props) {
  console.log('height 渲染');
  return (
    <div>我是身高组件 heigth:{props.value} <button onClick={props.onChangHeight}>点击我调用父组件改变身高方法 但不修改值</button></div>
  )
}
const HeightMemo = React.memo(Height);


function Gender(props) {
  console.log('Gender 渲染');
  return (
    <div>我是性别 Gender:{props.value} <button onClick={props.onChangeGender}>点击我调用父组件改变身高方法 但不修改值</button></div>
  )
}

const GenderMemo = React.memo(Gender);


export default function App(props) {
  
  const [user, setUser] = React.useState({
    name: 'yufeiong',
    age: 100,
    height: 175,
    gender: '男',
  });
  
  function onChange() {
    setUser({
      name: 'langgan',
      age: 100,
      height: 175,
      gender: '男',
    });
  }
  
  function onChangHeight() {
    setUser({
      name: 'yufeiong',
      age: 100,
      height: 175,
      gender: '男',
    });
  }

  function onChangeGender() {
    setUser({
      name: 'yufeiong',
      age: 100,
      height: 175,
      gender: '男',
    });
  }

  const onChangeGenderCallback = React.useCallback(onChangeGender, []);


  return (
    <div>
      <button onClick={onChange}>点击修改信息</button>
      <NameMemo value={user.name} />
      <AgeMemo value={user.age}/>
      <HeightMemo value={user.height} onChangHeight={onChangHeight} />
      <GenderMemo value={user.gender} onChangeGender={onChangeGenderCallback}/>
    </div>
  );
}