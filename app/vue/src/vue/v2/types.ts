import { Component, AsyncComponent } from 'vue';

export { RenderContext } from '@storybook/core';

// TODO: some vue expert needs to look at this
export type VueComponent = Component<any, any, any, any> | AsyncComponent<any, any, any, any>;

export type StoryFnVueReturnType = string | Component;
