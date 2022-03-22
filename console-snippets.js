
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

// shorthand for fetching json info
JSON.load=uri=>fetch(uri).then(response=>response.json())

// enables fetching pages straight into Document objects
//    fetch(...).then(rx=>rx.html())
Response.prototype.html=function(){ return this.text().then(text=>new DOMParser().parseFromString(text, "text/html")); }
//    fetch(...).then(rx=>rx.xml())
Response.prototype.xml=function(){ return this.text().then(text=>new DOMParser().parseFromString(text, "application/xml")); }

// Script.load
if (!Script) window.Script={};
Script.load=uri=>{ eval(await (await fetch(uri)).text()); return Script.load; }

Script.load('https://cdnjs.cloudflare.com/ajax/libs/chai/4.3.6/chai.min.js');
Script.load('https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js');
Script.load('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js');
