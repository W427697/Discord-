export const isDependencyInstalled = (dependency: string) => {
  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    require(`${dependency}/package.json`);
    return true;
  } catch (e) {
    return false;
  }
};
