---
title: Node.js 异步编程
date: 2017-12-18
tags:
 - posts
 - Node
 - 编程相关
categories: 
 - Archived
---
# Node.js 异步编程





### 异步的最终解决方案

在 2017 年，Node 7.6 终于支持了 Async/Await ，async 函数就是 Generator 函数的语法糖，是 JS 异步编程的最终解决方案。

可以认为：

`async 函数 == co + generator 函数`

比起 co，async 有以下优点

1. **更好的语义** async 和 await，比起星号和 yield，语义更清楚了。async 表示函数里有异步操作，await 表示紧跟在后面的表达式需要等待结果；
2. **更广的适用性**。 co 函数库约定，yield 命令后面只能是 Thunk 函数或 Promise 对象，而 async 函数的 await 命令后面，可以跟 Promise 对象和原始类型的值（数值、字符串和布尔值，但这时等同于同步操作）
在此之前，JS 的异步编程经历了 Callback、Promise、Generator、Async 的进化，接下来我们过一遍异步发展历程

### 回调函数 Callback

在 JS 中，异步编程通过 Callback 完成，将一个函数作为另一个异步函数的参数，用于处理异步结果，一个例子：

```
Something.save(function(err) {  
  if (err)  {
    //error handling
    return; // 没有返回值
  }
  console.log('success');
});
```

过度使用回调函数所会遇到的挑战：

* 如果不能合理的组织代码，非常容易造成回调地狱（callback hell），这会使得你的代码很难被别人所理解。
* 很容易遗漏错误处理代码。
* 无法使用return语句返回值，并且也不能使用throw关键字
也正是基于这些原因，在JavaScript世界中，一直都在寻找着能够让异步JavaScript开发变得更简单的可行的方案。

一个可行的解决方案之一是async模块。如果你和回调函数打过很久的交道， 你也许会深刻地感受到，在JavaScript中如果想要让某些事并行执行，或是串行执行，甚至是使用异步函数来映射（mapping） 数组中的元素使用异步函数有多复杂。所以，感谢 Caolan McMahon写了async模块来解决这些问题。

使用async模块，你可以轻松地以下面这种方式编写代码：

```
async.map([1, 2, 3], AsyncSquaringLibrary.square,  
  function(err, result){
  // result will be [1, 4, 9]
});
```

async模块虽然一定程度上带来了便利，但仍然不够简单，代码也不容易阅读，因此Promise出现了。

### Promise 函数

Promise 的写法：

```
Something.save()  
  .then(function() {
    console.log('success');
  })
  .catch(function() {
    //error handling
  })
```

then 和 catch 注册的回调函数分别处理下一步处理和异常处理，这样写的优点是可以链式操作：

```
saveSomething()  
  .then(updateOtherthing)
  .then(deleteStuff)  
  .then(logResults);
```

只是回调函数的另一种写法，把回调函数的横向加载，改成纵向加载，缺点是代码一堆的 then。

### Generator 函数

Generator 函数是协程在 ES6 的实现，最大特点就是可以交出函数的执行权，注意它不是语法糖。

```
第一步，协程A开始执行。

第二步，协程A执行到一半，进入暂停，执行权转移到协程B。

第三步，（一段时间后）协程B交还执行权。

第四步，协程A恢复执行。
```

```
function* gen(x){
  var y = yield x + 2;
  return y;
}
```

上面代码就是一个 Generator 函数。它不同于普通函数，是可以暂停执行的，所以函数名之前要加星号，以示区别。

整个 Generator 函数就是一个封装的异步任务，或者说是异步任务的容器。异步操作需要暂停的地方，都用 yield 语句注明。Generator 函数的执行方法如下。

```
var g = gen(1);
g.next() // { value: 3, done: false }
g.next() // { value: undefined, done: true }
```

Generator 函数可以暂停执行和恢复执行，这是它能封装异步任务的根本原因。除此之外，它还有两个特性，使它可以作为异步编程的完整解决方案：**函数体内外的数据交换**和**错误处理机制**。

1. 数据交换：`g.next(data);`

2. 错误处理：`g.throw('出错了');`
Generator 最大的问题是要手动调用 next() 才会执行下一步，因此自动执行器 co 出现了

### co 执行器

co 函数库的用法：

```
var co = require('co');
co(gen);
```

Generator 自动执行需要一种机制，**当异步操作有了结果，能够自动交回执行权**。 

两种方法可以做到这一点。

> （1）回调函数。将异步操作包装成 Thunk 函数，在回调函数里面交回执行权。
> 
> 
> （2）Promise 对象。将异步操作包装成 Promise对象，用 then 方法交回执行权。

co 函数的具体实现见文末参考文章，这里就不重复了

### 拓展阅读：其他语言的异步编程

C# 也有 async await 关键字，用于异步调用，内部实现基于线程 

[http://www.cnblogs.com/jesse2013/p/async-and-await.html](http://www.cnblogs.com/jesse2013/p/async-and-await.html)

Java Spring 框架有 @Async 注解，用于异步调用，内部实现基于线程 

[https://spring.io/guides/gs/async-method/](https://spring.io/guides/gs/async-method/)

### 参考文章

1. [细说JavaScript异步函数发展历程](http://www.csdn.net/article/2015-09-08/2825643-asynchronous-javascript)
2. [async 函数的含义和用法](http://www.ruanyifeng.com/blog/2015/05/async.html)
3. [Generator 函数的含义与用法](http://www.ruanyifeng.com/blog/2015/04/generator.html)
4. [co 函数库的含义和用法](http://www.ruanyifeng.com/blog/2015/05/co.html)


