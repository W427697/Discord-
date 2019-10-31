import React from 'react';

import { TitlePage, IsolatedPage, CodePage } from './page';

export default {
  title: 'Components|Page',
};

export const titlePage = () => <TitlePage>Content</TitlePage>;

titlePage.story = {
  name: 'TitlePage',
};

export const isolatedPage = () => <IsolatedPage>Content</IsolatedPage>;

isolatedPage.story = {
  name: 'IsolatedPage',
};

export const codePage = () => <CodePage>{`<div>Content</div>`}</CodePage>;

codePage.story = {
  name: 'CodePage',
};
