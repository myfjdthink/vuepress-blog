---
title: 基于 async-hook 实现的 koa 国际化解决方案
date: 2019-11-21
tags:
 - akajs
 - Node
 - posts
categories: 
 - Archived
---
# 基于 async-hook 实现的 koa 国际化解决方案

* [前言]()
* [koa 的 mvc 结构]()
* [eggjs 的结构反转方案]()
* [获取调用链]()
* [Java 的 Threadlocal]()
* [Node.js 的 async-hooks]()

* [国际化的最终实现方案]()

## 前言

在 koa 上实现国际化，有个现成的工具包 [koa-locales](https://github.com/koajs/locales)

简单配置一下就可以使用了

```
async function home(ctx) {
  ctx.body = {
    message: ctx.__('Hello, %s', 'fengmk2'),
  };
}
```

但是这里有个问题，想要获得国际化的内容，就必须访问 ctx 对象(request 里附带了用户所使用的的语言信息)，这里的访问就成了问题。

## koa 的 mvc 结构

一般来说，基于 koa 的应用会采用经典的 mvc 结构, 一个用户请求进来，其调用链是这样的。

> router
> 
> 
> -->controller
> 
> 
> ---->service
> 
> 
> ------>model

如果我们要在 service 层或者 model 层访问 koa 的 ctx 对象，就需要在调用过程把参数一层一层传递下去：

```
async function home(ctx) {
  ctx.body = service.hello(ctx)
}
```

```
function hello(ctx) {
  ctx.__(xxx)
}
```

这是一件非常恶心的事情。

那要怎么解决这个问题呢？

## eggjs 的结构反转方案

[eggjs](https://eggjs.github.io/zh/) 采用了结构翻转的设计，当用户请求进来时，初始化 controller 和 service 等对象，挂载在 ctx 上。

> ctx 对象几乎可以在编写应用时的任何一个地方获取到.
> 
> 
> 在 Controller、Service 等可以通过 this.app，或者所有 Context 对象上的 ctx.app：

```
// app/controller/home.js
class HomeController extends Controller {
  async index() {
    // 从 `Controller/Service` 基类继承的属性： `this.app`
    console.log(this.app.config.name);
    // 从 ctx 对象上获取
    console.log(this.ctx.app.config.name);
  }
}
```

eggjs 根本没有传递 ctx，而是所有东西都挂载在 ctx 上，所以 eggjs 这里的国际化就很好做了。

其实这个也是我不考虑使用 eggjs 的一个重要原因，**这种设计模式打破的 function 简单的特性**。普通的 function 参数即是输入，返回值即是输出，这种特性是非常好写 Unit Test 的。

而在 function 里访问 this.xxx 这个方式，就意味着能访问的对象取决于上下文而非函数的参数，这会给测试带来灾难，你需要联系上下文才能知道 this 里面究竟有什么。

当然 eggjs 里面只是往 this.ctx 挂载类似静态类的实现，并没有保存变量，一定程度上避免了混乱的问题，不过开了这个头，就容易走歪了。

## 获取调用链

其他语言是如何解决这个问题的呢？

### Java 的 Threadlocal

Java 的解决方案是 Threadlocal, 在 J2EE 中，用户的每个请求都会非配给一个线程，Java 提供了 Threadlocal 这样一个关于创建线程局部变量的类。通常情况下，我们创建的变量是可以被任何一个线程访问并修改的。而使用ThreadLocal创建的变量只能被当前线程访问，其他线程则无法访问和修改。

> 一个请求绑定一个线程，一个线程绑定一个变量。

有了这个特性，Java 的 Web 框架一般会在线程初始化之后，把 Session 写入 Threadlocal，然后在任意一处代码中都能访问到同一个 Session。

### Node.js 的 async-hooks

好消息是 Node 世界里也有类似 Java 的 Threadlocal 实现，就是 [Async Hooks](https://nodejs.org/api/async_hooks.html#async_hooks_async_hooks)。

**注意 async_hooks 目前还是实验性特性！而且已经实验了 2 年多还没转正！**

Async hook 对每一个函数（不论异步还是同步）提供了一个 Async scope，你可以通过 async_hooks.currentId() 获取当前函数的 Async ID。

```
const async_hooks = require('async_hooks');

console.log('default Async Id', async_hooks.currentId()); // 1

process.nextTick(() => {
  console.log('nextTick Async Id', async_hooks.currentId()); // 5
  test();
});

function test () {
  console.log('nextTick Async Id', async_hooks.currentId()); // 5
}
```

在同一个 Async scope 中，你会拿到相同的 Async ID。

基于这个特性，我们就能追踪一个用户请求触发的所有异步操作了。

## 国际化的最终实现方案

OK，既然技术上可行，那我们就可以给出具体实现了。

1. 使用 koa-locales 实现多语言配置文件的解析，和用户语言的识别。
2. 把 koa-locales 里进行文本翻译的方法抽成工具类
3. 编写一个过滤器，把用户语言与 async_hooks 的 Async ID 绑定
4. 在 service 层代码中调用工具类，工具类通过 Async ID 获取当前用户的语言，进行文本翻译。
app.ts 注册

```
const koa = new Koa()
// 国际化
initI18n(koa, {
  // dirs: ['$PWD/locales'],
  functionName: 'i18n',
  defaultLocale: 'zh-CN'
})
```

I18nUtil.ts 工具类

```
import * as locales from 'koa-locales'
import {logger} from '@akajs/utils'
import {createNamespace} from 'cls-hooked'

const session = createNamespace('i18n locale')

let defaultLocale = 'zh-CN'

// 把 koa-locales 的文本翻译方法抽出来
let gettext = function (locale: string, key: string, ...values) {
  // 等待被覆盖
  return key
}

// 新的文本翻译方法，给 Service 层调用
export function i18n (key?: string, ...values: Array<any>) {
  // get locale
  logger.debug('locale form namespace ', session.get('locale'))
  let locale = session.get('locale') || defaultLocale
  return gettext(locale, key, ...values)
}

export function initI18n (app, options) {
  locales(app, options)
  app.use(async (ctx, next) => new Promise(
    session.bind(async (resolve, reject) => {
      try {
        let locale = ctx.__getLocale()
        logger.debug('locale ', locale)
        session.set('locale', locale)
        await next()
        resolve()
      } catch (err) {
        reject(err)
      }
    })
  ))
  gettext = app[options.functionName || '__']
  defaultLocale = options.defaultLocale
}

```

UserService.ts 在 Service 中使用 i18n

```
async register (value: RegisterDto) {
    throw new BizError(i18n('Phone %s Used', phone))
}
```

最终，我们可以在任意代码中引入 I18nUtil.ts 工具类，就可以准确获取用户当前语言了, 实际上是为每个用户请求建立一个 Session：

> 用户发起请求 --> 中间件保存用户语言到 session --> Service --> I18nUtil get 用户语言 from session。

解析：最终的实现方案中，我们并没有直接使用 async_hooks 特性，而是用了 [cls-hooked](https://github.com/Jeff-Lewis/cls-hooked) 这个包提升了易用性和兼容性，[Pandora.js](https://github.com/midwayjs/pandora) 还使用这个包来做 Node 应用的调用链记录，有兴趣的可以了解下。


