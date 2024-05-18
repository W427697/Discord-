import React, { Component } from 'react';
import { dequal as deepEqual } from 'dequal';

import type { API } from '@storybook/manager-api';
import { STORY_CHANGED } from '@storybook/core/dist/core-events';

import { ActionLogger as ActionLoggerComponent } from '../../components/ActionLogger';
import type { ActionDisplay } from '../../models';
import { CLEAR_ID, EVENT_ID } from '../../constants';

interface ActionLoggerProps {
  active: boolean;
  api: API;
}

interface ActionLoggerState {
  actions: ActionDisplay[];
}

const safeDeepEqual = (a: any, b: any): boolean => {
  try {
    return deepEqual(a, b);
  } catch (e) {
    return false;
  }
};

export default class ActionLogger extends Component<ActionLoggerProps, ActionLoggerState> {
  // @ts-expect-error Unused, possibly remove, leaving, because it could be accessed even though it is private
  private mounted: boolean;

  constructor(props: ActionLoggerProps) {
    super(props);

    this.mounted = false;

    this.state = { actions: [] };
  }

  override componentDidMount() {
    this.mounted = true;
    const { api } = this.props;

    api.on(EVENT_ID, this.addAction);
    api.on(STORY_CHANGED, this.handleStoryChange);
  }

  override componentWillUnmount() {
    this.mounted = false;
    const { api } = this.props;

    api.off(STORY_CHANGED, this.handleStoryChange);
    api.off(EVENT_ID, this.addAction);
  }

  handleStoryChange = () => {
    const { actions } = this.state;
    if (actions.length > 0 && actions[0].options.clearOnStoryChange) {
      this.clearActions();
    }
  };

  addAction = (action: ActionDisplay) => {
    this.setState((prevState: ActionLoggerState) => {
      const actions = [...prevState.actions];
      const previous = actions.length && actions[actions.length - 1];
      if (previous && safeDeepEqual(previous.data, action.data)) {
        previous.count++;
      } else {
        action.count = 1;
        actions.push(action);
      }
      return { actions: actions.slice(0, action.options.limit) };
    });
  };

  clearActions = () => {
    const { api } = this.props;

    // clear number of actions
    api.emit(CLEAR_ID);
    this.setState({ actions: [] });
  };

  override render() {
    const { actions = [] } = this.state;
    const { active } = this.props;
    const props = {
      actions,
      onClear: this.clearActions,
    };
    return active ? <ActionLoggerComponent {...props} /> : null;
  }
}
