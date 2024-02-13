/// <reference types="cypress" />
// it also works with the Playwright CT workaround format
// import composed from './Button.portable';
// const { CSF3InputFieldFilled } = composed
import * as stories from './Button.stories';
import { composeStories } from '@storybook/react';

const { CSF3InputFieldFilled } = composeStories(stories)

describe('<Button />', () => {
  it('renders', async () => {
    cy.mount(<CSF3InputFieldFilled />)
    cy.get('[data-decorator]').should('exist');
    cy.get('button').should('contain.text', 'I am not clicked');
    const $el = await cy.get('[data-cy-root]')
    const canvasElement = $el.get(0)
    await CSF3InputFieldFilled.play({ canvasElement });
    // Anything after await is completely gone to the void. This won't cause any failures
    cy.get('foo').should('contain.text', 'bar');

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