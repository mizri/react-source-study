import * as React from 'react';



function BaseData(props) {
  console.log(props.name, '我渲染了');
  return (
    <div>基本数据类型：我的名字叫：{props.name}</div>
  );
}

function ComplexData(props) {

  console.log(props.user, '我渲染了');
  return (
    <div>复杂数据类型：他的名字叫：{props.user.name}</div>
  );
}

function ComplexDataBack(props) {
  console.log(props);
  console.log(props.userBack, '我渲染了');
  return (
    <div>复杂数据类型带回调：他的名字叫：{props.userBack.name}</div>
  );
}

const BaseDataMemo = React.memo(BaseData);
const ComplexDataMemo = React.memo(ComplexData);
const ComplexDataBackMemo = React.memo(ComplexDataBack, (prevProps, nextProps) => {
  return prevProps.userBack.name !== nextProps.userBack.name;
});


export default class App extends React.Component {
  state = {
    name: '测试1',
    user: {
      name: '测试2'
    },
    userBack: {
      name: '测试3',
    }
  }

  onChangeBase1 = () => {
    this.setState({
      name: '测试1被修改'
    });
  }

  onChangeBase2 = () => {
    this.setState({
      name: '测试1'
    });
  }

  onChangeComplex1 = () => {
    const user = { ...this.state.user };
    user.name = "测试2被修改";
    this.setState({ user });
  }

  onChangeComplex2 = () => {
    const { user } = this.state;
    user.name = "测试2被修改，是不扩展对象的";
    this.setState({ user });
  }

  onChangeComplex3 = () => {
    const user = { ...this.state.user };
    this.setState({ user });
  }
  
  onChangeComplexBack1 = () => {
    const userBack = { ...this.state.userBack };
    userBack.name = '测试3被修改了';
    this.setState({ userBack });
  }

  onChangeComplexBack1 = () => {
    const { userBack } = this.state;
    userBack.name = '测试3被修改了aaaaaaaa';
    this.setState({ userBack });
  }

  render() {
    return (
      <div>
        <div><button onClick={this.onChangeBase1}>修改值基本数据类型 值改变</button></div>
        <div><button onClick={this.onChangeBase2}>修改值基本数据类型 值不改变</button></div>
        <div>下面三个主要是对一个对象引用的问题，浅层比较都是对引用地址的比较，不关心对象的属性本身是否改变</div>
        <div><button onClick={this.onChangeComplex1}>修改复杂化数据类型 扩展对象</button></div>
        <div><button onClick={this.onChangeComplex2}>修改复杂化数据类型 不扩展对象</button></div>
        <div><button onClick={this.onChangeComplex3}>修改复杂化数据类型 扩展对象但是值不变</button></div>
        <div>这个是带回调的方式</div>
        <div><button onClick={this.onChangeComplexBack1}>修改复杂化数据类型 扩展对象 带回调比较</button></div>
        <div><button onClick={this.onChangeComplexBack2}>修改复杂化数据类型 不扩展对象 带回调比较</button></div>
        <div>=======================================================</div>
        <div><BaseDataMemo name={this.state.name} /></div>
        <div><ComplexDataMemo user={this.state.user} /></div>
        <div><ComplexDataBackMemo userBack={this.state.userBack} /></div>
      </div>
    );
  }
}