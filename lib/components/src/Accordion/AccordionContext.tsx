import { createContext } from 'react';

export type AddToMapFn = (id: string) => void;

export type OpenMap = Record<string, boolean>;

export type AccordionContextProps = {
  addToMap: AddToMapFn;
  onOpen: (id: string) => void;
  onClose: (id: string) => void;
  open: OpenMap;
};

export const AccordionContext = createContext<AccordionContextProps | null>(null);
