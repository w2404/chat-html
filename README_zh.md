# OpenAI GPT 模型 API HTML App

这个 HTML App 被设计用于连接 OpenAI 的 GPT 模型 API 并根据用户输入生成文本。它使用 HTML、CSS、JavaScript 和 Vue.js 构建，并可以通过任何 Web 浏览器访问。

## 要求

要使用此应用程序，您需要：

- 互联网连接
- Web 浏览器

## 设置

要设置此应用程序，请按照以下步骤操作：

1. 克隆存储库到您的本地计算机。
2. 在与 `index.html` 相同的目录中创建一个 `config.js` 文件。
3. 在 `config.js` 中，定义一个名为 `key` 的变量，并将其值设置为您的 OpenAI API 密钥。
4. 在 Web 浏览器中打开 `index.html` 文件。
5. 在文本框中输入您的文本提示。
6. 按“Enter”键生成基于提示的文本。

示例 `config.js` 文件：

```
var key = "YOUR_API_KEY_HERE";
```

## 功能

此应用程序具有以下功能：

- 连接 OpenAI 的 GPT 模型 API 的能力。
- 用于文本提示的用户输入字段。
- 用于根据用户输入生成文本的按钮。
- 用于显示生成的文本的输出字段。
- 将对话保存为 JSON 的能力。
- 从 JSON 加载先前保存的对话的能力。
- 当长度超过 3000 个标记时自动删除最早的对话。
- 针对网络不良的特殊情况：
  - 能够中断正在进行的请求。
  - 能够重试失败的请求。
  - 能够取消请求。
- 所有对话历史都可以编辑和删除。
- 在编辑时，原始文本提供给用户，而在直接显示的文本中，Markdown 将被视为处理方式。
- 包括来自 [https://github.com/f/awesome-chatgpt-prompts](https://github.com/f/awesome-chatgpt-prompts) 的一些常用提示。

## 使用的技术

此应用程序是使用以下技术构建的：

- HTML
- CSS
- JavaScript
- Vue.js

## 参与贡献

如果您想为此应用程序做出贡献，请提交一个 pull
