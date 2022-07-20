---
title: NodeJS 中基于 Redis 的分布式锁解决方案。
date: 2016-11-29
tags:
 - Git
 - Node
categories: 
 - Code
---

# NodeJS 中基于 Redis 的分布式锁解决方案。



# NodeJS 中基于 Redis 的分布式锁解决方案。

## 前言0

在分布式系统中，会经常碰到两个问题：

* 互斥性问题。
* 幂等性问题。
## 分布式锁

互斥性问题的解决方案是 – 分布式锁； 

幂等性问题，分布式环境中，有些接口是天然保证幂等性的，如查询操作。其他情况下，所有涉及对数据的修改、状态的变更就都有必要防止重复性操作的发生。通过间接的实现接口的幂等性来防止重复操作所带来的影响，成为了一种有效的解决方案。这个间接方案也可以使用分布式锁来实现。

### 分布式锁条件

基本的条件：

* 需要有存储锁的空间，并且锁的空间是可以访问到的。
* 锁需要被唯一标识。
* 锁要有至少两种状态。
使用 Redis 完全可以满足上述条件。

## 解决方案

### 简单的解决方案

通常在 Node 中一个简单的基于 Redis 的解决方案是这样的： 

发送 SETNX lock.orderid 尝试获得锁。 

如果锁不存在，则 set 并获得锁。 

如果锁存在，则跳过此次操作或者等待一下再重试。

SETNX 是一个原子操作，可以保证只有一个节点会拿到锁。

### Redis 推荐的方案

上述的方案中，还是有点问题，在 Redis 出现单点故障，例如 master 节点宕机了，而 Redis 的复制是异步的，可能出现以下情况：

1. 客户端 A 在 master 节点拿到了锁。
2. master 节点在把 A 创建的 key 写入 slave 之前宕机了。
3. slave 变成了 master 节点 4.B 也得到了和 A 还持有的相同的锁（因为原来的 slave 里还没有 A 持有锁的信息）
所以为了避免上述问题，Redis 官方给出了更加可靠的实现 [Distributed locks with Redis](https://redis.io/topics/distlock)， 

中译文版本 [用 Redis 构建分布式锁](http://ifeve.com/redis-lock/)，这个方案提出了一个Redlock 算法，文章里有详细解析，这里就不赘述了。

### Redlock 的实现

Redlock 有针对不同语言的实现，NodeJS 的实现是[node-redlock](https://github.com/mike-marcacci/node-redlock)

 官网给出的一个例子：

```
// the string identifier for the resource you want to lockvar resource = 'locks:account:322456';// the maximum amount of time you want the resource locked,// keeping in mind that you can extend the lock up until// the point when it expiresvar ttl = 1000;redlock.lock(resource, ttl, function(err, lock) {    // we failed to lock the resource    if(err) {        // ...    }    // we have the lock    else {        // ...do something here...        // unlock your resource when you are done        lock.unlock(function(err) {            // we weren't able to reach redis; your lock will eventually            // expire, but you probably want to log this error            console.error(err);        });    }});
```

使用起来还是比较简单的，在操作开始之前 lock 并设置 ttl，操作完成后 unlock 即可。

### 包装一下 redlock

如果要给某些个接口或者 function 添加一个 lock 的话，直接修改接口是件很麻烦的事情，所以我们可以把 redlock 稍微封装一下。

```
/** * 锁操作 * @param user_id * @param operate * @param process * @param callback * @param options */lockProcess: function (user_id, operate, process, callback, options) {  var lock = null  Thenjs(function (cont) {    var ttl = options ? options.ttl : null;    self.lock(user_id, operate, ttl, function (err, clock) {      // 加锁失败直接退出      if (err) return callback(err);      lock = clock      cont()    });  }).then(function (cont) {    // 实际的业务逻辑    process(cont);  }).then(function (cont, result) {    self.unlock(lock, function (err) {      cont(err, result)    });  }).then(function (cont, result) {    callback(null, result)  }).fail(function (cont, err) {    // 操作失败记得解锁    self.unlock(lock, function (unlockErr) {      callback(err || unlockErr)    });  });}
```

这样我们可以直接把之前的代码包装一下就能用，就不需要侵入之前的业务逻辑了。

```
LockService.lockProcess(order.user_id, 'dsPurchase', function (innerCb) {  self.dsPurchase(order, innerCb); // 业务逻辑}, function (err, result) {  callback(err, result);});
```

假设你要针对一个接口加锁的话，还可以新建一个过滤器，然后给接口配置了过滤器就自动加上锁啦。如果是使用 express 的话，可以参考[如何修改sails 的 response](http://myfjdthink.applinzi.com/?p=873)来设计过滤器，在 response 的时候解锁即可。

## 参考

[node-redlock](https://github.com/mike-marcacci/node-redlock)

[Distributed locks with Redis](https://redis.io/topics/distlock)， 

[用 Redis 构建分布式锁](http://ifeve.com/redis-lock/)

[分布式系统互斥性与幂等性问题的分析与解决](https://zhuanlan.zhihu.com/p/22820761)


