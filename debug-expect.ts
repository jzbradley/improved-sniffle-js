
// too clever, or not too, that is the question:
// whether 'tis nobler in the lines to suffer
// the slings and arrows of template's fortune

function expect<
  TFn extends (...args:any[])=>any,
  TR extends ReturnType<TFn>,
  TP extends Parameters<TFn>>
(strings:TemplateStringsArray, test:TFn, positiveResult:TR, ...params:TP) {
  const {warn,error,debug}=console;
  let message = strings[0]+test+strings[1]+positiveResult+strings[2];
  for(let i=0;i<params.length;++i) 
    message+=String(params[i])+strings[i+2];
  try{
    if (test(...params)===positiveResult) {
      debug("PASSED: "+message);
      return;
    }
    error("FAILED: " + message);
  }
  catch(err) {
    warn(`AN EXCEPTION OCCURED IN TEST\n${message}\n\n${err}`);
  }
}

// example usage
/*
expect`${ ( x=4, y=5 ) => x+y } should equal ${4+5}.`;
// verbose log: PASSED: ( x=4, y=5 ) => x+y should equal 9.

expect`${ ( x, y ) => x+y } should equal ${4+5} for x=${4}, y=${5}.`;
// verbose log: PASSED: ( x, y ) => x+y should equal 9 for x=4, y=5.

expect` ${ ( x, y ) => 0 } does not equal ${1}.`;
// verbose log: FAILED: ( x, y ) => 0 does not equal 1.
*/
