
/**
 * @typedef {(localName: string) => Attr} CreateAttributeMethod
 */
/**
 * @typedef {(data: string) => CDATASection} CreateCDATASectionMethod
 */
/**
 *  @typedef {(data: string) => Comment} CreateCommentMethod
 **/
/**
 *  @typedef {() => DocumentFragment} CreateDocumentFragmentMethod
 **/
/**
 *  @typedef {(namespace: string | null, qualifiedName: string | null, doctype?: DocumentType) => Document } CreateDocumentMethod
 **/
/**
 *  @typedef {(qualifiedName: string, publicId: string, systemId: string) => DocumentType} CreateDocumentTypeMethod
 **/
/**
 *  @typedef {<K extends keyof HTMLElementTagNameMap>(tagName: K, options?: ElementCreationOptions) => HTMLElementTagNameMap[K]} CreateElementMethod
 **/
/**
 *  @typedef {(target: string, data: string) => ProcessingInstruction} CreateProcessingInstructionMethod
 **/
/**
 *  @typedef {(data: string) => Text} CreateTextNodeMethod
 **/

/**
 * @typedef {CreateAttributeMethod | CreateCDATASectionMethod | CreateCommentMethod | CreateDocumentFragmentMethod | CreateDocumentMethod | CreateDocumentTypeMethod | CreateElementMethod | CreateProcessingInstructionMethod | CreateTextNodeMethod} CreateNodeMethod
 */

/*
`NodeType` maps the different node types in the DOM to their corresponding numeric values and string representations.
It uses destructuring assignment to extract the node type constants from the `Node` object and then creates a new object with the
same keys and values, but with the values also used as keys.
This allows for easy lookup of the node type values using either the numeric value or the string representation.
*/
const NodeType=(()=>{
  const {
    ATTRIBUTE_NODE,
    CDATA_SECTION_NODE,
    COMMENT_NODE,
    DOCUMENT_FRAGMENT_NODE,
    DOCUMENT_NODE,
    DOCUMENT_TYPE_NODE,
    ELEMENT_NODE,
    PROCESSING_INSTRUCTION_NODE,
    TEXT_NODE
  }=Node;
  
  return {
    ATTRIBUTE_NODE, [ATTRIBUTE_NODE]:'ATTRIBUTE_NODE',
    CDATA_SECTION_NODE, [CDATA_SECTION_NODE]:'CDATA_SECTION_NODE',
    COMMENT_NODE, [COMMENT_NODE]:'COMMENT_NODE',
    DOCUMENT_FRAGMENT_NODE, [DOCUMENT_FRAGMENT_NODE]:'DOCUMENT_FRAGMENT_NODE',
    DOCUMENT_NODE, [DOCUMENT_NODE]:'DOCUMENT_NODE',
    DOCUMENT_TYPE_NODE, [DOCUMENT_TYPE_NODE]:'DOCUMENT_TYPE_NODE',
    ELEMENT_NODE, [ELEMENT_NODE]:'ELEMENT_NODE',
    PROCESSING_INSTRUCTION_NODE, [PROCESSING_INSTRUCTION_NODE]:'PROCESSING_INSTRUCTION_NODE',
    TEXT_NODE, [TEXT_NODE]:'TEXT_NODE'
  };
})();

/**
 * @param {keyof NodeType} nodeType 
 * @param {Document} baseNode
 * @returns {CreateNodeMethod}
 */
function nodeCreateMethod(nodeType,baseNode=document) {
  const {
    createAttribute,
    createCDATASection,
    createComment,
    createDocumentFragment,
    createElement,
    createProcessingInstruction,
    createTextNode
  }=baseNode;
  const {
    createDocumentType,
    createDocument
  }=baseNode.implementation;

  switch(nodeType) {
    case NodeType.ATTRIBUTE: case 'ATTRIBUTE_NODE':                           return createAttribute;
    case NodeType.CDATA_SECTION: case 'CDATA_SECTION_NODE':                   return createCDATASection;
    case NodeType.COMMENT: case 'COMMENT_NODE':                               return createComment;
    case NodeType.DOCUMENT_FRAGMENT: case 'DOCUMENT_FRAGMENT_NODE':           return createDocumentFragment;
    case NodeType.DOCUMENT: case 'DOCUMENT_NODE':                             return createDocument;
    case NodeType.DOCUMENT_TYPE: case 'DOCUMENT_TYPE_NODE':                   return createDocumentType;
    case NodeType.ELEMENT: case 'ELEMENT_NODE':                               return createElement;
    case NodeType.PROCESSING_INSTRUCTION: case 'PROCESSING_INSTRUCTION_NODE': return createProcessingInstruction;
    case NodeType.TEXT: case 'TEXT_NODE':                                     return createTextNode;
  }
  throw new Error('Unsupported NodeType: '+nodeType);
}
