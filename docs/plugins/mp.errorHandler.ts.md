# mp.errorHandler.ts <Badge text="推荐" vertical="middle"/>

### 插件依赖
- 无

### 插件特性
- 支持错误处理装饰器，内置 `showModal`、`showToast` 默认错误提示
- 错误弹窗支持快速重试，重试期间 `Promise` 将一直处理 pending 状态，不影响数据处理

### 插件代码

```ts
// mp.errorHandler.ts
import CgiHub from 'cgi-hub.js';

const tryFunction = (fn, ...args) => (typeof fn === 'function' ? fn(...args) : fn);

const defaultConfig = {
  errorDecorator: 'showModal',
  modalRetryBtn: true,
  errorTitle: '服务异常',
  errorContent: '网络或服务异常，请稍后重试',
};

export default (options?: {
  errorDecorator?: 'showModal' | 'showToast' | boolean | ((response) => string),
  modalRetryBtn?: boolean,
  errorTitle?: string | ((response) => string),
  errorContent?: string | ((response) => string),
}) => {
  const globalConfig = {
    ...defaultConfig,
    ...options,
  };
  return CgiHub.plugin('errorHandler', (response, requestOptions, retry) => new Promise((resolve, reject) => {
    const {
      errorDecorator, // 是否使用内置错误装饰器
      modalRetryBtn, // 是否显示 Modal 重试按钮
    } = requestOptions;

    let decorator = tryFunction(errorDecorator, response);
    if (decorator === undefined) decorator = tryFunction(globalConfig.errorDecorator, response);
    if (decorator === undefined) decorator = defaultConfig.errorDecorator;

    if (decorator === 'showToast' || decorator === true) {
      // showToast, 弱提示 无重试
      wx.showToast({
        icon: 'none',
        title: tryFunction(globalConfig.errorContent, response) || defaultConfig.errorContent,
      });
      reject(response);
    } else if (decorator === 'showModal') {
      // showModal, 强提示
      if (!modalRetryBtn && !globalConfig.modalRetryBtn) {
        // 无重试
        wx.showModal({
          title: tryFunction(globalConfig.errorTitle, response) || defaultConfig.errorTitle,
          content: tryFunction(globalConfig.errorContent, response) || defaultConfig.errorContent,
          showCancel: false,
        });
        reject(response);
      } else {
        // 可重试
        wx.showModal({
          title: tryFunction(globalConfig.errorTitle, response) || defaultConfig.errorTitle,
          content: tryFunction(globalConfig.errorContent, response) || defaultConfig.errorContent,
          showCancel: true,
          confirmText: '重试',
          success({ confirm }) {
            // retry
            if (confirm) {
              retry(resolve, reject);
            } else reject(response);
          },
          fail: reject,
        });
      }
    } else {
      reject(response);
    }
  }));
};
```
