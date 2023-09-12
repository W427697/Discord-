import type { ComponentProps } from 'react';
import React from 'react';

import { Route } from '@storybook/router';

import { Global, createGlobal } from '@storybook/theming';
import { Symbols } from '@storybook/components';
import type { Addon_PageType } from '@storybook/types';
import Sidebar from './container/Sidebar';
import Preview from './container/Preview';
import Panel from './container/Panel';

import { Layout } from './components/layout/Layout';
import { usePersistence } from './components/layout/Layout.persistence';

type Props = ComponentProps<typeof Layout>['state'] & {
  setLayoutState: ComponentProps<typeof Layout>['setState'];
  pages: Addon_PageType[];
};

export const App = ({ setLayoutState, pages, ...state }: Props) => {
  return (
    <>
      <Global styles={createGlobal} />
      <Symbols icons={['folder', 'component', 'document', 'bookmarkhollow']} />
      <Layout
        persistence={usePersistence()}
        state={state}
        setState={setLayoutState}
        slotMain={
          <Route path={/(^\/story|docs|onboarding\/|^\/$)/} hideOnly>
            <Preview />
          </Route>
        }
        slotSidebar={<Sidebar />}
        slotPanel={<Panel />}
        slotPages={pages.map(({ id, render: Content }) => (
          <Content key={id} />
        ))}
      />
    </>
  );
};
