/*
# Index

$crape
  .siblings
    after(from:Element, to?:Element): Element[]
*/

var $crape;
(function ($crape) {
  let siblings;
  (function (siblings) {
    function after(from, to) {
      // Guard clauses
      if (!(from instanceof Element))
        throw "Parameter `from` must be instanceof `Element`";
      if (!to) {
        const parent = from.parentElement;
        if (!parent) throw "Element `from` has no parent element";
        to = parent.lastElementChild;
        if (from === to) return [from];
      } else if (!(to instanceof Element))
        throw "Parameter `to` must be instanceof `Element`";
      else if (from.parentElement !== to.parentElement)
        throw "Element `from` must have the same parent element as `to`";

      // Method
      const list = [from];
      let current = from.nextElementSibling;
      while (current && current !== to) {
        list.push(current);
        current = current.nextElementSibling;
      }
      return list;
    }
    siblings.after = after;
  })((siblings = $crape.siblings || ($crape.siblings = {})));
})($crape || ($crape = {}));
