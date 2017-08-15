function CreateComponent (props) {
    const { store, tagName, domAttr: { className, ...domProps }, children, isEventsPushing = false } = props;
    const { theme } = store.initParams;
    let elem;
    function getElem() {
        if (!elem) render();
        return elem;
    }
    function propsWith(regexp, remove=false){
        const object = {};
        Object.keys(props).forEach(function(key) {
            if (key.search(regexp) !== -1) {
                const objectKey = remove ? key.replace(regexp, '') : key;
                object[objectKey] = props[key];
            }
        }, this);
        return object;
    }
    function isNode(elem){
        return elem instanceof Node
    }
    function render() {
        if(typeof tagName != 'string') throw new Error('tagName should be string');

        elem = document.createElement(tagName, {
            ...domProps,
            class: `${theme} ${className}`
        });

        if(isNode(children)){
            elem.appendChild(children);
        }else if (Array.isArray(children)) {
            children.forEach((child)=>{
                if(isNode(child)){
                   return elem.appendChild(child);
                }
                if(typeof child == 'string'){
                    return elem.appendChild(document.createTextNode(String(child)));
                }
            })
        }

        const callbacks = propsWith(/^on/, true);

        Object.keys(callbacks).forEach((callback) => {
            elem.addEventListener(callback.toLowerCase(), props['on' + callback], isEventsPushing);
        });
    }

    function destroy(){
        elem = null;
    }
    
    this.getElem = getElem;
    this.destroy = destroy;
}

export default CreateComponent;