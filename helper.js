const fs = require('fs');
const path = require('path');
const readline = require('readline');

// function to generate HTML from .txt file
module.exports.generateSite = (file) => {
  // check file extension (should only be using .txt files)
  let ext = path.extname(file);
  let fileName = path.basename(file, ext);
  if (ext !== '.txt'){
    return
  }

  const output = fileName + '.html';
  const inputStream = fs.createReadStream(file);
  const outputStream = fs.createWriteStream(output);
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

  // read each line of the file
  rl.on('line', (line) => {
    if (line.length === 0){
      emptyLines++;
    }
    else {
      if (emptyLines === 2){
        title = text;
        text = line;
      }
      else if (emptyLines === 1){
        body += `<p>${text}</p>`;
        text = line;
      } 
      else {
        text += line;
      }
    }
  });

  // generate HTML file
  const htmlHeader = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <title>${title}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  `
  const htmlBody = `
  <body>
    ${body}
  </body>
  </html>
  `
  rl.on('close', () => {
    outputStream.write(htmlHeader);
    outputStream.write(htmlBody);
  });
}