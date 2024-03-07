class StringCut extends String {
  constructor(str) {
    super(str);
  }
  through(match) {
    match = String(match);
    const index=this.indexOf(match);
    if (index<0) return this;
    return new StringCut(this.slice(0,index+match.length));
  }
  before(match) {
    match = String(match);
    const index=this.indexOf(match)-1;
    if (index<0) return this;
    return new StringCut(this.slice(0,index-1));
  }
  beforeLast(match) {
    match = String(match);
    const index=this.lastIndexOf(match)-1;
    if (index<0) return this;
    return new StringCut(this.slice(0,index-1));
  }
  after(match) {
    match = String(match);
    const index=this.indexOf(match);
    if (index<0) return this;
    return new StringCut(this.slice(index+match.length));
  }
  afterLast(match) {
    match = String(match);
    const index=this.lastIndexOf(match);
    if (index<0) return this;
    return new StringCut(this.slice(index+match.length));
  }
}
