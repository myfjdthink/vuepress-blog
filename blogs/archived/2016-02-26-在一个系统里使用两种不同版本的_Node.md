---
title: 在一个系统里使用两种不同版本的 Node
date: 2016-02-26
tags:
 - posts
categories: 
 - Archived
---
# 在一个系统里使用两种不同版本的 Node



### 在一个系统里使用两种不同版本的 Node

切换 Node 版本的工具有 n nvm 等，但是如果你需要同时运行两个项目，两个项目使用 Node 版本不一致的话，还是挺麻烦的，需要每次都进行切换。

这里介绍一个简单的办法解决这个问题。

1. 找到 Node 可执行文件的位置，一般是 `/usr/local/bin/node`
2. `sudo cp /usr/local/bin/node /usr/local/bin/node-v10`
3. 使用 n 切换 Node 版本：

`n latest`

4. 查看两个 Node 的版本：

`node-v10 -v`

`node -v`
搞定，这样在运行的时候选择你需要的 Node 版本就行了。


