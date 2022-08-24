---
title: 使用 SQL 填充补齐缺失行
date: 2022-08-24
tags:
 - SQL
categories: 
 - big_data
---

## 情景
假设我们有一张用户签到记录表，记录了用户每天签到获得的积分

| name     | day | score |
| -------- | --- | ----- |
| adams    | 1   | 1.0   |
| adams    | 2   | 2.4   |
| adams    | 5   | 6.0   |
| coolidge | 1   | 1.3   |
| coolidge | 3   | 3.2   |
| coolidge | 6   | 6.9   |

可以看到用户 adams 漏了 day3 和 day4，现在想要把用户漏签的天数补齐，补齐的值取上一次签到的值即可。

该如何实现呢？

## SQL 实现
这个写法是公司同事提供的，直接用时间序列 动态 inner join 原来的表即可。

完整 sql（bigquery 语法，你可以改成其他 sql 方言，只要支持 window lead 函数即可）

```sql
-- 临时表
with origin_table as (
  select 'adams' as name, 1 as day, 1.0 as score union all
  select 'adams', 2,2.4 union all
  select 'adams', 5,6 union all
  select 'coolidge', 1,1.3 union all
  select 'coolidge', 3,3.2 union all
  select 'coolidge', 6,6.9
),
-- 时间序列
time_ls as (
  select day from unnest(generate_array(0, 7)) as day
),
-- 找出每行记录的 next_day
t_nexe_day as (
  select 
  *, 
  lead(day, 1, 7) over(partition by name order by day) as next_day 
  from origin_table
),
-- join
t_fill as (
  select b.day, a.name, score, a.next_day from t_nexe_day a
  inner join time_ls b
  on a.day <= b.day and a.next_day > b.day
)
select * from origin_table
```

运行该 sql 得到结果：

| day | name     | score | next_day |
| --- | -------- | ----- | -------- |
| 1   | adams    | 1.0   | 2        |
| 2   | adams    | 2.4   | 5        |
| 3   | adams    | 2.4   | 5        |
| 4   | adams    | 2.4   | 5        |
| 5   | adams    | 6.0   | 7        |
| 6   | adams    | 6.0   | 7        |
| 1   | coolidge | 1.3   | 3        |
| 2   | coolidge | 1.3   | 3        |
| 3   | coolidge | 3.2   | 6        |
| 4   | coolidge | 3.2   | 6        |
| 5   | coolidge | 3.2   | 6        |
| 6   | coolidge | 6.9   | 7        |

可以看到，用户 adams 缺失的天数都被上一天的 score 填充出来了。

怎么做到的呢？重点在 inner join 的 on 条件上，是一个动态范围

`origin.next_day > time_ls.day >= origin.day`

以 adams 为例

origin 包括的天数为 1、2、5

time_ls 包括的天数为 0~7

它们的交集是这样的

| origin | x   | time_ls |
|--------|-----|---------| 
| 1      | x   | 1       | 
| 2      | x   | 2~4     |
| 5      | x   | 5~6     |

这样就可以把 origin table 补齐了。


## Windows Function Lead 解析
语法：
```
LEAD (value_expression[, offset [, default_expression]])
OVER over_clause
```

说明

返回后续行的 value_expression 值。更改 offset 值会改变所返回的后续行；默认值是 1，表示窗口框架中的下一行。如果 offset 是 NULL 或负值，则会发生错误。

看看我们的这个例子

```
lead(day, 1, 7) over(partition by name order by day)
```

lead 函数的第三个参数 default_expression 很重要，表示找不到 next value 时返回默认值，这里必须要填，不填的话就是 null

这样 day5 记录就会丢失了

因为 day5 的 join 条件 `null > time_ls.day >= 5` 不成立

partition by name 就是分组的意思，每个用户的 next_day 不一样

order by day 决定了排序字段以及顺序or逆序




