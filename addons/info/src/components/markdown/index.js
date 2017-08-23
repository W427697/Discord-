import { getOptions } from './compiler';

const { pre, codeFenced, codeInline } = getOptions().components;

export { compile, setOptions } from './compiler';
export { pre, codeFenced, codeInline };
