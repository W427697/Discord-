import { ReactNode } from 'react';
import { Styles, ViewportStyles, ViewportType } from '../models';

export interface ViewportItem {
  id: string;
  title: string;
  styles: Styles;
  type: ViewportType;
  default?: boolean;
}

export interface LinkBase {
  id: string;
  title: string;
  right?: ReactNode;
  type: 'desktop' | 'mobile' | 'tablet' | 'other';
  styles: ViewportStyles | ((s: ViewportStyles) => ViewportStyles) | null;
}

export interface Link extends LinkBase {
  onClick: () => void;
}
