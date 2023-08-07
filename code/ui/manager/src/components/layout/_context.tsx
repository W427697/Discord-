import type { ReactNode } from 'react';
import React, { createContext, useContext, useState } from 'react';
import type { IsDesktopProps, IsMobileProps } from './_types';

interface LayoutProviderProps {
  children: ReactNode;
  isMobile: IsMobileProps;
  isDesktop: IsDesktopProps;
  width: number;
  height: number;
}

interface LayoutType {
  isMobile: IsMobileProps;
  isDesktop: IsDesktopProps;
  width: number;
  height: number;
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  isMobileAboutOpen: boolean;
  setMobileAboutOpen: (open: boolean) => void;
  closeMenu: () => void;
}

export const Layout = createContext<LayoutType>({
  isMobile: false,
  isDesktop: false,
  width: 0,
  height: 0,
  isMobileMenuOpen: false,
  setMobileMenuOpen: () => {},
  isMobileAboutOpen: false,
  setMobileAboutOpen: () => {},
  closeMenu: () => {},
});

export const LayoutProvider = ({
  children,
  isMobile,
  isDesktop,
  width,
  height,
}: LayoutProviderProps) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobileAboutOpen, setMobileAboutOpen] = useState(false);

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
        isMobileAboutOpen,
        setMobileAboutOpen,
        closeMenu,
      }}
    >
      {children}
    </Layout.Provider>
  );
};

export const useLayout = () => useContext(Layout);
