'use strict';

function search(input){
    return () => {
        window.console.log(input.value);
    }
}

function renderSearch(){
    const searchWrapper = document.createElement('div', {
        class: 'search-wrapper'
    });
    const input = document.createElement('input', {
        class: 'search-input'
    });
    const button = document.createElement('button', {
        class: 'search-button',
        innerHTML: 'Search'
    });
    button.addEventListener('click', search(input), false);
    searchWrapper.appendChild(input);
    searchWrapper.appendChild(button);

    return searchWrapper
}

export default renderSearch;