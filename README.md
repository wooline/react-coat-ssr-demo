# 最新更新：有了更好的升级替代方案，请看

[**medux-react-ssr**](https://github.com/wooline/medux-react-ssr)

---

**第三站：SPA(单页应用) + SSR(服务器渲染)**

<!-- TOC -->

- [本 Demo 的意义](#本-demo-的意义)
- [单页同构 SSR](#单页同构-ssr)
- [本工程化亮点](#本工程化亮点)
  - [脚手架完备，开箱即用](#脚手架完备开箱即用)
  - [浏览器渲染？服务器渲染？一键切换](#浏览器渲染服务器渲染一键切换)
  - [充分利用 Typescript 强大的类型检查](#充分利用-typescript-强大的类型检查)
- [安装](#安装)
- [运行](#运行)
- [查看在线 Demo](#查看在线-demo)
- [开始动工](#开始动工)
  - [首先，你需要一款同构框架](#首先你需要一款同构框架)
  - [暂时忘掉你是在做 SSR](#暂时忘掉你是在做-ssr)
- [改装为 SSR](#改装为-ssr)
  - [一套代码、两个入口、两套输出](#一套代码两个入口两套输出)
  - [浏览器端部属运行](#浏览器端部属运行)
  - [服务端部属运行](#服务端部属运行)
  - [路由短路设计](#路由短路设计)
  - [单向数据流](#单向数据流)
  - [两个渲染阶段](#两个渲染阶段)
  - [模块初始化的差异](#模块初始化的差异)
  - [提取路由逻辑](#提取路由逻辑)
  - [提取路由不等于集中配置](#提取路由不等于集中配置)
  - [生成静态的 Link Url](#生成静态的-link-url)
  - [错误处理](#错误处理)
  - [使用 Transfer-Encoding: chunked](#使用-transfer-encoding-chunked)
  - [后记](#后记)

<!-- /TOC -->

## 本 Demo 的意义

网上已经有很多关于 React SSR 的文章和教程，但是它们...

- 要么只是教你原理与知识，没有真正的产品化工程。
- 要么只是介绍某些核心环节，缺少完整性。
- 要么只是纸上谈兵，连象样的 Demo 都没有。
- 要么就是一些过时的版本。

所以你缺的不是 SSR 教程，而是可以应用到生产环境的完整案例。

## 单页同构 SSR

对于 React 的 Server-Side Rendering 也许你会说：这不已经有 next.js，还有 prerender 么？可是亲，你真的用过它们做过稍复杂一点的项目么？而我们的目标要更进一步，不仅要 SSR，还要有 Single Page（单页）的用户体验，和 isomorphic（同构）的工程化方案，所以我们给自已提 8 个要求：

1. 浏览器与服务器复用同一套代码与路由。
2. 编译出来的代码要便于部署，不要太多依赖。
3. 浏览器载入的首屏由服务器渲染完成，以提高加载速度和利于 SEO。
4. 浏览器不再重复做服务器已完成的渲染工作（包括不再重复的请求数据）。
5. 首屏后不再整体刷新，而是通过 ajax 局部更新，带来单页的用户体验。
6. 在交互过程中，随时刷新页面，可以通过 URL 重现当前内容（包括打开弹窗等动作）。
7. 所有的路由跳转 link 回归到原始的\<a href="..."\>，方便让搜索引擎爬取。
8. JS 拦截所有\<a href="..."\>的浏览器跳转行为，改用单页方式打开。

对于以上的最后两点要求，可以用这种方法来验证：

> 在某个 link 上用鼠标左键点击，看是否是单页的用户体验，用右键点击选择在`新窗口中打开`，看是否可以用多页的方式跳转。

## 本工程化亮点

### 脚手架完备，开箱即用

也许你也尝试过搭建 SSR 工程脚手架，遇到过类似的问题：

- SSR 需要生成浏览器运行代码和服务器运行代码，所以需要两套 webpack 编译和部署。
- 开发时除了 webpackDevSever 你还得启动 ssrServer、mockServer
- webpackDevSever 可以使用**热更新**，但 ssrServer 能**热更新**么？

Ok，本工程脚手架已解决上述问题，你只需一行命令运行：

> npm start

### 浏览器渲染？服务器渲染？一键切换

打开项目根下的./package.json，在"devServer"项中，将 ssr 设为 true 将启用服务器渲染，设为 false 仅使用浏览器渲染

```
"devServer": {
    "url": "http://localhost:7445",
    "ssr": true, // 是否启用服务器渲染
    "mock": true,
    "proxy": {
      "/ajax/**": {
        "target": "http://localhost:7446/",
        "secure": false,
        "changeOrigin": true
      }
    }
  }
```

### 充分利用 Typescript 强大的类型检查

本 Demo 不仅利用 TS 类型来定义各种数据结构，更重要的是将 module、model、view、action、router 全面联系起来，相互约束、相互 check，将 Typescript 充分转换为生产力。

## 安装

```
git clone https://github.com/wooline/react-coat-ssr-demo.git
npm install
```

## 运行

- `npm start` 以开发模式运行
- `npm run build` 以产品模式编译生成文件
- `npm run prod-express-demo` 以产品模式编译生成文件并启用一个 express 做 demo
- `npm run gen-icon` 自动生成 [iconfont](https://iconfont.cn) 文件及 ts 类型

## 查看在线 Demo

> [点击查看在线 Demo](http://react-coat.ssr.teying.vip/)，并留意以下行为：

- 随便点击一个 link，打开一个新页面，刷新一下浏览器，看是否能保持当前页面内容。
- 在某个 link 上用鼠标左键点击，看是否是单页的用户体验，用右键点击选择在`新窗口中打开`，看是否可以用多页的方式跳转。
- 查看网页源码，看服务器是否输出静态的 Html。

---

## 开始动工

### 首先，你需要一款同构框架

开发 React 单页 SPA 应用时，也许你用过类似 DvaJS、Rematch 之类的上层框架，觉得相比原生 React+Redux 要爽太多，那能不能在服务器渲染上也同样使用它们呢？

- 不能，服务器渲染和浏览器渲染尽管都是运行 JS，但原理还是有很大差别的，以上框架也只能用在浏览器中。

那难道就没有能同时运行在浏览器和服务器的同构框架么？

- 有，**React-coat**：[点击先了解一下它](https://github.com/wooline/react-coat)

### 暂时忘掉你是在做 SSR

React-coat 支持服务器和浏览器同构，所以你可以暂时忘掉你是在做 SSR，先用做单页 SPA 应用的那一套逻辑来构建，包括怎么设计 Store、Model、规划路由、划分模块、按需加载等。

所以你可以先看前 2 个 Demo：

> [SPA 单页应用入手：Helloworld](https://github.com/wooline/react-coat-helloworld)

> [SPA 单页应用进阶：优化和重用](https://github.com/wooline/react-coat-spa-demo)

## 改装为 SSR

### 一套代码、两个入口、两套输出

浏览器和服务器代码 99% 是共用的，除了入口文件稍有不同。我们在`/src/`下分别为其建立不同的入口文件。

- client.tsx 原浏览器端入口文件，使用 buildApp()方法创建应用
- server.tsx 新增服务器端入口文件，使用 renderApp()方法创建应用

浏览器渲染可以使用 AMD、ES、异步 import 等模块化方案，而服务器渲染一般使用 commonJS，异步按需加载也没什么意义，而且没必要编译成 es5 了，所以我们使用两套 webpack 配置来把这两个入口分别 build 成 client 和 server 输出：

> npm run build

- /build/client 输出成浏览器运行的代码，JS 会按模块做代码分割，生成多个 bundle 以按需加载。
- /build/server 输出成服务器运行的代码，服务器端运行不需要代码分割，所以仅生成一个 main.js 文件，简单又方便。

### 浏览器端部属运行

我们生成了`/build/client`这个目录，里面是浏览器运行所需的 Html、Js、Css、Imgs 等，是纯静态的资源，所以你只需将整个目录上传到 nginx 发布目录中即可。

### 服务端部属运行

我们生成了`/build/server/main.js`这个服务器端运行文件，它包含了应用的服务器渲染逻辑，你只需要将它 copy 到你的 web server 框架中执行，比如 express 为例：

```JS
const mainModule = require("./server/main.js");// build生成的 main.js
const app = express();

app.use((req, res, next)=>{
  const errorHandler = (err) => {
      if (err.code === "301" || err.code === "302") {
          // 服务器路由跳转还得靠 express
          res.redirect(parseInt(err.code, 10), err.detail);
      } else {
          res.send(err.message || "服务器错误！");
      }
  };
  try {
      mainModule.default(req.url).then(result => {
          const { ssrInitStoreKey, data, html } = result;
          // html 渲染出的 html 字符串
          // data 脱水数据，也就是 redux store 的 state
          // ssrInitStoreKey 脱水数据的 key
          ...

      }).catch(errorHandler);
  }catch (err) {
      errorHandler(err);
  }
});
app.listen(3000);

```

简单吧？运行 main.js 就能拿到 ssrInitStoreKey, data, html 这三笔数据，而拿到它们之后，你想怎么玩都行，属于 express 的事了，可以看看 Demo。

### 路由短路设计

我们原本在单页中使用 React-router，因为奉行`路由皆组件`的理念，常常会这样写：

```JS
<Redirect exact path="/" to="/list" />
```

这样 React 渲染到此的时候，如果路径匹配会做路由跳转。但渲染到此时才跳转，那之前的运行消耗不是白费了？Server 端可是对执行效率有高要求的。所以，在 SSR 时，对于某些静态的 Redirect，我们最好提前判断执行，甚至在 node.js 之前就执行，比如直接配在 nginx 里。Demo 中为了减少对第三方的依赖，所以还是使用 node.js 自已处理，不过，这一切都放在初始化应用之前，我们可以理解为路由的短路设计。

```JS
const rootRouter = advanceRouter(path);
if (typeof rootRouter === "string") {
  throw new RedirectError("301", rootRouter);
} else {
  return renderApp(moduleGetter, ModuleNames.app, [path], {initData: {router: rootRouter}});
}
```

### 单向数据流

在服务器渲染时，React 不会 Rerender，数据流一定是单向的，从 Redux Store->React，不要企图 Store->React->Store->React，也就是在渲染 React 之前，我们得把所有数据都准备好，严格执行 UI(State) 纯函数，而不能依赖 React 生命周期勾子去取数据。

正好 React-coat 已经把数据逻辑全部都封装在 Model 里面。而且自始自终强调 Model 的独立性，不要依赖 View，甚至脱离 View，Model 也能运行。

所以...服务器渲染的流程比较纯粹：

1. 首先 Build model
2. 然后 Render view

### 两个渲染阶段

开启 SSR 渲染之后，应用渲染过程类似于一个宝宝的诞生，分两阶段：

- 十月怀胎，在娘肚子中先发育成人形。（服务器中先渲染一部分）
- 一朝分娩，出生后继续自已发育。（浏览器接着服务器基础上再进一步渲染）

具体在娘肚子发育到什么阶段才出生呢？这个因人而异，有的宝宝出生就有快 10 斤，有的宝宝出生不到 4 斤呢，＠○＠，所以你愿意在服务器端多做些事情，那浏览器就少做些事情罗。

我们知道，在 React-coat 框架的 model 中，每个模块的初始化都会派发 moduleName/INIT 这个 action，我们可以 handle 这个 action，去做一些请求数据和初始化的工作。

因此我们规定，在 SSR 时 Model 只执行完主模块 INITActionHandler 后就要出生。换个说法，主模块 INITActionHandler 就是娘胎，想要在服务器运行的逻辑，都得写在这个 actionHandler 中。

- 所以：改装成 SSR 的重要工作就是写好 Model 的 INITActionHandler:

```JS
@effect()
protected async [ModuleNames.app + "/INIT"]() {
  ...
}
```

### 模块初始化的差异

上面说道 SSR 时只执行主模块的 INITActionHandler，那其它模块的初始化怎么办？毕竟应用不可能就一个主模块吧？

我们在做 SPA 单页时，render 一个 View 时，框架会自动导入并初始化它的 Model，这样省时省力。但是在 SSR 时，我们上面强调过**单向数据流**，所有 model 都必须在 view render 之前准备好，所以不能依赖 view 来自动导入了。

- 所以在 SSR 时，如果一个 Model 的初始化需要另一个 Model 参与，需要手动 loadModel。例如：

```JS
@effect()
protected async [ModuleNames.app + "/INIT"]() {
  const { views } = this.rootState.router; //当前展示了哪些 Views
  //如果 photos 被展示，就要手动加载 photosModel 并初始化
  if (views.photos) {
    await loadModel(moduleGetter.photos).then(subModel => subModel(this.store));
  }
}

```

### 提取路由逻辑

从上面初始化差异看出，因为 SSR 需要**单向数据流**，所有 model 都必须在 view render 之前准备好。而某些 model 的初始化逻辑又依赖于路由的逻辑。而我们在单页 SPA 时往往把路由逻辑分散写在各个 Component 中，因为`路由皆组件`嘛，所以...

- SSR 时，我们得把一部分必需的路由逻辑从 view 回收 到 model 中。
- 其实本质上，路由逻辑也应当是 model 数据逻辑的一部分。

当然，如果你事先知道你是要做 SSR，一开始就可以直接放到 model 中。

### 提取路由不等于集中配置

我们刚说把一部分路由逻辑从 view 回收到 model 中执行，但并不等于集中配置路由。路由逻辑依然是分散在各个 model 中，依然是对外封装的，父模块只与子模块打交道，而不会参与子模块内部路由逻辑。这样非常有利于解耦和模块化。

现在绝大多数 SSR 方案是把路由集中配置，然后还把获取数据(ajax) 的逻辑与路由绑定在一起，导致可读性、可维护性、可重用性大大降低。相比之下，React-coat 的路由方案更胜一筹。

### 生成静态的 Link Url

在单页 SPA 应用中，我们点击一个 link 跳转路由，通常会这样写：

```JS
onItemClick = (id:string) => {
  const url = generateUrl(id);
  this.props.dispatch(routerActions.push(url))
}
render(){
  ...
  <a href="#" onClick={() => this.onItemClick(item.id)}>查看列表</a>
  ...
}
```

- 在点击 link 时，会先计算出 url，再切换路由。如果不点击的话 url 是不会计算的。
- 但在 SSR 时，为了能让搜索引擎爬取到链接，我们必须提前计算出 url 并放入 href 属性中。

```JS
onItemClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.preventDefault();
  const href = e.currentTarget.getAttribute("href") as string;
  this.props.dispatch(routerActions.push(href));
}
render(){
  ...
  <a href={generateUrl(id)} onClick={this.onItemClick}>查看列表</a>
  ...
}
```

### 错误处理

在浏览器运行环境中，React-coat 监听了 window.onerror，一旦有 uncatched 的 error，都会 dispatch 一个 ErrorAction，你可以在 model 中兼听此 action 并处理，例如：

```JS
@effect(null)
protected async ["@@framework/ERROR"](error: CustomError) {
  if (error.code === "401") {
    this.dispatch(this.actions.putShowLoginPop(true));
  } else if (error.code === "404") {
    this.dispatch(this.actions.putShowNotFoundPop(true));
  } else if (error.code === "301" || error.code === "302") {
    this.dispatch(this.routerActions.replace(error.detail));
  } else {
    Toast.fail(error.message);
    await settingsService.api.reportError(error);
  }
}
```

在服务器渲染中，这个 ErrorActionHandler 依然有效，但因为单向数据流，model 必须在 view 之前完成的，所以它只能 handle model 运行中的 error，而之后 render view 过程中的 error 此处是 handle 不到的，如果你需要 handle，请在应用之上层 try catch，比如在 express 中。

### 使用 Transfer-Encoding: chunked

使用 SSR，意味着首屏你看到的是需要先经过服务器运算后返回的，为了减少白屏等待时间你可以使用 Http 的 Transfer-Encoding: chunked，先让服务器返回一个静态的 Loading 页面，然后再开始服务器渲染。

但是这样一来，如果后服务器运算出需要 Redirect 重定向，而此时你的 Http 头已经输出了，不能再利用 301 跳转，所以你只能继续输出一段 JS 来让浏览器执行跳转，例如：

```JS
if (err.code === "301" || err.code === "302") {
    if (res.headersSent) {
        res.write(`
        <span>跳转中。。。</span></body>
        <script>window.location.href="${err.detail}"</script>
        </html>`);
        res.end();
    } else {
        res.redirect(parseInt(err.code, 10), err.detail);
    }
}
```

### 后记

以上罗列出个人觉得比较重要的点，其它还有很多实用的技巧可以直接看 Demo，里面有注释，如果有什么问题也可以直接留言或加 QQ 群 929696953
