import React from 'react';
import { addons, types, useChannel } from '@storybook/manager-api';
import { AddonPanel, Badge, Spaced } from '@storybook/components';

import {
  IGNORED_EXCEPTION,
  STORY_RENDER_PHASE_CHANGED,
  PLAY_FUNCTION_THREW_EXCEPTION,
} from '@storybook/core-events';

import { EVENTS, type Call, CallStates, type LogItem } from '@storybook/instrumenter';
import { ADDON_ID, PANEL_ID } from './constants';
import { getInteractions, Panel } from './Panel';
import { TabIcon } from './components/TabStatus';

interface Interaction extends Call {
  status: Call['status'];
  childCallIds: Call['id'][];
  isHidden: boolean;
  isCollapsed: boolean;
  toggleCollapsed: () => void;
}

function Title() {
  const [isPlaying, setPlaying] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState<Set<Call['id']>>(new Set());
  const [caughtException, setCaughtException] = React.useState<Error>();
  const [interactions, setInteractions] = React.useState<Interaction[]>([]);
  const [interactionsCount, setInteractionsCount] = React.useState<number>();

  // Log and calls are tracked in a ref so we don't needlessly rerender.
  const log = React.useRef<LogItem[]>([]);
  const calls = React.useRef<Map<Call['id'], Omit<Call, 'status'>>>(new Map());
  const setCall = ({ status, ...call }: Call) => calls.current.set(call.id, call);

  useChannel(
    {
      [EVENTS.CALL]: setCall,
      [EVENTS.SYNC]: (payload) => {
        setInteractions(
          getInteractions({ log: payload.logItems, calls: calls.current, collapsed, setCollapsed })
        );
        log.current = payload.logItems;
      },
      [STORY_RENDER_PHASE_CHANGED]: (event) => {
        setPlaying(event.newPhase === 'playing');
        if (event.newPhase === 'rendering') {
          setCaughtException(undefined);
        }
      },
      [PLAY_FUNCTION_THREW_EXCEPTION]: (e) => {
        if (e?.message !== IGNORED_EXCEPTION.message) setCaughtException(e);
        else setCaughtException(undefined);
      },
    },
    [collapsed]
  );

  React.useEffect(() => {
    if (isPlaying) return;
    setInteractionsCount(interactions.filter(({ method }) => method !== 'step').length);
  }, [interactions, isPlaying]);

  const showStatus = interactionsCount > 0 || !!caughtException;
  const hasException = !!caughtException || interactions.some((v) => v.status === CallStates.ERROR);

  const suffix =
    showStatus &&
    (hasException ? (
      <TabIcon status={CallStates.ERROR} />
    ) : (
      <Badge status="neutral">{interactionsCount}</Badge>
    ));

  return (
    <div>
      <Spaced col={1}>
        <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>Interactions</span>
        {suffix}
      </Spaced>
    </div>
  );
}

addons.register(ADDON_ID, (api) => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: Title,
    match: ({ viewMode }) => viewMode === 'story',
    render: ({ key, active }) => {
      if (!active || !api.getCurrentStoryData()) {
        return null;
      }
      return (
        <AddonPanel key={key} active={active}>
          <Panel active={active} />
        </AddonPanel>
      );
    },
  });
});
