
    function union(objects) {
        return objects.reduce((l,r)=>Object.assign(l,r));
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
        .reduce((l,r)=>Object.assign(l,r));
    }
