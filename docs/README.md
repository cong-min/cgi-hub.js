---
home: true
heroImage: /imgs/logo.svg
heroText: cgi-hub.js
tagline: Client 端 CGI 接口请求统一规范管理 JS 库
actionText: 快速上手
actionLink: /guide/
features:
- title: 接口统一管理
  details: 中心化管理所有 CGI 接口，基于命名空间将接口请求函数化、标准化，以提升接口请求与响应的复用性、可拓展性、可维护性
- title: 请求生命周期
  details: 你可以包装自己喜爱的接口请求基础库，初始化请求各个生命周期的钩子函数，它将利用 Promise 规范化整个请求生命周期流程
- title: 错误异常处理
  details: 支持请求的统一异常处理，内部暴露请求重试的方法可实现单次接口快速重试。同时用插件可提供各类场景下异常处理的解决方案，减少处理逻辑
- title: TypeScript 支持
  details: 它基于 TS 开发，支持对所有 CGI 的请求与响应类型进行推导。推荐在项目中使用 TS 定义接口类型，搭配 JSDoc 实现将 CGI 接口文档展示至 IDE 代码提示中
- title: 规范开发约束
  details: 它的价值不仅在于提供管理请求接口的基本功能，更在于方便制定一些标准规范约束开发，利于工具自动生成接口的数据类型与请求代码
- title: 适用各端解决方案
  details: 文档内提供了Web端、小程序端等各端适用的 CGI 请求解决方案，还提供了多个场景下请求方法与错误处理的插件
footer: MIT Licensed
---
