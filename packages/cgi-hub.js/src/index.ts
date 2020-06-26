export declare namespace CgiHub {
  // 静态对象
  type Static = typeof CgiHub;

  // CgiHub 请求生命周期
  interface RequestLifecycle {
    /**
     * fetch 请求前公共处理方法
     * @lifecycle beforeFetch
     * @param requestOptions 请求参数
     * @return 修改后的请求参数 (支持 Promise)
     * */
    beforeFetch?: (requestOptions: RequestOptions) => PromiseLike<RequestOptions> | RequestOptions;
    /**
     * 发起 fetch 请求公共方法
     * @lifecycle fetch
     * @param requestOptions 请求参数
     * @return 请求响应结果 (支持 Promise)
     * */
    fetch: <TResp>(requestOptions: RequestOptions) => PromiseLike<TResp | any> | TResp;
    /**
     * fetch 请求后公共处理方法
     * @lifecycle afterFetch
     * @param response 响应结果
     * @param requestOptions 请求参数
     * @return 修改后的响应结果 (支持 Promise)
     * */
    afterFetch?: <TResp>(response: any, requestOptions: RequestOptions) => PromiseLike<TResp | any> | TResp;
    /**
     * 异常处理公共方法
     * @lifecycle errorHandler
     * @param response 响应结果
     * @param requestOptions 请求参数
     * @param { function } retry 重试本次请求
     * @return 修改后的响应结果 (支持 Promise)
     * */
    errorHandler?: <TResp>(response: any, requestOptions: RequestOptions,
      retry: <TResp>(resolve, reject) => PromiseLike<TResp | any>)
      => PromiseLike<TResp | any> | TResp;
  }

  // CgiHub 请求参数
  interface RequestOptions {
    url: string;
    method: string;
    data?: object;
    [key: string]: any;
  }
  // CgiHub 请求方法
  type Request = <TResp>(options: RequestOptions) => PromiseLike<TResp | any>;

  // cgi 调用方法
  type CgiCaller = <TResp>(data?, options?: RequestOptions) => PromiseLike<TResp | any>;
  // 所有 cgi 列表
  interface CgiList {
    [namespace: string]: CgiList | CgiCaller;
  }
}

/**
 * @class CgiHub
 */
export class CgiHub<TCGI extends CgiHub.CgiList> {
  /**
   * 注册 CgiHub 插件
   * @name CgiHub.plugin - [ static method ]
   * @param { string } type 插件的类型
   * @param { function } install 安装插件时会调用的方法
   * @return { function } 安装插件函数
   * */
  public static plugin<
    T extends keyof CgiHub.RequestLifecycle,
  >(type: T, install: CgiHub.RequestLifecycle[T]) {
    return (...args) => (install as any)(...args);
  }

  /**
   * 根据 CgiHub 请求生命周期创建网络请求方法
   * @name CgiHub.createRequest - [ static method ]
   * @param lifecycle 请求参数
   * @return 请求流程 Promise
   * */
  public static createRequest(lifecycle: CgiHub.RequestLifecycle): CgiHub.Request {
    const {
      beforeFetch = opts => Promise.resolve(opts),
      fetch,
      afterFetch = (res, opts) => Promise.resolve(res),
      errorHandler = (res, opts) => Promise.reject(res),
    } = lifecycle;

    // CgiHub 请求方法
    const request: CgiHub.Request = requestOptions => (
      Promise.resolve(requestOptions)
        // 请求前
        .then(beforeFetch)
        // 请求参数修改 options 重新赋值, 并传递给 fetch
        .then(opts => (requestOptions = opts))
        // 发起请求, 类型断言
        .then(fetch)
        // 请求后
        .then(
          response => afterFetch(response, requestOptions),
          // 统一异常处理
          error => errorHandler(
            error, requestOptions,
            (resolve, reject) => request(requestOptions).then(resolve, reject),
          ),
        )
    );

    // request 类型断言
    return request as CgiHub.Request;
  }


  /**
   * 当前实例的 cgi 列表
   * @name CgiHub.prototype.cgi - [ instance property ]
   */
  public cgi: TCGI = Object.create(null);

  /**
   * 创建实例, 登记 cgi
   * @constructor new CgiHub - [ constructor ]
   * @param { object } cgis 需要登记的 cgi 列表
   */
  public constructor(cgis: TCGI) {
    this.add(cgis);
    return this;
  }


  /**
   * 登记 cgi
   * @name CgiHub.prototype.add - [ instance method ]
   * @param cgis 需要登记的 cgi 列表
   */
  public add(cgis: TCGI) {
    const merge = (...args) => Object.assign({}, ...args);
    // 登记至实例 cgi 列表
    this.cgi = merge(this.cgi, cgis);

    return this;
  }
}

export default CgiHub;
