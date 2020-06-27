import EVENTS from '@storybook/core-events';
import { InitializeOptions, Tracker } from 'react-ga';

export type ObjType = { [key: string]: any };
export type EventValue = boolean | ((params: ObjType) => boolean);
export type EventMap = {
  [K in EVENTS]: EventValue;
};

export interface AnalyticsAddonParameter {
  reactGAId: string | Tracker[];
  reactGAOptions?: InitializeOptions;
  events: EventMap;
}
