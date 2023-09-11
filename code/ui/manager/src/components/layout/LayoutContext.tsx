import type { ReactNode } from 'react';
import React, { createContext, useContext, useState } from 'react';
import { useResizeDetector } from 'react-resize-detector';
import { styled } from '@storybook/theming';
import type { IsDesktopProps, IsMobileProps } from './types';

interface LayoutProviderProps {
  children: ReactNode;
}

interface LayoutType {
  isMobile: IsMobileProps;
  isDesktop: IsDesktopProps;
  width: number;
  height: number;
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  isMobileAddonsOpen: boolean;
  setMobileAddonsOpen: (open: boolean) => void;
  isMobileAboutOpen: boolean;
  setMobileAboutOpen: (open: boolean) => void;
  closeMenu: () => void;
  transitionDuration: number;
}

const Layout = createContext<LayoutType>({
  isMobile: false,
  isDesktop: false,
  width: 0,
  height: 0,
  isMobileMenuOpen: false,
  setMobileMenuOpen: () => {},
  isMobileAddonsOpen: false,
  setMobileAddonsOpen: () => {},
  isMobileAboutOpen: false,
  setMobileAboutOpen: () => {},
  closeMenu: () => {},
  transitionDuration: 0,
});

const View = styled.div({
  position: 'fixed',
  overflow: 'hidden',
  height: '100vh',
  width: '100vw',
});

export const LayoutProvider = ({ children }: LayoutProviderProps) => {
  const { width, height, ref } = useResizeDetector();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobileAddonsOpen, setMobileAddonsOpen] = useState(false);
  const [isMobileAboutOpen, setMobileAboutOpen] = useState(false);
  const breakpoint = 600;
  const isMobile = width < breakpoint;
  const isDesktop = width >= breakpoint;

  const closeMenu = () => {
    setMobileMenuOpen(false);

    setTimeout(() => {
      setMobileAboutOpen(false);
    }, 300);
  };

  return (
    <Layout.Provider
      value={{
        isMobile,
        isDesktop,
        width,
        height,
        isMobileMenuOpen,
        setMobileMenuOpen,
        isMobileAddonsOpen,
        setMobileAddonsOpen,
        isMobileAboutOpen,
        setMobileAboutOpen,
        closeMenu,
        transitionDuration: 300,
      }}
    >
      <View ref={ref}>{children}</View>
    </Layout.Provider>
  );
};

export const useLayout = () => useContext(Layout);
