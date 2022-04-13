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
    pick(obj,...args) {
        if (typeof obj==='undefined') return undefined;
        obj=obj instanceof [].constructor?obj
            : Object.entries(obj);
        switch(args.length) {
            case 0: return obj[Random.int(obj.length)];
            default: return obj[Random.int(args)];
        }
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
    }
};
