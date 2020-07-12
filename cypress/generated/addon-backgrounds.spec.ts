describe('addon-backgrounds', () => {
  before(() => {
    cy.visitStorybook();
  });

  it('should have a dark background', () => {
    // click on the button
    cy.navigateToStory('button', 'with custom background');

    cy.getPreviewIframe().should('have.css', 'background-color', 'rgb(51, 51, 51)');
  });
});
