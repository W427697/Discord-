import { visit, clickAddon } from '../helper';

describe('Basic Flow', () => {
  before(() => {
    visit();
  });

  it('should load welcome flow', () => {
    // assert url changes
    cy.url().should('include', 'path=/story/welcome--to-storybook');

    // check for selected element
    cy.get('#explorerwelcome--to-storybook').find('.selected').should('be.visible');

    // check for content
    cy.getStoryElement().should('contain.text', 'Welcome to storybook');
  });

  describe('Button story', () => {
    before(() => {
      cy.get('#explorerbutton').click();
    });

    it('should be visited succesfully', () => {
      // assert url changes
      cy.url().should('include', 'path=/story/button--text');

      // check for selected element
      cy.get('#explorerbutton--text').find('.selected').should('be.visible');

      // check for content
      cy.getStoryElement().should('contain.text', 'Hello Button');
    });

    it('with action', () => {
      // click on the button
      cy.get('#explorerbutton--with-some-emoji-and-action').click();

      // assert url changes
      cy.url().should('include', 'path=/story/button--with-some-emoji-and-action');

      // check for selected element
      cy.get('#explorerbutton--with-some-emoji-and-action').find('.selected').should('be.visible');

      // check for content
      cy.getStoryElement().find('button').click();

      // click on addon
      clickAddon('Actions');

      // TODO @yannbf improve tab identifier on addons
      // get the logs
      cy.get('#storybook-panel-root .simplebar-content')
        .find('li')
        .first()
        .should('contain.text', 'This was clicked ');
    });

    it('with link', () => {
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
});
