import * as React from  'react';

function initUser(user = {}) {
  return {
    name: 'yufeilong',
    age: 100,
    height: 176,
    ...user,
  }
}

export default function App() {
  const [count, dispatchCount] = React.useReducer((state, action) => {
    switch(action.type) {
      case 'increase': {
        return state + 1;
      }
      case 'decrease': {
        return state - 1;
      }
      case 'reset': {
        return 0;
      }
      case 'set': {
        return action.payload
      }
      default: {
        return 0;
      }
    }
  }, 0);

  function onIncrease() {
    dispatchCount({ type: 'increase' });
  }

  function onDecrease() {
    dispatchCount({ type: 'decrease' });
  }

  function onReset() {
    dispatchCount({ type: 'reset' });
  }

  function onSetHundred() {
    dispatchCount({ type: 'set', payload: '100' });
  }

  const [user, dispatchUser] = React.useReducer((state, action) => {
    switch(action.type) {
      case 'modifyName': {
        return { ...state, name: action.name }
      }
      case 'modifyAge': {
        return { ...state, age: action.age }
      }
      case 'reset': {
        return initUser();
      }
      default:
        return state;
    }
  }, { name: 'yufeiong', age: '100', height: 176 }, initUser);

  function onModifyName() {
    dispatchUser({ type: 'modifyName', name: 'langgan' });
  }
  
  function onModidyAge() {
    dispatchUser({ type: 'modifyAge', age: '200' });
    
  }
  
  function onResetUser() {
    dispatchUser({ type: 'reset' });
  }

  return (
    <React.Fragment>
      <div>
        <div>count：{count}</div>
        <div><button onClick={onIncrease}>点击我加一</button></div>
        <div><button onClick={onDecrease}>点击我减一</button></div>
        <div><button onClick={onReset}>点击我重置</button></div>
        <div><button onClick={onSetHundred}>直接设置为100</button></div>
      </div>
      <div>
        <br />
        <div>
          user name:{user.name} <br />
          age:{user.age} <br />
          height: {user.height}
        </div>
        <div><button onClick={onModifyName}>点我改名字</button></div>
        <div><button onClick={onModidyAge}>点我改年龄</button></div>
        <div><button onClick={onResetUser}>点击我重置</button></div>
      </div>
    </React.Fragment>
  );
}
