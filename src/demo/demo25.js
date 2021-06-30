import * as React from 'react';

let times = 0;

// export default function App() {
//   const [loading, setLoading] = React.useState(false);
//   const [count, setCount] = React.useState(60);

//   let timer = null;

//   function onGetVerifyCode() {
//     // 点击以后进入60s倒计时
//     setLoading(true);

//     timer = setInterval(() => {
//       setCount(count - 1);
//       console.log(`count=${count}`);
//     }, 10000);

//     console.log(timer);
//   }

//   ++times;

//   console.log(`times=${times}`);
//   console.log(`timer=${timer}`)

//   return (
//     <div style={{ padding: '24px' }}>
//       <input placeholder="验证码" />
//       <button onClick={onGetVerifyCode} disabled={loading}>
//         {!loading ? '点击获取验证码' : `(${count})s`}
//       </button>
//     </div>
//   )
// }

export default function App() {
  const [loading, setLoading] = React.useState(false);
  const [count, setCount] = React.useState(60);
  const saveCountTimer = React.useRef(null);

  
  function countdown() {
    setCount(count - 1); 
    console.log(count);
  }

  saveCountTimer.current = countdown;

  function onGetVerifyCode() {
    // 点击以后进入60s倒计时
    setLoading(true);

    setInterval(() => {
      saveCountTimer.current();
    }, 1000);

  }

  ++times;

  console.log(times);

  return (
    <div style={{ padding: '24px' }}>
      <input placeholder="验证码" />
      <button onClick={onGetVerifyCode} disabled={loading}>
        {!loading ? '点击获取验证码' : `(${count})s`}
      </button>
    </div>
  )
}