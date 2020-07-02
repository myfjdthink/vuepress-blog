---
title: 使用注解简化 Mongoose 事务的使用
date: 2019-12-25
tags:
 - akajs
 - Node
 - posts
categories: 
 - Archived
---
# 使用注解简化 Mongoose 事务的使用

## mongoose 提供的事务

MongoDB 4.0 开始提供了事务支持，mongoose 也提供了相应的实现，不过目前的写法还是比较繁琐。

我们看一下 mongoose 给出的 demo

```
const Customer = db.model('Customer', new Schema({ name: String }));

let session = null;
return Customer.createCollection().
  then(() => db.startSession()).
  then(_session => {
    session = _session;
    // Start a transaction
    session.startTransaction();
    // This `create()` is part of the transaction because of the `session`
    // option.
    return Customer.create([{ name: 'Test' }], { session: session });
  }).
  // Transactions execute in isolation, so unless you pass a `session`
  // to `findOne()` you won't see the document until the transaction
  // is committed.
  then(() => Customer.findOne({ name: 'Test' })).
  then(doc => assert.ok(!doc)).
  // This `findOne()` will return the doc, because passing the `session`
  // means this `findOne()` will run as part of the transaction.
  then(() => Customer.findOne({ name: 'Test' }).session(session)).
  then(doc => assert.ok(doc)).
  // Once the transaction is committed, the write operation becomes
  // visible outside of the transaction.
  then(() => session.commitTransaction()).
  then(() => Customer.findOne({ name: 'Test' })).
  then(doc => assert.ok(doc));
```

这个 demo 暴露了两个问题：

1. 需要为每一个事务里做提交和回滚的处理
2. 事务是用 session 来区分的，你需要一直传递 session
## 使用注解

所以 akajs 提供了一个事务的注解来简化这个处理流程。

```
import * as mongoose from 'mongoose'
import {Schema} from 'mongoose'
import * as assert from 'assert'
import {Transactional, getSession} from './decorators/Transactional'

mongoose.connect('mongodb://localhost:27017,localhost:27018,localhost:27019/test?replicaSet=rs', {useNewUrlParser: true})
mongoose.set('debug', true)
let db = mongoose.connection
const Customer = db.model('Customer', new Schema({name: String}))

class ClassA {
  @Transactional()
  async main (key) {
    await new Customer({name: 'ClassA'}).save({session: getSession()})
    const doc1 = await Customer.findOne({name: 'ClassA'})
    assert.ok(!doc1)
    await new ClassB().step2()
    return key
  }
}

class ClassB {
  async step2 () {
    const doc2 = await Customer.findOne({name: 'ClassA'}).session(getSession())
    assert.ok(doc2)
    await Customer.remove({}).session(getSession())
  }
}

new ClassA().main('aaa').then((res) => {
  console.log('res', res)
  mongoose.disconnect(console.log)
}).catch(console.error)

```

解析：

* @Transactional() 注解会自动提交或回滚事务（发生异常时）。具体实现见[Transactional.ts](https://github.com/kaolalicai/akajs/blob/master/packages/mongoose/decorators/Transactional.ts) ，核心实现部分，使用 try catch 捕获异常，实现自动回滚。
```
try {
  const value = await originalMethod.apply(this, [...args])
  // Since the mutations ran without an error, commit the transaction.
  await session.commitTransaction()
  // Return any value returned by `mutations` to make this function as transparent as possible.
  return value
} catch (error) {
  // Abort the transaction as an error has occurred in the mutations above.
  await session.abortTransaction()
  // Rethrow the error to be caught by the caller.
  throw error
} finally {
  // End the previous session.
  session.endSession()
}
```

* 为了避免嵌套调用时，你需要一直传递 session 的尴尬~，akajs 提供全局的 getSession() 方法，其实现原理是依赖 [Async Hooks](https://nodejs.org/api/async_hooks.html) ，是 Node 的实验性特性，

你对此介意的话，请不要在生产环境使用。
**注意** mongodb 的事务必须在复制集上使用，在开发环境启动 mongodb 复制集，推荐使用 [run-rs](https://www.npmjs.com/package/run-rs)

## 更进一步

当然，在每一个需要 Session 的地方调用 getSession() 方法还是稍显累赘，我们可以通过 wrap mongoose 的各个方法，来实现自动注入 session。

例如把 mongoose 的 findOne 方法替换为

```
let originFindOne = mongoose.findOne
mongoose.findOne = () => {
originFindOne().session(getSession())
}
```

但是工作量有些多，暂时没时间做。


