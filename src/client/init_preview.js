import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Preview from './ui/preview';
import { getSyncedStore, getStoryStore } from './';

const rootEl = document.getElementById('root');
const syncedStore = getSyncedStore();
const storyStore = getStoryStore();

ReactDOM.render(<Preview syncedStore={syncedStore} storyStore={storyStore} />, rootEl);
