module.exports = {
  title: 'cgi-hub.js',
  description: 'Client 端 CGI 接口请求统一规范管理 JS 库',
  base: '/cgi-hub.js/',
  themeConfig: {
    nav: [
      { text: '文档', link: '/guide/' },
      {
        text: 'Github',
        link: 'https://github.com/mcc108/cgi-hub.js',
        target:'_blank'
      },
    ],
    smoothScroll: true,
    sidebar: [
      {
        title: '指南',
        sidebarDepth: 2,
        collapsable: false,
        children: [
          '/guide/',
          '/guide/use',
          '/guide/lifecycle',
          '/guide/ts',
        ]
      },
      {
        title: '插件',
        sidebarDepth: 0,
        children: [
          '/plugins/',
          {
            title: 'Web 插件',
            collapsable: false,
            children: [
              // '/plugins/web-xhr.fetch.ts',
              // '/plugins/web-fetch.fetch.ts',
              // '/plugins/axios.fetch.ts',
              // '/plugins/element-ui.errorHandler.ts',
            ]
          },
          {
            title: '小程序插件',
            collapsable: false,
            children: [
              // '/plugins/mp-native.fetch.ts',
              '/plugins/we-request.fetch.ts',
              '/plugins/mp.errorHandler.ts',
            ]
          },
          {
            title: 'Node.js 插件',
            collapsable: false,
            children: [
              // '/plugins/node-native.fetch.ts',
            ]
          }
        ]
      },
    ],
  }
};
