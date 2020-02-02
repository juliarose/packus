const path = require('path');
const fs = require('fs');

module.exports = function initialize(srcDir, templateDir) {
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
        const metaTemplate = fs.readFileSync(path.join(templateDir, 'meta.js'), 'utf8');
        
        // create the meta template file
        fs.writeFileSync(metaPath, metaTemplate, 'utf8');
    }
    
    if (!fs.existsSync(depsPath)) {
        const depsTemplate = fs.readFileSync(path.join(templateDir, 'deps.js'), 'utf8');
        
        // create the dependencies script
        fs.writeFileSync(depsPath, depsTemplate, 'utf8');
    }
};