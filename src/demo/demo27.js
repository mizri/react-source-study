import * as React from  'react';

function createStore(initialValue) {
  // 创建一个数据源，就是存放数据以及订阅的回调列表
  const ref = {
    current: initialValue,
    listeners: [],
  }

  // 创建一个可变数据源
  // 第一个参数是数据源ref
  // 第二个参数就是getVersion方法，他会把ref作参数soure传入
  const mutableSource = React.createMutableSource(ref, (source) => {
    // 输出true两个是一回事
    console.log(source === ref);
    return source.current;
  });
  // 获取数据方法，就是返回数据的方法，这个可以是自定义的
  const getSnapshot = (ref) => ref.current;
  // 创建订阅方式
  const subscribe = (ref, callback) => {
    // 我们输出一下看下什么东东
    console.log(callback);
    // 放入ref中的回调列表中
    ref.listeners.push(callback);
    // 返回一个unsubscibe
    return () => {
      ref.listeners.splice(ref.listeners.indexOf(callback), 1);
    }
  }

  // 任何组件都可以使用此方法订阅这个store数据源
  const useStore = (getData) => {
    // React.useMutableSource 接受三个参数
    // 1、 mutableSource 就是我们刚才创建的
    // 2、 第二个是获取数据的方法，useMutableSource会把ref作为参数传入getSnapshot
    // 3、 第三个是订阅事件 useMutableSource会传入一个ref和一个callabck
    // 在组件中每执行一次就会就会把，数据源与获取数据的方式以及新的订阅方法传入
    return React.useMutableSource(mutableSource, getData || getSnapshot, subscribe);
  }

  // 进行数据修改，广播到每个订阅的组件
  const dispatch = (value) => {
    // 修改数据
    ref.current = value;
    // 修改了数据以后，就会执行lisenter方法，然后每个订阅会执行getSnapshot方法
    // 这里的每个listener就是React.useMutableSource时候传入的callback
    ref.listeners.forEach(listener => listener());
  }

  return [
    useStore,
    dispatch,
  ]
}

// 执行下
// 到这里的话就会返现和redux很像了
const [useStore, dispatch] = createStore({
  user: {
    name: 'yufeilong',
    age: 100,
  },
  book: {
    name: 'javascript first header',
    author: 'langgan',
  }
});

function User() {
  // 进行user组件数据订阅
  const data = useStore();
  return (
    <div>
      我是用户信息：name:{data.user.name} age: {data.user.age}
    </div>
  );
}

function Book() {
  // 进行book组件订阅
  const data = useStore();
  return (
    <div>
      我是书籍信息：name:{data.book.name} author:{data.book.author}
    </div>
  );
}


export default function App() {
  
  function onChange() {
    // 修改数据进行广播通知到每个订阅了的组件
    dispatch({
      user: {
        name: 'langgan',
        age: 200,
      },
      book: {
        name: 'http权威指南',
        author: 'test',
      }
    })
  }

  return (
    <React.Fragment>
      <User />
      <Book />
      <div>
        <button onClick={onChange}>点击广播数据,改变两个组件的数据源</button>
      </div>
    </React.Fragment>
  )
}