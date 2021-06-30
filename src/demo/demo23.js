import * as React from 'react';


export default function App() {
  const buttonCreateRef = React.createRef();
  const buttonUseRef = React.useRef();
  let buttonRef = null;

  React.useEffect(() => {
    console.log(buttonCreateRef.current);
    console.log(buttonUseRef.current);
    console.log(buttonRef);
  }, []);

  return (
    <React.Fragment>
      <div>
        <button ref={buttonCreateRef}>我是测试按钮 用createRef引用 1</button>
      </div>
      <div>
        <button ref={buttonUseRef}>我是测试按钮 用useRef引用 2</button>
      </div>
      <div>
        <button ref={ins => buttonRef = ins}>我是测试按钮3 用function引用</button>
      </div>
    </React.Fragment>
  );
}