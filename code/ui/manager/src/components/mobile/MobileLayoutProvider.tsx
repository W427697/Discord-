import type { FC } from 'react';
import React, { createContext, useContext, useState } from 'react';

type MobileLayoutContextType = {
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileAboutOpen: boolean;
  setMobileAboutOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isMobilePanelOpen: boolean;
  setMobilePanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const MobileLayoutContext = createContext<MobileLayoutContextType>({
  isMobileMenuOpen: false,
  setMobileMenuOpen: () => {},
  isMobileAboutOpen: false,
  setMobileAboutOpen: () => {},
  isMobilePanelOpen: false,
  setMobilePanelOpen: () => {},
});

export const MobileLayoutProvider: FC = ({ children }) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [isMobilePanelOpen, setMobilePanelOpen] = useState(false);

  return (
    <MobileLayoutContext.Provider
      value={{
        isMobileMenuOpen,
        setMobileMenuOpen,
        isMobileAboutOpen,
        setMobileAboutOpen,
        isMobilePanelOpen,
        setMobilePanelOpen,
      }}
    >
      {children}
    </MobileLayoutContext.Provider>
  );
};

export const useMobileLayoutContext = () => useContext(MobileLayoutContext);
