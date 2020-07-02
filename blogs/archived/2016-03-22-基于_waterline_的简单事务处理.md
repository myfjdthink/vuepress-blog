---
title: 基于 waterline 的简单事务处理
date: 2016-03-22
tags:
 - posts
categories: 
 - Archived
---
# 基于 waterline 的简单事务处理



# 基于 waterline 的简单事务处理

## 安装

`$ npm install waterline-transact`

## 配置

需要配合 [Sails.js](http://sailsjs.org/) 使用

在 sails 的`./api/model` 添加一个 Model 

Transaction.js

module.exports = {

```
  attributes: {    //事务名    name: {type: 'string'},    //保存事务处理的一些消息，例如事务处理失败原因。    msg: {type: 'string'},    //事务状态 start,pending,finish,canceling,rollback...    state: {type: 'string'},    start_time: {type: 'date'},    end_time: {type: 'date'},    //事务操作的文档    /**     * {     * coll   操作的表     * act    动作  insert or update     * docId  操作的对象的id     * data   操作对象的数据     * pre    update操作时，对象在update之前的状态     * time   时间戳     * }     */    changes: {type: 'array'}  }};
```

这个 Model 用于保存事务的操作记录。

在 bootsstrap.js 里将 sails 对象传入

```
var Transact = require('waterline-transact');Transact.init(sails);
```

## 使用

这个库在封装了 waterline 的 create 和 update 方法，需要事务操作时，使用本库提供的 txCreate 和 txUpdate 方法来替代。这样就会自动记录本次操作，方便回滚。

```
var Transact = require('waterline-transact');Transact.transactionManager("正常事务", function (transactionId, taskCallback) {  /**   * @User Model   * @transactionId 事务ID   * @user_data 本次create操作保存的数据   *    */  Transact.txCreate(User, transactionId, user_data, function (err, cUser) {    taskCallback(err, cUser);  });}, function (err, result) {  //do some thing})
```

## 测试

需要在 sails 的`./api/model` 添加一个 Model 

User.js

```
module.exports = {  attributes: {    phone : { type: 'string', unique: true},    created_from: { type: 'string'},  }};
```

将 test 目录下的 WaterLineTransct.test.js 放入 sails 的测试目录中，启动 sails 的测试即可。

## Dependencies

* [Async.js](https://github.com/caolan/async)

## License

[The MIT License](http://opensource.org/licenses/MIT)


