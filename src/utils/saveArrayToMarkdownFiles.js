const fs = require('fs');
const path = require('path');

function saveArrayToMarkdownFiles(array, savePath) {
  console.log(savePath);
  // Ensure the project folder exists
  if (!fs.existsSync(savePath)) {
    fs.mkdirSync(savePath, { recursive: true });
  }
  
  // Loop through the array and create a Markdown file for each string
  array.forEach((string, index) => {
    const fileName = `file${index + 1}.md`;
    const filePath = path.join(savePath, fileName);
    
    // Write the string to the Markdown file
    fs.writeFileSync(filePath, string, 'utf-8');
  });
}

module.exports = {
  saveArrayToMarkdownFiles
};
