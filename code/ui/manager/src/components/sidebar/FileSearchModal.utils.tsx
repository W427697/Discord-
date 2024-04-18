import type { ArgTypes } from '@storybook/csf';

export function extractSeededRequiredArgs(argTypes: ArgTypes) {
  const extractedArgTypes = Object.keys(argTypes).reduce(
    (acc, key: keyof typeof argTypes) => {
      const argType = argTypes[key];
      if (typeof argType.type !== 'string' && argType.type.required) {
        switch (argType.type.name) {
          case 'boolean':
            acc[key] = true;
            break;
          case 'number':
            acc[key] = 0;
            break;
          case 'string':
            acc[key] = key;
            break;
          case 'union':
          case 'enum':
          case 'intersection':
            if ('value' in argType.type) {
              acc[key] = argType.type.value[0];
            }
            break;
          case 'array':
            acc[key] = [];
            break;
          case 'object':
            acc[key] = {};
            break;
          case 'function':
            acc[key] = () => {};
            break;
          default:
            break;
        }
      }
      return acc;
    },
    {} as Record<string, any>
  );
  return extractedArgTypes;
}

export async function trySelectNewStory(
  selectStory: (id: string) => Promise<void> | void,
  storyId: string,
  attempt = 1
): Promise<void> {
  if (attempt > 10) {
    throw new Error('We could not select the new story. Please try again.');
  }

  try {
    await selectStory(storyId);
  } catch (e) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return trySelectNewStory(selectStory, storyId, attempt + 1);
  }
}
