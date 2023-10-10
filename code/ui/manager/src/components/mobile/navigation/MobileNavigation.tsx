import type { FC } from 'react';
import React from 'react';
import { styled } from '@storybook/theming';
import { IconButton, Icons } from '@storybook/components';
import { useStorybookApi, useStorybookState } from '@storybook/manager-api';
import { MobileMenuDrawer } from './MobileMenuDrawer';
import { MobileAddonsDrawer } from './MobileAddonsDrawer';
import { useLayout } from '../../layout/LayoutProvider';

interface MobileNavigationProps {
  menu?: React.ReactNode;
  panel?: React.ReactNode;
  showPanel: boolean;
}

/**
 * walks the tree from the current story to combine story+component+folder names into a single string
 */
const useFullStoryName = () => {
  const { index } = useStorybookState();
  const currentStory = useStorybookApi().getCurrentStoryData();

  if (!currentStory) return '';

  let fullStoryName = currentStory.renderLabel?.(currentStory) || currentStory.name;
  let node = index[currentStory.id];

  while ('parent' in node && node.parent && index[node.parent] && fullStoryName.length < 24) {
    node = index[node.parent];
    const parentName = node.renderLabel?.(node) || node.name;
    fullStoryName = `${parentName}/${fullStoryName}`;
  }
  return fullStoryName;
};

export const MobileNavigation: FC<MobileNavigationProps> = ({ menu, panel, showPanel }) => {
  const { isMobileMenuOpen, setMobileMenuOpen, setMobilePanelOpen } = useLayout();
  const fullStoryName = useFullStoryName();

  return (
    <Container>
      <MobileMenuDrawer>{menu}</MobileMenuDrawer>
      <MobileAddonsDrawer>{panel}</MobileAddonsDrawer>
      <Button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} title="Open navigation menu">
        <Icons icon="menu" />
        <Text>{fullStoryName}</Text>
      </Button>
      {showPanel && (
        <DrawerIconButton onClick={() => setMobilePanelOpen(true)} title="Open addon panel">
          <Icons icon="bottombartoggle" />
        </DrawerIconButton>
      )}
    </Container>
  );
};

const Container = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  bottom: 0,
  left: 0,
  width: '100%',
  height: 40,
  zIndex: 10,
  background: theme.barBg,
  padding: '0 6px',
  borderTop: `1px solid ${theme.appBorderColor}`,
  color: theme.color.mediumdark,
}));

// We should not have to reset the margin-top here
// TODO: remove this once we have a the new IconButton component
const DrawerIconButton = styled(IconButton)({
  marginTop: 0,
});

const Button = styled.button(({ theme }) => ({
  all: 'unset',
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  color: 'currentColor',
  fontSize: `${theme.typography.size.s2 - 1}px`,
  padding: '0 7px',
  fontWeight: theme.typography.weight.bold,
  WebkitLineClamp: 1,

  '> svg': {
    width: 14,
    height: 14,
    flexShrink: 0,
  },
}));

const Text = styled.p({
  display: '-webkit-box',
  WebkitLineClamp: 1,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
});
