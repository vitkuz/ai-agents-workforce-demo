const {chatGPTRequest} = require('../../utils/chatGPTRequest');
const {saveArrayToMarkdownFiles} = require('../../utils/saveArrayToMarkdownFiles');
const path = require('path');

const currentFileName = path.parse(path.basename(__filename)).name;

const useResponses = () => {
  const result = {};
  
  const setResponse = (id, response) => {
    result[id] = response;
  };
  
  return [result, setResponse];
};

const [responses, setResponse] = useResponses();

const extractIds = (input) => {
  const regex = /\/([^/]+)\//g;
  const matches = [...input.matchAll(regex)];
  return matches.map((match) => match[1]);
};

const modifyPlaceholder = (message) => {
  const ids = extractIds(message);
  let result = '';
  for (const id of ids) {
    if (responses[id]) {
      result = message.replace(`/${id}/`, responses[id]);
    }
  }
  return result;
};

const processRequest = async (id, system, message) => {
  const messageRequest = modifyPlaceholder(message);
  const messageResponse = await chatGPTRequest(system, messageRequest);
  setResponse(id, messageResponse);
  return [messageRequest, messageResponse];
};


const processRequests = async (requests) => {
  for (const request of requests) {
    await processRequest(request.id, request.system, request.message);
  }
};

const startWorkingHard = async (projectName, task, chainOfCommand) => {
  setResponse('userRequest', task);
  
  await processRequests(chainOfCommand);
  
  const save_path = path.join(__dirname, '../..', 'work', `${projectName}-result-${Date.now()}`);
  
  console.log('path:', save_path);
  
  await saveArrayToMarkdownFiles([
    responses['userRequest'],
    responses['ctoResponse'],
    responses['developerResponse'],
  ], save_path);
};

module.exports = {
  useResponses,
  extractIds,
  modifyPlaceholder,
  processRequest,
  processRequests,
  startWorkingHard,
}
