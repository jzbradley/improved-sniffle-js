import {PromiseQueue} from "PromiseQueue";

function download(src,filename) {
  return fetch(src)
  .then(resp => resp.status === 200 ? resp.blob() : Promise.reject(resp.status))
  .then(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    a.remove(); //?
  })
  .catch((err) => {console.log(`Failed to download ${src}: ${err}`)});
}

download.all = function (srcs) {
  const q = new PromiseQueue();
  for (const [url, filename] of srcs) {
    q.push(()=>download(url,filename))
  }
}
