import * as React from 'react';

const defaultList = (new Array(5000)).fill(1).map((num, index) => {
  return {
    value: index,
    key: index,
  }
});

function Input(props) {
  return (
    <input onChange={e => e} value={props.value}/>
  )
}

function InputList(props) {
  return (
    <div>
      {defaultList.map((item) => {
        return (
          <Input key={item.key} value={props.value} />
        )
      })}
    </div>
  )
}

function App(props) {
  const [value, setValue] = React.useState(0);
  // const [isLeaning, startLeaning] = React.useTransition();

  function onChange1(event) {
      setValue(event.target.value);
  }
  
  function onChange2(event) {
    React.startTransition(() => {
      setValue(event.target.value);
    });
  }

  function onChange3(event) {
    // React.startTransition(() => {
    //   setValue3(event.target.value);
    // });
    setValue(event.target.value);
  }

  function onChange4(event) {
    React.startTransition(() => {
      setValue(event.target.value);
    });
  }

  // function onChange5(event) {
  //   startLeaning(() => {
  //     setValue5(event.target.value);
  //   });
  // }
  
  return (
    <div>
      <div>
        测试1<input style={{ width: '600px' }} onChange={onChange1} />
      </div>
      <div>
        测试2<input style={{ width: '600px' }} onChange={onChange2} />
      </div>
      <div>
        测试3<input type="range" style={{ width: '600px' }} defaultValue="1000" onChange={onChange3} step="1" max="1000" min="0" />
      </div>
      <div>
        测试4<input type="range" style={{ width: '600px' }} onChange={onChange4} step="1" max="1000" min="0" />
      </div>
      {/* <div>
        测试5<input type="range" style={{ width: '600px' }} onChange={onChange5} value={value5} step="1" max="1000" min="0" />
      </div> */}
      <div>
        <InputList value={value} />
      </div>
    </div>
  );
}

export default App;