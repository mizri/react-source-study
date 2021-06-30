import * as React from 'react';


function Child1() {

  return (
    <div>我是child1</div>
  );
}

function Child2() {
  return (
    <div>我是child2</div>
  );
}


function Father(props) {
  return (
    <React.Fragment>
      <div>我是Father</div>
      {React.Children.map(props.children, (item) => {
        return React.cloneElement(item, {
          ...item.props,
          name: '1',
        });
      })}
    </React.Fragment>
  );
}

export default class App extends React.Component {
  render() {
    return (
      <React.StrictMode>
        <Father>
          <Child1 />
          <Child2 />
        </Father>
      </React.StrictMode>
    );
  } 
}