import { visit } from '../helper';

describe('Navigation', () => {
  before(() => {
    visit('official-storybook');
  });

  it('should search navigation item', () => {
    cy.get('#storybook-explorer-searchfield').click({ force: true });
    cy.get('#storybook-explorer-searchfield').clear();
    cy.get('#storybook-explorer-searchfield').type('syntax');

    cy.get('#storybook-explorer-menu button')
      .should('contain', 'SyntaxHighlighter')
      .and('not.contain', 'a11y');
  });

  it('should display no results after searching a non-existing navigation item', () => {
    cy.get('#storybook-explorer-searchfield').click({ force: true });
    cy.get('#storybook-explorer-searchfield').clear();
    cy.get('#storybook-explorer-searchfield').type('zzzzzzzzzz');

    cy.get('#storybook-explorer-menu button').should('be.hidden');
  });
});

describe('Routing', () => {
  it('should navigate to story basics-actionbar--single-item', () => {
    visit('official-storybook');

    cy.get('#basics-actionbar--single-item').click({ force: true });
    cy.url().should('include', 'path=/story/basics-actionbar--single-item');
  });

  it('should directly visit a certain story and render correctly', () => {
    visit('official-storybook/?path=/story/basics-actionbar--single-item');

    cy.getStoryElement().should('contain.text', 'Clear');
  });
});
