class Iterable {
    #iterator;
    [Symbol.iterator]() {
        return this.#iterator;
    }
    constructor(source) {
        if(source[Symbol.iterator]){
            this.#iterator=source[Symbol.iterator]();
            return this;
        }
        if(typeof(source)==="function") {
            return new Iterable(source());
        }
    }
    map(callbackfn){
        const self=this;
        return new Iterable(function*(){
            for(const value of self) {
                yield callbackfn(value);
            }
        });
    }
    filter(callbackfn){
        const self=this;
        return new Iterable(function*(){
            for(const value of self) {
                if (callbackfn(value)) yield value;
            }
        });
    }
    reduce(callbackfn,initalvalue){
        let lastValue=initalvalue;
        for(const value of this) {
            lastValue=callbackfn(lastValue,value);
        }
        return lastValue;
    }

    toArray(limit=Infinity) {
        const result=[];
        if (limit<1) return result;
        let count=0;
        for(const value of this) {
            result.push(value);
            count++;
            if (count >=limit) return result;
        }
        return result;
    }

    join(separator=',') {
        return this.toArray().join(separator);
    }

    first(predicate) {
        return this.filter(predicate).take(1).toArray()[0];
    }
    take(count) {
        return new Iterable(function*(){
            let i=0;
            for (const value of self) (i<count)?yield(value):++i;
        });
    }
    skip(count) {
        return new Iterable(function*(){
            let i=0;
            for (const value of self) (i<count)?++i:yield(value);
        });
    }
    
    static from(source) {
        if (source[Symbol.iterator]) return new Iterable(source);
    }
        
    static range(start = 0, count = Infinity, step = 1) {
        return new Iterable(function*(){
            let i = start;
            for (let progress = 0; progress < count; progress++) {
                yield i;
                i += step
            }
            return iterationCount;
        });
    }

    static repeat(value, count = Infinity) {
        return new Iterable(function*(){
            for (let i = 0; i < count; i++) {
                yield value;
            }
        });
    }

    static query(dom=document) {
        return new class DomQuery {
            all(selector) {
                if (typeof selector == 'function') return new Iterable(dom.querySelectorAll('*')).filter(selector);
                return new Iterable(dom.querySelectorAll(selector||'*'));
            }
            one(selector) {
                if (typeof selector == 'function') return new Iterable(dom.querySelectorAll('*')).first(selector);
                return dom.querySelector(selector||'*');
            }
        };
    }
}
