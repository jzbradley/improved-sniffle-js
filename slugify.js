function Replacer(pattern, replacer = "") {
  return (text) => text.replace(pattern, replacer);
}
const toLowerChars = (text) => text.toLowerCase();
const replaceChars = Replacer(/(\s|_)+/g, "_");
const keepChars = Replacer(/[^a-z0-9_\-\.~!\$&'\(\)\*\+,;=:@]+/g);
const trimChars = Replacer(/(^_+)|(_+$)/g);
const slugifyProcess = [
  toLowerChars,
  replaceChars,
  keepChars,
  trimChars
];
function slugify(title) {
  return slugifyProcess.reduce((text, fn) => fn(text), title);
}
