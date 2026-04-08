class BitArray {
  #view: Uint8Array<ArrayBuffer | (SharedArrayBuffer & ArrayBufferView<ArrayBufferLike>)>;
  get buffer () { return this.#view.buffer; }
  get length () { return this.#view.length * 8; }

  constructor (source: ArrayBufferLike, byteOffset=0, byteLength=source.byteLength) {
    if (!(source instanceof ArrayBuffer || ArrayBuffer.isView(source)))
      throw new TypeError("`source` must be an ArrayBuffer or view");
    this.#view = new Uint8Array(source, byteOffset, byteLength);
  }

  read (width:number, offset:number, signed=false, littleEndian=true) {
    if (width > (this.length - offset))
      throw new RangeError(`Insufficient source length when reading ${width} bits at offset ${offset}.`);

    const partialWord = width !== 32;

    const skip = offset & 7;
    offset >>>= 3;
    
    const valuePart = 0xffffffff >>> (32 - width);
    width += skip;

    let value = 0;
    for (let i = 0; i < width; i += 8) value |= this.#view[offset++] << i;

    if (littleEndian) value >>>= skip;
    else value = BitArray.#bswap32(value) >>> (32 - width);

    value &= valuePart;

    if (!signed) return value >>> 0;
    
    const signPart = (valuePart + 1) >>> 1;
    return (
      partialWord && (value & signPart)
      ? value | (-1 ^ valuePart)
      : value
    );
  }

  write (width:number, offset:number, value:number, littleEndian=true) {
    if (width > (this.length - offset))
      throw new RangeError(`Insufficient destination length when writing ${width} bits at offset ${offset}`);

    const mask = 0xffffffff >>> (32 - width);
    const keep = offset & 7;
    offset >>>= 3;
    width += keep;

    let initial = 0;
    for (let i = 0, j = offset; i < width; i += 8, j++)
      initial |= this.#view[j] << i;
    if (littleEndian) 
      value = (initial & ~(mask << keep)) | (value << keep);
    else {
      initial = BitArray.#bswap32(initial);
      value = (initial & ~(mask << 32 - width)) | (value << 32 - width);
      value = BitArray.#bswap32(value);
    }

    for (let i = 0, j = offset; i < width; i += 8, j++)
      this.#view[j] = value >>> i;
  }

  static #bswap32 (x:number) {
    return (
      ((x & 0xff000000) >>> 24)
      | ((x & 0x00ff0000) >>> 8)
      | ((x & 0x0000ff00) << 8)
      | ((x & 0x000000ff) << 24)
    ) >>> 0;
  }
}
