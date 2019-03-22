import React, { ReactElement, Component, Fragment, ReactNode } from 'react';
import { types } from '@storybook/addons';
import { API, Consumer, Combo } from '@storybook/api';
import { styled } from '@storybook/theming';

import {
  SyntaxHighlighter as SyntaxHighlighterBase,
  Placeholder,
  DocumentFormatting,
  Link,
  Preview,
} from '@storybook/components';
import Giphy from './giphy';
import Markdown from 'markdown-to-jsx';

import { PARAM_KEY, Parameters } from './shared';

const PropsTableWrapper = styled.div(({ theme }) => ({
  background: 'hotpink',
  marginBottom: theme.layoutMargin,
}));

const propsMapper = ({ state, api }: Combo) => {
  const { storyId, storiesHash } = state;

  return { currentId: storyId, storiesHash, api };
};

interface In {
  currentId: string;
  api: API;
}

interface PreviewProps {
  storyId?: string;
}

interface PreviewData {
  api: API;
  getElements: API['getElements'];
  location: Combo['state']['location'];
  path: Combo['state']['path'];
  storyId: Combo['state']['storyId'];
}

const previewMapper = ({
  api,
  state: { location, path, storyId },
}: Combo): PreviewData | { renderPreview: API['renderPreview'] } =>
  api.renderPreview
    ? { renderPreview: api.renderPreview }
    : {
        api,
        getElements: api.getElements,
        location,
        path,
        storyId,
      };

const PreviewSize = styled.div(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: 600,
  border: '1px solid ' + theme.appBorderColor,
  borderRadius: theme.appBorderRadius,
  marginBottom: theme.layoutMargin,
}));

const ConnectedPreview = ({ storyId }: PreviewProps) => (
  <PreviewSize>
    <Consumer filter={previewMapper}>
      {(fromState: PreviewData) => (
        <Fragment>
          FOO: {storyId || fromState.storyId}
          <Preview
            api={{}}
            {...fromState}
            getElements={(type: string): ReturnType<typeof fromState.getElements> => {
              if (type === types.TAB) {
                return {};
              }
              return fromState.getElements(type);
            }}
            path={fromState.path}
            viewMode="story"
            storyId={storyId || fromState.storyId}
            id={`notes-${storyId}`}
          />
        </Fragment>
      )}
    </Consumer>
  </PreviewSize>
);

const PropsTable = ({ id }: { id?: string }) => (
  <Consumer filter={propsMapper}>
    {({ currentId, api }: In) => {
      const props = api.getParameters(id || currentId, 'props');
      return (
        <PropsTableWrapper>
          <pre>{JSON.stringify(props, null, 2)}</pre>
        </PropsTableWrapper>
      );
    }}
  </Consumer>
);

const Panel = styled.div({
  padding: '3rem 40px',
  boxSizing: 'border-box',
  width: '100%',
  maxWidth: 980,
  margin: '0 auto',
});

interface Props {
  active: boolean;
  api: API;
}

function read(param: Parameters | undefined): string | undefined {
  if (!param) {
    return undefined;
  } else if (typeof param === 'string') {
    return param;
  } else if ('disabled' in param) {
    return undefined;
  } else if ('text' in param) {
    return param.text;
  } else if ('markdown' in param) {
    return param.markdown;
  }
}

interface SyntaxHighlighterProps {
  className?: string;
  children: ReactElement;
  [key: string]: any;
}
export const SyntaxHighlighter = ({ className, children, ...props }: SyntaxHighlighterProps) => {
  // markdown-to-jsx does not add className to inline code
  if (typeof className !== 'string') {
    return <code>{children}</code>;
  }
  // className: "lang-jsx"
  const language = className.split('-');
  return (
    <SyntaxHighlighterBase language={language[1] || 'plaintext'} bordered copyable {...props}>
      {children}
    </SyntaxHighlighterBase>
  );
};

// use our SyntaxHighlighter component in place of a <code> element when
// converting markdown to react elements
const defaultOptions = {
  overrides: {
    code: SyntaxHighlighter,
    Giphy: {
      component: Giphy,
    },
    Props: {
      component: PropsTable,
    },
    Preview: {
      component: ConnectedPreview,
    },
  },
};

interface Overrides {
  overrides: {
    [type: string]: ReactNode;
  };
}
type Options = typeof defaultOptions & Overrides;

const mapper = ({ state, api }: Combo): { value?: string; options: Options } => {
  const extraElements = Object.entries(api.getElements(types.NOTES_ELEMENT)).reduce(
    (acc, [k, v]) => ({ ...acc, [k]: v.render }),
    {}
  );

  const options = {
    ...defaultOptions,
    overrides: { ...defaultOptions.overrides, ...extraElements },
  };

  const story = state.storiesHash[state.storyId];
  const value = read(story ? api.getParameters(story.id, PARAM_KEY) : undefined);

  return { options, value };
};

const NotesPanel = ({ active }: Props) => {
  if (!active) {
    return null;
  }

  return (
    <Consumer filter={mapper}>
      {({ options, value }: { options: Options; value?: string }) => {
        return value ? (
          <Panel className="addon-notes-container">
            <DocumentFormatting>
              <Markdown options={options}>{value}</Markdown>
            </DocumentFormatting>
          </Panel>
        ) : (
          <Placeholder>
            <Fragment>No notes yet</Fragment>
            <Fragment>
              Learn how to{' '}
              <Link
                href="https://github.com/storybooks/storybook/tree/master/addons/notes"
                target="_blank"
                withArrow
              >
                document components in Markdown
              </Link>
            </Fragment>
          </Placeholder>
        );
      }}
    </Consumer>
  );
};

export default NotesPanel;
