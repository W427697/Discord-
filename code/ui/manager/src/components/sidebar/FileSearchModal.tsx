import React, {
  useCallback,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
  useTransition,
} from 'react';
import { Modal, Form } from '@storybook/components';
import { styled } from '@storybook/theming';
import { AlertIcon, CheckIcon, CloseAltIcon, SearchIcon, SyncIcon } from '@storybook/icons';
import type {
  ArgTypesInfoPayload,
  ArgTypesInfoResult,
  CreateNewStoryPayload,
  CreateNewStoryResult,
  FileComponentSearchPayload,
  FileComponentSearchResult,
  SaveStoryRequest,
  SaveStoryResponse,
} from '@storybook/core-events';
import {
  ARGTYPES_INFO_REQUEST,
  ARGTYPES_INFO_RESPONSE,
  CREATE_NEW_STORYFILE_REQUEST,
  CREATE_NEW_STORYFILE_RESPONSE,
  FILE_COMPONENT_SEARCH_REQUEST,
  FILE_COMPONENT_SEARCH_RESPONSE,
  SAVE_STORY_REQUEST,
  SAVE_STORY_RESPONSE,
} from '@storybook/core-events';
import { addons, useStorybookApi } from '@storybook/manager-api';

import { useDebounce } from '../../hooks/useDebounce';
import type { NewStoryPayload, SearchResult } from './FileSearchList';
import { FileSearchList } from './FileSearchList';
import type { Channel } from '@storybook/channels';
import { extractSeededRequiredArgs, trySelectNewStory } from './FileSearchModal.utils';
import { useMeasure } from './useMeasure';

const MODAL_HEIGHT = 418;

const ModalStyled = styled(Modal)(() => ({
  boxShadow: 'none',
  background: 'transparent',
}));

const ModalChild = styled.div<{ height?: number }>(({ theme, height }) => ({
  backgroundColor: theme.background.bar,
  borderRadius: 6,
  boxShadow: `rgba(255, 255, 255, 0.05) 0 0 0 1px inset, rgba(14, 18, 22, 0.35) 0px 10px 18px -10px`,
  padding: '16px',
  transition: 'height 0.3s',
  height: height ? `${height + 32}px` : 'auto',
  overflow: 'hidden',
}));

const ModalContent = styled(Modal.Content)({
  margin: 0,
});

const ModalInput = styled(Form.Input)(({ theme }) => ({
  paddingLeft: 40,
  paddingRight: 28,
  fontSize: 14,
  height: 40,

  ...(theme.base === 'light' && {
    color: theme.color.darkest,
  }),

  '::placeholder': {
    color: theme.color.mediumdark,
  },
  '&:invalid:not(:placeholder-shown)': {
    boxShadow: `${theme.color.negative} 0 0 0 1px inset`,
  },
  '&::-webkit-search-decoration, &::-webkit-search-cancel-button, &::-webkit-search-results-button, &::-webkit-search-results-decoration':
    {
      display: 'none',
    },
}));

const SearchField = styled.div({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  position: 'relative',
});

const SearchIconWrapper = styled.div(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 16,
  zIndex: 1,
  pointerEvents: 'none',
  color: theme.darkest,
  display: 'flex',
  alignItems: 'center',
  height: '100%',
}));

const LoadingIcon = styled.div(({ theme }) => ({
  position: 'absolute',
  top: 0,
  right: 16,
  zIndex: 1,
  color: theme.darkest,
  display: 'flex',
  alignItems: 'center',
  height: '100%',
  '@keyframes spin': {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
  },
  animation: 'spin 1s linear infinite',
}));

const ModalError = styled(Modal.Error)({
  position: 'absolute',
  padding: '8px 40px 8px 16px',
  bottom: 0,
  maxHeight: 'initial',
  width: '100%',

  div: {
    wordBreak: 'break-word',
  },

  '> div': {
    padding: 0,
  },
});

const ModalErrorCloseIcon = styled(CloseAltIcon)({
  position: 'absolute',
  top: 4,
  right: -24,
  cursor: 'pointer',
});

type Error = { selectedItemId?: number | string; error: string } | null;

interface FileSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileSearchQuery: string;
  fileSearchQueryDeferred: string;
  setFileSearchQuery: (query: string) => void;
  isLoading: boolean;
  error: Error;
  searchResults: SearchResult[] | null;
  onCreateNewStory: (payload: NewStoryPayload) => void;
  setError: (error: Error) => void;
  container?: HTMLElement;
}

export const FileSearchModal = ({
  open,
  onOpenChange,
  fileSearchQuery,
  setFileSearchQuery,
  isLoading,
  error,
  searchResults,
  onCreateNewStory,
  setError,
  container,
}: FileSearchModalProps) => {
  const [modalContentRef, modalContentDimensions] = useMeasure<HTMLDivElement>();
  const [modalMaxHeight, setModalMaxHeight] = useState<number>(modalContentDimensions.height);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (modalMaxHeight < modalContentDimensions.height) {
      setModalMaxHeight(modalContentDimensions.height);
    }
  }, [modalContentDimensions.height, modalMaxHeight]);

  return (
    <ModalStyled
      height={MODAL_HEIGHT}
      width={440}
      open={open}
      onOpenChange={onOpenChange}
      onEscapeKeyDown={() => {
        onOpenChange(false);
      }}
      onInteractOutside={() => {
        onOpenChange(false);
      }}
      container={container}
    >
      <ModalChild height={fileSearchQuery === '' ? modalContentDimensions.height : modalMaxHeight}>
        <ModalContent ref={modalContentRef}>
          <Modal.Header>
            <Modal.Title>Add a new story</Modal.Title>
            <Modal.Description>We will create a new story for your component</Modal.Description>
          </Modal.Header>
          <SearchField>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <ModalInput
              placeholder="Search for a component file"
              type="search"
              required
              autoFocus
              value={fileSearchQuery}
              onChange={(e) => {
                startTransition(() => {
                  setFileSearchQuery((e.target as HTMLInputElement).value);
                });
              }}
            />
            {isLoading && (
              <LoadingIcon>
                <SyncIcon />
              </LoadingIcon>
            )}
          </SearchField>
          {
            <FileSearchList
              errorItemId={error?.selectedItemId}
              isLoading={isLoading}
              searchResults={searchResults}
              onNewStory={onCreateNewStory}
            />
          }
        </ModalContent>
      </ModalChild>
      {error && fileSearchQuery !== '' && (
        <ModalError>
          <div>{error.error}</div>
          <ModalErrorCloseIcon
            onClick={() => {
              setError(null);
            }}
          />
        </ModalError>
      )}
    </ModalStyled>
  );
};
