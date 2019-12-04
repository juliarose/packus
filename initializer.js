const path = require('path');
const fs = require('fs');

function initializer(srcDir) {
    const metaPath = path.join(srcDir, 'meta.js');
    const depsPath = path.join(srcDir, 'deps.js');
    const jsDir = path.join(srcDir, 'js');
    const cssDir = path.join(srcDir, 'css');
    
    if (!fs.existsSync(srcDir)) {
        // create the source directory
        fs.mkdirSync(srcDir);
    }
    
    if (!fs.existsSync(jsDir)) {
        fs.mkdirSync(jsDir);
    }
    
    if (!fs.existsSync(cssDir)) {
        fs.mkdirSync(cssDir);
    }
    
    if (!fs.existsSync(metaPath)) {
        const metaTemplate = fs.readFileSync(path.join(__dirname, 'templates/meta.js'), 'utf8');
        
        // create the meta template file
        fs.writeFileSync(metaPath, metaTemplate, 'utf8');
    }
    
    if (!fs.existsSync(depsPath)) {
        const depsTemplate = fs.readFileSync(path.join(__dirname, 'templates/deps.js'), 'utf8');
        
        // create the dependencies script
        fs.writeFileSync(depsPath, depsTemplate, 'utf8');
    }
}

module.exports = initializer;