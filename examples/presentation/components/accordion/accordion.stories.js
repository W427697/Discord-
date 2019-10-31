import { withNotes } from '@storybook/addon-notes';

import * as Carousels from './implementations';
import { withEditor } from '../../other/withEditor';

const { items } = Carousels;

export default {
  title: 'Components|Accordion',
  decorators: [withNotes, withEditor],

  parameters: {
    notes: { markdown: require('./readme.md') },
  },
};

export const moreUsecases = () => ({ Accordion: Carousels.Standard, items });

moreUsecases.story = {
  name: 'more usecases',
  parameters: {
    editor: `<Accordion items={items} />`,
  },
};

export const mooreUsecases = () => ({ Accordion: Carousels.Above, items });

mooreUsecases.story = {
  name: 'moore usecases',
  parameters: {
    editor: `<Accordion items={items} above={true} />`,
  },
};

export const moooreUsecases = () => ({ Accordion: Carousels.Right, items });

moooreUsecases.story = {
  name: 'mooore usecases',
  parameters: {
    editor: `<Accordion items={items} position="right" />`,
  },
};

export const pleaseStop = () => ({ Accordion: Carousels.SinglePreventClose, items });

pleaseStop.story = {
  name: 'please stop',
  parameters: {
    editor: `<Accordion
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
    />`,
  },
};

export const alternative = () => ({ AccordionBottomSingle: Carousels.SinglePreventClose, items });

alternative.story = {
  name: 'alternative',
  parameters: {
    editor: `<AccordionBottomSingle items={items} />`,
  },
};
