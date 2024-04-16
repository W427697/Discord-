import { FaceHappyIcon } from '@storybook/icons';
import type { FC } from 'react';
import React from 'react';
import { styled } from '@storybook/theming';
import { readableColor, tint } from 'polished';

interface ButtonProps {
  accent: string;
  background: string;
}

const ButtonGhostStyled = styled.div<ButtonProps>(({ accent, background }) => ({
  background: 'transparent',
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  height: 28,
  padding: '0 8px',
  borderRadius: 4,
  transition: 'all 0.2s',
  cursor: 'pointer',
  fontSize: 14,
  color: readableColor(background, 'rgba(0, 0, 0, 0.6)', 'rgba(255, 255, 255, 0.8)'),

  '&:hover': {
    background: tint(0.9, accent),
    color: accent,
  },
}));

const ButtonOutlineStyled = styled.div<ButtonProps>(({ accent, background }) => ({
  background: 'transparent',
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  height: 28,
  padding: '0 8px',
  borderRadius: 4,
  transition: 'all 0.2s',
  cursor: 'pointer',
  fontSize: 14,
  color: readableColor(background, 'rgba(0, 0, 0, 0.6)', 'rgba(255, 255, 255, 0.8)'),
  border: `1px solid ${readableColor(
    background,
    'rgba(0, 0, 0, 0.16)',
    'rgba(255, 255, 255, 0.4)'
  )}`,

  '&:hover': {
    background: tint(0.9, accent),
    color: accent,
    border: `1px solid ${tint(0.6, accent)}`,
  },
}));

export const ButtonGhost: FC<ButtonProps> = ({ accent, background }) => {
  return (
    <ButtonGhostStyled accent={accent} background={background}>
      <FaceHappyIcon />
      Hello World
    </ButtonGhostStyled>
  );
};

export const ButtonOutline: FC<ButtonProps> = ({ accent, background }) => {
  return (
    <ButtonOutlineStyled accent={accent} background={background}>
      <FaceHappyIcon />
      Hello World
    </ButtonOutlineStyled>
  );
};
