import React, { Fragment, FunctionComponent, useState, useCallback } from 'react';

import { styled } from '@storybook/theming';

import { ActionBar, Icons, ScrollArea } from '@storybook/components';

import { AxeResults, Result } from 'axe-core';
import { useChannel } from '@storybook/api';
import { Provider } from 'react-redux';
import { Report } from './Report';
import { Tabs } from './Tabs';
import { EVENTS } from '../constants';

import store, { clearElements } from '../redux-config';

export enum RuleType {
  VIOLATION,
  PASS,
  INCOMPLETION,
}

const Icon = styled(Icons)({
  height: 12,
  width: 12,
  marginRight: 4,
});

const RotatingIcon = styled(Icon)<{}>(({ theme }) => ({
  animation: `${theme.animation.rotate360} 1s linear infinite;`,
}));

const Passes = styled.span<{}>(({ theme }) => ({
  color: theme.color.positive,
}));

const Violations = styled.span<{}>(({ theme }) => ({
  color: theme.color.negative,
}));

const Incomplete = styled.span<{}>(({ theme }) => ({
  color: theme.color.warning,
}));

const Centered = styled.span<{}>({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
});

interface InitialState {
  status: 'initial';
}

interface ManualState {
  status: 'manual';
}

interface RunningState {
  status: 'running';
}

interface RanState {
  status: 'ran';
  passes: Result[];
  violations: Result[];
  incomplete: Result[];
}

interface ReadyState {
  status: 'ready';
  passes: Result[];
  violations: Result[];
  incomplete: Result[];
}

interface ErrorState {
  status: 'error';
  error: unknown;
}

type A11YPanelState =
  | InitialState
  | ManualState
  | RunningState
  | RanState
  | ReadyState
  | ErrorState;

interface A11YPanelProps {
  active: boolean;
}

const A11YPanel: FunctionComponent<A11YPanelProps> = ({ active }) => {
  const [state, setState] = useState<A11YPanelState>({ status: 'initial' });

  const request = useCallback(() => {
    setState({
      ...state,
      status: 'running',
    });

    emit(EVENTS.REQUEST);
    // removes all elements from the redux map in store from the previous panel
    store.dispatch(clearElements());
  }, []);

  const resultHandler = useCallback(({ passes, violations, incomplete }: AxeResults) => {
    setState({
      status: 'ran',
      passes,
      violations,
      incomplete,
    });

    setTimeout(() => {
      const { status } = state;
      if (status === 'ran') {
        setState({
          ...(state as RanState),
          status: 'ready',
        });
      }
    }, 900);
  }, []);

  const errorHandler = useCallback((error: unknown) => {
    setState({
      status: 'error',
      error,
    });
  }, []);

  const manualHandler = useCallback((manual: boolean) => {
    if (manual) {
      setState({
        status: 'manual',
      });
    } else {
      request();
    }
  }, []);

  const emit = useChannel({
    [EVENTS.RESULT]: resultHandler,
    [EVENTS.ERROR]: errorHandler,
    [EVENTS.MANUAL]: manualHandler,
  });

  if (!active) return null;

  switch (state.status) {
    case 'initial': {
      return <Centered>Initializing...</Centered>;
    }
    case 'manual': {
      return (
        <Fragment>
          <Centered>Manually run the accessibility scan.</Centered>
          <ActionBar key="actionbar" actionItems={[{ title: 'Run test', onClick: request }]} />
        </Fragment>
      );
    }
    case 'running': {
      return (
        <Centered>
          <RotatingIcon inline icon="sync" /> Please wait while the accessibility scan is running
          ...
        </Centered>
      );
    }
    case 'ready':
    case 'ran': {
      const { passes, violations, incomplete, status } = state;
      const actionTitle =
        status === 'ready' ? (
          'Rerun tests'
        ) : (
          <Fragment>
            <Icon inline icon="check" /> Tests completed
          </Fragment>
        );

      return (
        <Provider store={store}>
          <ScrollArea vertical horizontal>
            <Tabs
              key="tabs"
              tabs={[
                {
                  label: <Violations>{violations.length} Violations</Violations>,
                  panel: (
                    <Report
                      items={violations}
                      type={RuleType.VIOLATION}
                      empty="No accessibility violations found."
                    />
                  ),
                  items: violations,
                  type: RuleType.VIOLATION,
                },
                {
                  label: <Passes>{passes.length} Passes</Passes>,
                  panel: (
                    <Report
                      items={passes}
                      type={RuleType.PASS}
                      empty="No accessibility checks passed."
                    />
                  ),
                  items: passes,
                  type: RuleType.PASS,
                },
                {
                  label: <Incomplete>{incomplete.length} Incomplete</Incomplete>,
                  panel: (
                    <Report
                      items={incomplete}
                      type={RuleType.INCOMPLETION}
                      empty="No accessibility checks incomplete."
                    />
                  ),
                  items: incomplete,
                  type: RuleType.INCOMPLETION,
                },
              ]}
            />
          </ScrollArea>
          <ActionBar key="actionbar" actionItems={[{ title: actionTitle, onClick: request }]} />
        </Provider>
      );
    }
    case 'error': {
      const { error } = state;
      return (
        <Centered>
          The accessibility scan encountered an error.
          <br />
          {error}
        </Centered>
      );
    }
    default: {
      return null;
    }
  }
};

export { A11YPanel };
