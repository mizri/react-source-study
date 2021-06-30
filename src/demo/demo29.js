import * as React from 'react';

const data = new Array(50000).fill(1).map((num, index) => {
  return index;
});

function Test(props) {
  return (
    <div>
      {data.map((item) => {
        return (
          <div key={item}>
            {props.text}
          </div>
        );
      })}
    </div>
  );
}

export default function App() {
  const [text, setText] = React.useState('1');
  const deferredText = React.useDeferredValue(text, { timeoutMs: 3000 });


  return (
    <React.Fragment>
      <div>
        <input type="text" onChange={event => React.startTransition(() => setText(event.target.value))} />
      </div>
      <Test text={deferredText} />
    </React.Fragment>
  );
}