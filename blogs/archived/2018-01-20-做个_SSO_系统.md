---
title: 做个 SSO 系统
date: 2018-01-20
tags:
 - posts
 - Node
 - 编程相关
categories: 
 - Archived
---
# 做个 SSO 系统





### 应用场景

最近公司要统一内部管理系统的用户与权限控制，于是考虑开发一个 SSO 单点登陆系统，考虑到内部系统都是 web 服务和开发时间有限，而且内部系统都是 Node.js 写的， 使用 Koa 框架，最终决定使用最简单的解决方案。

### 实现方案

#### 原理

kwt + cookie 

JSON Web Token（JWT）是一个非常轻巧的规范。这个规范允许我们使用JWT在用户和服务器之间传递安全可靠的信息，这里将作为用户的登陆标识。 

用户的登陆流程是这样的：

1. 打开接入方系统，假设域名是 aaa.abc.com
2. 校验登陆状态，查看 cookie 里是否存在 jwt 并解密校验，如果未登录，跳转到 SSO 登陆页面，SSO 域名是 sso.abc.com
3. 在 SSO 登陆页面填写用户名和密码（未注册的先注册），登陆后 SSO 系统把 jwt 写入 cookie，cookie 的有效域名为 abc.com，然后跳跳转回原系统（跳过来的时候在 url 里带上原系统地址）
4. 返回原系统，校验登陆状态，登陆完成
#### sso 系统实现

基本的用户管理功能，有：

* 部门管理
* 权限管理
* 注册功能
* 登陆功能
* 找回密码
重点功能是登陆，需要在登陆时将 jwt 写入 cookie，上文原理中有要求各个系统要有个共同的主域名 abc.com，各个系统不同域的话，那就只能把 jwt 在 url 中返回给原系统了，原系统自己把 jwt 写入 cookie，来看看这部分的代码：

```
const jwtdata = {
  username: user.username,
  email: user.email,
  role: user.role
}
// 生成 jwt
const token = jwt.sign(jwtdata, Const.TOKEN_SECRET, {expiresIn: '365d'})
// 写入 cookie
ctx.cookies.set(
  'token',
  token,
  {
    domain: '.abc.com',        // 写cookie所在的域名
    path: '/',                 // 写cookie所在的路径
    maxAge: 30 * 60 * 1000,    // cookie有效时长
    httpOnly: false,  // 是否只用于http请求中获取
    overwrite: true  // 是否允许重写
  }
)
```

注意用于加密 jwt 的密匙，内部系统的话可以直接用一个密匙加密，然后接入方都用这个密匙解密就可以了。 

如果安全要求高一点，那就是 sso 系统用公钥（保密）加密 jwt，然后接入方使用私钥（公开）解密。

#### 接入方实现

考虑到接入方有多个，所以考虑直接写个 Koa 中间件给各个接入方调用是最简单的，将此中间件作为 npm 包发布，接入方使用该中间件监听所有请求，完成对 jwt 的解析和校验。

**监控请求**：

```
const Koa = require('koa')
const app = new Koa()
const auth = require('sso-auth')
app.use(auth.validate({
  unless: [/\/register/, /\/login/, /\/message/],
  errHandle: async function (ctx) {
    console.log('授权错误')
    // 跳转到SSO的登陆页面或者 返回url给前端跳转
    ctx.body = {
      code: 3,
      message: '授权错误',
      url: 'https://sso.abc.com'
    }
    ctx.status = 200
  }
}))
```

**中间件 sso-auth 的内部实现**：

```
// 从 cookie 取出 jwt
// 校验 jwt 是否符合
```

假设接入方是其他编程语言的系统，那就对该语言实现对应的上述校验逻辑即可。

### 总结

jwt 作为 token 可以附带额外的信息 

使用 cookie 存储 token ，同域名的系统接入非常方便 

使用中间件方便了接入方校验 token


