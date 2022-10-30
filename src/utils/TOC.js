const path = require('path');

const generateTOC = (arr) => {
  let toc = '<h1>Table of Contents</h1><ol>';
  arr.forEach((file) => {
    let fileName = path.basename(file, path.extname(file));
    toc += `<li><a href="${file}">${fileName}</a></li>`;
  });
  toc += '</ol>';
  return toc;
}

module.exports = {
  generateTOC
}
