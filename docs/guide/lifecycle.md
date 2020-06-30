# 请求生命周期

`CgiHub.createRequest(lifecycle)` 静态方法可以用来创建标准化的请求函数，其中参数 `lifecycle` 代表了请求的生命周期：

- **beforeFetch：** 请求前
- **fetch：** 请求方法
- **afterFetch：** 请求后
- **errorHandler：** 异常处理

下面对 [createRequest 的实现](https://github.com/mcc108/cgi-hub.js/blob/master/packages/cgi-hub.js/src/index.ts#L83)进行解析，你就可以清楚了解整个请求流程的生命周期：

```ts {4,8,10,12}
const request = requestOptions => (
  Promise.resolve(requestOptions)
    // 请求前
    .then(beforeFetch)
    // 请求参数修改 options 重新赋值, 并传递给 fetch
    .then(opts => (requestOptions = opts))
    // 发起请求, 类型断言
    .then(fetch)
    // 请求后
    .then(response => afterFetch(response, requestOptions))
    // 统一异常处理
    .catch(error => errorHandler(
      error,
      requestOptions,
      // retry
      (resolve, reject) => request(requestOptions).then(resolve, reject),
    ))
);
```

不难理解，它通过 `Promise` 将请求流程串联，并进行统一的异常处理以及重试的支持。下面是每个钩子函数的详细说明：

## beforeFetch

**类型：** `(requestOptions: Object) => Promise | Object`

请求前公共处理方法，传入请求参数，返回新的请求参数。

可以考虑在此处追加全局的数据或登录态、请求上报等。

## fetch

**类型：** `(requestOptions: Object) => Promise | any`

请求时的基础方法，传入请求参数，返回一个 `Promise` 响应数据。你可以包装自己喜爱的接口请求基础库，也可以基于文档提供的插件文件进行改动。

**提供插件：**

- Web
  - web-xhr.fetch.ts 待开发
  - web-fetch.fetch.ts 待开发
  - axios.fetch.ts 待开发
- 小程序
  - mp-native.fetch.ts 待开发
  - [we-request.fetch.ts](../plugins/we-request.fetch.ts)
- Node.js
  - node-native.fetch.js 待开发

## afterFetch

**类型：** `(response: any, requestOptions: Object) => Promise | any`

请求后公共处理方法，传入响应数据与请求参数，返回新的响应数据。

可以考虑在此处解析响应数据结构、抛出状态码异常、处理登录态、日志上报等。

## errorHandler

**类型：** `(response: any, requestOptions: Object, retry) => Promise | any`\
**参数 `retry` 类型：** `(resolve, reject) => Promise`

异常处理公共方法，传入响应数据与请求参数以及请求重试方法，返回一个 `Promise`，或者新的响应数据。

可以考虑在此处利用 `Promise` 完成请求快速重试、通过错误装饰器判断内置错误提示方式、错误码提示映射、错误上报等。

**提供插件：**

- Web
  - element-ui.errorHandler.ts 待开发
- 小程序
  - [mp.errorHandler.ts](../plugins/mp.errorHandler.ts)
- Node.js
