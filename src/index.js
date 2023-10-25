const axios = require('axios');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config(); // loading .env file

const run = async (initial) => {
  const ctoResponse = await chatGPTRequest(
    'You are CTO of the company.',
    initial
  );
  
  const cfoResponse = await chatGPTRequest(
    'You are SFO of the company',
    ctoResponse
  );
  
  const contentCreatorResponse1 = await chatGPTRequest(
    'You are Content Creator Manager. Your job is to crate task for a writer',
    `
    Initial task: ${initial}
    
    Ideas from CTO of the company:
    
    ${ctoResponse}
    
    Ideas from SFO of the company:
    
    ${cfoResponse}
    `);
  
  const contentCreatorResponse2 = await chatGPTRequest(
    'You are Content Creator Manager. Your job is to crate task for a designer',
    `
    Initial task: ${initial}
    
    Ideas from CTO of the company:
    
    ${ctoResponse}
    
    Ideas from SFO of the company:
    
    ${cfoResponse}
    `);
  
  const writerResponse = await chatGPTRequest(
    'You are writer for the company. Complete given task. Write a series of short posts to complete the task',
    `Initial task: ${initial}
    
    ${contentCreatorResponse1}`);
  
  const designerResponse = await chatGPTRequest(
    'You are seasoned designer. Provide ideas for creating images for instagram, facebook and telegram. Complete given task. Answer only with prompts for image generation software like DALEE 3 or midjourney',
    `Initial task: ${initial}
    
    ${contentCreatorResponse2}`);
  
  const chatHistory = [
    initial,
    ctoResponse,
    cfoResponse,
    contentCreatorResponse1,
    contentCreatorResponse2,
    writerResponse,
    designerResponse
  ];
  
  await saveArrayToMarkdownFiles(chatHistory, path.join(__dirname, 'work', `result-${Date.now()}`));
};

run(`I need to develop new social marketing strategy in facebook, instagram and telegram to promote nutrition bars`).then(async () => {
  console.log('work is finished. check out results');
}).catch((error) => {
  console.log('Work finished with error:', JSON.stringify(error.response.data, null, 2));
});


function saveArrayToMarkdownFiles(array, projectFolder) {
  // Ensure the project folder exists
  if (!fs.existsSync(projectFolder)) {
    fs.mkdirSync(projectFolder, { recursive: true });
  }
  
  // Loop through the array and create a Markdown file for each string
  array.forEach((string, index) => {
    const fileName = `file${index + 1}.md`;
    const filePath = path.join(projectFolder, fileName);
    
    // Write the string to the Markdown file
    fs.writeFileSync(filePath, string, 'utf-8');
  });
}


async function chatGPTRequest(system, prompt) {
  try {
    const apiKey = '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'; // Replace with your actual API key
    const apiUrl = 'https://api.openai.com/v1/chat/completions'; // Replace with the API endpoint for Chat GPT
    
    if (!apiKey) {
      throw new Error('No OpenAI API key found in environment variable OPENAI_API_KEY');
    }
    
    if (!apiUrl) {
      throw new Error('No OpenAI API URL found in environment variable OPENAI_API_URL');
    }
    
    if (!system) {
      throw new Error('No system prompt defined');
    }
    
    if (!prompt) {
      throw new Error('No user prompt defined');
    }
    
    const requestData = {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', 'content': system},
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
    };
    
    const response = await axios.post(apiUrl, requestData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    });
    
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error communicating with Chat GPT API', error.message);
    console.log(process.env.OPENAI_API_KEY);
    throw error;
  }
}
