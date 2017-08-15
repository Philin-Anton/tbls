'use strict';

import CreateComponent from '../../createComponent';
//import EventDispatcher from '../../../events/EventDispatcher';
function listenerParination(store){
    return (evet)=>{
        store.dispatch({
            type: 'FILTER_TABLE',
            payload:{
                currentPage: +evet.target.innerText || 0
            }
        })
    }
}
function renderButton(store, domAttr={}, props={}){
    const button = new CreateComponent({
        isEventsPushing: true,
        store: store,
        tagName: 'button',
        domAttr: {
            className: 'parination-button',
            ...domAttr
        },
        ...props
    });
    return button.getElem();
}

function renderParinationWrapper(store, props={}){
    const parinationWrapper = new CreateComponent({
        isEventsPushing: true,
        store: store,
        tagName: 'div',
        domAttr: {
            className: 'parination-wrapper'
        },
        ...props
    });
    return parinationWrapper.getElem();
}

function Parination(store, props={}) {
    const { initParams } = store;
    let parination = renderParinationWrapper(store, {
        onClick: listenerParination(store),
        ...props
    })

    addEventListener(`onRenderPagination:${initParams.name}`, (event) => {
        const {detail: store } = event;
        const { response: { currentPage, amountPages }} = store;

        const newParination = renderParinationWrapper(store, {
            onClick: listenerParination(store),
            children: Array.from({length: amountPages}, (v, i)=>i).map((index)=>{
                return renderButton(store, {
                    innerHTML: index,
                    className: `parination-button ${index == currentPage && 'active' || ''}`
                })
            }),
            ...props
        })
        parination.replaceWith(newParination);
        parination = newParination;
    });

    return parination;
}

export default Parination;