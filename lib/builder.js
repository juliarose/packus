const fs = require('fs');
const path = require('path');

// helper functions
// gets n number of tabs
function getTabs(count, tab = '    ') {
    return Array(count).fill(tab).join('');
}

// strings together an array of code so that it looks nice
function writeScript(arr, depth = 0, tab = '    ') {
    // write an item in the array
    const writeItem = (item) => {
        if (Array.isArray(item)) {
            // yes, this is an array
            // that means we can recurse the arr
            // while increasing the depth
            return writeScript(item, depth + 1, tab);
        }
        
        return getTabs(depth, tab) + item;
    };
    
    return arr
        // remove empty values
        .filter(Boolean)
        .map(writeItem)
        .join('\n');
}

// indents a block of code by 'depth' of levels
function indentBlock(str, depth, tab = '    ') {
    return str.replace(/^/gm, getTabs(depth, tab));
}

// encloses code in an IIFE
function encloseInIIFE(code, depth = 1, tab = '    ') {
    return [
        '(function() {',
        // increase indentation of string
        indentBlock(code, depth, tab),
        '}());'
    ].join('\n');
}

function includeVersion(deps, meta, tab = '    ') {
    // get the version number from a meta block
    const getVersionFromMeta = (metaStr) => {
        const pattern = /^\/\/\s*@version\s*(\d[\.\d]*)/m;
        const match = metaStr.match(pattern);
        
        return match ? match[1] : '';
    };
    const version = getVersionFromMeta(meta);
    const versionStr = `// current version number of script\nconst VERSION = \'${version}\';\n`;
    const replaced = (function() {
        const lines = deps.split('\n').reverse();
        let index = -1;
        // find last return statement
        let line = lines.find((line, i) => {
            if (/^return .*/.test(line)) {
                index = i;
                return line;
            }
        });
        
        // no return statement found
        if (index === -1) {
            return deps;
        }
        
        const reLastReturnStatement = /return\s*\{(?!.*return\s*\{)/g;
        const reEmptyLastReturnStatement = /return\s*\{[\s\t\n]*\}(?!.*return\s*\{[\s\t\n]*\})/g;
        const returnStatementWithVersion = 'return {\n' + getTabs(1, tab) + 'VERSION';
        const isEmptyReturnStatement = reEmptyLastReturnStatement.test(line);
        const rePattern = (
            isEmptyReturnStatement ?
                reEmptyLastReturnStatement :
                reLastReturnStatement
        );
        const versionInsertEnd = (
            isEmptyReturnStatement ?
                // adds a newline
                '\n}' :
                // adds a comma
                ','
        );
        
        line = line.replace(rePattern, returnStatementWithVersion + versionInsertEnd);
        // replace the line with the modified one
        lines[index] = line;
        
        // re-reverse the lines and join them together
        return lines.reverse().join('\n');
    }());
    
    return versionStr + replaced;
}

function detectTab(code) {
    // split the code by each line
    const lines = code.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const match = line.match(/^[\s+\t]+/);
        
        if (match) {
            // we found the tab style
            return match[0];
        }
    }
    
    // default 4 spaces
    return '    ';
}

function collectScripts(dirName) {
    const jsDirName = path.join(dirName, 'js');
    const cssDirName = path.join(dirName, 'css');
    const isJavascriptFile = (filename) => {
        return /\.js$/.test(filename);
    };
    const getScript = (script) => {
        const getJS = (script) => {
            const includes = [];
            const reIncludes = /^\/\/\s*@include\s*(.*)$/;
            const reFunction = /^(async )?(function|\(.*\) =>)/;
            // split the lines so we can read line-by-line
            const lines = script.split('\n');
            let fn;
            
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                const matchReIncludes = line.match(reIncludes);
                const isFunctionLine = reFunction.test(line);
                
                if (matchReIncludes) {
                    // add the pattern
                    includes.push(matchReIncludes[1]);
                }
                
                if (isFunctionLine) {
                    // trim off previous lines so the code starts at the first function definition
                    fn = lines.slice(i).join('\n');
                    // stop
                    break;
                }
            }
            
            return {
                fn,
                includes
            };
        };
        // the path of the javascript file
        const jsPath = path.join(jsDirName, script);
        // the path of the css file
        const cssPath = path.join(cssDirName, script.replace(/\.js$/, '.css'));
        // the script has css
        const hasStyles = fs.existsSync(cssPath);
        // get the css
        const css = hasStyles ? fs.readFileSync(cssPath, 'utf8') : null;
        const {
            fn,
            includes
        } = getJS(fs.readFileSync(jsPath, 'utf8'));
        
        return {
            fn,
            css,
            includes
        };
    };
    const isUserScript = ({includes}) => {
        return Boolean(
            includes.length > 0
        );
    };
    const scriptPaths = fs.readdirSync(jsDirName);
    
    // collected userscripts
    return scriptPaths
        .filter(isJavascriptFile)
        .map(getScript)
        .filter(isUserScript);
}

