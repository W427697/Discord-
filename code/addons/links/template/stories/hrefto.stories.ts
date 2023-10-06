import { hrefTo } from '@storybook/addon-links';

export default {
  component: globalThis.Components.Html,
  title: 'hrefTo',
  parameters: {
    chromatic: { disable: true },
  },
};

export const Default = {
  render: () => {
    hrefTo('addons-links-hrefto', 'target').then((href) => {
      const root = document.querySelector('#storybook-root');
      if (!root) {
        return;
      }
      const node = document.createElement('code');
      node.innerHTML = href;
      root.appendChild(node);
    });
  },
};
