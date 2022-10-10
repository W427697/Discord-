import globalThis from 'global';
import Vue from 'vue';

Vue.component('global-button', globalThis.Components.Button);
