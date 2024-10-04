    class AttrToggleHTMLElement extends HTMLElement {
      static observedAttributes = ["on","for"];
      constructor() { super(); }
      #setBoolean(attributeName,flag){
        if (flag) {
          this.setAttribute(attributeName, "");
        } else {
          this.removeAttribute(attributeName);
        }
      }
      #setValue(attributeName,value){
        if (value) {
          this.setAttribute(attributeName, value);
        } else {
          this.removeAttribute(attributeName);
        }
      }
      get on() { return this.hasAttribute('on'); }
      set on(flag) {
        this.#setBoolean("on",flag);
      }
      get attr() { return this.getAttribute('attr'); }
      set attr(name) {
        this.#setValue("attr",name);
      }
      get for() { return this.getAttribute('for'); }
      set for(id) {
        this.#setValue("for",id);
      }
      toggle() { this.on=!this.on; }
      get target() {
        const targetId = this.for;
        if (!targetId) return null;
        const root= this.getRootNode();
        if (
          !root ||
          !root.getElementById
        ) return null;
        const targetElement = root.getElementById(targetId);
        return targetElement;
      }
      attributeChangedCallback(name, oldValue, newValue) {
        switch(name) {
          case 'on':
            (()=>{
              const {attr,on}=this;
              this.dispatchEvent(new CustomEvent('ontoggle', {
                detail: {
                  attr:this.attr,
                  state:this.on,
                  for: this.for
                }
              }));
            })();
          case 'for':
          case 'attr':
            this.updateTargetElement();
            break;
        }
      }
      updateTargetElement() {
        const attributeName = this.attr;
        const targetElement = this.target;
        if (targetElement && attributeName) {
          if (this.on) {
            targetElement.setAttribute(attributeName, "");
          } else {
            targetElement.removeAttribute(attributeName);
          }
        }
      }
    }
    customElements.define('attr-toggle',AttrToggleHTMLElement);
