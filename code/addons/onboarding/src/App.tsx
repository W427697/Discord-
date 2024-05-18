import React, { useCallback, useEffect, useState } from 'react';
import { ThemeProvider, convert } from '@storybook/core/dist/theming';
import { addons, type API } from '@storybook/manager-api';

import { GuidedTour } from './features/GuidedTour/GuidedTour';
import { WelcomeModal } from './features/WelcomeModal/WelcomeModal';
import { WriteStoriesModal } from './features/WriteStoriesModal/WriteStoriesModal';
import { Confetti } from './components/Confetti/Confetti';
import { STORYBOOK_ADDON_ONBOARDING_CHANNEL } from './constants';
import { useGetProject } from './features/WriteStoriesModal/hooks/useGetProject';

type Step =
  | '1:Welcome'
  | '2:StorybookTour'
  | '3:WriteYourStory'
  | '4:VisitNewStory'
  | '5:ConfigureYourProject';

const theme = convert();

export default function App({ api }: { api: API }) {
  const [enabled, setEnabled] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [step, setStep] = useState<Step>('1:Welcome');
  const { data: codeSnippets } = useGetProject();

  const skipOnboarding = useCallback(() => {
    // remove onboarding query parameter from current url
    const url = new URL(window.location.href);
    // @ts-expect-error (not strict)
    const path = decodeURIComponent(url.searchParams.get('path'));
    url.search = `?path=${path}&onboarding=false`;
    history.replaceState({}, '', url.href);
    api.setQueryParams({ onboarding: 'false' });
    setEnabled(false);
  }, [setEnabled, api]);

  useEffect(() => {
    api.emit(STORYBOOK_ADDON_ONBOARDING_CHANNEL, {
      step: '1:Welcome',
      type: 'telemetry',
    });
  }, []);

  useEffect(() => {
    if (step !== '1:Welcome') {
      api.emit(STORYBOOK_ADDON_ONBOARDING_CHANNEL, {
        step,
        type: 'telemetry',
      });
    }
  }, [api, step]);

  useEffect(() => {
    let stepTimeout: number;
    if (step === '4:VisitNewStory') {
      setShowConfetti(true);
      stepTimeout = window.setTimeout(() => {
        setStep('5:ConfigureYourProject');
      }, 2000);
    }

    return () => {
      clearTimeout(stepTimeout);
    };
  }, [step]);

  useEffect(() => {
    const storyId = api.getCurrentStoryData()?.id;
    api.setQueryParams({ onboarding: 'true' });
    // make sure the initial state is set correctly:
    // 1. Selected story is primary button
    // 2. The addon panel is opened, in the bottom and the controls tab is selected
    if (storyId !== 'example-button--primary') {
      try {
        api.selectStory('example-button--primary', undefined, {
          ref: undefined,
        });
      } catch (e) {
        //
      }
    }
  }, []);

  if (!enabled) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      {enabled && showConfetti && (
        <Confetti
          numberOfPieces={800}
          recycle={false}
          tweenDuration={20000}
          onConfettiComplete={(confetti) => {
            confetti?.reset();
            setShowConfetti(false);
          }}
        />
      )}
      {enabled && step === '1:Welcome' && (
        <WelcomeModal
          onProceed={() => {
            setStep('2:StorybookTour');
          }}
          skipOnboarding={() => {
            skipOnboarding();

            api.emit(STORYBOOK_ADDON_ONBOARDING_CHANNEL, {
              step: 'X:SkippedOnboarding',
              where: 'WelcomeModal',
              type: 'telemetry',
            });
          }}
        />
      )}
      {enabled && (step === '2:StorybookTour' || step === '5:ConfigureYourProject') && (
        <GuidedTour
          api={api}
          isFinalStep={step === '5:ConfigureYourProject'}
          onFirstTourDone={() => {
            setStep('3:WriteYourStory');
          }}
          codeSnippets={codeSnippets || undefined}
          onLastTourDone={() => {
            try {
              api.selectStory('configure-your-project--docs');
            } catch (e) {
              //
            }
            api.emit(STORYBOOK_ADDON_ONBOARDING_CHANNEL, {
              step: '6:FinishedOnboarding',
              type: 'telemetry',
            });
            skipOnboarding();
          }}
        />
      )}
      {enabled && step === '3:WriteYourStory' && codeSnippets && (
        <WriteStoriesModal
          api={api}
          codeSnippets={codeSnippets}
          addonsStore={addons}
          onFinish={() => {
            api.selectStory('example-button--warning');

            setStep('4:VisitNewStory');
          }}
          skipOnboarding={skipOnboarding}
        />
      )}
    </ThemeProvider>
  );
}
