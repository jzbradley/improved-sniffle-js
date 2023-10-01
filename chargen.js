// Generates characters in a range
  function chargen(start, end) {
    switch(typeof start) {
      case 'number':break;
      case 'string':
        start=start.codePointAt(0);
        break;
      default: throw "Unsupported argument for 'start'";
    }
    switch(typeof end) {
      case 'number':break;
      case 'string':
        end=end.codePointAt(0);
        break;
      default: throw "Unsupported argument for 'end'";
    }
    return Array.from({length:end - start + 1},(_, i) => String.fromCharCode(start + i)).join('');
  }
