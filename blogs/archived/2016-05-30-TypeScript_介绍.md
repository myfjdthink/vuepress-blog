---
title: TypeScript 介绍
date: 2016-05-30
tags:
 - posts
categories: 
 - Archived
---
# TypeScript 介绍



# TypeScript 介绍

## 前言

TypeScript 支持 ECMAScript 2015 的各种特性，关于 ECMAScript 2015 的特性本文将不再介绍。 

推荐阅读[ECMAScript 6入门](http://es6.ruanyifeng.com/)

## TypeScript 是什么

* [TypeScript](https://www.typescriptlang.org/) 是 微软出品的编程语言，是JavaScript 的超集。
* 具有类型系统，所以叫 TypeScript
* 支持 ES6 甚至 ES7 的 async functions and decorators

## 基础类型

* boolean
* number
* string
* array
* tuple+联合类型（额，这个很难懂，后面有解释）
* enum
* any
* void
OK,如何声明一个变量的类型呢 ? 

屁股后面加:

```
let isDone:boolean = false;let decLiteral: number = 6;let name: string = "bob";let list: number[] = [1, 2, 3];let x: [string, number];enum Color {Red, Green, Blue};let c: Color = Color.Green;let notSure: any = 4;
```

### 数组

注意数组内的元素类型要统一，真正的数组。

```
let list: number[] = [1, 2, 3];
```

第二种方式是使用数组泛型，Array<元素类型>：

```
let list: Array<number> = [1, 2, 3];
```

### Tuple 元组

类似数组，允许不同类型。

* 元素数量固定
* 元素类型确定

```
// Declare a tuple typelet x: [string, number];// Initialize itx = ['hello', 10]; // OK// Initialize it incorrectlyx = [10, 'hello']; // Error
```

### Enum 枚举

enum类型是对JavaScript标准数据类型的一个补充。 像C#等其它语言一样，使用枚举类型可以为一组数值赋予友好的名字。

```
enum Color {Red, Green, Blue};let c: Color = Color.Green;
```

### Any 任意值

兼容 js 代码

### Void 空值

### Type assertions 类型断言（强制类型转换）

直接告诉编译器这个变量的类型

```
let someValue: any = "this is a string";let strLength: number = (<string>someValue).length;
```

---

## 接口

首先说明如果你是java程序员，请一定忘记interface，此处的接口和彼处接口完全不是一个思想。 

接口是一种约定，用于规范程序。 

首先来一个最简单的接口

### 字面量接口

不使用interface关键字就定义了一个接口

```
function printLabel(labelledObj: {label: string}) {  console.log(labelledObj.label);}var myObj = {size: 10, label: "Size 10 Object"};printLabel(myObj);
```

上面没有interface关键字，哪个是接口呢? 

> {label: string}

你说这个玩意不是变量labelledObj的类型吗？我知道typescript说白了就是 js 的类型系统，前面也介绍了如：Boolean,Number,String,Array,Enum,Any,Void 

其实接口就是定义了一个对象有哪些属性，并且属性值是什么类型

### 使用字面量

```
interface LabelledValue {  label: string;}function printLabel(labelledObj: LabelledValue) {  console.log(labelledObj.label);}let myObj = {size: 10, label: "Size 10 Object"};printLabel(myObj);
```

## 类

### 定义

```
class Greeter {    greeting: string;    constructor(message: string) {        this.greeting = message;    }    greet() {        return "Hello, " + this.greeting;    }}let greeter = new Greeter("world");
```

### 继承

见官方的 demo 

[https://www.typescriptlang.org/play/index.html](https://www.typescriptlang.org/play/index.html)

```
class Animal {    constructor(public name: string) { }    move(distanceInMeters: number = 0) {        console.log(`${this.name} moved ${distanceInMeters}m.`);    }    moveClone(distanceInMeters: number = 0){        this.move(distanceInMeters)    }}class Snake extends Animal {    constructor(name: string) { super(name); }    move(distanceInMeters = 5) {        console.log("Slithering...");        super.move(distanceInMeters);    }}class Horse extends Animal {    constructor(name: string) { super(name); }    move(distanceInMeters = 45) {        console.log("Galloping...");        super.move(distanceInMeters);    }}let sam = new Snake("Sammy the Python");let tom: Animal = new Horse("Tommy the Palomino");sam.moveClone();tom.moveClone(34);
```

子类重写了父类方法move,然后父类引用指向子类对象，多态实现了！

支持访问修饰符 public private等

支持 get set 控制对对象成员的访问

## TypeScript 优秀的地方

### 支持 ES6 新特性，一些 ES7的特性也支持

### 灵活的类型系统，具有类型推导

TypeScript里，在有些没有明确指出类型的地方，类型推论会帮助提供类型。如下面的例子

```
let x = 3;
```

变量x的类型被推断为数字。 

不会像 Java 那样每个地方都写死类型，类型更多时候用于限制函数的输入与返回。

### 编译代码的可读性高

可以看看 typescript 提供的 demo 

[https://www.typescriptlang.org/play/index.html](https://www.typescriptlang.org/play/index.html)

### 可复用 npm module

可以利用 Node 的生态。

* tsd

通过声明文件来复用 npm 包
* typings

since 1.8，更合理地管理 tsd 文件的方式，把 tsd 文件植入到 npm 包中。

## 参考文档

[TypeScript-Basic](https://segmentfault.com/a/1190000004620132)

[TypeScript interface](https://segmentfault.com/a/1190000004619949)


