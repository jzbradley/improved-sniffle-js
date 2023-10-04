// Describes a CSS/HTML/SVG color
class Color {
  /**
   * @type {boolean}
   * @readonly
   * @memberof Color
   */
  get isTransparent() { return this.a===0; }
  /**
   * @type {boolean}
   * @readonly
   * @memberof Color
   */
  get isOpaque() {      return this.a===1; }
  #r= 255;  
  /**
   * @type {number}
   * @memberof Color
   */
  get r() { return this.#r; } 
  /**
   * @type {number}
   * @memberof Color
   */
  set r(value) { this.#r=Number(value); }
  #g= 255;  

  /**
   * @type {number}
   * @memberof Color
   */
  get g() { return this.#g; } 
  /**
   * @type {number}
   * @memberof Color
   */
  set g(value) { this.#g=Number(value); }
  #b= 255;  

  /**
   * @type {number}
   * @memberof Color
   */
  get b() { return this.#b; } 
  /**
   * @type {number}
   * @memberof Color
   */
  set b(value) { this.#b=Number(value); }
  #a= 1;    

  /**
   * @type {number}
   * @memberof Color
   */
  get a() { return this.#a; } 
  /**
   * @type {number}
   * @memberof Color
   */
  set a(value) { this.#a=Number(value); }

  toString() {
    return this.isOpaque?`rgb(${this.r},${this.g},${this.b})`
    :`rgba(${this.r},${this.g},${this.b},${this.a})`;
  }

  constructor(color) {
    if (!color) return;

    if (color instanceof Color) {
      this.r= color.r;
      this.g= color.g;
      this.b= color.b;
      this.a= color.a;
      return;
    }
    const computedColor = withTempElement(tempEl=>{
      tempEl.style.color = color;
      return window.getComputedStyle(tempEl).color;
    });
    const rgbMatch = computedColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)/);
    if (!rgbMatch) {
        throw new Error('Invalid color or format not supported');
    }
    this.r= rgbMatch[1];
    this.g= rgbMatch[2];
    this.b= rgbMatch[3];
    this.a= rgbMatch[4] ? rgbMatch[4] : 1;
    
    function withTempElement(callback) {
      const tempEl = document.createElement("div");
      tempEl.style.display='none';
      document.body.appendChild(tempEl);
      const result=callback(tempEl);
      document.body.removeChild(tempEl);
      return result;
    }
  }
}
