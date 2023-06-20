import React, { useEffect } from 'react';
import type { FC, ReactElement } from 'react';
import { styled } from '@storybook/theming';
import tocbot from 'tocbot';

export interface TocParameters {
  /** CSS selector for the container to search for headings. */
  contentsSelector?: string;

  /**
   * When true, hide the TOC. We still show the empty container
   * (as opposed to showing nothing at all) because it affects the
   * page layout and we want to preserve the layout across pages.
   */
  disable?: boolean;

  /** CSS selector to match headings to list in the TOC. */
  headingSelector?: string;

  /** Headings that match the ignoreSelector will be skipped. */
  ignoreSelector?: string;

  /** Custom title ReactElement or string to display above the TOC. */
  title?: ReactElement | string | null;

  /**
   * TocBot options, not guaranteed to be available in future versions.
   * See [tocbot docs](https://tscanlin.github.io/tocbot/#usage)
   */
  unsafeTocbotOptions?: tocbot.IStaticOptions;
}

const space = (n: number) => `${n * 10}px`;

const Container = styled('div')`
  font-family: ${(p) => p.theme.typography.fonts.base};
  height: 100%;
  display: none;
  width: 10rem;

  @media only screen and (min-width: 1200px) {
    display: block;
  }
`;

const Content = styled('div')`
  position: fixed;
  top: 0;
  width: 10rem;
  padding-top: 4rem;

  & > .toc-wrapper > .toc-list {
    padding-left: 0;
    border-left: solid 2px ${(p) => p.theme.color.mediumlight};

    .toc-list {
      padding-left: 0;
      border-left: solid 2px ${(p) => p.theme.color.mediumlight};

      .toc-list {
        padding-left: 0;
        border-left: solid 2px ${(p) => p.theme.color.mediumlight};
      }
    }
  }
  & .toc-list-item {
    position: relative;
    list-style-type: none;
    margin-left: ${space(2)};
  }
  & .toc-list-item::before {
    content: '';
    position: absolute;
    height: 100%;
    top: 0;
    left: 0;
    transform: translateX(calc(-2px - ${space(2)}));
    border-left: solid 2px ${(p) => p.theme.color.mediumdark};
    opacity: 0;
    transition: opacity 0.2s;
  }
  & .toc-list-item.is-active-li::before {
    opacity: 1;
  }
  & .toc-list-item > a {
    color: ${(p) => p.theme.color.defaultText};
  }
  & .toc-list-item.is-active-li > a {
    font-weight: 600;
    color: ${(p) => p.theme.color.secondary};
  }
`;

const Heading = styled('p')`
  font-weight: 600;
  font-size: 0.875em;
  color: ${(p) => p.theme.textColor};
  text-transform: uppercase;
  margin-bottom: ${space(1)};
`;

type TableOfContentsProps = React.PropsWithChildren<
  TocParameters & {
    className?: string;
  }
>;

const OptionalTitle: FC<{ title: TableOfContentsProps['title'] }> = ({ title }) => {
  if (title === null) return null;
  if (typeof title === 'string') return <Heading>{title}</Heading>;
  return title;
};

export const TableOfContents = ({
  title,
  disable,
  headingSelector,
  contentsSelector,
  ignoreSelector,
  unsafeTocbotOptions,
}: TableOfContentsProps) => {
  console.log({ title, disable, headingSelector, ignoreSelector, unsafeTocbotOptions });
  useEffect(() => {
    const configuration = {
      tocSelector: '.toc-wrapper',
      contentSelector: contentsSelector ?? '.sbdocs-content',
      headingSelector: headingSelector ?? 'h3',
      ignoreSelector: ignoreSelector ?? '.skip-toc',
      headingsOffset: 40,
      scrollSmoothOffset: -40,
      /**
       * Ignore headings that did not
       * come from the main markdown code.
       */
      // ignoreSelector: ':not(.sbdocs), .hide-from-toc',
      orderedList: false,
      /**
       * Prevent default linking behavior,
       * leaving only the smooth scrolling.
       */
      onClick: () => false,
      ...unsafeTocbotOptions,
    };
    console.log({ configuration });

    /**
     * Wait for the DOM to be ready.
     */
    setTimeout(() => tocbot.init(configuration), 100);
  }, [disable]);

  return (
    <Container>
      {!disable && (
        <Content>
          <OptionalTitle title={title || null} />
          <div className="toc-wrapper" />
        </Content>
      )}
    </Container>
  );
};
