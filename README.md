- 本 Demo 主要用来演示用 react-coat 来开发**SPA 单页应用** + **SSR 服务器渲染**。
- 请先了解一下：[react-coat v4.0](https://github.com/wooline/react-coat)。
- 循序渐进先学习一下：[用 react-coat 开发 SPA 单页应用](https://github.com/wooline/react-coat-spa-demo)
- [本 Demo 讨论提问专用贴](https://github.com/wooline/react-coat-ssr-demo/issues/1)
- reac-coat 学习交流 QQ 群：**929696953**，有问题可以在群里问我

---

<!-- TOC -->

- [单页 SSR](#单页-ssr)
- [基本思路](#基本思路)
- [主要难点](#主要难点)
- [两端同构](#两端同构)
- [浏览器渲染？服务器渲染？一键切换](#浏览器渲染服务器渲染一键切换)
- [安装](#安装)
- [运行](#运行)
- [查看在线 Demo](#查看在线-demo)
- [从 SPA-Demo 开始](#从-spa-demo-开始)
  - [脚手架变动](#脚手架变动)
  - [服务器规划](#服务器规划)
  - [增加 SSR 端入口文件](#增加-ssr-端入口文件)
  - [路由跳转](#路由跳转)
  - [单向数据流](#单向数据流)
  - [路由和加载子 module](#路由和加载子-module)
  - [模块的初始化](#模块的初始化)
- [上线及发布](#上线及发布)
- [总结一下 SSR 的 3 个要点](#总结一下-ssr-的-3-个要点)

<!-- /TOC -->

## 单页 SSR

本 Demo 用来演示如何利用 react-coat 来开发服务器和浏览器同构的`“单页 SSR ”`项目，什么是`单页 SSR`？

- 浏览器在载入第一个页面后，不再进行整个页面的刷新，而是通过 ajax 进行局部更新。
- 虽然浏览器载入第一个页面后不再整体刷新，但是在交互过程中，随时刷新页面，可以适时重现当前内容。
- 重现当前内容由服务器端生成，以提高加载速度和 利于 SEO。

> 所以`单页 SSR`既可以保持 SPA 单页应用的用户体验，同时又能让搜索引擎抓取静态 html，还能提高首屏加载速度

## 基本思路

- 浏览器利用 H5 History 来操作 URL
- 用 JS 拦截\<a\>链接的浏览器跳转，改为 JS 动作

## 主要难点

代码将同时运行在浏览器端和服务器端，两端的运行环境、和运行原理有所区别。我们要尽量的同化两端的 API，将差异剥离，提取共同代码。

## 两端同构

浏览器端和服务器端同构是个美好的梦想，一套代码两端都可以执行，目前网上也有很多号称“两端同构”的框架，但是真正能完全同构的基本上没有，为此我们可以将所谓的“同构”分为几个级别：

- 一套代码，两端运行。
- 一套源码，两套编译。
- 两套源码，两套编译。

本 Demo 属于以上第 2 种，同一套源码，被编译成浏览器运行 JS 和 nodeJS。

## 浏览器渲染？服务器渲染？一键切换

打开项目根下的./package.json，在"devServer"项中，将 ssr 设为 true 将启用服务器渲染，设为 false 仅使用浏览器渲染

```
"devServer": {
    "url": "http://localhost:7445",
    "ssr": true,
    "mock": true,  // 是否启用服务器渲染
    "proxy": {
      "/ajax/**": {
        "target": "http://localhost:7446/",
        "secure": false,
        "changeOrigin": true
      }
    }
  }
```

## 安装

```
git clone 本项目
npm install
```

## 运行

- `npm start` 以开发模式运行
- `npm run build` 以产品模式编译生成文件
- `npm run prod-express-demo` 以产品模式编译生成文件并启用一个 express 做 demo
- `npm run gen-icon` 自动生成 [iconfont](https://iconfont.cn) 文件及 ts 类型

## 查看在线 Demo

> [点击查看在线 Demo](http://react-coat.ssr.teying.vip/)

- 用浏览器打开网页，刷新一下浏览器，看是否能保持当前页面内容
- 查看网页源码，看服务器是否输出静态的 Html
- 在页面中的某\<a\>链接上，用鼠标右键选择在`新窗口中打开`

## 从 SPA-Demo 开始

本 Demo 基于 [用 react-coat 开发 SPA 单页应用](https://github.com/wooline/react-coat-spa-demo)，在其基础上加入服务器渲染的逻辑，下面来细说一下做了哪些改动：

### 脚手架变动

- 增加 server 端的 webpack config。ServerWebpackConfig 将代码编译成为服务器端运行的 nodeJS。

  - nodeJS 不需要异步加载，不需要分包处理。
  - nodeJS 可以不用转 es5，直接用 es6 更简洁。
  - nodeJS 不用处理 css 或 img 等静态资源

- 发布目录变成 client 和 server 两个。

  - 浏览器端的所有代码和资源编译到 ./build/client
  - 服务器端的所有代码和资源编译到 ./build/server

### 服务器规划

开发 SSR 项目，一般要包含四个服务器：

- SSR 服务器。浏览器请求的 URL 被发送到该服务器，该服务器运行 react 并返回渲染好的 Html
- Client 静态资源服务器。浏览器接收到 SSR 渲染好的 Html 后，请求该服务器上的静态资源，js、css、image 等。
- API Proxy 服务器。开发环境下，通常使用 API Proxy 来避免跨域问题。
- API Mock 服务器。开发环境下，通常使用假数据来 Mock API。

其中 Client 静态资源服务器和 API Proxy 服务器在 webpackDevServer 中已经自带了，为了开发方便，本 Demo 将 SSR 服务器和 API Mock 服务器用 express 中间件的方式加入 webpackDevServer。

另外，为了能在 SSR 服务器中也使用 webpack 的**热更新**（主要是在修改源码时，SSR 服务器也要重启），本 Demo 使用了服务器端动态加载资源。

### 增加 SSR 端入口文件

原来代码只运行在浏览器中，入口文件为./src/index.tsx，现在要增加服务器渲染，所以将入口文件改为：

```
./src
  ├── client.tsx // 浏览器端入口文件
  ├── server.tsx // 服务器端入口文件
```

### 路由跳转

- 在服务器端做 301、302 跳转不能由 react-route 来执行，改为直接 throw 异常。我们在外围服务器 catch 这种异常后来重定向。为此，本框架定义了 `RedirectError` 异常类。
- 短路设计。由于启用 SSR 服务器渲染，所以效率问题变得比较重要，一些 301、302、404 等 URL 的跳转我们没必要等到 react-route 运行时才执行，所以在入口文件./src/server.tsx 中将这类静态的跳转判断提前执行。为此，本框架定义了 advanceRouter()函数。

### 单向数据流

react 运行在浏览器中时，model 和 view 可以双向异步更新：

> model->view->model->view。

而运行在 server 端时，view 只会 render 一次：

> model->view。

比如，虽然 commponentWillAmount() 钩子会在 server 端运行，但如果想在此钩子中再 dispatch Action，从而改变 model 影响 render()是无效的。这是 react server 端和浏览器端很重要的差异，所以我们要保证在 view render 之前将所有 model 准备好，让 view 依赖于 model，而不是相互依赖。也就是说，假设没有 view 这一层，我们的 model 也应当是可以通过命令行独立推动和运行的。

### 路由和加载子 module

如上所说，model 不能依赖于 view，而我们在浏览器端习惯于用 react-router 4，它的理念却是路由组件化。也就是说，它将路由的逻辑与 view 合为一体了，路由逻辑被写到了 view 中，这将导致我们的服务器渲染出错。为此，本 demo 将这部分路由逻辑抽取出来，放到了 model 中，主要用来加载子模块的 model。加载一个子模块，我们需要加载其 model 和 view：

- 在浏览器端运行时，加载 view 会自动导入其 model，所以我们无需手动 load model。

- 在 SSR 时，由于是单向的数据流，我们不能等到加载 view 时再来自动导入 model，所以需要手动提前 load model。我们可以使用 react-coat 的 loadModel() 方法异步加载 model

```JS
// 详见./src/modules/app/model.ts

 await loadModel(moduleGetter).then(subModel => subModel(this.store));
```

### 模块的初始化

在 react-coat 中，所有的操作被包装成 action，用户和应用交互的过程就是不断 dispatch action 的过程，所以在模块的 model 中，我们可以看到很多的不同的 ActionHandler。而在 ssr 环境下，渲染是一次性的，不存在交互，所以我们约定：

> 在服务器渲染时，只执行到 module/INIT 这个 ActionHandler 为止。

也就是说，你得在 module/INIT 这个 EffectHandler 当中将所有 Model 数据构建好，包括获取 API 数据、加载子 Model 等 。然后，一次性的生成 Store，并交给 React render 成 Html。所以说：

- Model 是可以异步的，Render 是同步的

## 上线及发布

```
npm run build
```

编译后将在/build/下生成两端目录：client/和 server/

- client/ 故名思义，是我们的静态资源服务器中的代码，发布时，只需要将它上传到静态服务器中。
- server/ 是我们的服务器渲染需要的 JS，因为服务器渲染不需要异步按需加载，所以通常只有一个叫做 main.js 的文件。该文件包含所有的服务器渲染的逻辑，包括路由逻辑。将该文件上传至 nodeJS 服务器，以如下方式调：

```JS
const mainModule = require("./mainModule");
 mainModule.default(req.url).then(result => {
    const { ssrInitStoreKey, data, html } = result;
    // 替换模版中的 html 部分
    let html = htmlTpl.replace(/[^>]*<!--\s*{react-coat-html}\s*-->[^<]*/m, `${html}`);
    // 替换模版中的 redux data 部分
    html = html.replace(/<!--\s*{react-coat-script}\s*-->/, `<script>window.${ssrInitStoreKey} = ${JSON.stringify(data)};</script>`);
    res.send(html);
})
```

- 具体示例可见:

```
npm run prod-express-demo
```

## 总结一下 SSR 的 3 个要点

在服务器渲染时：

- 部分路由逻辑也属于 Model 中的一部分，需要在 Model 中实现
- 必须先构建好 Model(redux)，然后再一次性 Render(react)
- 构建 Model 的过程可以是异步的，Render React 的过程必须是同步的
