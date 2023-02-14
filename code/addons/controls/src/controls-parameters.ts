import type { PresetColor, SortType } from '@storybook/blocks';

export interface ControlsParameters {
  sort?: SortType;
  expanded?: boolean;
  presetColors?: PresetColor[];
  hideNoControlsWarning?: boolean;
  visibleCategories?: string[];
}
