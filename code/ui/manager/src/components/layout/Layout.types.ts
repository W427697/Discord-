import type { API_Layout, API_ViewMode } from '@storybook/types';
import type React from 'react';

export interface InternalLayoutState {
  isDragging: boolean;
}

export interface ManagerLayoutState
  extends Pick<API_Layout, 'navSize' | 'bottomPanelHeight' | 'rightPanelWidth' | 'panelPosition'> {
  viewMode: API_ViewMode;
}

export interface Props {
  managerLayoutState: ManagerLayoutState;
  setManagerLayoutState: (state: Partial<Omit<ManagerLayoutState, 'viewMode'>>) => void;
  slotMain?: React.ReactNode;
  slotSidebar?: React.ReactNode;
  slotPanel?: React.ReactNode;
  slotPages?: React.ReactNode;
}
export type LayoutState = InternalLayoutState & ManagerLayoutState;
