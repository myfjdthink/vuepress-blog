---
title: 使用 typescript 做后端应用开发
date: 2017-02-08
tags:
 - 编程相关
 - posts
categories: 
 - Archived
---
# 使用 typescript 做后端应用开发



最近开始了一个新的小项目，所以打算使用 typescript，感受一下有类型系统的 js。

## 技术选型

typescript+express+mongoose 

因为 typescript 已经提供了 async await 语法的支持，所以就不考虑使用 koa 了，因为 express 的中间件会更丰富一些。

数据库部分则使用 mongoose 来连接。

test.

## 好玩的点

1. ES6语法全支持
2. async + await 带了了同步代码的编写体验
3. decorator 装饰器
4. 编译期的错误提示
下面是一个 Controller 的代码 Demo。

```
/** * Created by nick on 16/5/20. */import e = require('express');import BaseController from './common/BaseController';import Logger from '../../Logger';import {router} from '../decorators/Web';import {User} from '../models/User';class UserController extends BaseController {  @router('post /user/create')  async create(req: e.Request, res: e.Response) {    const user = req.body    console.log('UserAccountController', 'create ', user);    const cUser = await User.create(user)    console.log('UserAccountController', 'create result', cUser);    res.send(cUser);  }  @router()  async findOne(req: e.Request, res) {    const ud = req.query.ud    Logger.info('ud ', ud)    let result = await User.findById(ud);    res.send(result);  }}export default UserController
```

## 项目代码

项目代码已经放在了 github 上。 

[https://github.com/myfjdthink/typescript-express-mongoose](https://github.com/myfjdthink/typescript-express-mongoose)


