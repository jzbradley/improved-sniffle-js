// This is a script I wrote for the browser console to
// 1. scrape some documentation from MDN
// 2. use it to stub out function declarations

// Posting it as a quick & dirty example of how to scrape info off a bunch of pages.

const copyText=copy; // Got a "'copy' is undefined" exception first time I ran this. Pretty weird, right?

function formatUrlText(url) {

    return fetch(url)
    .then(result=>result.text())
    .then(text=>{
        var doc = new DOMParser().parseFromString(text, "text/html");
        
        const all=selector=>[...doc.querySelectorAll(selector)];
        const one=selector=>doc.querySelector(selector);
        const cleanup=text=>text.innerText.trim().replaceAll(/\s+/g," ");

        const parameterNames=all('h3#parameters + div dl dt code').map(e=>e.innerText.trim());
        const parameterDescriptions=all('h3#parameters + div dl dd p').map(e=>cleanup(e));
        const parameters=parameterNames.map((name,i)=>({name:name,description:parameterDescriptions[i]}));
        const functionName=one('article.main-page-content > h1').innerText.replace("handler.","").replace("()","");
        const invariants=all('h3#invariants + div ul li').map(e=>cleanup(e));
        return `    /**
     * ${cleanup(one('article.main-page-content > div > p'))}
     * ${cleanup(one('h3#interceptions + div p'))}
     * - ${all('h3#interceptions + div p + ul li > a').map(e=>cleanup(e)).join("\n     * - ")}
     * ${(invariants.length===0?"":`
     * If the following invariants are violated, the proxy will throw a TypeError:"
     * - all('h3#invariants + div ul li').map(e=>cleanup(e)).join("\n     * - ")}
     * `)}
     * ${parameters.map(p=>`@param ${p.name} ${p.description}`).join("\n     * ")}
     */
    ${functionName}(${parameterNames.join(", ")}) { }\n`;
    });
}
Promise.all([...document.querySelectorAll('#sidebar-quicklinks > div > div:nth-child(3) > ol > li:nth-child(3) > ol li a')]
    .map(a=>a.href)
    .map(url=>formatUrlText(url)))
.then(results=>( copyText(`\n${results.join('\n')}\n`), console.log(`copied contents of ${results.length} pages`)))
