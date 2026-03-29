type Constructor<T = {}> = new (...args: any[]) => T;

export class Mixin<T = {}> {
  #constructors: readonly Constructor<any>[] = [];
  get constructors() { return this.#constructors; }

  private constructor(...constructors: Constructor<any>[]) {
    this.#constructors = Object.freeze([...constructors]);
  }

  static from<U>(constructor: Constructor<U>): Mixin<U> {
    return new Mixin<U>(constructor);
  }

  with<U>(...constructors: Constructor<U>[]): Mixin<T & U> {
    return new Mixin<T & U>(...this.#constructors, ...constructors);
  }

  without<U>(...constructors: Constructor<U>[]): Mixin<Omit<T, keyof U>> {
    const set = new Set(constructors);
    const filtered = this.#constructors.filter((c) => !set.has(c));
    return new Mixin<Omit<T, keyof U>>(...filtered) as any;
  }

  union<U>(others: Mixin<U>): Mixin<T & U> {
    return new Mixin<T & U>(...this.#constructors, ...others.constructors);
  }

  exclude<U>(others: Mixin<U>): Mixin<Omit<T, keyof U>> {
    return this.without(...(others.constructors as Constructor<U>[]));
  }

  apply<Base>(derivedCtor: Constructor<Base>): Constructor<Base & T> {
    for (let ci = 0; ci < this.#constructors.length; ci++) {
      const baseCtor = this.#constructors[ci];
      const propertyNames = Object.getOwnPropertyNames(baseCtor.prototype);
      
      for (let cp = 0; cp < propertyNames.length; cp++) {
        const name = propertyNames[cp];
        if (name === 'constructor') continue; 

        const attrs = Object.getOwnPropertyDescriptor(baseCtor.prototype, name) || Object.create(null);
        Object.defineProperty(derivedCtor.prototype, name, attrs);
      }
    }
    
    return derivedCtor as unknown as Constructor<Base & T>;
  }
}

/* Example:
class CanFly { fly() { return "flying"; } }
class CanSwim { swim() { return "swimming"; } }
class CanCrawl { crawl() { return "crawling"; } }
class Animal {}

class SuperAnimal
  extends (
    Mixin
    .from(CanFly)
    .with(CanSwim)
    .with(CanCrawl)
    .apply(Animal)
  ) {}

const duck = new SuperAnimal();
console.log(duck.fly());
console.log(duck.swim());
console.log(duck.crawl());
*/
