/// <reference types="cypress" />
import * as stories from './Button.stories';
import { composeStories } from '@storybook/vue3';

const { CSF3Primary } = composeStories(stories)

describe('<Button />', () => {
  it('renders primary button', async () => {
    // TODO: Something wrong is happening here where the component is being mounted twice
    cy.mount(CSF3Primary())
  })
})