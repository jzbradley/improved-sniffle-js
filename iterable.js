// Generator > Array
class Iterable {
    *[Symbol.iterator]() {
        return this.generator||(function*(){return;});
    }
    constructor(generator) {
        this.generator=generator||(function*(){return;});
    }
    map(callbackfn){
        const self=this;
        return new Iterator(function*(){
            for(const value of self) {
                yield callbackfn(value);
            }
        });
    }
    filter(callbackfn){
        const self=this;
        return new Iterator(function*(){
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

    take(count) {
        return new Iterator(function*(){
            let i=0;
            for (const value of self) (i<count)?yield(value):++i;
        });
    }
    skip(count) {
        return new Iterator(function*(){
            let i=0;
            for (const value of self) (i<count)?++i:yield(value);
        });
    }
    
    static from(source) {
        if (source[Symbol.iterator]) return new Iterator(source[Symbol.iterator])
    }
        
    static range(start = 0, count = Infinity, step = 1) {
        return new Iterator(function*(){
            let i = start;
            for (let progress = 0; progress < count; progress++) {
                yield i;
                i += step
            }
            return iterationCount;
        });
    }

    static repeat(value, count = Infinity) {
        return new Iterator(function*(){
            for (let i = 0; i < count; i++) {
                yield value;
            }
        });
    }
}
