import { global } from '@storybook/global';
import type { Dispatch, SetStateAction } from 'react';
import React, { Fragment, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAddonState, useChannel, useParameter } from '@storybook/manager-api';
import {
  FORCE_REMOUNT,
  IGNORED_EXCEPTION,
  STORY_RENDER_PHASE_CHANGED,
  STORY_THREW_EXCEPTION,
  PLAY_FUNCTION_THREW_EXCEPTION,
} from '@storybook/core-events';
import {
  EVENTS,
  type Call,
  CallStates,
  type ControlStates,
  type LogItem,
} from '@storybook/instrumenter';

import { InteractionsPanel } from './components/InteractionsPanel';
import { ADDON_ID } from './constants';

interface Interaction extends Call {
  status: Call['status'];
  childCallIds: Call['id'][];
  isHidden: boolean;
  isCollapsed: boolean;
  toggleCollapsed: () => void;
}

const INITIAL_CONTROL_STATES = {
  start: false,
  back: false,
  goto: false,
  next: false,
  end: false,
};

export const getInteractions = ({
  log,
  calls,
  collapsed,
  setCollapsed,
}: {
  log: LogItem[];
  calls: Map<Call['id'], Call>;
  collapsed: Set<Call['id']>;
  setCollapsed: Dispatch<SetStateAction<Set<string>>>;
}) => {
  const callsById = new Map<Call['id'], Call>();
  const childCallMap = new Map<Call['id'], Call['id'][]>();
  return log
    .map<Call & { isHidden: boolean }>(({ callId, ancestors, status }) => {
      let isHidden = false;
      ancestors.forEach((ancestor) => {
        if (collapsed.has(ancestor)) isHidden = true;
        childCallMap.set(ancestor, (childCallMap.get(ancestor) || []).concat(callId));
      });
      return { ...calls.get(callId), status, isHidden };
    })
    .map<Interaction>((call) => {
      const status =
        call.status === CallStates.ERROR &&
        callsById.get(call.ancestors.slice(-1)[0])?.status === CallStates.ACTIVE
          ? CallStates.ACTIVE
          : call.status;
      callsById.set(call.id, { ...call, status });
      return {
        ...call,
        status,
        childCallIds: childCallMap.get(call.id),
        isCollapsed: collapsed.has(call.id),
        toggleCollapsed: () =>
          setCollapsed((ids) => {
            if (ids.has(call.id)) ids.delete(call.id);
            else ids.add(call.id);
            return new Set(ids);
          }),
      };
    });
};

