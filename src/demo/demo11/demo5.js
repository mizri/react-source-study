import * as React from 'react';

const ContextEvent = React.createContext({
  data: {
    name: 'yufeilong',
    height: '175',
  },
});

const ContextSchool = React.createContext({
  data: {
    name: 'zheda',
  }
});

const ContextClass = React.createContext({
  data: {
    name: 'sannianerban'
  }
});


function ConsumerScholl() {

  return (
    <ContextSchool.Consumer>
      {
        (value) => {
          return (
            <div>
              <div>学校：{value.data.name}</div>
              <ConsumerClass />
            </div>
          )
        }
      }
    </ContextSchool.Consumer>
    
  );
}

function ConsumerClass() {
  return (
    <ContextClass.Consumer>
      {(value) => {
        return (
          <div>
            班级名称：{value.data.name}
          </div>
        );
      }}
    </ContextClass.Consumer>
  )
}



class Information extends React.Component {
  static contextType = ContextEvent;

  onClick = () => {
    console.log(this.context)
    this.context.onChange();
  }

  render() {
    return (
      <div>
        <div>名字：{this.context.data.name} <button onClick={this.onClick}>刷新名字</button></div>
        <ContextSchool.Provider value={{ data: { name: '小学' } }}>
          <ContextClass.Provider value={{ data: { name: '三年二班' } }}>
            <ConsumerScholl />
          </ContextClass.Provider>
        </ContextSchool.Provider>
      </div>
    );
  }
}

export default class App extends React.Component {

  state = {
    data: { name: 'yufeiong' }
  }

  onChange = () => {
    this.setState({
      data: { name: 'langgan' }
    });
  }

  render() {
    return (
      <ContextEvent.Provider value={{ data: this.state.data, onChange: this.onChange }}>
        <Information />
      </ContextEvent.Provider>
    );
  }
}