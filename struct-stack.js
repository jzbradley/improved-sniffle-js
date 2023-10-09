/**
 * An traditional stack-like data structure which pre-allocates space
 * in order to reduce the number of array re-allocations.
 */
class Stack {
  #length=0;
  #array;
  #version=0;
  #changed() {
    ++this.#version;
  }
  #ensureCapacity(minLength) {
    if (minLength <= this.#length) return;
    this.#array.length *= 2;
    this.#changed();
  }
  get version() { return this.#version; }
  get length() { return this.#length; }
  constructor(capacity=4) {
    this.#array=Array.from({length:capacity||0});
  }
  get top() {
    if (this.length===0) return undefined;
    return this.#array[this.length-1];
  }
  push(...items) {
    if (items.length===0) return;
    this.#changed();
    this.#ensureCapacity(this.#length+items.length);
    for(let i=0;i<items.length;i++)
      this.#array[i]=items[i];
    this.#length+=items.length;
  }
  pop(count=1,destination=undefined) {
    const self=this;
    switch(true) {
      case count<0: throw new RangeError("cannot pop a negative number of items");
      case count===0: return destination||null;
    }
    if (typeof destination===undefined) {
      const array=Array.from({length:count});
      this.#changed();
      for(let i=0;i<count;++i)
        array[i]=popOne();
      return array;
    }

    if (!('push' in destination) || typeof destination.push !=='function')
      throw new Error("Expected 'destination' to have 'push' method.")
    this.#changed();
    for(let i=0;i<count;++i)
      destination.push(popOne());
    return destination;

    function popOne() {
      --self.#length;
      const result=self.#array[self.#length];
      self.#array[self.#length]=undefined;
      return result;
    }
  }
}
