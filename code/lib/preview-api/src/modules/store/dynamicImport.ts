// Note this is to fool `ts-node` into not turning the `import()` into a `require()`.
// See: https://github.com/TypeStrong/ts-node/discussions/1290
// eslint-disable-next-line @typescript-eslint/no-implied-eval
export const dynamicImport = new Function('specifier', 'return import(specifier)');
