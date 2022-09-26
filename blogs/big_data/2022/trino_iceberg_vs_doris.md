---
title: Trino+Iceberg VS Doris
date: 2022-09-26
tags:
 - BigData
 - OLAP
categories: 
 - big_data
---

## Doris 的问题
Doris 已经在我们公司落地了一段时间，碰到比较多的问题，
Doris 在数据架构上和上下游组件的集成工作做得比较少,满足不了我们公司的业务模式。

我们主要做区块链数据指标解析，区块链上有非常多的应用，我们业务上需要不断解析新的指标。

我们经常需要短时间内将 100GB 级别的数据从 Data Lake 写入到 Doris 中，Doris 在这一块上表现很糟糕，
使用 Broker Load 写入大量数据很容易占满 CPU 影响查询层，
期望 Doris 多租户功能来实现读写分离，而 Doris多租户的实现也非常麻烦，一点都不灵活，也需要额外的资源。

使用 Doris Spark Connector 来写入数据到 Doris 也是小 BUG 不断，最大的问题是该 Connector 无法保障数据能稳定写入，
经常因为 Doris 负载过高导致 Spark 写入报错，程序被终止，需要不断地重试。
背后的根源还是 Doris 在数据生产这一块投入比较少，Doris Spark Connector 没多少用户。
大部分人使用 Doris 用的比较多的方式还是 MySQL CDC Flink 写入 Doris 那一套。


## 替代方案 - Trino
我们把大数据架构简单拆分为存，算、查三层，他们的可选项有：
- 存： Bigquery(Snowflake)、Iceberg、Hudi，Delta Lake
- 算： Spark、Trino、Flink
- 查询： 各种 OLAP，例如 Doris，Trino，Clickhouse

上面提到的最大的问题就是我们在把数据从 Lake(存储层) 同步到 Doris (查询层) 碰到的问题，
如果我们把同步过程去掉呢？就不会有这个痛苦了，所以 Trino 就进入了我们视野。

我们的存储层正在经历从 Bigquery 升级到 Iceberg 的过程，而 Trino 可以直接查询 Bigquery 和 Iceberg 的数据，
可以完美解决升级过程跨库的问题。

而且 Trino 可以对接的 BI 层也相当丰富，包括：
- [Quix](https://wix.github.io/quix/)
- [Apache Superset](https://superset.apache.org/)
- [Metabase](https://www.metabase.com/) (我们正在使用)

Trino 背后有个 Startburst 公司为它做了大量的生态建设工作

## Doris + Iceberg? 就是个半成品
当初我们选择 Doris 很大一部分原因是 Doris 声称他们支持 Iceberg 拓展数据，实际探索哦使用后，发现这就是个半成品，不能用于生产。

问题1：
Iceberg 是可以将数据存放在 GCS、S3 等云存储之上的，而 Doris 对接的 Iceberg， 只能读取存储在 HDFS 上的数据，
读取 GCS 数据将会报错。

问题2：
Iceberg 作为 Doris 的外表，是无法使用 Doris 那一套索引优化方案的。
经过不严谨测试 Doris 读取原生表对比读取 Iceberg 外部表，性能差距在 10 倍左右，
也就意味着，Doris 的 Iceberg 外表就是摆设。


再次吐槽下，Doris 生态还是太年轻了，在数据架构上和上下游组件的集成工作上投入太少。

## 性能测试

以下所以测试都是我们实际生产中碰到的个别例子，结论不严谨，仅供参考

### case 1:大表 join
一个 800 GB 的 table1 join 另一个 50 GB 的 table2 并做复杂业务计算。
测试结果

| DB           | 机器配置         | 执行速度     | 
|--------------|--------------|----------|
| Trino-Iceberg | 1（32C  120G） | avg 30s  |
| Doris    | 3（96C  380G） | avg 180s | 

Trino 在机器配置弱于 Doris 的情况下整体查询性能还是优于 Doris


### case 2:大单表

测试用 sql 
```sql
select distinct(address) from table group by day
```
全部扫描，无法使用分区，测试结果：

| DB           | 机器配置  | 执行速度        | 磁盘空间占比              |
|--------------| ----  |----------------|---------------------|
| Trino-Iceberg | 1（8C  30G） | 1 (avg 86s)    | 1(parquet 压缩, 4.4G) |
| Doris    | 3（24C  96G） | 1.7 (avg 149s) | 6 (25G)             |

Trino-Iceberg 用了 1/3 的算力和 1/6 的存储，还比 Doris 快 1.7 倍

### case 3:Iceberg 的作用
Trino-Iceberg 这个组合查起来快，有一部分原因要归功于 Iceberg，我们做了个对比测试,

把相同的 table 存储在 bigquery 和 Iceberg 中，分别测试他们的查询性能

| 存储             | 执行速度         | 磁盘空间占比              |
|----------------|--------------|---------------------|
| Trino-Iceberg  | 1 (avg 53s)  | 1(parquet 压缩, 4.4G) |
| Trino-bigquery | 2 (avg 120s) | 5 (20G)             |

得益于 Iceberg 对数据的压缩(不是全部原因), Trino-Iceberg 组合获得更优秀的性能

### 性能测试总结
Trino-Iceberg 组合的性能比 Doris 好得非常多，大概在 8 倍左右，这个差距太大了，我一度无法相信。

甚至怀疑是我们水平不够，没有正确使用地 Doris，但是过去几个月对 Doris 的研究，我们还是有信心说自己是掌握了 Doris 的。

还是继续观察 Trino-Iceberg 接下来的表现吧。

换个角度思考，假设真是我们水平低，那是不是更能说明 Trino-Iceberg 组合的强大之处呢，简单使用就能保持高性能，没有复杂的配置和维护。


## 总结
1. Doris 周边生态还有很多的上升空间，期待它未来的表现
2. Trino-Iceberg 组合真的快，去试试
