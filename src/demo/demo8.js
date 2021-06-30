import * as React from 'react';

// 该组件是动态加载的，打包的时候会被单独打成一个包，运行的时候只有用到了该组件才会请求加载进来
const Demo = React.lazy(() => import('./demo1'));

export default class App extends React.Component {
  render() {
    return (
      <React.StrictMode>
        <React.Suspense fallback="我在loading中">
          I am a lazy component
          <Demo />
        </React.Suspense>
      </React.StrictMode>
    );
  } 
}