import type { CSSProperties, FC } from 'react';
import React, { useRef } from 'react';
import { Transition, type TransitionStatus } from 'react-transition-group';
import { styled } from '@storybook/theming';
import { Button, Icon } from '@storybook/components/experimental';
import { useLayout } from './_context';

export const MobileAbout: FC = () => {
  const aboutRef = useRef(null);
  const { isMobileAboutOpen, setMobileAboutOpen } = useLayout();

  const duration = 200;

  const transitionContainer: Partial<Record<TransitionStatus, CSSProperties>> = {
    entering: { opacity: 1, transform: 'translateX(0)' },
    entered: { opacity: 1, transform: 'translateX(0)' },
    exiting: { opacity: 0, transform: 'translateX(20px)' },
    exited: { opacity: 0, transform: 'translateX(20px)' },
  };

  const Container = styled.div(({ theme }) => ({
    position: 'absolute',
    boxSizing: 'border-box',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    zIndex: 11,
    transition: `all ${duration}ms ease-in-out`,
    opacity: 0,
    transform: 'translateX(0)',
    background: theme.background.content,
    overflow: 'scroll',
    padding: '20px',
  }));

  return (
    <Transition
      nodeRef={aboutRef}
      in={isMobileAboutOpen}
      timeout={duration}
      appear
      mountOnEnter
      unmountOnExit
    >
      {(state) => (
        <Container ref={aboutRef} style={transitionContainer[state]}>
          <div>
            <Button
              icon={<Icon.ArrowLeft />}
              variant="tertiary"
              onClick={() => setMobileAboutOpen(false)}
            >
              Back
            </Button>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
          </div>
        </Container>
      )}
    </Transition>
  );
};
