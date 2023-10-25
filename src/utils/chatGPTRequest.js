const axios = require('axios');

async function chatGPTRequest(system, prompt) {
  try {
    const apiKey = process.env.OPEN_API_KEY; // Replace with your actual API key https://platform.openai.com/account/api-keys
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
    
    console.log(`------------------`);
    console.log('System message:',system);
    console.log('Prompt:',prompt);
    console.log('Response:',response.data.choices[0].message.content);
    
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error communicating with Chat GPT API', error.message);
    throw error;
  }
}

module.exports = {
  chatGPTRequest
}
