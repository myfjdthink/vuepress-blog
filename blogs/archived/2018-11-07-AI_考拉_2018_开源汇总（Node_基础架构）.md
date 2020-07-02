---
title: AI 考拉 2018 开源汇总（Node 基础架构）
date: 2018-11-07
tags:
 - posts
 - Node
 - 编程相关
categories: 
 - Archived
---
# AI 考拉 2018 开源汇总（Node 基础架构）





## 前言

2018 年，考拉开始对现有项目的常用的工具库进行整理，包含日期处理，数字处理，logger 等常用工具，并打包成 npm module，方便各个项目使用。

## 代码风格

在开发工具库之前，我们统一了编码标准

### JavaScript 代码规范

前端 browser 通用 

统一使用 [eslint-config-klg](https://github.com/kaolalicai/eslint-config-klg) ，基于 [eslint-config-standard](https://github.com/standard/eslint-config-standard) 封装 

安装说明见文档

### Typescript 代码规范

统一使用 [tslint-config-klg](https://github.com/kaolalicai/tslint-config-klg) ，基于 [tslint-config-standard](https://github.com/standard/tslint-config-standard) 封装

安装说明见文档

## 脚手架

我们也提供了脚手架 [klg-init](https://github.com/kaolalicai/egg-init)，来方便大家启动一个新项目。 

安装好这个工具后，一键生成项目模板

```
$ klg-init dest
[klg-init] fetching npm info of klg-init-config
? Please select a boilerplate type (Use arrow keys)
  ──────────────
❯ module - npm 库项目模板 
  model - mongoose model 模板 todo 
  project - JavaScript 后端项目模板 todo 
  project-ts - Typescript 后端项目模板 todo 
  admin - 管理后台项目模板 todo 

```

目前支持的模板有：

* npm module，模板地址：[https://github.com/kaolalicai/klg-boilerplate-module](https://github.com/kaolalicai/klg-boilerplate-module)
* typescript + koa + mongoose 后端项目，模板地址：[https://github.com/kaolalicai/klg-koa-starter-kit](https://github.com/kaolalicai/klg-koa-starter-kit)
* 管理后台项目，模板地址：[https://github.com/kaolalicai/klg-admin-boilerplate](https://github.com/kaolalicai/klg-admin-boilerplate)
## 工具库列表

目前已经发布的工具库有：

* klg-logger ： logger 工具，基于 tracer
* klg-number ： 数字处理，主要解决 node 小数精度问题
* klg-request-log ：http 请求 log 记录，方便排查问题
* klg-mq ： rabbitmq 连接工具
* klg-mq-koa ： 将 mq 和 koa router 无缝结合
* klg-redlock ： 基于 redis 的分布式锁
* klg-date ： 日期处理，基于 moment
* klg-request ： 后端使用的 http 请求工具，基于 superagent
* klg-retry ： 重试工具
* klg-tracer ： 链路追踪工具，该项目实际不能使用，原因见项目内文档
上述项目都可以在我们公司的开源账号找到 [https://github.com/kaolalicai?utf8=%E2%9C%93&q=&type=&language=typescript](https://github.com/kaolalicai?utf8=%E2%9C%93&q=&type=&language=typescript)


