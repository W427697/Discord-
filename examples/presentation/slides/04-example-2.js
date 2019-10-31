import React from 'react';

import { CodePage, TitlePage } from '../components/page';
import Heading from '../components/heading';
import Hr from '../components/hr';

import * as Carousels from '../components/accordion/implementations';

const { items } = Carousels;

export default {
  title: 'Slides|examples',
};

export const moreUsecases = () => (
  <CodePage scope={{ Accordion: Carousels.Standard, items }}>{`
      <Accordion items={items} />
    `}</CodePage>
);

moreUsecases.story = {
  name: 'more usecases',
};

export const mooreUsecases = () => (
  <CodePage scope={{ Accordion: Carousels.Above, items }}>{`
      <Accordion items={items} above={true} />
    `}</CodePage>
);

mooreUsecases.story = {
  name: 'moore usecases',
};

export const moooreUsecases = () => (
  <CodePage scope={{ Accordion: Carousels.Right, items }}>{`
      <Accordion items={items} position="right" />
    `}</CodePage>
);

moooreUsecases.story = {
  name: 'mooore usecases',
};

export const pleaseStop = () => (
  <CodePage scope={{ Accordion: Carousels.SinglePreventClose, items }}>{`
      <Accordion
        items={items}
        position="below"
        single={true}
        preventClose={true}
        openTrigger="focus"
        closeTrigger="blur"
        titleClassName="acc-title"
        contentsClassName="acc-contents"
        onTrigger={() => {}}
        closeClassName="acc-closed"
        openClassName="acc-open"
        renderExpandAllButton={true}
      />
    `}</CodePage>
);

pleaseStop.story = {
  name: 'please stop',
};

export const alternative = () => (
  <CodePage scope={{ AccordionBottomSingle: Carousels.SinglePreventClose, items }}>{`
      <AccordionBottomSingle items={items} />
    `}</CodePage>
);

alternative.story = {
  name: 'alternative',
};
