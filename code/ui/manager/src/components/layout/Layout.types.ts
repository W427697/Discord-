import type { API_PanelPositions, ViewMode } from '@storybook/types';
import type React from 'react';
import type { usePersistence } from './Layout.persistence';

export interface ExposedLayoutState {
  panelPosition: API_PanelPositions;
  isPanelShown: boolean;
  isSidebarShown: boolean;
  viewMode: ViewMode;
}
export interface InternalLayoutState {
  isDragging: boolean;
}
export interface PersistedLayoutState {
  sidebarWidth: number;
  panelHeight: number;
  panelWidth: number;
  panelPosition: API_PanelPositions;
}
export interface Props {
  state: ExposedLayoutState;
  setState: (state: Partial<Omit<ExposedLayoutState, 'viewMode'>>) => void;
  persistence: ReturnType<typeof usePersistence>;

  slotMain?: React.ReactNode;
  slotSidebar?: React.ReactNode;
  slotPanel?: React.ReactNode;
  slotCustom?: React.ReactNode;
}
export type LayoutState = ExposedLayoutState & InternalLayoutState & PersistedLayoutState;
