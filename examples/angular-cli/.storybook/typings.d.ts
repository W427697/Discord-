declare module '*.md' {
  const content: string;
  export default content;
}

declare module '*.mdx' {
    let mdx: any;
    export default mdx;
}
