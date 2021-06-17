# react 源码学习分析

## React版本

本地react分析的版本使用的

## React本地调试环境搭建

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
```
git clone git@github.com:mizri/react.git
```
将我们刚才fork出来的react源码clone下来


### 增加git子模块
git submodule使用请自行查看相关文档


由于我们`src/react`下的有 `.git` 文件，工程根目录下也有，所以这里用git子模块，解决git嵌套问题

在根目录下创建`.gitmodules`文件，增加如下配置
```
[submodule "src/react"]
	path = src/react
	url = git@github.com:mizri/react.git
	ignory = dirty
```

在根目录下运行`git submodule init`初始化子模块

### 使用workspaces
`src/react`下面的react是独立的git库，我们希望包安装也是独立的，打开package.json文件，增加如下配置，将react作为独立的工作空间
```
{
  "workspaces": [
    "src/react"
  ],
}
```

#### 更改配置
我们需要自定义配置，所以`cd react-source-study` 运行 `yarn eject` 将webpack的配置文件暴露出来



