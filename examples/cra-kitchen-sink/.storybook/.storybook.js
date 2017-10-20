export const uiOptions = {
  name: 'CRA Kitchen Sink',
  url: 'https://github.com/storybooks/storybook/tree/master/examples/cra-kitchen-sink',
  layout: {
    direction: 'row',
    items: [
      {
        size: 300,
        resize: 'fixed',
        component: 'addonTabs',
        props: {
          selected: 'action',
        },
      },
      {
        size: 800,
        minSize: 400,
        resize: 'stretch',
        component: 'preview',
        props: {
          primary: true,
        },
      },
      {
        size: 300,
        resize: 'dynamic',
        component: 'explorer',
      },
    ],
  },
};
