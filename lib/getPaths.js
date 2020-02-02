const path = require('path');
const getPath = (filename) => {
    const workingDirectory = process.cwd();
    const makeAbsolutePath = (filename) => {
        return path.join(workingDirectory, filename);
    };
    const isAbsolutePath = /^[\/\\]/.test(filename);
    
    if (isAbsolutePath) {
        // path is already absolute
        return filename;
    }
    
    return makeAbsolutePath(filename);
};

module.exports = function(srcDir = 'src', outputPath = 'script') {
    srcDir = getPath(srcDir);
    outputPath = getPath(outputPath);
    
    return {
        srcDir,
        outputPath
    };
};