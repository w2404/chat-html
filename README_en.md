# HTML App for OpenAI's GPT Model API

This HTML app is designed to connect to OpenAI's GPT model API and generate text based on the user's input. The app is built using HTML, CSS, JavaScript, and Vue.js and can be accessed through any web browser.

## Requirements

To use this app, you will need:

- An internet connection
- A web browser

## Setup

To set up this app, follow these steps:

1. Clone the repository to your local machine.
2. Create a `config.js` file in the same directory as `index.html`.
3. In `config.js`, define a variable named `key` and set its value to your OpenAI API key.
4. Open the `index.html` file in your web browser.
5. Enter your text prompt in the text field.
6. Press "Enter" to generate text based on the prompt.

Example `config.js` file:

```
var key = "YOUR_API_KEY_HERE";
```

## Features

This app has the following features:

- Ability to connect to OpenAI's GPT model API.
- User input field for text prompt.
- Output field to display the generated text.
- Ability to save conversations as JSON.
- Ability to load previously saved conversations from JSON.
- Automatic removal of earliest conversation when length exceeds 3000 tokens.
- Specialized for poor network conditions:
  - Ability to interrupt a request that is taking too long to complete.
  - Ability to retry a failed request.
  - Ability to cancel a request.
- All conversation history can be edited and deleted.
- Displayed text is treated as Markdown while the original text is provided for editing.
- Includes a selection of commonly used prompts from [https://github.com/f/awesome-chatgpt-prompts](https://github.com/f/awesome-chatgpt-prompts).

## Technologies Used

This app was built using the following technologies:

- HTML
- CSS
- JavaScript
- Vue.js

## Contributing

If you would like to contribute to this app, please submit a pull request with your changes.

## License

This app is licensed under the GPL-3.0 License. See the LICENSE file for more details.
