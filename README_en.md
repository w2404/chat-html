# HTML App for OpenAI's GPT Model API

This HTML app is designed to connect to OpenAI's GPT model API and generate text based on the user's input. The app is built using HTML, CSS, JavaScript, and Vue.js and can be accessed through any web browser.

## Requirements

To use this app, you will need:

- An internet connection
- A web browser

## Setup

To set up this app, follow these steps:

1. Clone the repository to your local machine.
2. Open the `index.html` file in your web browser.
3. Enter your OpenAI API key in the designated field.
4. Enter your text prompt in the text field.
5. Click the "Generate Text" button to generate text based on the prompt.

## Features

This app has the following features:

- Ability to connect to OpenAI's GPT model API.
- User input field for text prompt.
- Button to generate text based on the user's input.
- Output field to display the generated text.
- Ability to save conversations as JSON.
- Ability to load previously saved conversations from JSON.
- Automatic removal of earliest conversation when length exceeds 3000 tokens.
- Specialized for poor network conditions:
  - Ability to interrupt a request that is taking too long to complete.
  - Ability to retry a failed request.
  - Ability to cancel a request.

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
