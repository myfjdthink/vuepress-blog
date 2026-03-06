## 模型能力

第一梯队

* Claude Opus + Sonet  4.6
* GPT 5.3 Codex  （5.4 刚刚出来还没测试）

第二梯队

* Gemini 3.1 Pro （前端能力比较优秀）
* 国产模型最好的是智普 GLM5
* minimax kimi-k2 等没有测试过，不过据说用在 Openclaw 这样的 Agent 助手是够的了

## 购买指南

### Claude 模型

建议在 PackyAPI [https://www.packyapi.com/register?aff=YZCS](https://www.packyapi.com/register?aff=YZCS) 上购买，已经是众多中转站里最稳定的了。

Packy 的分组有些复杂，要搞清楚分组，不然费用会很高

在 Packy 模型广场里查看 [https://www.packyapi.com/pricing](https://www.packyapi.com/pricing)

Claude 系列的可用分组
Pasted image 20260306093246.png

* aws-q 和 aws-q-sale 分组，从 aws 那边反代理出来的，最推荐，才 0.15 倍，一天高强度编程也就 20元RMB可以搞定，之前支持 Opus 模型，最近调整后不支持了，Sonet 4.6 也够用
* antigravity 分组，从 Google 那边反代出来的，支持 Opus 4.5，感觉比不上 Sonet 4.6，还贵一些，高强度编程1天 100元
* aws 和 officially 分组都不用考虑，太贵了

### GPT 模型

去这个网站购买成品账户或者代充值服务 [https://getgpt.pro/](https://getgpt.pro/)

就有 GPT Plus 会员了，可以使用最新的 5.3  5.4 模型，额度非常足，3 个人高强度编程都是足够的

## Gemini 模型

咸鱼购买学生认证号，100元以内，可以用一年

## 国内模型

直接购买阿里百炼的 Code Plan 套餐, 支持千问系列，MiniMax M2.5、GLM-5、Kimi-k2.5 等国产模型，拿来跑 Openclaw 这样的 Agent 助手非常合适

首月7月，后续 40元

## 模型统一管理

以上各种模型，如果要统一管理使用，推荐使用 [https://github.com/router-for-me/CLIProxyAPI](https://github.com/router-for-me/CLIProxyAPI) 这个项目来反代理

例如把 Google 授权文件放入到 CLIProxyAPI 这个项目，那就可以在 Claude Code 或者 OpenCode  里使用 Gemini 模型，GPT 模型同理

CLIProxyAPI 可以轻松把 Claude Gemini Codex 等账户可以使用的模型反代理出来，并且可以转换协议，实现兼容各种客户端

这个项目部署也很方便，可以[零成本部署](https://help.router-for.me/cn/hands-on/tutorial-7.html) 到 ClawCloud ，该平台使用注册时长超过180天的 Github 账号登录，即可获得每月5美元的循环额度
