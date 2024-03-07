
class PromiseQueue {
  /**
   * @param {() => Promise} predicate
   */
  push(predicate) {
    this.#queue.push(predicate);
    if (!this.#isBusy) this.#next();
  }
  /**
   * @type {(() => Promise)[]}
   */
  #queue = [];
  get length() { return this.#queue.length; }
  
  get isBusy() { return this.#isBusy; }
  #isBusy = false;

  /**
   * @param {((err: any) => void) | null} handler
   */
  set oncatch(handler) {
    // TODO: Replace with a normal event-style pattern
    if (typeof handler !=='function')
      return;
    this.#oncatch=handler;
  }
  /**
   * @type {null | (err) => void}
   */
  #oncatch = null;

  #next() {
    if (this.#queue.length === 0) {
      this.#isBusy = false;
      return;
    }
    this.#isBusy = true;
    const predicate = this.#queue.shift();
    predicate()
    .then(() => this.#next())
    .catch(err => {
      if (this.#oncatch) this.#oncatch(err);
      this.#next();
    });
  }
}
