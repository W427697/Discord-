/* eslint-env browser */
import { logger } from '@storybook/client-logger';
import { combineParameters } from '@storybook/client-api';

import RegisterContext from './components/RegisterContext.svelte';
import RenderContext from './components/RenderContext.svelte';

/* Called from a webpack loader and a jest transformation.
 *
 * It mounts a Stories component in a context which disables
 * the rendering of every <Story/> and <Template/> but instead
 * collects names and properties.
 *
 * For every discovered <Story/>, it creates a storyFun which
 * instanciate the main Stories component: Every Story but
 * the one selected is disabled.
 */

const createFragment = document.createDocumentFragment
  ? () => document.createDocumentFragment()
  : () => document.createElement('div');

export default (module, sources) => {
  const { default: Stories } = module;

  const repositories = {
    meta: null,
    stories: [],
  };

  // extract all stories
  try {
    const context = new RegisterContext({
      target: createFragment(),
      props: {
        Stories,
        repositories,
      },
    });
    context.$destroy();
  } catch (e) {
    logger.error(`Error extracting stories ${e.toString()}`);
  }

  const { meta } = repositories;
  if (!meta) {
    logger.error('Missing <Meta/> tag');
    return {};
  }

  const { component: globalComponent } = meta;

  // collect templates id
  const templatesId = repositories.stories
    .filter((story) => story.isTemplate)
    .map((story) => story.name);

  // check for duplicate templates
  const duplicateTemplatesId = templatesId.filter(
    (item, index) => templatesId.indexOf(item) !== index
  );

  if (duplicateTemplatesId.length > 0) {
    logger.warn(`Found duplicates templates id :${duplicateTemplatesId}`);
  }

  const found = repositories.stories
    .filter((story) => !story.isTemplate)
    .map((story) => {
      const { name, template, component, source = false, ...props } = story;

      const unknowTemplate = template != null && templatesId.indexOf(template) < 0;

      const storyFn = (args) => {
        if (unknowTemplate) {
          throw new Error(`Story ${name} is referencing an unknown template ${template}`);
        }

        return {
          Component: RenderContext,
          props: {
            Stories,
            storyName: name,
            templateName: template,
            args,
            sourceComponent: component || globalComponent,
          },
        };
      };

      storyFn.storyName = name;
      Object.entries(props).forEach(([k, v]) => {
        storyFn[k] = v;
      });

      // inject story sources
      const storySource = sources[template ? `tpl:${template}` : name];
      const rawSource = storySource ? storySource.source : null;
      if (rawSource) {
        storyFn.parameters = combineParameters(storyFn.parameters || {}, {
          storySource: {
            source: rawSource,
          },
        });
      }

      // inject source snippet
      const hasArgs = storySource ? storySource.hasArgs : true;

      let snippet;

      if (source === true || (source === false && !hasArgs)) {
        snippet = rawSource;
      } else if (typeof source === 'string') {
        snippet = source;
      }

      if (snippet) {
        storyFn.parameters = combineParameters(storyFn.parameters || {}, {
          docs: { source: { code: snippet } },
        });
      }

      return storyFn;
    });

  return {
    default: meta,
    ...found,
  };
};
