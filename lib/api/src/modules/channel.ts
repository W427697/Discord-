import deprecate from 'util-deprecate';
import { STORY_CHANGED } from '@storybook/core-events';
import { Channel, Listener } from '@storybook/channels';

import { Module } from '../index';
import { Story, StoriesList } from './stories';

interface Event<T> {
  type: string;
}

const SELECT_STORY: Event<Story> = {
  type: 'selectStory',
};

const SET_STORIES: Event<StoriesList> = {
  type: 'setStories',
};

// we wouldn't actually use a map..
const callbacks = new Map<string, any>();

const on = <T>(event: Event<T>, callback: (param: T) => void) => {
  callbacks.set(event.type, callback);
};

const emit = <T>(event: Event<T>, payload: T) => {
  const callback = callbacks.get(event.type) as ((param: T) => void);
  callback(payload);
};

on(SELECT_STORY, story => {
  // story type inferred as `Story`
});

emit(SET_STORIES, 'foo'); // Err, Argument of type '"foo"' is not assignable to parameter of type '(Group | Story)

export interface SubAPI {
  getChannel: () => Channel;
  on: (type: string, cb: Listener, peer?: boolean) => () => void;
  off: (type: string, cb: Listener) => void;
  emit: (type: string, ...args: any[]) => void;
  once: (type: string, cb: Listener) => void;
  onStory: (cb: Listener) => void;
}

export default ({ provider }: Module) => {
  const api: SubAPI = {
    getChannel: () => provider.channel,
    on: (type, cb, peer = true) => {
      if (peer) {
        provider.channel.addPeerListener(type, cb);
      } else {
        provider.channel.addListener(type, cb);
      }

      return () => provider.channel.removeListener(type, cb);
    },
    off: (type, cb) => provider.channel.removeListener(type, cb),
    emit: (type, event) => provider.channel.emit(type, event),
    once: (type, event) => provider.channel.once(type, event),

    onStory: deprecate(
      (cb: Listener) => api.on(STORY_CHANGED, cb),
      'onStory(...) has been replaced with on(STORY_CHANGED, ...)'
    ),
  };
  return { api };
};
