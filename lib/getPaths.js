const path = require('path');

function getPath(filename) {
    const workingDirectory = process.cwd();
    const makeAbsolutePath = (filename) => {
        return path.join(workingDirectory, filename.replace(/^\.\//, ''));
    };
    
    if (path.isAbsolute(filename)) {
        return filename;
    }
    
    return makeAbsolutePath(filename);
}

module.exports = function({src, output}) {
    return {
        srcDir: path.join(getPath(src), 'src'),
        outputPath: getPath(output)
    };
};