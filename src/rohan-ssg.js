#!/usr/bin/env node

// helper functions
var helper = require('./helper.js');

// Node filesystem module
const fs = require('fs');

// Commander npm module to build CLI tool
const { Command } = require('commander');
const program = new Command();

// get version from package.json file
// - based on https://stackoverflow.com/questions/41123631/how-to-get-the-version-from-the-package-json-in-typescript
const pj = require('../package.json');
const version = pj.version;

program
  .option('-v, --version', 'current program version')
  .option('-h, --help', 'program instructions')
  .option('-i, --input <input>', 'input folder or file')
  .option('-s, --stylesheet <stylesheet>', 'stylesheet url')
  .option('-l, --lang <lang>', 'language of the input file')

program.parse();

const options = program.opts();

if (options.version){
  console.log('The name of the tool is: rohan-ssg');
  console.log(`The current version is: ${version}`);
}

if (options.help){
  console.log(
  `  This program is used to generate a static HTML web page from a given .txt file OR a folder containing .txt files.
  The following options are available: 
    -v, --version: current program version
    -h, --help: program instructions
    -i, --input: path input folder or file to be converted to HTML. Note that folders are recursively searched for .txt files.
    -s, --stylesheet: stylesheet url to be used in the HTML file
    -l, --lang: language of the input file. If not specified, the language will be set to 'en-CA' by default.
    
    The files will be saved in a '/dist' folder in the same directory as the input file/folder.

    For example, to generate a single HTML file from a .txt file with a specific stylesheet URL, use the following command:
    rohan-ssg -i .PATH/TO/FILE/input.txt -s https://example.com/stylesheet.css
    `);
}

const lang = options.lang || 'en-CA';

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
      if (options.stylesheet){
        helper.generateSite(path, lang, options.stylesheet);
      } else {
        helper.generateSite(path, lang);
      }
    }

    // if the path points to a directory (folder) generate HTML files for all .txt files in the folder (including subfolders aka recursive search)
    if (stats.isDirectory()){
      // get all files in the directory
      let fileArr = [];
      helper.recursiveFileSearch(path, fileArr);
      // generate HTML files for all .txt files in the directory
      fileArr.forEach((file) => {
        if (options.stylesheet){
          helper.generateSite(file, lang, options.stylesheet);
        } else {
          helper.generateSite(file, lang);
        }
      });
    }
  });
}



