const path = require('path');
const getPath = (filename) => {
    const workingDirectory = process.cwd();
    const makeAbsolutePath = (filename) => {
        return path.join(workingDirectory, filename.replace(/^\.\//, ''));
    };
    const isAbsolutePath = /^[\/\\]/.test(filename);
    
    if (isAbsolutePath) {
        // path is already absolute
        return filename;
    }
    
    return makeAbsolutePath(filename);
};

module.exports = function({src, output}) {
    return {
        srcDir: getPath(src).replace(/\/$/, '') + '/src',
        outputPath: getPath(output)
    };
};