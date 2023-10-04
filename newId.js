/**
 * Generates a random string of a specified length using a combination of
 * uppercase and lowercase letters, as well as numbers.
 */
function newId(length=11,options=null) {
  options??={
    head:"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
    tail:"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
  };
  const {
    head="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
    tail="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
  }=options;
  switch(length) {
    case 0: return "";
    case 1: return pick(head);
    default:
      return pick(head)+Array.from({length:length-1},()=>pick(tail)).join('');
  }
  function pick(from) {return from[Math.floor(Math.random()*from.length)];}
}
