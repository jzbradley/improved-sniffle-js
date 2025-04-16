// char.js
// for when you just need to test some things


const Char =(function(){
  /**
   * converts a string or character code to a single character
   * @param {number|string|number[]|string[]} char
   * @return {string|null|undefined}
   */
  function Char(char) {
    if (char === null) return null;
    if (typeof(char) == 'string' || char instanceof String)
      return char.length===0 ? null : String.fromCharCode(char.charCodeAt(0));
    if (Symbol.iterator in char) {
      [char] = char;
      return Char(char);
    }
    if (typeof(char) == 'number' || char instanceof Number)
      return String.fromCharCode(char);
    return undefined;
  }
  /**
   * gets a the code of the first character in a string
   * @param {string} char
   * @return {number}
   */
  Char.code = function (char) { return String(char).charCodeAt(0); }
  /**
   * converts text to an array of characters.
   * @param {string|string[]} text
   * @return {string[]}
   **/
  Char.toCharArray = function (text)
  {
    return typeof(text) ==='string' ? [...text]
      : Symbol.iterator in text ? [...text].flatMap(Char.toCharArray)
      : undefined; }
  /**
   * converts text to codepoints.
   * @param {string|string[]} text
   * @return {number[]|null|undefined}
   **/
  Char.toCodeArray = function (text) {
    return [...String(text)].map(c=>c.charCodeAt(0));
  }
  /**
   * converts codepoints to text
   * @param {number[]} codes
   * @return {string|null|undefined}
   **/
  Char.fromCodeArray = function (codes) { return [...codes].map(c=>String.fromCharCode(Number(c))); }
  /**
   * tests if the character is any kind of letter from any language.
   * @param {string[1]} c
   * @returns {boolean}
   **/
  Char.isLetter = function (c){ return Char(c).match(/\p{L}/); }
  /**
   * tests if the character is a lowercase letter that has an uppercase variant.
   * @param {string[1]} c
   * @returns {boolean}
   **/
  Char.isLowercaseLetter = function (c){ return Char(c).match(/\p{Ll}/); }
  /**
   * tests if the character is an uppercase letter that has a lowercase variant.
   * @param {string[1]} c
   * @returns {boolean}
   **/
  Char.isUppercaseLetter = function (c){ return Char(c).match(/\p{Lu}/); }
  /**
   * tests if the character is a letter that appears at the start of a word when only the first letter of the word is capitalized.
   * @param {string[1]} c
   * @returns {boolean}
   **/
  Char.isTitlecaseLetter = function (c){ return Char(c).match(/\p{Lt}/); }
  /**
   * tests if the character is a letter that exists in lowercase and uppercase variants (combination of Ll, Lu and Lt).
   * @param {string[1]} c
   * @returns {boolean}
   **/
  Char.isCasedLetter = function (c){ return Char(c).match(/\p{Li}|\p{Lu}|\p{Lt}/); }
  /**
   * tests if the character is a special character that is used like a letter.
   * @param {string[1]} c
   * @returns {boolean}
   **/
  Char.isModifierLetter = function (c){ return Char(c).match(/\p{Lm}/); }
  /**
   * tests if the character is a letter or ideograph that does not have lowercase and uppercase variants.
   * @param {string[1]} c
   * @returns {boolean}
   **/
  Char.isOtherLetter = function (c){ return Char(c).match(/\p{Lo}/); }
  /**
   * tests if the character is a character intended to be combined with another character (e.g. accents, umlauts, enclosing boxes, etc.).
   * @param {string[1]} c
   * @returns {boolean}
   **/
  Char.isMark = function (c){ return Char(c).match(/\p{M}/); }
  /**
   * tests if the character is a character intended to be combined with another character without taking up extra space (e.g. accents, umlauts, etc.).
   * @param {string[1]} c
   * @returns {boolean}
   **/
  Char.isNonSpacingMark = function (c){ return Char(c).match(/\p{Mn}/); }
  /**
   * tests if the character is a character intended to be combined with another character that takes up extra space (vowel signs in many Eastern languages).
   * @param {string[1]} c
   * @returns {boolean}
   **/
  Char.isSpacingCombiningMark = function (c){ return Char(c).match(/\p{Mc}/); }
  /**
   * tests if the character is a character that encloses the character it is combined with (circle, square, keycap, etc.).
   * @param {string[1]} c
   * @returns {boolean}
   **/
  Char.isEnclosingMark = function (c){ return Char(c).match(/\p{Me}/); }
  /**
   * tests if the character is any kind of whitespace or invisible separator.
   * @param {string[1]} c
   * @returns {boolean}
   **/
  Char.isSeparator = function (c){ return Char(c).match(/\p{Z}/); }
  /**
   * tests if the character is a whitespace character that is invisible, but does take up space.
   * @param {string[1]} c
   * @returns {boolean}
   **/
  Char.isSpaceSeparator = function (c){ return Char(c).match(/\p{Zs}/); }
  /**
   * tests if the character is line separator character U+2028.
   * @param {string[1]} c
   * @returns {boolean}
   **/
  Char.isLineSeparator = function (c){ return Char(c).match(/\p{Zl}/); }
  /**
   * tests if the character is paragraph separator character U+2029.
   * @param {string[1]} c
   * @returns {boolean}
   **/
  Char.isParagraphSeparator = function (c){ return Char(c).match(/\p{Zp}/); }
  /**
   * tests if the character is math symbols, currency signs, dingbats, box-drawing characters, etc.
   * @param {string[1]} c
   * @returns {boolean}
   **/
  Char.isSymbol = function (c){ return Char(c).match(/\p{S}/); }
  /**
   * tests if the character is any mathematical symbol.
   * @param {string[1]} c
   * @returns {boolean}
   **/
  Char.isMathSymbol = function (c){ return Char(c).match(/\p{Sm}/); }
  /**
   * tests if the character is any currency sign.
   * @param {string[1]} c
   * @returns {boolean}
   **/
  Char.isCurrencySymbol = function (c){ return Char(c).match(/\p{Sc}/); }
  /**
   * tests if the character is a combining character (mark) as a full character on its own.
   * @param {string[1]} c
   * @returns {boolean}
   **/
  Char.isModifierSymbol = function (c){ return Char(c).match(/\p{Sk}/); }
  /**
   * tests if the character is various symbols that are not math symbols, currency signs, or combining characters.
   * @param {string[1]} c
   * @returns {boolean}
   **/
  Char.isOtherSymbol = function (c){ return Char(c).match(/\p{So}/); }
  /**
   * tests if the character is any kind of numeric character in any script.
   * @param {string[1]} c
   * @returns {boolean}
   **/
  Char.isNumber = function (c){ return Char(c).match(/\p{N}/); }
  /**
   * tests if the character is a digit zero through nine in any script except ideographic scripts.
   * @param {string[1]} c
   * @returns {boolean}
   **/
  Char.isDecimalDigitNumber = function (c){ return Char(c).match(/\p{Nd}/); }
  /**
   * tests if the character is a number that looks like a letter, such as a Roman numeral.
   * @param {string[1]} c
   * @returns {boolean}
   **/
  Char.isLetterNumber = function (c){ return Char(c).match(/\p{Nl}/); }
  /**
   * tests if the character is a superscript or subscript digit, or a number that is not a digit 0–9 (excluding numbers from ideographic scripts).
   * @param {string[1]} c
   * @returns {boolean}
   **/
  Char.isOtherNumber = function (c){ return Char(c).match(/\p{No}/); }
  /**
   * tests if the character is any kind of punctuation character.
   * @param {string[1]} c
   * @returns {boolean}
   **/
  Char.isPunctuation = function (c){ return Char(c).match(/\p{P}/); }
  /**
   * tests if the character is any kind of hyphen or dash.
   * @param {string[1]} c
   * @returns {boolean}
   **/
  Char.isDashPunctuation = function (c){ return Char(c).match(/\p{Pd}/); }
  /**
   * tests if the character is any kind of opening bracket.
   * @param {string[1]} c
   * @returns {boolean}
   **/
  Char.isOpenPunctuation = function (c){ return Char(c).match(/\p{Ps}/); }
  /**
   * tests if the character is any kind of closing bracket.
   * @param {string[1]} c
   * @returns {boolean}
   **/
  Char.isClosePunctuation = function (c){ return Char(c).match(/\p{Pe}/); }
  /**
   * tests if the character is any kind of opening quote.
   * @param {string[1]} c
   * @returns {boolean}
   **/
  Char.isInitialPunctuation = function (c){ return Char(c).match(/\p{Pi}/); }
  /**
   * tests if the character is any kind of closing quote.
   * @param {string[1]} c
   * @returns {boolean}
   **/
  Char.isFinalPunctuation = function (c){ return Char(c).match(/\p{Pf}/); }
  /**
   * tests if the character is a punctuation character such as an underscore that connects words.
   * @param {string[1]} c
   * @returns {boolean}
   **/
  Char.isConnectorPunctuation = function (c){ return Char(c).match(/\p{Pc}/); }
  /**
   * tests if the character is any kind of punctuation character that is not a dash, bracket, quote or connector.
   * @param {string[1]} c
   * @returns {boolean}
   **/
  Char.isOtherPunctuation = function (c){ return Char(c).match(/\p{Po}/); }
  /**
   * tests if the character is invisible control characters and unused code points.
   * @param {string[1]} c
   * @returns {boolean}
   **/
  Char.isOther = function (c){ return Char(c).match(/\p{C}/); }
  /**
   * tests if the character is an ASCII or Latin-1 control character: 0x00–0x1F and 0x7F–0x9F.
   * @param {string[1]} c
   * @returns {boolean}
   **/
  Char.isControl = function (c){ return Char(c).match(/\p{Cc}/); }
  /**
   * tests if the character is invisible formatting indicator.
   * @param {string[1]} c
   * @returns {boolean}
   **/
  Char.isFormat = function (c){ return Char(c).match(/\p{Cf}/); }
  /**
   * tests if the character is any code point reserved for private use.
   * @param {string[1]} c
   * @returns {boolean}
   **/
  Char.isPrivateUse = function (c){ return Char(c).match(/\p{Co}/); }
  /**
   * tests if the character is one half of a surrogate pair in UTF-16 encoding.
   * @param {string[1]} c
   * @returns {boolean}
   **/
  Char.isSurrogate = function (c){ return Char(c).match(/\p{Cs}/); }
  /**
   * tests if the character is any code point to which no character has been assigned.
   * @param {string[1]} c
   * @returns {boolean}
   **/
  Char.isUnassigned = function (c){ return Char(c).match(/\p{Cn}/); }
  return Char;
})();
