const fs = require('fs');
const {promisify} = require('util');
const readline = require('readline');
const {getPath} = require('./utils');
const exists = promisify(fs.exists);
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const askQuestion = (question) => {
    return new Promise((resolve) => {
        rl.question(question, resolve);
    });
};

function isYes(answer) {
    // trim an excess whitespace
    answer = answer.trim();
    
    return Boolean(
        answer === '' ||
        answer.toLowerCase() === 'y'
    );
}

// this checks that the value is set
// and if not ask to set a default value
function ensureValueIsDefined(value, question, defaultValue) {
    if (value) {
        // value is already defined, resolve
        return Promise.resolve(value);
    }
    
    // ask the question
    return askQuestion(question)
        // check if they say
        .then(isYes)
        .then((yes) => {
            if (!yes) {
                // cancel the current process
                return Promise.reject();
            }
            
            // return the value provided as the default
            return defaultValue;
        });
}

function getOutputPath(outputPath) {
    return ensureValueIsDefined(
        outputPath,
        'Filename not given. Use "script" as filename? [Y/n] ',
        'script'
    )
        .then(getPath);
}

function checkSrcDirState(srcDir) {
    const checkSrcDirExistence = (dir) => {
        const askToInitializeSrcDir = (dir) => {
            // would you like to create source files?
            const question = `Source directory ${dir} does not exist. Would you like to create it? [Y/n] `;
            
            return askQuestion(question)
                .then(isYes)
                .then((yes) => {
                    if (!yes) {
                        return Promise.reject();
                    }
                    
                    return dir;
                });
        };
        
        return exists(dir)
            .then((exists) => {
                if (!exists) {
                    return askToInitializeSrcDir(dir);
                }
                
                return dir;
            });
    };
    
    return ensureValueIsDefined(
        srcDir,
        'Source directory not given. Use "src" as directory? [Y/n] ',
        'src'
    )
        .then(getPath)
        .then(checkSrcDirExistence);
}

function checkBuildState(srcDir, outputPath) {
    return checkSrcDirState(srcDir)
        .then((dir) => {
            // set the source directory
            srcDir = dir;
            
            return srcDir;
        })
        .then(() => {
            return getOutputPath(outputPath);
        })
        .then((filePath) => {
            // set the output path
            outputPath = filePath;
            
            return outputPath;
        })
        .then(() => {
            // return finalized source directory and output path
            return {
                srcDir,
                outputPath
            };
        });
}

module.exports = {
    checkSrcDirState,
    checkBuildState
};