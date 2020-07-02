---
title: Sails 修改 http response 的实现
date: 2016-03-23
tags:
 - posts
categories: 
 - Archived
---
# Sails 修改 http response 的实现



### Sails 修改 http response 的实现

#### 需求

需要在某些接口返回的 json 返回值内容，添加一些字段，比如之前接口返回值是：

```
{  "code": 0,  "data": {}}
```

现在要添加一个字段，这样子：

```
{  "code": 0,  "data": {}  “newValue” ：‘’}
```

简单的办法是直接修改接口返回值的地方，但是需要每个接口都要修改一下，不通用也麻烦。

sails 提供了 policy 机制， 其实也就是 express 的 middleware ，提供切片式的操作，可以在这里修改上下文，一般用来做 log 工作。因为 js 闭包的特性，在 policy 里，是可以访问 req（request） 里的属性的，但是无法访问 res（response）里的属性。

既然不能直接访问属性，那就换个思路，在 policy 里替换 res.json 方法，加上我们自定义的内容。 

这个 policy 的代码如下：

```
/** * 查询新券数量 * @param req * @param res * @param next */module.exports = function getNewTicketNums(req, res, next) {  var ud = req.param('ud');  var user_id = req.param('user_id');  user_id = user_id || ud;  if (!user_id) {    console.log('getNewTicketNums 没有 user_id');    return next()  }  // 保存之前的 json function  var end = res.json;  res.json = function () {    // 把当前 function 参数保存起来    var arg = arguments;    try {      console.log('modify response value', arg);      TreasureHuntService.getNewTicketNums(user_id, function (err, nums) {        // 修改了参数        arg[1].hasTicketNews = nums || 0;        // 继续执行之前定义的方法.        end.apply(res, arg);      });    } catch (err) {      end.apply(res, arg);    }  };  next();};
```

主要是依赖 apply 来实现函数替换。 

关于 apply 的作用可以看文档 [https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)

OK，写好这个 policy 之后，我们 sails 的 policies 文件里配置哪个结果需要这个修改功能就可以啦。

```
"getUserAsset": ["getNewTicketNums"],"demandAssets": ["getNewTicketNums", "requestAuthentication"]
```

参考： 

[http://blog.csdn.net/puncha/article/details/9137001](http://blog.csdn.net/puncha/article/details/9137001)

[https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)


