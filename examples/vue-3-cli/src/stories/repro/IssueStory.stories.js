import { app } from '@storybook/vue3';
import { createStore } from 'vuex';

import IssueStory from './IssueStory.vue';

export default {
  title: 'IssueStory',
  component: IssueStory,
};

const Template = (args, { parameters }) => {
  const { initialState } = parameters;
  // Mock the store with initialState passed by a certain story
  app().use(
    createStore({
      state: () => initialState,
    })
  );
  return {
    components: { IssueStory },
    setup: () => ({ args }),
    template: '<IssueStory v-bind="args"/>',
  };
};

export const LoggedIn = Template.bind({});
LoggedIn.parameters = {
  initialState: {
    name: 'Jane Doe',
    authenticated: true,
  },
};

export const LoggedOut = Template.bind({});
LoggedOut.parameters = {
  initialState: {
    name: undefined,
    authenticated: false,
  },
};

export const WithGloballyDefinedButton = (args) => {
  app().use(
    createStore({
      state: () => ({
        foo: 'bar',
      }),
    })
  );
  return {
    components: { IssueStory },
    setup: () => ({ args }),
    template:
      '<IssueStory v-bind="args"/> <GlobalButton label="I am globally defined" sublabel="In preview.ts"/>',
  };
};
