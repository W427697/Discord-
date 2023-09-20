import type { FC, ReactNode } from 'react';
import React, { useRef } from 'react';
import { styled } from '@storybook/theming';
import { Transition } from 'react-transition-group';
import type { TransitionStatus } from 'react-transition-group/Transition';
import { useMobileLayoutContext } from '../MobileLayoutProvider';

interface MobileAddonsDrawerProps {
  children: ReactNode;
}

const duration = 200;

const Container = styled.div<{ state: TransitionStatus }>(({ theme, state }) => ({
  position: 'fixed',
  boxSizing: 'border-box',
  width: '100%',
  background: theme.background.content,
  height: '50%',
  bottom: 0,
  left: 0,
  zIndex: 11,
  transition: `all ${duration}ms ease-in-out`,
  overflow: 'hidden',
  borderTop: `1px solid ${theme.appBorderColor}`,
  transform: `${(() => {
    if (state === 'entering') return 'translateY(0)';
    if (state === 'entered') return 'translateY(0)';
    if (state === 'exiting') return 'translateY(100%)';
    if (state === 'exited') return 'translateY(100%)';
    return 'translateY(0)';
  })()}`,
}));

export const MobileAddonsDrawer: FC<MobileAddonsDrawerProps> = ({ children }) => {
  const { isMobilePanelOpen } = useMobileLayoutContext();
  const containerRef = useRef(null);

  return (
    <Transition
      nodeRef={containerRef}
      in={isMobilePanelOpen}
      timeout={duration}
      mountOnEnter
      unmountOnExit
    >
      {(state) => (
        <Container ref={containerRef} state={state}>
          {children}
        </Container>
      )}
    </Transition>
  );
};
