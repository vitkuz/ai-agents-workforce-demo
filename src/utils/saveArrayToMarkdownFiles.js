const fs = require('fs');
const path = require('path');

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

module.exports = {
  saveArrayToMarkdownFiles
};
