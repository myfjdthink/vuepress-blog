---
title: 使用 Winston 处理 Node 应用 Log
date: 2016-11-16
tags:
 - posts
 - Node
 - 编程相关
categories: 
 - Archived
---
# 使用 Winston 处理 Node 应用 Log



# 使用 Winston 处理 Node 应用 Log

## 问题

随着 Node 应用节点增多，应用部署在多台机器上，查询 Node 的 log 变得非常麻烦。业内通常的解决方案是使用 ELK 套件来收集并处理 log，可以方便地查询。关于 ELK，可以看看这篇文章：[https://www.ibm.com/developerworks/cn/opensource/os-cn-elk/](https://www.ibm.com/developerworks/cn/opensource/os-cn-elk/)，本文不作介绍~。 

在推动使用 ELK 的过程中碰到一些问题：

1. 之前的代码中很多地方直接是使用 console.log 输出 log 的。这些 log 之前是依赖于 pm2 处理并写入到文件中。
2. 如果 log 一个 object 对象的话，默认的输出效果是多行的，ELK 在收集会比较麻烦。
> amount: 23, products: [ { product_id: ‘55c31e936f227ed922c508aa’,
> 
> 
> num: 23,
> 
> 
> rebuyType: 1,
> 
> 
> price: 1 } ],

## 初步的解决方案

问题1：全局搜索并替换 console.log 的内容，使用新的 log 工具是可以的。 

问题2：ELK 中的 Logstash 提供了一个多行文件的过滤器，[https://www.elastic.co/guide/en/logstash/5.0/plugins-filters-multiline.html](https://www.elastic.co/guide/en/logstash/5.0/plugins-filters-multiline.html) ，这个过滤器可以把多行 log 合并为一条记录，但是它要求使用正则来判断哪些多行 log 是属于一行的内容，这是个难点。

## 最终解决方案

上述的方案实施起来都不怎么好看，可以考虑使用 [Winston](https://github.com/winstonjs/winston#using-the-default-logger) 这个Node 的 log 库。

### 引入 Winston

WinstonLog.js

```
var winston = require('winston');var customLogger = new winston.Logger();// A console transport logging debug and above.customLogger.add(winston.transports.Console, {  timestamp: function() {    return Date.now();  },  level: 'verbose',  colorize: true});// A file based transport logging only errors formatted as json.customLogger.add(winston.transports.File, {  level: 'verbose',  filename: 'winston.log',  json: true});module.exports = customLogger
```

这是个 Winston 配置的 demo，要找到合适你项目的 Winston 的配置方式可以查看 Winston 文档。

回到这个配置文件，重点在 winston.transports.File 的配置： 

`json: true`

这样写入 log 文件里的内容都是 json 对象了，winston.log 的部分内容是这样的：

> {“level”:”info”,”message”:”getRateMap”,”timestamp”:”2016-11-16T04:31:55.882Z”}
> 
> 
> {“level”:”info”,”message”:”defaultRateUp get
> 
> 
> map”,”timestamp”:”2016-11-16T04:31:55.883Z”}
> 
> 
> {“level”:”info”,”message”:”each products { quota: 20000,\n name:
> 
> 
> ”,\n term: 1,\n type: 2,\n description: ”,\n id:
> 
> 
> ‘549922452238c54e98b750bc’,\n rate_year: null,\n product_id:
> 
> 
> ‘549922452238c54e98b750bc’,\n _id: ‘549922452238c54e98b750bc’,\n
> 
> 
> rate: null,\n rate_up: 0 }”,”timestamp”:”2016-11-16T04:31:55.884Z”}

可以看到，每一行都是一个 json，结构是：

```
{“level” : “”，“message” ： “****”}
```

这样ELK 在收集 log 就会很方便了。

而配置中 winston.transports.Console 里是没有 json: true 的配置项的，所以我们在命令行里看到的 log 还是换行的，比较适合阅读。

### 替换项目中的 log

#### console.log

搞定了log 文件格式的问题，我们还需要把项目里的 console.log 替换为 Winston 的 log。

可以在应用的启动位置 app.js 添加如下内容：

```
var winston = require('./api/lib/WinstonLog')console.log = winston.infoconsole.error = winston.error
```

这样就把 console.log 的实现替换了。

#### web 框架默认的 log

因为这边使用的是 sails 这个 web 框架，所以这里讲一下 sails 里如何替换 log 的实现。 

sails 默认集成的 log 库是 [captains-log](https://github.com/balderdashy/captains-log) ，那如何替换成 Winston 呢？sails 的官方文档其实已经给了方法了~~~， 见[http://sailsjs.org/documentation/reference/configuration/sails-config-log](http://sailsjs.org/documentation/reference/configuration/sails-config-log)

修改 log 配置

```
// config/log.jsvar customLogger = require('../api/lib/WinstonLog')module.exports.log = {  // Pass in our custom logger, and pass all log levels through.  custom: customLogger,  level: 'verbose',  // Disable captain's log so it doesn't prefix or stringify our meta data.  inspect: false};
```

用刚刚引入的 Winston 对象注入到 sails 的 log 配置里就可以啦。


