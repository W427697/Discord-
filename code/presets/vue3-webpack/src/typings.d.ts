declare module 'global' {
  export default globalThis;
}

declare module 'vue-loader' {
  export const VueLoaderPlugin: any;
}
