// Zips two arrays together as strings, limited by the length of the first parameter's array.
// Roughly equivalent to what tagged templates do.
// ([0,1,2,3,4,5], [0,1,2,3,4,'e']) => '00112233445'
function zipStrings(strings,args){
  var argCount=Math.min(strings.length-1,args.length);
  if (argCount===0) return (strings||[]).join('');
  const build=Array.from({length:strings.length+argCount});
  for(let i=0; i<argCount;++i) {
    const j=i*2;
    build[j]  =(strings[i]||'').toString();
    build[j+1]=(args[i]||'').toString();
  }
  return build.join('');
}
