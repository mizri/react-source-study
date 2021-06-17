# react 源码学习分析

## React版本

本地react分析的版本使用的

## React本地调试环境搭建

*本搭建方案大多都是参加别人文章中的方式，源地址
https://www.borgor.cn/2019-12-09/f48cc00c.html*

我们在调试React源码肯定是希望直接使用React工程中未编译过的代码，如果是代码打包过的调试起来还是很麻烦的

### fork 代码

打开react源码fork一个到自己的github中，这样修改过的代码是可以提交的，关于`git fork` 可以自行查看其使用方式

### 创建代码仓库
在自己github上，随便创建一个工程，我这边创建的工程名`react-source-study`，然后clone到自己本地

### 创建项目

`cd`到你创建的工程目录的上一级，我这边是`cd`到`react-source-study`上一级

运行`npx create-react-app react-source-study`创建一个react工程

关于`creat-react-app` 详细使用自行查看相关文档

### clone react
`cd react-source-study/src` 运行
```bash
git clone git@github.com:mizri/react.git
```
将我们刚才fork出来的react源码clone下来


### 增加git子模块
git submodule使用请自行查看相关文档


由于我们`src/react`下的有 `.git` 文件，工程根目录下也有，所以这里用git子模块，解决git嵌套问题

在根目录下创建`.gitmodules`文件，增加如下配置
```bash
[submodule "src/react"]
	path = src/react
	url = git@github.com:mizri/react.git
	ignory = dirty
```

在根目录下运行`git submodule init`初始化子模块

### 使用workspaces
`src/react`下面的react是独立的git库，我们希望包安装也是独立的，打开package.json文件，增加如下配置，将react作为独立的工作空间
```json
{
  "workspaces": [
    "src/react"
  ],
}
```

#### 更改配置
我们需要自定义配置，所以`cd react-source-study` 运行 `yarn eject` 将webpack的配置文件暴露出来

修改`config/webpack.config.js`中的配置项alias如下
```javascript
resolve: {
  alias: {
      // Support React Native Web
      // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
      'react-native': 'react-native-web',
      'react': path.resolve(__dirname, '../src/react/packages/react'),
      'react-dom': path.resolve(__dirname, '../src/react/packages/react-dom'),
      'shared': path.resolve(__dirname, '../src/react/packages/shared'),
      'react-reconciler': path.resolve(__dirname, '../src/react/packages/react-reconciler'),
      // // Allows for better profiling with ReactDevTools
      // ...(isEnvProductionProfile && {
      //   'react-dom$': 'react-dom/profiling',
      //   'scheduler/tracing': 'scheduler/tracing-profiling',
      // }),
      ...(modules.webpackAliases || {}),
    },
}
```

修改环境变量配置`config/env.js`

```javascript
const stringified = {
  spyOnDev: true,
  spyOnDevAndProd: true,
  spyOnProd: true,
  __EXPERIMENTAL__: true,
  __EXTENSION__: true,
  __PROFILE__: true,
  __TEST__: true,
  __UMD__: true,
  __VARIANT__: true,
  __DEV__: true,
  gate: true,
  trustedTypes: true,
  'process.env': Object.keys(raw).reduce((env, key) => {
    env[key] = JSON.stringify(raw[key])
    return env
  }, {})
}
```


根目录创建`.eslintrc.json`文件，添加如下配置
```json
{
  "extends": "react-app",
  "globals": {
    "spyOnDev": true,
    "spyOnDevAndProd": true,
    "spyOnProd": true,
    "__EXPERIMENTAL__": true,
    "__EXTENSION__": true,
    "__PROFILE__": true,
    "__TEST__": true,
    "__UMD__": true,
    "__VARIANT__": true,
    "__DEV__": true,
    "gate": true,
    "trustedTypes": true
  }
}
```

增加安装包
执行`yarn add eslint-plugin-no-for-of-loops eslint-plugin-no-function-declare-after-return eslint-plugin-react-internal eslint-plugin-react-internal -W --save`


忽略flow下type

执行`yarn add @babel/plugin-transform-flow-strip-types -W --dev`

