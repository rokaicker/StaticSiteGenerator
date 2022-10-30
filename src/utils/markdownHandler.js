const markdownHandler = (line, fileMarkdown, text, body) => {
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
  else if (line === '---'){
    body += `
    <hr>
    `;
  }
  else if (line.startsWith('> '))
  {
    //cut the '> ' out of the line
    text = line.substring(2);
    body += `
    <blockquote>${text}</blockquote>
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
  return {fileMarkdown, text, body};
}

module.exports = {
  markdownHandler: markdownHandler
};