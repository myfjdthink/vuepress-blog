const request = require('superagent')
require('superagent-proxy')(request)
const fs = require('fs')
const debug = require('debug')('chatgpt')
// chatpgt 的 api key
const user_api_keys = '' || process.env.API_KEY
const proxy = process.env.http_proxy

async function polisher (query_text) {
  const ChatGPTModels = ["gpt-3.5-turbo", "gpt-3.5-turbo-0301"];
  const api_keys = user_api_keys.split(",").map((key) => key.trim());
  const api_key = api_keys[Math.floor(Math.random() * api_keys.length)];
  let prompt = "这是一篇使用 markdown 格式编写的文章，请润色这篇文章, 使其更加简明扼要和连贯";
  const body = {
    model: ChatGPTModels[0],
    temperature: 0,
    // max_tokens: 500,
    top_p: 1,
    frequency_penalty: 1,
    presence_penalty: 1,
  };
  body.messages = [
    {role: "system", content: prompt},
    {role: "user", content: query_text},
  ];

  try {
    debug('query to chatgpt ...')
    const resp = await request.post("https://api.openai.com/v1/chat/completions")
      .set({"Content-Type": "application/json", 'Authorization': `Bearer ${api_key}`})
      .send(body)
      .retry(3)
      .proxy(proxy)

    debug('res data ', resp.body)

    if (resp.error) {
      const {statusCode} = resp.response;
      let reason;
      if (statusCode >= 400 && statusCode < 500) {
        reason = "param";
      } else {
        reason = "api";
      }
      return {
        error: {
          type: reason,
          message: `接口响应错误 - ${resp.data.error.message}`,
          addition: JSON.stringify(resp),
        },
      }
    }
    const {choices} = resp.body;
    if (!choices || choices.length === 0) {
      return {
        error: {type: "api", message: "接口未返回结果",},
      };
    }
    return {text: choices[0].message.content.trim()}

  } catch (err) {
    debug('err ', err)
    return {
      error: {
        type: err._type || "unknown",
        message: err._message || "未知错误",
        addition: err._addition,
      }
    }
  }
}


async function convert () {
  let filePath = 'blogs/big_data/2023/iceberg_optimization.md'
  const blogText = fs.readFileSync(filePath, 'utf8')
  // debug('read blogText', blogText)
  const res = await polisher(blogText)
  const polisherText = res.text
  // const polisherText = blogText + '\n\n'
  fs.writeFileSync(filePath, polisherText)
}

async function main () {
  debug('proxy ', proxy)
  debug('api_key ', user_api_keys)
  let text = `Trino 写入 Iceberg 默认使用的是 \`merge on read\` 策略，这样会导致 Snapshot 版本过多之后，查询性能会急剧下降，因为每次查询都要做 merge 操作。
可以使用以下方式对 Snapshot 做定期清理，操作方式这里不介绍了，自行搜索吧
频繁往 Iceberg 写入数据的时候，会产生很多小文件，同样会影响查询性能，解决方案是类似的。`
  const res = await polisher(text)
  const polisherText = res.text
  console.log(polisherText)
}

main().then(console.log).catch(console.error)


