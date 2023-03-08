---
title: Flink 快速入门
date: 2023-02-28
tags:
 - BigData
 - Flink
categories: 
 - big_data
---
## 学习顺序
建议从 FLink SQL 开始上手学习，容易上手，SQL 也更加直观。

然后逐渐了解：
* 状态和检查点
* 时间和窗口
* lookup join 维表，和双流 join
* Table API 
* Stream API

## 看书
推荐《Flink原理与实践》一书，可以在微信读书上找到电子版。


## 看官网

重点看 Table api 里 sql querys 这部分 https://nightlies.apache.org/flink/flink-docs-release-1.16/docs/dev/table/sql/queries

## 实践

本地使用 Docker 把 Flink SQL 跑起来，实操，可以参考我的这个脚手架  https://github.com/myfjdthink/flink-playground

