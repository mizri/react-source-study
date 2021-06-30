import * as React from 'react';

const MyContext = React.createContext('yufeiong');

function Level1(props) {
  
  return (
    <div>
      <Level2 />
    </div>
  )
}

function Level2(props) {
  
  return (
    <div>
      <Level3 />
    </div>
  )
}

function Level3(props) {
  
  return (
    <div>
      <Level4 />
    </div>
  )
}

function Level4(params) {
  const name = React.useContext(MyContext);
  return (
    <div>
      我的名字叫：{name}
    </div>
  )
}


export default function App() {
  const [name, setName] = React.useState('langgan');

  return (
    <MyContext.Provider value={name}>
      <div><button onClick={() => setName('yufeilong')}>点击修改我的名字</button></div>
      <Level1 />
    </MyContext.Provider>
  );
}