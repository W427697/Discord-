import React from 'react';
import ReactDOM from 'react-dom';
import stringify from 'json-stringify-safe';
import StorybookControls from './controls';
import ActionLogger from './action_logger';
import Layout from './layout';
import { getSyncedStore } from '../';

const rootEl = document.getElementById('root');
const syncedStore = getSyncedStore();

// Event handlers
function setSelectedKind(data, kind) {
  const newData = { ...data };
  const stories = newData.storyStore
    .find(item => item.kind === kind).stories;

  newData.selectedKind = kind;
  newData.selectedStory = stories[0];
  syncedStore.setData(newData);
}

function setSelectedStory(data, block) {
  const newData = { ...data };
  newData.selectedStory = block;
  syncedStore.setData(newData);
}

export function getControls(data) {
  return (
    <StorybookControls
      storyStore={data.storyStore}
      selectedKind={data.selectedKind}
      selectedStory={data.selectedStory}
      onKind={setSelectedKind.bind(null, data)}
      onStory={setSelectedStory.bind(null, data)}
    />
  );
}

/**
 * this is the part where viewport resizer
 * can be integrated
 *
 * features to be included:
 * - manual resizer
 * - hay mode
 */
export function getIframe(data) {
  const iframeStyle = {
    width: 'calc(100% - 10px)', // minus manual resizer width
    height: '100%',
    border: '2px solid #e0e0e0',
  };

  // We need to send dataId via queryString
  // That's how our data layer can start communicate via the iframe.
  const queryString = `dataId=${data.dataId}`;

  return (
    <iframe
      style={iframeStyle}
      src={`/iframe?${queryString}`}
    />
  );
}

export function getActionLogger(data) {
  const { actions = [] } = data;
  const log = actions
    .map(action => stringify(action, null, 2))
    .join('\n\n');

  return (<ActionLogger actionLog={log} />);
}

export function renderMain(data) {
  // Inside the main page, we simply render iframe.
  const controls = getControls(data);
  const iframe = getIframe(data);
  const actionLogger = getActionLogger(data);

  const root = (
    <Layout
      controls={controls}
      preview={iframe}
      actionLogger={actionLogger}
    />
  );

  ReactDOM.render(root, rootEl);
}

export default function renderAdmin(data) {
  return renderMain(data);
}
