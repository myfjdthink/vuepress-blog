---
title: 使用 powershell 的 grep 过滤文本
date: 2014-09-18
tags:
 - posts
categories: 
 - Archived
---
# 使用 powershell 的 grep 过滤文本



## 使用 powershell 的 grep 过滤文本

有个log文件，大小在4M左右，要求找出里面耗时超过100s 的记录。首先想到了强大的 grep ，那么就搞起。 

先在网上找一下资料，[这篇文章](http://songxj.blog.51cto.com/620981/270962)，有几种方式：

> 第一种：
> 
> 
> Get-content somefile.txt|findstr “some_regexp”
> 
> 
> Get-content可以换成cat，Powershell已经给他们做了个别名，可真是体谅sheller。
> 
> 
> 这种方法算是commandline和Powershell混合，因为findstr是命令行工具，并不是Powershell的cmdlet。
> 
> 
> 第二种：
> 
> 
> cat somefile.txt | where { $_ -match “some_regexp”}
> 
> 
> 纯种Powershell实现了，利用了where过滤
> 
> 
> 第三种：
> 
> 
> Select-String “some_regexp” somefile.txt
> 
> 
> 直接用Select-string的实现。

最后选择的 powershell 命令如下:

```
1.cat .\log.log|where {$_ -match "\d{3,}\.\d{2,}s"} >>result.log
```

用了 **where** 这个， 这个能使用正则， **findstr** 命令不行。里面的正则匹配字符串 **“\d{3,}.\d{2,}s”** 也很简单了**，”3个数字.2个数字以上s “的**意思。

最后： 过滤出来的结果放入 result.log

> 17:05:14,884 ltcappserver.node1@ltcappserver http-0.0.0.0-8888-Processor7 DEBUG StrategyActionHelper: - getStrategyInvoiceMap finished … Consumed time:191.028s
> 
> 
> 17:05:14,889 ltcappserver.node1@ltcappserver http-0.0.0.0-8888-Processor4 DEBUG StrategyActionHelper: - getStrategyInvoiceMap finished … Consumed time:191.04s
> 
> 
> 17:07:19,112 ltcappserver.node1@ltcappserver http-0.0.0.0-8888-Processor7 DEBUG StrategyActionHelper: - setListStrategyAttributes finished … Consumed time:379.082s
> 
> 
> 17:07:20,106 ltcappserver.node1@ltcappserver http-0.0.0.0-8888-Processor4 DEBUG StrategyActionHelper: - setListStrategyAttributes finished … Consumed time:381.021s
> 
> 
> 17:07:37,449 ltcappserver.node1@ltcappserver http-0.0.0.0-8888-Processor4 DEBUG StrategySearchAction: - setListStrategyAttributes finished … Consumed time:398.364s
> 
> 
> 17:25:26,773 ltcappserver.node1@ltcappserver http-0.0.0.0-8888-Processor4 DEBUG cl: - build table data in getClientContractElement finished … Consumed time:1064.296s
> 
> 
> 17:25:27,328 ltcappserver.node1@ltcappserver http-0.0.0.0-8888-Processor4 DEBUG cl: - getClientContractElement finished … Consumed time:1064.858s
> 
> 
> 17:25:27,328 ltcappserver.node1@ltcappserver http-0.0.0.0-8888-Processor4 DEBUG cl: - buildGTReport finished … Consumed time:1064.87s Free memory: 176198


