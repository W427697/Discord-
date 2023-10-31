import type { FC, PropsWithChildren } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { themes } from '@storybook/theming';
import { useMediaQuery } from '../hooks/useMedia';
import { BREAKPOINT } from '../../constants';

type LayoutContextType = {
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileAboutOpen: boolean;
  setMobileAboutOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isMobilePanelOpen: boolean;
  setMobilePanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDesktop: boolean;
  isMobile: boolean;
  themeVersion: '1.0' | '2.0';
};

const LayoutContext = createContext<LayoutContextType>({
  isMobileMenuOpen: false,
  setMobileMenuOpen: () => {},
  isMobileAboutOpen: false,
  setMobileAboutOpen: () => {},
  isMobilePanelOpen: false,
  setMobilePanelOpen: () => {},
  isDesktop: false,
  isMobile: false,
  themeVersion: '2.0',
});

interface LayoutProviderProps extends PropsWithChildren {
  managerState: any;
}

export const LayoutProvider: FC<LayoutProviderProps> = ({ children, managerState }) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [isMobilePanelOpen, setMobilePanelOpen] = useState(false);
  const isDesktop = useMediaQuery(`(min-width: ${BREAKPOINT}px)`);
  const isMobile = !isDesktop;
  const [themeVersion, setThemeVersion] = useState<LayoutContextType['themeVersion']>('2.0');

  useEffect(() => {
    const isThemeDifferentFromDefaultTheme = (theme: 'light' | 'dark') => {
      if (managerState?.theme) {
        if (themes[theme].colorPrimary !== managerState.theme.colorPrimary) return true;
        if (themes[theme].colorSecondary !== managerState.theme.colorSecondary) return true;
        if (themes[theme].appBg !== managerState.theme.appBg) return true;
        if (themes[theme].appContentBg !== managerState.theme.appContentBg) return true;
        if (themes[theme].appBorderColor !== managerState.theme.appBorderColor) return true;
        if (themes[theme].appBorderRadius !== managerState.theme.appBorderRadius) return true;
        if (themes[theme].fontBase !== managerState.theme.fontBase) return true;
        if (themes[theme].fontCode !== managerState.theme.fontCode) return true;
        if (themes[theme].textColor !== managerState.theme.textColor) return true;
        if (themes[theme].textInverseColor !== managerState.theme.textInverseColor) return true;
        if (themes[theme].textMutedColor !== managerState.theme.textMutedColor) return true;
        if (themes[theme].barTextColor !== managerState.theme.barTextColor) return true;
        if (themes[theme].barHoverColor !== managerState.theme.barHoverColor) return true;
        if (themes[theme].barSelectedColor !== managerState.theme.barSelectedColor) return true;
        if (themes[theme].buttonBg !== managerState.theme.buttonBg) return true;
        if (themes[theme].buttonBorder !== managerState.theme.buttonBorder) return true;
        if (themes[theme].booleanBg !== managerState.theme.booleanBg) return true;
        if (themes[theme].booleanSelectedBg !== managerState.theme.booleanSelectedBg) return true;
        if (themes[theme].inputBg !== managerState.theme.inputBg) return true;
        if (themes[theme].inputBorder !== managerState.theme.inputBorder) return true;
        if (themes[theme].inputTextColor !== managerState.theme.inputTextColor) return true;
        if (themes[theme].inputBorderRadius !== managerState.theme.inputBorderRadius) return true;
      }
      return false;
    };

    if (isThemeDifferentFromDefaultTheme('light') && isThemeDifferentFromDefaultTheme('dark'))
      setThemeVersion('1.0');
  }, [managerState]);

  return (
    <LayoutContext.Provider
      value={{
        isMobileMenuOpen,
        setMobileMenuOpen,
        isMobileAboutOpen,
        setMobileAboutOpen,
        isMobilePanelOpen,
        setMobilePanelOpen,
        isDesktop,
        isMobile,
        themeVersion,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => useContext(LayoutContext);
