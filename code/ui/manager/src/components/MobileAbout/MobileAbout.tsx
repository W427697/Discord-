import type { FC } from 'react';
import React, { useRef } from 'react';
import { Transition, type TransitionStatus } from 'react-transition-group';
import { styled } from '@storybook/theming';
import { Button, Icon, Link } from '@storybook/components/experimental';
import { useLayout } from '../layout/_context';
import { UpgradeBlock } from '../UpgradeBlock/UpgradeBlock';

interface MobileAboutProps {
  isOpen: boolean;
}

const Container = styled.div<{ state: TransitionStatus; transitionDuration: number }>(
  ({ state, transitionDuration }) => ({
    position: 'absolute',
    boxSizing: 'border-box',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    zIndex: 11,
    transition: `all ${transitionDuration}ms ease-in-out`,
    overflow: 'scroll',
    padding: '20px',
    opacity: `${(() => {
      if (state === 'entering') return 1;
      if (state === 'entered') return 1;
      if (state === 'exiting') return 0;
      if (state === 'exited') return 0;
      return 0;
    })()}`,
    transform: `${(() => {
      if (state === 'entering') return 'translateX(0)';
      if (state === 'entered') return 'translateX(0)';
      if (state === 'exiting') return 'translateX(20px)';
      if (state === 'exited') return 'translateX(20px)';
      return 'translateX(0)';
    })()}`,
  })
);

const LinkContainer = styled.div({
  marginTop: 20,
  marginBottom: 20,
});

const LinkLine = styled.a(({ theme }) => ({
  all: 'unset',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  fontSize: theme.typography.size.s2 - 1,
  height: 52,
  borderBottom: `1px solid ${theme.appBorderColor}`,
  cursor: 'pointer',
  padding: '0 10px',

  '&:last-child': {
    borderBottom: 'none',
  },
}));

const LinkLeft = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  fontSize: theme.typography.size.s2 - 1,
  height: 40,
  gap: 5,
}));

const BottomText = styled.div(({ theme }) => ({
  fontSize: theme.typography.size.s2 - 1,
  marginTop: 30,
}));

export const MobileAbout: FC<MobileAboutProps> = ({ isOpen }) => {
  const { setMobileAboutOpen, transitionDuration } = useLayout();
  const aboutRef = useRef(null);

  return (
    <Transition
      nodeRef={aboutRef}
      in={isOpen}
      timeout={transitionDuration}
      appear
      mountOnEnter
      unmountOnExit
    >
      {(state) => (
        <Container ref={aboutRef} state={state} transitionDuration={transitionDuration}>
          <Button
            size="small"
            icon="ArrowLeft"
            variant="ghost"
            onClick={() => setMobileAboutOpen(false)}
          >
            Back
          </Button>
          <LinkContainer>
            <LinkLine href="https://github.com/storybookjs/storybook" target="_blank">
              <LinkLeft>
                <Icon.Github />
                <span>Github</span>
              </LinkLeft>
              <Icon.ShareAlt size={12} />
            </LinkLine>
            <LinkLine
              href="https://storybook.js.org/docs/react/get-started/install/"
              target="_blank"
            >
              <LinkLeft>
                <Icon.Storybook />
                <span>Documentation</span>
              </LinkLeft>
              <Icon.ShareAlt size={12} />
            </LinkLine>
          </LinkContainer>
          <UpgradeBlock />
          <BottomText>
            Open source software maintained by{' '}
            <Link href="https://chromatic.com" target="_blank" variant="secondary" weight="bold">
              Chromatic
            </Link>{' '}
            and the{' '}
            <Link
              href="https://github.com/storybookjs/storybook/graphs/contributors"
              variant="secondary"
              weight="bold"
            >
              Storybook Community
            </Link>
          </BottomText>
        </Container>
      )}
    </Transition>
  );
};
