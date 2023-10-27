const dotenv = require('dotenv');
const {startWorkingHard} = require('./utils');
dotenv.config(); // loading .env file

const chainOfCommand = [
  {
    id: 'ctoResponse',
    system: 'You are CTO of the company. Provide short concise plan for developers to implement given task',
    message: '/userRequest/'
  },
  {
    id: 'developerResponse',
    system: `Act as experienced fullstack javascript developer.
      Write js code in functional style only.
      Don't use classes.
      Use currying functions as much as possible.
      You can use popular npm packages like lodash/fp, ramda, axios, uuid, express, react, xstate, query and others to accomplish the task.
      Respond only with blocks of code. You have to follow best practices around developing topic.`,
    message: `
      Provide code for the following task: /userRequest/
      
      Take into account following requirements and ideas:
      
      /ctoResponse/
      `
  }
];

const projectName = 'develop-software';
const task = `create examples for explaining to junior developer xstate library and how it can be used with react and react query`;

startWorkingHard(
  projectName,
  task,
  chainOfCommand)
  .then(() => {
    console.log(`Work finished successfully`);
  })
  .catch((error) => {
    console.log('Work finished with error:', error);
  });


