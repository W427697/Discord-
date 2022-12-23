import { action } from '@storybook/addon-actions';
import React from 'react';

import { mockProps, MockPage } from '../layout/app.mockdata';
import { Layout } from './Layout';

const { Preview, Sidebar, Panel } = mockProps;

export default {
  title: 'Layout/New',
  component: Layout,
  args: {
    state: {
      sidebar: true,
      panel: true,
      panelPosition: 'bottom',
      viewMode: 'story',
    },
    setState: action('setState'),
    slotMain: <Preview />,
    slotSidebar: <Sidebar />,
    slotPanel: <Panel />,
    slotCustom: <MockPage />,
  },
};

export const Desktop = {};
export const DesktopHorizontal = {
  args: {
    state: { panelPosition: 'right' },
  },
};

export const DesktopDocs = {
  args: {
    state: { viewMode: 'docs' },
  },
};

export const DesktopCustom = {
  args: {
    state: { viewMode: 'custom' },
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
    state: { panelPosition: 'right' },
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const MobileDocs = {
  args: {
    state: { viewMode: 'docs' },
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const MobileCustom = {
  args: {
    state: { viewMode: 'custom' },
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
