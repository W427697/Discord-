import React, { FunctionComponent, useState, useCallback } from 'react';
import deepEqual from 'fast-deep-equal';

import { useChannel } from '@storybook/api';
import { STORY_RENDERED } from '@storybook/core-events';

import { ActionLogger as ActionLoggerComponent } from '../../components/ActionLogger';
import { EVENT_ID } from '../..';
import { ActionDisplay } from '../../models';

interface ActionLoggerProps {
  active: boolean;
}

const safeDeepEqual = (a: any, b: any): boolean => {
  try {
    return deepEqual(a, b);
  } catch (e) {
    return false;
  }
};

export const ActionLogger: FunctionComponent<ActionLoggerProps> = ({ active }) => {
  const [state, setState] = useState([]);

  const emit = useChannel({
    [EVENT_ID]: (action: ActionDisplay) => {
      const actions = state;
      const previous = actions.length && actions[0];
      if (previous && safeDeepEqual(previous.data, action.data)) {
        previous.count++; // eslint-disable-line
      } else {
        action.count = 1; // eslint-disable-line
        actions.unshift(action);
      }
      setState(actions.slice(0, action.options.limit));
    },
    [STORY_RENDERED]: () => {
      if (state.length > 0 && state[0].options.clearOnStoryChange) {
        setState([]);
      }
    },
  });

  const clear = useCallback(() => {
    setState([]);
  }, []);

  const props = {
    actions: state,
    onClear: clear,
  };
  return active ? <ActionLoggerComponent {...props} /> : null;
};
