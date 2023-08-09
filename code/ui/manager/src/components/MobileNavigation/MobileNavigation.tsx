import type { ComponentType, FC } from 'react';
import React from 'react';
import { styled } from '@storybook/theming';
import { IconButton } from '@storybook/components/experimental';
import { useStorybookApi } from '@storybook/manager-api';
import { MobileMenuDrawer } from './MobileMenuDrawer';
import { useLayout } from '../layout/_context';
import { MobileAddonsDrawer } from './MobileAddonsDrawer';

interface MobileNavigationProps {
  Sidebar: ComponentType<any>;
  Panel: ComponentType<any>;
}

const Container = styled.div(({ theme }) => ({
  position: 'fixed',
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  bottom: 0,
  left: 0,
  width: '100%',
  height: 40,
  zIndex: 10,
  background: theme.background.content,
  padding: '0 15px',
  borderTop: `1px solid ${theme.appBorderColor}`,
}));

const Left = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
});

const StoryName = styled.div(({ theme }) => ({
  fontSize: theme.typography.size.s2 - 1,
}));

export const MobileNavigation: FC<MobileNavigationProps> = ({ Sidebar, Panel }) => {
  const { isMobileMenuOpen, setMobileMenuOpen, isMobileAddonsOpen, setMobileAddonsOpen } =
    useLayout();
  const api = useStorybookApi();
  const title = api.getCurrentStoryData()?.title || 'Story';

  return (
    <Container>
      <MobileMenuDrawer Sidebar={Sidebar} />
      <MobileAddonsDrawer>
        <Panel />
      </MobileAddonsDrawer>
      <Left>
        <IconButton
          size="small"
          variant="ghost"
          icon="Menu"
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
        />
        <StoryName>{title}</StoryName>
      </Left>
      <IconButton
        size="small"
        variant="ghost"
        icon="BottomBarToggle"
        onClick={() => setMobileAddonsOpen(!isMobileAddonsOpen)}
      />
    </Container>
  );
};
