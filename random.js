const Random={
    int(...args) {
        switch (args.length) {
            case 0: return Random.int(Number.MIN_SAFE_INTEGER,Number.MAX_SAFE_INTEGER);
            case 1: return Math.floor(Math.random()*args[0]);
            default: {
                const [from,to]=args.sort();
                const [d,s]=[Math.abs(to-from),Math.random()];
                return Math.floor(from + s*d);
            }
        }
    },
    float(...args) {
        switch (args.length) {
            case 0: return Math.random();
            case 1: return Math.random()*args[0];
            default: {
                const [from,to]=args.sort();
                const [d,s]=[Math.abs(to-from),Math.random()];
                return from + s*d;
            }
        }
    },
    // pick(array) // pick one random element from array
    // pick(array,2) // pick an element from array between index 0 and 2 exclusive
    // pick(array,1,4) // pick an element from array between index 1 and 4 exclusive
    pick(obj,...args) {
        if (typeof obj==='undefined') return undefined;
        obj=obj instanceof [].constructor?obj
            : typeof obj ==='string' ? Array.from(obj)
            : Object.entries(obj);
        switch(args.length) {
            case 0: return obj[Random.int(obj.length)];
            default: return obj[Random.int(args)];
        }
    },
    take(array,count){
        return Array.from({length:count},()=>Random.pick(array));
    },
    shuffle(array) {
        if (array.length==0) return [];
        const result=[];
        if (array.length==1) return result;
        for (let i=0; i<array.length;i++) {
            const element=array[i];
            const destination=Random.int(result.length+1);
            result.splice(destination,0,element);
        }
        return result;
    },
    guid() {
        return crypto.randomUUID?crypto.randomUUID()
            :make();
        function make() {
            const hexString = [..."0123456789abcdef"];
            return `${chars(8)}-${chars(4)}-${chars(4)}-${chars(4)}-${chars(12)}`
            function chars(count) { return Random.take(hexString, count); }
        }
    }
};
