# Static Site Generator - rohan-ssg.js
## Overview
This tool enables the user to:

  1. Specify a ".txt" or ".md" file to have it converted into an HTML webpage
  2. Specify a folder containing multiple ".txt" and ".md" files to convert all of them into HTML web pages. The program will recursively search subfolders for ".txt" files as well. 

NOTE: This tool requires the use of a BASH shell.


## Installation
To install this program, first `git clone` the repository. 

Then open a terminal inside of the newly created folder, and run `npm install` to install the node dependencies.

Then, in the same folder run `npm install -g` to globally install the command line tool. 

This command will install the programming globally on your system.


## Options

There are four options available to the user to use with this CLI program. 

| Short Form | Long Form    | Description                                                                                        |
|------------|--------------|----------------------------------------------------------------------------------------------------|
| -v         | --version    | Outputs the current version of the program.                                                        |
| -h         | --help       | Outputs a help message explaining the program's usage.                                             |
| -i         | --input      | Allows the user to specify either a single .txt file, or a folder containing .txt files.           |
| -s         | --stylesheet | Allows the user to specify a URL containing a CSS stylesheet to apply to the generated HTML files. |

## Usage

### Current Version

To check the current version of the program, the user can run:

`rohan-ssg -v` or `rohan-ssg --version`

Which will output:

`The current version is: x.x.x`

### Help
To see a message explaining the program, the user can run:

`rohan-ssg -h` or `rohan-ssg --help`

Which will output:
```
This program is used to generate a static HTML web page from a given .txt file OR a folder containing .txt files.
The following options are available: 
    -v, --version: current program version
    -h, --help: program instructions
    -i, --input: path input folder or file to be converted to HTML. Note that folders are recursively searched for .txt and .md files.
    -s, --stylesheet: stylesheet url to be used in the HTML file
    
    The files will be saved in a '/dist' folder in the same directory as the input file/folder.

    For example, to generate a single HTML file from a .txt file with a specific stylesheet URL, use the following command:
    rohan-ssg -i .PATH/TO/FILE/input.txt -s https://example.com/stylesheet.css
```

### Input (with and without stylesheet)

For a specific file, the user can run:

`rohan-ssg -i PATH/TO/FILE/example.txt` or `rohan-ssg --input PATH/TO/FILE/example.txt` or `rohan-ssg --input PATH/TO/FILE/example.md`

This will then generate a `/dist` directory, containing the HTML file that had been generated.

For a folder:

`rohan-ssg -i PATH/TO/FOLDER` or `rohan-ssg --input PATH/TO/FOLDER`

Similar to above, this will also generate a `/dist` directory, which will contain all of the HTML files that had been generated from all of the .txt and .md files inside of the specified folder (including subfolders). 

To specify a stylesheet to be applied to all HTML files, the user can choose to use the `-s` or `--stylesheet` option as follows:

`rohan-ssg -i PATH/TO/FOLDER -s https://example.com/stylesheet.css` or `rohan-ssg -i PATH/TO/FILE/example.txt -s https://example.com/stylesheet.css`

This will link the specified stylesheet (which must be a url) to all HTML files that have been generated. 




