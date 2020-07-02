---
title: Webstorm中使用正则替换文本
date: 2016-01-31
tags:
 - 替换文本
 - 正则
 - posts
 - 向后引用
categories: 
 - Archived
---
# Webstorm中使用正则替换文本



### Webstorm中使用正则替换文本

#### 需求

有这样一段代码：

```
var num = req.body.num;var bankcard = req.body.bankcard2;var pay_type = req.body.pay_type;
```

需要快速替换成如下格式：

```
var num = req.param.('num');var bankcard = req.param.('bankcard2');var pay_type = req.param.('pay_type');
```

#### 分析

显然普通的替换方法做不到这样的效果，看来需要用到正则了，如果只是查找文本，这个正则很好写：

```
req.body.\w+
```

但是替换的时候用正则怎么做呢？ 

因为使用 WebStorm 开发，所以去 WebStorm Help 文档里瞄一下，哈哈，万能的 WebStorm 果然支持正则替换。见文档：[https://www.jetbrains.com/webstorm/help/find-and-replace-in-path.html](https://www.jetbrains.com/webstorm/help/find-and-replace-in-path.html)

这里讲到了一个 **back references** 向后引用的概念，在替换文本中使用 $n 来表示 back references ，就可以实现动态替换。那 back references 究竟是什么呢，还是看示例吧。

#### 示例

就上文中的需求，我们先写出查询的正则：

```
req.body.(\w+)
```

这里用到 \w+ 通配符来适配 req.body. 之后的不同内容，注意这里用括号()包起了 \w+ ，括号的作用是定义一个 back references。 

那么替换的正则是：

```
req.param.('$1')
```

就这样，我们使用 $1 来动态替换 (\w+) 这个back references 匹配到的内容。

#### 总结

1. 正则替换不是所以编辑器都支持的，而且每个编辑器的支持方法都不一致，这里描述的方法只适用于 WebStorm ，理论上适用于 jetbrains 出品的其他编辑器如 IDEA PhpStorm PyCharm 等。

2. 查询的时候顺便找到了 Notepad++ 的正则替换实现，有兴趣的瞄一下：[http://www.crifan.com/files/doc/docbook/rec_soft_npp/release/htmls/npp_func_regex_replace.html](http://www.crifan.com/files/doc/docbook/rec_soft_npp/release/htmls/npp_func_regex_replace.html)


