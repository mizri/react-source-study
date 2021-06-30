import * as React from 'react';

// 该组件是动态加载的，打包的时候会被单独打成一个包，运行的时候只有用到了该组件才会请求加载进来
const Demo1= React.lazy(() => import('./demo1'));
const Demo2= React.lazy(() => import('./demo4'));
const Demo3= React.lazy(() => import('./demo3'));

export default class App extends React.Component {
  render() {
    return (
      <React.StrictMode>
        <React.SuspenseList revealOrder="forwards">
          <React.Suspense fallback="我在loading中">
            <Demo1 />
          </React.Suspense>
          <React.Suspense fallback="我在loading中">
            <Demo2 />
          </React.Suspense>
          <React.Suspense fallback="我在loading中">
            <Demo3 />
          </React.Suspense>
        </React.SuspenseList>
      </React.StrictMode>
    );
  } 
}