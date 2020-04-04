/* eslint-disable react/destructuring-assignment,default-case,consistent-return,no-case-declarations */
import React, { Fragment } from 'react';

import { styled } from '@storybook/theming';
import { STORY_CHANGED } from '@storybook/core-events';

import { ActionBar, Icons, ScrollArea } from '@storybook/components';

import { AxeResults, Result } from 'axe-core';
import { API, useChannel } from '@storybook/api';
import { Report } from './Report';
import Tabs from './Tabs';
import { EVENTS } from '../constants';

import { useA11yContext } from './A11yContext';

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
  api: API;
}

const A11YPanel: React.FC<A11YPanelProps> = ({ api, active }) => {
  const [status, setStatus] = React.useState<A11YPanelState['status']>('initial');
  const [passes, setPasses] = React.useState<Result[]>([]);
  const [violations, setViolations] = React.useState<Result[]>([]);
  const [incomplete, setIncomplete] = React.useState<Result[]>([]);
  const [error, setError] = React.useState<unknown>(undefined);
  const { clearElements } = useA11yContext();
  const emit = useChannel({
    [EVENTS.REQUEST]: (...args) => console.log('EVENTS.REQUEST', ...args),
    [STORY_CHANGED]: (...args) => console.log('STORY_CHANGED', ...args),
  });

  React.useEffect(() => {
    api.on(EVENTS.RESULT, handleResult);
    api.on(EVENTS.ERROR, handleError);
    api.on(EVENTS.MANUAL, handleManual);

    return () => {
      api.off(EVENTS.RESULT, handleResult);
      api.off(EVENTS.ERROR, handleError);
      api.off(EVENTS.MANUAL, handleManual);
    };
  });

  React.useEffect(() => {
    if (!active) {
      clearElements();
    }
  }, [active]);

  const handleResult = ({
    passes: passesResult,
    violations: violationsResult,
    incomplete: incompleteResult,
  }: AxeResults) => {
    setStatus('ran');
    setPasses(passesResult);
    setViolations(violationsResult);
    setIncomplete(incompleteResult);

    setTimeout(() => {
      if (status === 'ran') {
        setStatus('ready');
      }
    }, 900);
  };

  const handleError = (err: unknown) => {
    setStatus('error');
    setError(err);
  };

  const handleManual = (manual: boolean) => {
    if (manual) {
      setStatus('manual');
    } else {
      request();
    }
  };

  const request = () => {
    setStatus('running');
    api.emit(EVENTS.REQUEST);
    // removes all elements from the context map from the previous panel
    clearElements();
  };

  if (!active) return null;

  switch (status) {
    case 'initial':
      return <Centered>Initializing...</Centered>;
    case 'manual':
      return (
        <Fragment>
          <Centered>Manually run the accessibility scan.</Centered>
          <ActionBar key="actionbar" actionItems={[{ title: 'Run test', onClick: request }]} />
        </Fragment>
      );
    case 'running':
      return (
        <Centered>
          <RotatingIcon inline icon="sync" /> Please wait while the accessibility scan is running
          ...
        </Centered>
      );
    case 'ready':
    case 'ran':
      const actionTitle =
        status === 'ready' ? (
          'Rerun tests'
        ) : (
          <Fragment>
            <Icon inline icon="check" /> Tests completed
          </Fragment>
        );
      return (
        <>
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
        </>
      );
    case 'error':
      return (
        <Centered>
          The accessibility scan encountered an error.
          <br />
          {error}
        </Centered>
      );
  }
};

export default A11YPanel;
