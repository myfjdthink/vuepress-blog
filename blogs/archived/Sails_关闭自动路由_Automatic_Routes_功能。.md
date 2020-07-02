---
title: Sails 关闭自动路由 Automatic Routes 功能。
date: 2016-03-22
tags:
 - posts
categories: 
 - Archived
---
# Sails 关闭自动路由 Automatic Routes 功能。



### Sails 关闭自动路由 Automatic Routes 功能。

Sails 中的路由两种：Custom Routes 和 Automatic Routes，自定义路由和自动路由。详见文档： 

[Sails Routes](http://sailsjs-documentation.readthedocs.org/en/latest/concepts/Routes/)

自定义路由就是我们在 routes.js 中为指定的 url 分配处理的 Action 如：

```
'post /purchase/pay':{    controller:'PurchaseController',    action: 'pay'}
```

自动路由则是，我们在 sails 中添加了 PurchaseController 并添加了 pay 方法后， 如：

```
module.exports = {    pay: function () {        doSomeThing()    }}
```

可以直接使用 /purchase/pay 访问，**Post 和 Get 方式均可**

现在有个问题就是，我们希望只有 Post 请求才被处理，但是 Sails 的路由机制是，先在自定义路由 routes.js 中匹配，没有结果则在**自动路由中匹配**。 

所以我们使用 get /purchase/pay 方式请求的话，虽然该请求被自定义路由的 Post 过滤掉，但是请求还是是会被自动路由处理的。这算是 Sails 的缺陷（这应该算是个 BUG 吧，哈哈。），还不够智能。

要实现我们的目的，我们需要**关闭自动路由功能**。 sails 提供了此项配置，在 PurchaseController 添加以下配置：

```
module.exports = purchase = {_config: {    actions: false, //关闭自动路由    shortcuts: false,    rest: false},buy: function () {    doSomeThing()}}
```

这样就行啦，关于该配置的详细信息见文档：[sails-config-blueprint](http://sailsjs.org/documentation/reference/configuration/sails-config-blueprint)

还可以顺便关闭 Rest 接口功能。

Stackoverflow 上有人问了类似的问题，也可以参考下： 

[http://stackoverflow.com/questions/26921889/disabling-default-sails-js-routes](http://stackoverflow.com/questions/26921889/disabling-default-sails-js-routes)


