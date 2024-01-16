import path from 'path';

export const rendererPathToName = (rendererPath?: string) => {
  const value = rendererPath?.split(path.sep).pop()?.toLowerCase();

  if (!value) {
    return undefined;
  }

  if (value.includes('vue')) {
    return 'vue';
  }

  return value;
};

export const normalizeBuilderName = (builderValue?: string | { name: string }) => {
  if (!builderValue) {
    return undefined;
  }

  const name = typeof builderValue === 'string' ? builderValue : builderValue.name;

  return name.includes('webpack5') ? 'webpack5' : name;
};
