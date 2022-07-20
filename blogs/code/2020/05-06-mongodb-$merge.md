---
title: Mongodb 按需式物化视图使用指南
date: 2020-05-06
tags:
 - mongodb
categories: 
 - Code
---
## 介绍
$merge，又称按需式物化视图，是MongoDB4.2最强大的新增功能之一。

每次运行该命令，会允许你按照增量的方式更新结果集。相对于 $out 每次都要重新生成结果集，$merge 有着更好的性能。

## 准备数据

在开始介绍 $merge 用法之前，我们先准备测试数据，请在本地使用 docker run mongodb 4.2。


假设我们需要使用 lookup 关联查询两个表。

新建一个 note 表并写入 1000 条数据, 在 mongo shell 中执行
```js
db.createCollection('note')
var notes = new Array(1000).fill(0).map((it,index) => ({name : 'note'+index}))
db.note.save(notes)
```

新建一个 portfolio 表并写入 10000 条数据，并且和 note 表进行关联
```js
db.createCollection('portfolio')

var notes = db.note.find().toArray()
for(var i=0; i<10e3; i++){
    var index = i%1000
    var noteId = notes[index]._id.str
    db.portfolio.save({
        noteId : noteId,
        amount : index
    })
}
```

连表查询, 把 note 表中的 name join 到 portfolio 中

```js
db.portfolio.aggregate([
// 把 noteId 转换成 ObjectId
{$addFields : {noteObjId : {$toObjectId : "$noteId"}}},
{$lookup: { 
         from: "note", 
         localField: "noteObjId",
         foreignField: "_id",
         as: "note_docs" } 
},
// 合并两个表
{
   $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$note_docs", 0 ] }, "$$ROOT" ] } }
},
{$project : {noteObjId:0, note_docs : 0}}
])
```

查询结果

```js
/* 1 */
{
    "_id" : ObjectId("5eb25e2d8be714faeead14ae"),
    "name" : "note0",
    "noteId" : "5eb25d788be714faeead10c6",
    "amount" : 0.0
}

/* 2 */
{
    "_id" : ObjectId("5eb25e2d8be714faeead14af"),
    "name" : "note1",
    "noteId" : "5eb25d788be714faeead10c7",
    "amount" : 1.0
}
....more data...
```

## 使用

使用 $merge 我们就可以把上述查询结果存入另一个表中

```js
db.portfolio.aggregate([
// 把 noteId 转换成 ObjectId
{$addFields : {noteObjId : {$toObjectId : "$noteId"}}},
{$lookup: { 
         from: "note", 
         localField: "noteObjId",
         foreignField: "_id",
         as: "note_docs" } 
},
// 合并两个表
{
   $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$note_docs", 0 ] }, "$$ROOT" ] } }
},
{$project : {noteObjId:0, note_docs : 0}},
{$merge: 'full'}
])
```

这样查询结果就会存入 full 表中，full 是一个 collection，我们可以对它进行增查删改和新建索引等操作，所以可以无缝支持 mongoose。

这里我们使用了 $merge 的默认选项，$merge 的具体选项有
```js
{ $merge: {
     into: <collection> -or- { db: <db>, coll: <collection> },
     on: <identifier field> -or- [ <identifier field1>, ...],  // Optional
     let: <variables>,                                         // Optional
     whenMatched: <replace|keepExisting|merge|fail|pipeline>,  // Optional
     whenNotMatched: <insert|discard|fail>                     // Optional
} }
```

{$merge: 'full'} 等价于

```js
{ 
$merge: {
     into: 'full',
     on: '_id',  // Optional
     let: { new: "$$ROOT" },                                         // Optional
     whenMatched: 'merge',  // Optional
     whenNotMatched: 'insert'                     // Optional
} 
}
```
即以 portfolio 的 _id 为唯一key，当本次 aggregate 查询结果和 full 表已有的记录 matched 时，合并两个对象，不 matched 时，新增一条记录.

如果 portfolio 和 note 数据有更新，full 表数据不会自动更新，需要重新执行上述 aggregate。

## 删除过期数据
那么问题来了，如果删除了 portfolio 表中的某条数据，full 表数据是不会自动删除的，我们需要怎么做呢？

我们可以给数据打算时间戳

```js
var time = Date.now()
db.portfolio.aggregate([
// 把 noteId 转换成 ObjectId
{$addFields : {noteObjId : {$toObjectId : "$noteId"}, mergedAt: time }},
{$lookup: { 
         from: "note", 
         localField: "noteObjId",
         foreignField: "_id",
         as: "note_docs" } 
},
// 合并两个表
{
   $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$note_docs", 0 ] }, "$$ROOT" ] } }
},
{$project : {noteObjId:0, note_docs : 0}},
{$merge: 'full'}
])

// 删除非本次更新的数据
db.full.remove({"mergedAt" : {$ne : time}})
```

再更新完数据后，删除非本次更新的数据即可

## 普通视图
如果用普通视图来查询上述内容的话，可以这样做

```js
db.createView('p_view', 'portfolio',
[ 
{$addFields : {noteObjId : {$toObjectId : "$noteId"}}},
{$lookup: { 
         from: "note", 
         localField: "noteObjId",
         foreignField: "_id",
         as: "note_docs" } 
},
{
   $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$note_docs", 0 ] }, "$$ROOT" ] } }
},
{$project : {noteObjId:0, note_docs : 0}}
])
```

这样我们就建好了一个叫 p_view 的视图，假设我们修改了 note 的 name, p_view 会同步更新数据，因为实际上 p_view 每次都会执行连表查询。

虽然 p_view 不是一个 collection，但是我们在 mongoose 中也是可以照常使用 Schema 的

```js
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:57017/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

let schema = new mongoose.Schema({
    amount: Number,
    name: {type: String, get: str => str.toUpperCase()}
  },
  {toObject: {getters: true}}
)

const View = mongoose.model('View', schema, 'p_view');

View.countDocuments().then(total => console.log('total : ', total))

View.find().limit(2).then(its => {
  console.log('find items length ', its.length)
  console.log('find items ', its)
})
```

输出

```js
find items length  2
find items  [
  {
    _id: 5eb25e2d8be714faeead14ae,
    name: 'NOTE000',
    noteId: '5eb25d788be714faeead10c6',
    amount: 0,
    id: '5eb25e2d8be714faeead14ae'
  },
  {
    _id: 5eb25e2d8be714faeead14af,
    name: 'NOTE1',
    noteId: '5eb25d788be714faeead10c7',
    amount: 1,
    id: '5eb25e2d8be714faeead14af'
  }
]
total :  10000
```

## 总结
- 物化视图并非像普通视图那样会自动更新数据，需要手动触发更新
- 删除过期数据比较麻烦
- 适合的使用场景，定期汇总的数据表，例如每日数据报表
- 如果查询性能不是问题，请使用普通视图，不用维护数据更新
