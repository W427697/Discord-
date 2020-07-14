import { window } from 'global';

declare global {
  interface Window {
    /**
     * Unused in @storybook/vue.
     */
    STORYBOOK_REACT_CLASSES: Record<string, any>;

    /**
     * Current environment storybook is running in.
     */
    STORYBOOK_ENV: string;
  }
}

window.STORYBOOK_REACT_CLASSES = {};
window.STORYBOOK_ENV = 'vue';
