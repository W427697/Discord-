import React from 'react';
import { styled } from '@storybook/theming';
import { FileList, FileListItem } from './FileList';

const FileListItemContentWrapperSkeleton = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '8px',
  alignSelf: 'stretch',
  padding: '8px 16px',
}));

const FileListItemContentSkeleton = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  width: '100%',
});

const FileListIconWrapperSkeleton = styled.div(({ theme }) => ({
  width: '14px',
  height: '14px',
  background: theme.base === 'dark' ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.1)',
  animation: `${theme.animation.glow} 1.5s ease-in-out infinite`,
}));

const FileListItemSkeleton = styled.div(({ theme }) => ({
  height: '14px',
  background: theme.base === 'dark' ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.1)',
  animation: `${theme.animation.glow} 1.5s ease-in-out infinite`,
  width: '100%',

  '+ div': {
    marginTop: '8px',
  },
}));

export const FileSearchListLoadingSkeleton = () => {
  return (
    <FileList>
      {[1, 2, 3, 4, 5].map((result) => (
        <FileListItem key={result}>
          <FileListItemContentWrapperSkeleton>
            <FileListIconWrapperSkeleton />
            <FileListItemContentSkeleton>
              <FileListItemSkeleton />
              <FileListItemSkeleton />
            </FileListItemContentSkeleton>
          </FileListItemContentWrapperSkeleton>
        </FileListItem>
      ))}
    </FileList>
  );
};
