export const entries = ['*.stories.*'];

export const output = [{}];

export const webpack = [
  async (base, config) => {
    const e = await config.entries;
    const o = await config.output;

    return () => ({
      entries: e,
      output: o,
    });
  },
];
export const server = [{}];
