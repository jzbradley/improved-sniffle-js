/*
Example:

<view-selector for="view">
  <view-option for="view1" active>View 1</view-option>
  <view-option for="view2">View 2</view-option>
  <view-option for="view3">View 3</view-option>
</view-selector>
<br>
<view-host id="view">
  <view-option id="view1" active>This is view 1.</view-option>
  <view-option id="view2">This is view 2.</view-option>
  <view-option id="view3">This is view 3.</view-option>
</view-host>

*/

class HTMLViewElement extends HTMLElement { }
class HTMLViewForElement extends HTMLViewElement {
  static get observedAttributes() { return ["for"]; }
  #htmlFor;
  get htmlFor() { return this.#htmlFor; }
  set htmlFor(value) { this.#htmlFor=value; }
  get forElement() { return this.#htmlFor&&this.getRootNode().getElementById(this.#htmlFor); }
  attributeChangedCallback(name, oldValue, newValue) {
    if (name!=='for') return false;
    this.#htmlFor=newValue;
    return true;
  }
}

class HTMLViewSelectorElement extends HTMLViewForElement { 
  static get tagName() { return "view-selector"; }
}
class HTMLViewOptionElement extends HTMLViewForElement {
  static get tagName() { return "view-option"; }
  connectedCallback() {
    this.addEventListener('click',this.#clicked);
  }
  #clicked(ev){
    var selector=selectAncestorOf(this, HTMLViewSelectorElement.tagName);
    if (!selector) return;

    for (const option of selector.querySelectorAll(HTMLViewOptionElement.tagName))
      option.removeAttribute('active');
    this.setAttribute('active','');
    if (!selector.forElement) return;

    var viewHost=selector.forElement;
    if (!viewHost) return;

    for (const option of viewHost.querySelectorAll(HTMLViewOptionElement.tagName))
      option.removeAttribute('active');
    const targetView = this.forElement;
    targetView.setAttribute('active','');

    /**
     * @param {Node} element
     * @param {string} selector
    */
    function selectAncestorOf(element, selector) {
      let current=element.parentNode;
      while(current) {
        if (current instanceof Element && current.matches(selector)) return current;
        current=current.parentNode;
      }
      return null;
    }
  }
}
class HTMLViewHostElement extends HTMLViewElement {
  static get tagName() { return "view-host"; }
}

(()=>{
  for(const elementClass of [
      HTMLViewSelectorElement,
      HTMLViewOptionElement,
      HTMLViewHostElement
    ])
    customElements.define(elementClass.tagName,elementClass);
  
  addStylesheet(`view-host>view-option:not([active]) { display: none; }`);

  function addStylesheet(style,host=document) {
    const stylesheet=new CSSStyleSheet();
    stylesheet.replaceSync(style);
    host.adoptedStyleSheets.push(stylesheet);
  }
})();
