#!/usr/bin/env node

// helper functions
var helper = require('./helper.js');

// Node filesystem module
const fs = require('fs');

const { Command } = require('commander');
const program = new Command();

// get version from package.json file
// - based on https://stackoverflow.com/questions/41123631/how-to-get-the-version-from-the-package-json-in-typescript
const pj = require('./package.json');
const version = pj.version;

program
  .option('-v, --version', 'current program version')
  .option('-h, --help', 'program instructions')
  .option('-i, --input <input>', 'input folder or file');

program.parse();

const options = program.opts();

if (options.version){
  console.log(`The current version is: ${version}`);
}

if (options.help){
  console.log(`Instructions: `);
}

if (options.input){
  // get path passed to program
  const path = options.input;
  // check if path is a file or a folder
  // - based on https://stackoverflow.com/questions/15630770/node-js-check-if-path-is-file-or-directory
  fs.lstat(path, (err, stats) => {
    if (err){
      return console.log(err);
    }

    // if the path points to a file
    if (stats.isFile()){
      // generate HTML file
      helper.generateSite(path);
    }

    // if the path points to a directory (folder)
    if (stats.isDirectory()){

    }
  });
}

//

