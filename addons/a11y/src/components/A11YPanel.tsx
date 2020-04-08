/* eslint-disable react/destructuring-assignment,default-case,consistent-return,no-case-declarations */
import React, { useCallback } from 'react';

import { styled } from '@storybook/theming';
import { STORY_CHANGED, STORY_RENDERED } from '@storybook/core-events';

import { ActionBar, Icons, ScrollArea } from '@storybook/components';

import { AxeResults, Result } from 'axe-core';
import { useChannel, useParameter, useStorybookState } from '@storybook/api';
import { Report } from './Report';
import Tabs from './Tabs';
import { A11yParameters } from '../a11yRunner';

import { useA11yContext } from './A11yContext';
import { EVENTS } from '../constants';

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

type Status = 'initial' | 'manual' | 'running' | 'error' | 'ran' | 'ready';

interface A11YPanelProps {
  active: boolean;
}

const A11YPanel: React.FC<A11YPanelProps> = ({ active }) => {
  const [status, setStatus] = React.useState<Status>('initial');
  const [passes, setPasses] = React.useState<Result[]>([]);
  const [violations, setViolations] = React.useState<Result[]>([]);
  const [incomplete, setIncomplete] = React.useState<Result[]>([]);
  const [error, setError] = React.useState<unknown>(undefined);
  const { clearElements } = useA11yContext();

  const { storyId } = useStorybookState();
  const { manual } = useParameter<Pick<A11yParameters, 'manual'>>('a11y', {
    manual: false,
  });
  React.useEffect(() => {
    setStatus(manual ? 'manual' : 'initial');
  }, [manual]);

  const handleRun = useCallback(async () => {
    // removes all elements from the context map from the previous panel
    clearElements();
    setStatus('running');
  }, []);

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

  const handleError = useCallback((err: unknown) => {
    setStatus('error');
    setError(err);
  }, []);

  const emit = useChannel({
    [EVENTS.REQUEST]: handleRun,
    [EVENTS.RESULT]: handleResult,
    [EVENTS.ERROR]: handleError,
    // [STORY_CHANGED]: run,
    // [STORY_RENDERED]: run,
  });

  React.useEffect(() => {
    if (!active) {
      clearElements();
    }
  }, [active]);

  const handleManual = useCallback(() => {
    setStatus('running');
    emit(EVENTS.MANUAL, storyId);
  }, [storyId]);

  if (!active) return null;
  return (
    <>
      {status === 'initial' && <Centered>Initializing...</Centered>}
      {status === 'manual' && (
        <>
          <Centered>Manually run the accessibility scan.</Centered>
          <ActionBar key="actionbar" actionItems={[{ title: 'Run test', onClick: handleManual }]} />
        </>
      )}
      {status === 'running' && (
        <Centered>
          <RotatingIcon inline icon="sync" /> Please wait while the accessibility scan is running
          ...
        </Centered>
      )}
      {(status === 'ready' || status === 'ran') && (
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
          <ActionBar
            key="actionbar"
            actionItems={[
              {
                title:
                  status === 'ready' ? (
                    'Rerun tests'
                  ) : (
                    <>
                      <Icon inline icon="check" /> Tests completed
                    </>
                  ),
                onClick: handleManual,
              },
            ]}
          />
        </>
      )}
      {status === 'error' && (
        <Centered>
          The accessibility scan encountered an error.
          <br />
          {error}
        </Centered>
      )}
    </>
  );
};

export default A11YPanel;
