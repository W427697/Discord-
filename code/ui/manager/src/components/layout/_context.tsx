import type { ReactNode } from 'react';
import React, { createContext, useContext, useState } from 'react';

interface LayoutType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const Layout = createContext<LayoutType>({
  open: false,
  setOpen: () => {},
});

interface Props {
  children: ReactNode;
}

export const LayoutProvider = ({ children }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <Layout.Provider
      value={{
        open,
        setOpen,
      }}
    >
      {children}
    </Layout.Provider>
  );
};

export const useChat = () => useContext(Layout);
