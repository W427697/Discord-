import globToRegExp from 'glob-to-regexp';

export const mapToRegex = (e: string | RegExp) => {
  switch (true) {
    case e instanceof RegExp: {
      return e;
    }
    case typeof e === 'string': {
      return globToRegExp(e as string, { extended: true });
    }
    default: {
      throw new Error('not supported type in mapToRegex');
    }
  }
};