export const Panel = memo<{ storyId: string }>(function PanelMemoized({ storyId }) {
  // TODO: all state should be in the addon state
  const [addonState, set] = useAddonState(ADDON_ID, {
    controlStates: INITIAL_CONTROL_STATES,
    isErrored: false,
    pausedAt: undefined,
    interactions: [],
    isPlaying: false,
    isRerunAnimating: false,
    scrollTarget: undefined,
    collapsed: new Set() as Set<Call['id']>,
    hasException: false,
    caughtException: undefined,
    interactionsCount: 0,
  });
  const setControlStates = useCallback(
    (controlStates: ControlStates) => set((s) => ({ ...s, controlStates })),
    []
  );
  const setErrored = useCallback((isErrored: boolean) => set((s) => ({ ...s, isErrored })), []);
  const setPausedAt = useCallback((pausedAt: Call['id']) => set((s) => ({ ...s, pausedAt })), []);
  const setInteractions = useCallback(
    (interactions: Interaction[]) => set((s) => ({ ...s, interactions })),
    []
  );
  const setPlaying = useCallback((isPlaying: boolean) => set((s) => ({ ...s, isPlaying })), []);
  const setIsRerunAnimating = useCallback(
    (isRerunAnimating: boolean) => set((s) => ({ ...s, isRerunAnimating })),
    []
  );
  const setScrollTarget = useCallback(
    (scrollTarget: HTMLElement) => set((s) => ({ ...s, scrollTarget })),
    []
  );
  const setCollapsed = useCallback(
    (collapsed: Set<Call['id']>) => set((s) => ({ ...s, collapsed })),
    []
  );
  const setCaughtException = useCallback(
    (caughtException: Error) => set((s) => ({ ...s, caughtException })),
    []
  );
  const setInteractionsCount = useCallback(
    (interactionsCount: number) => set((s) => ({ ...s, interactionsCount })),
    []
  );

  const {
    controlStates = INITIAL_CONTROL_STATES,
    isErrored = false,
    pausedAt = undefined,
    interactions = [],
    isPlaying = false,
    isRerunAnimating = false,
    scrollTarget = undefined,
    collapsed = new Set() as Set<Call['id']>,
    caughtException = undefined,
    interactionsCount = 0,
  } = addonState;

  // Log and calls are tracked in a ref so we don't needlessly rerender.
  const log = useRef<LogItem[]>([]);
  const calls = useRef<Map<Call['id'], Omit<Call, 'status'>>>(new Map());
  const setCall = ({ status, ...call }: Call) => calls.current.set(call.id, call);

  const endRef = useRef();
  useEffect(() => {
    let observer: IntersectionObserver;
    if (global.IntersectionObserver) {
      observer = new global.IntersectionObserver(
        ([end]: any) => setScrollTarget(end.isIntersecting ? undefined : end.target),
        { root: global.document.querySelector('#panel-tab-content') }
      );
      if (endRef.current) observer.observe(endRef.current);
    }
    return () => observer?.disconnect();
  }, []);

  const emit = useChannel(
    {
      [EVENTS.CALL]: setCall,
      [EVENTS.SYNC]: (payload) => {
        setControlStates(payload.controlStates);
        setPausedAt(payload.pausedAt);
        setInteractions(
          getInteractions({ log: payload.logItems, calls: calls.current, collapsed, setCollapsed })
        );
        log.current = payload.logItems;
      },
      [STORY_RENDER_PHASE_CHANGED]: (event) => {
        if (event.newPhase === 'preparing') {
          set((s) => ({
            controlStates: INITIAL_CONTROL_STATES,
            isErrored: false,
            pausedAt: undefined,
            interactions: [],
            isPlaying: false,
            isRerunAnimating: false,
            scrollTarget: s.scrollTarget,
            collapsed: new Set() as Set<Call['id']>,
            hasException: false,
            caughtException: undefined,
            interactionsCount: 0,
          }));
          return;
        }
        setPlaying(event.newPhase === 'playing');
        setPausedAt(undefined);
        if (event.newPhase === 'rendering') {
          setErrored(false);
          setCaughtException(undefined);
        }
      },
      [STORY_THREW_EXCEPTION]: () => {
        setErrored(true);
      },
      [PLAY_FUNCTION_THREW_EXCEPTION]: (e) => {
        if (e?.message !== IGNORED_EXCEPTION.message) {
          setCaughtException(e);
        } else {
          setCaughtException(undefined);
        }
      },
    },
    [collapsed]
  );

  useEffect(() => {
    setInteractions(
      getInteractions({ log: log.current, calls: calls.current, collapsed, setCollapsed })
    );
  }, [collapsed]);

  useEffect(() => {
    if (isPlaying || isRerunAnimating) return;
    setInteractionsCount(interactions.filter(({ method }) => method !== 'step').length);
  }, [interactions, isPlaying, isRerunAnimating]);

  const controls = useMemo(
    () => ({
      start: () => emit(EVENTS.START, { storyId }),
      back: () => emit(EVENTS.BACK, { storyId }),
      goto: (callId: string) => emit(EVENTS.GOTO, { storyId, callId }),
      next: () => emit(EVENTS.NEXT, { storyId }),
      end: () => emit(EVENTS.END, { storyId }),
      rerun: () => {
        setIsRerunAnimating(true);
        emit(FORCE_REMOUNT, { storyId });
      },
    }),
    [storyId]
  );

  const storyFilePath = useParameter('fileName', '');
  const [fileName] = storyFilePath.toString().split('/').slice(-1);
  const scrollToTarget = () => scrollTarget?.scrollIntoView({ behavior: 'smooth', block: 'end' });

  const hasException = !!caughtException || interactions.some((v) => v.status === CallStates.ERROR);

  useEffect(() => {
    set({
      controlStates,
      interactions,
      hasException,
      caughtException,
      isPlaying,
      pausedAt,
      isRerunAnimating,
      interactionsCount,
      collapsed,
      isErrored,
      scrollTarget,
    });
  }, [interactions, hasException, caughtException, isPlaying, pausedAt, isRerunAnimating, controlStates, interactionsCount]);

  if (isErrored) {
    return <Fragment key="interactions" />;
  }

  return (
    <Fragment key="interactions">
      <InteractionsPanel
        calls={calls.current}
        controls={controls}
        controlStates={controlStates}
        interactions={interactions}
        fileName={fileName}
        hasException={hasException}
        caughtException={caughtException}
        isPlaying={isPlaying}
        pausedAt={pausedAt}
        endRef={endRef}
        onScrollToEnd={scrollTarget && scrollToTarget}
        isRerunAnimating={isRerunAnimating}
        setIsRerunAnimating={setIsRerunAnimating}
      />
    </Fragment>
  );
});
