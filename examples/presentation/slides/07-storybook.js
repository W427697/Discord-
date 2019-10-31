import React from 'react';

import { withKnobs, boolean, text } from '@storybook/addon-knobs';

import { Logo } from '@storybook/components';
import ChromaticLogo from '../other/chromatic';

import { TitlePage } from '../components/page';
import Heading from '../components/heading';
import Hr from '../components/hr';

export default {
  title: 'Slides|storybook',

  decorators: [
    withKnobs({
      escapeHTML: false,
    }),
  ],
};

export const embraceComponents = () => (
  <TitlePage>
    <Heading type="sub" mods={['centered']}>
      Key take away
    </Heading>
    <Hr />
    <Heading type="main" mods={['centered']}>
      Embrace using components beyond the visual 🤗
    </Heading>
  </TitlePage>
);

embraceComponents.story = {
  name: 'embrace components',
};

export const tooManyComponents = () => (
  <TitlePage>
    <Heading type="sub" mods={['centered']}>
      problem:
    </Heading>
    <Hr />
    <Heading type="main" mods={['centered']}>
      So many components! 🤯
    </Heading>
  </TitlePage>
);

tooManyComponents.story = {
  name: 'too many components',
};

export const enterStorybook = () => {
  const bool = boolean('colored', true);
  const width = text('width', '50vw');
  return (
    <TitlePage>
      <Heading type="sub" mods={['centered']}>
        solution:
      </Heading>
      {bool ? <Logo colored width={width} /> : <Logo width={width} />}
    </TitlePage>
  );
};

enterStorybook.story = {
  name: 'enter storybook',
};

export const addAddons = () => (
  <TitlePage>
    <Heading type="main" mods={['centered']}>
      Add your own addons
    </Heading>
  </TitlePage>
);

addAddons.story = {
  name: 'add addons',
};

export const addTests = () => (
  <TitlePage>
    <Heading type="main" mods={['centered']}>
      Get all stories snapshotted
    </Heading>
  </TitlePage>
);

addTests.story = {
  name: 'add tests',
};

export const addIntegration = () => (
  <TitlePage>
    <Heading type="main" mods={['centered']}>
      Add visual review
    </Heading>
    <ChromaticLogo />
  </TitlePage>
);

addIntegration.story = {
  name: 'add integration',
};

export const addYourOwnFeatures = () => (
  <TitlePage>
    <center>
      <Logo colored width="200" />
    </center>
    <Heading type="sub" mods={['centered']}>
      is open source
    </Heading>
    <Hr />
    <Heading type="main" mods={['centered']}>
      We welcome your help
    </Heading>
  </TitlePage>
);

addYourOwnFeatures.story = {
  name: 'add your own features',
};

export const communities = () => (
  <TitlePage>
    <center>
      <Logo colored width="200" />
    </center>
    <Heading type="sub" mods={['centered']}>
      we support many frameworks
    </Heading>
    <Hr />
    <Heading type="main" mods={['centered']}>
      We're trying to build a tool for all UI developers
    </Heading>
    <Hr />
    <Heading type="sub" mods={['centered']}>
      and accessible for non-technical team members
    </Heading>
  </TitlePage>
);

communities.story = {
  name: 'communities',
};
