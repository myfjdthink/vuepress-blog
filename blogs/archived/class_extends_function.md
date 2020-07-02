---
title: class extends function
date: 2018-07-05
tags:
 - posts
 - Node
 - 编程相关
categories: 
 - Archived
---
# class extends function





注意：本文示例代码是 typescript

## klg-logger 的封装

最近在做一个共用的 logger 包 [klg-logger](https://github.com/kaolalicai/klg-logger) ，在调研了一圈后，决定基于 [tracer](https://github.com/baryon/tracer) 这个包来做封装，tracer 足够简单，也具有拓展性。因为公司使用的工具包都是使用 class 风格的， 所以第一版的 klg-logger 长这样：

```
import {console, Tracer} from 'tracer'

export class Logger {
  private logger: any

  constructor (config?: Tracer.LoggerConfig) {
    this.logger = console(config)
  }

  log (msg: any, ...params): void {
    this.logger.log.apply(this, arguments)
  }

  error (msg: any, ...params): void {
    this.logger.error.apply(this, arguments)
  }
  // ...
}
```

使用方式：

```
const logger = new Logger({})
logger.log('hello world')
```

就是使用一个 Logger class 把 tracer 封装了一次。

## this 域问题

过了一段时间，klg-logger 出现了一个错误：

```
TypeError: Cannot read property 'logger' of undefined
```

经排查，是 this 作用域的问题，调用 logger 的代码长这样：

```
this.connect().then(function () {
  // code
}).catch(logger.error)
```

logger.error 这个 function 是作为 参数直接传递个 catch， 那么 logger.error 内部的 this 将会指向 catch 对象，而不再是 logger 对象。 

我们可以改变写法来避免这个错误：

```
this.connect().then(function () {
 // empty
}).catch(function (err) {
  logger.error(err.message)
})
```

但如果要更彻底地解决这个问题，还是要改变一下 logger.error 的实现才行。

## class extends function

考虑到这个包 klg-logger 已经在多个系统中使用，为了保持兼容，我们要继续保持 class 风格，所以我们要把上文提到的“封装”的实现改为继承实现。

```
import {console} from 'tracer'

export class Logger extends console {
  // Error:(3, 29) TS2507: Type '(config?: LoggerConfig) => Logger' is not a constructor function type.
}
```

直接继承 tracer 的 console 是会报错的，因为 console function 没有 construction。 

在 stackoverflow 上可以找到解决方案：[https://stackoverflow.com/questions/36871299/how-to-extend-function-with-es6-classes](https://stackoverflow.com/questions/36871299/how-to-extend-function-with-es6-classes)

通过一个 Function 把 console 包装成一个具有 construction 的对象，然后在 construction 里面 return console 实例即可

```
class Logger extends Function implements Tracer.Logger {
  constructor (config?: LoggerConfig) {
    super()
    Object.setPrototypeOf(console, Logger.prototype)
    const instance = console(config as any) as Logger
    instance.err = instance.error
    return instance
  }

  // 下列方法都会被覆盖，只做声明用， 无需实现
  debug (...args: any[]): Tracer.LogOutput {
    return undefined
  }

  error (...args: any[]): Tracer.LogOutput {
    return undefined
  }

  /// ......
}
```

经测试，最后的写法和功能都是原版保持了一致。


