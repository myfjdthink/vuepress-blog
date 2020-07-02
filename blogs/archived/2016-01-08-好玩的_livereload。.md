---
title: 好玩的 livereload。
date: 2016-01-08
tags:
 - posts
categories: 
 - Archived
---
# 好玩的 livereload。



### 好玩的 livereload。

livereload 工具可以自动监听项目文件的修改事件，配合浏览器插件（websocket），即时刷新浏览器页面，写 css 和 html 的绝佳利息，F5 救星。

Livereload的[官网](http://livereload.com)，它支持mac/linux/windows，同时还有chrome/firefox的浏览器插件。它对windows的支持比较差，很容易崩溃，而且是收费的。所以我们只需要用它的浏览器插件就可以了（免费的），然后再找一个免费的替代器换掉服务器端。

我选择的是：[python-livereload](https://github.com/lepture/python-livereload)，它是一个python程序，以命令行方式启动，可以跟livereload的浏览器插件通信，效果不错。注意最好从github中下载源代码安装，通过pip或easy_install安装也行，但是我本机使用 pip 安装会有问题，最后还是偷懒直接用 apt-get 方式安装了。

```
1.sudo apt-get install python-livereload
```

Chrome 的插件： 

[https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei)

使用方式如下：

```
1.cd myproject 2.cd app 3.livereload  （执行此命令就开始监听文件变化）4.5.然后启用浏览器的livereload插件即可。
```

参考文档：[我的web开发最强组合：Play1+angularjs+bootstrap ++ (idea + livereload)](http://freewind.in/posts/1167-my-most-powerful-tools-for-web-dev-play1-angularjs-bootstrap-idea-livereload/)


