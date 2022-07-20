---
title: Spark Doris 写入大量数据报错 -235 的解决方案
date: 2022-07-19
tags:
 - BigData
categories: 
 - big_data
---

## 场景+问题
新增某个指标的时候，需要使用 Spark Doris Connector 写入大量数据（600w+）到 Doris，默认配置下会碰到以下错误：
```
Streamload Response Error2 :status: 200, resp msg: OK, resp content: {    
\"TxnId\": 277044,    \"Label\": \"spark_streamload_20220719_084617_a0cce08e8ce740a9adefa8ffb2a63a09\",    
\"TwoPhaseCommit\": \"false\",    \"Status\": \"Fail\",    
\"Message\": \"tablet writer write failed, tablet_id=10001248, txn_id=277044, 
err=-235, host: 10.201.15.216\",    \"NumberTotalRows\": 0,    \"NumberLoadedRows\": 0,    \"NumberFilteredRows\": 0,    
\"NumberUnselectedRows\": 0,    \"LoadBytes\": 785485,    \"LoadTimeMs\": 54,    \"BeginTxnTimeMs\": 0,    
\"StreamLoadPutTimeMs\": 0,    \"ReadDataTimeMs\": 0,    \"WriteDataTimeMs\": 52,    \"CommitAndPublishTimeMs\": 0}
```

关键信息：

tablet writer write failed， err=-235

[文档](https://doris.apache.org/zh-CN/docs/faq/data-faq.html)解释是

> 这个错误通常发生在数据导入操作中。新版错误码为 -235，老版本错误码可能是 -215。这个错误的含义是，对应tablet的数据版本超过了最大限制（默认500，由 BE 参数 max_tablet_version_num 控制），后续写入将被拒绝。比如问题中这个错误，即表示 27306172 这个tablet的数据版本超过了限制。

就是导入太频繁了，doris be 忙不过来


## 解决方案
在写入代码中调整写入的批次数，减少写入批次

```python
spark_df.write.format("doris") \
    .option("doris.table.identifier", 'table_name') \
    .option("doris.fenodes", 'doris_fenodes') \
    .option("sink.batch.size", 30000) \
    .option("sink.max-retries", 4) \
    .option("user", doris_user) \
    .option("password", doris_password).save()
```
将默认的 *sink.batch.size* 1w 改为 3w，并设置了失败重试次数为 4，这样就可以顺利写入数据了

更多配置信息参考[spark doris docs](https://doris.apache.org/zh-CN/docs/ecosystem/spark-doris-connector.html)
