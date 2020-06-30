
# 标准接入

## 自助接入

<img :src="$withBase('/imgs/project-structure.png')" alt="推荐项目结构">

上图介绍了 `cgi-hub.js` 在实际项目中扮演的角色，同时也是**推荐的项目结构**。下面会对这个结构进行概述。


### 1、创建 `request`

在项目中创建 `cgi-hub/request.ts` 文件，在这个文件内引入 `npm` 包 `cgi-hub.js` ，使用其静态方法 `CgiHub.createRequest` 对请求流程进行创建，参数 `lifecycle` 为 [请求生命周期](/guide/lifecycle)，提供的 4 个生命周期钩子函数可根据业务需求自定义实现，都须返回 `Promise` 。

**使用插件：** 文档左侧导航里也提供了覆盖小程序端、Web端等各类场景下的请求生命周期 [插件](/plugins/) 代码，推荐参考并按需进行使用。

```ts
/* request.ts */
import CgiHub from 'cgi-hub.js';

// 创建 CgiHub 请求方法
const request = CgiHub.createRequest({
  /* fetch 请求前公共处理方法 */
  // async beforeFetch(options) { return options },
  /* 发起 fetch 请求公共方法 */
  async fetch(options) {
    // TODO 使用自己喜爱的接口请求基础库, 返回 Promise
  },
  /* fetch 请求后公共处理方法 */
  // async afterFetch(res, opts) { return res },
  /* 异常处理公共方法 */
  async errorHandler(res, opts) {
    return Promise.reject(res);
  },
});

export default request;
```

### 2、定义 `cgi.d.ts`

创建 `cgi.d.ts`，例如为 `user/login` 接口定义数据类型：

```ts
export = CGI;
export as namespace CGI;
declare module CGI {
  /**
   * Request & Response
   * */
  /**
   * @service User 用户
   * @method Login 初始化登录态
   * */
  export interface UserLoginRequest {
    /** 前端登陆 code */
    code: string;
  }
  export interface UserLoginResponse {
    /** 登陆态 */
    session: string;
  }
}
```

### 3、包装 `cgi`

根据接口模块包装不同命名空间的 `cgi`，例如：`cgi/user.ts`：

```ts
import CGI from '../cgi.d';
import request from '../request';

/**
 * @name user 用户
 * @baseUrl https://your-url.com/
 * */
export default {
  /**
   * @url user/login
   * @name login 用户登录
   * @description 通过此请求初始化登录态
   * */
  async login(data: CGI.UserLoginRequest, options?) {
    return await request<CGI.UserLoginResponse>({
      method: 'POST',
      url: 'user/login',
      data,
      ...options
    })
      // 操作数据
      // .then((data) => {
      //   return data;
      // })
      // 异常处理
      // catch((error) => {
      //   throw error;
      // });
  },
};
```

### 4、登记 `cgi`

在 `cgi-hub` 目录下的创建暴露给外部模块的入口 `index.ts`：

```ts
import CgiHub from 'cgi-hub.js';
// cgi namespaces
import user from './cgi/user';

// 注册 CGI
const cgiHub = new CgiHub({
  user,
});

export default cgiHub;
```

### 5、接口请求

引入实例，可在项目任意地方进行 CGI 调用。（更建议将实例 `cgi` 属性全局注入至应用中）

```ts
import cgihub from './cgi-hub';

const { cgi } = cgihub;

cgi.use.login({
  code: 'test',
}).then(data => {
  console.log(data.session)
})
```

搭配 IDE，可对请求与响应数据类型进行推导与提示，利用 TS & JSDoc 还将展示更多能力。

::: tip 实践与规范
实际场景下的应用建议查阅 [实践与规范](/plugins/)，按需参考
:::


## 代码生成工具

在团队内部，cgi-hub 提供的一套 [代码生成工具]()，它会根据后端接口提供的 `proto` 文件，自动生成了接口数据类型描述 `.d.ts` 和所有请求管理 `.ts` 文件代码，以规范开发约束，生成的文件结构如下上图所示。但目前 cgi-hub 代码生成工具基于团队内部系统实现，未对外开放。另外我们也在尝试接入更多的后台接口系统完成代码的自动生成。

不过现在你也可以自行根据上述自助接入标准完成规范使用。
