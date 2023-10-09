/**
 * An array-like dynamic data structure which pre-allocates space
 * in order to reduce the number of array re-allocations.
 */
class List {
  #length=0;
  #array;
  #version=0;
  #changed() {
    ++this.#version;
  }
  ensureCapacity(minLength) {
    if (minLength <= this.#length) return;
    this.#array.length *= 2;
    this.#changed();
  }
  get capacity() { return this.#array.length; }

  get version() { return this.#version; }
  get length() { return this.#length; }
  set length(value) {
    if (value<0) throw new RangeError('parameter value out of range: `length` cannot be negative');
    
    this.#changed();
    if (value===0) {
      this.#array=Array.from({length:capacity||0});
      this.#length=0;
      return;
    }
    this.#array.length=value;
    this.#length=value;
  }
  AsIterable() {
    const Iterable=('Iterable' in globalThis?globalThis.Iterable:class Iterable {
      #source;
      #tagName;
      get [Symbol.toStringTag]() { return this.#tagName; }
      get [Symbol.iterator]() {
        return this.#source[Symbol.iterator];
      }
      constructor(source) {
        this.#source=source;
        let tag;
        try {tag=Object.getPrototypeOf(source).constructor.name} catch {}
        this.#tagName=`[${tag||"Object"} Iterable]`;
      }
    });
    return new Iterable(this);
  }
  get [Symbol.iterator]() {
    const owner=this;
    return (function values(){
      const generator=(function *Generator() {
        const version=owner.version;
        for(let i=0; i<owner.length; ++i) {
          yield owner.get(i);
          if (version!==owner.version) throw new Error("List state changed during iteration.");
        }
      })();
      
      return new (class ListIterator {
        get [Symbol.toStringTag]() { return "List Iterator"; }
        next() { return generator.next(); }
      })
    });
  }
  constructor(capacity=4) {
    this.#array=Array.from({length:capacity||0});
    const self=this;
    return new Proxy(this,{
      get(_, p, _) {
        const index=Number(p);
        if (Object.is(index,NaN)) return self[p];
        return self.get(index);
      },
      set(_, p, newValue, _) {
        const index=Number(p);
        if (Object.is(index,NaN)) {
          self[p]=newValue;
          return;
        }
        return self.set(index, newValue);
      }
    });
  }
  get(index) {
    if (index<0|| index>=target.length) throw new RangeError("index out of range");
    return this.#array[index];
  }
  set(index,newValue) {
    if (index<0|| index>=target.length) throw new RangeError("index out of range");
    this.#changed();
    this.#array[index]=newValue;
  }
  push(...items) {
    if (items.length===0) return;
    this.#changed();
    this.ensureCapacity(this.#length+items.length);
    for(let i=0;i<items.length;i++)
      this.#array[i]=items[i];
    this.#length+=items.length;
  }
  slice(start=0, end=-1, destination=undefined) {
    [start,end,span]=List.#validateRange(this.#length,start,end);
    if (span===0) return destination || new List();
    const result = new List(Math.max(4,start-end));
    result.push(...this.#array.slice(start,end));
    return result;
  }
  pop(start=0,end=-1) {
    let span=0;
    let tail=0;
    [start,end,span,tail]=List.#validateRange(this.#length,start,end);
    if (span===0) return;
    const result=this.#array.slice(start,end);
    this.#changed();
    this.#length-=span;
    if (tail===0) return result;
    ++end;
    for(let i=0;i<tail;++i) {
      this.#array[start+i]=this.#array[end+i];
      this.#array[end+i]=undefined;
    }
    return result;
  }

  fill(value,start=0,end=-1) {
    [start,end,span,tail]=List.#validateRange(this.#length,start,end);
    if (span===0) return;
    this.#changed();
    for(let i=start;i<=end;++i)
      this.#array[i]=value;
  }

  static #validateRange(length, start, end) {
    [start,end]=[(length+start)%length,((length+end)+1)%(length+1)];
    if (start<0 || start>=length) throw new RangeError(`index 'start' out of range [-${length},${length})`);
    if (end<0 || end > length) throw new RangeError(`index 'end' out of range (-${length},${length}]`);
    if (start>end) [end,start]=[start,end];
    return[start,end,end-start,length-end];
  }
}
