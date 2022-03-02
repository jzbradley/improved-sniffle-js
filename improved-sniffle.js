// Overdoing it.
const parseIntWords=(()=>{
    const tens={ten:10,eleven:11,twelve:12,thirteen:13,fourteen:14,fifteen:15,sixteen:16,seventeen:17,eighteen:18,nineteen:19};
    const aughties={twenty:20,thirty:30,fourty:40,forty:40,fifty:50,sixty:60,seventy:70,eighty:80,ninety:90};
    const singles={one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9};
    const magnitudes={score:20,thousand:1E3,million:1E6,billion:1E9,trillion:1E12,quadrillion:1E15};
    return string=>{
      if (!string) return NaN;
      string=string.trim().toLowerCase();
      
      if (string==='zero') return 0;
      
      if (string.match(/less\s+than/g)) {
        try{
          return string
            .split(/less\s+than/g)
            .map(s=>parseInt(s))
            .reduce((l,r)=>r-l,0);
        }
        catch { return NaN; }
      }
      
      return string
          .replace(/\s|-/g,' ')
          .replace(/eleven|(thir|four|fif|six|seven|eigh|nine)teen|ten|twelve/g
          ,m=>tens[m])
          .replace(/(twenty|thirty|fourty|forty|fifty|sixty|seventy|eighty|ninety)/g
          ,(f,a,d,b)=>(aughties[a]))
          .replace(/(2|3|4|5|6|7|8|9)0 (one|two|three|four|five|six|seven|eight|nine)/g
          ,(f,a,b)=>(a+singles[b]))
          .replace(/one|two|three|four|five|six|seven|eight|nine/g,m=>(singles[m]))
          .replace(/(\d+) hundred (?:and )?(\d+)/g,(f,a,b)=>a+(b<10?'0'+b:b))
          .replace(/(\d+) hundred/g,(f,a)=>a+'00')
          .replace(/(\d+) (\d+)/g,(f,a,b)=>a+b)
          .replace(/(\d+) (score|thousand|million|billion|trillion|quadrillion)/g,(f,a,b)=>Number(a)*magnitudes[b])
          .split(/(?: and )|(?: )/)
          .reduce((l,r)=>l+parseFloat(r),0);
    };
  })();
  
  parseIntWords.testSuite=() => {
    if (!describe) return;
    function test(string,expected){
      it(string,()=>Test.assertEquals(parseIntWords(string), expected))
    }
    test('zero', 0);
    test('one', 1);
    test('twenty', 20);
    test('twenty-one', 21);
    test('four score and seven', 87);
    test('two hundred forty-six', 246);
    test('nineteen hundred and three', 1903);
    test('fourty-six and two', 46+2);
    test('twenty twenty', 2020);
    test('two thousand', 2000);
    test('two thousand and fifteen', 2015);
    test('two thousand and forty-six', 2046);
    test('seven hundred eighty-three', 783);
    test('seven hundred eighty-three thousand', 783000);
    test('seven hundred eighty-three thousand nine hundred and nineteen', 783900+19);
    test('eighty-three thousand and twenty-nine hundred', 83000 + 2900);
    test('one million', 1000000);
    test('one hundred million', 100000000);
    test('one hundred eighty-three million two thousand and one hundred twenty-eight', 183002000 + 128);
    test('nine less than twenty-one', 21-9);
  }

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
