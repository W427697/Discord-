import type { FC } from 'react';
import React, { useRef } from 'react';
import { styled } from '@storybook/theming';
import { Transition } from 'react-transition-group';
import type { TransitionStatus } from 'react-transition-group/Transition';
import { MobileAbout } from '../mobile-about/MobileAbout';
import Sidebar from '../../container/Sidebar';
import { MOBILE_TRANSITION_DURATION } from '../../constants';

interface MobileMenuDrawerProps {
  isMenuOpen: boolean;
  isAboutOpen: boolean;
  setAboutOpen: (open: boolean) => void;
  closeMenu: () => void;
}

export const MobileMenuDrawer: FC<MobileMenuDrawerProps> = ({
  isMenuOpen,
  isAboutOpen,
  setAboutOpen,
  closeMenu,
}) => {
  const containerRef = useRef(null);
  const sidebarRef = useRef(null);
  const overlayRef = useRef(null);

  return (
    <>
      <Transition
        nodeRef={containerRef}
        in={isMenuOpen}
        timeout={MOBILE_TRANSITION_DURATION}
        mountOnEnter
        unmountOnExit
      >
        {(state) => (
          <Container ref={containerRef} state={state}>
            <Transition nodeRef={sidebarRef} in={!isAboutOpen} timeout={MOBILE_TRANSITION_DURATION}>
              {(sidebarState) => (
                <SidebarContainer ref={sidebarRef} state={sidebarState}>
                  <Sidebar isAboutOpen={isAboutOpen} setAboutOpen={setAboutOpen} />
                </SidebarContainer>
              )}
            </Transition>
            <MobileAbout isAboutOpen={isAboutOpen} setAboutOpen={setAboutOpen} />
          </Container>
        )}
      </Transition>
      <Transition
        nodeRef={overlayRef}
        in={isMenuOpen}
        timeout={MOBILE_TRANSITION_DURATION}
        mountOnEnter
        unmountOnExit
      >
        {(state) => <Overlay ref={overlayRef} state={state} onClick={closeMenu} />}
      </Transition>
    </>
  );
};

const Container = styled.div<{ state: TransitionStatus }>(({ theme, state }) => ({
  position: 'fixed',
  boxSizing: 'border-box',
  width: '100%',
  background: theme.background.content,
  height: '80%',
  bottom: 0,
  left: 0,
  zIndex: 11,
  borderRadius: '10px 10px 0 0',
  transition: `all ${MOBILE_TRANSITION_DURATION}ms ease-in-out`,
  overflow: 'hidden',
  transform: `${(() => {
    if (state === 'entering') return 'translateY(0)';
    if (state === 'entered') return 'translateY(0)';
    if (state === 'exiting') return 'translateY(100%)';
    if (state === 'exited') return 'translateY(100%)';
    return 'translateY(0)';
  })()}`,
}));

const SidebarContainer = styled.div<{ state: TransitionStatus }>(({ theme, state }) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  zIndex: 1,
  transition: `all ${MOBILE_TRANSITION_DURATION}ms ease-in-out`,
  overflow: 'hidden',
  opacity: `${(() => {
    if (state === 'entered') return 1;
    if (state === 'entering') return 1;
    if (state === 'exiting') return 0;
    if (state === 'exited') return 0;
    return 1;
  })()}`,
  transform: `${(() => {
    if (state === 'entering') return 'translateX(0)';
    if (state === 'entered') return 'translateX(0)';
    if (state === 'exiting') return 'translateX(-20px)';
    if (state === 'exited') return 'translateX(-20px)';
    return 'translateX(0)';
  })()}`,
}));

const Overlay = styled.div<{ state: TransitionStatus }>(({ state }) => ({
  position: 'fixed',
  boxSizing: 'border-box',
  background: 'rgba(0, 0, 0, 0.5)',
  top: 0,
  bottom: 0,
  right: 0,
  left: 0,
  zIndex: 10,
  transition: `all ${MOBILE_TRANSITION_DURATION}ms ease-in-out`,
  cursor: 'pointer',
  opacity: `${(() => {
    if (state === 'entering') return 1;
    if (state === 'entered') return 1;
    if (state === 'exiting') return 0;
    if (state === 'exited') return 0;
    return 0;
  })()}`,

  '&:hover': {
    background: 'rgba(0, 0, 0, 0.6)',
  },
}));
