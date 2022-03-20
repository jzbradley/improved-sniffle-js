
// basic Array-style map from, ie, document.querySelectorAll
NodeList.prototype.map=function(predicate){const self=this;return [...(function*(){for (const e of self) yield predicate(e);})()];};

// zip n arrays together.
// ( [1,2], [1,2,3] ) -> [ [1,1], [2,2], [null,3] ]
const zip=(...args)=>Array.from({length:Math.max(...args.map(a=>a.length))},(p,i)=>args.map(a=>a[i]));
// ( [1,2], [1,2,3] ) -> [ [1,1], [2,2] ]
zip.inner=(...args)=>Array.from({length:Math.min(...args.map(a=>a.length))},(p,i)=>args.map(a=>a[i]));


// shorthand version
const query=(selector,target=document)=>target.querySelectorAll(selector)

// queries many elements and joins them together
// query.group("main h2",["+div"]) -> [...[h2s before div, divs after h2s]]
query.group=(headSelector,neighborSelectors,target=document)=>{
    return zip(...[query(headSelector,target),...neighborSelectors.map(s=>query(headSelector+s,target))]);
}
