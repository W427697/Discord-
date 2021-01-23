import dedent from 'ts-dedent';
import * as svelte from 'svelte/compiler';

interface Source {
  source: string;
  hasArgs: boolean;
}
/**
 * Parse a Svelte component and extract stories sources.
 * @param component Component Source
 * @returns Map of storyName -> source
 */
export function extractStoriesSources(component: string): Record<string, Source> {
  // compile
  const { ast } = svelte.compile(component);

  const sources: Record<string, Source> = {};
  svelte.walk(ast.html, {
    enter(node: any) {
      if (node.type === 'InlineComponent' && (node.name === 'Story' || node.name === 'Template')) {
        this.skip();

        const isTemplate = node.name === 'Template';

        // ignore stories without children
        if (node.children.length === 0) {
          return;
        }

        // extract the 'name' attribute
        const nameAtt = node.attributes.find(
          (att: any) => att.type === 'Attribute' && att.name === 'name'
        );

        // extract 'name' value: expecting a constant value, ie one Text node
        let name;
        if (nameAtt) {
          const { value } = nameAtt;
          if (value && value.length === 1 && value[0].type === 'Text') {
            name = value[0].data;
          }
        } else if (isTemplate) {
          name = 'default'; // unnamed template
        }

        if (name) {
          const { start } = node.children[0];
          const { end } = node.children[node.children.length - 1];
          sources[isTemplate ? `tpl:${name}` : name] = {
            source: dedent(component.substr(start, end - start)),
            hasArgs: node.attributes.find((att: any) => att.type === 'Let') != null,
          };
        }
      }
    },
  });

  return sources;
}
