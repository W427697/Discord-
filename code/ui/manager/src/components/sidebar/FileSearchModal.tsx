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
import { AlertIcon, CheckIcon, CloseAltIcon, RefreshIcon, SearchIcon } from '@storybook/icons';
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
import type { SearchResult } from './FileSearchList';
import { FileSearchList } from './FileSearchList';
import type { Channel } from '@storybook/channels';
import { extractSeededRequiredArgs, selectNewStory } from './FileSearchModal.utils';

interface FileSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ModalInput = styled(Form.Input)(({ theme }) => ({
  color: theme.color.darkest,
  paddingLeft: 40,
  paddingRight: 28,
  fontSize: 14,
  height: 40,

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
  color: theme.textMutedColor,
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
});

const ModalErrorCloseIcon = styled(CloseAltIcon)({
  position: 'absolute',
  top: 8,
  right: 16,
  cursor: 'pointer',
});

export const FileSearchModal = ({ open, onOpenChange }: FileSearchModalProps) => {
  const [, startTransition] = useTransition();
  const [isLoading, setLoading] = useState(false);
  const [fileSearchQuery, setFileSearchQuery] = useState('');
  const fileSearchQueryDebounced = useDebounce(fileSearchQuery, 200);
  const fileSearchQueryDeferred = useDeferredValue(fileSearchQueryDebounced);
  const emittedValue = useRef<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const api = useStorybookApi();

  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(null);

  const handleErrorWhenCreatingStory = useCallback(() => {
    api.addNotification({
      id: 'create-new-story-file-error',
      content: {
        headline: 'Error while creating story file',
        subHeadline: `Take a look at your developer console for more information`,
      },
      duration: 8_000,
      icon: <AlertIcon />,
    });

    onOpenChange(false);
  }, [api, onOpenChange]);

  const handleSuccessfullyCreatedStory = useCallback(
    (componentExportName: string) => {
      api.addNotification({
        id: 'create-new-story-file-success',
        content: {
          headline: 'Story file created',
          subHeadline: `${componentExportName} was created`,
        },
        duration: 8_000,
        icon: <CheckIcon />,
      });

      onOpenChange(false);
    },
    [api, onOpenChange]
  );

  const handleCreateNewStory = useCallback(
    async ({
      componentExportName,
      componentFilePath,
      componentIsDefaultExport,
    }: CreateNewStoryPayload) => {
      try {
        const channel = addons.getChannel();

        const createNewStoryResult = await oncePromise<CreateNewStoryPayload, CreateNewStoryResult>(
          {
            channel,
            request: {
              name: CREATE_NEW_STORYFILE_REQUEST,
              payload: {
                componentExportName,
                componentFilePath,
                componentIsDefaultExport,
              },
            },
            resolveEvent: CREATE_NEW_STORYFILE_RESPONSE,
          }
        );

        if (createNewStoryResult.success) {
          setError(null);

          const storyId = createNewStoryResult.result.storyId;

          await selectNewStory(api.selectStory, storyId);

          const argTypesInfoResult = await oncePromise<ArgTypesInfoPayload, ArgTypesInfoResult>({
            channel,
            request: {
              name: ARGTYPES_INFO_REQUEST,
              payload: { storyId },
            },
            resolveEvent: ARGTYPES_INFO_RESPONSE,
          });

          if (argTypesInfoResult.success) {
            const argTypes = argTypesInfoResult.result.argTypes;

            const requiredArgs = extractSeededRequiredArgs(argTypes);

            await oncePromise<SaveStoryRequest, SaveStoryResponse>({
              channel,
              request: {
                name: SAVE_STORY_REQUEST,
                payload: {
                  id: storyId,
                  payload: {
                    args: requiredArgs,
                    importPath: createNewStoryResult.result.storyFilePath,
                    csfId: storyId,
                  },
                },
              },
              resolveEvent: SAVE_STORY_RESPONSE,
            });
          }

          handleSuccessfullyCreatedStory(componentExportName);
        } else {
          setError(createNewStoryResult.error);
        }
      } catch (e) {
        handleErrorWhenCreatingStory();
      }
    },
    [api, handleSuccessfullyCreatedStory, handleErrorWhenCreatingStory]
  );

  useEffect(() => {
    setLoading(true);
    const channel = addons.getChannel();

    const set = (data: FileComponentSearchResult) => {
      if (data.success) {
        if (data.result?.searchQuery === fileSearchQueryDeferred && data.result.files) {
          setSearchResults(data.result.files);
        }
      } else {
        setError(data.error);
      }
      setLoading(false);
    };

    channel.on(FILE_COMPONENT_SEARCH_RESPONSE, set);

    if (fileSearchQueryDeferred !== '' && emittedValue.current !== fileSearchQueryDeferred) {
      emittedValue.current = fileSearchQueryDeferred;
      channel.emit(FILE_COMPONENT_SEARCH_REQUEST, {
        searchQuery: fileSearchQueryDeferred,
      } satisfies FileComponentSearchPayload);
    } else {
      setSearchResults(null);
      setLoading(false);
    }

    return () => {
      channel.off(FILE_COMPONENT_SEARCH_RESPONSE, set);
    };
  }, [fileSearchQueryDeferred, setSearchResults, setLoading]);

  return (
    <Modal
      height={418}
      width={440}
      open={open}
      onOpenChange={onOpenChange}
      onEscapeKeyDown={() => {
        onOpenChange(false);
      }}
      onInteractOutside={() => {
        onOpenChange(false);
      }}
    >
      <Modal.Content>
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
              <RefreshIcon />
            </LoadingIcon>
          )}
        </SearchField>
        {
          <FileSearchList
            isLoading={isLoading}
            searchResults={searchResults}
            onNewStory={handleCreateNewStory}
          />
        }
      </Modal.Content>
      {error && (
        <ModalError>
          {error}
          <ModalErrorCloseIcon
            onClick={() => {
              setError(null);
            }}
          />
        </ModalError>
      )}
    </Modal>
  );
};

interface OncePromiseOptions<Payload> {
  channel: Channel;
  request: {
    name: string;
    payload: Payload;
  };
  resolveEvent: string;
}

function oncePromise<Payload, Result>({
  channel,
  request,
  resolveEvent,
}: OncePromiseOptions<Payload>): Promise<Result> {
  return new Promise((resolve, reject) => {
    channel.once(resolveEvent, (data: Result) => {
      resolve(data);
    });

    channel.emit(request.name, request.payload as Payload);

    // If the channel supports error events, you can reject the promise on error
    channel.once(resolveEvent, (error: any) => {
      reject(error);
    });
  });
}
