class Queue {
  #items = {};
  #headIndex = 0;
  #tailIndex = 0;
  #version = 0;

  get version() { return this.#version; }

  add(...items) {
    for (const item of items) {
      this.#items[this.#tailIndex] = item;
      ++this.#tailIndex;
    }
    ++this.#version;
  }

  take() {
    if (this.isEmpty) return undefined;
    
    const item = this.#items[this.#headIndex];
    delete this.#items[this.#headIndex];
    ++this.#headIndex;
    if (this.isEmpty) this.#headIndex = this.#tailIndex = 0;
    ++this.#version;
    return item;
  }

  peek() {
    if (this.isEmpty) return undefined;
    return this.#items[this.#headIndex];
  }

  get length() {
    return this.#tailIndex - this.#headIndex;
  }

  get isEmpty() {
    return this.length === 0;
  }
}
