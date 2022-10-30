const fs = require('fs');
const path = require('path');
const readline = require('readline');
const textGen = require('./utils/textHandler.js');
const md = require('./utils/markdownHandler.js');
const toc = require('./utils/TOC.js');

function punctuationCheck(str){
  if (str.slice(-1) === '.' || str.slice(-1) === '!' || str.slice(-1) === '?' || str.slice(-1) === ',' || str.slice(-1) === ';' || str.slice(-1) === ':'){
    return true;
  }
  return false;
}

// function to generate HTML from .txt or .md file
function generateSite(file, lang, generatedFiles, stylesheet = ''){
  // check file extension (should only be using .txt files)
  let ext = path.extname(file);
  let fileName = path.basename(file, ext);
  if (ext !== '.txt' && ext !== '.md'){
    return
  }

  // create /dist folder if it doesn't exist, if it does exist delete the directory and all subdirectories and files
  if (fs.existsSync('dist')){
    fs.rmSync('./dist', { recursive: true });
  }
  fs.mkdirSync('dist');


  const output = './dist/' + fileName + '.html';
  const inputStream = fs.createReadStream(file);
  const outputStream = fs.createWriteStream(output);
  // if (generatedFiles !== null){
  //   generatedFiles.push(outputStream.path);
  // }
  generatedFiles.push(path.resolve(outputStream.path))
  const rl = readline.createInterface({
    input: inputStream,
    crlfDelay: Infinity
  });

  // variable to hold the body of text
  let body = '';

  // variable to temporarily hold the text block
  let text = '';

  // variable to hold "title" if it exists
  let title = '';

  // variable to keep track of number of empty lines between blocks of text
  let emptyLines = 0;

  // variable to keep track if a title has been found
  let titleFound = false;

  //variable to hold whether the file is markdown
  let fileMarkdown = false;


  rl.on('line', (line) => {
    if (ext == '.txt') {
      ({emptyLines, title, text, titleFound, body} = textGen.textHandler(emptyLines, title, text, titleFound, body, line));
    }
    else if (ext == '.md') {
      ({fileMarkdown, text, body} = md.markdownHandler(line, fileMarkdown, text, body));
    }
  });
  
  rl.on('close', () => {
    // generate HTML file

    // the below line is necessary to add the last block of text to the body
    if (ext == '.txt')
    {
      body += `
      <p>${text}</p>
      `;
    }
    let htmlHeader = '';
    if (stylesheet.length != 0){
      htmlHeader = `
        <!DOCTYPE html>
        <html lang="${lang}">
        <head>
          <link rel="stylesheet" href="${stylesheet}">
          <meta charset="utf-8">
          <title>${title}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
      `;
    } else {
      htmlHeader = `
        <!DOCTYPE html>
        <html lang="${lang}">
        <head>
          <meta charset="utf-8">
          <title>${title}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
      `;
    }

    let htmlBody = "";
    let contents = "";
    if (generatedFiles != null){
      contents = toc.generateTOC(generatedFiles);
    }

    //check if file is .txt or .md, need to generate differently for each
    if (!fileMarkdown)
    {
      if (contents != ""){
        htmlBody = `
        <body>
          ${contents}
          <h1>${title}</h1>
          ${body}
        </body>
        </html>
        `;
      } else {
        htmlBody = `
        <body>
          <h1>${title}</h1>
          ${body}
        </body>
        </html>
        `;
      }
    }
    else
    {
      if (contents != ""){
        htmlBody = `
        <body>
          ${contents}
          ${body}
        </body>
        </html>
        `;
      } else {
        htmlBody = `
        <body>
          ${body}
        </body>
        </html>
        `;
      }
    }

    outputStream.write(htmlHeader);
    outputStream.write(htmlBody);
  });
};

function recursiveFileSearch(dir, arr){
  // get all items in the directory
  let items = fs.readdirSync(dir);
  // loop through items
  items.forEach((item) => {
    // check if the current item is a directory, if it is, call the function again with the current item as the directory
    if (fs.statSync(dir + '/' + item).isDirectory()){
      recursiveFileSearch(dir + '/' + item, arr);
    }
    else {
      // if it's not a directory, add it to the array of file paths
      arr.push(dir + '/' + item);
    }
  });
};

module.exports = {
  generateSite,
  recursiveFileSearch
};
