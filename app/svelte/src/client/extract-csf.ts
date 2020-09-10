/* eslint-env browser */
import RegisterContext from './components/RegisterContext.svelte';

// This is the name that will be used for the story named 'default'.
//
// If the `_default` export is already taken (by a user's own named export), then
// a numeric index will be appended and increased until a free name is found.
//
// TODO What's the officially recommended default name?
//
const canonicalDefaultName = '_default';

const createFragment = document.createDocumentFragment
  ? () => document.createDocumentFragment()
  : () => document.createElement('div');

const defaultStoryName = (xports: { [x: string]: any }) => {
  if (!xports[canonicalDefaultName]) {
    return canonicalDefaultName;
  }
  let lastDefaultIndex = 0;
  let name;
  do {
    lastDefaultIndex += 1;
    name = `${canonicalDefaultName}${lastDefaultIndex}`;
  } while (xports[name] !== undefined);
  return name;
};

// Extracts CSF from a Svelte component's `module.exports` object. The returned
// value is expected to be used to replace the component's `module.exports` in
// order to turn the component module into a proper CSF module.
export default (xports: { default?: any }) => {
  const Stories = xports.default;
  const result: {
    default?: any;
    [key: string]: any;
  } = {};

  const register = {
    addMeta: (config: any) => {
      if (result.default) {
        throw new Error('Only one meta component is allowed per stories file');
      }

      result.default = config;
    },
    addStory: (story: {
      name: any;
      component: any;
      parameters: any;
      decorators: any;
      argTypes: any;
    }) => {
      const { name, parameters, decorators, argTypes, component } = story;

      const storyFn = (args: any) => {
        return {
          Component: component || result.default.component,
          props: args,
        };
      };
      if (name) {
        storyFn.storyName = name;
      }
      if (parameters) {
        storyFn.parameters = parameters;
      }
      if (decorators) {
        storyFn.decorators = decorators;
      }
      if (argTypes) {
        storyFn.argTypes = argTypes;
      }

      const prop = name === 'default' ? defaultStoryName(xports) : name;
      result[prop] = storyFn;
    },
  };

  // run a register phase to render Story and Meta components that will
  // register themselves
  const cmp = new RegisterContext({
    target: createFragment(),
    props: {
      Stories,
      register,
    },
  });
  cmp.$destroy();

  // goal: not having an error while a stories file is still empty (when it has
  // just been created)
  if (!result.default) {
    return xports;
  }
  if (!result.default.title) {
    throw new Error('Meta component with title is required');
  }

  result.default.excludeStories = Object.keys(xports).filter((name) => name !== 'default');

  return { ...xports, ...result };
};
