import actions from './actions';
import initApi from './configs/init_api';

export default {
  actions,
  defaultState: {
    uiOptions: {
      name: 'STORYBOOK',
      url: 'https://github.com/storybooks/storybook',
      sortStoriesByKind: false,
      hierarchySeparator: '/',
      sidebarAnimations: true,
      layout: {
        direction: 'row',
        items: [
          {
            size: 300,
            minSize: 230,
            resize: 'dynamic',
            component: 'explorer',
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
            minSize: 230,
            resize: 'dynamic',
            component: 'addonTabs',
            props: {
              selected: 'action',
            },
          },
        ],
      },
    },
  },
  load({ clientStore, provider }, _actions) {
    initApi(provider, clientStore, _actions);
  },
};
