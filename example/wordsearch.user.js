// ==UserScript==
// @name        Word Search
// @description Searches for words
// @version     1
// @author      Julia
// @namespace   https://github.com/juliarose
// @run-at      document-end
// @grant       GM_addStyle
// @include     https://www.google.com/
// @include     https://www.google.com/search*
// ==/UserScript==

(function() {
    'use strict';
    
    const scripts = [
        {
            includes: [
                'https://www.google.com/',
                'https://www.google.com/search*'
            ],
            styles: `
                /* Any styles we want to define would be added here */
            `,
            fn: function({words}) {
                const text = document.body.textContent;
                const foundWords = words .filter((word) => {
                    return text.match(word);
                });
                
                console.log('Words found: ', foundWords.join(', '));
            }
        }
    ];
    
    (function() {
        const DEPS = (function() {
            // current version number of script
            const VERSION = '1';
            const words = [
                'apple',
                'banana'
            ];
            
            return {
                VERSION,
                words
            };
        }());
        const script = scripts.find(({includes}) => {
            return includes.some((pattern) => {
                return Boolean(location.href.match(pattern));
            });
        });
        
        if (script) {
            if (script.styles) {
                // add the styles
                GM_addStyle(script.styles);
            }
            
            if (script.fn) {
                // run the script
                script.fn(DEPS);
            }
        }
    }());
}());