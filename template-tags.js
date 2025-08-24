// allows <template tag-name="..."> to define web component tags.
// classes are stored in window.TemplateElements[tagName] for extension.
window.addEventListener('DOMContentLoaded', () => {
  if ("TemplateElements" in window) return;
  window.TemplateElements = {};
  const templates = document.querySelectorAll('template[tag-name]');
  templates.forEach(template => {
    const tagName = template.getAttribute('tag-name');
    if (!tagName.includes('-')) {
      console.error(
        `Error: The tag-name "${tagName}" is not valid. ` +
        `Custom element names must contain a hyphen (-).`
      );
      return;
    }
    const TemplateElement = class extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const templateContent = template.content.cloneNode(true);
        this.shadowRoot.appendChild(templateContent);
      }
    };
    try {
      customElements.define(tagName, TemplateElement);
      window.TemplateElements[tagName] = TemplateElement;
      console.log(`Successfully defined <${tagName}> element.`);
    } catch (error) {
      console.error(`Failed to define <${tagName}>:`, error);
    }
  });
});
