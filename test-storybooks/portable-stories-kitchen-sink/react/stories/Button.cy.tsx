/// <reference types="cypress" />
// it also works with the Playwright CT workaround format
// import composed from './Button.portable';
// const { CSF3InputFieldFilled } = composed
import * as stories from './Button.stories';
import { composeStories } from '@storybook/react';

const { CSF3Primary, LoaderStory } = composeStories(stories)

describe('<Button />', () => {
  it('renders primary button', async () => {
    cy.mount(<CSF3Primary />)
    cy.get('[data-decorator]').should('exist');
  })

  it.skip('renders with play function', async () => {
    await LoaderStory.load();
    cy.mount(<LoaderStory />)
    cy.get('[data-decorator]').should('exist');
    cy.get('[data-testid="loaded-data"]').should('contain.text', 'bar');
    cy.get('[data-testid="spy-data"]').should('contain.text', 'mocked');
    const $el = await cy.get('[data-cy-root]')
    const canvasElement = $el.get(0)
    await LoaderStory.play({ canvasElement });
    // Anything after await is completely gone to the void. This won't cause any failures
    // cy.get('foo').should('contain.text', 'bar');

    // Potentially this would be the proper way, 
    // cy.mount(<CSF3InputFieldFilled />)
    // cy.get('[data-decorator]').should('exist');
    // cy.get('button').should('contain.text', 'I am not clicked');
    // cy.get('[data-cy-root]').then(async ($el) => {
    //   const playPromise = CSF3InputFieldFilled.play({ canvasElement: $el.get(0) });
    //   cy.wrap(playPromise).then(() => {
    //     console.log('resolve play')
    //     cy.get('button').should('contain.text', 'I am clicked');
    //   });
    // });
  })
})