module.exports = function builder(srcDirectory) {
    const meta = fs.readFileSync(path.join(srcDirectory, 'meta.js'), 'utf8');
    const deps = fs.readFileSync(path.join(srcDirectory, 'deps.js'), 'utf8');
    const scripts = collectScripts(srcDirectory);
    const code = scripts
        // get the function from the script
        .map(({fn}) => fn)
        // filter out blank functions
        .filter(Boolean)
        // join the code together
        .join('\n');
    // detect the tab style from the code
    const tab = detectTab([
        code,
        deps
    ].join('\n'));
    const metaStr = (function() {
        const includesStr = scripts.map(({includes}) => {
            return includes.map((include) => {
                return '// ' + '@include'.padEnd(13, ' ') + include;
            }).join('\n');
        }).filter(Boolean).join('\n');
        const grantsGM_addStyle = /\@grant\s*GM_addStyle/.test(meta);
        const reEndUserscript = /^\/\/\s*==\/UserScript==/m;
        const endStr = '\n// ==/UserScript==';
        let str = meta;
        
        if (!grantsGM_addStyle) {
            // add the grant
            const GM_addStyleStr = '// ' + '@grant'.padEnd(13, ' ') + 'GM_addStyle';
            
            str = str.replace(reEndUserscript, GM_addStyleStr + endStr);
        }
        
        if (includesStr.length > 0) {
            // add the includes
            str = str.replace(reEndUserscript, includesStr + endStr);
        }
        
        return str;
    }());
    const scriptsStr = (function() {
        const scriptsArrStr = scripts.map(({css, fn, includes}) => {
            const depth = 1;
            const cssStr = (
                css &&
                indentBlock(css, depth + 2, tab)
            );
            const cssLine = (
                cssStr &&
                'styles: `\n' + cssStr + '\n' + getTabs(depth + 1, tab) + '`,'
            );
            const fnStr = indentBlock(fn, depth + 1, tab).replace(/^[\s\t]*/, '');
            const includesStr = includes.map((include) => {
                const isRegExp = /^\//.test(include);
                
                if (isRegExp) {
                    // adds a comma to the end of the line
                    return include;
                }
                
                return `'${include}'`;
            }).join(',\n' + getTabs(depth + 2, tab));
            const details = [
                '{',
                [
                    'includes: [',
                    [
                        includesStr
                    ],
                    '],',
                    cssLine,
                    `fn: ${fnStr}`,
                ],
                '}'
            ];
            
            return writeScript(details, depth, tab);
        }).join(',\n');
        const depsScript = includeVersion(deps, meta, tab);
        const runScriptStr = writeScript([
            '// These are shared between page scripts.',
            // add the version number to the top
            'const DEPS = ' + encloseInIIFE(depsScript),
            'const script = scripts.find(({includes}) => {',
            [
                'return includes.some((pattern) => {',
                [
                    'return Boolean(window.location.href.match(pattern));'
                ],
                '});'
            ],
            '});\n',
            'if (script) {',
            [
                'if (script.styles) {',
                [
                    '// add the styles',
                    'GM_addStyle(script.styles);'
                ],
                '}\n' + getTabs(1, tab),
                'if (script.fn) {',
                [
                    '// run the script',
                    'script.fn(DEPS);'
                ],
                '}'
            ],
            '}'
        ], 0, tab);
        const str = writeScript([
            `const scripts = [\n${scriptsArrStr}\n];\n`,
            runScriptStr
        ], 0, tab);
        
        return str;
    }());
    const outputStr = [
        metaStr,
        scriptsStr
    ].join('\n\n');
    
    return {
        script: outputStr,
        meta: metaStr
    };
}
