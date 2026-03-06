---
title: 常见 AI 编程模型能力和购买指南
date: 2026-03-06
tags:
 - AI
 - Code
 - LLM
categories: 
 - Code
---

## 模型能力

第一梯队：

- Claude Opus + Sonnet 4.6
- GPT 5.3 Codex（5.4 刚出来，我还没充分测试）

第二梯队：

- Gemini 3.1 Pro（前端能力比较优秀）
- 国产模型目前我觉得最好的是智谱 GLM-5
- MiniMax、Kimi-K2 这类我还没系统测试过，不过据说拿来跑 OpenClaw 这样的 Agent 助手已经够用

## 购买指南

### Claude 模型

建议在 PackyAPI 上购买，稳定性在一众中转里算比较好的：

- [https://www.packyapi.com/register?aff=YZCS](https://www.packyapi.com/register?aff=YZCS)

Packy 的分组有点复杂，先搞清楚分组再买，不然费用会很高。

模型广场和价格页：

- [https://www.packyapi.com/pricing](https://www.packyapi.com/pricing)

Claude 系列可用分组里，我自己的建议：

- `aws-q` 和 `aws-q-sale`：从 AWS 反代出来，最推荐，约 0.15 倍价格。高强度编程一天大概 20 RMB 左右。之前支持 Opus，最近调整后不支持了，Sonnet 4.6 也够用
- `antigravity`：从 Google 那边反代，支持 Opus 4.5，但我体感不如 Sonnet 4.6，而且更贵。高强度编程一天大概 100 RMB
- `aws` 和 `officially`：一般不建议，偏贵

### GPT 模型

可以去这个网站买成品账号或代充值服务：

- [https://getgpt.pro/](https://getgpt.pro/)

有了 GPT Plus 后，可以用最新的 5.3 / 5.4，额度也比较够用。3 个人高强度编程，通常也够。

## Gemini 模型

咸鱼买学生认证号，100 元以内一般能用一年。

## 国内模型

可以直接买阿里百炼的 Code Plan 套餐，支持千问、MiniMax M2.5、GLM-5、Kimi-K2.5 等国产模型，拿来跑 OpenClaw 这样的 Agent 助手很合适。

我看到的价格是首月 7 元，后续 40 元。

## 模型统一管理

以上这些模型如果要统一管理，我推荐这个项目：

- [https://github.com/router-for-me/CLIProxyAPI](https://github.com/router-for-me/CLIProxyAPI)

比如把 Google 授权文件放进 CLIProxyAPI，就可以在 Claude Code 或 OpenCode 里使用 Gemini；GPT 模型同理。

CLIProxyAPI 可以把 Claude、Gemini、Codex 等账户可用模型统一反代出来，还能做协议转换，兼容不同客户端。

部署也方便，可以按官方教程零成本部署到 ClawCloud：

- [零成本部署教程](https://help.router-for.me/cn/hands-on/tutorial-7.html)
