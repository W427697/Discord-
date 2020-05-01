import { visit, clickAddon } from '../helper';

describe('addon-link', () => {
  before(() => {
    visit();
    cy.get('#explorerbutton').click();
  });

  it('should redirect to another story', () => {
    // click on the button
    cy.get('#explorerbutton--button-with-link-to-another-story').click();

    // assert url changes
    cy.url().should('include', 'path=/story/button--button-with-link-to-another-story');

    // check for selected element
    cy.get('#explorerbutton--button-with-link-to-another-story')
      .find('.selected')
      .should('be.visible');

    // check for content
    cy.getStoryElement().find('button').click();

    // assert url changes
    cy.url().should('include', 'path=/story/welcome--to-storybook');
  });
});
