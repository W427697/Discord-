import type { FC } from 'react';
import React, { useState } from 'react';
import { styled } from '@storybook/theming';
import { useStorybookApi } from '@storybook/manager-api';
import { Button, IconButton, Icons } from '@storybook/components';
import { MobileMenuDrawer } from './MobileMenuDrawer';
import { MobileAddonsDrawer } from './MobileAddonsDrawer';
import Panel from '../../container/Panel';

const Container = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  bottom: 0,
  left: 0,
  width: '100%',
  height: 40,
  zIndex: 10,
  background: theme.background.content,
  padding: '0 6px',
  borderTop: `1px solid ${theme.appBorderColor}`,
}));

export const MobileNavigation: FC = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isAddonsOpen, setAddonsOpen] = useState(false);
  const [isAboutOpen, setAboutOpen] = useState(false);
  const api = useStorybookApi();
  const title = api.getCurrentStoryData()?.title || 'Story';

  const closeMenu = () => {
    setMenuOpen(false);

    setTimeout(() => {
      setAboutOpen(false);
    }, 300);
  };

  return (
    <Container>
      <MobileMenuDrawer isMenuOpen={isMenuOpen} isAboutOpen={isAboutOpen} closeMenu={closeMenu} />
      <MobileAddonsDrawer isAddonsOpen={isAddonsOpen}>
        <Panel />
      </MobileAddonsDrawer>
      <Button onClick={() => setMenuOpen(!isMenuOpen)}>{title}</Button>
      <IconButton onClick={() => setAddonsOpen(!isAddonsOpen)}>
        <Icons icon="bottombartoggle" />
      </IconButton>
    </Container>
  );
};
