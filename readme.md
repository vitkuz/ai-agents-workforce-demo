# Ai Agents Workforce Bear Minimum Demo

 Create chain of prompts to complete any task using chatGPT

## Getting Started

These instructions will help you get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine.
- An OpenAI API key, which can be obtained from [openai.com](https://openai.com/).

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/vitkuz/ai-agents-workforce-demo
   ```
2. Install NPM packages:
   ```sh
   npm install
   ```

3. Configure environment variables:
   ```sh
   cp .env.example .env
   ```
   Open `.env` in your favorite text editor and paste your OpenAI API key.

4. To test run the project:
   ```sh
   npm start
   ```

### Usage: 
Go to src/index.js and change initial task request, change system prompts as you wish, create chatPGT chain of prompts to complete your task
