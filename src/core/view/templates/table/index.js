'use strict';

import CreateComponent from '../../createComponent';

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
    return (event)=>{
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
        })
    }
}

function renderTable(store, props) {
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
        
        const validField = Object.keys(sequenceColumn);
        const newTbody = renderTbody(store, {
            children: users.map((user)=>(
                renderTr(store, {
                    children: Object.keys(user).map((field)=>{
                        const value = user[field];
                        const isTextNode = typeof value == 'string' || typeof value == 'number';
                        if(!validField.includes(field)) return;
                        return renderTd(store, {
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
                    children: validField.map((field)=>{
                        const value = sequenceColumn[field];
                        const isTextNode = typeof value == 'string' || typeof value == 'number';
                        if(!validField.includes(field)) return;
                        const sort = field == sortField && ( predicates == 'true' && 'sort up' || 'sort down') || '';
                        return renderTh(store, {
                            domAttr: {
                                className: `th ${sort}`,
                                'data-sort': field,
                                [field == sortField && 'data-predicates']: predicates
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