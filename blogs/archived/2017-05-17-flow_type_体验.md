---
title: flow type 体验
date: 2017-05-17
tags:
 - posts
 - Node
 - 编程相关
categories: 
 - Archived
---
# flow type 体验

flow type 是由 Facebook 出品的类型检查工具。

最近在一个新的后端项目上体验flow，也在内部做了分享，在这里再次总结下 flow 的优缺点。

优点：

* 类型检验，能提前发现一些问题
* 相对于 typescript ，flow 像 babel 一样提供了一个 runtime，可以直接运行flow 代码

还欠缺的地方：

* webstorm 对 flow 支持并不完善，不能做到像 typescript 那样做到代码补全，而且 webstorm 执行 flow 检查会卡顿
* 和 mongoose 无法有效配合，目前 flow 对第三方库的支持甚少
* 对 commonjs 支持太差，require 第三方包会报错，暂时未找到解决方案，估计是我没用对。
