// https://oeis.org/A062383
function A062383(n){return (+!+n*1)||2**Math.floor(Math.log2(n)+1);}

// https://oeis.org/A153587
function A153587(n){return n%(A062383(n)-n);}
