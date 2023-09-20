import type { FC } from 'react';
import React, { useState } from 'react';
import { styled } from '@storybook/theming';
import { IconButton, Icons } from '@storybook/components';
import { MobileMenuDrawer } from './MobileMenuDrawer';
import { MobileAddonsDrawer } from './MobileAddonsDrawer';
import { useMobileLayoutContext } from '../MobileLayoutProvider';

interface MobileNavigationProps {
  storyTitle?: string | null | undefined;
  sidebar?: React.ReactNode;
  panel?: React.ReactNode;
}

export const MobileNavigation: FC<MobileNavigationProps> = ({ storyTitle, sidebar, panel }) => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { isMobileAboutOpen, setMobileAboutOpen, setMobilePanelOpen } = useMobileLayoutContext();

  const closeMenu = () => {
    setMenuOpen(false);

    setTimeout(() => {
      setMobileAboutOpen(false);
    }, 300);
  };

  return (
    <Container>
      <MobileMenuDrawer
        isMenuOpen={isMenuOpen}
        isAboutOpen={isMobileAboutOpen}
        setAboutOpen={setMobileAboutOpen}
        closeMenu={closeMenu}
      >
        {sidebar}
      </MobileMenuDrawer>
      <MobileAddonsDrawer>{panel}</MobileAddonsDrawer>
      <Button onClick={() => setMenuOpen(!isMenuOpen)}>
        <Icons icon="menu" />
        {storyTitle || 'Story'}
      </Button>
      <DrawerIconButton onClick={() => setMobilePanelOpen(true)}>
        <Icons icon="bottombartoggle" />
      </DrawerIconButton>
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
}));
