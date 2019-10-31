import React from 'react';

import { CodePage, TitlePage } from '../components/page';
import Heading from '../components/heading';
import Hr from '../components/hr';

import * as Carousels from '../components/accordion/implementations';

const { items } = Carousels;

export default {
  title: 'Slides|examples',
};

export const reactComponent = () => (
  <TitlePage>
    <Heading type="main" mods={['centered']}>
      ⚛️ components abstract a section of UI
    </Heading>
    <Hr />
    <Heading type="sub" mods={['centered']}>
      right? 🙄
    </Heading>
  </TitlePage>
);

reactComponent.story = {
  name: 'react component',
};

export const sortOf = () => (
  <TitlePage>
    <Heading type="main" mods={['centered']}>
      Sort of 🤷‍
    </Heading>
  </TitlePage>
);

sortOf.story = {
  name: 'sort of',
};

export const definitionOfAComponent = () => (
  <TitlePage>
    <Heading type="main" mods={['centered']}>
      Components should abstract a UI <strong>pattern/concept</strong>.
    </Heading>
    <Hr />
    <Heading type="sub" mods={['centered']}>
      This is different from "a section of visible UI".
    </Heading>
  </TitlePage>
);

definitionOfAComponent.story = {
  name: 'definition of a component',
};

export const uiConcept = () => (
  <TitlePage>
    <Heading type="main" mods={['centered']}>
      UI concepts <strong>can</strong> be visible.
    </Heading>
    <Hr />
    <Heading type="sub" mods={['centered']}>
      But they can also provide data / state / layout / styles etc..
    </Heading>
  </TitlePage>
);

uiConcept.story = {
  name: 'ui concept',
};

export const encapsulate = () => (
  <TitlePage>
    <Heading type="sub" mods={['centered']}>
      A well implemented UI concept should abstract/isolate
      <br />
      <strong>that particular concept and nothing else</strong>.
    </Heading>
    <Hr />
    <Heading type="sub" mods={['centered']}>
      Remember, if you abstract too much, it will likely result in complexity later.
    </Heading>
  </TitlePage>
);

encapsulate.story = {
  name: 'encapsulate',
};
