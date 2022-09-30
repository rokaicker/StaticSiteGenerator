const fs = require('fs');
const path = require('path');
const readline = require('readline');

function punctuationCheck(str){
  if (str.slice(-1) === '.' || str.slice(-1) === '!' || str.slice(-1) === '?' || str.slice(-1) === ',' || str.slice(-1) === ';' || str.slice(-1) === ':'){
    return true;
  }
  return false;
}

// function to generate HTML from .txt or .md file
function generateSite(file, stylesheet = '') {
  // check file extension (should only be using .txt files)
  let ext = path.extname(file);
  let fileName = path.basename(file, ext);
  if (ext !== '.txt' && ext !== '.md'){
    return
  }
  // create /dist folder if it doesn't exist
  if (!fs.existsSync('./dist')){
    fs.mkdirSync('./dist');
  } else {
    // if it does exist, delete all files in it (folder must be empty on each run)
    fs.readdirSync('./dist').forEach((file) => {
      fs.unlinkSync(`./dist/${file}`);
    });
  }

  const output = './dist/' + fileName + '.html';
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

  // variable to keep track if a title has been found
  let titleFound = false;

  //variable to hold whether the file is markdown
  let fileMarkdown = false;


  rl.on('line', (line) => {
    if (ext == '.txt') {
      if (line.length === 0){
        emptyLines++;
      }
      else {
        if (emptyLines === 2 && !titleFound){
          title = text;
          titleFound = true;
          text = line;
          emptyLines = 0;
        }
        else if (emptyLines > 0 && titleFound){
          body += `
          <p>${text}</p>
          `;
          text = (line + ' ');
          emptyLines = 0;
        } 
        else {
          text += (line + ' ');
        }
    }
  }
    else if (ext == '.md') {
      //check if the line is a heading 1
      fileMarkdown = true;
      if (line.startsWith('# '))
      {
        //cut the '# ' out of the line
        text = line.substring(2);
        body += `
        <h1>${text}</h1>
        `;
      }
      else if (line.startsWith('## '))
      {
        //cut the '## ' out of the line
        text = line.substring(3);
        body += `
        <h2>${text}</h2>
        `;
      }
      else if (line != "")
      {
        //convert markdown link to href 
        line = line.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
        //convert markdown bold ** to html <b> element
        line = line.replace(/\*\*(.*)\*\*/g, '<b>$1</b>');
        //convert markdown bold __ to html <b> element
        line = line.replace(/__(.*)__/g, '<b>$1</b>');
        //convert markdown italics * to html <i> element
        line = line.replace(/\*(.*)\*/g, '<i>$1</i>');
        //convert markdown italics _ to html <i> element
        line = line.replace(/_(.*)_/g, '<i>$1</i>');
        //convert markdown code ` to html <code> element
        line = line.replace(/`(.*?)`/g, '<code>$1</code>');
        
        body += `
        <p>${line}</p>
        `;
      }
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
        <html lang="en">
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
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <title>${title}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
      `;
    }

    let htmlBody = "";

    //check if file is .txt or .md, need to generate differently for each
    if (!fileMarkdown)
    {
      htmlBody = `
      <body>
        <h1>${title}</h1>
        ${body}
      </body>
      </html>
      `;
    }
    else
    {
      htmlBody = `
      <body>
        ${body}
      </body>
      </html>
      `;
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
