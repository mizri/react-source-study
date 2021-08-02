import * as React from 'react';

function Test1() {
  let test1Ref = null;

  React.useEffect(() => {
    console.log(test1Ref);
  });

  return (
    <div>
      <button ref={ins => test1Ref = ins}>我是button1</button>
    </div>
  )
}

function Test2(props) {
  return (
    <div>
      <button ref={props.forwardedRef}>我是button2</button>
    </div>
  )
}

const ForwordTest2 = React.forwardRef((props, ref) => {
  return <Test2 forwardedRef={ref} />
});

export default class App extends React.Component {

  componentDidMount() {
    console.log(this.test1Ref);
    console.log(this.test2Ref);
  }

  render() {
    return (
      <React.Fragment>
        <Test1 ref={ins => this.test1Ref = ins} />
        <ForwordTest2 ref={ins => this.test2Ref = ins}/>
      </React.Fragment>
    )
  }
}

//==========================================================================================
//==========================================================================================

// 我们使用antd button 组件的时候，我们希望希望对其在分装一次
// 比如假设当前这个是antd的button
// class Button extends React.Component {
//   onClick = (event) => {
//     alert(`我被点击了 ${event.text || ''}`);
//   }

//   componentDidMount() {
//     this.props.getButtonRef && this.props.getButtonRef(this);
//   }

//   render() {
//     return (
//       <div>
//         <button onClick={this.onClick}>{this.props.children}</button>
//       </div>
//     );
//   }
// }


// // 对antd的button组件进行在封装
// class WrapperButton extends React.Component {
//   onFocus = () => {

//   }

//   render() {
//     console.log(this.props.getButtonRef)
//     return (
//       <Button
//         className="WrapperMockAntdButton"
//         getButtonRef={this.props.getButtonRef} 
//         ref={this.props.forwardedRef}
//       >
//         {this.props.children}
//       </Button>
//     );
//   }
// }

// // 用forword包装
// const ForwordWrapperButton = React.forwardRef((props, ref) => {
//     return (
//       <WrapperButton forwardedRef={ref}>{props.children}</WrapperButton>
//     );
//   }
// )


// export default class App extends React.Component {
//   constructor(props) {
//     super(props);

//     this.button3Ref = React.createRef();
//   }

//   componentDidMount() {
//     // 此时我们希望实现组件第一次挂载后就执行button onClick实例方法
//     // this.button1Ref.onClick({ text: '11111111 }); // 这个代码执行是会报错的，因为此时我们拿不到Button组件实例的
//     // 但是我这样能拿到
//     this.button1CopyRef.onClick({ text: '111111copy' });
//     this.button2Ref.onClick({ text: '22222222' });
//     this.button3Ref.current.onClick({ text: '33333333' });
//   }

//   render() {
//     return (
//       <div>
//         {/* 此时的ref是无法拿到Button原始实例，因为被包裹了一层因此需要转发下 */}
//         {/* 实际上我们自己通过放也可以实现引用但是需要额外的api了 */}
//         <WrapperButton
//           getButtonRef={ins => this.button1CopyRef = ins}
//           ref={ins => this.button1Ref = ins}
//         >
//           我是antd button组件实例11111111 我有一个onclick方法
//         </WrapperButton>
//         <Button ref={ins => this.button2Ref = ins}>我是antd button组件实例2222222 我有一个onclick方法</Button>
//         <ForwordWrapperButton ref={this.button3Ref}>我是antd button组件实例2222222 我有一个onclick方法</ForwordWrapperButton>
//       </div>
//     );
//   }
// }


//==========================================================================================
//==========================================================================================

// 最后看下高阶组件的例子
// class Button extends React.Component {
//   onClick = (event) => {
//     alert(`我被点击了 ${event.text || ''}`);
//   }

//   render() {
//     return (
//       <div>
//         <button onClick={this.onClick}>{this.props.children}</button>
//       </div>
//     );
//   }
// }

// function logProps(WrapperComponent) {
//   class LogProps extends React.Component {
//     componentDidUpdate(prevProps){
//       console.log(prevProps);
//       console.log(this.props);
//     }
  
//     render() {
//       return (
//         <WrapperComponent {...this.props} ref={this.props.forwardRef}>
//           {this.props.children}
//         </WrapperComponent>
//       );
//     }
//   }

//   return LogProps;
// }

// const WrapperButtion = logProps(Button);

// const ForwardWarpperButton = React.forwardRef((props, ref) => {
//   return <WrapperButtion forwardRef={ref}>{props.children}</WrapperButtion>
// });

// export default class App extends React.Component {
//   componentDidMount() {
//     // 这个输出的是LogProps的实例，无法拿到WrapperComponent的实例
//     console.log(this.button1Ref);
//     // 这个是可以拿到的
//     this.button2Ref.onClick({ text: '222222' });
//   }

//   render() {
//     return (
//       <React.Fragment>
//         <WrapperButtion ref={ins => this.button1Ref = ins} className="button">我是一个高阶组件 button 111111</WrapperButtion>
//         <ForwardWarpperButton ref={ins => this.button2Ref = ins}>我是一个高阶组件 button 22222</ForwardWarpperButton>
//       </React.Fragment>
//     );
//   }
// }