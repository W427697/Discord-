import type { CSSProperties, FC, ReactNode } from 'react';
import React, { useRef } from 'react';
import { styled } from '@storybook/theming';
import { Transition } from 'react-transition-group';
import type { TransitionStatus } from 'react-transition-group/Transition';
import { useLayout } from '../layout/_context';

interface MobileAddonsDrawerProps {
  children: ReactNode;
}

const duration = 200;

const transitionContainer: Partial<Record<TransitionStatus, CSSProperties>> = {
  entering: { opacity: 1, transform: 'translateY(0)' },
  entered: { opacity: 1, transform: 'translateY(0)' },
  exiting: { opacity: 0, transform: 'translateY(40px)' },
  exited: { opacity: 0, transform: 'translateY(40px)' },
};

const Container = styled.div(({ theme }) => ({
  position: 'fixed',
  boxSizing: 'border-box',
  width: '100%',
  background: theme.background.content,
  height: '50%',
  bottom: 0,
  left: 0,
  zIndex: 11,
  transition: `all ${duration}ms ease-in-out`,
  opacity: 0,
  transform: 'translate(0px, 100px)',
  overflow: 'hidden',
  borderTop: `1px solid ${theme.appBorderColor}`,
}));

export const MobileAddonsDrawer: FC<MobileAddonsDrawerProps> = ({ children }) => {
  const { isMobileAddonsOpen } = useLayout();
  const containerRef = useRef(null);

  return (
    <Transition
      nodeRef={containerRef}
      in={isMobileAddonsOpen}
      timeout={duration}
      mountOnEnter
      unmountOnExit
    >
      {(state) => (
        <Container ref={containerRef} style={transitionContainer[state]}>
          {children}
        </Container>
      )}
    </Transition>
  );
};
