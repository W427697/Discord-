import type { ComponentProps } from 'react';
import React from 'react';

import { Route } from '@storybook/router';

import { Global, createGlobal } from '@storybook/theming';
import { Symbols } from '@storybook/components';
import type { Addon_PageType } from '@storybook/types';
import { useStorybookApi } from '@storybook/manager-api';
import Sidebar from './container/Sidebar';
import Preview from './container/Preview';
import Panel from './container/Panel';

import { Layout } from './components/layout/Layout';
import { useMobileLayoutContext } from './components/mobile/MobileLayoutProvider';

type Props = {
  managerLayoutState: ComponentProps<typeof Layout>['managerLayoutState'];
  setManagerLayoutState: ComponentProps<typeof Layout>['setManagerLayoutState'];
  pages: Addon_PageType[];
};

export const App = ({ managerLayoutState, setManagerLayoutState, pages }: Props) => {
  const api = useStorybookApi();
  const storyTitle = api.getCurrentStoryData()?.title;
  const mobileLayoutContext = useMobileLayoutContext();

  return (
    <>
      <Global styles={createGlobal} />
      <Symbols icons={['folder', 'component', 'document', 'bookmarkhollow']} />
      <Layout
        managerLayoutState={managerLayoutState}
        setManagerLayoutState={setManagerLayoutState}
        slotMain={
          <Route path={/(^\/story|docs|onboarding\/|^\/$)/} hideOnly>
            <Preview id="main" withLoader />
          </Route>
        }
        slotSidebar={
          <Sidebar onMenuClick={() => mobileLayoutContext.setMobileAboutOpen((state) => !state)} />
        }
        slotPanel={<Panel />}
        slotPages={pages.map(({ id, render: Content }) => (
          <Content key={id} />
        ))}
        storyTitle={storyTitle}
      />
    </>
  );
};
