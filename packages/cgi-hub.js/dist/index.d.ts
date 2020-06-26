export declare namespace CgiHub {
    type Static = typeof CgiHub;
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
        errorHandler?: <TResp>(response: any, requestOptions: RequestOptions, retry: <TResp>(resolve: any, reject: any) => PromiseLike<TResp | any>) => PromiseLike<TResp | any> | TResp;
    }
    interface RequestOptions {
        url: string;
        method: string;
        data?: object;
        [key: string]: any;
    }
    type Request = <TResp>(options: RequestOptions) => PromiseLike<TResp | any>;
    type CgiCaller = <TResp>(data?: any, options?: RequestOptions) => PromiseLike<TResp | any>;
    interface CgiList {
        [namespace: string]: CgiList | CgiCaller;
    }
}
/**
 * @class CgiHub
 */
export declare class CgiHub<TCGI extends CgiHub.CgiList> {
    /**
     * 注册 CgiHub 插件
     * @name CgiHub.plugin - [ static method ]
     * @param { string } type 插件的类型
     * @param { function } install 安装插件时会调用的方法
     * @return { function } 安装插件函数
     * */
    static plugin<T extends keyof CgiHub.RequestLifecycle>(type: T, install: CgiHub.RequestLifecycle[T]): (...args: any[]) => any;
    /**
     * 根据 CgiHub 请求生命周期创建网络请求方法
     * @name CgiHub.createRequest - [ static method ]
     * @param lifecycle 请求参数
     * @return 请求流程 Promise
     * */
    static createRequest(lifecycle: CgiHub.RequestLifecycle): CgiHub.Request;
    /**
     * 当前实例的 cgi 列表
     * @name CgiHub.prototype.cgi - [ instance property ]
     */
    cgi: TCGI;
    /**
     * 创建实例, 登记 cgi
     * @constructor new CgiHub - [ constructor ]
     * @param { object } cgis 需要登记的 cgi 列表
     */
    constructor(cgis: TCGI);
    /**
     * 登记 cgi
     * @name CgiHub.prototype.add - [ instance method ]
     * @param cgis 需要登记的 cgi 列表
     */
    add(cgis: TCGI): this;
}
export default CgiHub;
