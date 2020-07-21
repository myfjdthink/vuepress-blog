---
title: 博客迁移到腾讯云 Serverless
date: 2020-07-13
tags:
 - Blog
 - Serverless
categories: 
 - Code
---

## 为什么迁移博客
最近在看 Serverless，恰逢原 WordPress 的博客需要续费，对比一下自建博客和在 Serverless 的费用。


- 自建博客: 腾讯云 1CPU 1G 小主机 1080元/3年, 平均 0.98 元一天
- Serverless : COS + CDN 费用小于 0.3 元一天

使用腾讯云的 Serverless 建站，主要支付的是内容存储 COS 和 内容分发 CDN 两部分的费用，
目前 COS 和 CDN 都有 6个月的免费额度，
过了免费期后，我这个小破站的流量，都达不到最低计费标准, 费用也会非常低.....

最后在金钱的吸引下，果断抛弃云主机，拥抱 Serverless

## 新的博客框架

新的博客将使用 [VuePress](https://vuepress.vuejs.org/zh/) 来编写，VuePress 会把 Markdown 编译成静态网页。
可以直接挂在到 github.io 上，但是为了使用自定义的域名，就要使用 Serverless 来挂载了。

具体教程

[基于 Serverless 的 VuePress 极简静态网站](https://serverlesscloud.cn/best-practice/2020-02-04-vuepress-serverless)
 
[基于 Serverless Component 全栈解决方案 Ⅱ](https://www.serverless.com/cn/learn/case-studies/serverless-fullstack-vue-practice-pro/)

## 主题

VuePress 的默认主题是写文档的，我找了个 blog 主题  [vuepress-theme-reco](https://vuepress-theme-reco.recoluan.com/)

## 迁移
之前的博客都存储在 Evernote 中，我写了些脚本，把 Evernote 备份的文档转换成 VuePress 支持的 Markdown。

用到以下工具

[enex-parser](https://github.com/apaleslimghost/enex-parser) 可以解析每篇文章的信息

[evernote2md](https://github.com/wormi4ok/evernote2md) 可以把 Evernote 转成 markdown，但是没有日期和tag信息

## 部署

搞定之后，借助于 serverless 这个工具，写好 yaml 描述文件后就可以部署博客了。

```yaml
# serverless.yml
blog:
  component: "@serverless/tencent-website"
  inputs:
    code:
      src: ./public # Upload static files
      index: index.html
      error: 404.html
    region: ap-guangzhou
    bucketName: blog
    protocol: https
    # 新增的 CDN 自定义域名配置
    hosts:
      - host: www.myfjdthink.com # 希望配置的自定义域名
        https:
          certId: eUsMglwe # SSL 证书 ID
          http2: off
          httpsType: 4
          forceSwitch: -2
```

执行部署命令
```bash
sls --debug
```

就可以一键部署博客，实际上是 "@serverless/tencent-website" 这个组件帮你执行了一系列的事情：

- 上传静态文件到 COS
- 配置 CDN
- 配置域名服务

不过 https 证书还是要手动配置的，上面提供的文章里有说。

部署完成后，再配置一下云解析，把 www.myfjdthink.com 解析到指定的位置即可。
