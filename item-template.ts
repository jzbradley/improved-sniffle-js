type ValuesOf<T>
  = T extends { [k: string|number]: infer V; } ? V : any;
type EntriesOf<T> = [keyof T, ValuesOf<T>][];
type TemplateLists
  = {[name:string]:string[]};
type TemplateParameters
  = { [name:string]:string };
type ItemTemplate
  = (parameters:TemplateParameters)=>string;
function anyElementOf<T>(array:T[]) {
  return array.length?array[
    Math.random()*array.length
  ]:undefined;
}
function chooseParameters(
  lists:EntriesOf<TemplateLists>,
  fallback="",
  selector=anyElementOf<string>
): EntriesOf<TemplateParameters> {
  return (
    lists.map(([name,list])=>[
      name,selector(list)||fallback
    ])
  );
}
function makeItem
  <T extends TemplateLists = TemplateLists>(
    lists:T,
    templates:ItemTemplate[],
    fallback="",
    selector=anyElementOf<string>
  ) {
  const parameters = Object.fromEntries(chooseParameters(Object.entries(lists), fallback, selector));
  const template = anyElementOf(templates) || (p=>JSON.stringify(p));
  return template(parameters);
}
