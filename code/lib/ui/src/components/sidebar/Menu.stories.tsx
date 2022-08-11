import React, { Fragment, FunctionComponent } from 'react';

import { WithTooltip, TooltipLinkList, Icons } from '@storybook/components';
import { styled } from '@storybook/theming';
import { within, userEvent } from '@storybook/testing-library';
import { MenuItemIcon, SidebarMenu, ToolbarMenu } from './Menu';
import { useMenu } from '../../containers/menu';

export default {
  component: MenuItemIcon,
  title: 'UI/Sidebar/Menu',
  decorators: [
    (StoryFn: FunctionComponent) => (
      <Fragment>
        <StoryFn />
      </Fragment>
    ),
  ],
};

const fakemenu = [
  { title: 'has icon', left: <MenuItemIcon icon="check" />, id: 'icon' },
  {
    title: 'has imgSrc',
    left: <MenuItemIcon imgSrc="https://storybook.js.org/images/placeholders/20x20.png" />,
    id: 'img',
  },
  { title: 'has neither', left: <MenuItemIcon />, id: 'non' },
];

export const Items = () => <TooltipLinkList links={fakemenu} />;

export const Real = () => <SidebarMenu menu={fakemenu} />;

export const Toolbar = () => <ToolbarMenu menu={fakemenu} />;

const DoubleThemeRenderingHack = styled.div({
  '#root > [data-side="left"] > &': {
    textAlign: 'right',
  },
});

export const Expanded = () => {
  const menu = useMenu(
    {
      // @ts-ignore
      getShortcutKeys: () => ({}),
      getAddonsShortcuts: () => ({}),
      versionUpdateAvailable: () => false,
      releaseNotesVersion: () => '6.0.0',
    },
    false,
    false,
    false,
    false,
    false
  );
  return <SidebarMenu menu={menu} />;
};
Expanded.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const menuButton = await canvas.getByRole('button');
  await userEvent.click(menuButton);
};

export const ExpandedWithoutReleaseNotes = () => {
  const menu = useMenu(
    {
      // @ts-ignore
      getShortcutKeys: () => ({}),
      getAddonsShortcuts: () => ({}),
      versionUpdateAvailable: () => false,
      releaseNotesVersion: () => undefined,
    },
    false,
    false,
    false,
    false,
    false
  );
  return <SidebarMenu menu={menu} />;
};
ExpandedWithoutReleaseNotes.play = Expanded.play;
