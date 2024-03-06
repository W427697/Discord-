import type { SubmitFunction } from '@sveltejs/kit';

export type EnhanceData = {
  formElement: HTMLFormElement;
  submitFunction: SubmitFunction;
  submitEvent: SubmitEvent;
};

/**
 * This function is based on discussions from this thread:
 * https://github.com/storybookjs/storybook/issues/26206
 * 
 * The objective is to make it possible to test form submissions. 
 */
export function enhance(formElement: HTMLFormElement, submitFunction: SubmitFunction) {
  const listener = (e: Event) => {
    const event = new CustomEvent('storybook:enhance', {
      detail: {
        formElement,
        submitFunction,
        submitEvent: e
      }
    });
    window.dispatchEvent(event);
  };
  formElement.addEventListener('submit', listener);
  return {
    destroy() {
      formElement.removeEventListener('submit', listener);
    }
  };
}
export function applyAction() {}

export function deserialize() {}
