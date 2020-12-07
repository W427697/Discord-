// eslint-disable-next-line global-require
export const Vue: any = require('vue').default || require('vue');

export const isVue3 = Vue.version.charAt(0) === '3';