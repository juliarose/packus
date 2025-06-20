# packus

packus (short for package userscript) is a command-line tool for packaging userscripts.

Working on large userscripts designed to run on several pages can be messy. This tool allows userscripts to be broken down to several files for each page. In addition, JavaScript and CSS can be stored in separate files. Global variables for the userscript are defined in a separate file (```deps.js```) and are passed as an argument to the function called for each page script.

Please reference the files in [example](example) to see how this works together.

## Installation
To install globally.

```
npm install -g https://github.com/juliarose/packus
```

To install in a project as a developer dependency.

```
npm install --save-dev https://github.com/juliarose/packus
```

## Usage
Initialize source files in current working directory.

```
packus init
```

Initialize source files in some other directory.

```
packus init --src='./example'
```

src is the directory that will contain source files. Defaults to current working directory if not given.

Build from source files.

```
packus build --src='./example' --output='./example/wordsearch.user.js'
```

src is the directory containing source files.
output is the filename of the script.

## Example
For an example project, please view the files in [example](example).

## License
MIT