import * as React from 'react';


function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = React.useState('offline');

  // ...

  // 在开发者工具中的这个 Hook 旁边显示标签
  // e.g. "FriendStatus: Online"
  React.useDebugValue(isOnline ? 'Online' : 'Offline');

  return isOnline;
}


export default function App() {
  const isOnline = useFriendStatus();
  return (
    <div>
      是否在线：{isOnline}
    </div>
  );
}