import * as React from 'react';

const FancyInput = React.forwardRef((props, ref) => {
  const [ fresh, setFresh ] = React.useState(false)
  const attRef = React.useRef(0);
  React.useImperativeHandle(ref, () => ({
    attRef,
    fresh
  }), [ fresh ]);

  const handleClick = React.useCallback(() => {
    attRef.current++;
  }, []);

  return (
    <div>
      {attRef.current}
      <button onClick={handleClick}>Fancy</button>
      <button onClick={() => setFresh(!fresh)}>刷新</button>
    </div>
  )
});

export default function App(props) {
  const fancyInputRef = React.useRef();

  return (
    <div>
      <FancyInput ref={fancyInputRef} />
      <button
        onClick={() => console.log(fancyInputRef.current)}
      >父组件访问子组件的实例属性</button>
    </div>
  )
}
