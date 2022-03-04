// like switch but fluent

function match(value) {
    const private={
        result:undefined,
        resolved:false
    }
    function resolve(result) {
        private.result=result;
        private.resolved=true;
    }
    return new (class {
        get resolved(){return private.resolved;}
        get result(){return private.result;}
        when(predicate,callback) {
            if (private.resolved) return this;
    
            if (predicate(value)) resolve(callback(value));
            return this;
        }
        regex(pattern,callback) {
            return this.when(value=>(RegExp(pattern).test(value)),callback);
        }
        undefined(callback) {
            return this.when(value=>(typeof value=="undefined"),callback);
        }
        null(callback) {
            return this.when(value=>(value==null),callback);
        }
        exact(exactValue,callback) {
            return this.when(value=>(value===exactValue),callback);
        }
        true(callback) {
            return this.when(value=>(!!value),callback);
        }
        false(callback) {
            return this.when(value=>(!value),callback);
        }
        type(type,callback) {
            if (private.resolved) return this;

            switch (typeof type) {
                case 'object':
                case 'function':
                    if (value instanceof type) {
                        resolve(callback(value));
                        return this;
                    }
                    type=type.constructor.name;
                    break;
                case 'string':
                    if (typeof value == type) resolve(callback(value));
                    break;
                default: throw new Error("Invalid type");
            }
            
            return this;
        }
        default(callback) {
            if (private.resolved) return this;

            resolve(callback(value));
            return this;
        }
        startsWith(string,callback) {
            return this.when(value=>(String(value).startsWith(string)),callback);
        }
        endsWith(string,callback) {
            return this.when(value=>(String(value).endsWith(string)),callback);
        }
    })();
}
