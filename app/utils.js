const path = require('path');

function getPath(filename) {
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
}

module.exports = {
    getPath
};