import * as React from 'react';

function Level1(props) {
  
  return (
    <React.Fragment>
      <Level2 name={props.name} />
    </React.Fragment>
  );
}

function Level2(props) {
  return (
    <React.Fragment>
      <Level3 name={props.name} />
    </React.Fragment>
  );
}

function Level3(props) {
  return (
    <React.Fragment>
      <Level4 name={props.name} />
    </React.Fragment>
  );
}

function Level4(props) {
  return (
    <React.Fragment>
      <div>我经过了几次传递显示name:{props.name}</div>
    </React.Fragment>
  );
}

// ==========================不华丽但很实用的分割线==========================
// =======================================================================
// =======================================================================
// =======================================================================

function ContextLevel1() {
  return (
    <React.Fragment>
      <ContextLevel2 />
    </React.Fragment>
  );
}

function ContextLevel2(props) {
  return (
    <React.Fragment>
      <ContextLevel3 />
    </React.Fragment>
  );
}

function ContextLevel3(props) {
  return (
    <React.Fragment>
      <ContextLevel4 />
    </React.Fragment>
  );
}

const NameContext = React.createContext({ name: 'yufeilong' });

class ContextLevel4 extends React.Component {
  static contextType = NameContext
  
  render() {
    return (
      <React.Fragment>
        <div>我一次就到了:{this.context.name}</div>
      </React.Fragment>
    );
  }
}

// ==========================不华丽但很实用的分割线==========================
// =======================================================================
// =======================================================================
// =======================================================================

export default class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Level1 name="langgan" />
        <NameContext.Provider value={{ name: 'langgan' }}>
          <ContextLevel1 />
        </NameContext.Provider>
      </React.Fragment>
    );
  }
}
