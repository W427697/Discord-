import React from 'react';

import { mockProps } from '../layout/app.mockdata';
import { Layout } from './Layout';

const { Preview, Sidebar, Panel, pages } = mockProps;

export default {
  title: 'Layout/New',
  component: Layout,
  args: {
    sidebar: true,
    panel: 'bottom',
    slotMain: <Preview />,
    slotSidebar: <Sidebar />,
    slotPanel: <Panel />,
    slotCustom: pages.map(({ key, route: RouteX, render: Content }) => (
      <RouteX key={key}>
        <Content />
      </RouteX>
    )),
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
