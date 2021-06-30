
import * as React from 'react';

const MyContext = React.createContext('yufeilong');

function Level1(props) {
  
  return (
    <React.Fragment>
      <Level2 />
    </React.Fragment>
  );
}

function Level2(props) {
  return (
    <React.Fragment>
      <Level3 />
    </React.Fragment>
  );
}

function Level3(props) {
  return (
    <React.Fragment>
      <Level4 />
    </React.Fragment>
  );
}

function Level4(props) {
  return (
    <React.Fragment>
      <MyContext.Consumer>
        {(value) => <div>函数组件使用context.consumer:{value}</div>}
      </MyContext.Consumer>
      
    </React.Fragment>
  );
}

export default function App() {
  return (
    <MyContext.Provider value="langgan">
      <Level1 />
    </MyContext.Provider>
  );
}