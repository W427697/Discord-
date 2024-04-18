import { styled } from '@storybook/theming';
import { rgba } from 'polished';

export const FileList = styled('div')(({ theme }) => ({
  height: '280px',
  overflow: 'auto',
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
  '::-webkit-scrollbar': {
    display: 'none',
  },
  // after element which fades out the list
  '&::after': {
    content: '""',
    position: 'absolute',
    pointerEvents: 'none',
    bottom: 0,
    left: 0,
    right: 0,
    height: '80px',
    background: `linear-gradient(${rgba(theme.barBg, 0)} 10%, ${theme.barBg} 80%)`,
  },
}));

export const FileListItem = styled('li')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',

  ':focus-visible': {
    outline: 'none',

    '> div': {
      borderRadius: '4px',
      background: theme.base === 'dark' ? 'rgba(255,255,255,.1)' : theme.color.mediumlight,

      '> svg': {
        display: 'flex',
      },
    },
  },
}));
