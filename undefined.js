type TypeName
  = "bigint"
  | "boolean"
  | "number"
  | "object"
  | "string"
  | "symbol"
  | "undefined"
  | "function";
function getTypeConstructor(type:TypeName) {
  switch(type) {
    case "string": return String;
    case "number": return Number;
    case "bigint": return BigInt;
    case "boolean": return Boolean;
    case "symbol": return Symbol;
    case "function": return Function;
    case "object": return Object;
    case "undefined": return Undefined;
  }
}
function unbox<T>(value:T) {
  return getTypeConstructor(typeof value)(value);
}

interface Undefined {
    valueOf(): undefined;
}
interface UndefinedConstructor {
  new (value?: any): Undefined;
  (value?: any): undefined;
  readonly prototype: Undefined;
}
declare var Undefined: UndefinedConstructor;

var Undefined
  = Undefined ||
  function Undefined(_?:any) {
    // TODO: define `valueOf()`
    return new.target?Undefined:undefined;
  };

interface CardboardBox<T=any>
{ valueOf(): T; }
interface CardboardBoxConstructor {
  new <T>(contents?: T): CardboardBox<T>;
  <T>(value?: T): T extends CardboardBox<infer V> ? V : any;
  readonly prototype: CardboardBox;
}
declare var CardboardBox:CardboardBoxConstructor;
var CardboardBox
  = CardboardBox ||
  function (value?:any) {
    // TODO
  }

(function() {
  let // us sing 🎶

  // 🎶 I've found a way to break through this cellophane line 🎶
  // 🎶 'Cause I know what's going on 🎶
  // 🎶 In my own mind! 🎶
  [ undefined_in_a_box,
    undefined_in_a_cardboard_box ] =
  [ new Undefined(undefined),
    new CardboardBox(undefined)
  ]
})
