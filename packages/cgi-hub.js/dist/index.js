var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CgiHub = void 0;
    /**
     * @class CgiHub
     */
    var CgiHub = /** @class */ (function () {
        /**
         * 创建实例, 登记 cgi
         * @constructor new CgiHub - [ constructor ]
         * @param { object } cgis 需要登记的 cgi 列表
         */
        function CgiHub(cgis) {
            /**
             * 当前实例的 cgi 列表
             * @name CgiHub.prototype.cgi - [ instance property ]
             */
            this.cgi = Object.create(null);
            this.add(cgis);
            return this;
        }
        /**
         * 注册 CgiHub 插件
         * @name CgiHub.plugin - [ static method ]
         * @param { string } type 插件的类型
         * @param { function } install 安装插件时会调用的方法
         * @return { function } 安装插件函数
         * */
        CgiHub.plugin = function (type, install) {
            return function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return install.apply(void 0, args);
            };
        };
        /**
         * 根据 CgiHub 请求生命周期创建网络请求方法
         * @name CgiHub.createRequest - [ static method ]
         * @param lifecycle 请求参数
         * @return 请求流程 Promise
         * */
        CgiHub.createRequest = function (lifecycle) {
            var _a = lifecycle.beforeFetch, beforeFetch = _a === void 0 ? function (opts) { return Promise.resolve(opts); } : _a, fetch = lifecycle.fetch, _b = lifecycle.afterFetch, afterFetch = _b === void 0 ? function (res, opts) { return Promise.resolve(res); } : _b, _c = lifecycle.errorHandler, errorHandler = _c === void 0 ? function (res, opts) { return Promise.reject(res); } : _c;
            // CgiHub 请求方法
            var request = function (requestOptions) { return (Promise.resolve(requestOptions)
                // 请求前
                .then(beforeFetch)
                // 请求参数修改 options 重新赋值, 并传递给 fetch
                .then(function (opts) { return (requestOptions = opts); })
                // 发起请求, 类型断言
                .then(fetch)
                // 请求后
                .then(function (response) { return afterFetch(response, requestOptions); }, 
            // 统一异常处理
            function (error) { return errorHandler(error, requestOptions, function (resolve, reject) { return request(requestOptions).then(resolve, reject); }); })); };
            // request 类型断言
            return request;
        };
        /**
         * 登记 cgi
         * @name CgiHub.prototype.add - [ instance method ]
         * @param cgis 需要登记的 cgi 列表
         */
        CgiHub.prototype.add = function (cgis) {
            var merge = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return Object.assign.apply(Object, __spreadArrays([{}], args));
            };
            // 登记至实例 cgi 列表
            this.cgi = merge(this.cgi, cgis);
            return this;
        };
        return CgiHub;
    }());
    exports.CgiHub = CgiHub;
    exports.default = CgiHub;
});
