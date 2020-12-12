import { CompilerOptions } from '@vue/compiler-dom';
import { RenderFunction } from '@vue/runtime-dom';
import { Vue } from "vue/typings/vue";

declare module 'vue' {

  export declare function compile(template: string | HTMLElement, options?: CompilerOptions): RenderFunction;

  export * from "@vue/runtime-dom";

  export { VNode as VNode3, ComponentOptions as ComponentOptions3 } from '@vue/runtime-dom';

  export default Vue;

  export {
    CreateElement,
    VueConstructor
  } from "vue/typings/vue";

  export {
    Component,
    AsyncComponent,
    ComponentOptions,
    FunctionalComponentOptions,
    RenderContext,
    PropType,
    PropOptions,
    ComputedOptions,
    WatchHandler,
    WatchOptions,
    WatchOptionsWithHandler,
    DirectiveFunction,
    DirectiveOptions
  } from "vue/typings/options";

  export {
    PluginFunction,
    PluginObject
  } from "vue/typings/plugin";

  export {
    VNodeChildren,
    VNodeChildrenArrayContents,
    VNode,
    VNodeComponentOptions,
    VNodeData,
    VNodeDirective
  } from "vue/typings/vnode";
}
