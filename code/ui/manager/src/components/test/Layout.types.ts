import type { API_PanelPositions, ViewMode } from '@storybook/types';
import type React from 'react';

export interface ExposedLayoutState {
  panelPosition: API_PanelPositions;
  panel: boolean;
  sidebar: boolean;
  viewMode: ViewMode;
}
interface InternalLayoutState {
  isDragging: boolean;
  sidebarWidth: number;
  panelHeight: number;
  panelWidth: number;
}
export interface Props {
  state: ExposedLayoutState;
  setState: (state: Partial<Omit<ExposedLayoutState, 'viewMode'>>) => void;

  slotMain?: React.ReactNode;
  slotSidebar?: React.ReactNode;
  slotPanel?: React.ReactNode;
  slotCustom?: React.ReactNode;
}
export type LayoutState = ExposedLayoutState & InternalLayoutState;
