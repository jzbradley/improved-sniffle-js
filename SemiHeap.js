/**
 * 
 * A SemiHeap orders nodes into a list-of-sublists form.
 * For example, nesting h1, h2, h3, etc. into a Table of Contents.
 * 
 * Example result:
 * [1, 2, 3, 4, 4, 3, 4, 4, 3, 4, 4, 3, 4, 4, 3, 4, 4, 3, 4, 4, 3, 4, 4, 3, 4, 4]
 * -> [0,[1,[2,[3,[4,4]],[3,[4,4]],[3,[4,4]],[3,[4,4]],[3,[4,4]],[3,[4,4]],[3,[4,4]],[3,[4,4]]]]]
 * 
 * @class SemiHeap
 * @extends {Array}
 */
class SemiHeap extends Array {
  static build(nodes) {
    var root = new SemiHeap([0]);
    var stack = [root];
    for (var h of nodes) {
      const current = new SemiHeap([h]);
      while (stack.length && stack.slice(-1)[0].rank >= h) stack.pop();

      stack.slice(-1)[0].push(current);
      stack.push(current);
    }
    return root;
  }
  constructor([rank,...contents]) {
    super();
    this.contents = contents;
    this.rank = rank;
  }
  toString(level = 0) {
    return " ".repeat(level) +
    this.rank +
    "\n" +
    this.map((m) => m.toString(level + 1));
  }
}
