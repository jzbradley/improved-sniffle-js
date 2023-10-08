
type Numeric = string | number | bigint | boolean;
interface BitBuffer {
  get length():number;
  append(value:Numeric,width:number);
  slice(start?:number,end? :number):Numeric;
  shift(length:number):Numeric;
  pad(minLength:number):number;
  toString():string;
}
const BitBuffer = (()=>{
  if (BigInt) {
    const [zero,one,two]=[BigInt(0),BigInt(1),BigInt(2)]
    return class BigIntBitBuffer implements BitBuffer {
      pad(minLength: number): number {
        const padCount=minLength-this.length;
        if (padCount>0) this.append(0,padCount);
        this.#length+=padCount;
        return padCount;
      }
      #length=0;
      #bits=zero;
      get length():number {
        return this.#length;
      }
      append(value:Numeric,width:number):void {
        value=BigInt(value)&mask(width);
        this.#bits|=value<<BigInt(this.#length);
        this.#length+=width;
      }
      slice(start:number=0,end:number=-1):Numeric {
        const max=this.#length;
        if (max===0) return 0;
        [start,end] = [(max+start)%max,(max+end)%max];
        if (start>end) [end,start]=[start,end];
        return (this.#bits>>BigInt(start))&mask(end-start);
      }
      shift(length:number):Numeric {
        length=Math.min(this.#length,length);
        const result=this.#bits&mask(length);
        this.#bits=this.#bits>>BigInt(length);
        this.#length-=length;
        return result;
      }
      toString(radix:number=2):string {
        return this.#bits.toString(radix);
      }
    };
    function mask(length):bigint { return (two**BigInt(length))-one; }
  }
  return class StringBitBuffer implements BitBuffer {
    #bits="";
    get length():number {
      return this.#bits.length;
    }
    append(value:Numeric,width:number):void {
      width=Number(width);
      this.#bits+=Number(value).toString(2).padStart(width,'0');
    }
    slice(start:number=0,end:number=-1):Numeric {
      return parseInt(this.#bits.slice(Number(start),Number(end)),2);
    }
    shift(length:number):Numeric {
      const result=parseInt(this.#bits.slice(0,length));
      this.#bits=this.#bits.slice(length);
      return result;
    }
    pad(minLength: number): number {
      const padCount=minLength-this.length;
      this.#bits=this.#bits.padStart(minLength,'0');
      return padCount;
    }
    toString(radix:number=2):string {
      if (this.length==0) return "0";
      if (radix===2) return this.#bits;
      return parseInt(this.#bits).toString(radix);
    }
  }
})();

namespace Stream {
  export interface State {
    get isOpen():boolean;
    get isClosed():boolean;
    get hasError():boolean;
    get error():Error|undefined;
  }
  export enum NextResult {
    Done=0,
    Continue=1,
  }
  export interface Stream {
    open():State;
    close():void;
    get state():State;
  }
  export interface StreamReader<T> extends Stream {
    next(): NextResult;
    get value(): T | undefined;
    [Symbol.iterator](): Generator<T, void, void>;
  }
  export interface StreamWriter<T> extends Stream {
    write(value:T):void;
    writeAll(values:Iterable<T>):void;
  }
  export function bridgeStreams(
    inputStream: StreamReader<number>,
    outputStream: StreamWriter<number>,
    readWordSize: number,
    writeWordSize: number
  ): number {
    const maxInputValue = 2 ** readWordSize;
    const maxOutValue = 2 ** writeWordSize;

    // Check if given sizes are valid
    if (maxInputValue <= 1 || maxOutValue <= 1) {
        throw new Error("Invalid word sizes.");
    }
    let bitBuffer = new BitBuffer();
    let wordCount = 0;
    for (const inputValue of inputStream) {
        bitBuffer.append(inputValue,readWordSize);
        // While there are enough bits in bitBuffer to produce an output
        while (bitBuffer.length >= writeWordSize) {
            const outputValue = Number(bitBuffer.shift(writeWordSize));
            outputStream.write(outputValue);
            wordCount++;
        }
    }
    // If there are any remaining bits in the buffer, handle them
    if (bitBuffer.length > 0) {
        // Pad with zeros to match writeWordSize and produce the last output
        bitBuffer.pad(writeWordSize);
        const outputValue = Number(bitBuffer.slice());
        outputStream.write(outputValue);
        wordCount++;
    }
    return wordCount;
  }
}
