import type { FC, SyntheticEvent } from 'react';
import React, { useContext } from 'react';
import { NAVIGATE_URL } from '@storybook/core-events';
import { Code, components, nameSpaceClassNames } from '@storybook/components';
import { global } from '@storybook/global';
import { styled } from '@storybook/theming';
import { Source } from '../components';
import type { DocsContextProps } from './DocsContext';
import { DocsContext } from './DocsContext';

const { document } = global;

// Hacky utility for asserting identifiers in MDX Story elements
export const assertIsFn = (val: any) => {
  if (typeof val !== 'function') {
    throw new Error(`Expected story function, got: ${val}`);
  }
  return val;
};

// Hacky utility for adding mdxStoryToId to the default context
export const AddContext: FC<DocsContextProps> = (props) => {
  const { children, ...rest } = props;
  const parentContext = React.useContext(DocsContext);
  return (
    <DocsContext.Provider value={{ ...parentContext, ...rest }}>{children}</DocsContext.Provider>
  );
};

interface CodeOrSourceMdxProps {
  className?: string;
}

export const CodeOrSourceMdx: FC<CodeOrSourceMdxProps> = ({ className, children, ...rest }) => {
  // markdown-to-jsx does not add className to inline code
  if (
    typeof className !== 'string' &&
    (typeof children !== 'string' || !(children as string).match(/[\n\r]/g))
  ) {
    return <Code>{children}</Code>;
  }
  // className: "lang-jsx"
  const language = className && className.split('-');
  return (
    <Source
      language={(language && language[1]) || 'plaintext'}
      format={false}
      code={children as string}
      {...rest}
    />
  );
};

function navigate(context: DocsContextProps, url: string) {
  context.channel.emit(NAVIGATE_URL, url);
}

const A = components.a;

interface AnchorInPageProps {
  hash: string;
}

const AnchorInPage: FC<AnchorInPageProps> = ({ hash, children }) => {
  const context = useContext(DocsContext);

  return (
    <A
      href={hash}
      target="_self"
      onClick={(event: SyntheticEvent) => {
        const id = hash.substring(1);
        const element = document.getElementById(id);
        if (element) {
          navigate(context, hash);
        }
      }}
    >
      {children}
    </A>
  );
};

interface AnchorMdxProps {
  href: string;
  target: string;
}

export const AnchorMdx: FC<AnchorMdxProps> = (props) => {
  const { href, target, children, ...rest } = props;
  const context = useContext(DocsContext);

  if (href) {
    // Enable scrolling for in-page anchors.
    if (href.startsWith('#')) {
      return <AnchorInPage hash={href}>{children}</AnchorInPage>;
    }

    // Links to other pages of SB should use the base URL of the top level iframe instead of the base URL of the preview iframe.
    if (target !== '_blank' && !href.startsWith('https://')) {
      return (
        <A
          href={href}
          onClick={(event: SyntheticEvent) => {
            event.preventDefault();
            // use the A element's href, which has been modified for
            // local paths without a `?path=` query param prefix
            navigate(context, event.currentTarget.getAttribute('href'));
          }}
          target={target}
          {...rest}
        >
          {children}
        </A>
      );
    }
  }

  // External URL dont need any modification.
  return <A {...props} />;
};

const SUPPORTED_MDX_HEADERS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;

const OcticonHeaders = SUPPORTED_MDX_HEADERS.reduce(
  (acc, headerType) => ({
    ...acc,
    [headerType]: styled(headerType)({
      '& svg': {
        visibility: 'hidden',
        marginTop: 'calc(1em - 14px)',
      },
      '&:hover svg': {
        visibility: 'visible',
      },
    }),
  }),
  {}
);

const OcticonAnchor = styled.a(() => ({
  float: 'left',
  lineHeight: 'inherit',
  paddingRight: '10px',
  marginLeft: '-24px',
  // Allow the theme's text color to override the default link color.
  color: 'inherit',
}));

interface HeaderWithOcticonAnchorProps {
  as: string;
  id: string;
  children: any;
}

const HeaderWithOcticonAnchor: FC<HeaderWithOcticonAnchorProps> = ({
  as,
  id,
  children,
  ...rest
}) => {
  const context = useContext(DocsContext);

  // @ts-expect-error (Converted from ts-ignore)
  const OcticonHeader = OcticonHeaders[as];
  const hash = `#${id}`;

  return (
    <OcticonHeader id={id} {...rest}>
      <OcticonAnchor
        aria-hidden="true"
        href={hash}
        tabIndex={-1}
        target="_self"
        onClick={(event: SyntheticEvent) => {
          const element = document.getElementById(id);
          if (element) {
            navigate(context, hash);
          }
        }}
      >
        <svg viewBox="0 0 14 14" width="14px" height="14px">
          <path
            fill="currentColor"
            d="M11.84 2.16a2.25 2.25 0 0 0-3.18 0l-2.5 2.5c-.88.88-.88 2.3 0 3.18a.5.5 0 0 1-.7.7 3.25 3.25 0 0 1 0-4.59l2.5-2.5a3.25 3.25 0 0 1 4.59 4.6L10.48 8.1c.04-.44.01-.89-.09-1.32l1.45-1.45c.88-.88.88-2.3 0-3.18Z"
          />
          <path
            fill="currentColor"
            d="M3.6 7.2c-.1-.42-.12-.87-.08-1.31L1.45 7.95a3.25 3.25 0 1 0 4.6 4.6l2.5-2.5a3.25 3.25 0 0 0 0-4.6.5.5 0 0 0-.7.7c.87.89.87 2.31 0 3.2l-2.5 2.5a2.25 2.25 0 1 1-3.2-3.2l1.46-1.44Z"
          />
        </svg>
      </OcticonAnchor>
      {children}
    </OcticonHeader>
  );
};

interface HeaderMdxProps {
  as: string;
  id: string;
}

export const HeaderMdx: FC<HeaderMdxProps> = (props) => {
  const { as, id, children, ...rest } = props;

  // An id should have been added on every header by the "remark-slug" plugin.
  if (id) {
    return (
      <HeaderWithOcticonAnchor as={as} id={id} {...rest}>
        {children}
      </HeaderWithOcticonAnchor>
    );
  }
  // Make sure it still work if "remark-slug" plugin is not present.
  const Component = as as React.ElementType;
  const { as: omittedAs, ...withoutAs } = props;
  return <Component {...nameSpaceClassNames(withoutAs, as)} />;
};

export const HeadersMdx = SUPPORTED_MDX_HEADERS.reduce(
  (acc, headerType) => ({
    ...acc,
    // @ts-expect-error (Converted from ts-ignore)
    [headerType]: (props: object) => <HeaderMdx as={headerType} {...props} />,
  }),
  {}
);
