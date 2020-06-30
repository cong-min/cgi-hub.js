# 介绍

`cgi-hub.js` 顾名思义，是一款用于 Client 端 CGI 接口请求统一规范管理 JS 库。它具备以下特性：

- **接口统一管理：** 中心化管理所有 CGI 接口，基于命名空间将接口请求函数化、标准化，以提升接口请求与响应的复用性、可拓展性、可维护性
- **请求生命周期：** 你可以包装自己喜爱的接口请求基础库，初始化请求各个生命周期的钩子函数，它将利用 Promise 规范化整个请求生命周期流程
- **错误异常处理：** 支持请求的统一异常处理，内部暴露请求重试的方法可实现单次接口快速重试。同时用插件可提供各类场景下异常处理的解决方案，减少处理逻辑
- **TypeScript 支持：** 它基于 TS 开发，支持对所有 CGI 的请求与响应类型进行推导。推荐在项目中使用 TS 定义接口类型，搭配 JSDoc 实现将 CGI 接口文档展示至 IDE 代码提示中
- **规范开发约束：** 它的价值不仅在于提供管理请求接口的基本功能，更在于方便制定一些标准规范约束开发，利于工具自动生成接口的数据类型与请求代码
- **适用多端解决方案：** 文档内提供了Web端、小程序端等各端适用的 CGI 请求解决方案，还提供了多个场景下请求方法与错误处理的插件

## 安装


```bash
# 安装 `cgi-hub.js`
$ npm i -S cgi-hub.js
```

```ts
import CgiHub from 'cgi-hub.js';
```

## API

`class CgiHub`

### [Cgihub(cgis)](https://github.com/mcc108/cgi-hub.js/blob/master/packages/cgi-hub.js/src/index.ts#L127)

`构造函数` 创建实例，并登记 CGI

**参数：** `{Object} cgis` 带命名空间的 CGI 列表\
**返回：** `{CgiHub} cgihub` 实例

### [CgiHub.createRequest(lifecycle)](https://github.com/mcc108/cgi-hub.js/blob/master/packages/cgi-hub.js/src/index.ts#L83)

`静态方法` 根据请求生命周期创建网络请求方法（更多可查阅[请求生命周期](/guide/lifecycle)）

**参数：** `{Object} lifecycle` 请求生命周期\
`{Function} lifecycle.beforeFetch` 请求前公共处理方法\
`{Function} lifecycle.fetch` 请求公共方法\
`{Function} lifecycle.afterFetch` 请求后公共处理方法\
`{Function} lifecycle.errorHandler` 异常处理公共方法\
**返回：** `{Function} request` 标准化的请求方法

### [CgiHub.plugin(type, install)](https://github.com/mcc108/cgi-hub.js/blob/master/packages/cgi-hub.js/src/index.ts#L71)

`静态方法` 注册插件

**参数：** \
`{String} type` 插件类型，对应的请求生命周期名\
`{Function} install` 安装插件对应生命周期的函数\
**返回：** `{Function} request` 对应生命周期的函数

### [CgiHub.prototype.add(cgis)](https://github.com/mcc108/cgi-hub.js/blob/master/packages/cgi-hub.js/src/index.ts#L138)

`实例方法` 追加登记 CGI

**参数：** `{Object} cgis` 带命名空间的 cgi 列表\
**参数：** `{CgiHub} cgihub` 实例

### [CgiHub.prototype.cgi](https://github.com/mcc108/cgi-hub.js/blob/master/packages/cgi-hub.js/src/index.ts#L120)

`实例属性` 获取当前实例登记的所有 CGI 列表
