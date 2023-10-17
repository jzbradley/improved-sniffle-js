
/**
 * A traditional stack-like data structure which pre-allocates space
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
    if (minLength <= this.#array.length) return;
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
    for(let i=0;i<items.length;i++) {
      this.#array[this.#length]=items[i];
      ++this.#length;
    }
  }
  pop() {
    --this.#length;
    const result=this.#array[this.#length];
    this.#array[this.#length]=undefined;
    return result;
  }
}