打开`config/webpack.config.js`，编辑babel-loader的plugins，如下
```javascript
plugins: [
  require.resolve('@babel/plugin-transform-flow-strip-types'), // 增加项
  [
    require.resolve('babel-plugin-named-asset-import'),
    {
      loaderMap: {
        svg: {
          ReactComponent:
            '@svgr/webpack?-svgo,+titleProp,+ref![path]',
        },
      },
    },
  ],
  isEnvDevelopment &&
    shouldUseReactRefresh &&
    require.resolve('react-refresh/babel'),
].filter(Boolean),
```

忽略 `react-internal`

在`src/react`下搜索 `react-internal`，将所有有关的eslint配置全部注释，如果是行内代码就删除，否则会一直报错

导出hostconfig

修改文件`src/react/packages/react-reconciler/src/ReactFiberHostConfig.js`，注释中说明，这块还需要根据环境去导出HostConfig。

```javascript
// import invariant from 'shared/invariant';

// We expect that our Rollup, Jest, and Flow configurations
// always shim this module with the corresponding host config
// (either provided by a renderer, or a generic shim for npm).
//
// We should never resolve to this file, but it exists to make
// sure that if we *do* accidentally break the configuration,
// the failure isn't silent.

// invariant(false, 'This module must be shimmed by a specific renderer.');
export * from './forks/ReactFiberHostConfig.dom';
```

保持import first，根据编译信息改

修改文件`src/react/packages/shared/ReactSharedInternals.js`，react此时未export内容，直接从ReactSharedInternals拿值

```javascript
// import * as React from 'react';

// const ReactSharedInternals =
// React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;

import ReactSharedInternals from '../react/src/ReactSharedInternals';

export default ReactSharedInternals;

```

修改文件`src/react/packages/scheduler/src/forks/Scheduler`

```javascript
export {
  ImmediatePriority as unstable_ImmediatePriority,
  UserBlockingPriority as unstable_UserBlockingPriority,
  NormalPriority as unstable_NormalPriority,
  IdlePriority as unstable_IdlePriority,
  LowPriority as unstable_LowPriority,
  unstable_runWithPriority,
  unstable_next,
  unstable_scheduleCallback,
  unstable_cancelCallback,
  unstable_wrapCallback,
  unstable_getCurrentPriorityLevel,
  shouldYieldToHost as unstable_shouldYield,
  unstable_requestPaint,
  unstable_continueExecution,
  unstable_pauseExecution,
  unstable_getFirstCallbackNode,
  getCurrentTime as unstable_now,
  forceFrameRate as unstable_forceFrameRate,
};

// 增加以下配置-------
export {
  unstable_flushAllWithoutAsserting,
  unstable_flushNumberOfYields,
  unstable_flushExpired,
  unstable_clearYields,
  unstable_flushUntilNextPaint,
  unstable_flushAll,
  unstable_yieldValue,
  unstable_advanceTime,
  reset,
} from './SchedulerMock';

export const unstable_Profiling = enableProfiling
  ? {
      startLoggingProfilingEvents,
      stopLoggingProfilingEvents,
    }
  : null;

```

修改文件 `src/react/packages/shared/invariant`，如下
```javascript
export default function invariant(condition, format, a, b, c, d, e, f) {
  if (condition) return; // 增加这段代码
  throw new Error(
    'Internal React error: invariant() is meant to be replaced at compile ' +
      'time. There is no runtime version.',
  );
}
```

关闭eslint 对 fbjs插件的扩展

修改`src/react/.eslingrc.js`，在module.exports中删去`extends: ['fbjs', 'prettier']`

```javascript
module.exports = {
  // extends: ['fbjs', 'prettier']
}

```

修改 `src/app.js` react导入方式，如下
```javascript
// import React from 'react';
// import ReactDOM from 'react-dom';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
```

### 安装

进入 `src/react` 运行 `yarn install`
进入 根目录 运行 `yarn install`

### 运行

`yarn start`


## 不自己手动搭建，直接使用当前工程

首先 运行 `git clone https://github.com/mizri/react-source-study` 下载当前工程 `checkout`到master

然后在根目录下运行`git submodule init` 初始化子模块

继续运行 `git submodule forEach git checkout master` 将子模块更新为master

进入 `src/react` 运行 `yarn install`
进入 根目录 运行 `yarn install`

