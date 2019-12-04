# packus

packus (short for package userscript) is a command-line tool for packaging userscripts. Working on large scripts can be difficult, packus allows a way to break files down by each page. In addition JS and CSS can be stored in seperate files and global variables can be defined and passed to page scripts.

## Usage
Initialize source files in current working directory.
```packus init [src]```

src is the directory that will contain source files.

Build from source files
```packus build [src] [output]```

src is the directory containing source files.
output is the filename of the script.

## Example
For an example project, please view the files in [example](example).

## License
MIT