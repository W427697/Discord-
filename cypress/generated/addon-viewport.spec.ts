import { visit } from '../helper';

describe('addon-viewport', () => {
  before(() => {
    visit();
  });

  it('should have viewport button in the toolbar', () => {
    // Click on viewport button and select small mobile
    cy.get('[title="Change the size of the preview"]').click();
    cy.get('#mobile1').click();

    // Check that Welcome story is still displayed
    cy.getStoryElement().should('contain.text', 'Welcome to storybook');
  });
});
