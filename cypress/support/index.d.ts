/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to select the DOM element of a story in the canvas tab.
     */
    getStoryElement(): Chainable<Element>;
  }
}
