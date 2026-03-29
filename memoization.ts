namespace Memoization {
  type AnyFunction = (...args: any[]) => any;

  interface Memo<T extends AnyFunction> {
    children: Map<any, Memo<T>>;
    hasValue: boolean;
    value?: ReturnType<T>;
  }

  class MemoizedFunction<T extends AnyFunction> {
    root: Memo<T>;
    fn:T;
    constructor(fn:T) {
      this.root={ children: new Map(), hasValue: false };
      this.fn=fn;
    }
    call(...args: Parameters<T>): ReturnType<T>{
      let current = this.root;

      for (const arg of args) {
        if (!current.children.has(arg)) {
          current.children.set(arg, { children: new Map(), hasValue: false });
        }
        current = current.children.get(arg)!;
      }

      if (current.hasValue) {
        return current.value!;
      }

      const result = this.fn(...args);
      current.value = result;
      current.hasValue = true;
      
      return result;
    }
  }

  const cache=new WeakMap<AnyFunction,MemoizedFunction<any>>();

  export function apply<T extends AnyFunction>(fn: T): T {
    let instance = cache.get(fn);
    if (!instance) {
      instance = new MemoizedFunction(fn);
      cache.set(fn, instance);
    }
    return instance.call.bind(instance) as T;
  }
}
