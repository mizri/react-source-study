
import * as React from 'react';


class PureChild extends React.PureComponent {
  static defaultProps = {
    count: 0
  }

  render() {
    const { count } = this.props;
    console.log('我没有重新渲染');
    return (
      <div>简单数据结构PureChild:   {count}</div>
    )
  }
}

class ComplexPureChild extends React.PureComponent {
  static defaultProps = {
    user: {}
  }

  render() {
    console.log('ComplexPureChild：复杂类型数据类型下对我没用我也渲染');
    const { user } = this.props;
    return (
      <div>复杂数据结构ComplexPureChild：  姓名：{user.name} 性别：{user.sex}</div>
    );
  }
}

class ComplexPureSameChild extends React.PureComponent {
  static defaultProps = {
    user: {}
  }

  render() {
    const { user } = this.props;
    return (
      <div>复杂数据结构ComplexPureSameChild：  姓名：{user.name} 性别：{user.sex}</div>
    );
  }
}


class NormalChild extends React.Component {
  static defaultProps = {
    count: 0,
  }

  render() {
    const { count } = this.props;
    console.log('NormalChild：我重新渲染了');
    return (
      <div>普通非Puer组件NormalChild:   {count}</div>
    )
  }
}

class NormalSameChild extends React.Component {
  static defaultProps = {
    count: 0,
    user: {}
  }

  render() {
    const { count } = this.props;
    console.log('NormalSameChild：我重新渲染了');
    return (
      <div>普通非Puer组件NormalSameChild:   {count}</div>
    )
  }
}


class App extends React.Component {
  state = {
    count: 0,
    user: {
      name: 'yufeilong',
      sex: '男',
    }
  }

  onClick = () => {
    this.setState({
      count: 0,
      user: { name: 'yufeilong', sex: '男' },
    });
  }

  onClick1 = () => {
    const { user } = this.state;
    user.name = 'langgan';

    this.setState({ user });
  }

  render() {
    const { count, user } = this.state;
    
    return (
      <div>
        <div><span>count:0</span></div>
        <div>
          <button onClick={this.onClick}>
            第一个按钮
            把count从0 改到0
            把user对象从name从yufeilong 改到 yufeilong
          </button>
        </div>
        <div>
          <button onClick={this.onClick}>
            第二个按钮
            同一个对象修改
          </button>
        </div>
        <div>
          <PureChild count={count} />
          <NormalChild count={count} user={user}/>
          <ComplexPureChild user={user} />
          <ComplexPureSameChild user={user} />
          <NormalSameChild user={user} />
        </div>
      </div>
    );
  }
}

export default App;