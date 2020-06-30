---
sidebarDepth: 1
---

# TS 类型定义

使用 `cgi.d.ts` 可以对请求与响应数据的类型进行定义，如果这个文件是可以通过后端提供的内容用工具自动生成出来的，例如有一个小程序，后端有名为 `ordermanagement` 的服务提供了一个接口 `order/create` ，那么假设类型描述文件可能会有以下内容：

```ts {12,14,25}
export = CGI;
export as namespace CGI;
declare module CGI {

  /**
   * @server ordermanagement
   * */
  export namespace ordermanagement {
    /**
     * @name OrderCreateRequest
     * */
    export interface OrderCreateRequest {
      /** 小程序登陆态 */
      sid: string;
      /** 商品号 */
      product_id: string;
      /** 商品款式 */
      product_style: ordermanagement.ProductStyle;
      /** 数量 */
      amount: number;
    }
    /**
     * @name OrderCreateResponse
     * */
    export interface OrderCreateResponse {
      /** 订单详情 */
      order_detail: ordermanagement.OrderDetail;
    }

    /**
     * @name OrderDetail
     * @desc 订单详情
     * */
    export interface OrderDetail {
      /** 商品号 */
      order_id: string;
      /** 商品号 */
      product_id: string;
      /** 商品款式 */
      product_style: ordermanagement.ProductStyle;
      /** 数量 */
      amount: number;
      /** 下单时间 */
      order_time: number;
    }

    /**
     * @name ProductStyle
     * @desc 商品款式
     * */
    export enum ProductStyle {
      /** 大号 */
      Large = 1,
      /** 小号 */
      Small = 2,
    }
  }
}
```

上面例子的类型描述暴露出一个问题，接口的 `Request` 中包含了全局数据 `sid` 并没有被剔除，所有如果在请求方法中将数据声明为这个类型，调用请求时 TS 将会提示没有传入 `sid`，这时需要这样操作：

## 全局数据类型剔除

使用 TS 泛型 `Omit` 与 `Partial`，可以对全局请求数据的类型进行剔除，设为可选字段。

### 1、创建 `global.d.ts`

首先为项目创建一个 `global.d.ts` 用来声明项目内用到的全局类型：

```ts {5,7}
declare global {
  // 对 CGI 命名空间的补充
  namespace CGI {
    // 全局配置的请求参数, 将会在所有 CGI 的 Request 类型中将以下内容置为可选
    interface GlobalRequest {
      /** 小程序登陆态 */
      sid?: string;

    }
    // 全局配置的响应内容, 将会在所有 CGI 的 Request 类型中将以下内容置为可选
    // interface GlobalResponse {

    // }
  }
}
export {};
```

创建全局类型 `CGI.GlobalRequest` 或 `CGI.GlobalResponse`，将注入的全局请求数据类型定义为可选参数，例如 `sid?`。

### 2、改造 `cgi.d.ts`

接着对 `cgi.d.ts` 这个文件进行改造：

```ts {10,11,17,21-24}
export = CGI;
export as namespace CGI;
declare module CGI {
  /**
   * Request & Response
   * */
  /**
   * @cgi order/create 创建订单
   * */
  export type OrderCreateRequest = PartialGlobalRequest<ordermanagement.OrderCreateRequest>;
  export type OrderCreateResponse = PartialGlobalResponse<ordermanagement.OrderCreateResponse>;

  /**
   * @server ordermanagement
   * */
  export namespace ordermanagement {
    ...
  }

  /* Partial Global */
  interface GlobalRequest {}
  interface GlobalResponse {}
  type PartialGlobalRequest<T> = Omit<T, keyof CGI.GlobalRequest> & Partial<CGI.GlobalRequest>;
  type PartialGlobalResponse<T> = Omit<T, keyof CGI.GlobalResponse> & Partial<CGI.GlobalResponse>;
}
```

在底部定义泛型 `PartialGlobalRequest` `PartialGlobalResponse`，再将各个 CGI 的 `Request` `Response` 包装为新的请求与响应类型。即完成了全局数据类型剔除。

## 单个接口数据类型修改

通常 `cgi.d.ts` 里定义的类型是与 CGI 接口基本保持一致的，因此它是稳定的。若因前端逻辑需要对字段进行修改，不建议直接修改这个文件。而是采取如下方法：在 CGI 请求与响应时使用 TS 内置泛型或混合类型对数据类型进行定义。

同样，引用上文的例子：如果 CGI 请求逻辑中设置了 `amount` 默认固定为 1，`data.amount` 无需传入；同时 CGI 响应处理里新增字段 `status` 订单状态。

`cgi/order.ts` 文件处理前：

```ts
import CGI from '../cgi.d';
import request from '../request';

export default {
  /**
   * @name create
   * @url order/create
   * @title 创建订单
   * */
  async create(data: CGI.OrderCreateRequest>, options?) {
    return await request<CGI.OrderCreateResponse>({
      method: 'POST',
      url: 'order/create',
      data,
      ...options,
    });
  },
}
```

处理后：

```ts {10,11-13}
import CGI from '../cgi.d';
import request from '../request';

export default {
  /**
   * @name create
   * @url order/create
   * @title 创建订单
   * */
  async create(data: Omit<CGI.OrderCreateRequest, 'amount'>, options?) {
    return await request<CGI.OrderCreateResponse & {
      status: string
    }>({
      method: 'POST',
      url: 'order/create',
      data: {
        ...data,
        amount: 1,
      },
      ...options,
    })
      .then(data => {
        data.status = 'success';
        return data;
      });
  },
}
```

这个例子使用了 `Omit` 泛型与 `&` 联合类型对数据类型进行了操作，这样使单个接口数据类型修改更加灵活。


## 小程序 TS 支持类型推导

通常在小程序中，会将 cgihub 实例的 `cgi` 在应用注册 `App()` 时就全局注入至 app 内，页面通过 `getApp()` 获取到 app 实例。

在小程序中使用 TS 时还会用到 `miniprogram-api-typings`，但是目前有个缺陷是 `getApp()` 默认获取到的 app 实例中的属性**无法对声明的自定义属性进行类型推导**，默认皆为 `any`。为了让小程序所有 `getApp()` 获取到的 `app` 实例支持能类型推导，需要对 `app.ts` 进行如下改动：

`app.ts` 文件处理前：

```ts
import cgiHub from './cgi-hub/index';

App({
  cgi: cgiHub.cgi,
});
```

处理后：

```ts {8,10-19}
import cgiHub from './cgi-hub/index';

const appOptions = {
  cgi: cgiHub.cgi,
};
App(appOptions);

type AppOptions = typeof appOptions;

declare global {
  namespace WechatMiniprogram {
    namespace App {
      type AppInstance<T extends IAnyObject> = App.Instance<AppOptions> & T;
      interface GetApp {
        <T>(opts?: GetAppOption): AppInstance<T>
      }
    }
  }
}
```
此处需要注意 `eslint` 如果将 `interface GetApp` fix 为 `type GetApp` 是不可以的，应该将此规则禁止掉。

向上文那样在底部对小程序的 TS 类型进行了补充，这样就使得 `getApp()` 返回的实例属性就支持了类型的推导，即可在页面上使用 `app.cgi` 时进行类型判断。

