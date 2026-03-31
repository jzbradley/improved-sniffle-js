/**
 * A non-owning, read-only window over a region of an array.
 */
class View<T> {
  static from<T>(ref: T[]): View<T> {
    return new View<T>(ref);
  }

  static of<T>(...items: T[]): View<T> {
    return new View<T>(items);
  }

  #ref: T[];
  #offset: number;
  #length: number;

  private constructor(ref: T[], offset = 0, length = ref.length) {
    this.#ref = ref;
    this.#offset = offset;
    this.#length = length;
  }

  get length(): number {
    return this.#length;
  }

  at(index: number): T | undefined {
    if (index < 0) index = this.#length + index;
    if (index < 0 || index >= this.#length) return undefined;
    return this.#ref[this.#offset + index];
  }

  slice(start = 0, end: number = this.#length): View<T> {
    if (start < 0) start = Math.max(this.#length + start, 0);
    if (end < 0) end = Math.max(this.#length + end, 0);

    start = Math.min(start, this.#length);
    end = Math.min(end, this.#length);

    const len = Math.max(end - start, 0);
    return new View<T>(this.#ref, this.#offset + start, len);
  }

  includes(searchElement: T, fromIndex = 0): boolean {
    return this.indexOf(searchElement, fromIndex) !== -1;
  }

  indexOf(searchElement: T, fromIndex = 0): number {
    if (fromIndex < 0) fromIndex = Math.max(this.#length + fromIndex, 0);
    for (let i = fromIndex; i < this.#length; ++i) {
      if (this.#ref[this.#offset + i] === searchElement) return i;
    }
    return -1;
  }

  lastIndexOf(searchElement: T, fromIndex: number = this.#length - 1): number {
    if (fromIndex < 0) fromIndex = this.#length + fromIndex;
    fromIndex = Math.min(fromIndex, this.#length - 1);
    for (let i = fromIndex; i >= 0; --i) {
      if (this.#ref[this.#offset + i] === searchElement) return i;
    }
    return -1;
  }

  find(
    predicate: (value: T, index: number, view: View<T>) => boolean,
  ): T | undefined {
    for (let i = 0; i < this.#length; ++i) {
      const val = this.#ref[this.#offset + i];
      if (predicate(val, i, this)) return val;
    }
    return undefined;
  }

  findIndex(
    predicate: (value: T, index: number, view: View<T>) => boolean,
  ): number {
    for (let i = 0; i < this.#length; ++i) {
      if (predicate(this.#ref[this.#offset + i], i, this)) return i;
    }
    return -1;
  }

  findLast(
    predicate: (value: T, index: number, view: View<T>) => boolean,
  ): T | undefined {
    for (let i = this.#length - 1; i >= 0; --i) {
      const val = this.#ref[this.#offset + i];
      if (predicate(val, i, this)) return val;
    }
    return undefined;
  }

  findLastIndex(
    predicate: (value: T, index: number, view: View<T>) => boolean,
  ): number {
    for (let i = this.#length - 1; i >= 0; --i) {
      if (predicate(this.#ref[this.#offset + i], i, this)) return i;
    }
    return -1;
  }

  every(
    predicate: (value: T, index: number, view: View<T>) => boolean,
  ): boolean {
    for (let i = 0; i < this.#length; ++i) {
      if (!predicate(this.#ref[this.#offset + i], i, this)) return false;
    }
    return true;
  }

  some(
    predicate: (value: T, index: number, view: View<T>) => boolean,
  ): boolean {
    for (let i = 0; i < this.#length; ++i) {
      if (predicate(this.#ref[this.#offset + i], i, this)) return true;
    }
    return false;
  }

  forEach(
    callbackFn: (value: T, index: number, view: View<T>) => void,
  ): void {
    for (let i = 0; i < this.#length; ++i) {
      callbackFn(this.#ref[this.#offset + i], i, this);
    }
  }

  reduce<U = T>(
    callbackFn: (acc: U | T | undefined, value: T, index: number, view: View<T>) => U,
    ...args: [U] | []
  ): U | T | undefined {
    let i = 0;
    let acc: U | T | undefined;

    if (args.length > 0) {
      acc = args[0];
    } else {
      if (this.#length === 0) {
        throw new TypeError("Reduce of empty view with no initial value");
      }
      acc = this.#ref[this.#offset] as unknown as U;
      i = 1;
    }

    for (; i < this.#length; ++i) {
      acc = callbackFn(acc, this.#ref[this.#offset + i], i, this);
    }
    return acc;
  }

  reduceRight<U = T>(
    callbackFn: (acc: U | T | undefined, value: T, index: number, view: View<T>) => U,
    ...args: [U] | []
  ): U | T | undefined {
    let i = this.#length - 1;
    let acc: U | T | undefined;

    if (args.length > 0) {
      acc = args[0];
    } else {
      if (this.#length === 0) {
        throw new TypeError("Reduce of empty view with no initial value");
      }
      acc = this.#ref[this.#offset + i] as unknown as U;
      --i;
    }

    for (; i >= 0; --i) {
      acc = callbackFn(acc, this.#ref[this.#offset + i], i, this);
    }
    return acc as U;
  }

  join(separator = ","): string {
    let s = "";
    for (let i = 0; i < this.#length; ++i) {
      if (i > 0) s += separator;
      const v = this.#ref[this.#offset + i];
      if (v !== null && v !== undefined) s += String(v);
    }
    return s;
  }

  toString(): string {
    return this.join(",");
  }

  toLocaleString(): string {
    const parts: string[] = [];
    for (let i = 0; i < this.#length; ++i) {
      const v = this.#ref[this.#offset + i];
      parts.push(
        v === null || v === undefined
          ? ""
          : (v as { toLocaleString(): string }).toLocaleString(),
      );
    }
    return parts.join(",");
  }

  *[Symbol.iterator](): IterableIterator<T> {
    for (let i = 0; i < this.#length; ++i) {
      yield this.#ref[this.#offset + i];
    }
  }

  *values(): IterableIterator<T> {
    for (let i = 0; i < this.#length; ++i) {
      yield this.#ref[this.#offset + i];
    }
  }

  *keys(): IterableIterator<number> {
    for (let i = 0; i < this.#length; ++i) {
      yield i;
    }
  }

  *entries(): IterableIterator<[number, T]> {
    for (let i = 0; i < this.#length; ++i) {
      yield [i, this.#ref[this.#offset + i]];
    }
  }

  get [Symbol.toStringTag]() {
    return "View";
  }
}

export default View;
