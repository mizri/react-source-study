import * as React from 'react';

export default function App() {

  React.useEffect(() => {
    document.getElementById('test').style.left = '500px';
  }, []);

  // React.useLayoutEffect(() => {
  //   document.getElementById('test').style.left = '500px';
  // }, []);

  return (
    <div>
      <div
        style={{
          width: '120px',
          height: '120px',
          position: 'absolute',
          background: 'red',
          left: 0,
          right: 0
        }}
        id="test"
      ></div>
    </div>
  );
}