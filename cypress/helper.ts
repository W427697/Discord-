/* eslint-disable no-unused-expressions */
/* eslint-disable jest/valid-expect */
type StorybookApps = 'official-storybook';

type Addons = 'Knobs';

const getUrl = (app: string, route: string) => {
  if (Cypress.env('location')) {
    return `${Cypress.env('location')}/${route}`;
  }
  return `'http://localhost:8001'/${app}/${route}`;
};

export const visitExample = (app: StorybookApps, route = '') => {
  return cy
    .clearLocalStorage()
    .visit(getUrl(app, route))
    .get(`#storybook-preview-iframe`)
    .then({ timeout: 10000 }, (iframe) => {
      return cy.wrap(iframe, { timeout: 10000 }).should(() => {
        const content: Document | null = (iframe[0] as HTMLIFrameElement).contentDocument;
        const element: HTMLElement | null = content !== null ? content.documentElement : null;

        expect(element).not.null;

        if (element !== null) {
          expect(element.querySelector('#root > *')).not.null;
        }
      });
    });
};

export const clickAddon = (addonName: Addons) => {
  return cy.get(`[role=tablist] button[role=tab]`).contains(addonName).click();
};

export const getStorybookPreview = () => {
  return cy.get(`#storybook-preview-iframe`).then({ timeout: 10000 }, (iframe) => {
    const content: Document | null = (iframe[0] as HTMLIFrameElement).contentDocument;
    const element: HTMLElement | null = content !== null ? content.documentElement : null;

    console.log({ element, content, iframe });

    return cy
      .wrap(iframe)
      .should(() => {
        expect(element).not.null;

        if (element !== null) {
          expect(element.querySelector('#root > *')).not.null;
        }
      })
      .then(() => {
        return cy.wrap(element).get('#root');
      });
  });
};
