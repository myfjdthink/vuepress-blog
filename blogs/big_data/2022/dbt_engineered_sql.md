---
title: 使用 DBT 工程化管理 SQL
date: 2022-12-19
tags:
 - DBT
categories: 
 - big_data
---

## DBT 是什么
DBT 就是一款 ETL 工具，不过它并不具备计算能力，DBT 使用软件工程的方法，帮助团队组织和构建 data transforming sql，然后将 sql 提交给 sql engine 执行。

说的有些抽象，我们看一个例子，需求是这样子的：
> 我们使用 Bigquery 或者其他 Cloud SQL 作为我们的数据仓库，有一张 orders 的表，我们要根据日期聚合成每日汇总表，叫 orders_daily 。

我们可以直接编写一段 sql 完成这个需求
```sql
select 
date(order_time) as day, 
sum(amount) as total
from orders where order_time > 60 days ago
group by 1
```
然后手动提交这段 sql 就行了，我们团队刚接触大数据的时候就是这么做的，很快我们就碰到了问题。
- 我们需要连接不同环境 sql engine，beta or prod
- 我们需要更加动态地编译 sql，例如传入不同的日期过滤参数
- 我们要管理 table metadata, create table , update table column
- 我们需要编写测试, 连续性，异常值等

很快我们就意识到，我们需要一个工具，然后就看到了 DBT，DBT 在官网里是这样表述自己的
> dbt™ helps data teams work like software engineers—to ship trusted data, faster.
> 
> dbt 帮助数据团队像软件工程师那样工作，更快地转换数据。

软件工程师是怎样工作的?
- 他们有 git 工作流
- 他们有自动文档工具
- 他们有单元测试
- 他们有 CI 集成工具
- 他们有自动发布系统

这些也是 DBT 想要解决的问题，这里我不打算详细介绍 DBT 是怎么做到的，我只想告诉你，它做到了。

## SQL 是大数据的未来
DBT 支持非常多的数据库，特别是各大云厂商的数据仓库，例如 BigQuery、Databricks、Redshift、Snowflake。

最近这些年，云厂商都在推出自己的云数据仓库产品，云数仓的优点是，无需运维，按量付费，对小型公司或者小型团队来说是个不错的入门选择，我们公司在转向大数据方向之初，就使用了 Bigquery，是真好用，就是贵了些。
这些云数仓都是主打 SQL 查询，尽量简单化，让用户开箱即用，再搭配 UDF 和 Spark 支持，满足个别用户的复杂计算需求。

国内最近几年比较流行 OLAP，有 ClickHouse, Starrocks、Doris 等多家代表性的产品，他们会用上列式存储，向量化引擎，稀疏索引等技术，给我们带来秒级的查询体验。

云数据和 OLAP 极大简化了大数据基础建设工作，让数据团队可以专注在业务上，而数据团队要处理的业务，根据我们团队的经验，90% 的业务都能用 SQL 完成，搭配上 UDF 就能解决 99% 的业务问题。

所以我会认为 SQL 是大数据的未来。

而且学习 SQL 是件性价比很高的事情，普通人只要学习 10 个左右的 SQL 命令，就可以完成 80% 的工作，再掌握一些 window 函数的使用方法，几乎就毫无压力了。

## DBT 在国内的现状
DBT 在国内的流行度并不高，从中文资料的数量就可以感受出来。

为什么会这样呢？

我个人认为国内的大数据技术栈和国外社区的流行方向还是不太一样的。

说个粗的印象，并没有什么统计数据支撑。
我看到的国外的公司的技术栈关键词一般是这几个：
- 云数仓：BigQuery、Databricks、Redshift、Snowflake
- 云存储：S3、GCS
- 数据湖：Delta Lake、Iceberg、Hudi
- 查询引擎:Hive Spark、Presto、Trino

特点就是喜欢用云服务，省事儿

国内公司的技术栈关键词一般是这几个
- OLAP：ClickHouse、Doris
- 云存储：HDFS
- 数据湖：Hudi、Iceberg
- 查询引擎:Hive、Flink、Flink 还是 Flink

技术好点的公司就是 Flink+数据库各种魔改优化，但必须是自建的 HDFS 服务

技术落后点的就是 Hive + HDFS 这种 10 年前的技术

还特别喜欢用 Java 来做指标计算

这种生态环境下，其实还真没 DBT 的生长空间。

多嘴说一下 Flink，我觉得 Flink 最大的竞争对手应该是 Streaming Database 流数据库。
Flink 在部署和日常 job 管理还是太复杂了，迟早也会被 SQL Only 的更加简洁的 Streaming Database 替代的。

## 总结
从 DBT 聊到了国内外大数据生态的差异，就是表达一个意思，大数据技术栈是朝着越来越简单的方向走的，简单部署或者云服务，使用 SQL 就能解决问题，再搭配 DBT 就能解决中小规模的数据团队的绝大部分问题。
