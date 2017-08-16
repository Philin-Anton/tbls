'use strict';

import CreateComponent from '../../createComponent';


function isNode (item){
    return item instanceof Node;
}

function renderTh(store, props) {
    const tbody = new CreateComponent({
        store: store,
        tagName: 'th',
        domAttr: {
            className: 'th'
        }, 
        ...props
    })

    return tbody.getElem();
}

function renderTd(store, props) {
    const tbody = new CreateComponent({
        store: store,
        tagName: 'td',
        domAttr: {
            className: 'td'
        }, 
        ...props
    });

    return tbody.getElem();
}

function renderTr(store, props) {
    const tbody = new CreateComponent({
        store: store,
        tagName: 'tr',
        domAttr: {
            className: 'tr'
        }, 
        ...props
    })

    return tbody.getElem();
}

function renderTbody(store, props) {
    const tbody = new CreateComponent({
        store: store,
        tagName: 'tbody',
        domAttr: {
            className: 'tbody'
        },
        ...props
    })

    return tbody.getElem();
}

function renderThead(store, props) {
     const thead = new CreateComponent({
        store: store,
        tagName: 'thead',
        domAttr: {
            className: 'thead'
        },
        ...props
    });

    return thead.getElem();
}

function listen(store){
    return (event) => {
        const sort = event.target.dataset.sort;
        let predicates = event.target.dataset.predicates;
        if(typeof predicates == 'string'){
            if(JSON.parse(event.target.dataset.predicates) == true){
                predicates = false;
            }else{
                predicates = true;
            }
        } else {
            predicates = false;
        }
        store.dispatch({
            type: 'FILTER_TABLE',
            payload: {
                sortField: sort,
                predicates: predicates
            }
        });
    }
}

function listenShowEditTable(store){
    return (event)=>{
        const elem = event.target;
        if(elem.nodeName != 'TD' || isNode(store.catchEditElem)) return false;
        const id = elem.dataset.id;
        const fieldName = elem.dataset.fieldname;
        const value = elem.innerHTML;
        store.catchEditElem = event.target;

        const Input = renderInputTable(store, value, {});
        const newTd = renderTd(store, {
            domAttr: {
                className: 'td edit',
                'data-id': id,
                'data-fieldName': fieldName
            },
            children: [
                Input,
                renderButtonTable(store, 'Save', {
                    onClick: listenEditTable(store)
                }),
                renderButtonTable(store, 'Cancel', {
                    onClick: listenCancelTable(store)
                })
            ]
        });
        elem.replaceWith(newTd)
        Input.focus();
    }
}

function listenEditTable(store){
    return (event) => {
        const elem = event.target.parentNode.children[0]; //input
        const elemPrev = store.catchEditElem;
        if(isNode(elem) && isNode(elemPrev) && elem.nodeName == 'INPUT'){
            const id = elemPrev.dataset.id;
            const fieldName = elemPrev.dataset.fieldname;
            const valuePrev = elemPrev.innerHTML.trim();
            const value = elem.value.trim();
            if(value != valuePrev){
                elemPrev.innerHTML = value;
                store.dispatch({
                    type: 'EDIT_TABLE',
                    payload: {
                        id: id,
                        fieldName: fieldName,
                        value: value
                    }
                })
                event.target.parentNode.replaceWith(elemPrev);
                store.catchEditElem = null;
            }
        }
    }
}

function listenCancelTable(store){
    return (event)=>{
        const elem = event.target.parentNode;
        if(isNode(elem) && isNode(store.catchEditElem) && elem.nodeName == 'TD' ){
            elem.replaceWith(store.catchEditElem);
            store.catchEditElem = null;
        }
    }
}

function renderInputTable(store, value, props={}) {
    const input = new CreateComponent({
        store: store,
        tagName: 'input',
        domAttr: {
            type: 'text',
            className: 'table input',
            value: value
        },
        ...props
    });

    return input.getElem();
}

function renderButtonTable(store, text, props={}) {
    const button = new CreateComponent({
        store: store,
        tagName: 'button',
        domAttr: {
            type: 'text',
            className: 'table button',
            innerHTML: text
        },
        ...props
    });

    return button.getElem();
}

function renderTable(store, props={}) {
    const table = new CreateComponent({
        store: store,
        tagName: 'table',
        domAttr: {
            className: 'table'
        },
        ...props
    });

    return table.getElem();
}

function table(store, props={}) {
    const { initParams } = store;
    let tbody = renderTbody(store, props);
    let thead = renderThead(store, props);
    let table = renderTable(store, {
        children:[
            thead,
            tbody
        ]
    });

    addEventListener(`onRenderTable:${initParams.name}`, (event) => {
        const { detail: store } = event;
        const { initParams: {sequenceColumn}, response: { users, sortField, predicates }} = store;
        
        const validField = sequenceColumn.map((item)=>{
            return item.fieldName;
        });
        const newTbody = renderTbody(store, {
            onClick: listenShowEditTable(store),
            children: users.map((user)=>(
                renderTr(store, {
                    children: Object.keys(user).map((field)=>{
                        const value = user[field];
                        const isTextNode = typeof value == 'string' || typeof value == 'number';
                        if(!validField.includes(field)) return;
                        return renderTd(store, {
                            domAttr: {
                                className: 'td',
                                'data-id': user['id'],
                                'data-fieldName': field
                            },
                            children: document.createTextNode(isTextNode && String(value) || '')
                        })
                    }).filter(i=>i)
                })
            ))
        });
        const newThead = renderThead(store, {
            children: (
                renderTr(store, {
                    isEventsPushing: true,
                    onClick: listen(store),             
                    children: sequenceColumn.map(({fieldName, value})=>{
                        const isTextNode = typeof value == 'string' || typeof value == 'number';
                        if(!validField.includes(fieldName)) return;
                        const sort = fieldName == sortField && ( JSON.parse(predicates) == true && 'sort up' || 'sort down') || '';
                        return renderTh(store, {
                            domAttr: {
                                className: `th ${sort}`,
                                'data-sort': fieldName,
                                [fieldName == sortField && 'data-predicates']: predicates
                            },  
                            children: document.createTextNode(isTextNode && String(value) || '')
                        })
                    }).filter(i=>i)
                })
            )
        });
        thead.replaceWith(newThead);
        tbody.replaceWith(newTbody);
        thead = newThead;
        tbody = newTbody
    });

    return table;
}

export default table;