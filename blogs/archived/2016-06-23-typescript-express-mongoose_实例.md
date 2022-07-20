---
title: typescript + express + mongoose 实例
date: 2016-06-23
tags:
 - posts
categories: 
 - Archived
---
# typescript + express + mongoose 实例



## typescript + express + mongoose 实例

最近在学习 typescript ，所以用 typescript 来写了个 MVC 实例。

### typescript + mongoose

Order.js

```
'use strict';import mongoose = require('mongoose');const Schema = mongoose.Schema;interface IOrder extends mongoose.Document {  amount: string;  oType: string;  pType: string;  status: string;  createdAt: Date;}const _schema = new Schema({  amount: {type: Number},  oType: {type: Number},  pType: {type: Number},  status: {type: Number},  bankcard: {type: String},  parent_id: {type: String},  createdAt: {type: Date, default: Date.now}}, {collection: 'order', id: true});_schema.path('amount').required(true, 'Order amount cannot be blank');_schema.path('status').required(true, 'Order status cannot be blank');_schema.pre('remove', function (next) {  next();});const _model = mongoose.model < IOrder >('Order', _schema);class Order {  /**   * static   * @param id   * @returns {Promise<Order>}   */  static findById(id:string):Promise < Order > {    console.log('findById2', ' 执行 ');    return new Promise<Order>((resolve, reject) => {      _model.findById(id, (err, order) => {        err ? reject(err) : resolve(new Order(order))      })    });  }  /**   * static   * @param id   * @returns {Promise<Order>}   */  static findById2(id:string):Promise < Order > {    return new Promise<Order>((resolve, reject) => {      _model.findById(id)        .exec()        .onResolve((err, order) => {          err ? reject(err) : resolve(new Order(order))        });    });  }  /**   *   */  private _document:IOrder;  /**   * 构造器   * @param document   */  constructor(document:IOrder) {    this._document = document;  }  get amount():string {    return this._document.amount;  }}export default Order
```

还是需要定义好 Order 表的 schema 以及 Order 的 Interface IOrder，这样通过 mongoose 查询到的实例都是实现了 IOrder 接口的。

### typescript 与 express

使用装饰器（注解） 

OrderController.js

```
import e = require('express');import Order from '../models/Order'import {router} from "../decorators/Web";const timeOut = function (time) {  return new Promise(function (resolve) {    setTimeout(function () {      resolve(`respond with asynv await ${time} ms`)    }, time)  });};class OrderController {  @router({    method: 'get',    path: '/order/awaitTest'  })  async awaitTest(req:e.Request, res) {    console.log('OrderController', 'awaitTest');    let result = await timeOut(10);    res.send(result);  }  @router({    method: 'get',    path: '/order/findOneWithClass'  })  async findOneWithClass(req:e.Request, res:e.Response) {    let result = await Order.findById2('54ce6d7779337f164b36504a')    res.status(200).json(result);    res.status(200).json(result);  }}export default OrderController
```

装饰器是 es7 的新特性，typescript 已经实现了该功能。具体请看源码实现或者文档。

