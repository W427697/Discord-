let Vue: any = require('vue');

Vue = Vue.default || Vue;

export const vueVersion = Vue.version?.charAt(0) === '3' ? 3 : 2;
