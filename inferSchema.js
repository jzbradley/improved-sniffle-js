function inferSchema(obj) {
    if (obj instanceof Document) return inferXmlSchema(obj);
    else throw new TypeError("non-xml objects not supported")
}

function inferXmlSchema(node) {
    const schema={};

    for (const element of node.childNodes) {
        const {nodeName}=element;
        if (nodeName=="#comment") continue;
        // ignore text whitespace
        if (nodeName=="#text") {
            if (element.nodeValue.match(/^\s*$/)) continue;
            if (schema[nodeName]) continue;
            schema[nodeName]={};
        }
        const info={
            attributes:element.attributes?Object.entries(element.attributes).map(attr=>attr[1].name):[],
            descendents:inferXmlSchema(element)
        };
        if (schema[nodeName]) {
            deepmerge(schema[nodeName],info);
            continue;
        }
        schema[nodeName]=info;
    }
    return schema;
    
    function deepmerge() {
        merge = function () {
            let [target] = arguments;
            for (let i = 1; i < arguments.length ; i++) {
                let arr = arguments[i];
                for (let k in arr) {
                    if (Array.isArray(arr[k])) {
                        if (target[k] === undefined) {            
                            target[k] = [];
                        }            
                        target[k] = [...new Set(target[k].concat(...arr[k]))];
                    } else if (typeof arr[k] === 'object') {
                        if (target[k] === undefined) {            
                            target[k] = {};
                        }
                        target[k] = merge(target[k], arr[k]);
                    } else {
                        target[k] = arr[k];         
                    }
                }
            }
            return target;
        }
        return merge(...arguments);
    }
}
