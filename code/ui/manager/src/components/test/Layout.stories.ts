import { Layout } from './Layout';

export default {
  title: 'Layout/New',
  component: Layout,
  args: {
    sidebar: true,
    panel: 'bottom',
    mainContent: 'Main Content',
    sidebarContent: 'Sidebar Content',
    panelContent: 'Panel Content',
    customContent: 'Custom Content',
  },
};

export const Desktop = {};
export const DesktopHorizontal = {
  args: {
    panel: 'right',
  },
};

export const DesktopDocs = {
  args: {
    viewMode: 'docs',
  },
};

export const DesktopCustom = {
  args: {
    viewMode: 'custom',
  },
};

export const Mobile = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
export const MobileHorizontal = {
  args: {
    panel: 'right',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const MobileDocs = {
  args: {
    viewMode: 'docs',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const MobileCustom = {
  args: {
    viewMode: 'custom',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
