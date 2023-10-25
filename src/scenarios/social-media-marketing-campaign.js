const path = require('path');
const dotenv = require('dotenv');
const {saveArrayToMarkdownFiles} = require('../utils/saveArrayToMarkdownFiles');
const {chatGPTRequest} = require('../utils/chatGPTRequest');

dotenv.config(); // loading .env file

const currentFileName = path.parse(path.basename(__filename)).name;

const run = async (initialUserTaskDescription) => {
  const ctoResponse = await chatGPTRequest(
    'You are CTO of the company.',
    initialUserTaskDescription
  );
  
  const cfoResponse = await chatGPTRequest(
    'You are SFO of the company',
    ctoResponse
  );
  
  const contentCreatorResponse1 = await chatGPTRequest(
    'You are Content Creator Manager. Your job is to crate task for a writer',
    `
    Initial task: ${initialUserTaskDescription}
    
    Ideas from CTO of the company:
    
    ${ctoResponse}
    
    Ideas from SFO of the company:
    
    ${cfoResponse}
    `);
  
  const contentCreatorResponse2 = await chatGPTRequest(
    'You are Content Creator Manager. Your job is to crate task for a designer',
    `
    Initial task: ${initialUserTaskDescription}
    
    Ideas from CTO of the company:
    
    ${ctoResponse}
    
    Ideas from SFO of the company:
    
    ${cfoResponse}
    `);
  
  const writerResponse = await chatGPTRequest(
    'You are writer for the company. Complete given task. Write a series of short posts to complete the task',
    `Initial task: ${initialUserTaskDescription}
    
    ${contentCreatorResponse1}`);
  
  const designerResponse = await chatGPTRequest(
    'You are seasoned designer. Provide ideas for creating images for instagram, facebook and telegram. Complete given task. Answer only with prompts for image generation software like DALEE 3 or midjourney',
    `Initial task: ${initialUserTaskDescription}
    
    ${contentCreatorResponse2}`);
  
  const chatHistory = [
    initialUserTaskDescription,
    ctoResponse,
    cfoResponse,
    contentCreatorResponse1,
    contentCreatorResponse2,
    writerResponse,
    designerResponse
  ];
  
  await saveArrayToMarkdownFiles(chatHistory, path.join(__dirname, '..', 'work', `${currentFileName}-result-${Date.now()}`));
};

run(`I need to develop new social marketing strategy in facebook, instagram and telegram to promote nutrition bars`).then(async () => {
  console.log('work is finished. check out results');
}).catch((error) => {
  console.log('Work finished with error:', error);
});


