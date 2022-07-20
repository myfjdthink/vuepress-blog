---
title: Babel 6 配置
date: 2016-01-08
tags:
 - Node
 - posts
categories: 
 - Archived
---
# Babel 6 配置



### Babel 6 配置

Babel 6 较之前版本有些变化，几个比较重要的点。

1. npm package **babel** 已经不在使用了，分成了下列几个 package

* **babel-cli**, 适用于命令行
* **babel-core**, 包含了Node API
* **babel-polyfill**, which when required, sets you up with a full ES2015-ish environment
为了避免冲突，最好卸载之前的 package： **babel**, **babel-core** 等。

安装 Babel 6

`$ npm install -g babel-cli`

2. babel 6 加入插件机制，默认不使用任何插件，将会直接输出原文。可以配置插件来翻译指定的特性，当然，Babel 也准备好了预设集合，如支持所有的es6语法的预设集合 **es2015**，安装此预设集：

`$ npm install babel-preset-es2015`

所有的插件列表：[http://babeljs.io/docs/plugins/](http://babeljs.io/docs/plugins/)
安装好 Babel 和相应的插件之后，再做个简单的配置， Babel 提供了多种配置方式，详细的配置方式见文档：[http://babeljs.io/docs/usage/options/](http://babeljs.io/docs/usage/options/)。这里使用 .babelrc 配置文件的方式。 

在项目根目录里添加 .babelrc 文件，内容如下：

```
{  "plugins": ["es2015"],  "ignore": [    "foo.js",    "bar/**/*.js"  ]}
```

在项目目录下运行命令： 

`$ babel script.js`

搞定～


