function curry(fn) {
    return function curried(...args) {
        return args.length < fn.length 
        ? function(...args2) { return curried.apply(this, args.concat(args2)); }
        : fn.apply(this, args);
    };
}
function union(objects) {
    return objects.reduce((l,r)=>Object.assign(l,r),{});
}
function outerApply(method,left,right) {
  return [Object
    .keys(right)
    .filter(key=>typeof left[key]==='undefined')
    .map(key=>({[key]:method(left[key])})),
    Object
    .keys(left)
    .filter(key=>typeof right[key]==='undefined')
    .map(key=>({[key]:method(right[key])}))
  ].flat()
    .reduce((l,r)=>Object.assign(l,r),{});
}

  function innerApply(method,left,right) {
    return Object
      .keys(left)
      .filter(key=>typeof right[key] !== 'undefined')
      .map(key=>({[key]:method(left[key],right[key])}))
      .reduce((l,r)=>Object.assign(l,r),{});
  }
