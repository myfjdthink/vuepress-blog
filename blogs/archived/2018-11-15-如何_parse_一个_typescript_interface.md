---
title: 如何 parse 一个 typescript interface
date: 2018-11-15
tags:
 - Node
 - ast
 - typescript
 - 编程相关
 - posts
categories: 
 - Archived
---
# 如何 parse 一个 typescript interface





## 目标

有如下一个接口定义，我们想把它的结构 parse 出来，知道每个字段的定义和注释，方便我们生成文档 

```
import {IBanner} from './base/IBanner'
import {IProductGroup} from './base/IProductGroup'

/**
 * 投资列表页面
 */
export interface IProductList {
  /**
   * 产品分组
   */
  groupList: Array<IProductGroup>
  /**
   * 产品列表
   */
  list: Array<{
    a: string,
    b: number
  }>
  /**
   * 投资列表页面的banner
   */
  banners: Array<IBanner>
}
```

## typescript 提供的 ast

```
import * as ts from 'typescript'

const {options} = ts.convertCompilerOptionsFromJson({}, '.', 'tsconfig.json')
options.skipLibCheck = true
options.skipDefaultLibCheck = true
let program = ts.createProgram([
  './src/dashboard/interface/IProductService'
], options)

for (let sourceFile of program.getSourceFiles()) {
  if (sourceFile.fileName.includes('IProductService.ts')) {
    console.log('fileName', sourceFile.fileName)
    console.log('statements', sourceFile.statements[1].members[])
  }
}
```

节选一段输出：

```
{
  pos: 38,
  end: 276,
  flags: 0,
  transformFlags: undefined,
  parent: undefined,
  kind: 235,
  jsDoc: 
   [ NodeObject {
       .....
       tags: undefined,
       comment: '投资列表页面' } ],
  decorators: undefined,
  modifiers: 
   [ TokenObject { pos: 38, end: 64, flags: 0, parent: undefined, kind: 84 },
     pos: 38,
     end: 64 ],
  name: 
   IdentifierObject {
     .....
     escapedText: 'IProductList' },
  typeParameters: undefined,
  heritageClauses: undefined,
  members: 
   [ NodeObject {
       .....
       jsDoc: [Array],
       modifiers: undefined,
       name: [Object],
       questionToken: undefined,
       type: [Object] },
     ....
```

原始的 ast ，需要自己写程序遍历完整结构。

## ts-simple-ast

ts-simple-ast 提供了一些元素获取的方法，例如 

getInterface 

getProperties

可以快速拿到你要的对象。 

不足是，无法识别 import 进来的内容，例如

```
interfaceFile.getInterface('IBanner') 
```

是无法获取的，因为 IBanner 是引用其他文件的

```
import {Project} from 'ts-simple-ast'

// initialize
const project = new Project()
project.addSourceFilesFromTsConfig('./tsconfig.json')
const interfaceFile = project.getSourceFile('src/dashboard/interface/IProductService.ts')
console.log('getProperties', interfaceFile.getInterface('IProductList').getProperties())
```

## readts

[readts](https://github.com/charto/readts) 这个开源包虽然很冷门，但它却更符合我们的需求，它可以 parse 出项目里所有的 class 和 interface 等，而且连 import 进来的对象也帮你 ref 好了。

遗憾的是，匿名的对象定义还是无法 parse。

```
{
    a: string,
    b: number
}
```

用法：

```
const readts = require('readts');
const lodash = require('lodash');

var parser = new readts.Parser();

// Read configuration used in the project we want to analyze.
var config = parser.parseConfig('tsconfig.json');

// Modify configuration as needed, for example to avoid writing compiler output to disk.
config.options.noEmit = true;

// Parse the project.
var tree = parser.parse(config);

var interfaceList = lodash(tree)
  .filter(item => item.interfaceList.length > 0)
  .concat()
  .map('interfaceList')
  .map(item => item[0])
  // .filter(item => item.name && item.name.match(/^I.*/))
  // .value()
  .find(item => item.name === 'IProductList');

console.log('interfaceList', interfaceList);
```

输出示例：

```
ClassSpec {
  name: 'IProductList',
  pos: 
   { sourcePath: '/Users/nick/nodePro/klg-app/src/dashboard/interface/IProductService.ts',
     firstLine: 6,
     lastLine: 22 },
  symbol: 
   SymbolObject {
     flags: 64,
     escapedName: 'IProductList',
     declarations: [ [Object] ],
     members: 
      Map {
        'groupList' => [Object],
        'list' => [Object],
        'banners' => [Object] },
     parent: 
      SymbolObject {
        flags: 512,
        escapedName: '"/Users/nick/nodePro/klg-app/src/dashboard/interface/IProductService"',
        declarations: [Array],
        exports: [Object],
        valueDeclaration: [Object],
        id: 8410 },
     documentationComment: [ [Object] ],
     id: 8359 },
  doc: '投资列表页面',
  propertyList: 
   [ IdentifierSpec {
       name: 'groupList',
       type: [Object],
       optional: false,
       pos: [Object],
       doc: '产品分组' },
     IdentifierSpec {
       name: 'list',
       type: [Object],
       optional: false,
       pos: [Object],
       doc: '产品列表' },
     IdentifierSpec {
       name: 'banners',
       type: [Object],
       optional: false,
       pos: [Object],
       doc: '投资列表页面的banner' } ] }
```


