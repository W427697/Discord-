import { createContext } from 'react';

export type AccordionItemContextProps = {
  onOpen: () => void;
  onClose: () => void;
  open: boolean;
  id: string;
};

export const AccordionItemContext = createContext<AccordionItemContextProps | null>(null);
