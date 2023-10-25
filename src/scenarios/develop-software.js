const path = require('path');
const dotenv = require('dotenv');
const {saveArrayToMarkdownFiles} = require('../utils/saveArrayToMarkdownFiles');
const {chatGPTRequest} = require('../utils/chatGPTRequest');

dotenv.config(); // loading .env file

const currentFileName = path.parse(path.basename(__filename)).name;

const run = async (initialUserTaskDescription) => {
  const ctoResponse = await chatGPTRequest(
    'You are CTO of the company. Provide short concise plan for developers to implement',
    initialUserTaskDescription
  );
  
  const developerResponse = await chatGPTRequest(
    `Act as experienced fullstack javascript developer.
    Write js code in functional style only.
    Don't use classes.
    You can use popular npm packages like lodash/fp, ramda, axios, uuid, express, react, xstate, query and others to accomplish the task.
    Respond only with blocks of code. You have to follow best practices around developing topic.`,
    `
    Provide code for the following task: ${initialUserTaskDescription}
    
    Take into account following requirements and ideas:
    
    ${ctoResponse}
    `);
  
  const chatHistory = [
    initialUserTaskDescription,
    ctoResponse,
    developerResponse,
  ];
  
  await saveArrayToMarkdownFiles(chatHistory, path.join(__dirname, '..', 'work', `${currentFileName}-result-${Date.now()}`));
};

run(`Implement flappy bird clone`).then(async () => {
  console.log('work is finished. check out results');
}).catch((error) => {
  console.log('Work finished with error:', error);
});


