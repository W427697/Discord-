import addons from '@storybook/addons';
import { ADD_VIEWPORTS_EVENT_ID, SET_VIEWPORTS_EVENT_ID } from '../shared';

export function init() {}

export function addViewports(viewports) {
  const channel = addons.getChannel();

  if (channel) {
    channel.emit(ADD_VIEWPORTS_EVENT_ID, viewports);
  }
}

export function setViewports(viewports) {
  const channel = addons.getChannel();

  if (channel) {
    channel.emit(SET_VIEWPORTS_EVENT_ID, viewports);
  }
}
