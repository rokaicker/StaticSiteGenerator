function textHandler(emptyLines, title, text, titleFound, body, line){
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
  return {emptyLines, title, text, titleFound, body};
}

module.exports = {
  textHandler
};