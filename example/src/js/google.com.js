// @include https://www.google.com/
// @include https://www.google.com/search*
function({words}) {
    const text = document.body.textContent;
    const foundWords = words.filter((word) => {
        return text.match(word);
    });
    
    console.log('Words found: ', foundWords.join(', '));
}