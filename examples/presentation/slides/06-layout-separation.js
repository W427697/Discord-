import React from 'react';

import Heading from '../components/heading';
import { CodePage, TitlePage, IsolatedPage } from '../components/page';
import { Placeholder } from '../components/layout/placeholder';
import SideBySide from '../components/layout/side-by-side';

export default {
  title: 'Slides|layout separation',
};

export const encapsulationAgain = () => (
  <TitlePage>
    <Heading type="main">Encapsulates the UI Pattern, no more, no less.</Heading>
  </TitlePage>
);

encapsulationAgain.story = {
  name: 'encapsulation again',
};

export const layoutAsAPattern = () => (
  <TitlePage>
    <Heading type="main">Sometimes a UI pattern can be as simple as "I want this layout"</Heading>
  </TitlePage>
);

layoutAsAPattern.story = {
  name: 'layout as a pattern',
};

export const layoutAsAPatternStory = () => (
  <CodePage scope={{ SideBySide, Placeholder }}>{`
      <SideBySide>
        <Placeholder color="hotpink">content</Placeholder>
        <Placeholder color="deepskyblue">content</Placeholder>
      </SideBySide>
    `}</CodePage>
);

layoutAsAPatternStory.story = {
  name: 'layout as a pattern',
};

export const layoutAsAPatternIsolated = () => (
  <IsolatedPage>
    <SideBySide>
      <Placeholder color="hotpink">content</Placeholder>
      <Placeholder color="deepskyblue">content</Placeholder>
    </SideBySide>
  </IsolatedPage>
);

layoutAsAPatternIsolated.story = {
  name: 'layout as a pattern isolated',
};
