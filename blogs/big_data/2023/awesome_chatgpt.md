---
title: ChatGPT 用法介绍
date: 2023-03-10
tags:
 - ChatGPT
categories: 
 - AI
---

## 注册 ChatGPT
我当时是根据这个[攻略](https://juejin.cn/post/7173447848292253704)注册的，大家可以试试

## 理解 prompt
ChatGPT 的回答
> ChatGPT 的 prompt 是指用户在向 ChatGPT 提出问题或请求时，提供的文本或指令。
> 
> 
> prompt 通常包含一个或多个问题、请求或指令，用于指导 ChatGPT 生成响应。
> 在对 prompt 进行理解、解释和响应的过程中，ChatGPT 利用其预训练模型中的大量知识和数据来生成相应的回答。
> prompt 的内容和质量对 ChatGPT 的生成效果具有非常重要的影响。
> 
> 
> 合理的 prompt 可以指导 ChatGPT 生成准确、连贯、有用的响应，而不合理或含混的 prompt 则可能导致 ChatGPT 生成错误或无效的回答。
> 因此，在使用 ChatGPT 进行交互时，编写清晰、明确和详细的 prompt 非常重要。

也就是说问法很重要，要多尝试不同的问法，一般来说，问题描述越精确越好

这里有个 [prompt 指南](https://github.com/PlexPt/awesome-chatgpt-prompts-zh)，收录各种常用的场景，希望可以帮助到你

##  使用 ChatGPT  Web 版润色文章 
> 帮我润色这篇文章，https://myfjdthink.github.io/blogs/big_data/2023/iceberg_optimization.html  修复其中的语法错误，让其表述更加流畅，并且你要解释为什么这么做

ChatGPT 可以直接读取链接，你可以让他润色文章，也可以让他对文章做总结中心思想，还可以让他直接阅读 Github 上的代码并解释。


## Blob 插件 + ChatGPT API 快速翻译和润色
安装方式直接看 [Blob 插件](https://github.com/yetone/bob-plugin-openai-translator)，其文档详细介绍了安装方式还有 GIF 动图展示，这里就不赘述了。


[ChatGPT API](https://platform.openai.com/account/api-keys) 目前可以免费申请，额度是 $18, 够用很久了。


## Chrome 插件，翻译，润色，汇总+自定义 prompt

Chrome 插件 [chatgpt sidebar](https://chatgpt-sidebar.com/) , 以侧边栏的形式使用 ChatGPT。

同样需要配置 ChatGPT API

## [Awesome ChatGPT API](https://github.com/reorx/awesome-chatgpt-api/blob/master/README_cn.md)
这个仓库介绍了各种基于 ChatGPT API 的应用
