// alphebetizes fields while serializing the given object
function stableStringify(obj) {
  if (!obj || typeof obj !== 'object')
    return JSON.stringify(obj);

  if (Symbol.iterator in obj)
    return JSON.stringify([...map(obj,stableStringify)]);
  
  const sortedObj = Object.fromEntries([
    ...map(
      [...keysOf(obj)].sort(),
      key=>stableStringify(obj[key])
    )
  ]);
  return JSON.stringify(sortedObj);

  function *keysOf(obj) { for(const key in obj) yield key; }
  function *map(obj,selector) { for(const value of obj) yield selector(value); }
}
