import { getOptions } from './compiler';

const { pre, codeFenced, codeInline } = getOptions().components;

const Pre = pre;
const CodeFenced = codeFenced;
const CodeInline = codeInline;


export { compile, setOptions } from './compiler';
export { pre, CodeFenced, CodeInline };