[源码](https://github.com/myfjdthink/CodeNode/tree/master/TypeScriptSamples/express_demo)

### 参考资料

[TypeScript Handbook（中文版）](https://www.gitbook.com/book/zhongsp/typescript-handbook/details)

[TYPESCRIPT + EXPRESS + NODE.JS](http://brianflove.com/2016/03/29/typescript-express-node-js/)

[在 Web 应用中使用 ES7 装饰器（Decorator）初体验](https://segmentfault.com/a/1190000004357419)

[ts-express-decorators](https://github.com/Romakita/ts-express-decorators)

[Creating Mongoose models with TypeScript](https://github.com/Appsilon/styleguide/wiki/mongoose-typescript-models)

[mongoose + typescript](https://gist.github.com/masahirompp/3c012c8721b70821fa45)

@%28%u6211%u5199%u7684%u4E1C%u897F%29%5Bposts%5D%0A%23%23%20typescript%20+%20express%20+%20mongoose%20%u5B9E%u4F8B%0A%0A%u6700%u8FD1%u5728%u5B66%u4E60%20typescript%20%uFF0C%u6240%u4EE5%u7528%20typescript%20%u6765%u5199%u4E86%u4E2A%20MVC%20%u5B9E%u4F8B%u3002%0A%23%23%23typescript%20+%20mongoose%0AOrder.js%0A%0A%60%60%60%0A%27use%20strict%27%3B%0Aimport%20mongoose%20%3D%20require%28%27mongoose%27%29%3B%0Aconst%20Schema%20%3D%20mongoose.Schema%3B%0A%0Ainterface%20IOrder%20extends%20mongoose.Document%20%7B%0A%20%20amount%3A%20string%3B%0A%20%20oType%3A%20string%3B%0A%20%20pType%3A%20string%3B%0A%20%20status%3A%20string%3B%0A%20%20createdAt%3A%20Date%3B%0A%7D%0A%0Aconst%20_schema%20%3D%20new%20Schema%28%7B%0A%20%20amount%3A%20%7Btype%3A%20Number%7D%2C%0A%20%20oType%3A%20%7Btype%3A%20Number%7D%2C%0A%20%20pType%3A%20%7Btype%3A%20Number%7D%2C%0A%20%20status%3A%20%7Btype%3A%20Number%7D%2C%0A%20%20bankcard%3A%20%7Btype%3A%20String%7D%2C%0A%20%20parent_id%3A%20%7Btype%3A%20String%7D%2C%0A%20%20createdAt%3A%20%7Btype%3A%20Date%2C%20default%3A%20Date.now%7D%0A%7D%2C%20%7Bcollection%3A%20%27order%27%2C%20id%3A%20true%7D%29%3B%0A%0A_schema.path%28%27amount%27%29.required%28true%2C%20%27Order%20amount%20cannot%20be%20blank%27%29%3B%0A_schema.path%28%27status%27%29.required%28true%2C%20%27Order%20status%20cannot%20be%20blank%27%29%3B%0A%0A_schema.pre%28%27remove%27%2C%20function%20%28next%29%20%7B%0A%20%20next%28%29%3B%0A%7D%29%3B%0A%0Aconst%20_model%20%3D%20mongoose.model%20%3C%20IOrder%20%3E%28%27Order%27%2C%20_schema%29%3B%0A%0Aclass%20Order%20%7B%0A%20%20/**%0A%20%20%20*%20static%0A%20%20%20*%20@param%20id%0A%20%20%20*%20@returns%20%7BPromise%3COrder%3E%7D%0A%20%20%20*/%0A%20%20static%20findById%28id%3Astring%29%3APromise%20%3C%20Order%20%3E%20%7B%0A%20%20%20%20console.log%28%27findById2%27%2C%20%27%20%u6267%u884C%20%27%29%3B%0A%20%20%20%20return%20new%20Promise%3COrder%3E%28%28resolve%2C%20reject%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20_model.findById%28id%2C%20%28err%2C%20order%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20err%20%3F%20reject%28err%29%20%3A%20resolve%28new%20Order%28order%29%29%0A%20%20%20%20%20%20%7D%29%0A%20%20%20%20%7D%29%3B%0A%20%20%7D%0A%20%20/**%0A%20%20%20*%20static%0A%20%20%20*%20@param%20id%0A%20%20%20*%20@returns%20%7BPromise%3COrder%3E%7D%0A%20%20%20*/%0A%20%20static%20findById2%28id%3Astring%29%3APromise%20%3C%20Order%20%3E%20%7B%0A%20%20%20%20return%20new%20Promise%3COrder%3E%28%28resolve%2C%20reject%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20_model.findById%28id%29%0A%20%20%20%20%20%20%20%20.exec%28%29%0A%20%20%20%20%20%20%20%20.onResolve%28%28err%2C%20order%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20err%20%3F%20reject%28err%29%20%3A%20resolve%28new%20Order%28order%29%29%0A%20%20%20%20%20%20%20%20%7D%29%3B%0A%20%20%20%20%7D%29%3B%0A%20%20%7D%0A%20%20/**%0A%20%20%20*%0A%20%20%20*/%0A%20%20private%20_document%3AIOrder%3B%0A%20%20/**%0A%20%20%20*%20%u6784%u9020%u5668%0A%20%20%20*%20@param%20document%0A%20%20%20*/%0A%20%20constructor%28document%3AIOrder%29%20%7B%0A%20%20%20%20this._document%20%3D%20document%3B%0A%20%20%7D%0A%20%20get%20amount%28%29%3Astring%20%7B%0A%20%20%20%20return%20this._document.amount%3B%0A%20%20%7D%0A%7D%0A%0Aexport%20default%20Order%0A%60%60%60%0A%u8FD8%u662F%u9700%u8981%u5B9A%u4E49%u597D%20Order%20%u8868%u7684%20schema%20%u4EE5%u53CA%20Order%20%u7684%20Interface%20IOrder%uFF0C%u8FD9%u6837%u901A%u8FC7%20mongoose%20%u67E5%u8BE2%u5230%u7684%u5B9E%u4F8B%u90FD%u662F%u5B9E%u73B0%u4E86%20IOrder%20%u63A5%u53E3%u7684%u3002%0A%0A%23%23%23%20typescript%20%u4E0E%20express%0A%u4F7F%u7528%u88C5%u9970%u5668%uFF08%u6CE8%u89E3%uFF09%0AOrderController.js%0A%0A%60%60%60%0Aimport%20e%20%3D%20require%28%27express%27%29%3B%0Aimport%20Order%20from%20%27../models/Order%27%0Aimport%20%7Brouter%7D%20from%20%22../decorators/Web%22%3B%0A%0A%0Aconst%20timeOut%20%3D%20function%20%28time%29%20%7B%0A%20%20return%20new%20Promise%28function%20%28resolve%29%20%7B%0A%20%20%20%20setTimeout%28function%20%28%29%20%7B%0A%20%20%20%20%20%20resolve%28%60respond%20with%20asynv%20await%20%24%7Btime%7D%20ms%60%29%0A%20%20%20%20%7D%2C%20time%29%0A%20%20%7D%29%3B%0A%7D%3B%0A%0Aclass%20OrderController%20%7B%0A%20%20@router%28%7B%0A%20%20%20%20method%3A%20%27get%27%2C%0A%20%20%20%20path%3A%20%27/order/awaitTest%27%0A%20%20%7D%29%0A%20%20async%20awaitTest%28req%3Ae.Request%2C%20res%29%20%7B%0A%20%20%20%20console.log%28%27OrderController%27%2C%20%27awaitTest%27%29%3B%0A%20%20%20%20let%20result%20%3D%20await%20timeOut%2810%29%3B%0A%20%20%20%20res.send%28result%29%3B%0A%20%20%7D%0A%0A%20%20@router%28%7B%0A%20%20%20%20method%3A%20%27get%27%2C%0A%20%20%20%20path%3A%20%27/order/findOneWithClass%27%0A%20%20%7D%29%0A%20%20async%20findOneWithClass%28req%3Ae.Request%2C%20res%3Ae.Response%29%20%7B%0A%20%20%20%20let%20result%20%3D%20await%20Order.findById2%28%2754ce6d7779337f164b36504a%27%29%0A%20%20%20%20res.status%28200%29.json%28result%29%3B%0A%20%20%20%20res.status%28200%29.json%28result%29%3B%0A%20%20%7D%0A%0A%7D%0A%0Aexport%20default%20OrderController%0A%60%60%60%0A%0A%u88C5%u9970%u5668%u662F%20es7%20%20%u7684%u65B0%u7279%u6027%uFF0Ctypescript%20%u5DF2%u7ECF%u5B9E%u73B0%u4E86%u8BE5%u529F%u80FD%u3002%u5177%u4F53%u8BF7%u770B%u6E90%u7801%u5B9E%u73B0%u6216%u8005%u6587%u6863%u3002%0A%0A%5B%u6E90%u7801%5D%28https%3A//github.com/myfjdthink/CodeNode/tree/master/TypeScriptSamples/express_demo%29%0A%0A%23%23%23%20%u53C2%u8003%u8D44%u6599%0A%5BTypeScript%20Handbook%uFF08%u4E2D%u6587%u7248%uFF09%5D%28https%3A//www.gitbook.com/book/zhongsp/typescript-handbook/details%29%0A%5BTYPESCRIPT%20+%20EXPRESS%20+%20NODE.JS%5D%28http%3A//brianflove.com/2016/03/29/typescript-express-node-js/%29%0A%5B%u5728%20Web%20%u5E94%u7528%u4E2D%u4F7F%u7528%20ES7%20%u88C5%u9970%u5668%uFF08Decorator%uFF09%u521D%u4F53%u9A8C%5D%28https%3A//segmentfault.com/a/1190000004357419%29%0A%5Bts-express-decorators%5D%28https%3A//github.com/Romakita/ts-express-decorators%29%0A%5BCreating%20Mongoose%20models%20with%20TypeScript%5D%28https%3A//github.com/Appsilon/styleguide/wiki/mongoose-typescript-models%29%0A%5Bmongoose%20+%20typescript%5D%28https%3A//gist.github.com/masahirompp/3c012c8721b70821fa45%29%0A%0A
