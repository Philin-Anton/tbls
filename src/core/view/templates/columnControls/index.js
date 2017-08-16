
import CreateComponent from '../../createComponent';

function renderControlWrapper(store, props={}){
    const controlWrapper = new CreateComponent({
        isEventsPushing: true,
        store: store,
        tagName: 'div',
        domAttr: {
            className: 'control-wrapper'
        },
        ...props
    });
    return controlWrapper.getElem();
}

function renderControlCheckbox(store, domAttr={} ,props={}){
    const controlCheckbox = new CreateComponent({
        isEventsPushing: true,
        store: store,
        tagName: 'input',
        domAttr: {
            type: 'checkbox',
            className: 'control-checkbox',
            ...domAttr
        },
        ...props
    });
    return controlCheckbox.getElem();
}

function renderControlLabel(store, domAttr={}, props={}){
    const controlLabel = new CreateComponent({
        isEventsPushing: true,
        store: store,
        tagName: 'label',
        domAttr: {
            className: 'control-label',
            ...domAttr
        },
        ...props
    });
    return controlLabel.getElem();
}

function listenerCheckbox(store){
    return (event)=>{
        const {value, fieldname, index} = event.target.dataset;
        store.dispatch({
            type: 'CONTROL_COLUMN',
            payload: {
                isVisible: event.target.checked,
                index: index,
                value: value,
                fieldName: fieldname
            }
        })
    }
}

function Controls(store, props={}) {
    const { initParams: {sequenceColumn} } = store;

    return renderControlWrapper(store, {
        ...props,
        onChange: listenerCheckbox(store),
        children: sequenceColumn.map(({fieldName, value}, index)=>{
            return renderControlLabel(store, {
                id: fieldName
            }, {
                children: [
                    `${value}: `,
                    renderControlCheckbox(store, {
                        'data-index': index,
                        'data-value': value,
                        'data-fieldName': fieldName,
                        checked: true,
                        id: fieldName 
                    })
                ]
            })
        })
    })
}

export default Controls;