'use strict';
import CreateComponent from '../../createComponent';

function search(store/*, props*/) {
    const { initParams: { searchField }} = store;
    function searchCallback(input) {
        return () => {
            store.dispatch({
                type: 'FILTER_TABLE',
                payload: {
                    searchText: input.value.trim(),
                    searchField: searchField
                }
            })
        }
    }
    const input = new CreateComponent({
        store: store,
        tagName: 'input',
        domAttr: {
            className: 'input'
        }
    })

    const button = new CreateComponent({
        store: store,
        tagName: 'button',
        domAttr: {
            className: 'button',
            innerHTML: 'Search'
        },
        onClick: searchCallback(input.getElem())
    })

    const search = new CreateComponent({
        store: store,
        tagName: 'div',
        domAttr: {
            className: 'search-wrapper'
        },
        children: [
            input.getElem(),
            button.getElem()
        ]
    })

    return search.getElem();
}

export default search;