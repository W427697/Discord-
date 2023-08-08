import type { CSSProperties, ComponentType, FC } from 'react';
import React, { useRef } from 'react';
import { styled } from '@storybook/theming';
import { Transition } from 'react-transition-group';
import type { TransitionStatus } from 'react-transition-group/Transition';
import { useLayout } from '../layout/_context';
import { MobileAbout } from '../MobileAbout/MobileAbout';

interface MobileMenuDrawerProps {
  Sidebar: ComponentType<any>;
}

const duration = 200;

const transitionContainer: Partial<Record<TransitionStatus, CSSProperties>> = {
  entering: { opacity: 1, transform: 'translateY(0)' },
  entered: { opacity: 1, transform: 'translateY(0)' },
  exiting: { opacity: 0, transform: 'translateY(40px)' },
  exited: { opacity: 0, transform: 'translateY(40px)' },
};

const transitionOverlay: Partial<Record<TransitionStatus, CSSProperties>> = {
  entering: { opacity: 1 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
};

const Container = styled.div(({ theme }) => ({
  position: 'fixed',
  boxSizing: 'border-box',
  width: '100%',
  background: theme.background.content,
  height: '80%',
  bottom: 0,
  left: 0,
  zIndex: 11,
  borderRadius: '10px 10px 0 0',
  transition: `all ${duration}ms ease-in-out`,
  opacity: 0,
  transform: 'translate(0px, 100px)',
  overflow: 'hidden',
}));

const Overlay = styled.div({
  position: 'fixed',
  boxSizing: 'border-box',
  background: 'rgba(0, 0, 0, 0.5)',
  top: 0,
  bottom: 0,
  right: 0,
  left: 0,
  zIndex: 10,
  transition: `all ${duration}ms ease-in-out`,
  opacity: 0,
  cursor: 'pointer',

  '&:hover': {
    background: 'rgba(0, 0, 0, 0.6)',
  },
});

export const MobileMenuDrawer: FC<MobileMenuDrawerProps> = ({ Sidebar }) => {
  const { isMobileMenuOpen, closeMenu } = useLayout();
  const containerRef = useRef(null);
  const overlayRef = useRef(null);

  return (
    <>
      <Transition
        nodeRef={containerRef}
        in={isMobileMenuOpen}
        timeout={duration}
        mountOnEnter
        unmountOnExit
      >
        {(state) => (
          <Container ref={containerRef} style={transitionContainer[state]}>
            <Sidebar />
            <MobileAbout />
          </Container>
        )}
      </Transition>
      <Transition
        nodeRef={overlayRef}
        in={isMobileMenuOpen}
        timeout={duration}
        mountOnEnter
        unmountOnExit
      >
        {(state) => (
          <Overlay ref={overlayRef} style={transitionOverlay[state]} onClick={closeMenu} />
        )}
      </Transition>
    </>
  );
};
