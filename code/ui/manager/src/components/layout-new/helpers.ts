import type { Bounds, Coordinates, PanelPosition } from './types';

export const getPreviewPosition = ({
  panelPosition,
  isPanelHidden,
  isNavHidden,
  isFullscreen,
  bounds,
  resizerPanel,
  resizerNav,
  margin,
}: {
  panelPosition: PanelPosition;
  isPanelHidden: boolean;
  isNavHidden: boolean;
  isFullscreen: boolean;
  bounds: Bounds;
  resizerPanel: Coordinates;
  resizerNav: Coordinates;
  margin: number;
}): Bounds => {
  if (isFullscreen || isPanelHidden) {
    return {} as Bounds;
  }

  const navX = isNavHidden ? 0 : resizerNav.x;
  const panelX = resizerPanel.x;
  const panelY = resizerPanel.y;

  return panelPosition === 'bottom'
    ? {
        height: panelY - margin,
        left: 0,
        top: 0,
        width: bounds.width - navX - 2 * margin,
      }
    : {
        height: bounds.height - 2 * margin,
        left: 0,
        top: 0,
        width: panelX - navX - margin,
      };
};

export const getMainPosition = ({
  bounds,
  resizerNav,
  isNavHidden,
  isFullscreen,
  margin,
}: {
  bounds: Bounds;
  resizerNav: Coordinates;
  isNavHidden: boolean;
  isFullscreen: boolean;
  margin: number;
}): Bounds => {
  if (isFullscreen) {
    return {} as Bounds;
  }

  const navX = isNavHidden ? 0 : resizerNav.x;

  return {
    height: bounds.height - margin * 2,
    left: navX + margin,
    top: margin,
    width: bounds.width - navX - margin * 2,
  };
};

export const getPanelPosition = ({
  isPanelBottom,
  isPanelHidden,
  isNavHidden,
  bounds,
  resizerPanel,
  resizerNav,
  margin,
}: {
  isPanelBottom: boolean;
  isPanelHidden: boolean;
  isNavHidden: boolean;
  bounds: Bounds;
  resizerPanel: Coordinates;
  resizerNav: Coordinates;
  margin: number;
}): Bounds => {
  const navX = isNavHidden ? 0 : resizerNav.x;
  const panelX = resizerPanel.x;
  const panelY = resizerPanel.y;

  if (isPanelBottom && isPanelHidden) {
    return {
      height: bounds.height - panelY - margin,
      left: 0,
      top: panelY - margin,
      width: bounds.width - navX - 2 * margin,
    };
  }
  if (!isPanelBottom && isPanelHidden) {
    return {
      height: bounds.height - 2 * margin,
      left: panelX - navX - margin,
      top: 0,
      width: bounds.width - panelX - margin,
    };
  }

  return isPanelBottom
    ? {
        height: bounds.height - panelY - margin,
        left: 0,
        top: panelY - margin,
        width: bounds.width - navX - 2 * margin,
      }
    : {
        height: bounds.height - 2 * margin,
        left: panelX - navX - margin,
        top: 0,
        width: bounds.width - panelX - margin,
      };
};
