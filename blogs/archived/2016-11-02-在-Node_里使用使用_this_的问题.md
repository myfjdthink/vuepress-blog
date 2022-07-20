---
title: 在 Node 里使用使用 this 的问题
date: 2016-11-02
tags:
 - 编程相关
 - posts
categories: 
 - Archived
---
# 在 Node 里使用使用 this 的问题



## this 指向不正确

Node 在 ES2016 里引入了 Class，终于不用使用 function 来模拟 class 了，最近在使用 Class 的时候碰到个关于 this 指向的小问题，记录下。 

来看一段代码，两个文件： 

test_a.js

```
const test_b = require('./test_b')const funcs = {  func_a: test_b.func_a}funcs.func_a()
```

test_b.js

```
'use strict';class B {  func_a() {    console.log("I'm func_a");    this.func_b()  }  func_b() {    console.log("I'm func_b");  }}module.exports = new B()
```

执行 test_a,js，会报错

> /usr/local/bin/node test_a.js I’m func_a
> 
> 
> /Users/nick/nodePro/fin_base/api/models/test_b.js:5
> 
> 
> this.func_b()
> 
> 
> ^
> 
> TypeError: this.func_b is not a function
> 
> 
> at Object.func_a (/Users/nick/nodePro/fin_base/api/models/test_b.js:5:10)
> 
> 
> at Object. (/Users/nick/nodePro/fin_base/api/models/test_a.js:6:7)
> 
> 
> at Module._compile (module.js:409:26)

## 原因分析

因为在把 func_a 赋值给 funcs 后，func_a 里的 this 指向的的是 test_a 文件里的 **funcs** 对象，而不是我们要预期的执行 test_b 文件里的 class B 实例。

所以我们把赋值的代码稍微改一下：

```
func_a: function () {  return test_b.func_a()}
```

这样就可以了，如果要要传递参数，可以写成这样：

```
func_a: function () {  return test_b.func_a.apply(test_b, arguments)}
```


