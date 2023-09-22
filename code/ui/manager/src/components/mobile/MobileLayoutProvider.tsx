import type { FC } from 'react';
import React, { createContext, useContext, useState } from 'react';

type MobileLayoutContextType = {
  isMobileAboutOpen: boolean;
  setMobileAboutOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isMobilePanelOpen: boolean;
  setMobilePanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const MobileLayoutContext = createContext<MobileLayoutContextType>({
  isMobileAboutOpen: false,
  setMobileAboutOpen: () => {},
  isMobilePanelOpen: false,
  setMobilePanelOpen: () => {},
});

export const MobileLayoutProvider: FC = ({ children }) => {
  const [isMobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [isMobilePanelOpen, setMobilePanelOpen] = useState(false);

  return (
    <MobileLayoutContext.Provider
      value={{ isMobileAboutOpen, setMobileAboutOpen, isMobilePanelOpen, setMobilePanelOpen }}
    >
      {children}
    </MobileLayoutContext.Provider>
  );
};

export const useMobileLayoutContext = () => useContext(MobileLayoutContext);
