import type { ReactNode } from 'react';
import React, { createContext, useContext, useState } from 'react';
import type { IsDesktopProps, IsMobileProps } from './_types';

interface LayoutType {
  isMobile: IsMobileProps;
  isDesktop: IsDesktopProps;
  width: number;
  height: number;
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Layout = createContext<LayoutType>({
  isMobile: false,
  isDesktop: false,
  width: 0,
  height: 0,
  isMobileMenuOpen: false,
  setMobileMenuOpen: () => {},
});

interface Props {
  children: ReactNode;
  isMobile: IsMobileProps;
  isDesktop: IsDesktopProps;
  width: number;
  height: number;
}

export const LayoutProvider = ({ children, isMobile, isDesktop, width, height }: Props) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <Layout.Provider
      value={{
        isMobile,
        isDesktop,
        width,
        height,
        isMobileMenuOpen,
        setMobileMenuOpen,
      }}
    >
      {children}
    </Layout.Provider>
  );
};

export const useLayout = () => useContext(Layout);
