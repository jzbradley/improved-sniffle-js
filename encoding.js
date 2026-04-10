
let Encoding = (function(){
  return {
    Base26: {
      toAlpha:toBase26alpha,
      fromAlpha:fromBase26alpha
    }
  }
  function toBase26alpha (value) {
    value=Number(value);
    if (!Number.isFinite(value)) return undefined;
    if (value===0) return "a";
    let result="";
    let i=0;
    ++value;
    while(value>0 && i++<10) {
      result=valueToAlpha(Math.floor(--value%26))+result;
      value=Math.floor(value/26);
    }
    return result;
  }
  function fromBase26alpha (b26String) {
    b26String=String(b26String);
    let acc=0;
    for(let n=0; n<b26String.length;++n) {
      acc*=26;
      acc+=1+alphaToNumber(b26String.charAt(n));
    }
    return acc-1;
  }
  function valueToAlpha(value) {
    value=Number(value);
    inRange(value,26);
    return String.fromCodePoint(Number(value)+97);
  }
  function alphaToNumber(char) {
    value=String(char).codePointAt(0)-97;
    inRange(value,26);
    return value;
  }
  function inRange(value,max,min=0) {
    if (value>=min && value < max) return;
    throw new RangeError("Argument out of range");
  }
})();
